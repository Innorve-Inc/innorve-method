# Innorve Native Mode

The working posture of an AI-Native Architect.

> **Innorve Native Mode** is the operating discipline an architect carries
> from one project to the next. It is six tenets, each one a verb-first
> commitment, applied in order. Architects who internalize the Mode produce
> AI systems that ship, survive, audit, and scale. Architects who skip a
> tenet produce systems that hold up in demos and collapse under pressure.

---

## The six tenets

The Mode is not a checklist. It is a sequence — each tenet enables the next.

### 1. Architect before automating.
> **Decompose the work before you call a model.**

Most failed AI systems begin with someone reaching for a model before they have decomposed the work. The model is summoned to do everything at once: parse the input, reason about the problem, decide the action, generate the output. The system is then unverifiable because there is nothing inside it to verify against. Architecting first means decomposing the problem into named, typed, individually testable skills before a single token is generated.

### 2. Evaluate before trusting.
> **Write the evaluation before you ship the skill.**

Trust is not a feeling; it is a measurement. Before a skill is invoked in production, an architect has authored the evaluation that decides whether the skill works. The evaluation has at least one regression case drawn from a real failure mode the architect can articulate. A skill that ships before its evaluation is a skill running on hope.

### 3. Govern before scaling.
> **Express the policy in code before the system grows past one user.**

Governance written in documentation is forgotten the day the system grows. Governance written as version-controlled, machine-enforceable policy survives staff changes, traffic spikes, and audit requests. The architect writes the policy first — who can invoke this skill, when, on what data, with what approvals — and only then scales the surface that uses it.

### 4. Evidence before claims.
> **Produce the audit artifact before you make the assertion.**

Architects do not claim a system is safe, accurate, compliant, or performing. They produce the evidence that demonstrates each property — model card, eval report, audit log, governance binder — and let the evidence make the claim. A claim without evidence is marketing. Evidence is the only language that survives a regulator, a CISO, or a post-incident review.

### 5. Portability before tool lock-in.
> **Choose every tool with its replacement already named.**

The AI tool layer churns faster than any layer of software in a generation. Vendors deprecate models, change pricing, get acquired, change terms. An architect picks each model, framework, and deployment target with a documented fallback and explicit migration triggers. Systems built without a portability discipline are technical debt the day they ship.

### 6. Human accountability before agent autonomy.
> **Name the human who is accountable before granting the agent the authority.**

Every action an AI system takes is, in the final accounting, attributable to a human. An architect names the accountable human before the agent gains the authority. High-stakes actions require explicit approvals; the agent never holds authority that no person stands behind. Autonomy expands as evidence accumulates, never before.

---

## How the Mode appears in practice

### In a code review

> *"Where's the eval suite for this skill?"* — applying tenet 2.
>
> *"This deploy gives the agent write access to production data. Which human owns the rollback if it goes wrong?"* — applying tenet 6.
>
> *"You're hardcoded to a single model provider. What's your fallback?"* — applying tenet 5.

### In a stand-up

> *"Before we add the loan-approval feature, let me sketch the skill graph and show you how the work decomposes."* — applying tenet 1.
>
> *"I'm going to write the policy spec for who can invoke this before I touch the implementation."* — applying tenet 3.

### In a steering meeting

> *"We can ship this. The evidence binder is complete, the eval suite shows 96% pass rate over the last 30 days, the governance review has signed off. The audit artifact predates the claim."* — applying tenet 4.

---

## When the Mode is most needed

The Mode is most easily abandoned during the moments when it matters most:

- **Under deadline pressure.** "We'll add the eval suite after launch." (Violation of tenet 2.)
- **When everyone agrees.** "Compliance will sign off; let's just ship." (Violation of tenet 4.)
- **When a vendor offers a tempting all-in-one.** "Their platform handles everything; we don't need fallbacks." (Violation of tenet 5.)
- **When the agent is impressive.** "This thing is so good we should let it act autonomously." (Violation of tenet 6.)

An architect who can hold the Mode during these moments is the architect organizations actually need.

---

## How to learn the Mode

You cannot learn the Mode by reading this document. You learn it by:

1. **Practicing each tenet on real work.** Each Innorve Method skill (IM-01 through IM-08) operationalizes one or more tenets. Start with the framework that targets the tenet you most want to strengthen.
2. **Producing the artifacts.** The Mode is visible in the artifacts an architect leaves behind: skill contracts, eval suites, governance binders, capability graphs, tenant posture cards, multi-tool decision documents. If your artifacts are absent or thin, your Mode is absent or thin.
3. **Working in a community that holds the standard.** The Innorve Academy free community and cohort programs exist to give architects a peer group that catches lapses and reinforces the discipline.

---

## The Mode and the Ladder

The six tenets map to the Innorve Architect Ladder:

| Ladder Level | Mode practice |
|--------------|---------------|
| **L0 — AI User** | Has not yet encountered the Mode |
| **L1 — AI Builder** | Aware of the tenets; applies inconsistently |
| **L2 — AI Operator** | Applies most tenets on most projects; some still feel optional |
| **L3 — AI-Native Architect** | Applies all six tenets as default; produces named artifacts for each |
| **L4 — Certified Innorve Architect** | Applies the Mode under client pressure; has measurable evidence of upholding it |
| **L5 — Innorve Fellow** | Refines the Mode itself; contributes patterns that other architects adopt |

You move up the Ladder by demonstrating Mode practice with evidence. You do not move up by claiming familiarity.

---

## Citation

> Innorve Native Mode (v0.1, 2026). Innorve Academy.
> https://innorve.academy/method#native-mode
> https://github.com/Innorve-Inc/innorve-method/blob/main/docs/INNORVE-NATIVE-MODE.md

---

*Innorve Native Mode v0.1 · Published April 26, 2026 · Apache 2.0 (text) · Brand reserved by Innorve, Inc.*
