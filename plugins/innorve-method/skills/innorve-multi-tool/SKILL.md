---
name: innorve-multi-tool
description: Use when picking the model + framework + deployment combination for a specific AI skill, and the choice needs to survive vendor pricing changes, term changes, model deprecations, and shifting latency/cost trade-offs over the next 18-36 months. Coaches the user through skill type, latency, cost, regulatory environment, and existing stack, then produces a Multi-Tool Decision document with explicit fallbacks and migration triggers per choice.
---

# IM-08 — Multi-Tool Strategy

> *Choose every tool with its replacement already named.*

## What this skill does

It walks the user through choosing — per AI skill, not per product — the combination of model, framework, and deployment that can meet the skill's posture and cost envelope. For each chosen tool, the user is forced to name a fallback and a migration trigger. The choice without the fallback is half a decision.

This is a coaching skill. You will not pick the stack for the user. You will make the user pick it themselves, in writing, with fallbacks named — because the cost of a vendor change in twelve months is much lower when the fallback was chosen on a quiet Tuesday rather than during a fire drill.

## When to invoke it

Invoke this skill when:

- A team is about to commit to a model + framework + deployment for a new capability.
- A vendor has announced a price change, term change, or model deprecation, and the team has to decide whether to stay or move.
- A buyer or auditor is asking "what happens if your vendor changes terms?" and there is no written answer.
- A capability is moving across postures (for example, out of startup into enterprise) and the previous tool choice may no longer fit.

Do not invoke it for the entire product at once. Run it per skill from the IM-06 Capability Map. A retrieval skill and a reasoning skill have different correct answers.

## Where it sits in the Innorve Method

IM-08 is the last orientation step before implementation.

- **IM-06 (Capability Graph)** gives you the named list of skills.
- **IM-07 (Tenant-Aware Design)** gives you the posture each skill must meet.
- IM-08 picks the tools that satisfy both, with fallbacks.

The Multi-Tool Decision is also the input to **IM-02 (Skill Contract)** and **IM-03 (Evidence Binder)**: the contract has to specify the model and version; the binder has to capture them per call.

## The coaching flow

Drive the conversation. Use `AskUserQuestion` for each block. Run the loop once per skill — do not batch.

1. **Pick the skill.** Confirm the user is choosing tools for one named skill from the Capability Map (e.g., `pr-checklist-review`, `loan-doc-extraction`, `sar-narrative-draft`). One skill at a time.

2. **Classify the skill type.** Ask:
   - **Reasoning-heavy** (multi-step, judgment, plan-then-act) — large reasoning model class.
   - **Retrieval-heavy** (find the right passage, then summarise) — embedding model + reranker + cheap generator.
   - **Simple / high-volume** (classify, extract, route) — small/cheap model class or a fine-tuned small model.
   - **Vision / multimodal** — model selected by accuracy on the actual document type, not by brand.
   - **Voice** — separate concerns: STT, LLM, TTS, each with its own fallback.

3. **Latency requirement.** Ask: synchronous user-facing (<2s p95), interactive (<10s), batch / async (minutes). The answer constrains both model and framework.

4. **Cost constraint.** Ask: target cost per call, expected calls per day, hard ceiling. Force a number. If the user cannot give one, the skill is not ready to ship.

5. **Regulatory environment.** Pull from the IM-07 Tenant Posture Card. Regulated posture rules out direct-API exposure of restricted data; enterprise posture may require a hyperscaler-hosted deployment with BAA / DPA in place; startup posture has more options.

6. **Existing stack.** Ask: what does the team already run in production? What does the platform team already pay for? A new tool that adds a new vendor relationship has to clear a higher bar than a tool that uses an existing one.

7. **Make the call.** For each layer (model, framework, deployment), pick a primary and at least one fallback. Examples that often come up:
   - **Reasoning**: primary large reasoning model via direct API, fallback the same model via a hyperscaler-hosted deployment for posture upgrade; secondary fallback a higher-capability sibling for harder cases.
   - **Embeddings**: primary domain-tuned embedding provider, fallback a major-provider embedding model, fallback a self-hosted open-weights model for sovereignty.
   - **Retrieval**: primary pgvector inside the existing Postgres, fallback a managed vector DB only if pgvector hits its scaling wall.
   - **Surface / orchestration**: primary the SDK direct, framework only when graph state is real, not aspirational.
   - **Tool protocol**: primary MCP for tools that should be portable across hosts.

8. **Name the migration triggers.** For each primary choice, write down the specific event that would force a move to the fallback: a price change above a named percentage, a deprecation notice, a latency regression above a named p95, a posture change in the tenant, a vendor term change touching IP or training rights.

