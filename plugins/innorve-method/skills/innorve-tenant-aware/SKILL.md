---
name: innorve-tenant-aware
description: Use when designing or operating an AI system and the right architectural posture is unclear — startup (lightweight), enterprise (formal controls), or regulated (strict approvals + immutable evidence). Coaches the user through environment, data classification, approval flow, and audit requirements, then produces a Tenant Posture Card that documents which posture applies and what it requires.
---

# IM-07 — Tenant-Aware Design

> *Express the policy in code before the system grows past one user; name the human who is accountable before granting the agent the authority.*

## What this skill does

It walks the user through choosing one of three architectural postures for an AI system and writing the choice down in a way other engineers, security, and risk can review. The posture is not a quality grade; the wrong answer is using a startup posture in a regulated environment, or wrapping a startup product in enterprise ceremony for no reason.

This is a coaching skill. You will not pick the posture for the user. You will ask the questions that make the posture obvious to them, then have them write it down so the rest of the team can argue with it.

## When to invoke it

Invoke this skill when:

- A team is about to commit to an architecture for an AI feature and the level of control is being argued informally.
- A product moves from internal use to customer-facing, or from one tenant class to another (for example, a SaaS tool being sold into a bank).
- An auditor or buyer asks "what controls are in place" and the answer is improvised.
- Two reasonable engineers on the same team disagree about how much process is appropriate.

Do not invoke it for one-off scripts, internal experiments with no production exposure, or research notebooks. Posture is for systems that will keep running.

## Where it sits in the Innorve Method

IM-07 sits between **IM-06 (Capability Graph)** and **IM-08 (Multi-Tool Strategy)**.

- The Capability Graph tells you what capabilities exist and where humans stay in the loop.
- The Tenant Posture Card tells you how heavy the controls around those capabilities have to be.
- The Multi-Tool Decision (IM-08) then picks models and frameworks that can actually meet the posture.

Posture also constrains **IM-03 (Evidence Binder)** and **IM-04 (Policy-as-Code)**: a regulated posture demands both; a startup posture may defer both with a written trigger for when they become required.

## The coaching flow

Drive the conversation. Use `AskUserQuestion` for each block. Do not let the user skip a block.

1. **Establish the tenant.** Ask the user to name the actual tenant — not the product, the tenant. "A regional credit union's loan origination department" is a tenant. "A SaaS app" is not. Multi-tenant systems may need one card per tenant class.

2. **Environment requirements.** Ask:
   - How many environments are required (dev, staging, prod, isolated)?
   - Are environments allowed to share data, secrets, or models?
   - Is network isolation required (VPC, private endpoint, sovereign region)?
   - Is BYO-cloud or BYO-key (KMS, HSM) required?

3. **Data classification.** Ask:
   - What is the most sensitive data class the system will touch (public, internal, confidential, restricted, regulated PII/PHI/PCI)?
   - Where can model providers see prompt and output content (direct API vs hyperscaler-hosted vs on-prem)?
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

## Inputs

The skill asks the user for:

- A named tenant (not a product name).
- Environment topology (count, isolation, key custody).
- Highest data class touched, with provider exposure boundary.
- Approval flow per change class.
- Audit and evidence requirements, with retention.
- A named accountable human per AI decision class.

## Outputs

The skill produces, by the user's hand:

- A posture decision: Startup, Enterprise, or Regulated.
- A Tenant Posture Card (Markdown file).
- A list of triggers that force a re-run of IM-07.
- A quarterly review date on a real calendar.

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

## Re-run triggers
- ...
```

The card lives in the repo. It is reviewed when the tenant changes, when the data class changes, or quarterly — whichever comes first.

## Quality rubric

A Tenant Posture Card is ready for review when all of the following are true:

| Criterion | Pass condition |
|-----------|----------------|
| Tenant naming | A specific organisation or class of organisation, not a product label |
| Posture choice | One of Startup, Enterprise, Regulated — chosen after the questions, not before |
| Environment block | Environment count, isolation, and key custody all answered |
| Data block | Highest class, provider exposure, retention, and residency all answered |
| Approval block | Approver named per change class; logging surface named (system of record, not chat) |
| Evidence block | Reproducibility, immutability, retention, and accountable human all named |
| Owner | A real person, not a team mailbox or role title alone |
| Re-run triggers | At least three written down |

## Failure mode checklist

Before the user commits the card, check:

- [ ] The tenant is a tenant, not a product.
- [ ] The posture was chosen after answering the questions, not before.
- [ ] Every accountable human is named (a role title alone is not enough).
- [ ] The retention period is a number with units, not a vague phrase.
- [ ] The provider exposure boundary is a deployment shape, not a vendor name alone.
- [ ] At least three re-run triggers are written down (data-class change, tenant change, regulatory change at minimum).
- [ ] The card is in the repo, not in a slide deck.

## Regulated environment extension

In regulated environments (FFIEC-supervised institutions, HIPAA-covered entities, EU AI Act high-risk systems, GLBA-covered financial data, PCI-DSS scope), the Regulated posture is the default and the card must additionally include:

- A reference to the relevant control framework (NIST AI RMF function mapping, ISO/IEC 42001 control mapping, or sectoral equivalent).
- A model risk management note citing how this system is treated under the institution's MRM policy.
- A pre-existing examiner or audit binder reference if one exists for the tenant.
- A named second-line reviewer (compliance, risk, or model risk function) in addition to the first-line accountable human.

A Regulated posture card without these fields is not a posture card; it is a draft.

## Public portfolio instruction

If the user is producing this artifact on non-confidential work, encourage them to publish a sanitised copy:

1. Replace the tenant name with a tenant class (e.g., "a regional credit union", "a community hospital", "a US-only B2B SaaS").
2. Keep the structure, the posture choice, and the rationale fields.
3. Strip any internal team names, vendor pricing, or contractually sensitive language.
4. Publish under `/method-portfolio/tenant-posture-cards/<tenant-class>.md` in the user's public repository.
5. Tag with `#innorve-method #IM-07`.
6. Submit the link to the Innorve Academy free community for peer review.

