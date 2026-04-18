---
name: innorve-policy-as-code
description: Use when the user has a governance rule, compliance requirement, regulatory constraint, or internal policy expressed in prose and needs to make it machine-enforceable. Coaches the engineer through translating natural-language rules into version-controlled policy code with explicit applicability, enforcement, and audit hooks. Invoke when a system has skills (IM-01) but governance still lives in PDFs, wikis, or "we just know."
---

# IM-02 — Policy-as-Code Methodology

## What this skill does

Coaches the engineer through turning a natural-language governance rule into a version-controlled, machine-enforceable policy specification. The output is a Policy Specification — a YAML or JSON document with rule definitions, applicability, enforcement points, exception handling, and audit hooks — that the runtime evaluates instead of the engineer remembering.

## When to invoke it

- The user has a written policy (a regulation, an internal control, a vendor contract) and asks how to enforce it.
- A skill keeps making the wrong call because the rule lives in a person's head, not in code.
- An auditor or risk reviewer asked: "How do you prove this rule is followed?"
- The team is about to hardcode a conditional like `if customer.state == "CA"` for the third time. Stop and run this skill.

## Where it sits in the Innorve Method

IM-02 sits between IM-01 (skill architecture) and IM-04 (tenant-aware). You need named skills before you can attach policy to them, and you need policy-as-code before tenancy controls can mean anything. Many teams skip IM-02 and try to enforce policy in skill code; the result is policy logic spread across twenty files with no single source of truth and no audit story.

## Why this matters

Governance written in prose is governance no one can verify. When the rule lives in a Confluence page, every skill author re-implements it from memory, every audit becomes archaeology, and every change request takes a quarter because no one knows what depends on the rule. Policy-as-code makes the rule a first-class artifact: versioned, reviewed, tested, and queried by the runtime at the moment the decision is made. It is the same insight that gave us infrastructure-as-code, applied one layer up.

## The coaching flow

Do not let the user write any YAML until step 5. The first four steps are about understanding the rule.

### 1. Locate the canonical source

$ASK: *"Where does this rule live today? Paste the exact sentence or section."*

If the user gives you a paraphrase, push back. You need the canonical text — the regulation citation, the contract clause, the policy memo. The Policy Specification will reference this source so a future reviewer can re-derive the encoding.

### 2. Identify the rule's three parts

Every enforceable rule has three parts. Make the user name them explicitly:

- **Applicability** — when does this rule apply? (Which tenants, regions, products, transaction types, user roles, time windows.)
- **Constraint** — what must be true (or false) when the rule applies?
- **Consequence** — what happens when the constraint is violated? (Block, warn, queue for human review, log only.)

If any of the three is unclear from the source text, that is a finding. Document the ambiguity. Do not encode a guess.

### 3. Find the decision points

$ASK: *"Walk through your skill graph. At which skill, and at which moment inside that skill, does this rule actually need to fire?"*

A rule typically attaches to one of three places: skill input validation, skill output validation, or a runtime-level pre-check before a tool call. Pick deliberately. The same rule enforced in the wrong place produces silent failures.

### 4. Identify exceptions and overrides

Real rules have exceptions. Real exceptions have approvers.

$ASK: *"Who can override this rule? Under what circumstances? What artifact records the override?"*

If the answer is "no one ever", capture that. If the answer is "the BSA officer in writing", that is part of the spec — the runtime needs to know what override evidence looks like and how to attach it to the audit trail.

### 5. Draft the Policy Specification

Now write the YAML. Use the schema below. Be ruthless about not encoding what the prose did not say. Where the prose is silent, the spec should be silent or marked `unspecified`.

### 6. Write the negative tests first

For every rule, the user writes at least three test cases:

- A clear positive (the constraint holds, the action proceeds).
- A clear negative (the constraint is violated, the consequence fires).
- A genuine edge case from production data — the one the rule was probably written about.

If they cannot produce three, the rule is not understood well enough to encode yet. Loop back to step 1.

### 7. Wire the audit hook

Every policy evaluation produces an audit record: the rule version, the input, the decision, the consequence, the override (if any), and the actor (human or skill) who triggered it. This is what IM-07 will assemble into the Evidence Binder later. The hook is non-negotiable — a policy without an audit hook is not enforceable, just reassuring.

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
    sla_hours: 15  # business days converted to hours per FinCEN guidance
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
    - name: "multiple structured deposits aggregate"
      input: { customer_id: "c1", aggregate_cash_24h: 9999_then_500 }
      expect: queue-for-ctr-filing