9. **Write the document.** Ask the user to produce a Multi-Tool Decision document with one section per skill, listing primary and fallbacks per layer, with the migration triggers next to each.

## Inputs

The skill asks the user for:

- The named skill (single, from the Capability Map).
- The posture (from the Tenant Posture Card).
- Skill type (reasoning, retrieval, simple, vision, voice).
- Latency target (p95).
- Cost target and ceiling (per call, per day).
- The existing stack the team already operates.
- An owner of the decision document.

## Outputs

The skill produces, by the user's hand:

- One section per skill in a Multi-Tool Decision document.
- A primary plus at least one fallback per layer (model, framework, deployment, retrieval if applicable, tool protocol).
- A list of migration triggers per primary choice, each one specific enough to detect without a meeting.
- A quarterly review date.

## The artifact produced

A `multi-tool-decisions.md` file in the repo, with one section per skill:

```
## Skill: <skill-name>
Posture: <from IM-07>
Skill type: reasoning | retrieval | simple | vision | voice
Latency target: <p95>
Cost ceiling: <per call, per day>

### Model
- Primary: <model + version + deployment>
- Fallback 1: <model + deployment>
- Fallback 2: <if applicable>
- Migration triggers: <list>

### Framework / orchestration
- Primary: <framework>
- Fallback: <framework>
- Migration triggers: <list>

### Retrieval (if applicable)
- Embeddings primary / fallback + triggers
- Vector store primary / fallback + triggers
- Reranker primary / fallback + triggers

### Tools / protocol
- Primary: <MCP, function calling, custom>
- Fallback: <...>
- Migration triggers: <list>

### Review date
- Quarterly, or on trigger.
```

## Quality rubric

A Multi-Tool Decision section is ready for review when all of the following are true:

| Criterion | Pass condition |
|-----------|----------------|
| Per-skill scoping | One section per skill; no shared "the stack" section |
| Posture link | Posture cited from IM-07 by name |
| Numeric targets | Latency and cost stated as numbers with units |
| Primary + fallback | Every layer has a primary and at least one fallback |
| Migration triggers | Each trigger is specific (numeric threshold, named event, dated notice) |
| Existing-stack note | Reuse vs new-vendor decision is justified in writing |
| Tool-protocol portability | MCP or equivalent named for any tool intended to outlive the host |
| Review cadence | Quarterly review date on a real calendar |

## Failure mode checklist

Before the user commits the document, check:

- [ ] No section uses the phrase "TBD" for a fallback.
- [ ] No migration trigger uses words like "if pricing changes a lot" — every trigger is observable without a debate.
- [ ] At least one trigger touches vendor terms (IP, training rights, residency).
- [ ] At least one trigger touches deprecation timing.
- [ ] No layer is omitted; if retrieval does not apply, that is stated explicitly.
- [ ] The document is in the repo, not in a slide deck or chat thread.

## Regulated environment extension

In regulated environments, extend each section with:

- **Provider exposure boundary** — the deployment shape that satisfies the posture (private endpoint, BAA-covered region, sovereign deployment) named for both primary and fallback.
- **Training-data clause** — the contractual statement that customer prompt and output content is not used for provider model training, cited per primary and fallback.
- **Model risk treatment** — how this model is classified under the institution's MRM policy, who reviews changes.
- **Pre-warmed fallback** — the fallback path is contracted, configured, and exercised on a schedule, not only documented.

A regulated Multi-Tool Decision without a pre-warmed fallback is a single point of failure with paperwork.

## Public portfolio instruction

If the user is producing this artifact on non-confidential work, encourage them to publish a sanitised copy:

1. Replace internal skill names with the generic capability shape (`reasoning-skill-A` rather than the production name).
2. Keep the per-layer primary/fallback structure and the migration triggers.
3. Remove pricing specifics and contractual language.
4. Publish under `/method-portfolio/multi-tool-decisions/<skill-class>.md` in the public repository.
5. Tag with `#innorve-method #IM-08`.
6. Submit to the Innorve Academy free community for peer review.

A published Multi-Tool Decision is one of the strongest signals that an architect is operating at L3 or above on the Innorve Architect Ladder.

## Worked examples

