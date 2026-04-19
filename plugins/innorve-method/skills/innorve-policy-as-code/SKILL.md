---
name: innorve-policy-as-code
description: Use when the user has a governance rule, compliance requirement, regulatory constraint, or internal policy expressed in prose and needs to make it machine-enforceable. Coaches the engineer through translating natural-language rules into version-controlled policy code with explicit applicability, enforcement, and audit hooks. Invoke when a system has named skills (IM-01) but governance still lives in PDFs, wikis, or "we just know." Do not invoke before IM-01 — there will be nothing to attach the policy to.
---

# IM-02 — Policy-as-Code Methodology

> *Govern before scaling: express the policy in code before the system grows past one user.*

## What this skill does

Coaches the engineer through turning a natural-language governance rule into a version-controlled, machine-enforceable policy specification. The output is a **Policy Specification** — a YAML or JSON document with rule definitions, applicability, enforcement points, exception handling, and audit hooks — that the runtime evaluates instead of the engineer remembering. The skill teaches the architect to encode what the canonical source actually says, no more and no less, and to wire the audit hook that turns the spec from documentation into evidence.

## When to invoke it

- The user has a written policy (a regulation, an internal control, a vendor contract) and asks how to enforce it.
- A skill keeps making the wrong call because the rule lives in a person's head, not in code.
- An auditor or risk reviewer asked: "How do you prove this rule is followed?"
- The team is about to hardcode a conditional like `if customer.state == "CA"` for the third time. Stop and run this skill.
- The same logic is duplicated across two or more skills, and each instance has drifted.

Do not invoke when the team has not yet produced a Skill Graph (IM-01). A policy needs a skill to attach to; without named skills, the spec's `enforcement.skill` field is uninhabited and the policy will end up scattered across whatever code happens to exist.

## Where it sits in the Innorve Method

IM-02 sits between IM-01 (skill architecture) and IM-04 (tenant-aware). Named skills are the precondition; tenant-scoped policy is the next layer. Many teams skip IM-02 and try to enforce policy in skill code directly; the result is policy logic spread across twenty files with no single source of truth and no audit story. Once IM-02 is done, IM-03 (skill contracts) can incorporate the policy decisions into the contract's failure-mode list, and IM-07 (evidence binder) can assemble the per-decision audit records into the artifact a regulator will accept.

The skill is the direct application of the third tenet of Innorve Native Mode: govern before scaling. Governance written in prose is forgotten the day the system grows; governance written as code survives staff changes, traffic spikes, and audit requests.

## The coaching flow

Do not let the user write any YAML until step 5. The first four steps are about understanding the rule.

### 1. Locate the canonical source

AskUserQuestion: *"Where does this rule live today? Paste the exact sentence or section."*

If the user gives you a paraphrase, push back. The Policy Specification will reference the canonical text — the regulation citation, the contract clause, the policy memo — by hash, so a future reviewer can re-derive the encoding. A spec encoded from a paraphrase is a spec that drifts the first time the prose is updated.

### 2. Identify the rule's three parts

Every enforceable rule has three parts. Make the user name them explicitly:

- **Applicability** — when does this rule apply? (Which tenants, regions, products, transaction types, user roles, time windows.)
- **Constraint** — what must be true (or false) when the rule applies?
- **Consequence** — what happens when the constraint is violated? (Block, warn, queue for human review, log only.)

If any of the three is unclear from the source text, that is a finding. Document the ambiguity. Do not encode a guess.

### 3. Find the decision points

AskUserQuestion: *"Walk through your skill graph. At which skill, and at which moment inside that skill, does this rule actually need to fire?"*

A rule typically attaches to one of three places: skill input validation, skill output validation, or a runtime-level pre-check before a tool call. Pick deliberately. The same rule enforced at the wrong point produces silent failures — the policy fires after the side effect has already occurred, or before the inputs that would have triggered it are available.

### 4. Identify exceptions and overrides

Real rules have exceptions. Real exceptions have approvers.

AskUserQuestion: *"Who can override this rule? Under what circumstances? What artifact records the override?"*

If the answer is "no one ever", capture that. If the answer is "the BSA officer in writing", that is part of the spec — the runtime needs to know what override evidence looks like and how to attach it to the audit trail. An override without recorded evidence is a control gap.

### 5. Draft the Policy Specification

Now write the YAML. Use the schema below. Be ruthless about not encoding what the prose did not say. Where the prose is silent, the spec should be silent or marked `unspecified`. The architect's job is encoding, not interpretation; interpretation belongs to compliance, legal, or risk and gets filed as a proposed amendment.

