# Contributing to the Innorve Method

Thank you for considering contributing to the open Innorve Method. This document describes how we work and what makes a contribution likely to be accepted.

---

## What we welcome

### High-leverage contributions

1. **Worked examples** — Real scenarios where you applied a framework, anonymized as needed. These make the skills 2-3× more useful for the next reader. Submit as a PR adding to the `## Worked examples` section of any SKILL.md.

2. **Clarifications** — Places where a coaching flow is ambiguous, where a step could be sharper, where a question is missing. These improve the skill in the smallest possible diff.

3. **Industry references** — Peer-reviewed papers, regulatory guidance documents, production case studies, or canonical books that strengthen the `## Further reading` section. We accept references to NIST, ISO, OWASP, IEEE, ACM, BIS, and equivalents. We are skeptical of vendor-published whitepapers unless they describe production patterns we don't see elsewhere.

4. **Translations** — We welcome translations of any SKILL.md into other languages. File these under `plugins/innorve-method/skills/[skill-name]/SKILL.<lang>.md` (e.g., `SKILL.es.md`, `SKILL.hi.md`). The English version remains canonical for versioning.

5. **Spec implementations** — If you build a tool that implements one of the [Innorve Specs](https://innorve.academy/spec), open an issue using the `spec-implementation` template and we'll add you to the spec page's "Implementations" list.

6. **Framework feedback** — If you think the next version of the Method should add, refine, or split a framework, file an issue using the `framework-feedback` template. Major framework changes ship in versions (v0.2, v0.3, ...). Substantive proposals are reviewed quarterly.

### Acceptance bar

All contributions must:

- Match the existing voice (direct, restrained, engineer-to-engineer — no hype, no "supercharge," no "unlock")
- Pass the YAML frontmatter validation in CI (run via GitHub Actions)
- Maintain the coaching-not-automation principle
- Be accompanied by a `git commit` message in [Conventional Commits](https://www.conventionalcommits.org/) format

### What we will not accept

- Contributions that turn a skill into a code generator (the skill must coach, not produce ready-to-ship implementation)
- Contributions that publish a fork-able starter project (the user's artifact must be theirs, not derived from ours)
- Marketing language or hype copy
- Renaming of frameworks or violation of the IM-XX numbering scheme without going through framework-feedback first
- Pull requests without an associated issue for substantive changes
- Contributions that misuse the Innorve, Innorve Academy, or Innorve Architect trademarks (see [TRADEMARK.md](TRADEMARK.md))

---

## How to submit a pull request

1. **Fork** the repository
2. **Create a feature branch** from `main`: `git checkout -b improve-im03-binder-template`
3. **Make your change** — keep diffs small and focused
4. **Run the validator locally**:
   ```bash
   bun scripts/validate-skills.ts
   ```
   The CI will run the same check on PR.
5. **Commit** in Conventional Commits format:
   ```
   docs(im-03): add SOC 2 control mapping table to evidence binder
   ```
   Type prefixes we use: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`.
6. **Push** to your fork and open a PR against `main`
7. **Tag** at least one of the PR labels: `worked-example`, `clarification`, `reference`, `translation`, `spec-impl`, `framework-feedback`, `infra`
8. **Be patient** — we review PRs weekly on Friday mornings

---

## Issue templates

We have four issue templates:

- `bug-report` — Something in a SKILL.md is wrong, broken, or unclear
- `worked-example` — You want to contribute a real-world example
- `framework-feedback` — You have a substantive proposal for v0.2 of the Method
- `spec-implementation` — You built a tool that implements an Innorve Spec

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Report unacceptable behavior to `conduct@innorve.ai`.

---

## How decisions get made

The Innorve Method is maintained by the Innorve Academy faculty team. The current maintainers are listed in [MAINTAINERS.md](MAINTAINERS.md).

Major decisions follow this rhythm:

| Type of change | Process |
|---------------|---------|
| Typo, clarification, additional reference | PR review + merge |
| New worked example | PR review by 1 maintainer |
| New section in an existing SKILL.md | PR + 2 maintainer reviews |
| New skill or framework split | Framework-feedback issue → 4-week public discussion → maintainer vote → ships in next minor version |
| Breaking change to spec | Major version bump (v1.0, v2.0) — happens roughly annually |

---

## Becoming a maintainer

Active contributors who demonstrate sustained good judgment and writing quality may be invited to become maintainers. There is no application — invitations are extended by current maintainers.

Maintainers commit to:

- Reviewing PRs within 7 days
- Attending the quarterly Innorve Method roadmap call
- Upholding the brand voice and the trademark policy
- Acting in the interest of the broader Innorve Architect community, not personal preference

---

## Reporting trademark misuse

If you see the Innorve name, the Innorve Method name, the AI-Native Architect role name, or the Innorve Architect credential being misused (e.g., someone claiming to be "Innorve Certified" without going through the credentialing process), please report at `legal@innorve.ai`.

We take brand integrity seriously. The credibility of the credential depends on it.

---

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE), the same license as the rest of this project.

You retain the copyright to your contributions. You grant Innorve, Inc. and other recipients a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable license to reproduce, prepare derivative works of, publicly display, publicly perform, sublicense, and distribute your contributions per Apache 2.0.

---

## Thank you

Building a profession is a multi-year project. Every contribution moves the AI-Native Architect role one step closer to being the recognized, credentialed, well-paid discipline it deserves to be.

— The Innorve Academy team
