---
name: innorve-multi-tool
description: Use when picking the model + framework + deployment combination for a specific AI skill, and the choice needs to survive vendor pricing changes, term changes, model deprecations, and shifting latency/cost trade-offs over the next 18-36 months. Coaches the user through skill type, latency, cost, regulatory environment, and existing stack, then produces a Multi-Tool Decision document with explicit fallbacks and migration triggers per choice.
---

# IM-08 — Multi-Tool Strategy

A coaching skill. You will not pick the stack for the user. You will make them pick it themselves, in writing, with fallbacks named — because the cost of a vendor change in 12 months is much lower when the fallback was chosen on a quiet Tuesday rather than during a fire drill.

## What this skill does

It walks the user through choosing — per AI skill, not per product — the right combination of:

- **Model** — reasoning model, retrieval/embedding model, simple/cheap model, vision model, voice model.
- **Framework** — orchestration layer (Anthropic SDK direct, Vercel AI SDK, LangGraph, Mastra, or none), tool-calling protocol (MCP, function calling), retrieval layer (pgvector, a managed vector DB, BM25-only).
- **Deployment** — direct API, hyperscaler-hosted (Bedrock, Vertex, Azure OpenAI), private deployment, or on-prem.

For each chosen tool, the user is forced to name a **fallback** and a **migration trigger**. This is the point of the skill. The choice without the fallback is half a decision.

## When to invoke it

Invoke this skill when:

- A team is about to commit to a model + framework + deployment for a new capability.
- A vendor has announced a price change, term change, or model deprecation, and the team has to decide whether to stay or move.
- A buyer or auditor is asking "what happens if your vendor changes terms?" and there is no written answer.
- A capability is moving across postures (e.g., out of startup into enterprise) and the previous tool choice may no longer fit.

Do not invoke it for the entire product at once. Run it per skill from the Capability Map. A retrieval skill and a reasoning skill have different correct answers.

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
   - Reasoning-heavy (multi-step, judgment, plan-then-act) — Claude Sonnet / Opus class.
   - Retrieval-heavy (find the right passage, then summarise) — embedding model + reranker + cheap generator.
   - Simple / high-volume (classify, extract, route) — Haiku class or a fine-tuned small model.
   - Vision / multimodal — model selected by accuracy on the actual document type, not by brand.
   - Voice — separate concerns: STT, LLM, TTS, each with its own fallback.

3. **Latency requirement.** Ask: synchronous user-facing (<2s p95), interactive (<10s), batch / async (minutes). The answer constrains both model and framework.

4. **Cost constraint.** Ask: target cost per call, expected calls per day, hard ceiling. Force a number. If the user cannot give one, the skill is not ready to ship.

5. **Regulatory environment.** Pull from the IM-07 Tenant Posture Card. Regulated posture rules out direct-API exposure of restricted data; enterprise posture may require a hyperscaler-hosted deployment with BAA / DPA in place; startup posture has more options.

6. **Existing stack.** Ask: what does the team already run in production? What does the platform team already pay for? A new tool that adds a new vendor relationship has to clear a higher bar than a tool that uses an existing one.

7. **Make the call.** For each layer (model, framework, deployment), pick a primary and at least one fallback. Examples that often come up:
   - Reasoning: primary Claude Sonnet via Anthropic API, fallback Claude Sonnet via Bedrock (same model, different deployment) for posture upgrade; secondary fallback Claude Opus for harder cases.
   - Embeddings: primary Voyage, fallback OpenAI `text-embedding-3-large`, fallback BGE self-hosted for sovereignty.
   - Retrieval: primary pgvector in the existing Postgres, fallback a managed vector DB only if pgvector hits its scaling wall.
   - Surface / orchestration: primary Vercel AI SDK for a Next.js surface, fallback the Anthropic SDK direct; LangGraph or Mastra only when graph state is real, not aspirational.
   - Tool protocol: primary MCP for tools that should be portable across hosts.

8. **Name the migration triggers.** For each primary choice, write down the specific event that would force a move to the fallback: a price change above X, a deprecation notice, a latency regression above Y, a posture change in the tenant, a vendor term change touching IP or training rights.

