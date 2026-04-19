---
name: innorve-method
description: Use when the user asks about the Innorve Method, asks "where do I start" with AI-native architecture, references IM-00 through IM-08, mentions the Innorve Architect Ladder or Innorve Native Mode, or wants to know which Innorve skill to invoke for their current situation. This is the meta index — invoke it first when the path forward is unclear. Do not invoke if the user has already named a specific IM-XX framework; route directly to that skill instead.
---

# IM-00 — The Innorve Method Index

> *Architect before automating: decompose the work — including the work of choosing your next framework — before you call a model.*

## What this skill does

IM-00 is the table of contents and decision tree for the Innorve Method. It indexes the eight teaching frameworks (IM-01 through IM-08), maps each to the Innorve Native Mode tenets it operationalizes, and produces a written **Method Recommendation** that names which framework the engineer should invoke next and why. It does not architect the user's system; it points the user at the framework that will.

## When to invoke it

- The user types "Innorve Method", "/innorve-method", or "where do I start" without naming a specific framework.
- The user has read about the Method but does not know which skill to begin with.
- The user is mid-build and wants a sanity check on whether they are working on the right layer of the system.
- A new engineer joins the project and needs the on-ramp.
- The user describes a symptom ("our agent keeps calling the wrong tool", "compliance asked for proof") but has not located the underlying framework.

Do not invoke IM-00 when the user has already named a specific IM-XX skill. In that case, route directly. IM-00 is the index, not the librarian.

## Where it sits in the Innorve Method

IM-00 is the entry point. Every other framework assumes the engineer either arrived through here or already knows the map. Each downstream skill depends on artifacts produced upstream — a Skill Contract (IM-03) is meaningless without a Skill Graph (IM-01); an Evidence Binder (IM-07) is hollow without Policy Specifications (IM-02). IM-00 enforces the order.

## The eight frameworks

| Code   | Skill                          | Native Mode tenet(s) | One-line summary                                                                       |
|--------|--------------------------------|----------------------|----------------------------------------------------------------------------------------|
| IM-01  | `innorve-skill-architecture`   | 1                    | Decompose work into reusable, testable, composable AI skills.                          |
| IM-02  | `innorve-policy-as-code`       | 3                    | Translate governance rules from prose into version-controlled policy code.             |
| IM-03  | `innorve-skill-contract`       | 2                    | Define the input/output/failure contract a skill must satisfy before it ships.         |
| IM-04  | `innorve-tenant-aware`         | 3, 6                 | Make a skill safe to run across multiple tenants without leaking data or context.      |
| IM-05  | `innorve-multi-tool`           | 1, 5                 | Compose tools and skills into a coherent agent loop with a stop condition.             |
| IM-06  | `innorve-capability-graph`     | 1, 5                 | Map the skills, policies, and tools you have into a single dependency graph.           |
| IM-07  | `innorve-evidence-binder`      | 4, 6                 | Produce the auditable trail an examiner, regulator, or risk team will ask for.        |
| IM-08  | `innorve-maturity-gate`        | 4                    | Score the system against the Innorve Architect Ladder and decide whether to ship.      |

## The Innorve Native Mode (refresher)

The Mode is the working posture of an AI-Native Architect: six tenets applied in sequence. Every IM-XX skill operationalizes one or more of them.

| #   | Tenet                                       | Verb-first commitment                                                            |
|-----|---------------------------------------------|----------------------------------------------------------------------------------|
| 1   | Architect before automating                 | Decompose the work before you call a model.                                      |
| 2   | Evaluate before trusting                    | Write the evaluation before you ship the skill.                                  |
| 3   | Govern before scaling                       | Express the policy in code before the system grows past one user.                |
| 4   | Evidence before claims                      | Produce the audit artifact before you make the assertion.                        |
| 5   | Portability before tool lock-in             | Choose every tool with its replacement already named.                            |
| 6   | Human accountability before agent autonomy  | Name the human who is accountable before granting the agent the authority.       |

