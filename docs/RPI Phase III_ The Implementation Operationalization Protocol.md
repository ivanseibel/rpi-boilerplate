Based on the RPI operational doctrine and the VS Code Custom Agent specifications Source: 3, 6, 8, 47, 81, here is the technical definition file for the Implement Phase.

# RPI Phase III: Implement (Operationalization)

**Version:** 2.0**Enforcement:** Strict (Post-Planning)**Input Dependency:** plan.md (Validated with FACTS)**Agent Configuration:** Execution Mode / Full Access Tools

## 1\. Phase Objective

The objective of the Implement phase is **Operationalization**—the mechanical translation of the validated *Intent* (from plan.md) into *Reality* (Production Code).  
This phase is a cycle of strict compliance. It is **not** a discovery phase. If the Implementer encounters ambiguity or requires architectural decisions not present in the Plan, the process must halt and recurse to Phase II.

## 2\. Operational Constraints

These constraints are enforced via the .agent.md configuration for the Implementation Agent Source: 3, 6 and process governance.  
Constraint,Definition,Technical Enforcement  
Atomic Execution,Code is written for only one task at a time.,"Custom Instruction: ""Read only one task from plan.md. Flush context. Implement. Repeat."""  
No Improvisation,The Implementer must not add features or refactors not explicitly listed in the Plan.,Governance Rule: PRs containing changes not mapped to a plan.md task are rejected.  
Stop-The-Line,"If a task is impossible as planned, execution halts immediately.","System Prompt: ""If a task is blocked, do not attempt to fix the plan. Stop and report 'Plan Invalid'."""

## 3\. Execution Protocol (The Loop)

The Implementation phase follows a strict, repetitive loop until all tasks in plan.md are marked complete.

### Step 3.1: Task Selection

1. Open plan.md.  
2. Identify the first unchecked task (- \[ \]).  
3. **Context Reset:** Ensure the agent's context window contains *only* the necessary files for this specific task (preventing "Context Overflow" and hallucination).

### Step 3.2: Implementation

1. **Test First (Optional/Recommended):** Create the verification test specified in the task.  
2. **Code:** Write the minimal code required to satisfy the task and pass the test.  
3. **Verify:** Execute the **Quality Gate**.

### Step 3.3: The Quality Gate

Every atomic task must pass this pipeline before being marked complete:

1. **Build:** Does the project compile?  
2. **Lint:** Are there no style/syntax violations?  
3. **Test:** Do the specific tests for this task (and regression tests) pass?

### Step 3.4: Completion Marking

* **Success:** Change the task in plan.md from \- \[ \] to \- \[x\].  
* **Failure:** Do **not** mark complete. If the failure persists after 3 attempts, escalate (See Section 5).

## 4\. Expected Artifacts

Unlike Research and Plan, the Implementation phase **does not** produce a new standalone markdown artifact (e.g., no implement.md) under normal success conditions.  
The expected outputs are:

1. **The Code:** Source files modified according to the plan.  
2. **The Updated Plan:** The plan.md file with all checkboxes ticked (- \[x\]). This serves as the audit trail of execution.  
3. **Postmortem (Conditional):** *Only* in the event of a Critical Failure, an implement-postmortem.md file is generated to document why the Plan failed.

## 5\. Failure & Recursion Protocols

### Minor Failure (Code Level)

* *Trigger:* Test fails or build breaks.  
* *Action:* Retry implementation of the **same atomic task** (max 3 tries). Do not change the Plan.

### Major Failure (Plan Level)

1. *Trigger:* The planned approach is technically impossible (e.g., API missing, strict constraint violation).  
2. *Action:*  
3. **Halt Execution.**  
4. Revert code for the current task.  
5. **Recurse:** Transition back to **Phase II (Plan)** to update the strategy.

### Critical Failure (Research Level)

1. *Trigger:* Discovery that the fundamental problem cannot be solved (e.g., platform limitation).  
2. *Action:*  
3. **Halt Execution.**  
4. Generate implement-postmortem.md.  
5. **Recurse:** Transition back to **Phase I (Research)** or abort.

## 6\. Handoff Trigger (Completion)

The phase is considered Done when:

1. All tasks in plan.md are marked \- \[x\].  
2. Global test suite passes.  
3. Linter passes on the entire workspace.  
* **Target:** review-agent (or Human Reviewer).  
* **Prompt:** "Implementation complete. All tasks verified. Ready for final Code Review."

