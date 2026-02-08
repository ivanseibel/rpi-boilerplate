---
name: rpi-workflow
description: Assist with Research → Plan → Implement workflow by providing templates, validation guidance, and phase transition helpers for systematic software development.
---

# RPI Workflow Skill

This skill helps agents and operators navigate the Research → Plan → Implement (RPI) pattern for systematic software development.

## Usage

Invoke this skill when:

- **Starting a new RPI project** - Need templates and structure for research/plan artifacts.
- **Transitioning between phases** - Ensuring proper handoff criteria are met.
- **Validating artifacts** - Checking research.md against FAR criteria or plan.md against FACTS criteria.
- **Understanding phase constraints** - Learning what's allowed/forbidden in each phase.

### Phase-Specific Guidance

**Research Phase:**
- Produce `.rpi/<project-id>/research.md` following the template.
- Maintain read-only posture—no solution proposals.
- Cite all sources inline (e.g., `source.md — Section 2`).
- Validate against FAR: Factual, Actionable, Relevant.

**Plan Phase:**
- Produce `.rpi/<project-id>/plan.md` following the template.
- Reference facts from `research.md`—no unsupported assumptions.
- Decompose into atomic tasks with pass/fail verification.
- Validate against FACTS: Feasible, Atomic, Clear, Testable, Scoped.

**Implement Phase:**
- Execute tasks from `plan.md` sequentially.
- Mark tasks complete only after verification passes.
- Halt and recurse to Plan if task is impossible.
- Create `.rpi/<project-id>/SIGNOFF` when all tasks complete.

## Resources

- [Plan Template](resources/plan-template.md) - Boilerplate structure for plan.md files.
- [Prompt Examples](resources/prompts/plan-example.md) - Sample prompts for phase transitions.
- [Validation Guide](resources/validation/README.md) - How to check FAR and FACTS criteria.

## Technical Notes

This skill works with:
- **Global instructions:** `.github/copilot-instructions.md` (RPI constitution)
- **Scoped instructions:** `.github/instructions/*.instructions.md` (phase-specific constraints)
- **Governance:** `AGENTS.md` (role definitions and handoff rules)
- **Prompt entry points:** `.github/prompts/*.prompt.md` (operator UX helpers)

All artifacts are repository-backed and validated by CI (`.github/workflows/rpi-validate.yml`).
