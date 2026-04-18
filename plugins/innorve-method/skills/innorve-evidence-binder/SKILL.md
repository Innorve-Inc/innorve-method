---
name: innorve-evidence-binder
description: Use when starting an AI system that will eventually face an audit, customer security review, or regulator. Scaffolds a Governance Binder — a folder layout and template set that the team fills in as they build, so evidence accumulates in lockstep with code rather than being reconstructed under deadline pressure.
---

# IM-03 — Evidence-by-Design Framework

## What this skill does

Produces a Governance Binder skeleton for an AI system: a folder layout plus filled-in templates for the artifacts auditors and security reviewers will eventually ask for. It scaffolds the structure; the team fills in the content as they build. The skill does not generate model cards, risk assessments, or eval reports for you — generated governance content fails real audits.

## When to invoke it

Invoke `innorve-evidence-binder` when any of these are true:

- You are starting a new AI system, agent, or skill that will run in a regulated context (banking, healthcare, public sector, EU operations, anything subject to SOC 2 or ISO 27001).
- A customer or auditor has asked for a model card, risk register, or "AI governance documentation" and you do not have a place to put it.
- You are about to graduate a skill from Incubating to Validated on the maturity ladder (see IM-05) and need an evidence trail.
- A team is shipping AI features but each one writes governance docs in a different format, in a different place, or not at all.

Do not invoke this skill for throwaway prototypes, internal-only experiments with no production path, or systems where the team has already adopted a binder convention they want to keep.

## Where it sits in the Innorve Method

IM-03 follows IM-01 (Method overview) and IM-02 (Skill Architecture). It produces the container that IM-04 (Skill Contract Schema), IM-05 (Maturity Gate), IM-06 (Policy as Code), IM-07 (Multi-Tool Orchestration), and IM-08 (Tenant-Aware Patterns) all write artifacts into. Treat the binder as the spine of every later skill in the Method — without it, the other skills produce loose paper.

## The coaching flow

Use AskUserQuestion at each step. Do not skip ahead. Each answer narrows the scaffold.

1. **Scope the system.** Ask: what is the system's name, the team that owns it, and a one-paragraph description of what it does and who uses it. Refuse vague answers like "AI assistant" — push for "loan underwriting copilot used by 40 commercial credit analysts at FirstFed."
2. **Identify the regulatory surface.** Ask which of the following apply: SOC 2 (Trust Services Criteria, 2017 + 2022 revisions), HIPAA (45 CFR 164), EU AI Act risk tier (prohibited / high / limited / minimal), NIST AI RMF 1.0 functions (Govern / Map / Measure / Manage), GLBA, PCI DSS, FFIEC guidance, FedRAMP, or "none yet." Multi-select. If the user says "none," ask whether the system processes regulated data even if no framework is named.
3. **Identify the data surface.** Ask what categories of data the system reads, writes, or sees: PII, PHI, financial account data, employee data, source code, customer support transcripts, regulator correspondence. This determines which sections of the model card and risk register get expanded templates versus stubs.
4. **Identify decision impact.** Ask whether outputs are advisory (human always in loop), assistive (human reviews before action), or autonomous (system acts without per-event human review). Autonomous systems get an expanded approval and rollback section.
5. **Pick a binder location.** Default: `governance/<system-name>/` at the repo root. Confirm the user wants this path. If the system spans repos, ask whether the binder lives in the system-of-record repo or a dedicated governance repo.
6. **Generate the scaffold.** Write the folder structure and templates described below. Do not invent values. Every field that the team must fill in should appear as `TODO(owner): <what to write here>` so grep finds gaps later.
7. **Set ownership.** Ask for the named owner for each artifact: model card, risk register, eval report, prompt register, audit trail config, deployment notes. "The team" is not an owner — push for a person.

## The artifact produced

A folder at the chosen path with this layout:

```
governance/<system-name>/
  README.md                    # binder index, owners, last-reviewed dates
  model-card.md                # model card template (Mitchell et al. 2019 structure)
  risk-register.md             # threats, likelihood, impact, mitigations, residual risk
  evals/
    eval-plan.md               # what is measured, how, on what data, by whom
    reports/                   # one file per eval run, append-only
  prompts/
    prompt-register.md         # registered prompts with version, owner, eval status
    versions/                  # one file per prompt version, append-only
  audit-trail/
    config.md                  # what is logged, retention, access, redaction
    schemas/                   # JSON Schema for each event type
  deployment/
    deployment-notes.md        # environments, gates, rollback procedure
    runbook.md                 # on-call procedures
  approvals/                   # one file per approval, append-only
  CHANGELOG.md                 # binder-level changelog
```

Each template contains the section headings the auditor expects, prefilled `TODO(owner)` markers, and inline citations to the relevant clause in SOC 2, HIPAA, EU AI Act Annex IV, or NIST AI RMF.

## Worked examples

**Banking — loan underwriting copilot.** SOC 2 + GLBA + FFIEC. Data: PII, financial account data, internal credit memos. Decision impact: assistive (analyst reviews before approval). Binder lives in `governance/credit-copilot/`. Risk register expands the "discriminatory impact" and "concept drift on macro shifts" sections; model card requires fairness slice reporting; audit trail captures every model output the analyst saw and what they did with it. Eval plan references FFIEC SR 11-7 model risk management language.

**Healthcare — clinical note summarizer.** HIPAA + SOC 2 + state law. Data: PHI. Decision impact: advisory (clinician reviews before signing the note). Binder lives in `governance/note-summarizer/`. Risk register expands the "hallucinated clinical fact" and "incorrect medication summary" sections; audit trail captures the source note hash, the summary, the clinician edit diff, and the sign-off. Eval plan requires evaluation against a human-graded reference set with named clinical reviewers.

**SaaS — internal RAG over customer support tickets.** SOC 2 only. Data: customer PII inside ticket bodies. Decision impact: advisory. Binder lives in `governance/support-rag/`. Risk register focuses on cross-tenant leakage and prompt injection from ticket content. Audit trail captures retrieval hits per query for later replay. Eval plan is lighter — answer accuracy on a 200-question internal set, run weekly.

## Common pitfalls

- **Filling in templates yourself.** Do not. A model card written by the assistant, on behalf of a team that did not measure the model, is worse than no model card. It is evidence that the team does not know what its system does.
- **One binder for many systems.** Each AI system gets its own binder. Shared binders collapse into nothing the first time an auditor asks "show me the model card for system X."
- **Treating the binder as a one-time deliverable.** The binder is append-only and grows with the system. The CHANGELOG and `last-reviewed` dates exist to make staleness visible.
- **Confusing the binder with the threat model.** The risk register lives in the binder. The threat model lives upstream and feeds the risk register. Keep them separate documents.

## Next step

After the binder is scaffolded and owners are assigned, invoke `innorve-skill-contract` (IM-04) to author the Skill Contract for each AI skill the system exposes. The Skill Contract is the machine-readable companion to the model card and lives next to the binder.

## Further reading

- The Innorve Method, IM-03: https://innorve.academy/method#im-03
- Mitchell et al., "Model Cards for Model Reporting," FAT* 2019.
- NIST AI Risk Management Framework 1.0 (NIST AI 100-1), January 2023.
- EU AI Act, Annex IV (technical documentation requirements for high-risk systems).

## Why this matters

The Innorve Method assumes governance evidence is built alongside code, not reconstructed for an audit. Teams that wait until the audit accumulate two debts at once: the missing artifacts, and the missing memory of what the system was doing six months ago. The binder is the cheapest possible insurance against both. It costs an hour to scaffold and saves weeks at the worst possible time.

## What this is NOT

- This is not a model card generator. It does not write your model card.
- This is not a compliance certification. It does not make you SOC 2, HIPAA, or EU AI Act compliant.
- This is not a substitute for legal or compliance review. The templates encode common requirements; your auditor decides what is sufficient.
- This is not a replacement for IM-04 (Skill Contracts) or IM-06 (Policy as Code). The binder holds human-readable evidence; contracts and policies are the machine-enforced controls.