### 6. Write the negative tests first

For every rule, the user writes at least three test cases:

- A clear positive (the constraint holds, the action proceeds).
- A clear negative (the constraint is violated, the consequence fires).
- A genuine edge case from production data — the one the rule was probably written about.

If the user cannot produce three, the rule is not understood well enough to encode yet. Loop back to step 1. This is the application of Native Mode tenet 2 (evaluate before trusting) at the policy layer: the test predates the encoding.

### 7. Wire the audit hook

Every policy evaluation produces an audit record: the rule version, the input, the decision, the consequence, the override (if any), and the actor (human or skill) who triggered it. This is what IM-07 will assemble into the Evidence Binder later. The hook is non-negotiable — a policy without an audit hook is not enforceable, just reassuring.

## Inputs

The skill collects, in order:

1. The canonical source text of the rule (sentence or section, copy-pasted, not paraphrased).
2. The user's articulation of the rule's applicability, constraint, and consequence.
3. The skill (from the IM-01 graph) and enforcement point where the rule fires.
4. The override role, the override conditions, and the required override evidence.
5. At least three test cases (positive, negative, edge case from production).
6. The audit fields the runtime is required to record.

## Outputs

1. A **Policy Specification** artifact (YAML or JSON), one per rule.
2. A test suite executable against the policy engine.
3. A list of findings: ambiguities in the source text that compliance must resolve before the spec is final.
4. A list of skills (from the IM-01 graph) that the spec attaches to, with enforcement points named.

## The artifact produced

A **Policy Specification**, one YAML document per rule, stored next to the skill it governs. Reference shape:

```yaml
policy:
  id: bsa-ctr-threshold
  version: 1.2.0
  source:
    citation: "31 CFR 1010.311"
    excerpt_sha256: "9f2c…"  # hash of the canonical text checked into the repo
  applicability:
    tenants: ["*"]
    products: ["consumer-deposits", "business-deposits"]
    transaction_types: ["cash-deposit", "cash-withdrawal"]
    excludes:
      - "exempted-customer-list"  # references another policy id
  constraint:
    expression: "aggregate_cash_24h <= 10000_usd"
    aggregation:
      window: "24h"
      group_by: ["customer_id"]
  consequence:
    on_violation: "queue-for-ctr-filing"
    severity: "regulatory"
    sla_hours: 15  # business days converted per FinCEN guidance
  exceptions:
    override_role: "bsa-officer"
    evidence_required: ["written-justification", "ctr-exemption-form"]
    expires_after_days: 365
  enforcement:
    skill: "evaluate-transaction"
    point: "post-output"  # input | post-output | pre-tool-call
  audit:
    record:
      - decision
      - inputs.customer_id
      - inputs.aggregate_cash_24h
      - rule_version
      - actor
      - override_evidence_uri
    retention: "7y"
  tests:
    - name: "single deposit under threshold passes"
      input: { customer_id: "c1", aggregate_cash_24h: 9000 }
      expect: pass
    - name: "single deposit over threshold queues CTR"
      input: { customer_id: "c1", aggregate_cash_24h: 10500 }
      expect: queue-for-ctr-filing
    - name: "structured deposits aggregate"
      input: { customer_id: "c1", aggregate_cash_24h: 9999_then_500 }
      expect: queue-for-ctr-filing
```

YAML is the default. JSON is fine if the repo standard requires it. The schema does not change; the syntax does.

## Quality rubric

A Policy Specification is "done well" when all of the following hold:

| Criterion              | Pass condition                                                                                                       |
|------------------------|----------------------------------------------------------------------------------------------------------------------|
| Source-anchored        | The `source.citation` and `source.excerpt_sha256` resolve to a checked-in copy of the canonical text.                |
| Three-part complete    | Applicability, constraint, and consequence are each present; ambiguities are flagged, not guessed.                   |
| Versioned              | A semantic version is set; changes to the spec increment it; old versions remain queryable.                          |
| Enforcement-pointed    | The `enforcement.skill` exists in the IM-01 graph; the `enforcement.point` is one of the three accepted values.      |
| Override-evidenced     | Every override role has named evidence requirements; "manager approval" without an artifact does not count.          |
| Tested negatively      | At least three tests exist, including one negative and one production-derived edge case.                             |
| Audit-hooked           | The `audit.record` enumerates fields by name; "log everything" is a reject.                                          |
| Retention-set          | A retention period is set, either by regulation (e.g., 7y for BSA) or by an explicit organizational decision.        |
| Engine-portable        | Nothing in the spec hardcodes a specific policy engine; the spec is the source of truth, the engine is replaceable.  |

