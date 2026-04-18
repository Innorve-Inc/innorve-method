---
name: innorve-capability-graph
description: Use when a team or organization is starting to introduce AI into delivery work and needs an honest map of which SDLC phases have AI today, which don't, where humans must stay in the loop, and where the real capability gaps are. Coaches the user to produce a Capability Graph (Mermaid) and a Capability Map (text) covering all seven phases — Discover, Define, Build, Verify, Release, Operate, Learn.
---

# IM-06 — Capability Graph Thinking

A coaching skill, not a generator. You will not produce a graph for the user. You will walk them through producing one for themselves, using the seven-phase frame from the Innorve Method.

## What this skill does

It coaches the user through mapping their team or organization's current AI delivery capability across the seven SDLC phases the Innorve Method recognises:

1. **Discover** — research, problem framing, opportunity sizing
2. **Define** — requirements, design, scoping, architecture
3. **Build** — code, configuration, content
4. **Verify** — review, testing, evals, security checks
5. **Release** — change management, approvals, rollout
6. **Operate** — monitoring, incident response, drift detection
7. **Learn** — postmortems, retros, capability changes

For each phase, the user is asked the same four questions: what exists today, who owns it, where AI fits and where it doesn't, and what the gap is. The output is two artifacts the user can paste into a wiki, a board pack, or a planning doc.

## When to invoke it

Invoke this skill when:

- A team is getting started with AI-assisted delivery and there is no shared picture of where it actually helps.
- A leader is being asked "where are we using AI?" and has no defensible answer.
- A platform team is sequencing investment across the SDLC and wants to avoid building automation in phases where the bottleneck is elsewhere.
- An audit or risk function is asking which phases have human-in-the-loop controls.

Do not invoke it as a substitute for a strategy. It produces a map, not a roadmap. The roadmap comes from looking at the map honestly.

## Where it sits in the Innorve Method

IM-06 is the orientation step before any architectural commitment. It feeds:

- **IM-07 (Tenant-Aware Design)** — the posture decision is much easier once you can see which phases have to carry strict approval flows.
- **IM-08 (Multi-Tool Strategy)** — you cannot pick models and frameworks per skill until the skills themselves are listed.
- **IM-04 (Policy-as-Code)** and **IM-05 (Maturity Gate)** — both consume the Capability Map as their input list.

Run IM-01 through IM-05 first if the user has not yet defined what a "skill" is in their environment. IM-06 assumes the user already understands the skill-as-unit-of-work framing.

## The coaching flow

Drive the conversation. Use `AskUserQuestion` for each step. Do not move on until the user has actually answered.

1. **Set the frame.** Confirm with the user that they want to produce a Capability Graph for a specific scope (a team, a product line, a department). Write the scope down. A graph that covers "the whole company" is almost always wrong on first pass — push them to narrow.

2. **Walk the seven phases in order.** For each phase, ask:
   - What capabilities exist today? (List them.)
   - Who owns each capability? (A team, a person, a vendor, "nobody".)
   - Where does AI fit today, and where would it fit next? (Be specific — "Claude reviews PRs against a checklist" not "we use AI for code review".)
   - Where must a human stay in the loop, and why? (Regulatory, ethical, irreversibility, judgment calls.)
   - What is the gap? (Capability missing entirely, capability present but unowned, capability present but unmeasured.)

3. **Force naming.** Each capability gets a short name in `kebab-case`. This is non-negotiable — the names will be reused in IM-08 when picking tools per skill.

4. **Render the graph.** Once all seven phases are filled, ask the user to produce a Mermaid `flowchart LR` showing phases as columns and capabilities as nodes. Edges go from upstream phases to downstream phases where there is a real handoff. Colour or annotate nodes by AI / Human / Hybrid ownership. Do not draw it for them — let them produce it. Review it together.

5. **Render the map.** Ask the user to produce a parallel text document with one row per capability listing: name, phase, owner, AI-vs-human classification, gap notes.

