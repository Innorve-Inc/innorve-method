---
name: innorve-tenant-aware
description: Use when designing or operating an AI system and the right architectural posture is unclear — startup (lightweight), enterprise (formal controls), or regulated (strict approvals + immutable evidence). Coaches the user through environment, data classification, approval flow, and audit requirements, then produces a Tenant Posture Card that documents which posture applies and what it requires.
---

# IM-07 — Tenant-Aware Design

A coaching skill. You will not pick the posture for the user. You will ask the questions that make the posture obvious to them, then have them write it down so the rest of the team can argue with it.

## What this skill does

It walks the user through choosing one of three architectural postures for an AI system and writing the choice down in a way other engineers, security, and risk can review:

- **Startup posture** — lightweight controls, fast iteration, single environment is acceptable, evidence is informal, the cost of a bad decision is recoverable.
- **Enterprise posture** — formal controls, separated environments, change management is real, evidence is written down, the cost of a bad decision is reputational and contractual.
- **Regulated posture** — strict approval flow, immutable evidence, named accountable humans for every model decision, the cost of a bad decision is regulatory action or harm to people.

The posture is not a quality grade. A startup posture is the right answer for many products. The wrong answer is using a startup posture in a regulated environment, or wrapping a startup product in enterprise ceremony for no reason.

## When to invoke it

Invoke this skill when:

- A team is about to commit to an architecture for an AI feature and the level of control is being argued informally.
- A product moves from internal use to customer-facing, or from one tenant class to another (e.g., a SaaS tool is being sold into a bank).
- An auditor or buyer asks "what controls are in place" and the answer is improvised.
- Two reasonable engineers on the same team disagree about how much process is appropriate.

Do not invoke it for one-off scripts, internal experiments with no production exposure, or research notebooks. Posture is for systems that will keep running.

## Where it sits in the Innorve Method

IM-07 sits between **IM-06 (Capability Graph)** and **IM-08 (Multi-Tool Strategy)**.

- The Capability Graph tells you what capabilities exist and where humans stay in the loop.
- The Tenant Posture Card tells you how heavy the controls around those capabilities have to be.
- The Multi-Tool Decision (IM-08) then picks models and frameworks that can actually meet the posture.

Posture also constrains **IM-03 (Evidence Binder)** and **IM-04 (Policy-as-Code)**: a regulated posture demands both; a startup posture may defer both.

## The coaching flow

Drive the conversation. Use `AskUserQuestion` for each block. Do not let the user skip a block.

1. **Establish the tenant.** Ask the user to name the actual tenant — not the product, the tenant. "BECU's loan origination department" is a tenant. "A SaaS app" is not. Multi-tenant systems may need one card per tenant class.

2. **Environment requirements.** Ask:
   - How many environments are required (dev, staging, prod, isolated)?
   - Are environments allowed to share data, secrets, or models?
   - Is network isolation required (VPC, private endpoint, sovereign region)?
   - Is BYO-cloud or BYO-key (KMS, HSM) required?

3. **Data classification.** Ask:
   - What is the most sensitive data class the system will touch (public, internal, confidential, restricted, regulated PII/PHI/PCI)?
   - Where can model providers see prompt and output content? (E.g., Anthropic API vs Bedrock vs on-prem.)
   - What is the retention requirement for prompts, outputs, and evals?
   - Are there data residency requirements (US, EU, in-country)?

4. **Approval flow.** Ask:
   - Who approves a new prompt or skill before it reaches users?
   - Who approves a model version change?
   - Is a four-eyes (two-human) approval required for any class of change?
   - Are approvals logged in a system of record, or in chat?

5. **Audit and evidence.** Ask:
   - Are decisions made by AI required to be reproducible after the fact?
   - Is the evidence immutable (append-only log, hashed, signed)?
   - How long must evidence be retained?
   - Who is the named accountable human for each AI decision class?

6. **Choose the posture.** Based on the answers, the posture is usually obvious. If the user is on the line between two postures, default up — the cost of over-controlling a startup feature is small; the cost of under-controlling a regulated one is not.

