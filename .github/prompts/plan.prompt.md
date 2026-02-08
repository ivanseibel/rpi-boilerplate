# Plan Phase Prompt

**Purpose:** Transition from Research to Plan by producing an actionable, atomic task list.

**Input:** `.rpi/<project-id>/research.md`

## Instructions

Read the validated `research.md` and produce a detailed implementation plan. Your plan must:

1. **Reference research facts** - All decisions must trace to `research.md` citations
2. **Decompose atomically** - Each task is independently executable and verifiable
3. **Include verification** - Every task has explicit pass/fail criteria
4. **Validate against FACTS** - Ensure plan is Feasible, Atomic, Clear, Testable, Scoped

## Output Structure

Produce `plan.md` in `.rpi/<project-id>/` with these sections:

- Strategy and Scope (references `research.md`)
- Architectural Decomposition (if applicable)
- Atomic Task List (checkbox format with verification)
- Verification Plan (automated and manual checks)
- Validation — FACTS Criteria

## Handoff

Plan is complete when `plan.md` exists, passes FACTS validation, and stakeholders (including Implementer) sign off.

---

**Example invocation:**

```
Start Plan phase for project "implement-feature-x".

Input: .rpi/0002-implement-feature-x/research.md

Requirements:
- Produce atomic tasks referencing research.md facts
- Include verification steps with pass/fail criteria
- Validate against FACTS before completion

Output: .rpi/0002-implement-feature-x/plan.md
```
