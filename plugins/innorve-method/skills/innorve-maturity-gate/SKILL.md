---
name: innorve-maturity-gate
description: Use when deciding whether an AI skill or agent is ready to graduate from one level to the next on the Skill Maturity Ladder (Incubating → Validated → Certified → Deprecated). Walks the user through gate criteria, produces a Maturity Gate Report that documents the decision, and lists specific actions to close any gaps.
---

# IM-05 — Maturity Gate Model

## What this skill does

Evaluates a skill against the Innorve Skill Maturity Ladder and produces a Maturity Gate Report explaining why the skill is — or is not — ready for the next level. The skill does not promote the skill itself; it gives the team and the reviewer a structured decision artifact, with named gaps and named owners for each unmet criterion.

## When to invoke it

Invoke `innorve-maturity-gate` when:

- A skill author thinks a skill is ready to graduate from Incubating to Validated, or Validated to Certified.
- A periodic review (quarterly is typical) is checking whether Certified skills still meet their criteria.
- A skill has been failing evals, has unclear ownership, or has not been touched in 90+ days, and you are deciding whether to deprecate it.
- An auditor or examiner asks "what is the basis for calling this skill production-grade."

Do not invoke for skills that have not yet been authored a Skill Contract (IM-04) — there is nothing to grade. Run IM-04 first.

## Where it sits in the Innorve Method

IM-05 reads artifacts produced by IM-03 (Evidence Binder) and IM-04 (Skill Contract). It feeds decisions into IM-06 (Policy as Code) — gateways and policy engines read the maturity level to decide who can call a skill, with what approvals. A skill at Incubating is callable only by named developers; a skill at Certified is callable by end users in production.

## The Skill Maturity Ladder

Four levels, in order:

1. **Incubating.** The skill exists, has a contract, runs in development. Not yet exposed to production traffic.
2. **Validated.** The skill has eval evidence, audit trails, named owner, runs in a limited production scope (one tenant, internal users only, or feature-flagged).
3. **Certified.** The skill has demonstrated stable evals over time, has a runbook, has on-call coverage, has change-control, and is callable from general production traffic.
4. **Deprecated.** The skill is on a sunset path. New callers are blocked; existing callers have a migration plan and a deadline.

## The coaching flow

Use AskUserQuestion at each step.

1. **Identify the skill and the proposed transition.** Ask the skill name, current maturity level, and target level. Reject jumps of more than one level — every skill walks the ladder.
2. **Locate the artifacts.** Confirm the path to the Skill Contract (IM-04 output), the Governance Binder (IM-03 output), and the most recent eval report. If any is missing, stop and tell the user which IM-XX skill produces it.
3. **Run the gate criteria for the target level.** Use the criteria below. For each criterion, mark `pass`, `fail`, or `n/a` and capture the evidence path.
4. **Identify gap closure actions.** For each `fail`, write a one-line action with a named owner and a target date. "The team will improve eval coverage" is not an action; "Maya will add the 50-prompt fairness slice to evals/datasets/fairness-v2.jsonl by 2026-05-01" is.
5. **Issue the decision.** If all required criteria pass, issue `READY` with a recommended promotion date. If any required criterion fails, issue `NOT READY` with the gap list. If the skill is at Validated or Certified and material criteria have regressed, recommend `DEMOTE`.
6. **Write the report.** Emit the Maturity Gate Report at the path described below.

## Gate criteria

### Incubating → Validated

Required:

- Skill Contract (IM-04) exists, conforms to schema v0.1, and matches current behavior.
- Test coverage above team's stated minimum (default: 70% line coverage on the skill's own code).
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

## Worked examples

**Banking — `route-loan-application`, Incubating → Validated.** Contract present. Tests at 81%. Eval on 500 historical applications, 94% match with manager re-routes, threshold 92%. Audit trail logging applicant ID, decision, and reasoning hash. Owner assigned. Runbook stub written. Risk class `high_impact_write` reviewed by risk officer. **Decision: READY.** Promote with limited rollout to one branch for 30 days before broader release.

**Healthcare — `summarize-clinical-note`, Validated → Certified.** Eval pass rate has been at 99.3% (hallucination rate 0.7%) for four consecutive monthly runs. Audit trail sampling: 20 of 20 invocations have source note hash, summary hash, clinician edit diff, and sign-off. On-call rotation exists. Rollback tested in February. Cost and latency within budget. **Decision: READY.** Promote and schedule next review for Q3.

**SaaS — `auto-respond-support-ticket`, Certified review.** Eval acceptance rate has dropped from 74% to 61% over two weeks after the underlying model was upgraded. Investigation in progress. **Decision: DEMOTE to Validated** until acceptance returns above 70% for two consecutive weeks. Roll back model version in the meantime.

## Common pitfalls

- **Grading on intent.** "We will add evals next sprint" does not pass an eval criterion. Either the eval exists and passes, or the criterion fails.
- **Skipping a level.** Going Incubating to Certified in one step skips the period where the skill earns trust by running. Walk every level.
- **Reviewing your own skill.** The reviewer should not be the skill's primary author. The point of the gate is independent eyes.
- **No demotion path.** A ladder you can only climb is not a ladder; it is a ratchet. Skills that regress should drop a level.
- **Promoting before the binder is current.** The Maturity Gate Report is binder evidence. If the binder is stale, the gate decision is on a shaky foundation.

## Next step

After a `READY` decision, the promotion itself happens outside this skill — typically a PR that bumps `maturity_level` in the Skill Contract and updates the routing policy in IM-06 (Policy as Code). After a `NOT READY` decision, schedule the gap closure actions and re-run this skill once they are done.

## Further reading

- The Innorve Method, IM-05: https://innorve.academy/method#im-05
- Google SRE Workbook, "Implementing Service Level Objectives" (the SLO discipline that informs the Validated → Certified eval-stability criterion).
- ITIL 4, change control practice (the lineage of the change-control criteria).

## Why this matters

Without a maturity model, every AI skill in production is implicitly Certified the moment it is shipped, regardless of what evidence supports it. That is how teams end up with a portfolio of "production" skills that nobody can vouch for. The ladder makes trust earnable, and reversible. A team that demotes a skill once is a team that can be trusted with the rest of the portfolio.

## What this is NOT

- This is not a promotion mechanism. It produces a decision artifact; the actual promotion is a PR.
- This is not a substitute for product judgment. A skill can pass every gate and still be the wrong skill to ship.
- This is not a one-time event. Certified skills are reviewed on a cadence; the ladder is not a finish line.
- This is not a replacement for incident review. A skill that caused an incident gets a post-mortem first, then a gate review.
