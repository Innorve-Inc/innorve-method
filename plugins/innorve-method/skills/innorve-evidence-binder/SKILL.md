---
name: innorve-evidence-binder
description: Use when starting an AI system that will eventually face an audit, customer security review, regulator inquiry, or post-incident review. Scaffolds a Governance Binder — a folder layout and template set that the team fills in as they build, so evidence accumulates in lockstep with code rather than being reconstructed under deadline pressure. Trigger on phrases like "we need a model card," "what do we show the auditor," "set up AI governance docs," or "we're going into a SOC 2 / HIPAA / EU AI Act review."
---

# IM-03 — Evidence-by-Design Framework

*Architects do not claim a system is safe, accurate, or compliant. They produce the evidence that demonstrates each property, and let the evidence make the claim.*

## What this skill does

Produces a Governance Binder skeleton for a single AI system: a folder layout plus filled-in templates for the artifacts auditors, security reviewers, regulators, and post-incident reviewers will eventually ask for. It scaffolds the structure; the team fills in the content as they build the system. The skill never invents values for those artifacts — generated governance content fails real audits, and a model card written by an assistant on behalf of a team that has not measured the model is worse than no model card at all.

## When to invoke it

Invoke `innorve-evidence-binder` when any of the following are true:

- You are starting a new AI system, agent, or skill that will run in a regulated context (banking, healthcare, public sector, EU operations, anything subject to SOC 2, ISO 27001, HIPAA, GLBA, or PCI DSS).
- A customer or auditor has asked for a model card, risk register, or "AI governance documentation" and you do not yet have a place to put it.
- You are about to graduate a skill from Incubating to Validated on the Maturity Ladder (see IM-05) and need an evidence trail to support the gate decision.
- A team is shipping AI features but each one writes governance docs in a different format, in a different place, or not at all.
- A regulator, examiner, or major customer has scheduled a review and the team is about to construct artifacts retroactively. (Stop the retroactive construction; scaffold the binder, then catch it up honestly.)

Do not invoke this skill for throwaway prototypes, internal-only experiments with no production path, or systems where the team has already adopted a binder convention they intend to keep.

## Where it sits in the Innorve Method

IM-03 follows IM-01 (Method Overview) and IM-02 (Skill Architecture). It produces the container that IM-04 (Skill Contract Schema), IM-05 (Maturity Gate Model), IM-06 (Policy as Code), IM-07 (Multi-Tool Orchestration), and IM-08 (Tenant-Aware Patterns) all write artifacts into.

Treat the binder as the spine of every later skill in the Method. Without it, the other skills produce loose paper that no one can find under audit pressure. With it, every artifact has a home, a name, and an owner.

## The coaching flow

Use AskUserQuestion at each step. Do not skip ahead — each answer narrows the scaffold.

1. **Scope the system.** Ask for the system's name, the team that owns it, and a one-paragraph description of what it does and who uses it. Refuse vague answers like "AI assistant" — push for a specific, observable description such as "loan underwriting copilot used by 40 commercial credit analysts at a regional bank."
2. **Identify the regulatory surface.** Ask which of the following apply (multi-select): SOC 2 (Trust Services Criteria, 2017 + 2022 revisions), HIPAA (45 CFR 164), EU AI Act risk tier (prohibited / high / limited / minimal), NIST AI RMF 1.0 functions (Govern / Map / Measure / Manage), GLBA, PCI DSS, FFIEC guidance, FedRAMP, or "none yet." If the user says "none," ask whether the system processes regulated data even when no framework has been formally named.
3. **Identify the data surface.** Ask what categories of data the system reads, writes, or sees: PII, PHI, financial account data, employee data, source code, customer support transcripts, regulator correspondence. This determines which sections of the model card and risk register get expanded templates versus stubs.
4. **Identify decision impact.** Ask whether outputs are advisory (human always in loop), assistive (human reviews before action), or autonomous (system acts without per-event human review). Autonomous systems get an expanded approval and rollback section; this is also where Native Mode tenet 6 (Human accountability before agent autonomy) gets enforced.
5. **Pick a binder location.** Default: `governance/<system-name>/` at the repo root. Confirm the user wants this path. If the system spans repos, ask whether the binder lives in the system-of-record repo or a dedicated governance repo. Either is valid; pick one and commit.
6. **Generate the scaffold.** Write the folder structure and templates described below. Do not invent values. Every field that the team must fill in should appear as `TODO(owner): <what to write here>` so grep finds gaps later.
7. **Set ownership.** Ask for the named owner for each artifact: model card, risk register, eval report, prompt register, audit trail config, deployment notes. "The team" is not an owner — push for a person.

