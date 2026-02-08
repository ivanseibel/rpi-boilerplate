# Validation Guide

This document describes how to validate RPI artifacts against quality criteria.

## Research Phase: FAR Criteria

**Factual** - Does the research cite authoritative sources?
- ✅ Pass: Every claim references a source document, API doc, or official specification
- ❌ Fail: Contains unsupported assertions, assumptions, or opinions

**Actionable** - Can the Planner use this research to make decisions?
- ✅ Pass: Provides concrete options, constraints, and technical details
- ❌ Fail: Vague descriptions, missing technical specifics, no clear paths forward

**Relevant** - Does the research address the problem statement?
- ✅ Pass: All sections relate to the stated problem; no tangents
- ❌ Fail: Off-topic content, explores unrelated systems, scope drift

### Validation Checklist for research.md

- [ ] Problem Statement Analysis section exists
- [ ] Conceptual Scope section exists
- [ ] System Constraints section exists
- [ ] Existing Patterns and Exemplars section exists
- [ ] Validation — FAR Criteria section exists with justifications
- [ ] Notes on Unknowns section exists
- [ ] All factual claims have inline citations
- [ ] No solution proposals or implementation plans present

---

## Plan Phase: FACTS Criteria

**Feasible** - Can this be implemented with available resources?
- ✅ Pass: Tasks align with research.md constraints; no unsupported assumptions
- ❌ Fail: Requires unavailable APIs, violates documented constraints, assumes unverified capabilities

**Atomic** - Is each task independently executable?
- ✅ Pass: Every task can be done in isolation without dependencies on incomplete work
- ❌ Fail: Tasks require sequential coupling, unclear boundaries, or hidden dependencies

**Clear** - Are task descriptions unambiguous?
- ✅ Pass: Each task specifies exact actions, file paths, and expected outcomes
- ❌ Fail: Vague instructions, missing details, open to interpretation

**Testable** - Does each task have pass/fail criteria?
- ✅ Pass: Every verification step defines success and failure conditions
- ❌ Fail: No verification steps, subjective criteria, or "test somehow" instructions

**Scoped** - Is the plan appropriately bounded?
- ✅ Pass: Clear in/out of scope section; work stays within defined limits
- ❌ Fail: Scope creep, unbounded work, or "nice to have" features included

### Validation Checklist for plan.md

- [ ] Strategy and Scope section exists with research.md references
- [ ] Atomic Task List exists with checkbox format
- [ ] Every task has Action and Verification subsections
- [ ] Every verification has explicit Pass and Fail criteria
- [ ] Verification Plan section describes automated and manual checks
- [ ] Validation — FACTS Criteria section exists with justifications
- [ ] All tasks reference research.md facts (no unsupported assumptions)

---

## Implementation Phase: Quality Gate

Each task must pass the Quality Gate before being marked complete:

1. **Build** - Does the project compile/build successfully?
2. **Lint** - Are there no style or syntax violations?
3. **Test** - Do task-specific tests and regression tests pass?

### Completion Marking

- ✅ **Success:** Change `[ ]` to `[x]` in plan.md
- ❌ **Failure:** Do not mark complete; retry (max 3 attempts) or escalate

### Escalation Rules

- **Minor Failure (Code Level):** Retry same task (max 3 times)
- **Major Failure (Plan Level):** Halt and recurse to Plan phase
- **Critical Failure (Research Level):** Halt and recurse to Research phase or abort

---

## CI Validation

The `.github/workflows/rpi-validate.yml` workflow enforces structural requirements:

- Presence of required files (research.md, plan.md, AGENTS.md, etc.)
- YAML frontmatter correctness (applyTo in scoped instructions)
- Name format compliance (skill name regex: `^[a-z0-9-]+$`)
- Prompt Input: line presence
- SIGNOFF file for implementation PRs

**Usage:**

```bash
# CI runs automatically on push and pull_request
# To check locally:
git add .
git commit -m "test: validate artifacts"
git push
# Check GitHub Actions tab for results
```

---

## Manual Verification

### VS Code Load Checks

Verify that VS Code has loaded custom instructions and skills:

1. Open **Copilot Chat: Show Customization Diagnostics** (Command Palette)
2. Check "Custom Instructions" section - should list `.github/copilot-instructions.md` and scoped files
3. Check "Skills" section - should list `rpi-workflow` skill
4. If missing, check Developer Tools Console (Help > Toggle Developer Tools) for loading errors

### Local Artifact Checks

```bash
# Verify file structure
test -f .github/copilot-instructions.md && echo "✅ Global instructions"
test -d .github/instructions && echo "✅ Scoped instructions dir"
test -d .github/skills/rpi-workflow && echo "✅ RPI workflow skill"
test -f AGENTS.md && echo "✅ Governance file"

# Verify frontmatter
grep -q "^---" .github/instructions/research.instructions.md && echo "✅ Research instructions frontmatter"
grep -q "applyTo:" .github/instructions/research.instructions.md && echo "✅ Research applyTo present"
```

Run `scripts/check-vscode-load.sh` for automated verification guidance.
