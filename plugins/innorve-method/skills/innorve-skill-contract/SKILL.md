---
name: innorve-skill-contract
description: Use when authoring a new AI skill or agent capability that will be called by other systems, exposed to users, or shipped to production. Walks the author through a structured wizard and emits a Skill Contract — a machine-readable file conforming to the open Innorve Skill Contract Schema v0.1 that declares inputs, outputs, evidence, side effects, risk class, approvals, and eval criteria. Trigger on phrases like "publish this skill," "register this agent capability," "what does this tool actually do," or "we need to declare this for the gateway."
---

# IM-04 — Skill Contract Schema

*Decompose the work before you call a model, and name the human accountable before granting the agent any authority.*

## What this skill does

An interactive wizard that walks the author of a new AI skill through the questions a reviewer, an auditor, or a future on-call engineer will eventually ask, and emits a Skill Contract file conforming to **Innorve Skill Contract Schema v0.1**. The contract is the machine-readable companion to a skill's documentation: callers, gateways, and policy engines (see IM-06) read it to decide whether and how to invoke the skill, and the Maturity Gate (see IM-05) reads it to decide whether the skill is allowed to graduate.

The schema is an open spec maintained at `/spec/skill-contract` in the Innorve Method repository. Implementations may extend it but must not break the v0.1 surface.

## When to invoke it

Invoke `innorve-skill-contract` when:

- You are creating a new skill, tool, agent capability, or workflow that other systems or users will call.
- You are about to publish a skill to a shared registry, internal catalog, or marketplace.
- A skill has drifted: its actual behavior no longer matches its declared inputs, outputs, or side effects, and the contract must be re-authored.
- You are graduating a skill from Incubating to Validated on the Maturity Ladder (see IM-05) and the gate review found the contract missing or stale.
- A new caller (another agent, a scheduled job, a public API) needs to invoke an existing skill and the existing contract does not declare that caller class.

Do not invoke for one-off scripts, throwaway prototypes, or experiments behind feature flags that will never be called externally.

## Where it sits in the Innorve Method

IM-04 follows IM-03 (Evidence Binder) and produces an artifact that IM-05 (Maturity Gate Model), IM-06 (Policy as Code), and IM-07 (Multi-Tool Orchestration) all consume. The Skill Contract is the smallest unit of trust in the Method — every later skill assumes a contract exists, is current, and is enforceable. A skill without a contract cannot be graduated, governed, or composed.

## The coaching flow

Use AskUserQuestion at each step. Resist the temptation to fill in plausible defaults — a default that becomes a wrong contract is worse than no contract at all.

1. **Identity.** Ask for the skill name (kebab-case), version (semver), one-line summary, owning team, and primary on-call contact. Reject names like "helper" or "utils" — push for a verb-noun form such as `summarize-incident` or `route-loan-application`.
2. **Intended caller.** Ask who calls this skill: end users, other agents, scheduled jobs, public API. Multi-select. If "other agents," ask which ones by name — agent-to-agent calls have their own trust questions.
3. **Inputs.** For each input field, capture: name, type (use JSON Schema primitive types or named domain types from the binder), required vs optional, sensitivity tag (`public`, `internal`, `pii`, `phi`, `pci`, `secret`), and a one-line description. Ask whether any input field can carry untrusted text that will reach a model — flag those for IM-08 (Tenant-Aware Patterns) review.
4. **Outputs.** For each output field, capture: name, type, sensitivity tag, and whether the output is shown to a human, written to a system of record, or passed to another skill. Outputs passed to other skills become the inputs of those skills — keep the chain consistent.
5. **Evidence requirements.** Ask what must be logged for every invocation: inputs, outputs, prompt version, model name and version, retrieval hits, tool calls, latency, cost. Ask the retention period and the access control. This block plugs directly into the binder's `audit-trail/` folder.
6. **Side effects.** Ask whether the skill writes to any system of record, sends external communication, modifies state, or spends money. List each side effect with a target system and whether it is reversible. An irreversible side effect changes the approvals conversation in step 9.
7. **Dependencies.** List models, tools, retrievers, external APIs, and other skills this skill calls. Capture version pins where possible. Ask the user to name a fallback for each model dependency — Native Mode tenet 5 (Portability before tool lock-in) starts here.
8. **Risk class.** Pick one: `read-only`, `low-impact-write`, `high-impact-write`, `irreversible`, `regulated-decision`. Map to the EU AI Act risk tier if applicable.
9. **Required approvals.** For each risk class above `low-impact-write`, ask which approvals are required at runtime: none, single human approval, dual control, named role, change advisory board. This becomes a policy assertion in IM-06 — Native Mode tenet 6 lives in this block.
10. **Eval criteria.** Ask: what set of inputs is the skill evaluated on, what metric is computed, what threshold must it meet, how often does it run, and where do the results land. The eval contract here ties directly to the binder's `evals/eval-plan.md`. A skill without a passing eval cannot graduate.
11. **Emit the file.** Write a YAML file at the path the user specifies (default: `governance/<system-name>/contracts/<skill-name>.yaml`) that conforms to the schema below.

