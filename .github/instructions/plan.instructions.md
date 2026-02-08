---
applyTo: .rpi/**/plan.md
description: Plan phase constraints for RPI workflow - enforces atomic task decomposition with verification steps
---

# Plan Phase Instructions

## Constraints

- **Must:** Produce atomic checklists with verification steps. Each task must be independently testable.
- **Must:** Reference facts from `research.md`—do not introduce assumptions not grounded in research.
- **Must:** Validate plan output against FACTS criteria (Feasible, Atomic, Clear, Testable, Scoped) before completing.
- **Must:** Include pass/fail criteria for every verification step.

## Expected Output

Produce `plan.md` in `.rpi/<project-id>/plan.md` with the following sections:

1. **Strategy and Scope** - Chosen approach, why it aligns with research, what's in/out of scope.
2. **Architectural Decomposition** - High-level component breakdown (if applicable).
3. **Atomic Task List** - Checkbox list with verification steps and explicit pass/fail criteria.
4. **Verification Plan** - How will correctness be enforced (automated, manual, CI)?
5. **Validation — FACTS Criteria** - Is this plan Feasible, Atomic, Clear, Testable, Scoped?

## Task Format

Each task must follow this pattern:

```
[ ] Task N — <Descriptive name> (research.md — Section X reference)
- Action: <What to do>
- Verification: <How to verify> Pass: <success criteria> Fail: <failure criteria>
```

## Recursion

If implementation discovers the plan is impossible, implementer must halt and return to this phase for replanning.