7. **Write the card.** Ask the user to produce a Tenant Posture Card — a single Markdown file with the posture name, the tenant, the answers to the four blocks above, the named accountable owner, and the review date.

## The artifact produced

A `tenant-posture-card.md` file with this structure:

```
# Tenant Posture Card

Tenant: <tenant name>
Posture: Startup | Enterprise | Regulated
Owner: <named human>
Review date: <quarterly>

## Environment
- Required environments: ...
- Network isolation: ...
- BYO-cloud / BYO-key: ...

## Data classification
- Highest data class touched: ...
- Provider exposure: ...
- Retention: ...
- Residency: ...

## Approval flow
- Prompt / skill changes: ...
- Model version changes: ...
- Four-eyes required for: ...
- Logged in: ...

## Audit and evidence
- Reproducibility required: ...
- Evidence immutability: ...
- Retention: ...
- Named accountable human(s): ...
```

The card lives in the repo. It is reviewed when the tenant changes, when the data class changes, or quarterly — whichever comes first.

## Worked examples

**Banking — community bank fraud triage assistant (Regulated posture).**
Tenant is a regulated FI. Data class is restricted (account-level + PII). Provider exposure must be VPC-bounded — Anthropic via Bedrock in a private subnet, no third-party retention. Three environments, network isolation enforced, BYO-KMS. Every prompt change goes through a four-eyes approval logged in the change management system. Every model decision is reproducible from immutable evidence retained for seven years. Named accountable human is the BSA Officer.

**Healthcare — provider group documentation assistant (Regulated posture).**
Tenant is a HIPAA-covered entity. Data class is PHI. Provider exposure is restricted to a HIPAA-eligible deployment (e.g., Bedrock in a HIPAA-eligible account with a BAA, or Azure OpenAI under a BAA). Two environments minimum, residency US-only. Approvals run through clinical informatics. Evidence retained per state record-retention rules. Named accountable human is the CMIO.

**SaaS — internal product analytics summariser (Startup posture).**
Tenant is the company itself. Data class is internal-only. Provider exposure is acceptable on the standard Anthropic API with zero retention requested. One production environment. No four-eyes — the engineer who wrote the prompt can deploy it. Evidence is the git log. Review quarterly. The card explicitly says: "if this product is ever exposed to a customer, re-run IM-07 before the change ships."

## Common pitfalls

- **Picking the posture before answering the questions.** The questions exist so the posture is forced by the answers, not chosen by preference.
- **Mixing postures inside one system.** If a single system handles regulated data in one path and internal-only data in another, the whole system inherits the higher posture for shared infrastructure.
- **Treating posture as a one-time decision.** Tenants change. Data classifications change when a single new field is added. Re-run when triggers fire.
- **Confusing posture with vendor.** Posture is about controls, not about which cloud or model. The same vendor can serve all three postures with different deployment topologies.
- **No named human.** A posture card without a named accountable human is decorative.

## Next step

Once the Tenant Posture Card is committed, move to **IM-08 (Multi-Tool Strategy)** to pick the model + framework + deployment combination that can meet the posture for each capability in the IM-06 Capability Map.

## Further reading

- IM-03 — Evidence Binder (how to actually produce immutable evidence in a regulated posture)
- IM-04 — Policy-as-Code (how to express posture controls in code, not in a PDF)
- IM-06 — Capability Graph (the input that tells you which capabilities the posture must cover)

## Why this matters

Most production AI failures are not model failures. They are posture mismatches — a startup-posture system shipped into a regulated tenant, or an enterprise-posture system stapled onto an experiment that needed to move fast. Naming the posture early forces the controls to match the environment, and forces the team to admit when an environment has changed underneath the system.

## What this is NOT

- Not a quality grade. Startup posture is the correct answer for many products.
- Not a substitute for legal or compliance review. It is the input to those conversations.
- Not a tool choice. Posture constrains tool choice; IM-08 makes the tool choice.
- Not a one-time artifact. It is reviewed on tenant or data-class changes, and at least quarterly.
- Not a replacement for the user thinking. The skill coaches; the user writes the card.
