---
title: "Adviso"
description: "An AI-focused tool to analyze and improve your ad campaigns across social media — Facebook, Instagram, TikTok, Google Ads, and many more."
date: "2026-03-02"
author: "Gabriel Carvalho"
authorImage: "/authors/gabriel-carvalho.jpeg"
liveUrl: "https://adviso.com.br/"
cover: "/projects/adviso.png"
tags: ["Next.js", "Fastify", "OpenAI", "Postgres", "AI"]
stack: ["Next.js", "React", "Fastify", "Prisma", "Neon Postgres", "OpenAI GPT-4o", "Pinecone", "Langfuse", "Stripe"]
---

Adviso started from a simple frustration: ad platforms are great at *showing* you numbers
and terrible at *answering* questions about them. You can see that a campaign is bleeding
budget — you just can't ask it why, or what to do instead. Adviso connects to the
platforms a business already runs on, pulls their numbers into one place, and lets you
ask about them in plain language. The answer comes back grounded in your real data, not
a guess.

## The problem

A marketer opens Meta Ads Manager and is met with forty columns and a dozen breakdowns.
The data is all there; the *answer* isn't. Spotting that a campaign underperforms is
easy. Understanding *why* — which audience, which placement, which creative — means
exporting to a spreadsheet, building a pivot table, and squinting. By the time the
picture is clear, the budget is already spent.

It gets worse across platforms. Facebook, Google, and TikTok describe the same ideas
with different names, different shapes, and different quirks. Comparing them means doing
the normalization in your head.

Adviso's bet is that the right interface for this isn't another dashboard — it's a
conversation. Ask "which audience wasted the most budget last week?" and get a real
answer, computed from your actual numbers.

## The shape of the system

Adviso is a Turborepo monorepo with two apps and a couple of shared packages. A **Next.js
15** web app (App Router, React 19) is the product surface; a **Fastify** API is the
back office. Both are TypeScript end to end, data lives in **Neon** serverless Postgres
through **Prisma**, and the whole thing runs on Vercel.

The split is along responsibility. The Fastify API owns the boring-but-critical work:
OAuth with the ad platforms, ingesting and normalizing campaign data, projects and team
membership, Stripe webhooks. The Next.js app owns the dashboards, the charts, and the AI
chat — and it's where the analysis actually runs, close to the user and to the response
stream.

## Getting the data in

Before anything smart can happen, the numbers have to land in a shape you can query.
Adviso's deepest integration today is Meta (Facebook and Instagram): it calls the Graph
API's `insights` endpoint with the fields, breakdowns, and time range a report asks for.

The catch is that Meta's response is awkward. Plain metrics like spend and impressions
come back flat, but conversions arrive as nested `actions` arrays — a list of
`{ action_type, value }` objects buried inside each row. Left like that, they can't be
charted or summed. So ingestion flattens them into typed columns:

```ts
// Meta returns conversions as nested `actions` arrays — flatten them into
// flat, numeric columns the database can hold and SQL can sum over.
Object.fromEntries(
  Object.entries(row).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((action) => [
        `${snakeToCamel(key)}_${snakeToCamel(action.action_type)}`, // → actions_purchase
        parseFloat(action.value),
      ])
    }
    if (!stringValues.includes(key)) return [[key, parseFloat(value)]]
    return [[key, value]]
  })
)
```

A `purchase` action becomes an `actions_purchase` column, a `lead` becomes
`actions_lead`, and everything numeric is coerced from Meta's strings. Each row is then
validated with Zod before it touches the database:

```ts
const data = z.array(insightsDataSchema).parse(insightsDataResponse)
```

What lands is a single wide `InsightsData` table — close to ninety columns covering
spend, reach, clicks, video views, and every conversion type, alongside the breakdowns
(age, gender, country, device, placement). One schema, deliberately built so a second or
third platform can be *mapped onto* the same columns rather than bolted on beside them.
A cron job re-runs each report's query on a schedule, so the numbers stay current without
anyone clicking refresh.

## Turning numbers into answers