9. **Write the document.** Ask the user to produce a Multi-Tool Decision document with one section per skill, listing primary and fallbacks per layer, with the migration triggers next to each.

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

## Worked examples

**Banking — `sar-narrative-draft` skill (Regulated posture, reasoning-heavy, async batch).**
Primary model: Claude Sonnet via Bedrock in a HIPAA / FFIEC-acceptable region with zero retention. Fallback: Claude Opus via Bedrock for the 5 percent of cases that fail confidence threshold. Framework: Anthropic SDK direct — no orchestration layer, because the posture requires a clean evidence trail and added abstractions add audit surface. Tools: MCP for the case-management read tool. Migration triggers: any term change touching training rights, any deprecation of Sonnet, latency regression above the SLA in the SAR filing window.

**Healthcare — `chart-summary-for-clinician` skill (Regulated posture, reasoning, synchronous).**
Primary model: Claude Sonnet via a HIPAA-eligible deployment under a BAA. Fallback: a second HIPAA-eligible provider with the same posture, pre-contracted, kept warm. Embeddings: Voyage clinical-domain embedding via the same path. Retrieval: pgvector in the existing PHI-zone Postgres. Framework: Anthropic SDK direct, with thin internal wrapper for prompt caching. Migration triggers: BAA changes, accuracy regression on the held-out clinician-graded eval set, any new entrant with materially better accuracy on the same eval set.

**SaaS — `pr-checklist-review` skill (Startup posture, reasoning, async).**
Primary model: Claude Sonnet via Anthropic API direct. Fallback: Claude Haiku for cost-pressure mode; secondary fallback Claude Opus for hard reviews. Framework: Anthropic SDK direct. No retrieval — checklist is small enough to live in the system prompt with prompt caching. Migration triggers: pricing change above 30 percent, the team adopts Bedrock for posture upgrade, the eval suite shows Haiku catching the same defects at 70 percent of the cost.

## Common pitfalls

- **Picking a framework for the brand, not the need.** LangGraph and Mastra are the right answer when graph state is real. They are dead weight when the skill is a single prompt with one tool call.
- **Treating "we already use X" as a sufficient reason.** It is a real reason, but it is not the only one. Re-test it against latency and cost, not just inertia.
- **No fallback.** A choice without a fallback is a hostage situation waiting for a vendor email.
- **Vague migration triggers.** "If pricing changes a lot" is not a trigger. "If per-call cost rises above $0.012" is.
- **Choosing one stack for the whole product.** Different skills have different correct answers. Reasoning and retrieval should rarely share a model choice.
- **Ignoring the posture.** A startup-posture decision shipped into a regulated tenant is a posture mismatch, not a tooling problem.

## Next step

Once the Multi-Tool Decision document is committed, move to implementation under **IM-02 (Skill Contract)** and **IM-03 (Evidence Binder)**. Schedule the quarterly review on the calendar — most teams discover their first migration trigger fired silently three months earlier.

## Further reading

- IM-06 — Capability Graph (the input list of skills)
- IM-07 — Tenant-Aware Design (the posture each skill must meet)
- IM-02 — Skill Contract (consumes the model + version choice)
- IM-03 — Evidence Binder (records model + version per call)

## Why this matters

The model market changes faster than the systems built on top of it. Teams that picked one model, one framework, and one deployment in 2024 have spent 2025 and 2026 either rewriting or absorbing margin compression. The Multi-Tool Decision document is not a hedge — it is a written admission that the right choice today may not be the right choice in twelve months, and that the cost of a planned migration is an order of magnitude lower than the cost of an unplanned one.

## What this is NOT

- Not a vendor recommendation. The skill is tool-agnostic; the user picks.
- Not a one-stack-for-the-whole-product decision. Run it per skill.
- Not a substitute for evals. Tools chosen without an eval suite cannot be validated when migration triggers fire.
- Not a one-time artifact. It is reviewed quarterly and on every named trigger.
- Not a replacement for the user thinking. The skill coaches; the user decides and writes it down.
