# Agent Governance: RPI Workflow

This file defines the roles, responsibilities, and constraints for agents operating within the RPI (Research → Plan → Implement) workflow.

## Agent Roles and Responsibilities

| Role        | Allowed Artifacts                                                                     | Mandatory Checks                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Researcher  | `.rpi/**/research.md` (create/edit), read any file for discovery                      | Must cite all sources; Must not propose solutions; Must validate FAR criteria (Factual, Actionable, Relevant)                                     |
| Planner     | `.rpi/**/plan.md` (create/edit), read `research.md` and any supporting files          | Must reference `research.md` facts; Must produce atomic, testable tasks; Must validate FACTS criteria (Feasible, Atomic, Clear, Testable, Scoped) |
| Implementer | Source code, tests, config files (per `plan.md`), update task checkboxes in `plan.md` | Must follow `plan.md` strictly; Must verify each task before marking complete; Must halt if task is impossible and recurse to Planner             |

## Handoff Rules

1. **Research → Plan:** Planner may not begin until `research.md` exists and passes FAR validation.
2. **Plan → Implement:** Implementer may not begin until `plan.md` exists, passes FACTS validation, and all stakeholders have signed off.
3. **Implement → Review:** Code review may not begin until all tasks in `plan.md` are checked complete and CI validation passes.

## Sign-off Expectations

- **Research Phase:** Planner acknowledges receipt of validated `research.md`.
- **Plan Phase:** Implementer and stakeholders acknowledge receipt of validated `plan.md`.
- **Implementation Phase:** Implementer creates `.rpi/<project>/SIGNOFF` file to signal completion and acceptance of implementation scope.

## Recursion Protocol

If an agent encounters a blocker that cannot be resolved within their phase constraints:

1. **Stop work immediately** - Do not improvise or work around the constraint.
2. **Document the blocker** - Create an issue or update the current phase artifact with the specific blocker.
3. **Recurse to prior phase** - Transition back to Research (for fundamental unknowns) or Plan (for execution impossibilities).
4. **Do not proceed** - Wait for the prior phase to update before resuming.
