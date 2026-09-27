---
title: "Catechism in a Year, Personal App Edition"
date: 2026-09-20
permalink: /blog/catechism-in-a-year/
layout: post.njk
tags: [projects]
---

\[AI-Generated Post\]

I've been reading the Catechism of the Catholic Church on a 365-day plan (paragraphs 1–2865, following the *Catechism in a Year* reading order). The existing apps didn't quite fit how I wanted to read, so I built my own — a personal iPhone reader that lives as a home-screen widget plus a full-screen reading app.

It's built on [Scriptable](https://scriptable.app): a single ~860-line JavaScript file that runs in two modes. As a widget it shows today's section, my progress, and whether I'm on schedule. As a full-screen reader it shows the day's paragraphs with inline footnote citations, cross-references as overlays, a jump-to-day picker, adjustable font size, and light/dark themes. The full catechism text — all 2,865 paragraphs, scraped from vatican.va — is baked into the data files, so it works entirely offline.

The build pipeline is deliberately dependency-free: Python standard library only, zero pip installs. My favorite hack: the reading-plan tracker is an Excel file, and rather than pulling in a spreadsheet library, the script unzips the .xlsx and parses the raw OOXML with the standard library.

A few implementation details I'm happy with:

- A WebView-to-native bridge via `app://` URL navigation — the reader marks days read by "navigating" to `app://markread`, which the script side intercepts and writes to a shared state file
- A watchdog that detects when iOS has evicted the web content process (which leaves a blank reader) and reloads the current day, restoring the scroll position
- Progress is a pointer, not a calendar — missing days never skip content; I just catch up in order, and the widget tells me how far behind (or ahead) I am
- An offline test harness (Node) that stubs the whole Scriptable API surface and runs 70 checks against the real script

It stays a personal app — the catechism text is copyright Libreria Editrice Vaticana, so the data is private-use only — but building exactly the tool I wanted, with zero dependencies and a little test harness, was the point.

[← Back to Blog](/blog/)