If any row fails, the spec is not yet shippable. Return to the relevant coaching step.

## Failure mode checklist

Trigger a redo when any of these appear:

- The source citation is a paraphrase or a link to a paraphrase, not the canonical text.
- One of the three parts (applicability, constraint, consequence) is missing.
- The version field is absent, or the spec has changed without the version incrementing.
- The override is a role with no evidence requirement.
- The test suite has only positive cases.
- The audit record is "log everything" rather than enumerated fields.
- A skill's code still contains an `if` statement that re-implements the rule the spec encodes.
- The same regulatory rule has been split into multiple specs because it touches multiple skills.

## Regulated environment extension

When the system handles regulated data, add the following to the spec authoring process:

- **Compliance sign-off field.** Add a `compliance_review` block with the reviewing role, the review date, and the version of the spec that was approved. A spec the architect wrote without compliance review is a draft.
- **Mapping to control framework.** Add a `controls` block listing the SOC 2 Common Criteria, HIPAA Security Rule subsection, EU AI Act article, NIST AI RMF subcategory, PCI DSS requirement, or NCUA chapter that the policy implements. The Evidence Binder (IM-07) joins on these identifiers; without them, the binder cannot produce framework-organized output.
- **Independent encoding review.** A second engineer (or compliance reviewer) re-encodes the spec from the canonical text without seeing the first encoding, then the two encodings are diffed. Any divergence is a finding. This is the policy-layer analog of red-team review and is the strongest check on the encoding's fidelity.
- **Override expiration enforced.** For high-risk overrides (any consequence with `severity: "regulatory"`), the `expires_after_days` field must be present and ≤ 365. An override that does not expire is a permanent exception, which is a different governance artifact and requires a different approval path.

## Public portfolio instruction

Each Policy Specification is a portfolio artifact in its own right. Add the spec, its tests, and the canonical source excerpt to the public GitHub repository at:

```
/governance/im-02/policies/<policy-id>/
  policy.yaml
  source-excerpt.txt
  tests/
```

For confidential policies, anonymize tenant identifiers and proprietary thresholds; the structure of the spec is the portfolio evidence, not the specific values. A reviewer should be able to read the spec, the source excerpt, and the tests, and reproduce the encoding decision without further context. Architects who publish a sequence of well-formed specs over time produce the strongest available evidence of L3 (Governed) practice.

## Worked examples

### Example 1 — A regional credit union with 200K members, CTR threshold

The team has the rule in a procedures manual: "Aggregate cash transactions of $10,000 or more in a 24-hour period must trigger a CTR filing within 15 business days." After IM-02:

- One Policy Spec, `bsa-ctr-threshold.yaml`, attached to the `evaluate-transaction` skill at the `post-output` enforcement point.
- The applicability section reveals the team had been silently exempting business deposits — a finding for the BSA officer to confirm or correct.
- The exception block records the path for a documented exempt customer (this is its own small policy, `bsa-ctr-exemption-list.yaml`, referenced by id).
- The audit hook is what later lets IM-07 produce the binder the examiner asks for without anyone digging through logs.
- The `controls` block maps the spec to NCUA examination chapter language so the binder organizes by examiner expectations.

### Example 2 — A hospital network operating in three states, out-of-network referrals

The rule reads: "The agent must not propose a specialist outside the patient's plan network unless the in-network wait exceeds 30 days." After IM-02:

- Policy Spec `network-coverage.yaml`, attached to the `propose-slots` skill at the `input` enforcement point (the slot list must already be filtered when proposed, not after).
- The 30-day exception becomes a structured override condition with `evidence_required: ["in-network-wait-report"]`, generated automatically by the `find-eligible-specialists` skill.
- The negative test catches a real production edge case: a patient with two active plans where the agent had been silently picking the first.
- The `controls` block maps to the relevant HIPAA Privacy Rule provision and to the contracted-payer narrow-network clause.

### Example 3 — A B2B SaaS company in the contract-lifecycle space, refund cap

The rule was a chat message from the CFO: "No automated refund over $500 without a human." After IM-02:

- Policy Spec `refund-cap.yaml`, attached to `apply-refund` at `pre-tool-call` (the gate must precede the payment-processor call, not the model draft).
- The override role is `billing-lead` and `cfo`. The evidence required is a ticket id with a link to the approval thread.
- The negative test surfaces that the system had previously treated currency conversion sloppily; a £450 refund would have skipped the gate. The encoded rule normalizes to USD before evaluating.
- The `controls` block maps to the company's SOC 2 CC6.1 control narrative and to the financial-controls section of the auditor's PBC list.