6. **Honesty pass.** Ask: "Is this map flattering or accurate?" Most first drafts are flattering. Push for at least three honest gaps in writing.

## The artifact produced

Two files, produced by the user, conforming to the **Capability Graph Format v0.1** spec at `innorve.academy/spec/capability-graph`:

- `capability-graph.mmd` — Mermaid `flowchart LR` showing the seven phases and the capabilities inside each, with ownership annotations.
- `capability-map.md` — a text companion with one section per phase and a row per capability (name, owner, AI/Human/Hybrid, gap notes, status).

Both files belong in the team's repo or wiki, not in chat. They are versioned. They are reviewed quarterly.

## Worked examples

**Banking — community bank loan origination team (regulated tenant).**
Discover phase: market research is mostly manual; one analyst, no AI. Define phase: credit policy is human-only and must stay that way (regulator expectation). Build phase: document templates are AI-drafted, human-edited. Verify phase: model risk review is human-only. Release phase: approvals are human-only with a logged sign-off. Operate phase: drift monitoring is missing entirely (gap). Learn phase: SAR feedback loop is informal (gap). The map exposes that the team's biggest AI opportunity is Discover and Build, but the biggest unowned risk is Operate.

**Healthcare — provider group revenue cycle team (regulated tenant).**
Discover and Define are heavy on manual chart review. Build phase has AI-assisted coding suggestions but no eval harness. Verify is the bottleneck — coders re-check everything. Release flows through a billing system the team does not own. Operate has alerting but no drift detection. The graph makes it obvious that investing more in Build without fixing Verify just produces faster-to-arrive errors.

**SaaS — mid-stage product team (startup tenant).**
Discover uses AI for user-research synthesis. Define is informal. Build has Claude in the IDE. Verify has an eval suite for one feature, nothing for the rest. Release is "merge to main, ship". Operate is reactive. Learn is a Friday Slack thread. The map tells the founder that the team has over-invested in Build and under-invested in Verify and Operate — a typical Year 2 pattern.

## Common pitfalls

- **Drawing the graph before listing capabilities.** Diagrams produced first are aspirational. List, then draw.
- **Treating "we use Copilot" as a capability.** A tool is not a capability. The capability is what the tool does in your context — e.g., `pr-checklist-review`.
- **Skipping Operate and Learn.** These are where most teams have nothing, and where most regulators look first.
- **Conflating AI with autonomous AI.** AI-assisted capabilities still have a human owner. Mark them Hybrid, not AI.
- **Producing a graph that has no gaps.** Either you scoped too narrowly or you are not being honest. Push back.

## Next step

Once the Capability Graph and Map are committed, move to **IM-07 (Tenant-Aware Design)** to choose the posture that matches the environment, then **IM-08 (Multi-Tool Strategy)** to pick the model + framework + deployment combination per capability.

## Further reading

- Capability Graph Format v0.1 — `innorve.academy/spec/capability-graph`
- IM-04 — Policy-as-Code (consumes the Capability Map as its input list)
- IM-05 — Maturity Gate (uses the Capability Map to score phase-by-phase readiness)

## Why this matters

Teams introduce AI without knowing what they already have. They optimise the most visible phase — usually Build — and leave Verify, Release, and Operate as silent risks. A Capability Graph forces the conversation to happen on paper, with names, before any architecture commitment is made. It is cheap. It is reviewable. It is the cheapest insurance you can buy against shipping the wrong automation into the wrong phase.

## What this is NOT

- Not a roadmap. It maps current state and gaps; sequencing is a separate exercise.
- Not a tool inventory. Tools live inside capabilities; the graph names capabilities.
- Not a maturity model. Scoring belongs in IM-05.
- Not a one-time artifact. It is reviewed quarterly. A stale graph is worse than no graph.
- Not a replacement for the user thinking. The skill coaches; the user produces.
