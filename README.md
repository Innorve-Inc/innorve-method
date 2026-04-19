# The Innorve Method

> Eight teaching skills for architecting AI-native systems.
> Open-source. Installable in Claude Code and Cursor.
> The methodology taught at Innorve Academy.

[![Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Method Version](https://img.shields.io/badge/Innorve%20Method-v0.1-FF6B35.svg)](https://innorve.academy/method)
[![Innorve Academy](https://img.shields.io/badge/by-Innorve%20Academy-0A1628.svg)](https://innorve.academy)

---

## What this is

This repository is the open implementation of the **Innorve Method** — a methodology for architecting AI into organizations, distilled from years of building production AI for banks, credit unions, healthcare networks, and other regulated enterprises.

Eight frameworks. Each one a specific discipline. Each one shipped here as a coaching skill that runs inside your editor and walks you through doing the work yourself.

| ID | Framework | What the skill does |
|----|-----------|---------------------|
| **IM-01** | Skill Architecture Patterns | Decompose any work into reusable, testable AI skills |
| **IM-02** | Policy-as-Code Methodology | Translate governance rules into version-controlled policy code |
| **IM-03** | Evidence-by-Design Framework | Scaffold a Governance Binder for an AI system you're building |
| **IM-04** | Skill Contract Schema | Author a typed contract for a new AI skill |
| **IM-05** | Maturity Gate Model | Evaluate whether a skill is ready to ship |
| **IM-06** | Capability Graph Thinking | Map your team's AI capabilities across the SDLC |
| **IM-07** | Tenant-Aware Design | Choose the right architectural posture per context |
| **IM-08** | Multi-Tool Strategy | Pick models + frameworks + deployment with churn resilience |

These are **teaching skills, not production templates**. They will not write your system for you. They will coach you through architecting it yourself, so the system has your name on every line.

This separation is deliberate. The discipline is open; the artifact you build is yours.

---

## Why this exists

Most AI education today teaches one of two things:

1. **How to use AI** — prompting, chat tools, no-code agents
2. **How to train AI** — academic ML, model architecture, fine-tuning

Almost no one teaches the third thing — how to *architect* AI into organizations so the resulting systems are reliable, safe, auditable, and acceptable to compliance officers, regulators, and CISOs.

That is the work of the **AI-Native Architect**. It is the most-asked-for and least-taught skill in software right now, and the gap is widening every quarter.

We named the role, distilled the discipline that produces it, and founded the credentialing body that certifies it: [Innorve Academy](https://innorve.academy). The methodology you are reading is what the Academy teaches. We publish it openly because a discipline cannot become a profession behind a paywall.

The contract is intentional and durable: **the methodology is open, the brand and the credential are not.** Anyone can study the Innorve Method, build with it, cite it, teach it. Only Innorve Academy can issue the Innorve Architect credential. That is what makes the credential meaningful.

---

## Innorve Native Mode — the working posture

The skills above teach techniques. The Mode is the doctrine that orders them.

> **Architect before automating. Evaluate before trusting. Govern before scaling. Evidence before claims. Portability before tool lock-in. Human accountability before agent autonomy.**

Six tenets, applied in order. Architects who internalize the Mode produce AI systems that ship, survive, audit, and scale. Architects who skip a tenet produce systems that hold up in demos and collapse under pressure.

Read the full doctrine: [`docs/INNORVE-NATIVE-MODE.md`](docs/INNORVE-NATIVE-MODE.md)

---

## Install

### In Claude Code

```bash
/plugin marketplace add Innorve-Inc/innorve-method
/plugin install innorve-method
```

Then invoke any skill:

```
/innorve-method                       # The index — start here
/innorve-skill-architecture           # IM-01
/innorve-policy-as-code               # IM-02
/innorve-evidence-binder              # IM-03
/innorve-skill-contract               # IM-04
/innorve-maturity-gate                # IM-05
/innorve-capability-graph             # IM-06
/innorve-tenant-aware                 # IM-07
/innorve-multi-tool                   # IM-08
```

### In Cursor

1. Open Cursor Settings → General → Team marketplace
2. Add `https://github.com/Innorve-Inc/innorve-method` as the repository URL
3. Install the `innorve-method` plugin
4. Invoke any of the skills above

### Manual install

Clone the repo and copy `plugins/innorve-method/skills/` into your `~/.claude/skills/` (or your tool's equivalent skills directory).

```bash
git clone https://github.com/Innorve-Inc/innorve-method.git
cp -r innorve-method/plugins/innorve-method/skills/* ~/.claude/skills/
```

---

## Where to start

If you're new, invoke `/innorve-method` first. The index skill asks where you are in your AI work, then routes you to the right framework to apply right now.

If you already know what you need, here's a decision tree:

| Your situation | Skill to use |
|----------------|-------------|
| Designing a new AI workflow from scratch | `/innorve-skill-architecture` (IM-01) |
| Have a working agent and need to make it safer | `/innorve-policy-as-code` (IM-02) |
| Need to ship and your CISO is asking questions | `/innorve-evidence-binder` (IM-03) |
| Building a skill but don't know how to define its inputs/outputs | `/innorve-skill-contract` (IM-04) |
| Have a skill in development and need to know if it's ready | `/innorve-maturity-gate` (IM-05) |
| Trying to figure out where AI fits in your team's work | `/innorve-capability-graph` (IM-06) |
| Designing for an enterprise or regulated context | `/innorve-tenant-aware` (IM-07) |
| Choosing models, frameworks, deployment for the next 24 months | `/innorve-multi-tool` (IM-08) |

---

## What you'll produce

Each skill produces a named output artifact. These artifacts are yours — you save them in your project, version them in git, share them with your team, attach them to job applications. Together they form the documentation of your AI-native work:

- **Skill Graph** (Mermaid diagram + skill candidate list) — IM-01
- **Policy Specification** (YAML) — IM-02
- **Governance Binder** (folder skeleton with model card, risk register, eval reports, prompt register, audit trail config, deployment notes) — IM-03
- **Skill Contract** (YAML conforming to Innorve Skill Contract Schema v0.1) — IM-04
- **Maturity Gate Report** (Markdown) — IM-05
- **Capability Graph** (Mermaid + map document) — IM-06
- **Tenant Posture Card** (Markdown) — IM-07
- **Multi-Tool Decisions** (Markdown with named fallbacks) — IM-08

Hiring managers at AI-native organizations are starting to ask for these artifacts in interviews. The Innorve Academy maintains the [open specifications](https://innorve.academy/spec) for each artifact format.

---

## What this is NOT

We are explicit about the bounds:

- ❌ It is **not** a production system you can ship as-is.
- ❌ It is **not** a code generator. The skills coach you; you write the code.
- ❌ It is **not** a replacement for engineering judgment. The frameworks force structure, not decisions.
- ❌ It is **not** Innorve's private codebase. We keep our production systems closed; the methodology is what's open.
- ❌ It is **not** a replacement for the Innorve Academy cohort. The cohort teaches the discipline through 6+ weeks of pod-based practice. The skills are the ongoing toolkit.

If you find yourself wishing the skill would just generate a working AI agent, reread the Manifesto: [The AI-Native Architect — A Declaration](https://innorve.academy/manifesto). The point is to make you the architect, not to architect for you.

---

## Trademark notice

The code in this repository is open under Apache 2.0. The Innorve name, the Innorve Method name, the AI-Native Architect role, and the Innorve Architect credential are reserved trademarks. See [TRADEMARK.md](TRADEMARK.md) for details.

You can:
- Build software that implements these frameworks
- Teach the Innorve Method (with attribution)
- Reference IM-01 through IM-08 in your work, JDs, and articles
- Cite the Method in academic publications

You cannot:
- Call yourself an "Innorve Architect" without going through the credentialing process
- Brand a derivative as "Innorve Method v2"
- Imply Innorve endorsement of your product

---

## Versioning

This is **Innorve Method v0.1**, released April 26, 2026.

Major versions ship rarely (we expect v1.0 in late 2027). Minor versions add or refine frameworks based on real-world feedback (next planned: Q3 2026).

Breaking changes are flagged in CHANGELOG.md. Any framework that gets deprecated is marked `[deprecated]` in this README and at https://innorve.academy/method for at least 12 months before removal.

---

## Contribute

We welcome contributions. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the process.

The most valuable contributions:

1. **Worked examples** — real scenarios where you applied a framework. Anonymize as needed.
2. **Clarifications** — places where a skill's coaching flow could be sharper.
3. **Industry references** — peer-reviewed papers, regulatory guidance, or production case studies that strengthen the further-reading sections.
4. **Translations** — we welcome translations of any SKILL.md file.
5. **Framework feedback** — file an issue using the `framework-feedback` template if you think v0.2 should add, refine, or split a framework.

We will not accept:

- Contributions that turn skills into code generators
- Contributions that conflict with the Innorve Method's commitment to coaching over automation
- Contributions that add hype language or marketing copy
- Contributions that create a fork-able starter project (the artifact must be the user's, not ours)

---

## The team behind this

The Innorve Method was distilled by the engineering team at [Innorve](https://innorve.ai), who ship production AI for Fortune 500 banks, regional credit unions, healthcare networks, and government agencies.

The methodology is taught by [Innorve Academy](https://innorve.academy). The next cohort starts June 14, 2026. The credentialing path is described at https://innorve.academy/method.

---

## Citation

If you reference the Innorve Method in academic, industry, or journalistic work:

```
Innorve Method (v0.1, 2026). Eight teaching skills for architecting
AI-native systems. Innorve Academy.
https://github.com/Innorve-Inc/innorve-method
```

For specific framework references, use the IM-XX numbering:

```
Innorve Method, IM-04 (Skill Contract Schema), v0.1.
https://innorve.academy/method#im-04
```

---

## What's next

- **April 26, 2026:** This repo goes public. The Innorve Method launches alongside *The AI-Native Architect — A Declaration*.
- **Q3 2026:** Innorve Method v0.2 incorporating community feedback.
- **2027:** First annual Innorve Architect Summit.
- **Long arc:** "AI-Native Architect" becomes a recognized professional role on resumes, in JDs, and in industry conversation.

If that arc resonates, [join the free community](https://innorve.academy) or [apply to Cohort 1](https://innorve.academy/apply).

---

*Innorve Method v0.1 · Released April 26, 2026 · Apache 2.0 (code) · Brand reserved by Innorve, Inc.*
