---
title: "Mass Aggregator"
date: 2026-08-07
permalink: /blog/mass-aggregator/
layout: post.njk
tags: [projects]
---

Last weekend I built [Mass Aggregator](https://masstimes.christopherjagoe.com) — Catholic Mass times on a map. It started as a quick proof of concept covering four parishes in Westerly, RI, and by the end of the weekend it had grown into a scraper covering the entire Diocese of Providence: 163 churches, 601 Mass times, plus confession and adoration hours.

The feature I'm most proud of is the route-based Mass finder. Every Mass-times site I know of searches a radius around a single point. Mass Aggregator instead takes an origin, a destination, and how many minutes you're willing to detour — and shows you the Masses you can attend *along your drive*, in order, with your estimated arrival time at each church.

Under the hood:

- **PostgreSQL + PostGIS** (Supabase in production) for the church data, radius queries, and route corridors
- **FastAPI** backend with **Python** scrapers (httpx + selectolax, one adapter per parish and diocese site)
- **Next.js + TypeScript** frontend with **MapLibre GL** for the map
- **OSRM** for routing — a PostGIS corridor finds candidate churches, then OSRM's Table API computes the real driving-time detour for each one
- Deployed end-to-end on free tiers: Vercel (frontend), Render (API), Supabase (database)

Being honest with myself: I've let it lapse. It was built and deployed in about two days, the site is still up, but I haven't touched the code since — the Phase 2 plans (a feedback form, admin overrides, a regular scraper refresh cycle) are deferred, not abandoned. Maybe writing about it here is the nudge.

[← Back to Blog](/blog/)
