# Skill Examples

## Minimal skill

---
name: webapp-testing
description: Run and interpret web app tests, including unit and end-to-end suites.
---

# Web App Testing

## When to use this skill

Use this skill to run tests and triage failures for the web app.

## Steps

1. Identify the test type and command.
2. Run the test and capture failures.
3. Summarize failures and propose fixes.

## Full skill with resources

---
name: api-safety-review
description: Review API changes for authentication, authorization, and data exposure risks.
license: Proprietary
compatibility: Requires git and repository access
metadata:
  author: platform-team
  version: "1.0"
allowed-tools: Read Bash(git:*)
---

# API Safety Review

## When to use this skill

Use this skill when reviewing API changes that might affect auth, data access, or sensitive fields.

## Steps

1. Read relevant diffs and API specs.
2. Identify auth and data exposure changes.
3. Produce findings with file references and risk level.
