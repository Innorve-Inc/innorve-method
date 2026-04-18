#!/usr/bin/env bun
/**
 * Validates SKILL.md files in the Innorve Method plugin.
 *
 * Checks:
 *   1. Every skill folder has a SKILL.md
 *   2. Every SKILL.md has YAML frontmatter with required fields
 *   3. Every SKILL.md follows the standard section structure
 *   4. No banned hype words appear in any skill
 *
 * Run: bun scripts/validate-skills.ts
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = "plugins/innorve-method/skills";
const REQUIRED_FRONTMATTER_FIELDS = ["name", "description"];
const REQUIRED_SECTIONS = [
  "## Why this matters",
  "## What this is NOT",
];
const BANNED_WORDS = [
  "supercharge",
  "unlock the power",
  "10x your",
  "revolutionary",
  "game-changing",
  "game changer",
  "groundbreaking",
  "next-generation",
  "cutting-edge",
];

let errors: string[] = [];
let skillCount = 0;

function loadSkill(path: string) {
  const content = readFileSync(path, "utf-8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    errors.push(`${path}: missing YAML frontmatter`);
    return null;
  }
  const fm: Record<string, string> = {};
  for (const line of fmMatch[1].split("\n")) {
    const m = line.match(/^([a-z-]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return { fm, content };
}

const skillFolders = readdirSync(SKILLS_DIR).filter((f) =>
  statSync(join(SKILLS_DIR, f)).isDirectory(),
);

for (const folder of skillFolders) {
  const skillPath = join(SKILLS_DIR, folder, "SKILL.md");
  let parsed;
  try {
    parsed = loadSkill(skillPath);
  } catch {
    errors.push(`${folder}: SKILL.md not found`);
    continue;
  }
  if (!parsed) continue;
  skillCount++;
  const { fm, content } = parsed;

  for (const f of REQUIRED_FRONTMATTER_FIELDS) {
    if (!fm[f]) errors.push(`${folder}: frontmatter missing '${f}'`);
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(section)) {
      errors.push(`${folder}: missing required section '${section}'`);
    }
  }

  const lower = content.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      errors.push(`${folder}: contains banned hype word '${word}'`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\nFound ${errors.length} validation errors:\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\nValidated ${skillCount} skills.\n`);
  process.exit(1);
}

console.log(`\n✓ All ${skillCount} skills passed validation.\n`);
process.exit(0);
