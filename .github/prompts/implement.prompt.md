# Implement Phase Prompt

**Purpose:** Execute the validated plan by implementing tasks sequentially and marking them complete.

**Input:** `.rpi/<project-id>/plan.md`

## Instructions

Read the validated `plan.md` and execute tasks in order. You must:

1. **Follow the plan strictly** - No improvisation or scope changes
2. **Execute atomically** - Complete one task fully before moving to the next
3. **Verify before marking complete** - Run Quality Gate (build, lint, test) for each task
4. **Halt on impossibility** - If a task cannot be completed as planned, stop and recurse to Plan phase

## Execution Protocol

For each task in `plan.md`:

1. Read the task action and verification steps
2. Implement the minimal code to satisfy the task
3. Run the Quality Gate (build, lint, test)
4. If pass: Mark task complete `[x]` in plan.md
5. If fail: Retry (max 3 times) or escalate (see below)

## Recursion Rules

- **Minor failure:** Task fails verification → Retry same task (max 3 attempts)
- **Major failure:** Task is impossible as planned → Halt and return to Plan phase
- **Critical failure:** Fundamental problem unsolvable → Halt and return to Research phase

## Completion

Implementation is complete when:

- All tasks in `plan.md` are marked `[x]`
- Global test suite passes
- CI validation passes
- Implementer creates `.rpi/<project-id>/SIGNOFF` file

---

**Example invocation:**

```
Start Implement phase for project "implement-feature-x".

Input: .rpi/0002-implement-feature-x/plan.md

Execute all tasks sequentially. For each task:
1. Implement minimal code
2. Verify (build, lint, test)
3. Mark complete or escalate

On completion, create .rpi/0002-implement-feature-x/SIGNOFF
```
