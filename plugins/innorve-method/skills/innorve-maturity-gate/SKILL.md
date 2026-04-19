---
name: innorve-maturity-gate
description: Use when deciding whether an AI skill or agent is ready to graduate from one level to the next on the Skill Maturity Ladder (Incubating → Validated → Certified → Deprecated). Walks the user through gate criteria, produces a Maturity Gate Report that documents the decision, and lists specific actions to close any gaps. Trigger on phrases like "is this skill ready for production," "promote this to Certified," "quarterly skill review," or "should we deprecate this skill."
---

# IM-05 — Maturity Gate Model

*Trust is not a feeling; it is a measurement. A skill earns the next level by producing the evidence that justifies it, never by intent or seniority.*

## What this skill does

Evaluates a skill against the Innorve Skill Maturity Ladder and produces a Maturity Gate Report explaining why the skill is — or is not — ready for the next level. The skill does not promote the skill itself; it gives the team and the reviewer a structured decision artifact, with named gaps and named owners for each unmet criterion. The Maturity Gate is the moment where Native Mode tenet 2 (Evaluate before trusting) and tenet 3 (Govern before scaling) are made visible and enforceable.

The gate criteria are an open spec maintained at `/spec/maturity-gate` in the Innorve Method repository. Implementations may add stricter criteria but must not weaken the v0.1 baseline.

## When to invoke it

Invoke `innorve-maturity-gate` when:

- A skill author thinks a skill is ready to graduate from Incubating to Validated, or Validated to Certified.
- A periodic review (quarterly is typical) is checking whether Certified skills still meet their criteria.
- A skill has been failing evals, has unclear ownership, or has not been touched in 90+ days, and you are deciding whether to demote or deprecate it.
- An auditor or examiner asks "what is the basis for calling this skill production-grade."
- A new caller wants to invoke a skill at a higher trust level than its current maturity allows, and the team needs to decide whether to promote the skill or refuse the caller.

Do not invoke for skills that have not yet been authored a Skill Contract (IM-04) — there is nothing to grade. Run IM-04 first.

## Where it sits in the Innorve Method

IM-05 reads artifacts produced by IM-03 (Evidence Binder) and IM-04 (Skill Contract Schema). It feeds decisions into IM-06 (Policy as Code) — gateways and policy engines read the maturity level to decide who can call a skill, with what approvals. A skill at Incubating is callable only by named developers; a skill at Certified is callable by end users in production traffic.

The gate is the moment where the binder, the contract, the eval evidence, and the operational record all converge. If any one is thin, the gate exposes it.

## The Skill Maturity Ladder

Four levels, in order:

1. **Incubating.** The skill exists, has a contract, runs in development. Not yet exposed to production traffic.
2. **Validated.** The skill has eval evidence, audit trails, named owner, and runs in a limited production scope (one tenant, internal users only, or feature-flagged).
3. **Certified.** The skill has demonstrated stable evals over time, has a runbook, has on-call coverage, has change-control, and is callable from general production traffic.
4. **Deprecated.** The skill is on a sunset path. New callers are blocked; existing callers have a migration plan and a deadline.

A skill walks every level. There are no jumps, and there is a demotion path.

## The coaching flow

Use AskUserQuestion at each step.

1. **Identify the skill and the proposed transition.** Ask the skill name, current maturity level, and target level. Reject jumps of more than one level — every skill walks the ladder.
2. **Locate the artifacts.** Confirm the path to the Skill Contract (IM-04 output), the Governance Binder (IM-03 output), and the most recent eval report. If any is missing, stop and tell the user which IM-XX skill produces it.
3. **Run the gate criteria for the target level.** Use the criteria below. For each criterion, mark `pass`, `fail`, or `n/a` and capture the evidence path. Evidence path is mandatory — a `pass` without a file path is a `fail`.
4. **Identify gap closure actions.** For each `fail`, write a one-line action with a named owner and a target date. "The team will improve eval coverage" is not an action; "Maya will add the 50-prompt fairness slice to evals/datasets/fairness-v2.jsonl by 2026-05-01" is an action.
5. **Issue the decision.** If all required criteria pass, issue `READY` with a recommended promotion date. If any required criterion fails, issue `NOT READY` with the gap list. If the skill is at Validated or Certified and material criteria have regressed, issue `DEMOTE`.
6. **Write the report.** Emit the Maturity Gate Report at the path described below. Append-only; never overwrite a prior report.

## Inputs

The skill formally collects:

- Skill name, current level, target level
- Paths to Skill Contract, binder root, and most recent eval report
- Pass/fail/n/a marks per criterion with an evidence path
- Gap-closure actions with named owner and target date
- Reviewer name (must not be the skill's primary author)

## Outputs

The skill produces:

- A Maturity Gate Report file in the binder's `approvals/` folder
- A `READY`, `NOT READY`, or `DEMOTE` decision with one-paragraph rationale
- A named gap list with owners and dates (when applicable)
- A next-review date

## Gate criteria

The full criteria list, including conformance tests, lives in the open spec at `/spec/maturity-gate`. The baseline:

### Incubating → Validated

Required:

- Skill Contract (IM-04) exists, conforms to schema v0.1, and matches current behavior.
- Test coverage above the team's stated minimum (default: 70% line coverage on the skill's own code).
- At least one eval run on a fixed dataset of at least 20 examples, with a passing threshold defined in the contract and met.
- Audit trail config is implemented and producing events (not just declared).
- Named owner assigned with a backup.
- Runbook stub exists in the binder, even if minimal.
- Risk class declared in the contract and reviewed by someone other than the author.

