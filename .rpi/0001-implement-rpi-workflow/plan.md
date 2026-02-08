# Plan: Implement RPI Workflow in VSCode

## 1. Strategy and Scope

- Chosen approach: Produce repository-backed, deterministic artifacts that enable the RPI pattern (Research → Plan → Implement) using only files in the repository and CI to validate them. Artifacts include: a global instruction file, scoped instruction files, a Skills directory, governance files, phase prompt entry-points, operator guidance for VS Code load checks, and a CI validator. All decisions are derived from `research.md` and avoid assuming org/product-level toggles that are listed as Unknown in `research.md` (research.md — Sections 2, 3, 4).
- Why this aligns with `research.md`: `research.md` identifies repository artifacts (Custom Instructions, Skills, phase artifacts) as authoritative inputs for phase transitions. Making these explicit and verifiable in the repo preserves determinism and testability (research.md — Sections 2 and 4).
- In scope:
  - Produce this `plan.md` in `.rpi/0001-implement-rpi-workflow/`.
  - Create repository artifacts: `AGENTS.md`, `.github/copilot-instructions.md` (global), `.github/instructions/*.instructions.md` (scoped), `.github/skills/rpi-workflow/SKILL.md` + resources, `.github/prompts/*`, `.vscode/settings.json` (recommendations only), `.rpi-docs/rpi-workflow.md`, and `.github/workflows/rpi-validate.yml`.
  - Provide operator guidance and load-check helpers to verify VS Code sees instruction files and Skills.
- Out of scope:
  - Changing VS Code binaries, installing/uninstalling extensions, or modifying organization-level product flags. If an Implementation step requires such a runtime change not derivable from `research.md`, the Implementation agent must open a blocking issue referencing `research.md` Unknowns.

## 2. Architectural Decomposition

- Global Custom Instructions (`.github/copilot-instructions.md`): a short, always-on repository constitution that states RPI phase constraints and points to scoped instructions. It must NOT use `applyTo` in frontmatter (global file applies repository-wide per product behavior). (research.md — Section 2)

- Scoped Custom Instructions (`.github/instructions/*.instructions.md`): files with YAML frontmatter including `applyTo` patterns that target specific paths (for example `applyTo: [".rpi/**"]`). These provide phase-specific rules (Research-only rules, Plan-phase rules). Separating global and scoped instructions fixes the previously incorrect `applyTo` usage. (research.md — Section 2 "applyTo" examples)

- Skills (`.github/skills/rpi-workflow/`): contains `SKILL.md` with YAML frontmatter delimited by `---` and required fields (`name`, `description`), a `resources/` directory with `plan-template.md`, `prompts/`, and `validation/README.md`. The plan enforces `name` format (`^[a-z0-9-]+$`) and mandatory body sections (`Usage`, `Resources`). (research.md — Sections 2 and 4)

- Governance (`AGENTS.md` and optional `.rpi/AGENTS.md`): repository-level governance declaring agent roles (Researcher, Planner, Implementer), allowed edit scope per role, handoff rules, and sign-off expectations. A phase-local copy under `.rpi/` strengthens enforcement and makes review easier.

- Prompt Entry Points (`.github/prompts/`): minimal, repo-backed prompts for each phase (`research.prompt.md`, `plan.prompt.md`, `implement.prompt.md`) that reference canonical artifact paths as input and provide a succinct invocation template for operators and agents.

- VS Code load diagnostics documentation and helper (`.rpi-docs/rpi-workflow.md`, optional `scripts/check-vscode-load.sh`): documents how to verify VS Code has loaded instruction files and Skills (Copilot Chat Customization Diagnostics guidance, where to find logs), and provides a small helper script to collect evidence for a blocking issue.

- CI Validation (`.github/workflows/rpi-validate.yml`): validates file presence and structural constraints (SKILL frontmatter, instruction frontmatter with `applyTo`, prompt `Input:` lines, AGENTS.md table, etc.). CI is the primary enforcement gate for repository-only constraints.

Notes on boundaries: Where `research.md` lists multiple acceptable locations, this plan chooses the documented repository-centric defaults (`.github/skills/`, `.github/instructions/`, `.github/copilot-instructions.md`) to keep the Implementation deterministic and traceable to `research.md`.

## 3. Atomic Task List

All tasks are atomic, independently executable, reference `research.md` where applicable, and include exact verification steps with pass/fail criteria.

[x] Task 1 — Confirm `research.md` is complete (research.md — Section 5 "Validation — FAR Criteria").
- Action: Manually inspect `.rpi/0001-implement-rpi-workflow/research.md` and confirm presence of: Problem Statement Analysis; Conceptual Scope; System Constraints; Existing Patterns and Exemplars; Validation — FAR; Notes on Unknowns.
- Verification: Document a single-line confirmation in `.rpi-docs/rpi-workflow.md` stating "research.md validated: yes" and link to the file. Pass: confirmation line added. Fail: any required section missing (stop and open issue "RPI: research.md incomplete").

