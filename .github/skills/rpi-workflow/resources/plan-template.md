# Plan Template

Use this template when creating a new `plan.md` file for the Plan phase of RPI workflow.

---

# Plan: <Project Title>

## 1. Strategy and Scope

- **Chosen approach:** <Brief description of the strategy>
- **Why this aligns with `research.md`:** <Reference specific sections from research.md>
- **In scope:**
  - <Item 1>
  - <Item 2>
- **Out of scope:**
  - <Item 1>
  - <Item 2>

## 2. Architectural Decomposition

<Describe the high-level components, layers, or modules if applicable. Skip if not needed.>

- **Component A:** <Purpose and responsibility>
- **Component B:** <Purpose and responsibility>

## 3. Atomic Task List

All tasks must be atomic, independently executable, reference `research.md` where applicable, and include exact verification steps with pass/fail criteria.

[ ] Task 1 — <Descriptive name> (research.md — Section X).
- Action: <What to do>
- Verification: <How to verify> Pass: <success criteria>. Fail: <failure criteria>.

[ ] Task 2 — <Descriptive name> (research.md — Section Y).
- Action: <What to do>
- Verification: <How to verify> Pass: <success criteria>. Fail: <failure criteria>.

_Add more tasks as needed..._

## 4. Verification Plan

- **Automated enforcement:** <Describe CI, linting, test suites>
- **Manual verification:** <Describe operator checks, load tests, integration tests>
- **RPI constraints enforcement:** <How are phase transitions validated?>
- **Early failure detection:** <What signals a problem early?>

## 5. Validation — FACTS Criteria

- **Feasible:** Yes/No
  - Justification: <Why this plan can be executed with available resources and constraints>

- **Atomic:** Yes/No
  - Justification: <Why each task is independently executable and verifiable>

- **Clear:** Yes/No
  - Justification: <Why task descriptions are unambiguous with explicit steps>

- **Testable:** Yes/No
  - Justification: <Why each task has concrete pass/fail criteria>

- **Scoped:** Yes/No
  - Justification: <Why the plan limits work appropriately and avoids scope creep>

---

**Notes on unknowns:** If implementation requires a decision not derivable from `research.md`, the Implementer must stop and open an Issue referencing `research.md` Unknowns. Do not proceed until resolved.

(End of plan)
