Based on the RPI operational doctrine and the VS Code Custom Agent specifications Source: 3, 6, 8, here is the technical definition file for the Plan Phase.

# RPI Phase II: Plan (Decision Theory)

**Version:** 2.0**Enforcement:** Strict (Pre-Implementation)**Input Dependency:** research.md (Validated)**Agent Configuration:** Strategy Mode / Read-Only Tools

## 1\. Phase Objective

The objective of the Plan phase is **Decision Theory**—the transformation of validated *Knowledge* (from Research) into deterministic *Intent*.  
This phase deconstructs the problem into atomic units of work so that execution (Implementation) becomes a purely mechanical act of compliance, requiring no further strategic decision-making.

## 2\. Operational Constraints

These constraints are enforced via the .agent.md configuration for the Planning Agent Source: 3, 6\.  
Constraint,Definition,Technical Enforcement  
No Production Code,The Planner must not write application code. It only writes instructions for code.,"Agent tools list limited to \['search', 'fetch'\] (read-only) Source: 3."  
Input Strictness,Planning cannot begin without a valid research.md.,"System prompt: ""Refuse to plan until research.md is ingested and validated."""  
Atomic Output,"The output must be a checklist where every item is a single, verifiable action.",Custom Instructions requiring a checkbox format \[ \] for all tasks.

## 3\. The Plan Artifact (plan.md)

The output of this phase is a single markdown file named plan.md. This file serves as the **executable directive** for the Implementation phase.

### Artifact Schema

The plan.md file must strictly adhere to the following structure:  
\# Plan: \[Ticket/Issue ID\]

\#\# 1\. Strategy & Architecture  
\*   \*\*Approach:\*\* (High-level summary of the chosen design pattern).  
\*   \*\*Trade-offs:\*\* (Why this approach was chosen over alternatives).  
\*   \*\*Safe State:\*\* (Definition of what "working" looks like).

\#\# 2\. Atomic Task List  
(Every task must be independent enough to be executed by an AI with cleared context).

\#\#\# Phase A: Scaffolding  
\- \[ \] \*\*Task A.1\*\*: Create interface \`IUserConfig\` in \`src/types/config.ts\`.  
    \- \*Input:\* \`research.md\` Section 3\.  
    \- \*Verification:\* File exists and exports interface.  
\- \[ \] \*\*Task A.2\*\*: Add feature flag \`ENABLE\_NEW\_FLOW\` to \`src/config/flags.ts\`.  
    \- \*Verification:\* \`npm test src/config/flags.spec.ts\` passes.

\#\#\# Phase B: Core Logic  
\- \[ \] \*\*Task B.1\*\*: Implement \`calculateTax\` function in \`src/utils/tax.ts\`.  
    \- \*Constraint:\* Must handle negative inputs as defined in Research.  
    \- \*Verification:\* Unit test \`src/utils/tax.spec.ts\` passes.

\#\# 3\. Verification Plan  
\*   \*\*Automated Tests:\*\* (List of new test files to be created).  
\*   \*\*Manual Verification:\*\* (Specific steps to verify in the UI/Console).

\#\# 4\. Validation: The FACTS Score  
\*   \*\*Feasible:\*\* Resources/Skills available? \[Yes/No\]  
\*   \*\*Atomic:\*\* Are tasks single-responsibility? \[Yes/No\]  
\*   \*\*Clear:\*\* Is ambiguity zero? \[Yes/No\]  
\*   \*\*Testable:\*\* binary success criteria? \[Yes/No\]  
\*   \*\*Scoped:\*\* Boundaries defined? \[Yes/No\]

## 4\. Validation Protocol (The FACTS Gate)

Transition to the **Implement** phase is strictly forbidden until the plan.md artifact passes the **FACTS** criteria.

1. **F (Feasible):** Can this actually be built given the constraints in research.md?  
2. **A (Atomic):** Can a junior dev (or AI) complete one task without reading the others?  
3. **C (Clear):** Are there "TBDs" or "Figure it out later"? (If yes, Fail).  
4. **T (Testable):** Does every task have a specific verification step?  
5. **S (Scoped):** Does the plan explicitly state what it will *not* do?

## 5\. Handoff Trigger

Once the FACTS score is satisfying (Pass), the workflow triggers a **Handoff** Source: 1, 8 to the Implementation Agent.

* **Source Agent:** planning-agent  
* **Target Agent:** implementation-agent  
* **Prompt:** "Plan validated. Execute Task A.1. Remember to run tests after every step."

