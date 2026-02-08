Based on the RPI operational doctrine established in our conversation history, and utilizing the configuration capabilities described in the provided VS Code documentation (specifically regarding **Custom Agents** 1, 2 and **Read-Only Tools** 3, 4), here is the technical definition file for the Research Phase.

# RPI Phase I: Research (Epistemology)

**Version:** 2.0**Enforcement:** Strict (Pre-Planning)**Agent Configuration:** Read-Only / Analysis Mode

## 1\. Phase Objective

The objective of the Research phase is **Epistemology**—the acquisition of valid knowledge. The goal is to maximize understanding of the problem space and the "blast radius" within the codebase *before* any solution is designed or code is written.  
This phase is complete only when ambiguity is reduced to a level that permits deterministic planning.

## 2\. Operational Constraints

To ensure RPI integrity, the following constraints must be enforced technically via VS Code Custom Agents Source: 3, 5 or process governance:  
Constraint,Definition,Technical Enforcement  
Read-Only Access,"The agent/developer may read files, grep logs, and search docs, but MUST NOT modify a single line of code.","Configure Custom Agent with tools: \['search', 'fetch'\] only (exclude editing tools) Source: 3, 5."  
No Solutioning,"The output must describe what exists, not what will be built. No architecture diagrams or pseudocode.",Custom Instructions in .agent.md explicitly forbidding generation of fix proposals Source: 6\.  
Citations Required,"Every claim regarding system behavior must be backed by a file path, line number, or documentation link.","System prompt requirement: ""All assertions must be cited."""

## 3\. The Research Artifact (research.md)

The output of this phase is a single markdown file named research.md. This file serves as the **immutable input** for the Plan phase.

### Artifact Schema

The research.md file must strictly adhere to the following structure:  
\# Research: \[Ticket/Issue ID\]

\#\# 1\. Problem Statement Analysis  
\*   \*\*Trigger:\*\* (The bug report, feature request, or alert that started this).  
\*   \*\*User Intent:\*\* (What the user actually wants, independent of how they asked for it).  
\*   \*\*Ambiguity:\*\* (List of initially vague terms clarified during research).

\#\# 2\. Code Archaeology (The "Blast Radius")  
\*   \*\*Entry Points:\*\*  
    \*   \`src/api/routes.ts:45\` \- Request handler for the feature.  
\*   \*\*Core Logic:\*\*  
    \*   \`src/services/payment.ts:200\` \- Where the calculation actually happens.  
\*   \*\*Data Models:\*\*  
    \*   \`src/db/schema.prisma:50\` \- The database constraint affecting this issue.

\#\# 3\. System Constraints  
\*   \*\*Hard Constraints:\*\* (e.g., "The API response must remain \< 200ms", "Cannot update dependency X due to legacy support").  
\*   \*\*Implicit Contracts:\*\* (e.g., "This function assumes input is always sanitized by the middleware").

\#\# 4\. Existing Patterns (Exemplars)  
\*   \*\*Reference Implementation:\*\* (Copy-paste a snippet of \*existing\* code that solves a similar problem correctly. Do NOT write new code).  
    \`\`\`typescript  
    // existing code from src/utils/validation.ts  
    export function validateId(id: string) { ... }  
    \`\`\`

\#\# 5\. Validation: The FAR Score  
\*   \*\*Factual:\*\* Are all claims cited? \[Yes/No\]  
\*   \*\*Actionable:\*\* Can a plan be built solely from this doc? \[Yes/No\]  
\*   \*\*Relevant:\*\* Does this strictly address the problem statement? \[Yes/No\]

## 4\. Validation Protocol (The FAR Gate)

Transition to the **Plan** phase is strictly forbidden until the research.md artifact passes the **FAR** criteria.

* **F (Factual):** Is the document free of hallucinations?  
* *Fail:* "The system probably handles auth."  
* *Pass:* "Auth is handled in middleware/auth.ts line 42."  
* **A (Actionable):** Does the Planner have to "go look" for anything?  
* *Fail:* "We need to check the database schema."  
* *Pass:* "The schema requires a non-null string for user\_id."  
* **R (Relevant):** Is the information focused?  
* *Fail:* Including analysis of the entire authentication system for a CSS button fix.  
* *Pass:* Analyzing only the CSS variables affecting the button.

## 5\. Handoff Trigger

Once the FAR score is satisfying (Pass), the workflow triggers a **Handoff** Source: 8 to the Planning Agent.

* **Source Agent:** research-agent (Read-Only)  
* **Target Agent:** planning-agent (Architectural)  
* **Prompt:** "Research complete and validated. Ingest research.md and generate an atomic implementation plan."