## Inputs

The skill formally collects:

- System name, owning team, and one-paragraph description
- Applicable regulatory frameworks (multi-select)
- Data surface (categories of data read, written, or observed)
- Decision impact (advisory / assistive / autonomous)
- Binder filesystem path
- Named owner per artifact (model card, risk register, evals, prompts, audit trail, deployment, runbook)

## Outputs

The skill produces:

- A `governance/<system-name>/` folder scaffold
- A populated `README.md` index with owners and last-reviewed dates
- Template files for every artifact a future audit will request
- `TODO(owner)` markers at every required field
- A binder-level `CHANGELOG.md` for append-only history

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
  contracts/                   # IM-04 Skill Contracts land here
  CHANGELOG.md                 # binder-level changelog
```

Each template contains the section headings the auditor expects, prefilled `TODO(owner)` markers, and inline citations to the relevant clause in SOC 2, HIPAA, EU AI Act Annex IV, or NIST AI RMF.

## Quality rubric

A binder is "done well" when all of the following hold:

| # | Criterion | How to check |
|---|-----------|--------------|
| 1 | Every required artifact file exists at the canonical path | `ls -R governance/<system-name>/` matches the layout above |
| 2 | Every artifact has a named owner (a person, not a team) | `grep -r "TODO(team" governance/` returns zero |
| 3 | Every framework declared in step 2 has visible coverage in the model card or risk register | One section per framework, not a single bucket |
| 4 | The CHANGELOG has at least one entry — the scaffolding event itself | First commit is dated and signed |
| 5 | The README index links every artifact and shows its `last-reviewed` date | No orphan files |
| 6 | The audit-trail `config.md` lists fields, retention, and access — not just intent | Reviewer can map fields to a logging implementation |

## Failure mode checklist

A binder must be redone (not patched) when any of these are true:

- A model card was generated by the assistant and the team did not edit it. The card asserts properties the team has not measured.
- The binder lives in a wiki, a Notion page, or a shared drive instead of version control. There is no append-only history.
- The risk register contains threats but no residual-risk column. Mitigations cannot be evaluated.
- "The team" appears as the owner of more than two artifacts. No one is accountable.
- One binder is shared by multiple AI systems. The first audit question collapses it.

## Regulated environment extension

When SOC 2, HIPAA, EU AI Act, GLBA, or PCI DSS apply, add the following steps after step 7 of the coaching flow:

- **SOC 2.** Map each artifact to the Trust Services Criteria it supports (CC, A, C, PI, P series). Add a `soc2-mapping.md` to the binder root. Confirm the binder is referenced in the auditor's PBC list.
- **HIPAA.** Add `hipaa/` subfolder with placeholder templates for the Security Risk Analysis (45 CFR 164.308(a)(1)(ii)(A)), the Business Associate Agreement inventory, and the breach response procedure. Owner must be the designated Security Official.
- **EU AI Act (high-risk tier).** Add `eu-ai-act/` subfolder with templates corresponding to Annex IV technical documentation: system description, data governance, monitoring, accuracy/robustness/cybersecurity, and the conformity assessment record. Owner must be the designated EU AI Act compliance contact, even if outside the EU.
- **GLBA.** Add safeguards mapping under `glba/` referencing the Standards for Safeguarding Customer Information (16 CFR 314).
- **PCI DSS.** If cardholder data ever touches the system, the binder is the wrong primary artifact — escalate to the PCI compliance lead. The binder still exists, but cardholder-data scope is governed elsewhere.

## Public portfolio instruction

After the binder is scaffolded, share your work as evidence of Mode practice:

- Add the artifact to your public GitHub at `/governance/<system-name>/binder/` (redact any internal names if needed) so future employers, customers, and the Innorve community can see how you build.
- Link the binder from your project README so a reviewer can find it without asking.
- When you advance the binder (a new model card section, a first eval run, an approval), commit the change. The CHANGELOG is the public proof of practice over time.

## Worked examples

**Banking — loan underwriting copilot (a regional credit union with 200K members).** SOC 2 + GLBA + FFIEC. Data: PII, financial account data, internal credit memos. Decision impact: assistive (analyst reviews before approval). Binder lives in `governance/credit-copilot/`. The risk register expands the "discriminatory impact" and "concept drift on macro shifts" sections; the model card requires fairness slice reporting; the audit trail captures every model output the analyst saw and what they did with it. The eval plan references FFIEC SR 11-7 model risk management language.

**Healthcare — clinical note summarizer (a hospital network operating in three states).** HIPAA + SOC 2 + state law. Data: PHI. Decision impact: advisory (clinician reviews before signing the note). Binder lives in `governance/note-summarizer/`. The risk register expands the "hallucinated clinical fact" and "incorrect medication summary" sections; the audit trail captures the source note hash, the summary, the clinician edit diff, and the sign-off. The eval plan requires evaluation against a human-graded reference set with named clinical reviewers, refreshed monthly.

**SaaS — internal RAG over customer support tickets (a B2B SaaS company in the contract-lifecycle space).** SOC 2 only. Data: customer PII inside ticket bodies. Decision impact: advisory. Binder lives in `governance/support-rag/`. The risk register focuses on cross-tenant leakage and prompt injection from ticket content. The audit trail captures retrieval hits per query for later replay. The eval plan is lighter — answer accuracy on a 200-question internal set, run weekly.

## Common pitfalls

The binder is supposed to make governance cheap by making it incremental. Most failures are failures of incremental discipline.

- **Filling in templates yourself.** Tempting because the templates are right there and the page is empty. Do not. A model card written by the assistant, on behalf of a team that did not measure the model, is evidence that the team does not know what its system does. The binder is most valuable when its content is honest.
- **One binder for many systems.** Each AI system gets its own binder. Shared binders look efficient until the first auditor asks "show me the model card for system X" and the team has to explain that the model card is actually a section of a section in a shared document.
- **Treating the binder as a one-time deliverable.** The binder is append-only and grows with the system. The CHANGELOG and `last-reviewed` dates exist to make staleness visible. A binder last touched in Q1 cannot defend a Q4 audit.
- **Confusing the binder with the threat model.** The risk register lives in the binder. The threat model lives upstream and feeds the risk register. They are two documents because they have two audiences.
- **Hiding the binder.** A private binder cannot demonstrate Mode practice. Even when the system is internal, the binder structure is publishable. Innorve Architects share binder structures publicly even when the underlying system is not.

## Innorve Native Mode tenets this skill operationalizes

- **Tenet 4 — Evidence before claims.** The binder is the Mode's primary artifact. Every claim a team makes about an AI system — accurate, fair, auditable, compliant — has a path to a file inside the binder. No file, no claim.
- **Tenet 3 — Govern before scaling.** Governance written in documentation is forgotten the day the system grows. Governance written into a binder structure that the team ships against survives staff changes, traffic spikes, and audit requests.
- **Tenet 6 — Human accountability before agent autonomy.** Every artifact has a named human owner. The binder makes the accountability chain visible and grep-able.

## Next step

After the binder is scaffolded and owners are assigned, invoke `innorve-skill-contract` (IM-04) to author a Skill Contract for each AI skill the system exposes. The Skill Contract is the machine-readable companion to the model card and lives at `governance/<system-name>/contracts/`.

## Further reading

- The Innorve Method, IM-03: https://innorve.academy/method#im-03
- Innorve Native Mode: https://github.com/Innorve-Inc/innorve-method/blob/main/docs/INNORVE-NATIVE-MODE.md
- Mitchell et al., "Model Cards for Model Reporting," FAT* 2019.
- NIST AI Risk Management Framework 1.0 (NIST AI 100-1), January 2023.
- EU AI Act, Annex IV — Technical documentation requirements for high-risk AI systems.
- AICPA Trust Services Criteria, 2017 (with 2022 revisions).

## Why this matters

The Innorve Method assumes governance evidence is built alongside code, not reconstructed for an audit. Teams that wait until the audit accumulate two debts at once: the missing artifacts, and the missing memory of what the system was doing six months ago. The binder is the cheapest possible insurance against both. It costs an hour to scaffold, almost nothing per change to maintain, and saves weeks at the worst possible time. More importantly, it makes the Mode visible — an architect with a populated binder is an architect whose practice can be inspected, taught, and trusted.

## What this is NOT

- This is not a model card generator. It does not write your model card. It scaffolds the file you will fill in.
- This is not a compliance certification. It does not make you SOC 2, HIPAA, or EU AI Act compliant. It produces the evidence container that compliance work fills.
- This is not a substitute for legal or compliance review. The templates encode common requirements; your auditor decides what is sufficient.
- This is not a replacement for IM-04 (Skill Contracts) or IM-06 (Policy as Code). The binder holds human-readable evidence; contracts and policies are the machine-enforced controls.
- This is not a wiki. A wiki has no append-only history and no version control. The binder lives in git.

---

If you find yourself wishing for a peer who could review your first three real binders before an auditor sees them — that is what Cohort 1 of the Innorve Academy bootcamp is for. Apply at https://innorve.academy/apply.
