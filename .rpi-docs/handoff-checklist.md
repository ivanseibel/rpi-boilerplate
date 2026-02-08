# RPI Workflow Handoff Checklist

This checklist ensures proper phase transitions and completion criteria for the RPI (Research → Plan → Implement) workflow.

## Research → Plan Handoff

Before transitioning from Research to Plan phase, verify:

- [ ] **research.md validated** - File exists in `.rpi/<project-id>/research.md` with all required sections:
  - Problem Statement Analysis
  - Conceptual Scope
  - System Constraints
  - Existing Patterns and Exemplars
  - Validation — FAR Criteria (Factual, Actionable, Relevant)
  - Notes on Unknowns

- [ ] **All sources cited** - Every factual claim has inline parenthetical reference

- [ ] **No solution proposals** - Research contains only facts, constraints, and patterns (no implementation plans)

- [ ] **FAR criteria pass** - Research is Factual (cited), Actionable (provides decision support), Relevant (addresses problem)

- [ ] **Planner acknowledges** - Planner has read and accepted research.md as foundation for planning

## Plan → Implement Handoff

Before transitioning from Plan to Implement phase, verify:

- [ ] **plan.md present and FACTS affirmed** - File exists in `.rpi/<project-id>/plan.md` with:
  - Strategy and Scope section (references research.md)
  - Atomic Task List with checkbox format `[ ]`
  - Every task has Action and Verification subsections
  - Every verification has explicit Pass and Fail criteria
  - Verification Plan section
  - Validation — FACTS Criteria section with justifications

- [ ] **All tasks reference research** - No unsupported assumptions; all decisions trace to research.md

- [ ] **Tasks are atomic** - Each task can be independently executed and verified

- [ ] **FACTS criteria pass** - Plan is Feasible (within constraints), Atomic (independent tasks), Clear (unambiguous), Testable (pass/fail criteria), Scoped (bounded)

- [ ] **AGENTS.md reviewed** - All stakeholders understand role boundaries and handoff rules

- [ ] **Stakeholder sign-off** - Implementer and reviewers acknowledge plan acceptance

## Implement → Review Handoff

Before transitioning from Implement to Review phase, verify:

- [ ] **All tasks complete** - Every task in plan.md marked `[x]`

- [ ] **Quality gates passed** - For each task:
  - Build succeeded
  - Linter passed
  - Tests passed (unit and regression)

- [ ] **CI validation passing** - `.github/workflows/rpi-validate.yml` workflow succeeds

- [ ] **SIGNOFF created** - Implementer has created `.rpi/<project-id>/SIGNOFF` file to signal completion

## SIGNOFF File Format

The SIGNOFF file is a simple existence marker that indicates the Implementer has completed all tasks and accepts the implementation scope.

**Location:** `.rpi/<project-id>/SIGNOFF`

**Format:** Empty file or single line:

```
SIGNOFF
```

**Purpose:**
- Signals implementation phase completion
- Triggers code review process
- CI checks for SIGNOFF presence on implementation PRs

## Creating a SIGNOFF

When all tasks in `plan.md` are complete and verified:

```bash
# Navigate to your project directory
cd .rpi/<project-id>

# Create SIGNOFF file
echo "SIGNOFF" > SIGNOFF

# Add and commit
git add SIGNOFF
git commit -m "chore: implementation complete - add SIGNOFF"
```

## CI Enforcement

The CI workflow (`.github/workflows/rpi-validate.yml`) enforces:

- Research artifacts exist before planning
- Plan artifacts exist before implementation
- SIGNOFF file exists for implementation merge requests
- All artifact structure is valid (frontmatter, required sections, etc.)

## Recursion and Escalation

If any handoff criteria cannot be met:

**Research Phase Issues:**
- Missing sources → Continue research until all claims are cited
- Scope unclear → Refine problem statement and conceptual scope
- FAR fails → Revise research.md until criteria pass

**Plan Phase Issues:**
- Tasks not atomic → Decompose further
- Missing verification → Add explicit pass/fail criteria for each task
- Research assumptions → Return to Research phase to validate unknowns
- FACTS fails → Revise plan.md until criteria pass

**Implementation Phase Issues:**
- Task impossible → Halt, document blocker, return to Plan phase
- Quality gate fails → Retry (max 3 times) or escalate to Plan
- Fundamental limitation discovered → Return to Research phase

## Additional Resources

- **Agent Roles:** See `AGENTS.md` for detailed role definitions and constraints
- **Validation Guide:** See `.github/skills/rpi-workflow/resources/validation/README.md` for FAR and FACTS criteria details
- **Operator Guide:** See `.rpi-docs/rpi-workflow.md` for comprehensive workflow documentation
- **Methodology Docs:** See `.rpi-docs/` for detailed RPI phase protocols

---

**Last Updated:** 2026-02-08