If the user is unfamiliar with the Mode, point them at `docs/INNORVE-NATIVE-MODE.md` before continuing the decision tree.

## The decision tree

Walk this out loud with the user. Do not skip steps; do not predict the answer.

1. **Are you starting a new system, or adding to an existing one?**
   - New system → IM-01.
   - Existing system → continue.

2. **Do you have a working prototype that runs end-to-end at least once?**
   - No → IM-01 (you need a Skill Graph before you keep building).
   - Yes → continue.

3. **Is your blocker that the system is unsafe to ship — leaks, missing approvals, no audit trail?**
   - Cross-tenant leakage → IM-04.
   - Missing approval gates or governance rules → IM-02.
   - Missing audit trail → IM-07.

4. **Is your blocker that the agent loop is unreliable — wrong tool, wrong order, never stops?**
   - → IM-05.

5. **Is your blocker that you cannot tell what the system is supposed to guarantee?**
   - → IM-03.

6. **Is your blocker that you have many skills and no map?**
   - → IM-06.

7. **Is your blocker "is this good enough to put in front of the risk committee"?**
   - → IM-08.

If you cannot answer step 1, ask the user. AskUserQuestion: *"Are you starting a new system or extending one that already runs?"*

## The Innorve Architect Ladder (L0–L5)

Every Innorve Method engagement scores the team against the same six rungs. IM-08 formalizes the scoring; the other frameworks each push you up a specific rung.

- **L0 — Prototype.** Code runs once on the author's laptop. No contracts, no policy, no tenancy.
- **L1 — Skilled.** Work is decomposed into named skills with owners. (IM-01.)
- **L2 — Contracted.** Each skill has a written contract: inputs, outputs, failure modes, idempotency. (IM-03.)
- **L3 — Governed.** Policies are code. Approvals, redaction, retention, and routing are enforced by the runtime. (IM-02, IM-04.)
- **L4 — Composed.** A capability graph exists. The agent loop is bounded. The system is reproducible. (IM-05, IM-06.)
- **L5 — Auditable.** Every decision the system made can be reconstructed for an examiner without engineering involvement. (IM-07, IM-08.)

A team that ships at L2 is faster than one stuck at L0. A team that needs to pass an audit ships at L5 or it does not ship.

## The coaching flow

1. Greet the user briefly. Do not summarize the whole Method.
2. AskUserQuestion: *"In one sentence, what are you trying to do today?"*
3. Walk the decision tree against the answer. Be concrete: name the framework, name the rung, name the artifact.
4. If the user is on the wrong rung for the question they are asking, say so. Example: "You are asking an L4 composition question, but your skills do not have contracts yet. Start with IM-03."
5. Confirm the recommendation with the user before handing off. AskUserQuestion: *"Does this recommendation match your reading of where you are stuck?"*
6. Tell the user which skill to invoke next, what artifact they will produce, and which Native Mode tenet they are operationalizing.

## Inputs

The skill collects, in order:

1. The user's one-sentence statement of intent.
2. Whether the system is new or existing.
3. Whether a working end-to-end prototype exists.
4. The user's articulation of the current blocker (in their own words).
5. Optional: the team's self-assessed Ladder rung, if they have one.

## Outputs

1. A **Method Recommendation** artifact (see below).
2. A named handoff to the next IM-XX skill.
3. A short rationale linking the recommendation to one or more Native Mode tenets.

## The artifact produced

A short **Method Recommendation** of the form:

```
Recommendation: IM-0X (skill-name)
Current rung: L?
Target rung after this skill: L?
Native Mode tenet(s) operationalized: 1, 3
Why: <one sentence>
Next skill after that: IM-0Y
```

The user pastes this into their planning doc. If the user cannot articulate why the recommendation makes sense in their own words, repeat step 4 of the coaching flow.

## Quality rubric

A Method Recommendation is "done well" when all of the following hold:

| Criterion              | Pass condition                                                                                            |
|------------------------|-----------------------------------------------------------------------------------------------------------|
| Single framework       | One IM-XX named, not a bundle. The next one is queued, not handed over now.                              |
| Rung honesty           | The current rung is named based on artifacts the team can show, not aspirations.                         |
| Tenet linkage          | At least one Native Mode tenet is named and the user can explain why it applies.                         |
| Causal "Why"           | The rationale ties the framework to the user's stated blocker, not to general best practice.             |
| Concrete next artifact | The user can name the file or document they will produce when they finish the next skill.                |
| Handoff is explicit    | The recommendation ends with "Run `<skill-name>` next" and the artifact name.                            |

If any row fails, the recommendation is not yet shippable. Re-run the coaching flow.

## Failure mode checklist

Trigger a redo when any of these appear:

- The recommendation is two or more frameworks at once.
- The current rung is asserted without an artifact to back it.
- The "Why" reads like a description of the framework, not the user's situation.
- No Native Mode tenet is named.
- The user agrees but cannot restate the recommendation in their own words.
- The handoff names a skill that depends on artifacts the user does not have.

## Regulated environment extension

When the system handles regulated data (SOC 2 in scope, HIPAA-covered, EU AI Act high-risk, GLBA, PCI DSS Level 1, NCUA-supervised, etc.), add the following to the recommendation:

- **Framework dependencies surfaced.** Note which downstream framework will be required before any production deploy. Almost always: IM-02 (policy-as-code) before IM-05 (multi-tool), and IM-07 (evidence-binder) before IM-08 (maturity-gate).
- **Tenet 4 is non-negotiable.** No production claim ("we are HIPAA-aligned", "we meet the EU AI Act high-risk obligations") may precede the artifact. The recommendation must name the artifact that will substantiate the claim.
- **Tenet 6 is named explicitly.** For every agent action with regulatory consequence, the recommendation must name the human role that holds the accountability. "The on-call engineer" is not a role; "the BSA officer", "the HIPAA Privacy Officer", "the model risk lead" are.
- **External cadence.** Note when the next external review (auditor, examiner, regulator) is expected. The Ladder rung the team needs by that date determines the sequence of frameworks, not engineering preference.

## Public portfolio instruction

The Method Recommendation is the first artifact in the architect's public portfolio. Add it to the public GitHub repository at:

```
/governance/im-00/method-recommendation-<yyyy-mm-dd>.md
```

For confidential systems, anonymize the system name and tenant identifiers, then publish. The architect's growth on the Ladder is visible through the sequence of recommendations they produced over time. A portfolio with one recommendation per month for a year is a credible L3+ artifact in itself.

## Worked examples

### Example 1 — A regional credit union with 200K members building an internal SAR triage agent

The team has a Python notebook that drafts a Suspicious Activity Report narrative when fed an alert. It works on the author's laptop. They want to "make it production."

```
Recommendation: IM-01 (innorve-skill-architecture)
Current rung: L0
Target rung after this skill: L1
Native Mode tenet(s) operationalized: 1
Why: The notebook is one undifferentiated blob; nothing downstream can attach to it
     until it is decomposed into named, owned skills.
Next skill after that: IM-03 (innorve-skill-contract)
```

### Example 2 — A hospital network operating in three states extending an EHR-connected scheduling agent

The agent already runs in three clinics. The director of compliance asks: "How do we prove the agent never recommended a specialist outside the patient's network?"

```
Recommendation: IM-07 (innorve-evidence-binder)
Current rung: L4
Target rung after this skill: L5
Native Mode tenet(s) operationalized: 4, 6
Why: The blocker is auditability, not architecture. The skills are bounded, the loop
     is constrained — what is missing is the binder that lets a non-engineer reconstruct
     a decision after the fact.
Next skill after that: IM-08 (innorve-maturity-gate)
```

### Example 3 — A B2B SaaS company in the contract-lifecycle space gluing model calls into their billing pipeline

