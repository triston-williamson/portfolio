---
title: "Watchfloor: AI Analyst Workbench for Air & Sea Monitoring"
summary: "Streams live ship (AIS) and aircraft (ADS-B) signals through Kafka into Snowflake, flags suspicious behaviour with six detectors, and has a Claude agent draft cited reports that a human approves. Measured with a 26-case evaluation: right call rose from 82.7% to 90.4%."
tags: ["Python", "Kafka", "Snowflake", "Claude API", "AI Agents", "Scikit-learn", "Plotly Dash", "Docker"]
date: 2026-11-22
demo: "https://watchfloor-demo.onrender.com/"
github: "https://github.com/triston-williamson/AI-analyst-workbench-for-air-and-sea-monitoring"
featured: true
---

**Personal project · Unclassified, public data only · November 2026**

## Overview
Watchfloor is an analyst workbench for maritime and air domain awareness. It ingests two live public sensor feeds over the Baltic Sea, about 700 messages a minute covering roughly 1,900 ships and 150 aircraft. It narrows that picture to the handful of tracks worth a person's attention, and explains each one with the exact sensor records behind it. An AI analyst agent drafts a cited report on any alert, and a human makes every decision.

**[Try the live demo](https://watchfloor-demo.onrender.com/)**. It is the real console, read-only, on six hours of recorded data. It runs on a free tier, so the first visit after a quiet spell can take about a minute to wake.

<figure class="wide">
  <img src="/images/watchfloor/console-overview.jpg" alt="The Watchfloor console: about 1,950 vessels and 75 aircraft over the Baltic coloured by type, undersea cables and pipelines overlaid, alert rings on the map, a system-health strip and the alert queue" width="1600" height="1000" loading="lazy" />
  <figcaption>The live picture: ships and aircraft coloured by type, undersea cables and pipelines, alert rings, a system-health strip and the ranked alert queue.</figcaption>
</figure>

## The problem
- **Too many tracks to watch.** No analyst can follow thousands of ships and aircraft at once.
- **What matters is rare.** Ships switching off their transponders, ship-to-ship transfers at sea and vessels idling over undersea cables are linked to sanctions evasion by the "shadow fleet" and to the 2023–24 Baltic cable and pipeline damage. They are buried in routine traffic.
- **AI has to be checkable.** A model that writes confident reports is only useful if every claim can be traced back to the data.

## What I built

### Live data pipeline
- Python producers stream ADS-B aircraft positions (OpenSky) and AIS ship transponder data (aisstream.io) into **Kafka**. Every message is validated with **Pydantic** at the trust boundary, and rejected messages go to a dead-letter topic with the reason, never dropped silently.
- A sink micro-batches the data into **Snowflake**, with separate schemas for raw evidence, current views and the system's own alerts and reports. Kafka offsets are committed only after a load succeeds, and every row keeps its raw message, so any derived value can be re-checked against what the sensor sent.

### Detection
- Five rule detectors: ships going dark, loitering, ship-to-ship meetings, aircraft circling, and **OFAC sanctions** matches against the US Treasury's list, screening every vessel seen in about 60 ms.
- An unsupervised **Isolation Forest** scores every track against the rest of the picture and explains each flag with robust z-scores, so a reviewer sees *why* a track stood out, not just a score.
- I tuned each detector on hours of live data, profiling the false positives and measuring each filter before adopting it. Ship meetings went from **129 alerts to 7**, ML anomalies from **43 to 2**, and loitering from **163 to 26**, with ships near undersea cables ranked first. Each change is pinned by a regression test.

<figure class="wide">
  <img src="/images/watchfloor/console-sanctions.jpg" alt="A cargo ship on the OFAC sanctions list sails south through the Øresund past Copenhagen; the alert explains the strong IMO match and that presence alone is not wrongdoing" width="1600" height="1000" loading="lazy" />
  <figcaption>A cargo ship on the OFAC sanctions list in normal transit through the Øresund. No behaviour rule would flag it, so the sanctions detector matches every vessel's identity against the list.</figcaption>
</figure>

### AI analyst agent
- A **Claude** agent investigates an alert on demand using read-only tools: track history, nearby vessels, identity, sanctions screening and the nearest undersea infrastructure. It drafts an intelligence-style report that keeps fact (Summary, Observations) separate from judgement (Assessment, Recommended action).
- A **grounding guardrail** rejects any factual sentence without a citation, or any citation to a record the agent was never given. A failing draft goes back once, and if it still fails it is stored *as failing*, never silently fixed.
- Ship names and other broadcast text are treated as data, never as instructions. Every agent and human action lands in a **hash-chained, tamper-evident audit log**.

<figure class="wide">
  <img src="/images/watchfloor/console-ai-reports-list.jpg" alt="The AI reports list in the console: a report on a sanctioned cargo ship with Summary, Observations, Assessment and Recommended action sections, each observation citing record IDs, and a Grounding PASSED badge" width="1600" height="1000" loading="lazy" />
  <figcaption>An AI report: every factual sentence cites the sensor records behind it, and the analyst still makes the decision.</figcaption>
</figure>

### Analyst console
- A **Plotly Dash** console with a live map, a ranked alert queue, evidence trails for each alert, replay, traffic-density and dark-activity heatmaps, an undersea infrastructure overlay and a system-health strip.
- Approve and Reject decisions are written to the database and the audit log.
- A **read-only public demo** runs the same console on an exported snapshot, in a **Docker** container on Render. Review and AI drafting are turned off there, both in the page and on the server.

<figure class="wide">
  <img src="/images/watchfloor/architecture.png" alt="Architecture: live feeds into producers with validation, then Kafka and a Snowflake sink; detection and the AI analyst read Snowflake and reference data; everything ends in the analyst console where a human approves or rejects, with every action in a hash-chained audit log" width="1344" height="1174" loading="lazy" />
  <figcaption>Architecture: every path ends at a human decision.</figcaption>
</figure>

## Evaluating the AI analyst
Passing the guardrail proves a report cites real records, not that it reached the right call. So I built an evaluation from **26 real alerts** with human-verified labels. It runs the agent end to end, and a separate Claude model judges whether each citation actually supports its sentence.

- **Baseline:** right call 82.7%, citation support 79.9%, grounding 100%, prompt-injection attacks resisted 4 of 4, at about $0.11 and 18 seconds per report.
- **What it exposed:** the agent escalated an ordinary airliner as a possible flight into Kaliningrad. I traced it to the data, not the model: **33% of stored aircraft records were stale repeats** of old positions, and the agent's tool hid altitude.
- **The fix:** I dropped stale positions at ingestion and gave the agent altitude, then re-measured. The false alarm disappeared and **right call rose to 90.4%**. I reported that about half of that gain is run-to-run variation, because a defensible number matters more than a bigger one.
- **Reading the outputs:** v1's score went up, but its reports described a climb that never happened. Only reading them caught it, and a second fix (v2) removed it.

## Challenges
- **Every detector was wrong on its first live run.** One produced 655 alerts in ten minutes from ships moored side by side in ports. A storm guard, versioned alerts that are retracted rather than deleted, and profiling from live data fixed it.
- **Test fakes can share your mistakes.** A scripted test passed while the real Claude tool runner would never have retried a failing draft. A live probe caught it, and I rewrote the fake to behave like the real runner.
- **Concurrency in the audit log.** Three processes writing at once forked the hash chain. The chain's own verification caught it. Writes now take a file lock, and the broken file was archived unchanged rather than repaired in place.

## Results
- A working pipeline from live sensors to an analyst's decision, with 182 automated tests, linting and secret scanning in CI.
- Detectors tuned from evidence on live data, with every alert explained and every AI claim traceable to a sensor record.
- An AI analyst measured with a labelled evaluation, improved by fixing the data rather than the prompt, with its limits written down: about 1 in 5 cited claims is only partly supported, and the evaluation set is small.

## Next steps
- Settle the sanctions escalation policy in the agent's prompt and measure it as an evaluation variant.
- Grow the evaluation set, including cases that should be escalated.
- Add a metrics page for alert precision, hallucination rate and ingestion lag over time.

**Tools:** Python · Kafka · Snowflake · Pydantic · Scikit-learn (Isolation Forest) · Claude API (Anthropic SDK) · Plotly Dash · Docker · Render · pytest · GitHub Actions
