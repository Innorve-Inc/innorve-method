---
name: innorve-capability-graph
description: Use when a team or organization is starting to introduce AI into delivery work and needs an honest map of which SDLC phases have AI today, which do not, where humans must stay in the loop, and where the real capability gaps are. Coaches the user to produce a Capability Graph (Mermaid) and a Capability Map (text) covering all seven phases — Discover, Define, Build, Verify, Release, Operate, Learn.
---

# IM-06 — Capability Graph Thinking

> *Decompose the work before you call a model; express the policy before the system grows past one user.*

## What this skill does

It coaches the user through mapping their team or organization's current AI delivery capability across the seven SDLC phases the Innorve Method recognises. For each phase the user is asked the same four questions: what exists today, who owns it, where AI fits and where it does not, and what the gap is. The output is two artifacts the user can paste into a wiki, a board pack, or a planning doc.

This is a coaching skill, not a generator. You will not produce a graph for the user. You will walk them through producing one for themselves.

## When to invoke it

Invoke this skill when:

- A team is getting started with AI-assisted delivery and there is no shared picture of where it actually helps.
- A leader is being asked "where are we using AI?" and has no defensible answer.
- A platform team is sequencing investment across the SDLC and wants to avoid building automation in phases where the bottleneck is elsewhere.
- An audit or risk function is asking which phases have human-in-the-loop controls.

Do not invoke it as a substitute for a strategy. It produces a map, not a roadmap. The roadmap comes from looking at the map honestly.

## Where it sits in the Innorve Method

IM-06 is the orientation step before any architectural commitment. It feeds:

- **IM-07 (Tenant-Aware Design)** — the posture decision is much easier once you can see which phases must carry strict approval flows.
- **IM-08 (Multi-Tool Strategy)** — you cannot pick models and frameworks per skill until the skills themselves are listed.
- **IM-04 (Policy-as-Code)** and **IM-05 (Maturity Gate)** — both consume the Capability Map as their input list.

Run IM-01 through IM-05 first if the user has not yet defined what a "skill" is in their environment. IM-06 assumes the user already understands the skill-as-unit-of-work framing.

## The coaching flow

Drive the conversation. Use `AskUserQuestion` for each step. Do not move on until the user has actually answered.

1. **Set the frame.** Confirm with the user that they want to produce a Capability Graph for a specific scope (a team, a product line, a department). Write the scope down. A graph that covers "the whole company" is almost always wrong on first pass — push them to narrow.

2. **Walk the seven phases in order.** For each phase, ask:
   - **Discover** — research, problem framing, opportunity sizing
   - **Define** — requirements, design, scoping, architecture
   - **Build** — code, configuration, content
   - **Verify** — review, testing, evals, security checks
   - **Release** — change management, approvals, rollout
   - **Operate** — monitoring, incident response, drift detection
   - **Learn** — postmortems, retros, capability changes

   For each phase, work through:
   - What capabilities exist today? (List them.)
   - Who owns each capability? (A team, a person, a vendor, "nobody".)
   - Where does AI fit today, and where would it fit next? (Be specific — `pr-checklist-review` not "we use AI for code review".)
   - Where must a human stay in the loop, and why? (Regulatory, ethical, irreversibility, judgment calls.)
   - What is the gap? (Capability missing entirely, capability present but unowned, capability present but unmeasured.)

3. **Force naming.** Each capability gets a short name in `kebab-case`. This is non-negotiable — the names will be reused in IM-08 when picking tools per skill, and in IM-02 when writing skill contracts.

4. **Render the graph.** Once all seven phases are filled, ask the user to produce a Mermaid `flowchart LR` showing phases as columns and capabilities as nodes. Edges go from upstream phases to downstream phases where there is a real handoff. Colour or annotate nodes by AI / Human / Hybrid ownership. Do not draw it for them — let them produce it. Review it together.

5. **Render the map.** Ask the user to produce a parallel text document with one row per capability listing: name, phase, owner, AI-vs-human classification, gap notes.

6. **Honesty pass.** Ask: "Is this map flattering or accurate?" Most first drafts are flattering. Push for at least three honest gaps in writing.

## Inputs

The skill asks the user for:

- A named scope (a team, a product line, a department — not "the whole company").
- A list of capabilities per phase (in the user's own words, then normalised to `kebab-case`).
- An owner per capability (named team, named person, named vendor, or the explicit string "nobody").
- An AI / Human / Hybrid classification per capability.
- A gap statement per phase.
- A named human who owns the Capability Graph itself.

## Outputs

The skill produces, by the user's hand:

- A Capability Graph diagram (Mermaid).
- A Capability Map document (Markdown).
- A list of at least three honest, written-down gaps.
- A named owner of the artifact.
- A quarterly review date.

## The artifact produced

Two files, produced by the user, conforming to the **Capability Graph Format v0.1** spec at `innorve.academy/spec/capability-graph`:

- `capability-graph.mmd` — Mermaid `flowchart LR` showing the seven phases and the capabilities inside each, with ownership annotations.
- `capability-map.md` — a text companion with one section per phase and a row per capability (name, owner, AI/Human/Hybrid, gap notes, status).

Both files belong in the team's repo or wiki, not in chat. They are versioned. They are reviewed quarterly.

## Quality rubric

A Capability Graph is ready for review when all of the following are true:

| Criterion | Pass condition |
|-----------|----------------|
| Scope | Named to a team, product, or department — not the whole company |
| Coverage | All seven phases populated, including Operate and Learn |
| Naming | Every capability has a `kebab-case` name reusable in IM-08 |
| Ownership | Every capability has a named owner or the explicit string "nobody" |
| Honesty | At least three gaps written down |
| Specificity | No "we use AI for X" lines; every AI capability cites the actual unit of work |
| Renderability | Mermaid file renders without syntax errors |
| Reviewability | Owner and review date present in the Capability Map header |

## Failure mode checklist

Before the user commits the artifact, check:

- [ ] The graph has at least one node marked Hybrid (most teams have many; zero is suspicious).
- [ ] Operate and Learn each have at least one named gap.
- [ ] No phase is empty.
- [ ] No capability collapses to a tool name (e.g., "Copilot", "ChatGPT").
- [ ] The owner field is never blank — "nobody" is allowed; blank is not.
- [ ] The honesty pass produced changes; if nothing changed, the pass was not done.

## Regulated environment extension

In regulated environments (banking, healthcare, public sector, EU AI Act high-risk systems), extend the Capability Map with three additional columns per row:

- **Regulatory hook** — the framework or rule that touches this capability (BSA/AML, HIPAA, PCI DSS, EU AI Act Annex III, NIST AI RMF function).
- **Human-in-the-loop requirement** — required, optional, prohibited.
- **Evidence retention period** — calendar duration, with the system of record.

A regulated Capability Map without these columns is incomplete. The columns become inputs to the IM-07 Tenant Posture Card and the IM-03 Evidence Binder.

## Public portfolio instruction

If the user is producing this artifact on non-confidential work, encourage them to publish a sanitised copy:

1. Strip tenant-identifying details (names, internal team labels, customer references).
2. Keep the seven-phase structure, the capability names, the ownership classifications, and the gap statements.
3. Publish under `/method-portfolio/capability-graphs/<scope>.md` in their public repository, or as a gist.
4. Tag with `#innorve-method #IM-06`.
5. Submit the link to the Innorve Academy free community for peer review.

This is how an architect demonstrates Mode practice with evidence — see the Innorve Architect Ladder.

## Worked examples

**Banking — a regional credit union loan origination team (regulated tenant).**
Discover phase: market research is mostly manual; one analyst, no AI. Define phase: credit policy is human-only and must stay that way (regulator expectation). Build phase: document templates are AI-drafted, human-edited. Verify phase: model risk review is human-only. Release phase: approvals are human-only with a logged sign-off. Operate phase: drift monitoring is missing entirely (gap). Learn phase: SAR feedback loop is informal (gap). The map exposes that the team's biggest AI opportunity is Discover and Build, but the biggest unowned risk is Operate.

**Healthcare — a provider group revenue cycle team (regulated tenant).**
Discover and Define are heavy on manual chart review. Build phase has AI-assisted coding suggestions but no eval harness. Verify is the bottleneck — coders re-check everything. Release flows through a billing system the team does not own. Operate has alerting but no drift detection. The graph makes it obvious that investing more in Build without fixing Verify just produces faster-to-arrive errors.

**SaaS — a mid-stage product team (startup tenant).**
Discover uses AI for user-research synthesis. Define is informal. Build has Claude in the IDE. Verify has an eval suite for one feature, nothing for the rest. Release is "merge to main, ship". Operate is reactive. Learn is a Friday Slack thread. The map tells the founder that the team has over-invested in Build and under-invested in Verify and Operate — a typical Year 2 pattern.

## Common pitfalls

- **Drawing the graph before listing capabilities.** Diagrams produced first are aspirational. List, then draw.
- **Treating "we use Copilot" as a capability.** A tool is not a capability. The capability is what the tool does in your context — for example, `pr-checklist-review`.
- **Skipping Operate and Learn.** These are where most teams have nothing, and where most regulators look first.
- **Conflating AI with autonomous AI.** AI-assisted capabilities still have a human owner. Mark them Hybrid, not AI.
- **Producing a graph that has no gaps.** Either you scoped too narrowly or you are not being honest. Push back.
- **Letting the graph go stale.** A Capability Graph that has not been reviewed in a year describes a team that no longer exists.

## Innorve Native Mode tenets this skill operationalizes

- **Tenet 1 — Architect before automating.** The graph is the architecture. Until the work is decomposed into named, owned capabilities, no model should be summoned to do any of it.
- **Tenet 3 — Govern before scaling.** The map exposes which capabilities have no owner and which phases have no controls — the conditions under which scaling produces incidents rather than throughput.

## Next step

Once the Capability Graph and Map are committed, move to **IM-07 (Tenant-Aware Design)** to choose the posture that matches the environment, then **IM-08 (Multi-Tool Strategy)** to pick the model + framework + deployment combination per capability.

## Further reading

- Innorve Method index — `https://innorve.academy/method#im-06`
- Capability Graph Format v0.1 — `https://innorve.academy/spec/capability-graph`
- NIST AI RMF 1.0 — Govern / Map / Measure / Manage functions
- ISO/IEC 42001 — AI management system requirements

## Why this matters

Teams introduce AI without knowing what they already have. They optimise the most visible phase — usually Build — and leave Verify, Release, and Operate as silent risks. A Capability Graph forces the conversation to happen on paper, with names, before any architecture commitment is made. It is cheap. It is reviewable. It is the cheapest insurance an architect can buy against shipping the wrong automation into the wrong phase.

## What this is NOT

- Not a roadmap. It maps current state and gaps; sequencing is a separate exercise.
- Not a tool inventory. Tools live inside capabilities; the graph names capabilities.
- Not a maturity model. Scoring belongs in IM-05.
- Not a one-time artifact. It is reviewed quarterly. A stale graph is worse than no graph.
- Not a replacement for the user thinking. The skill coaches; the user produces.

---

If you find yourself wishing for a peer who could review your Capability Graph before you defend it to a CISO, a regulator, or a board — that is what Cohort 1 of the Innorve Academy bootcamp is for. Apply at `https://innorve.academy/apply`.