```

YAML is the default. JSON is fine if your repo standard requires it. The schema does not change; the syntax does.

## Worked examples

### Example 1 — Regional credit union, CTR threshold

The team has the rule in a procedures manual: "Aggregate cash transactions of $10,000 or more in a 24-hour period must trigger a CTR filing within 15 business days." After IM-02:

- One Policy Spec, `bsa-ctr-threshold.yaml`, attached to `evaluate-transaction` skill at the `post-output` enforcement point.
- The applicability section reveals the team had been silently exempting business deposits — a finding for the BSA officer to confirm.
- The exception block records the path for a documented exempt customer (this is its own small policy, `bsa-ctr-exemption-list.yaml`, referenced by id).
- The audit hook is what later lets IM-07 produce the binder the examiner asks for without anyone digging through logs.

### Example 2 — Regional health system, out-of-network referrals

The rule reads: "The agent must not propose a specialist outside the patient's plan network unless the in-network wait exceeds 30 days." After IM-02:

- Policy Spec `network-coverage.yaml`, attached to the `propose-slots` skill at `input` enforcement (the slot list must already be filtered when proposed, not after).
- The 30-day exception becomes a structured override condition with `evidence_required: ["in-network-wait-report"]`, generated automatically by the `find-eligible-specialists` skill.
- The negative test catches a real production edge case: a patient with two active plans where the agent had been silently picking the first.

### Example 3 — SaaS billing startup, refund cap

The rule was a Slack message from the CFO: "No automated refund over $500 without a human." After IM-02:

- Policy Spec `refund-cap.yaml`, attached to `apply-refund` at `pre-tool-call` (you want this gating the Stripe call, not the LLM draft).
- The override role is `billing-lead` and `cfo`. The evidence required is a ticket id.
- The negative test surfaces that the system had previously treated currency conversion sloppily; a £450 refund would have skipped the gate. The encoded rule normalizes to USD before evaluating.

## Common pitfalls

- **Encoding the paraphrase, not the source.** Always anchor to the canonical text. Six months later, when the regulator updates the rule, you will need to know what version of the prose you encoded.
- **One rule, many specs.** Splitting a single regulatory rule into five YAMLs because it touches five skills produces drift. One rule, one spec, multiple enforcement points.
- **Policy logic still lives in skill code.** If the skill has an `if` statement that re-implements the rule, you have not done IM-02. The runtime should evaluate the spec; the skill should only react to the decision.
- **Skipping the audit hook.** A spec without an audit record is decoration. The audit record is what makes the policy real to the auditor.
- **Encoding what is not in the source.** It is tempting to "improve" the rule while encoding it. Do not. Encode what the source says, file the improvement as a proposed amendment, and keep the two artifacts separate.
- **No version field.** The spec changes. The audit record needs to know which version made the decision. `1.2.0` is not optional.

## What this is NOT

- This skill does **not** write your policies for you. It teaches you to author them. The judgment about what the rule should be belongs to your compliance, legal, or risk function.
- This skill does **not** choose your policy engine. The spec is engine-agnostic; OPA/Rego, Cedar, a homegrown evaluator, or a runtime extension all work as long as the spec is the source of truth.
- This skill does **not** replace your control framework. SOC 2, ISO 27001, HIPAA, NCUA exam workpapers — these still exist. Policy-as-code is how individual controls get enforced and evidenced; the framework decides which controls apply.

## Next step

Run `innorve-skill-contract` (IM-03) for the skills the policy attaches to, so the contract reflects the runtime behavior the policy enforces. After that, run `innorve-tenant-aware` (IM-04) — most policies have tenant-scoped applicability and you will discover gaps as soon as you encode a second tenant.

## Further reading

- The IM-02 chapter on the Innorve Method site: <https://innorve.academy/method#im-02>
- Open Policy Agent documentation, particularly the section on policy testing — <https://www.openpolicyagent.org/docs/latest/policy-testing/>
- Cedar Policy Language reference (AWS) — for an alternative encoding model with strong static analysis.
- NIST SP 800-53 Rev. 5, Appendix C ("Control Implementation") — for the language risk teams actually use when they ask "how is this enforced?"
