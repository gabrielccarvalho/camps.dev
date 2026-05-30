---
title: "Study App"
description: "A platform to gamify your study sessions. Log hours and compete with your friends in a fun way."
date: "2026-01-18"
author: "Gabriel Carvalho"
authorImage: "/authors/gabriel-carvalho.jpeg"
liveUrl: "https://study.app.br/"
cover: "/projects/study-app.png"
tags: ["Next.js", "React", "AI", "Node", "Postgres"]
stack: ["Next.js", "React", "AI", "Node", "Postgres"]
---

Study App makes studying social. You log the hours you put in, and those hours turn
into progress you can compare with friends — turning a solitary grind into something
closer to a game.

## The problem

Motivation is the hard part of studying, not information. Plenty of apps help you take
notes; very few help you keep showing up. Study App is aimed squarely at the second
problem.

## The loop

Log a session, earn progress, see where you stand against the people you study with.
The loop is intentionally simple so the reward is immediate.

### Friendly competition

Leaderboards are scoped to friends rather than strangers, which keeps the competition
encouraging instead of demoralizing.

### Streaks and nudges

Consistency beats intensity, so the app rewards showing up daily and gently nudges you
when a streak is about to break.

## Building it

A Postgres-backed Node service tracks sessions and standings, and the Next.js client
keeps the whole thing snappy enough to log a session in seconds.
