# RPI Boilerplate - Research → Plan → Implement Workflow Scaffold

A systematic approach to software development using AI-assisted workflows with VS Code's GitHub Copilot.

## What is RPI?

RPI (Research → Plan → Implement) is a three-phase methodology that enforces disciplined software development by separating:

- **Research** - Read-only exploration; gather facts, cite sources, identify constraints
- **Plan** - Atomic task decomposition with explicit verification criteria
- **Implement** - Strict execution following the plan; no improvisation

This repository provides a complete scaffold with Custom Instructions, Skills, governance files, and CI validation to make RPI workflows executable and enforceable.

---

## Features

✅ **Phase-Specific Constraints** - Scoped instructions enforce rules per phase  
✅ **Validation Gates** - FAR (Research) and FACTS (Plan) criteria with CI checks  
✅ **Agent Governance** - Clear roles and handoff protocols in `AGENTS.md`  
✅ **Skill-Assisted Workflow** - Templates and prompts for each phase  
✅ **CI Enforcement** - Automated validation of artifact structure  
✅ **VS Code Integration** - Load verification helpers and diagnostics guidance

---

## Quick Start

### 1. Prerequisites

- VS Code with GitHub Copilot extension
- GitHub Copilot Chat enabled
- Setting: `"github.copilot.chat.codeGeneration.useInstructionFiles": true`

### 2. Verify Installation

```bash
# Run the verification script
./scripts/check-vscode-load.sh

# Follow the manual steps to confirm:
# - Custom Instructions loaded
# - Skills loaded
# - No console errors
```

### 3. Start a New RPI Project

Create a project directory under `.rpi/`:

```bash
mkdir -p .rpi/0001-my-feature
cd .rpi/0001-my-feature
```

---

## Using the Workflow

### Phase 1: Research

**Goal:** Gather facts, cite sources, identify constraints. No solutions proposed.

**Prompt Template:**

```
I need to start the Research phase for [brief problem description].

Requirements:
- Produce .rpi/0001-my-feature/research.md
- Cite all sources inline
- No solution proposals - only facts
- Validate against FAR criteria (Factual, Actionable, Relevant)

Please analyze:
1. Problem statement and real underlying intent
2. Conceptual scope (what's in/out of scope)
3. System constraints (hard limits, behavioral requirements)
4. Existing patterns and exemplars in the codebase
5. Unknowns that require investigation

Output: .rpi/0001-my-feature/research.md
```

**Expected Output:** `research.md` with:
- Problem Statement Analysis
- Conceptual Scope
- System Constraints
- Existing Patterns
- FAR Validation
- Notes on Unknowns

**Validation:**
- [ ] All claims have inline citations
- [ ] No solution proposals present
- [ ] FAR criteria affirmed with justifications
- [ ] Unknowns explicitly documented

---

### Phase 2: Plan

**Goal:** Transform research into atomic, testable tasks with pass/fail criteria.

**Prompt Template:**

```
Research phase complete for project "0001-my-feature".

Input: .rpi/0001-my-feature/research.md

Please transition to Plan phase:

1. Read and validate research.md against FAR criteria
2. Produce plan.md following the plan template
3. Reference research.md facts - no unsupported assumptions
4. Decompose into atomic tasks with verification steps
5. Validate against FACTS criteria (Feasible, Atomic, Clear, Testable, Scoped)

Requirements:
- Each task independently executable
- Explicit pass/fail criteria for every verification
- All decisions traceable to research.md
- Identify scope boundaries and exclusions

Output: .rpi/0001-my-feature/plan.md
```

**Expected Output:** `plan.md` with:
- Strategy and Scope
- Architectural Decomposition
- Atomic Task List (checkboxes)
- Verification Plan
- FACTS Validation

**Task Format:**
```markdown
[ ] Task 1 — Create configuration file (research.md — Section 2)
- Action: Create `.config/settings.json` with required fields
- Verification: File exists and passes JSON lint
  Pass: valid JSON with all required keys
  Fail: missing file or invalid JSON
```

**Validation:**
- [ ] All tasks reference research.md
- [ ] Every task has Action and Verification
- [ ] Pass/fail criteria explicit
- [ ] FACTS criteria affirmed

---

### Phase 3: Implement

**Goal:** Execute plan tasks sequentially, verify each before marking complete.

