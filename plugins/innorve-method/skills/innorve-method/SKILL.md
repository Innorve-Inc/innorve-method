---
name: innorve-method
description: Use when the user asks about the Innorve Method, asks "where do I start" with AI-native architecture, references IM-01 through IM-08, mentions the Innorve Architect Ladder, or wants to know which Innorve skill to invoke for their current situation. This is the meta index — invoke it first when the path forward is unclear.
---

# Innorve Method (IM-00) — The Index

## What this skill does

Indexes the eight teaching frameworks of the Innorve Method and helps the engineer pick the right one for where they actually are. It does not architect your system. It tells you which of IM-01 through IM-08 to invoke next, and why.

## When to invoke it

- The user says "Innorve Method" or "/innorve-method" without naming a specific framework.
- The user has read about the Method but does not know which skill to start with.
- The user is mid-build and wants a sanity check on whether they are working on the right layer.
- A teammate joins the project and needs the on-ramp.

## Where it sits in the Innorve Method

IM-00 is the table of contents. Every other framework (IM-01 through IM-08) assumes you arrived through here or already know the map. If you are not sure which skill to use, you are in the right place.

## The eight frameworks

| Code | Skill | One-line summary |
|------|-------|------------------|
| IM-01 | `innorve-skill-architecture` | Decompose work into reusable, testable, composable AI skills. |
| IM-02 | `innorve-policy-as-code` | Translate governance rules from prose into version-controlled policy code. |
| IM-03 | `innorve-skill-contract` | Define the input/output/failure contract a skill must satisfy before it ships. |
| IM-04 | `innorve-tenant-aware` | Make a skill safe to run across multiple tenants without leaking data or context. |
| IM-05 | `innorve-multi-tool` | Compose tools and skills into a coherent agent loop with a stop condition. |
| IM-06 | `innorve-capability-graph` | Map the skills, policies, and tools you have into a single dependency graph. |
| IM-07 | `innorve-evidence-binder` | Produce the auditable trail an examiner, regulator, or risk team will ask for. |
| IM-08 | `innorve-maturity-gate` | Score the system against the Innorve Architect Ladder and decide whether to ship. |

## The decision tree

Walk this out loud with the user. Do not skip steps.

1. **Are you starting a new system, or adding to an existing one?**
   - New system → IM-01.
   - Existing system → continue.

2. **Do you have a working prototype that runs end-to-end at least once?**
   - No → IM-01 (you need a skill graph before you keep building).
   - Yes → continue.

3. **Is your blocker that the system is unsafe to ship — leaks, missing approvals, no audit trail?**
   - Leaks across tenants or users → IM-04.
   - Missing approval gates or governance → IM-02.
   - Missing audit trail → IM-07.

4. **Is your blocker that the agent loop is unreliable — wrong tool, wrong order, never stops?**
   - → IM-05.

5. **Is your blocker that you cannot tell what the system is supposed to guarantee?**
   - → IM-03.

6. **Is your blocker that you have many skills and no map?**
   - → IM-06.

7. **Is your blocker "is this good enough to put in front of the risk committee"?**
   - → IM-08.

If you cannot answer step 1, ask the user. $ASK: *"Are you starting a new system or extending one that already runs?"*

## The Innorve Architect Ladder (L0-L5)

Every Innorve Method engagement scores the team against the same six rungs. IM-08 formalizes the scoring; the other frameworks each push you up a specific rung.

- **L0 — Prototype.** Code runs once on the author's laptop. No contracts, no policy, no tenancy.
- **L1 — Skilled.** Work is decomposed into skills with names. Each skill has an owner. (IM-01.)
- **L2 — Contracted.** Each skill has a written contract: inputs, outputs, failure modes, idempotency. (IM-03.)
- **L3 — Governed.** Policies are code, not prose. Approvals, redaction, retention, and routing are enforced by the runtime. (IM-02, IM-04.)
- **L4 — Composed.** A capability graph exists. The agent loop is bounded. The system is reproducible. (IM-05, IM-06.)
- **L5 — Auditable.** Every decision the system made can be reconstructed for an examiner without engineering involvement. (IM-07, IM-08.)