[x] Task 2 — Add global instruction file `/.github/copilot-instructions.md` (research.md — Section 2 "How Custom Instructions influence agent behavior").
- Action: Create `.github/copilot-instructions.md` containing a short RPI constitution (3 bullets: Research read-only & citations; Plan atomic tasks + verification; Implement follows `plan.md`) and a pointer to `.github/instructions/` for scoped guidance. Do NOT include `applyTo` in this file.
- Verification: File exists and contains the phrase "RPI constitution" and the three bullets. Pass: file present and text matches. Fail: file missing or `applyTo` present (remove and retry).

[x] Task 3 — Add scoped instruction files under `.github/instructions/` (research.md — Section 2). 
- Action: Create `.github/instructions/research.instructions.md` with YAML frontmatter `---` including `applyTo: [".rpi/**"]` and `description:`. Body must include at least one rule bullet starting with "Must: Do not propose solutions; cite sources." Create `.github/instructions/plan.instructions.md` with `applyTo: [".rpi/0001-implement-rpi-workflow/**"]` and body containing "Must: Produce atomic checklists with verification steps." 
- Verification: Each file exists; frontmatter begins with `---` and contains `applyTo` and `description`; body contains a "Must:" bullet. Pass: both files pass checks. Fail: missing frontmatter or missing keys.

[x] Task 4 — Add governance file `AGENTS.md` and phase-local copy `.rpi/AGENTS.md` (research.md — Section 3 "Implicit contracts between phases").
- Action: Create `AGENTS.md` at repo root with a Markdown table with columns `Role | Allowed Artifacts | Mandatory Checks` and rows for `Researcher`, `Planner`, `Implementer`. Create `.rpi/AGENTS.md` mirroring the root file.
- Verification: `AGENTS.md` exists and contains a table with exactly three rows named as above. `.rpi/AGENTS.md` exists and text-identical to root. Pass: both files present and matching. Fail: missing or malformed table.

[x] Task 5 — Create Skill: `.github/skills/rpi-workflow/` (research.md — Sections 2 & 4).
- Action: Create directory with `SKILL.md` that begins with `---` YAML frontmatter including `name: rpi-workflow` and `description: Implement RPI workflow helper skill`. Ensure the `name` matches `^[a-z0-9-]+$`. Include `Usage` and `Resources` headings in the body and reference `resources/plan-template.md`. Add `resources/plan-template.md`, `resources/prompts/plan-example.md`, and `resources/validation/README.md` describing expected Skill contents.
- Verification: CI/local check commands: `grep -q '^---' .github/skills/rpi-workflow/SKILL.md && grep -q '^name: ' .github/skills/rpi-workflow/SKILL.md && grep -q '^description: ' .github/skills/rpi-workflow/SKILL.md && grep -q '^Usage' .github/skills/rpi-workflow/SKILL.md && test -f .github/skills/rpi-workflow/resources/plan-template.md`. Pass: all checks return success. Fail: any missing frontmatter, missing fields, name regex mismatch, or missing resources.

[x] Task 6 — Add prompt entry-points: `.github/prompts/` (operator UX) (research.md — Sections 2 & 4).
- Action: Create `research.prompt.md`, `plan.prompt.md`, and `implement.prompt.md`. Each file includes a one-line `Purpose:` and a required `Input:` line referencing the canonical artifact path (e.g., `Input: .rpi/0001-implement-rpi-workflow/research.md`). Keep prompts ≤300 words.
- Verification: Each prompt file exists and contains an `Input:` line referencing the correct file. Pass: prompts present and contain `Input:`. Fail: missing prompt or invalid Input path.

[x] Task 7 — Add `.vscode/settings.json` (recommendations only) and `.rpi-docs/rpi-workflow.md` with VS Code load-check guidance.
- Action: Add `.vscode/settings.json` suggesting `github.copilot.chat.codeGeneration.useInstructionFiles: true` (recommendation) and `.rpi-docs/rpi-workflow.md` containing: artifact locations, how to use prompt files, CI validation steps, and a section "VS Code Load Checks" with explicit steps (open "Copilot Chat: Show Customization Diagnostics", check logs, open DevTools). Document minimal local settings to check.
- Verification: `.vscode/settings.json` exists and contains the recommendation key. `.rpi-docs/rpi-workflow.md` exists and contains a subsection titled "VS Code Load Checks" with three numbered steps. Pass: both files contain required strings. Fail: missing files or missing subsection.

[x] Task 8 — Add helper script `scripts/check-vscode-load.sh` (guidance-only).
- Action: Create a small executable script that prints the manual VS Code verification steps and collects `~/.config/Code/logs` paths or instructs where to get Copilot logs. Script must not change editor settings.
- Verification: Script exists and is executable (`test -x`). Running it prints the three manual verification steps. Pass: script executable and prints steps. Fail: missing or non-executable.