## Inputs

The skill formally collects:

- Skill identity (name, version, summary, team, on-call)
- Intended caller classes
- Input fields with type, required-flag, sensitivity tag, untrusted-to-model flag
- Output fields with type, sensitivity tag, destination
- Evidence-logging requirements and retention
- Side effects with target and reversibility
- Dependencies (models, tools, retrievers, APIs, downstream skills) with versions and named fallbacks
- Risk class and EU AI Act tier
- Approval requirements at runtime and at change time
- Eval dataset, metric, threshold, cadence, and results path

## Outputs

The skill produces:

- A YAML file conforming to Innorve Skill Contract Schema v0.1
- File placed at the canonical contract path inside the binder
- A bumped semver if an existing contract was re-authored
- A CHANGELOG entry in the binder noting the new or updated contract

## The artifact produced

A YAML file conforming to **Innorve Skill Contract Schema v0.1**, the open spec at `/spec/skill-contract`. The schema, expressed as YAML:

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
  models: [{name: <id>, version: <pin>, fallback: <id>}]
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

The full JSON Schema, conformance notes, and extension guidance live at `/spec/skill-contract` in the Innorve Method repository.

## Quality rubric

A Skill Contract is "done well" when all of the following hold:

| # | Criterion | How to check |
|---|-----------|--------------|
| 1 | The contract validates against the v0.1 JSON Schema | Run the spec validator in CI |
| 2 | Every sensitivity tag is `pii`, `phi`, `pci`, or `secret` where it applies — not `internal` by default | Manual review against the data surface |
| 3 | Every input that reaches a model has the `untrusted_text_to_model` flag set explicitly | Grep for missing flags on string inputs |
| 4 | Every irreversible side effect maps to an approval stronger than `none` | Cross-check side_effects vs approvals.runtime |
| 5 | The eval block names a dataset, metric, threshold, and cadence — none are placeholders | Reviewer can run the eval from the contract alone |
| 6 | Every model dependency has a named fallback | Portability is declared, not aspirational |
| 7 | The contract version matches the skill's actual current behavior | If they diverge, the contract is stale |

## Failure mode checklist

The contract must be re-authored (not edited inline) when any of these are true:

- A side effect was added to the skill but the contract still says `read_only`.
- A new input field was added that carries untrusted text to a model and the contract does not flag it.
- The eval threshold was lowered without an eval-plan update in the binder.
- The model dependency changed and no fallback is named.
- The on-call contact has left the team and no successor is listed.
- The contract was generated by an LLM and never reviewed by a human — the human-review record is the contract's first audit artifact.

## Regulated environment extension

When a skill operates inside a regulated context, add the following to the wizard:

- **EU AI Act high-risk tier.** Require the contract to reference the corresponding Annex IV section in the binder, name the conformity-assessment owner, and pin a model fallback that is also Annex-IV-eligible.
- **HIPAA.** All input or output fields containing PHI must use the `phi` sensitivity tag. The evidence block must specify retention compatible with the HIPAA Security Rule (and the team's BAA with the model vendor must be in place — link it in the binder's `hipaa/` folder).
- **GLBA.** Require the audit trail to capture the customer identifier and the decision rationale for any output that affects a customer's access to a financial service.
- **SOC 2.** Tag the contract with the Trust Services Criteria it supports; the auditor's PBC list will reference contracts by name.
- **PCI DSS.** A skill that touches cardholder data needs an additional approval gate and a stricter retention policy. Escalate to the PCI lead before publishing.

## Public portfolio instruction

After the contract is committed, share it as evidence of Mode practice:

- Add the artifact to your public GitHub at `/governance/<system-name>/contracts/<skill-name>.yaml` (anonymize internal names if needed).
- Link the contract from your project README under "Skills declared."
- When the contract is updated, bump the semver in the same PR as the implementation change. The diff is a teaching artifact — reviewers see exactly what changed in the trust surface.

## Worked examples

**Banking — `route-loan-application` (a regional credit union with 200K members).** Inputs: applicant ID (pii), product code (internal), branch ID (internal). Outputs: routed underwriter ID (internal), reasoning trace (internal, destination: system of record). Side effect: writes routing decision to the loan origination system, reversible within 24h. Risk class: `high_impact_write`. Approvals: runtime none (deterministic policy), change requires risk review. Eval: 500 historical applications, accuracy vs. underwriter manager re-routes, threshold 92%, weekly. Model dependencies pin a primary and one named fallback.