### Validated → Certified

Required, in addition to all Validated criteria:

- Eval pass rate has stayed above threshold across at least three consecutive runs.
- Audit trail completeness verified by sampling: pull 20 random invocations and confirm every required field is present.
- On-call coverage in place; runbook is complete enough that the on-call can act on a paged alert without contacting the author.
- Change control: every change to the skill in the last 30 days went through code review, and changes that affect the contract bumped the contract version.
- Rollback procedure tested at least once in production within the last 90 days.
- For risk class `high_impact_write`, `irreversible`, or `regulated_decision`: documented sign-off from the named approver in the contract.
- Cost and latency budgets defined and observed for at least 14 days.

### Certified → Deprecated

Triggers (any one):

- Replacement skill exists at Validated or Certified.
- Eval pass rate has dropped below threshold for two consecutive runs and the cause is not fixable.
- Underlying model, retriever, or external API is end-of-life.
- Owner has left and no successor accepted ownership within 60 days.

Deprecation requires a sunset plan: who is using the skill today, what they migrate to, and when the skill is removed.

## The artifact produced

A Maturity Gate Report at `governance/<system-name>/approvals/maturity-gate-<skill-name>-<YYYY-MM-DD>.md`, append-only:

```
# Maturity Gate Report — <skill-name>

Date: <YYYY-MM-DD>
Reviewer: <name>
Current level: <Incubating | Validated | Certified>
Proposed level: <Validated | Certified | Deprecated>
Decision: <READY | NOT READY | DEMOTE>

## Criteria

| # | Criterion | Status | Evidence | Notes |
|---|-----------|--------|----------|-------|
| 1 | Skill Contract conforms to v0.1 | pass | governance/.../contracts/<skill>.yaml | |
| 2 | Test coverage >= 70% | fail | ci/coverage/<skill>.html (62%) | |
| ... | ... | ... | ... | ... |

## Gap closure actions

- [ ] <owner> will <specific action> by <date>.
- [ ] <owner> will <specific action> by <date>.

## Recommendation

<one paragraph>

## Next review

<date>
```

## Quality rubric

A Maturity Gate Report is "done well" when all of the following hold:

| # | Criterion | How to check |
|---|-----------|--------------|
| 1 | Every criterion row has an evidence path, not just a status mark | `grep "^| " report.md` shows no empty Evidence columns |
| 2 | The reviewer is a person other than the skill's primary author | Cross-check against the contract's `owner.on_call` |
| 3 | Every `fail` produces a gap-closure action with a named owner and date | `- [ ]` items map 1:1 to fails |
| 4 | The decision matches the criteria — no `READY` with required fails, no `NOT READY` with all passes | Sanity check |
| 5 | The report is committed to the binder's `approvals/` folder, append-only | No overwrites of prior reports |
| 6 | A next-review date is set | A gate without a follow-up is a one-time stunt |

## Failure mode checklist

The decision must be revisited (or the report rewritten) when any of these are true:

- The reviewer is the same person who authored the skill. The gate has no independent eyes.
- A `READY` decision is issued with one or more required criteria marked `fail`. Override without justification is a Mode violation.
- The eval evidence cited is older than 30 days for a Validated → Certified transition.
- The audit trail completeness check was claimed but no sample was taken.
- The rollback procedure is "documented" but has never been executed in production.
- A skill at Certified has had no review in the last 180 days. Certification is not permanent; quarterly reviews are the floor.

## Regulated environment extension

When SOC 2, HIPAA, EU AI Act, GLBA, or PCI DSS apply, add the following to the Validated → Certified gate:

- **SOC 2.** The audit-trail completeness sample must be drawn during the auditor's observation window; the report references the auditor's PBC list item.
- **HIPAA.** For PHI-handling skills, the eval threshold for hallucination or factual error must be approved by the named clinical or compliance lead and the approval is appended to the binder.
- **EU AI Act high-risk tier.** Certification requires the conformity assessment to be current and the post-market monitoring plan to be active; both are linked from the gate report.
- **GLBA.** Skills affecting customer access to financial services require the named risk officer's sign-off in the report's recommendation section.
- **PCI DSS.** Skills touching cardholder data require a separate PCI-scoped change advisory board sign-off in addition to the standard gate.

## Public portfolio instruction

After the gate report is committed, share it as evidence of Mode practice:

- Add the artifact to your public GitHub at `/governance/<system-name>/approvals/maturity-gate-<skill-name>-<date>.md` (anonymize internal names if needed).
- Link the most recent gate report from your project README under "Skill maturity."
- When you demote a skill, publish the demotion report. Demotions taught publicly are the strongest signal of Mode practice — anyone can promote; only architects demote.

## Worked examples

