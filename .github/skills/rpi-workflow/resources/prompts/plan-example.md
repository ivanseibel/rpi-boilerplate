# Plan Phase Prompt Example

This example shows how to invoke the Plan phase after Research is complete.

---

**Prompt:**

```
I have completed the Research phase for project "0001-implement-rpi-workflow".

Input: .rpi/0001-implement-rpi-workflow/research.md

Please transition to the Plan phase:

1. Read and validate research.md against FAR criteria (Factual, Actionable, Relevant).
2. Produce plan.md in .rpi/0001-implement-rpi-workflow/ following the plan template.
3. Ensure all tasks reference research.md facts and include verification steps.
4. Validate the plan against FACTS criteria (Feasible, Atomic, Clear, Testable, Scoped).

Scope: Create repository artifacts for RPI workflow (instructions, skills, governance, CI).

Constraints:
- Each task must be independently executable
- Each task must have explicit pass/fail criteria
- All decisions must trace back to research.md
- Do not assume runtime features not documented in research.md
```

---

**Expected Output:**

A `plan.md` file with:
- Strategy and scope section referencing research.md
- Atomic task list with verification steps
- FACTS validation confirming plan quality

**Handoff:**

Once plan.md is complete and validated, the Implementer can begin execution by reading plan.md and executing tasks sequentially.
