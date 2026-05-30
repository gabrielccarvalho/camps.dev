---
title: "Zimo"
description: "A personal assistant on WhatsApp that keeps track of all your finances, meetings, and schedule — right inside your chats."
date: "2026-04-10"
author: "Gabriel Carvalho"
authorImage: "/authors/gabriel-carvalho.jpeg"
liveUrl: "https://zimo.com.br/"
cover: "/projects/zimo.png"
tags: ["Next.js", "React", "AI"]
stack: ["Next.js", "React", "AI"]
---

Zimo lives where people already are — their WhatsApp inbox. Instead of asking anyone to
install yet another app, it turns the chat they use all day into a personal assistant
that tracks money, meetings, and the day ahead.

## The problem

Most finance and scheduling tools fail at the first step: getting someone to open them.
A new app is a new habit, and new habits rarely stick. The insight behind Zimo was to
remove that step entirely and meet users inside a conversation they never close.

## How it works

You message Zimo like you'd message a friend. It parses intent from natural language,
keeps a running picture of your finances and calendar, and replies with summaries,
reminders, and nudges.

### Understanding messages

Incoming messages are classified and routed before anything else happens — an expense,
a meeting, a question. Structured data is extracted from free-form text so the rest of
the system can work with clean records.

### Keeping state

Every interaction updates a per-user ledger and schedule, so follow-up questions like
"how much did I spend on food this week?" resolve against real history rather than a
single message.

## What I learned

Building on top of a channel you don't own means designing around its limits — message
formats, rate limits, delivery quirks. The constraint turned out to be a feature: it
forced a focus on doing a few things conversationally well.
