---
name: innorve-skill-contract
description: Use when authoring a new AI skill or agent capability that will be called by other systems, exposed to users, or shipped to production. Walks the author through a structured wizard and emits a Skill Contract — a machine-readable file conforming to the Innorve Skill Contract Schema v0.1 that declares inputs, outputs, evidence, side effects, risk class, approvals, and eval criteria.
---

# IM-04 — Skill Contract Schema

## What this skill does

Interactive wizard that walks the author of a new AI skill through the questions a reviewer, an auditor, or a future on-call engineer will eventually ask, and emits a Skill Contract file conforming to Innorve Skill Contract Schema v0.1. The contract is the machine-readable companion to a skill's documentation: callers, gateways, and policy engines (see IM-06) read it to decide whether and how to invoke the skill.

## When to invoke it

Invoke `innorve-skill-contract` when:

- You are creating a new skill, tool, agent capability, or workflow that other systems or users will call.
- You are about to publish a skill to a shared registry, marketplace, or internal catalog.
- A skill has drifted: its actual behavior no longer matches its declared inputs, outputs, or side effects, and you need to re-author the contract.
- You are graduating a skill from Incubating to Validated on the Maturity Ladder (see IM-05) and the gate review found the contract missing or stale.

Do not invoke for one-off scripts, throwaway prototypes, or experiments behind feature flags that will never be called externally.

## Where it sits in the Innorve Method

IM-04 follows IM-03 (Evidence Binder) and produces an artifact that IM-05 (Maturity Gate), IM-06 (Policy as Code), and IM-07 (Multi-Tool Orchestration) all consume. The Skill Contract is the smallest unit of trust in the Method — every later skill assumes a contract exists and is current.

## The coaching flow

Use AskUserQuestion at each step. Resist the temptation to fill in plausible defaults — defaults become wrong contracts.

1. **Identity.** Ask for the skill name (kebab-case), version (semver), one-line summary, owning team, and primary on-call contact. Reject names like "helper" or "utils" — push for a verb-noun form like `summarize-incident` or `route-loan-application`.
2. **Intended caller.** Ask who calls this skill: end users, other agents, scheduled jobs, public API. Multi-select. If "other agents," ask which ones by name.
3. **Inputs.** For each input field, capture: name, type (use JSON Schema primitive types or named domain types from the binder), required vs optional, sensitivity tag (`public`, `internal`, `pii`, `phi`, `pci`, `secret`), and one-line description. Ask whether any input field can carry untrusted text that will reach a model — flag those for IM-08 (tenant-aware) review.
4. **Outputs.** For each output field, capture: name, type, sensitivity tag, and whether the output is shown to a human, written to a system of record, or passed to another skill. Outputs passed to other skills become the inputs of those skills — keep the chain consistent.
5. **Evidence requirements.** Ask what must be logged for every invocation: inputs, outputs, prompt version, model name and version, retrieval hits, tool calls, latency, cost. Ask the retention period and the access control. This block plugs directly into the binder's `audit-trail/` folder.
6. **Side effects.** Ask whether the skill writes to any system of record, sends external communication, modifies state, or spends money. List each side effect with a target system and whether it is reversible.
7. **Dependencies.** List models, tools, retrievers, external APIs, and other skills this skill calls. Capture version pins where possible.
8. **Risk class.** Pick one: `read-only`, `low-impact-write`, `high-impact-write`, `irreversible`, `regulated-decision`. Map to EU AI Act risk tier if applicable.
9. **Required approvals.** For each risk class above `low-impact-write`, ask which approvals are required at runtime: none, single human approval, dual control, named role, change advisory board. This becomes a policy assertion in IM-06.
10. **Eval criteria.** Ask: what set of inputs is the skill evaluated on, what metric is computed, what threshold must it meet, how often does it run, and where do the results land. The eval contract here ties to the binder's `evals/eval-plan.md`.
11. **Emit the file.** Write a YAML file at the path the user specifies (default: `governance/<system-name>/contracts/<skill-name>.yaml`) that conforms to the schema below.

## The artifact produced

A YAML file conforming to **Innorve Skill Contract Schema v0.1**. The schema, expressed as JSON Schema:

```yaml
$schema: https://innorve.academy/schemas/skill-contract/v0.1.json
schema_version: "0.1"
name: <kebab-case-name>
version: <semver>
summary: <one line>
owner:
  team: <team name>
  on_call: <person or rotation>
intended_callers: [end_user | agent | scheduled_job | public_api]
inputs:
  - name: <field>
    type: <json-schema type or named domain type>
    required: <bool>
    sensitivity: [public | internal | pii | phi | pci | secret]
    untrusted_text_to_model: <bool>
    description: <one line>
outputs:
  - name: <field>
    type: <type>
    sensitivity: <tag>
    destination: [human | system_of_record | downstream_skill]
    description: <one line>
evidence:
  log_fields: [inputs, outputs, prompt_version, model, retrieval_hits, tool_calls, latency_ms, cost_usd]
  retention_days: <int>
  access_control: <named role or group>
side_effects:
  - target: <system>
    action: <description>
    reversible: <bool>
dependencies:
  models: [{name: <id>, version: <pin>}]
  tools: [{name: <id>, version: <pin>}]
  retrievers: [{name: <id>, index_version: <pin>}]
  skills: [{name: <id>, version: <pin>}]
  external_apis: [{name: <id>, endpoint: <url>}]
risk_class: [read_only | low_impact_write | high_impact_write | irreversible | regulated_decision]
eu_ai_act_tier: [none | minimal | limited | high | prohibited]
approvals:
  runtime: [none | single_human | dual_control | role:<name> | cab]
  change: [none | code_review | risk_review | cab]
evals:
  dataset: <ref>
  metric: <name>
  threshold: <value>
  cadence: [per_pr | nightly | weekly | quarterly]
  results_path: <path in binder>
maturity_level: [incubating | validated | certified | deprecated]
last_reviewed: <ISO date>
```

## Worked examples

**Banking — `route-loan-application`.** Inputs: applicant ID (pii), product code (internal), branch ID (internal). Outputs: routed underwriter ID (internal), reasoning trace (internal, destination: system of record). Side effect: writes routing decision to LOS, reversible within 24h. Risk class: `high_impact_write`. Approvals: runtime none (deterministic policy), change requires risk review. Eval: 500 historical applications, accuracy vs. underwriter manager re-routes, threshold 92%, weekly.

**Healthcare — `summarize-clinical-note`.** Inputs: note ID (phi), specialty (internal). Outputs: summary text (phi, destination: human — clinician). Untrusted text to model: yes (the note body). Side effect: none — output is read-only until clinician signs. Risk class: `read_only`. Approvals: runtime none, change requires clinical informatics sign-off. Eval: 200 notes graded by attending physicians, hallucination rate, threshold below 1%, monthly.

**SaaS — `auto-respond-support-ticket`.** Inputs: ticket ID (pii), tenant ID (internal). Outputs: draft response (internal, destination: human — support agent reviews before send). Side effect: writes draft to ticket as internal note, reversible. Risk class: `low_impact_write`. Approvals: runtime none, change requires code review. Eval: agent acceptance rate above 70%, weekly.

## Common pitfalls

- **Vague sensitivity tags.** "Internal" is the lazy answer. PII, PHI, and PCI have specific definitions; use them when they apply.
- **Missing the untrusted-text-to-model flag.** Any input field whose value reaches a model prompt and originated outside your trust boundary is a prompt injection vector. Flag it now or pay later.
- **Eval criteria that cannot fail.** "Looks reasonable" is not a metric. If the eval cannot return a number that crosses a threshold, the skill cannot graduate on the Maturity Ladder.
- **Skill version drifts from contract version.** When the skill changes, the contract must change. Bump the contract semver in the same PR.
- **Treating the contract as documentation.** It is enforcement. Gateways, policy engines, and CI consume it; if it is wrong, the system is wrong.

## Next step

Once the contract exists and is committed, invoke `innorve-maturity-gate` (IM-05) to evaluate which level the skill belongs at on the Maturity Ladder. New contracts almost always start at Incubating.

## Further reading

- The Innorve Method, IM-04: https://innorve.academy/method#im-04
- JSON Schema, Draft 2020-12: https://json-schema.org/draft/2020-12/release-notes
- OpenAPI 3.1 specification (for inspiration on the dependency and security blocks).

## Why this matters

A skill without a contract is a skill that nobody can audit, version, or safely call from another system. The contract pins down the questions that always get asked late: "what does this read," "what does it write," "who approved that," "what evidence do we have." Authoring the contract while the skill is fresh in the author's head is an order of magnitude cheaper than reconstructing it six months later from logs and Slack threads.

## What this is NOT

- This is not a code generator. It does not write the skill's implementation.
- This is not a runtime enforcement engine. It declares the contract; IM-06 (Policy as Code) enforces it.
- This is not an OpenAPI replacement. Skills with HTTP surfaces still need an OpenAPI spec — the Skill Contract sits above it.
- This is not a substitute for tests. The eval block declares what is measured; it does not measure it.