**Banking — `sar-narrative-draft` skill (Regulated posture, reasoning-heavy, async batch).**
Primary model: large reasoning model via a hyperscaler-hosted deployment in a regulated-acceptable region with zero retention. Fallback: the higher-capability sibling on the same deployment for the cases that fail confidence threshold. Framework: SDK direct — no orchestration layer, because the posture requires a clean evidence trail and added abstractions add audit surface. Tools: MCP for the case-management read tool. Migration triggers: any term change touching training rights, any deprecation of the primary model, latency regression above the SLA in the SAR filing window, MRM-mandated reclassification.

**Healthcare — `chart-summary-for-clinician` skill (Regulated posture, reasoning, synchronous).**
Primary model: large reasoning model via a HIPAA-eligible deployment under a BAA. Fallback: a second HIPAA-eligible provider with the same posture, pre-contracted, kept warm. Embeddings: domain-tuned clinical embedding via the same path. Retrieval: pgvector in the existing PHI-zone Postgres. Framework: SDK direct, with a thin internal wrapper for prompt caching. Migration triggers: BAA changes, accuracy regression on the held-out clinician-graded eval set, any new entrant with materially better accuracy on the same eval set.

**SaaS — `pr-checklist-review` skill (Startup posture, reasoning, async).**
Primary model: mid-tier reasoning model via direct API. Fallback: small/cheap sibling for cost-pressure mode; secondary fallback the higher-capability sibling for hard reviews. Framework: SDK direct. No retrieval — checklist is small enough to live in the system prompt with prompt caching. Migration triggers: pricing change above 30 percent per million tokens, the team adopts a hyperscaler-hosted deployment for posture upgrade, the eval suite shows the cheaper sibling catching the same defects at 70 percent of the cost.

## Common pitfalls

- **Picking a framework for the brand, not the need.** Heavy orchestration frameworks are the right answer when graph state is real. They are dead weight when the skill is a single prompt with one tool call.
- **Treating "we already use X" as a sufficient reason.** It is a real reason, but it is not the only one. Re-test it against latency and cost, not just inertia.
- **No fallback.** A choice without a fallback is a hostage situation waiting for a vendor email.
- **Vague migration triggers.** "If pricing changes a lot" is not a trigger. "If per-call cost rises above $0.012" is.
- **Choosing one stack for the whole product.** Different skills have different correct answers. Reasoning and retrieval should rarely share a model choice.
- **Ignoring the posture.** A startup-posture decision shipped into a regulated tenant is a posture mismatch, not a tooling problem.
- **Documented but un-exercised fallback.** A fallback that has never been run is not a fallback; it is an aspiration.

## Innorve Native Mode tenets this skill operationalizes

- **Tenet 5 — Portability before tool lock-in.** The entire skill exists to enforce this tenet. Every primary choice carries a documented fallback and a specific migration trigger; the decision is portable by design.
- **Tenet 4 — Evidence before claims.** The Multi-Tool Decision document is the evidence that the team has thought about vendor risk; it is what an architect points to when a buyer or auditor asks "what happens if your model provider changes terms?"

## Next step

Once the Multi-Tool Decision document is committed, move to implementation under **IM-02 (Skill Contract)** and **IM-03 (Evidence Binder)**. Schedule the quarterly review on the calendar — most teams discover their first migration trigger fired silently three months earlier.

## Further reading

- Innorve Method index — `https://innorve.academy/method#im-08`
- IM-06 — Capability Graph (the input list of skills)
- IM-07 — Tenant-Aware Design (the posture each skill must meet)
- IM-02 — Skill Contract (consumes the model + version choice)
- IM-03 — Evidence Binder (records model + version per call)
- NIST AI RMF 1.0 — Manage function (third-party risk)
- Model Context Protocol — `https://modelcontextprotocol.io`

## Why this matters

The model market changes faster than the systems built on top of it. Teams that picked one model, one framework, and one deployment with no documented fallback have spent the last two years either rewriting or absorbing margin compression. The Multi-Tool Decision document is not a hedge — it is a written admission that the right choice today may not be the right choice in twelve months, and that the cost of a planned migration is an order of magnitude lower than the cost of an unplanned one.

## What this is NOT

- Not a vendor recommendation. The skill is tool-agnostic; the user picks.
- Not a one-stack-for-the-whole-product decision. Run it per skill.
- Not a substitute for evals. Tools chosen without an eval suite cannot be validated when migration triggers fire.
- Not a one-time artifact. It is reviewed quarterly and on every named trigger.
- Not a replacement for the user thinking. The skill coaches; the user decides and writes it down.

---

If you find yourself wishing for a peer who could pressure-test your Multi-Tool Decision before a vendor's quarterly term change forces an unplanned migration — that is what Cohort 1 of the Innorve Academy bootcamp is for. Apply at `https://innorve.academy/apply`.