A team that ships at L2 is faster than one stuck at L0. A team that needs to pass an audit ships at L5 or it does not ship.

## The coaching flow

1. Greet the user briefly. Do not summarize the whole Method.
2. $ASK: *"In one sentence, what are you trying to do today?"*
3. Walk the decision tree above against their answer. Be concrete: name the framework, name the rung, name the artifact.
4. If the user is on the wrong rung for the question they are asking, say so. Example: "You are asking an L4 composition question, but your skills do not have contracts yet. Start with IM-03."
5. Confirm the recommendation with the user before handing off.
6. Tell them which Skill to invoke next and what artifact they will produce when they finish.

## The artifact produced

A short **Method Recommendation** of the form:

```
Recommendation: IM-0X (skill-name)
Current rung: L?
Target rung after this skill: L?
Why: <one sentence>
Next skill after that: IM-0Y
```

The user pastes this into their planning doc. If they cannot articulate why the recommendation makes sense, repeat step 4 of the coaching flow.

## Worked examples

### Example 1 — A regional credit union with 200K members building an internal SAR triage agent

The team has a Python notebook that drafts a Suspicious Activity Report narrative when fed an alert. It works on the author's laptop. They want to "make it production."

**Recommendation:** IM-01 (skill-architecture). They are at L0. The notebook is one undifferentiated blob. Before contracts, policy, or tenancy, they need to decompose it into named skills (alert intake, narrative drafting, SAR file assembly, FinCEN submission) with explicit boundaries. Next: IM-03 to contract each one.

### Example 2 — A regional health system extending an Epic-connected scheduling agent

The agent already runs in three clinics. The director of compliance asks: "How do we prove the agent never recommended a specialist outside the patient's network?"

**Recommendation:** IM-07 (evidence-binder). They are at L4 — the agent works, it is bounded, it has skills with contracts. The blocker is auditability, not architecture. Skip IM-01 through IM-06. Next: IM-08 to score the L5 readiness.

### Example 3 — A 30-person SaaS finance startup gluing GPT calls into their billing pipeline

Three engineers each wrote their own prompt-and-call helper. There is no shared skill registry. The CTO asks: "Why does refund triage call the wrong tool half the time?"

**Recommendation:** IM-06 (capability-graph) first, then IM-05 (multi-tool). They have skills implicitly but no map; you cannot debug an agent loop you cannot see. Build the graph, then constrain the loop. Do not jump straight to IM-05 — you will fix the wrong loop.

## Common pitfalls

- **Recommending the highest framework available.** IM-08 is satisfying to recommend. It is almost never the right answer for someone who just opened the plugin. Meet the team where they are.
- **Skipping the decision tree.** The tree exists because pattern-matching on the user's words is unreliable. "We need governance" can mean IM-02, IM-04, or IM-07. Walk the tree.
- **Bundling recommendations.** Pick one framework. The user will come back for the next one when they finish the artifact. Do not hand them a five-step plan they will not execute.
- **Confusing rung with priority.** A team at L1 building a payments agent has more urgent governance work than a team at L4 building a scheduling assistant. Rung describes maturity, not deadline.

## What this is NOT

- This skill does **not** architect your system. It points you at the framework that will.
- This skill does **not** generate code, policy, or contracts. The downstream IM-XX skills coach you through producing those yourself.
- This skill does **not** rank the frameworks by importance. They are a kit, not a checklist. You will use most of them on a real system, in an order specific to your situation.

## Why this matters

Most AI projects stall in the gap between "it works in a notebook" and "the risk team will let it ship." The eight frameworks of the Innorve Method are the load-bearing artifacts that close that gap. IM-00 exists so engineers do not waste a week building the wrong artifact first.

## Next step

Whichever framework the decision tree pointed at. Hand off explicitly: "Run `innorve-skill-architecture` next. You will produce a Skill Graph."

## Further reading

- The Innorve Method overview: <https://innorve.academy/method>
- The Architect Ladder definition: <https://innorve.academy/method#ladder>
- Karpathy, "Software 2.0" (2017) — for the conceptual framing of skills as composable units.
- Hidden Technical Debt in Machine Learning Systems (Sculley et al., NeurIPS 2015) — for why governance-as-code is not optional.