**Healthcare — `summarize-clinical-note` (a hospital network operating in three states).** Inputs: note ID (phi), specialty (internal). Outputs: summary text (phi, destination: human — clinician). Untrusted text to model: yes (the note body — flag set). Side effect: none — output is read-only until the clinician signs. Risk class: `read_only`. Approvals: runtime none, change requires clinical informatics sign-off. Eval: 200 notes graded by attending physicians, hallucination rate, threshold below 1%, monthly. BAA with model vendor linked from binder.

**SaaS — `auto-respond-support-ticket` (a B2B SaaS company in the contract-lifecycle space).** Inputs: ticket ID (pii), tenant ID (internal). Outputs: draft response (internal, destination: human — support agent reviews before send). Side effect: writes draft to ticket as internal note, reversible. Risk class: `low_impact_write`. Approvals: runtime none, change requires code review. Eval: agent acceptance rate above 70%, weekly. Tenant ID is required so IM-08 (Tenant-Aware Patterns) can scope retrieval.

## Common pitfalls

The Skill Contract is the smallest unit of trust in the Method. Most failures are failures of precision.

- **Vague sensitivity tags.** "Internal" is the lazy answer. PII, PHI, PCI, and secret have specific definitions — use them when they apply. The downstream policy engine cannot make a different decision than the tag tells it to.
- **Missing the untrusted-text-to-model flag.** Any input field whose value reaches a model prompt and originated outside your trust boundary is a prompt injection vector. Flag it now or pay later. The first prompt injection incident is always traceable to a missing flag.
- **Eval criteria that cannot fail.** "Looks reasonable" is not a metric. If the eval cannot return a number that crosses a threshold, the skill cannot graduate on the Maturity Ladder, and the contract is not a contract — it is a wish.
- **Skill version drifts from contract version.** When the skill's behavior changes, the contract must change. Bump the contract semver in the same PR as the implementation. A skill at v1.4 with a contract at v1.0 is a trust violation, not a paperwork problem.
- **Treating the contract as documentation.** It is enforcement. Gateways, policy engines, and CI consume it; if it is wrong, the system is wrong. Documentation lives in markdown; the contract lives in YAML and is read by machines.
- **Generating the contract and shipping it unread.** The contract is the human's commitment. An LLM can draft it, but a human must sign it. The signing is the artifact.

## Innorve Native Mode tenets this skill operationalizes

- **Tenet 1 — Architect before automating.** The contract forces the author to decompose the skill into named, typed, individually testable surfaces before the skill is exposed. A skill without a contract has not been architected; it has been written.
- **Tenet 6 — Human accountability before agent autonomy.** The `owner`, `approvals`, and `risk_class` blocks make the accountable human visible. The agent's authority is bounded by the contract; expansion of authority requires a contract change.
- **Tenet 5 — Portability before tool lock-in.** The `dependencies.models[].fallback` field forces the author to name the replacement before they need it.

## Next step

Once the contract exists and is committed, invoke `innorve-maturity-gate` (IM-05) to evaluate which level the skill belongs at on the Maturity Ladder. New contracts almost always start at Incubating; they earn the next level by accumulating evidence the gate can read.

## Further reading

- The Innorve Method, IM-04: https://innorve.academy/method#im-04
- Innorve Skill Contract Schema, open spec: `/spec/skill-contract` in the Innorve Method repository.
- Innorve Native Mode: https://github.com/Innorve-Inc/innorve-method/blob/main/docs/INNORVE-NATIVE-MODE.md
- JSON Schema, Draft 2020-12: https://json-schema.org/draft/2020-12/release-notes
- OpenAPI 3.1 specification — for HTTP-surface skills, the OpenAPI document is the wire spec; the Skill Contract sits above it.

## Why this matters

A skill without a contract is a skill that nobody can audit, version, or safely call from another system. The contract pins down the questions that always get asked late — what does this read, what does it write, who approved that, what evidence do we have. Authoring the contract while the skill is fresh in the author's head is an order of magnitude cheaper than reconstructing it six months later from logs and chat threads. The contract is also the single artifact every later skill in the Method depends on; without it, the Maturity Gate has nothing to grade, the Policy as Code engine has nothing to enforce, and the Multi-Tool Orchestrator has no basis on which to compose.

## What this is NOT

- This is not a code generator. It does not write the skill's implementation.
- This is not a runtime enforcement engine. It declares the contract; IM-06 (Policy as Code) enforces it.
- This is not an OpenAPI replacement. Skills with HTTP surfaces still need an OpenAPI spec — the Skill Contract sits above it.
- This is not a substitute for tests. The eval block declares what is measured; CI measures it.
- This is not a one-time event. The contract is versioned alongside the skill and is re-authored when behavior changes.

---

If you find yourself wishing for a peer who could review your first three contracts before they enter your gateway — that is what Cohort 1 of the Innorve Academy bootcamp is for. Apply at https://innorve.academy/apply.