This is how the Mode is made visible — through the artifacts an architect leaves behind.

## Worked examples

**Banking — a regional credit union's fraud triage assistant (Regulated posture).**
Tenant is a regulated FI. Data class is restricted (account-level + PII). Provider exposure must be VPC-bounded — Claude via a hyperscaler private deployment in a private subnet, no third-party retention. Three environments, network isolation enforced, BYO-KMS. Every prompt change goes through a four-eyes approval logged in the change management system. Every model decision is reproducible from immutable evidence retained for seven years. Named accountable human is the BSA Officer; second-line reviewer is the Model Risk Management lead.

**Healthcare — a provider group documentation assistant (Regulated posture).**
Tenant is a HIPAA-covered entity. Data class is PHI. Provider exposure is restricted to a HIPAA-eligible deployment under a BAA. Two environments minimum, residency US-only. Approvals run through clinical informatics. Evidence retained per state record-retention rules. Named accountable human is the CMIO; second-line reviewer is the Privacy Officer.

**SaaS — an internal product analytics summariser (Startup posture).**
Tenant is the company itself. Data class is internal-only. Provider exposure is acceptable on the standard API with zero retention requested. One production environment. No four-eyes — the engineer who wrote the prompt can deploy it. Evidence is the git log. Review quarterly. The card explicitly says: "if this product is ever exposed to a customer, re-run IM-07 before the change ships."

## Common pitfalls

- **Picking the posture before answering the questions.** The questions exist so the posture is forced by the answers, not chosen by preference.
- **Mixing postures inside one system.** If a single system handles regulated data in one path and internal-only data in another, the whole system inherits the higher posture for shared infrastructure.
- **Treating posture as a one-time decision.** Tenants change. Data classifications change when a single new field is added. Re-run when triggers fire.
- **Confusing posture with vendor.** Posture is about controls, not about which cloud or model. The same vendor can serve all three postures with different deployment topologies.
- **No named human.** A posture card without a named accountable human is decorative.
- **Logging in chat.** "We Slack the change" is not a system of record. Approvals must land somewhere queryable.

## Innorve Native Mode tenets this skill operationalizes

- **Tenet 3 — Govern before scaling.** The card is the policy. It exists in the repo, in code-adjacent Markdown, before the system reaches a second user. Documentation that sits in a wiki gets forgotten the day the system grows.
- **Tenet 6 — Human accountability before agent autonomy.** The card forces every AI decision class to name the human who owns the consequences. Authority that no person stands behind never reaches the agent.

## Next step

Once the Tenant Posture Card is committed, move to **IM-08 (Multi-Tool Strategy)** to pick the model + framework + deployment combination that can meet the posture for each capability in the IM-06 Capability Map.

## Further reading

- Innorve Method index — `https://innorve.academy/method#im-07`
- IM-03 — Evidence Binder (how to actually produce immutable evidence in a regulated posture)
- IM-04 — Policy-as-Code (how to express posture controls in code, not in a PDF)
- IM-06 — Capability Graph (the input that tells you which capabilities the posture must cover)
- NIST AI RMF 1.0 — Govern function
- ISO/IEC 42001 — AI management system requirements
- EU AI Act — Title III obligations for high-risk systems

## Why this matters

Most production AI failures are not model failures. They are posture mismatches — a startup-posture system shipped into a regulated tenant, or an enterprise-posture system stapled onto an experiment that needed to move fast. Naming the posture early forces the controls to match the environment, and forces the team to admit when an environment has changed underneath the system.

## What this is NOT

- Not a quality grade. Startup posture is the correct answer for many products.
- Not a substitute for legal or compliance review. It is the input to those conversations.
- Not a tool choice. Posture constrains tool choice; IM-08 makes the tool choice.
- Not a one-time artifact. It is reviewed on tenant or data-class changes, and at least quarterly.
- Not a replacement for the user thinking. The skill coaches; the user writes the card.

---

If you find yourself wishing for a peer who could pressure-test your Tenant Posture Card before a regulator or enterprise buyer reads it — that is what Cohort 1 of the Innorve Academy bootcamp is for. Apply at `https://innorve.academy/apply`.