## Common pitfalls

- **Encoding the paraphrase, not the source.** Always anchor to the canonical text by hash. Six months later, when the regulator updates the rule, the architect needs to know which version of the prose was encoded. A spec without a source hash is a spec that is true today and unverifiable next quarter.

- **One rule, many specs.** Splitting a single regulatory rule into five YAMLs because it touches five skills produces drift. One rule, one spec, multiple enforcement points listed inside the same spec.

- **Policy logic still lives in skill code.** If the skill has an `if` statement that re-implements the rule, IM-02 has not been done. The runtime should evaluate the spec; the skill should only react to the decision the runtime returns.

- **Skipping the audit hook.** A spec without an audit record is decoration. The audit record is what makes the policy real to the auditor and what feeds the Evidence Binder. A reassuring spec is not the same as an enforceable one.

- **Encoding what is not in the source.** It is tempting to "improve" the rule while encoding it. Resist. Encode what the source says, file the improvement as a proposed amendment, and keep the two artifacts separate. The reviewer who approves the amendment is not the engineer who encoded the spec.

- **No version field.** The spec changes. The audit record needs to know which version made the decision. Versioning is how a regulator distinguishes "the policy in force on the day of the decision" from "the policy as it stands today." `1.2.0` is not optional.

- **Treating engine choice as a policy decision.** The spec is engine-agnostic. OPA/Rego, Cedar, a homegrown evaluator, or a runtime extension all work as long as the spec is the source of truth. If the spec is hand-translated into the engine's native language, the spec must round-trip — the engine's view must be regenerable from the YAML, not edited in place.

## Innorve Native Mode tenets this skill operationalizes

- **Tenet 3 — Govern before scaling.** The Policy Specification is the canonical instance of this tenet. Governance written as code survives staff changes, traffic spikes, and audit requests; governance written in prose does not.
- **Tenet 4 — Evidence before claims.** The audit hook is the bridge between the spec and the Evidence Binder. The architect does not claim the rule is followed; the runtime produces the per-decision audit record that demonstrates it.
- **Tenet 5 — Portability before tool lock-in.** The spec is engine-agnostic by construction. The architect names the policy engine with its replacement already named.

## What this is NOT

- This skill does **not** write policies for the user. It teaches the user to author them. The judgment about what the rule should be belongs to compliance, legal, or risk.
- This skill does **not** choose the policy engine. The spec is engine-agnostic; OPA/Rego, Cedar, a homegrown evaluator, or a runtime extension all work as long as the spec is the source of truth.
- This skill does **not** replace the control framework. SOC 2, ISO 27001, HIPAA, NCUA exam workpapers — these still exist. Policy-as-code is how individual controls get enforced and evidenced; the framework decides which controls apply.
- This skill does **not** generate the Evidence Binder. That is IM-07, which consumes the audit records this skill's hooks produce.

## Next step

Run `innorve-skill-contract` (IM-03) for the skills the policy attaches to, so the contract reflects the runtime behavior the policy enforces. After that, run `innorve-tenant-aware` (IM-04) — most policies have tenant-scoped applicability, and tenant gaps surface as soon as the second tenant is encoded.

## Further reading

- The IM-02 chapter on the Innorve Method site: <https://innorve.academy/method#im-02>
- Open Policy Agent documentation, particularly the sections on policy testing and decision logs: <https://www.openpolicyagent.org/docs/>
- Cedar Policy Language reference (AWS) — for an alternative encoding model with strong static analysis.
- NIST SP 800-53 Rev. 5, Appendix C ("Control Implementation") — for the language risk teams actually use when they ask "how is this enforced?"
- EU AI Act, Article 9 ("Risk management system") and Article 17 ("Quality management system") — for the regulatory baseline that policy-as-code is the cheapest way to satisfy.

## Why this matters

Governance written in prose is governance no one can verify. When the rule lives in a wiki page, every skill author re-implements it from memory, every audit becomes archaeology, and every change request takes a quarter because no one knows what depends on the rule. Policy-as-code makes the rule a first-class artifact: versioned, reviewed, tested, and queried by the runtime at the moment the decision is made. The architect who can produce a clean Policy Spec from a regulatory paragraph in an afternoon is the architect a risk committee can actually deploy in production.

## Cohort CTA

If you find yourself wishing for a peer who could review your Policy Specification before compliance signs off — that is what Cohort 1 of the Innorve Academy bootcamp is for. Apply at <https://innorve.academy/apply>.