**Prompt Template:**

```
Plan phase validated and signed off for project "0001-my-feature".

Input: .rpi/0001-my-feature/plan.md

Please begin Implementation phase:

1. Execute tasks in order from plan.md
2. For each task:
   - Perform the Action
   - Run the Verification
   - Mark complete ONLY if Pass criteria met
3. If a task is impossible, STOP and document blocker

Rules:
- Follow plan.md strictly - no improvisation
- Verify before marking complete
- If blocked, recurse to Plan phase
- Update checkboxes as tasks complete

Output: Code changes + updated plan.md
```

**Quality Gate (run after each task):**
```bash
# Build
npm run build

# Lint
npm run lint

# Test
npm test

# Mark complete only if all pass
```

**Recursion Protocol:**

If you encounter a blocker:

1. **Minor Failure (Code Level):** Retry implementation (max 3 attempts)
2. **Major Failure (Plan Level):** Stop, document blocker, recurse to Plan
3. **Critical Failure (Research Level):** Stop, document limitation, recurse to Research

**Completion:**

When all tasks ✅ complete:

```bash
# Create SIGNOFF file
echo "Implementation complete: $(date)" > .rpi/0001-my-feature/SIGNOFF

# Commit and open PR
git add .rpi/0001-my-feature/
git commit -m "feat: implement feature-x [RPI]"
git push
```

---

## Artifact Structure

```
.rpi/
  <project-id>/
    research.md      # Phase 1 output
    plan.md          # Phase 2 output
    SIGNOFF          # Phase 3 completion marker

.github/
  copilot-instructions.md          # Global RPI constitution
  instructions/
    research.instructions.md       # Research phase constraints
    plan.instructions.md          # Plan phase constraints
  skills/
    rpi-workflow/
      SKILL.md                     # Skill definition
      resources/
        plan-template.md           # Plan boilerplate
        prompts/plan-example.md    # Example prompts
        validation/README.md       # FAR/FACTS checklists
  prompts/
    research.prompt.md             # Research phase template
    plan.prompt.md                # Plan phase template
    implement.prompt.md           # Implement phase template
  workflows/
    rpi-validate.yml              # CI validation

AGENTS.md                          # Agent roles and handoffs
.vscode/settings.json              # VS Code recommendations
.rpi-docs/
  rpi-workflow.md                  # Operator guide
  handoff-checklist.md            # Phase transition checklist
```

---

## CI Validation

GitHub Actions automatically validates artifact structure:

```yaml
# Runs on push and pull_request
# Checks:
- File presence (research.md, plan.md, AGENTS.md)
- YAML frontmatter correctness
- Skill name format
- Prompt Input: lines
- SIGNOFF file on implementation PRs
```

View validation rules in `.github/workflows/rpi-validate.yml` (when implemented).

---

## Phase Transitions

### Research → Plan Handoff

**Checklist:**
- [ ] `research.md` exists and validated (FAR criteria)
- [ ] All unknowns documented
- [ ] Planner acknowledges receipt

**Trigger:** Open GitHub issue or PR comment: "Research complete - ready for Plan phase"

---

### Plan → Implement Handoff

**Checklist:**
- [ ] `plan.md` exists and validated (FACTS criteria)
- [ ] All tasks atomic and testable
- [ ] Stakeholders signed off
- [ ] Implementer acknowledges receipt

**Trigger:** Open PR or issue: "Plan validated - ready for Implementation"

---

### Implementation → Review Handoff

**Checklist:**
- [ ] All tasks in `plan.md` checked complete
- [ ] CI validation passing
- [ ] `SIGNOFF` file created
- [ ] No improvisation beyond plan scope

**Trigger:** Open PR with `[RPI]` tag in title

---

## Replicating in Other Projects

### Option 1: Fork This Repository

```bash
# Clone the boilerplate
git clone https://github.com/your-org/rpi-boilerplate.git my-new-project
cd my-new-project

# Remove example artifacts
rm -rf .rpi/0001-implement-rpi-workflow

# Initialize git
rm -rf .git
git init
git add .
git commit -m "chore: initialize from RPI boilerplate"

# Start using
mkdir -p .rpi/0001-my-first-feature
```

### Option 2: Copy Artifacts

Copy these files to your existing project:

```bash
# Essential files
.github/copilot-instructions.md
.github/instructions/*.instructions.md
.github/skills/rpi-workflow/
.github/prompts/
.github/workflows/rpi-validate.yml
AGENTS.md
.vscode/settings.json

# Documentation
.rpi-docs/rpi-workflow.md
.rpi-docs/handoff-checklist.md
scripts/check-vscode-load.sh
```

### Option 3: Minimal Setup

For a lightweight integration:

1. **Copy global instructions:**
   ```bash
   cp .github/copilot-instructions.md <your-project>/.github/
   ```

2. **Copy governance:**
   ```bash
   cp AGENTS.md <your-project>/
   ```

3. **Create project structure:**
   ```bash
   mkdir -p <your-project>/.rpi/0001-feature
   ```

4. **Add VS Code setting:**
   ```json
   {
     "github.copilot.chat.codeGeneration.useInstructionFiles": true
   }
   ```

---

## Troubleshooting

### Custom Instructions Not Loading?

```bash
# 1. Check VS Code settings
code --list-extensions | grep copilot

# 2. Verify settings.json
cat .vscode/settings.json | grep useInstructionFiles

# 3. Open diagnostics
# Command Palette > "Copilot Chat: Show Customization Diagnostics"

# 4. Check DevTools Console
# Help > Toggle Developer Tools > Console tab
```

### Skill Not Appearing?

```bash
# Verify skill structure
test -f .github/skills/rpi-workflow/SKILL.md && echo "✅ SKILL.md exists"

# Check frontmatter
head -5 .github/skills/rpi-workflow/SKILL.md

# Expected:
# ---
# name: rpi-workflow
# description: Assist with Research → Plan → Implement workflow
# ---
```

### CI Validation Failing?

```bash
# Run local checks
./scripts/check-vscode-load.sh

# Check GitHub Actions logs
# Navigate to: Repository > Actions > Latest workflow run
```

---

## Examples

### Example 1: Add Authentication Feature

```
Research Prompt:
"Analyze authentication requirements for this application. Research existing auth patterns in the codebase, security constraints, and third-party library options. Output: .rpi/0002-auth/research.md"

Plan Prompt:
"Input: .rpi/0002-auth/research.md. Create atomic tasks for implementing OAuth2 authentication. Output: .rpi/0002-auth/plan.md"

Implement Prompt:
"Input: .rpi/0002-auth/plan.md. Execute tasks sequentially, verify each step."
```

### Example 2: Database Migration

```
Research Prompt:
"Investigate current database schema, migration tooling, and data integrity requirements for adding user profiles table. Output: .rpi/0003-user-profiles/research.md"

Plan Prompt:
"Input: .rpi/0003-user-profiles/research.md. Decompose into migration tasks with rollback verification. Output: .rpi/0003-user-profiles/plan.md"

Implement Prompt:
"Input: .rpi/0003-user-profiles/plan.md. Execute migration tasks with quality gates."
```

---

## Resources

- **Methodology Docs:** `.rpi-docs/` directory
  - [RPI Phase I: Research Protocol](.rpi-docs/RPI%20Phase%20I_%20Epistemology%20and%20Research%20Protocol.md)
  - [RPI Phase II: Planning Doctrine](.rpi-docs/RPI%20Phase%20II_%20Operational%20Doctrine%20for%20Strategic%20Planning.md)
  - [RPI Phase III: Implementation Protocol](.rpi-docs/RPI%20Phase%20III_%20The%20Implementation%20Operationalization%20Protocol.md)

- **Governance:** [AGENTS.md](AGENTS.md) - Agent roles and handoff rules
- **Operator Guide:** [.rpi-docs/rpi-workflow.md](.rpi-docs/rpi-workflow.md) - Step-by-step usage
- **Skills Documentation:** [.rpi-docs/agent-skills.md](.rpi-docs/agent-skills.md)

---

## Contributing

This scaffold is designed for replication and customization. If you improve the workflow, consider:

1. Forking this repository
2. Adding your enhancements
3. Submitting a PR with your improvements

---

## License

MIT License - Feel free to use and adapt for your projects.

---

**Ready to start?** Run `./scripts/check-vscode-load.sh` to verify your setup, then create your first project under `.rpi/0001-your-feature/`! 🚀