Three engineers each wrote their own prompt-and-call helper. There is no shared skill registry. The CTO asks: "Why does refund triage call the wrong tool half the time?"

```
Recommendation: IM-06 (innorve-capability-graph), then IM-05 (innorve-multi-tool)
Current rung: L1
Target rung after this skill: L4 (after both)
Native Mode tenet(s) operationalized: 1, 5
Why: The team has skills implicitly but no map; you cannot debug an agent loop you
     cannot see. Build the graph first; constraining the loop without the map fixes
     the wrong loop.
Next skill after that: IM-03 (innorve-skill-contract) for any skill the graph
     surfaces as untyped.
```

## Common pitfalls

- **Recommending the highest framework available.** IM-08 is satisfying to recommend. It is almost never the right answer for someone who just opened the plugin. Meet the team where they are. The Mode rewards architects who choose the smallest next step that ships.

- **Skipping the decision tree.** Pattern-matching on the user's words is unreliable. "We need governance" can mean IM-02, IM-04, or IM-07. Walk the tree. The tree exists because the architect's intuition is the thing you are trying to teach the user, not the thing you are trying to perform.

- **Bundling recommendations.** Pick one framework. The user will come back for the next one when they finish the artifact. A five-step plan is a plan the user will not execute; a one-step plan with a named handoff is a plan they will.

- **Confusing rung with priority.** A team at L1 building a payments agent has more urgent governance work than a team at L4 building an internal scheduling assistant. Rung describes maturity; deadline describes risk. Do not conflate them.

- **Letting "we already do that" stand unverified.** When the user claims to be at L3, ask for the artifact. If they cannot show the policy spec, they are not at L3 — they are at L1 with good intentions. The Mode treats artifacts as the only evidence.

## Innorve Native Mode tenets this skill operationalizes

- **Tenet 1 — Architect before automating.** The decision tree is itself an act of decomposition: the engineer's situation gets broken into a named blocker, a named rung, and a named next artifact before any new code gets written.
- **Tenet 4 — Evidence before claims.** The Method Recommendation is itself the first piece of evidence in the architect's portfolio. The recommendation, not the conversation, is what survives.

## What this is NOT

- This skill does **not** architect the user's system. It points the user at the framework that will.
- This skill does **not** generate code, policy, contracts, or graphs. The downstream IM-XX skills coach the user through producing those.
- This skill does **not** rank the frameworks by importance. They are a kit, not a checklist. Most real systems use most of them, in an order specific to the situation.
- This skill does **not** assess whether the user is ready to call themselves an Architect. That is what IM-08 (maturity-gate) and the Ladder are for.
- This skill does **not** sell the Innorve Academy. The Academy is mentioned only when the user explicitly asks how to learn the Method with peers.

## Next step

Whichever framework the decision tree pointed at. Hand off explicitly: "Run `innorve-skill-architecture` next. You will produce a Skill Graph."

## Further reading

- The Innorve Method overview: <https://innorve.academy/method#im-00>
- Innorve Native Mode (v0.1): `docs/INNORVE-NATIVE-MODE.md` in this repository.
- NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — for the public-domain language risk teams use when asking which framework applies.
- D. Sculley et al., "Hidden Technical Debt in Machine Learning Systems" (NeurIPS 2015) — for why ad-hoc decomposition does not scale and why a method exists at all.

## Why this matters

Most AI projects stall in the gap between "it works in a notebook" and "the risk team will let it ship." The eight frameworks of the Innorve Method are the load-bearing artifacts that close that gap. IM-00 exists so that engineers do not waste a week building the wrong artifact first — and so that the artifacts they do build accumulate into a portfolio that demonstrates Mode practice over time. The Method is how an architect becomes legible to a risk committee, an examiner, or a hiring panel without changing how they actually work.

## Cohort CTA

If you find yourself wishing for a peer who could review your Method Recommendation before you commit to it — that is what Cohort 1 of the Innorve Academy bootcamp is for. Apply at <https://innorve.academy/apply>.