[x] Task 9 — Add CI workflow `.github/workflows/rpi-validate.yml` with improved checks (research.md — Section 4 "Validation gates").
- Action: Create a GitHub Actions workflow that runs on push and pull_request named `validate-rpi-artifacts`. The job executes shell checks to verify: presence of `.rpi/**/research.md`, `.rpi/**/plan.md`, `AGENTS.md`, `.github/copilot-instructions.md`, any `.github/instructions/*.instructions.md` (frontmatter contains `applyTo`), `.github/prompts/*.prompt.md` (contain `Input:`), and `.github/skills/rpi-workflow/SKILL.md` (frontmatter and name regex). The job fails on any check failure.
- Verification: Workflow file exists and contains a job named `validate-rpi-artifacts` and explicit shell steps invoking `grep`, `test -f`, and regex checks. Pass: CI workflow file present and contains the job and checks. Fail: missing workflow or missing checks.

[x] Task 10 — Add hand-off checklist `.rpi-docs/handoff-checklist.md` and sign-off requirement.
- Action: Create `.rpi-docs/handoff-checklist.md` with four checklist items: `research.md validated`, `plan.md present and FACTS affirmed`, `AGENTS.md reviewed`, `CI validation passing`. Document that Implementers must add `.rpi/0001-implement-rpi-workflow/SIGNOFF` to PRs to indicate acceptance; CI must check presence for implementation merges.
- Verification: `.rpi-docs/handoff-checklist.md` exists and contains the four checklist items. CI workflow includes a step to check for `.rpi/.../SIGNOFF` when implementation label is present. Pass: checklist present and CI check exists. Fail: missing checklist or CI sign-off check.

[x] Task 11 — Finalize FACTS affirmation in this `plan.md` (research.md — Section 5 "Validation — FAR Criteria").
- Action: Confirm and record definitive answers for Feasible / Atomic / Clear / Testable / Scoped with justifications tied to `research.md` citations.
- Verification: Section 5 contains five labeled rows with justifications. Pass: present and referenced. Fail: any missing.

Notes on unknowns: Any Implementation step that requires runtime assumptions (editor flags, extension versions) not clearly derivable from `research.md` must trigger a blocking Issue titled: "RPI: Unknown runtime requirement — <short description>" referencing `research.md` Unknowns. Implementation MUST NOT proceed past that block.

## 4. Verification Plan

- Automated enforcement: The `validate-rpi-artifacts` CI job is the primary automated gate. It will run on `push` and `pull_request` and return non-zero if any artifact is missing or structurally invalid (missing YAML frontmatter, missing `applyTo`, missing prompt `Input:`, SKILL `name` regex mismatch, absent AGENTS.md table, or missing sign-off for implementation merges).

- Manual operator verification: `.rpi-docs/rpi-workflow.md` provides a 3-step "VS Code Load Checks" procedure referencing Copilot Chat Customization Diagnostics and DevTools logs. Operators run `scripts/check-vscode-load.sh` to collect evidence before filing a blocking issue.

- RPI constraints enforcement:
  - Research → Plan: CI enforces that `research.md` exists and `plan.md` is present before implementation merges; hand-off checklist and sign-off are required for implementation PRs.
  - Plan → Implement: Implementation must act only on `plan.md`. CI ensures `plan.md` exists and Skill/instruction artifacts validate before merging implementation work.

- Early failure detection:
  - CI failing checks surface missing or malformed artifacts.
  - Local load-check script or diagnostics reveal editor loading issues; unresolved loading issues must be raised as blocking issues with logs attached.

## 5. Validation — FACTS Criteria

- Feasible: Yes.
  - Justification: All required artifacts are files in the repository and validated by CI; `research.md` documents formats and locations for instruction files and Skills. No unsupported runtime assumptions are required; any that arise cause a blocking issue. (research.md — Sections 2, 4)

- Atomic: Yes.
  - Justification: Each task creates or verifies a single repository artifact or small, well-scoped set of artifacts. Each task defines a single verification step with pass/fail criteria.

- Clear: Yes.
  - Justification: Task descriptions include exact file paths, required structural rules (YAML `---` frontmatter, `applyTo`, `name` regex, `Input:` lines), and explicit verification commands/examples.

- Testable: Yes.
  - Justification: CI automates structural checks; local scripts and documented VS Code load checks support operator verification. Any non-deterministic runtime requirement will be blocked and documented.

- Scoped: Yes.
  - Justification: The plan strictly limits work to repository-backed artifacts and CI. Runtime or org-level changes are explicitly excluded unless raised and approved via an Issue referencing `research.md` Unknowns.

---

If Implementation requires a decision not derivable from `research.md`, the Implementer must stop and open an Issue titled "RPI: Unknown runtime requirement — <description>" that cites the `research.md` Unknowns clause. Do not proceed until the Issue is resolved.

(End of plan)