This is the part I cared about most. The naïve version of an "AI analyst" dumps a pile
of metrics into a prompt and hopes the model adds them up correctly. It won't — language
models are bad at arithmetic over long tables, and a report can hold thousands of rows.
So Adviso doesn't ask the model to *be* the database. It asks the model to *query* it.

When you send a message, the Next.js `/api/chat` route compiles a system prompt — managed
in **Langfuse**, with the report's id, columns, and date range interpolated — and streams
a **GPT-4o** response with two tools available:

```ts
const result = streamText({
  model, // gpt-4o, via the Vercel AI SDK
  toolCallStreaming: true,
  tools: {
    getContextFromPinecone: getContextFromPineconeTool({ dataStream, trace }),
    getDataFromDatabase: getDataFromDatabaseTool({
      columns, reportId, dateRange, userId, dataStream, trace,
    }),
  },
  experimental_transform: smoothStream(),
  messages: [...systemPrompt, ...messages],
  maxSteps: 4,
})
```

`getContextFromPinecone` does retrieval — it pulls domain context about ad metrics from a
**Pinecone** vector index, so the model understands what it's looking at (what a healthy
ROAS is, what a given conversion type means). `getDataFromDatabase` is the interesting
one. Given a refined version of your question, it:

1. fetches relevant context from Pinecone,
2. asks GPT-4o to write a SQL query — a second Langfuse prompt, `generate-sql-query`,
   pointed at the `InsightsData` schema,
3. runs it, and
4. hands the rows back to the main model, which turns them into a sentence you can act on.

`maxSteps: 4` lets the model chain these — retrieve, query, maybe query again, then
answer. The whole exchange streams, and each step writes annotations (`tool-status`, the
generated `query`, the `relevant_data`) so the UI can show its work: you see the SQL it
wrote, formatted and syntax-highlighted, right next to the answer.

## Letting a model write SQL — safely

Handing an LLM a database connection should make you nervous. A generated query is still
untrusted input, and "write SQL against the database" is one prompt-injection away from a
bad day. Adviso keeps the blast radius small with a hard rule: the model's queries are
read-only, enforced before anything runs.

````ts
const q = query.replaceAll("```sql", "").replaceAll("```", "").trim().toLowerCase()
const forbidden = ["drop", "delete", "insert", "alter", "truncate", "create", "grant", "revoke"]

if (!q.startsWith("select") || forbidden.some((kw) => q.includes(kw))) {
  return "Invalid query"
}

const { rows } = await db.query(normalizedQuery) // read path only
````

It's a `SELECT`-only gate plus a denylist of mutating keywords — not a replacement for a
locked-down read-only database role, but a firm guardrail at the application layer. And
the query only ever runs against a schema that holds ad metrics, so there's nothing
sensitive to reach even on a clean `SELECT`. Null columns are stripped from the result
before it goes back to the model, which keeps the context lean and the final answer
focused on the numbers that actually exist.

## The rest of the machine

None of the following is the headline, but together it's what makes Adviso a product
rather than a demo:

- **Auth & teams** — JWT sessions via `@fastify/jwt`, bcrypt for passwords, and OAuth
  with GitHub, Google, and Meta. Inside a project, a CASL ability model separates what an
  `ADMIN` can do from a `MEMBER`, so you can invite collaborators safely.
- **Billing** — Stripe subscriptions on a credit model. Creating a report and sending a
  chat message each debit credits, with `FREE` and `PRO` tiers and on-demand top-ups.
- **Observability** — every model call is traced in Langfuse, which doubles as the prompt
  store. That means prompts can be tuned without a deploy, and the cost and latency of the
  AI features are always visible.
- **Exports & automation** — a report can sync to Google Sheets on a daily, weekly, or
  monthly schedule for the people who still live in spreadsheets.

## What I learned

The instinct with an AI feature is to give the model *more* — more context, more data,
more freedom. Adviso got better every time I gave it *less*: a narrow schema, a read-only
path, a tool that returns rows instead of prose. The model is at its best as a
translator — turning a question into SQL, and a table back into a sentence — and at its
worst as a calculator. Designing around that line was the whole trick.

The other lesson was about trust. Showing the query — the actual SQL, right there in the
chat — did more for credibility than any amount of polish. People believe an answer they
can check.