**Banking — `route-loan-application`, Incubating → Validated (a regional credit union with 200K members).** Contract present. Tests at 81%. Eval on 500 historical applications, 94% match with manager re-routes, threshold 92%. Audit trail logging applicant ID, decision, and reasoning hash. Owner assigned with backup. Runbook stub written. Risk class `high_impact_write` reviewed by the credit union's risk officer. **Decision: READY.** Promote with limited rollout to one branch for 30 days before broader release.

**Healthcare — `summarize-clinical-note`, Validated → Certified (a hospital network operating in three states).** Eval pass rate has been at 99.3% (hallucination rate 0.7%) for four consecutive monthly runs. Audit trail sampling: 20 of 20 invocations have source note hash, summary hash, clinician edit diff, and sign-off. On-call rotation exists. Rollback tested in February. Cost and latency within budget. **Decision: READY.** Promote and schedule next review for Q3.

**SaaS — `auto-respond-support-ticket`, Certified review (a B2B SaaS company in the contract-lifecycle space).** Eval acceptance rate has dropped from 74% to 61% over two weeks after the underlying model was upgraded. Investigation in progress. **Decision: DEMOTE to Validated** until acceptance returns above 70% for two consecutive weeks. Roll back model version in the meantime. The demotion report is published as a teaching artifact.

## Common pitfalls

The Maturity Gate is the discipline that separates teams whose AI portfolio they can vouch for from teams whose AI portfolio they cannot. Most failures are failures of independence and stamina.

- **Grading on intent.** "We will add evals next sprint" does not pass an eval criterion. Either the eval exists and passes, or the criterion fails. The gate measures what is, not what will be.
- **Skipping a level.** Going Incubating to Certified in one step skips the period where the skill earns trust by running. Walk every level — that is where the audit trail completeness, the on-call practice, and the rollback rehearsal happen.
- **Reviewing your own skill.** The reviewer should not be the skill's primary author. The point of the gate is independent eyes; without independence, the gate is a self-certification and worth nothing in an audit.
- **No demotion path.** A ladder you can only climb is not a ladder; it is a ratchet. Skills that regress should drop a level. A team that demotes a skill once is a team that can be trusted with the rest of the portfolio.
- **Promoting before the binder is current.** The Maturity Gate Report is binder evidence. If the binder is stale, the gate decision rests on a shaky foundation, and the next audit will find it.
- **Quarterly reviews that never happen.** A Certified skill without a review in 180 days is implicitly Incubating again. Calendar the reviews; if no one owns the calendar, the gate is decoration.

## Innorve Native Mode tenets this skill operationalizes

- **Tenet 2 — Evaluate before trusting.** Every promotion past Incubating requires eval evidence at a defined threshold. The gate is the moment trust is bought, not assumed.
- **Tenet 3 — Govern before scaling.** Maturity controls who can call the skill. A skill scales only as fast as it can prove it deserves to.
- **Tenet 4 — Evidence before claims.** No criterion passes without an evidence path. The report is the artifact that justifies every claim about the skill's readiness.

## Next step

After a `READY` decision, the promotion itself happens outside this skill — typically a PR that bumps `maturity_level` in the Skill Contract and updates the routing policy in IM-06 (Policy as Code) so the gateway reflects the new trust level. After a `NOT READY` decision, schedule the gap closure actions and re-run this skill once they are done. After a `DEMOTE` decision, publish the report and roll back the routing policy in the same PR.

## Further reading

- The Innorve Method, IM-05: https://innorve.academy/method#im-05
- Innorve Maturity Gate, open spec: `/spec/maturity-gate` in the Innorve Method repository.
- Innorve Native Mode: https://github.com/Innorve-Inc/innorve-method/blob/main/docs/INNORVE-NATIVE-MODE.md
- Google SRE Workbook, "Implementing Service Level Objectives" — the SLO discipline that informs the Validated → Certified eval-stability criterion.
- NIST AI Risk Management Framework 1.0 (NIST AI 100-1) — the Measure and Manage functions map directly onto the gate's criteria.

## Why this matters

Without a maturity model, every AI skill in production is implicitly Certified the moment it is shipped, regardless of what evidence supports it. That is how teams end up with a portfolio of "production" skills that nobody can vouch for and no one will demote. The ladder makes trust earnable, and reversible. A team that can demote a skill — and publish the report — is a team whose remaining promotions actually mean something. The Maturity Gate is the place where the Innorve Method's discipline becomes the team's habit.

## What this is NOT

- This is not a promotion mechanism. It produces a decision artifact; the actual promotion is a PR.
- This is not a substitute for product judgment. A skill can pass every gate and still be the wrong skill to ship.
- This is not a one-time event. Certified skills are reviewed on a cadence; the ladder is not a finish line.
- This is not a replacement for incident review. A skill that caused an incident gets a post-mortem first, then a gate review.
- This is not a rubber stamp. A reviewer who cannot point to the evidence path for every `pass` is not reviewing; they are signing.

---

If you find yourself wishing for a peer who could review your first three real gate reports — especially your first demotion — that is what Cohort 1 of the Innorve Academy bootcamp is for. Apply at https://innorve.academy/apply.
