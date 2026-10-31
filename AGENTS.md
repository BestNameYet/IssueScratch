# IssueScratch Agent Instructions

Repository: `BestNameYet/IssueScratch`

## 1. Purpose and scope

IssueScratch is a lightweight, GitHub-Issue-centered environment for accepting instructions, organizing work, maintaining durable agent scratchpads, executing authorized tasks, and recording outcomes.

Its primary design choices are:

1. **One operational issue.** Issue **#1** consolidates the functions performed by Issues #1 (instruction intake), #2 (job queue and completion), and #3 (task scratchpads) in `BestNameYet/IssueStack-`.
2. **Three-object RS.** "RS" means **Return Schema**. Every IssueScratch RS has exactly three top-level objects: `interpretation`, `execution`, and `result`. The agent designs the keys and data inside each object according to the task; user instructions govern the content and any stricter external format.
3. **Minimal ceremony.** Do not import IssueStack's separate-issue transfer process, fixed input slots, mandatory Issue #5/#7 UI pipeline, rigid task.v3 object structure, or extra approval machinery merely because IssueStack has them.
4. **Evidence over ceremony.** Maintain enough durable information to identify work, continue it, and verify results without imposing unnecessary serialization or formatting requirements.

These are *instructions for agents*, not a claim that automation or a GitHub Actions implementation already exists. Do not describe a workflow, listener, processor, renderer, or archival mechanism as operational until its implementation and an end-to-end test verify that claim.

## 2. Read-before-operation rule

At the start of an assignment, read this repository's current root `AGENTS.md`, any applicable nested `AGENTS.md`, and `README.md` if present. Read relevant Issue #1 instructions and records before undertaking its work. If the documentation defines a command or execution interface for a class of operations, use that interface for those operations; do not bypass it with an alternative API or execution route. Do not invent missing commands, file paths, issues, schemas, capabilities, or execution results.

If Issue #1 is not yet present, state that it must be initialized; do not claim that an intake, queue, or scratchpad exists. Creation or modification of repository resources requires an authorized user request or a clearly authorized task scope.

Instructions from other repositories are background reference material, not binding IssueScratch rules, unless explicitly adopted here or by the user. Higher-priority system and platform rules continue to apply.

## 3. Issue #1 is the unified operating surface

Issue #1 is the **single authoritative GitHub Issue** for normal IssueScratch jobs. It incorporates all three functions formerly split across IssueStack:

- **Intake:** capture the originating user instruction, its intent, scope, and any clarification or amendment.
- **Queue and execution:** identify accepted jobs, pending/active/blocked/terminal states, owners, dependencies, and results.
- **Scratchpad:** preserve plans, decisions, attempts, progress, observations, evidence, tests, blockers, and handoff notes.

Keep those functions logically distinguishable even though they occupy the same issue. No cross-issue transfer is needed. Do not create Issues #2 and #3 as required processing stages, and do not represent a transfer to them as a prerequisite to work.

### 3.1 Job identity

GitHub's permanent comment IDs are the primary durable references. A job normally begins with an **intake comment** in Issue #1. An agent creates or identifies a **working record comment** in the same issue that refers to that intake comment and contains the queue entry, scratchpad, and outcome in one place.

- Identify the intake by its exact `source_comment_id`.
- Identify the job by its permanent working-record `job_comment_id`; once created, reuse that comment rather than making a duplicate.
- A `nonce` may be used for deduplication, retries, and correlation. Keep it stable for one job. A nonce supplements, but does not replace, a verified comment ID.
- Where permissions allow, the intake and working record can be the *same* comment. Where a user-authored comment cannot be edited by an agent, preserve it and use an agent-owned working-record comment referencing it.
- Before creating a record, check Issue #1 for an existing record with the same source/nonce. On retries, reconcile the existing job instead of duplicating it.
- Store any follow-up progress comments, if useful, **within Issue #1** and link them to the job's working-record comment ID.

Do not rely on comment position or assume globally assigned GitHub comment IDs are sequential.

### 3.2 Suggested working-record structure

The following is a **recommended Markdown layout**, *not* an obligatory JSON schema. An agent may adjust its sections, choose structured data, or use another appropriate representation, provided identity, actual state, and enough evidence for continuation remain discoverable.

```markdown
<!-- issuescratch:job:v1 -->
# Job: <concise description>

Source: Issue #1 comment <source_comment_id>
Job: Issue #1 comment <job_comment_id, once known>
Nonce: <stable nonce, if used>
State: pending | active | blocked | completed | failed | cancelled
Owner: <agent or worker, when assigned>

## Instruction and scope
<faithful interpretation; link to the original instruction>

## Plan and working scratchpad
<decisions, attempts, progress, dependencies, evidence, handoff notes>

## Result / RS
<task-appropriate answer or artifact, chosen under section 4>

## Verification and receipt
<observed outcomes, checks performed, failures, links, remaining work>
```

An agent need not fill empty sections with boilerplate. A simple job may have only a short description, one update, and a clear result. A complex job may require more granular requirements, logs, dependencies, or test receipts.

### 3.3 State and progression

Suggested states are `pending`, `active`, `blocked`, `completed`, `failed`, and `cancelled`. An agent may explain intermediate states in plain language without a schema migration.

1. **Receive:** locate the exact intake instruction, preserve its original meaning, and establish the source comment reference.
2. **Register:** find or create the working record in Issue #1. Record the state and references. Confirm the actual comment ID by reading it back.
3. **Work:** plan and execute within the authorized scope; maintain useful scratchpad notes in that working record or linked comments in Issue #1.
4. **Verify:** distinguish command submission from command execution, attempted changes from applied changes, and test invocation from passing tests.
5. **Conclude or hand off:** record the result, supporting evidence, unfinished items, and terminal/nonterminal state. Read back the final record.

There is no separate Issue #1-to-#2 transfer, Issue #2-to-#3 provisioning, or mandatory scratchpad index. The working record itself is the connection among intake, execution, and scratchpad.

### 3.4 Preservation and concurrency

Preserve the user's originating instruction and distinguish it from an agent's interpretation. Revisions and clarified scope should be attributable rather than silently replacing earlier instructions. Avoid overwriting another worker's updates: re-fetch before editing, check job identity and current state, and reconcile conflicts before retrying. A successful write response alone does not prove the resulting record or artifact is correct; read it back.

Public GitHub issues are not private storage. Do not put credentials, secret tokens, private internal reasoning, or sensitive user material in public Issue #1 records. Keep concise decision rationales and reproducible evidence instead.

## 4. Return Schema (RS): three objects, agent-defined interiors

**An IssueScratch RS consists of exactly three top-level JSON objects, named `interpretation`, `execution`, and `result`.** All three must be present; no fourth top-level field or wrapper is part of the RS. They are containers, not rigid nested templates. An agent has broad discretion to define, omit, rename, nest, and type keys *within* these three objects to serve the particular task.

```json
{
  "interpretation": {},
  "execution": {},
  "result": {}
}
```

These names and object types are the **entire fixed RS contract**. The objects may be empty where appropriate, but substantive results should include the information necessary to understand and verify the work. An agent may use a concise structure for a simple task or a detailed one for a complex job. Do not impose IssueStack's `task.v3`, required named-object subtypes, eight-field prompt analysis, or fixed nested properties here.

### 4.1 Meaning of the three objects

- **`interpretation`:** the agent's understanding of the instruction, objective, context, constraints, or success criteria. The agent chooses which of these concepts warrant keys.
- **`execution`:** the agent's actions, plan, progress, decisions, evidence, tests, or blockers, as applicable. The agent chooses their representation and granularity.
- **`result`:** the agent's answer, produced outputs, artifact references, validation, unfinished work, or failures, as applicable. The agent chooses the output fields.

The objects are logical responsibilities, not exhaustive field inventories. Do not invent activities or validations simply to populate an object. A field may contain strings, numbers, booleans, arrays, or nested objects chosen by the agent. Use valid JSON when publishing a machine-readable RS. If the requested deliverable is Markdown, source code, a file, or another presentation form, it may be rendered or attached separately, while its IssueScratch RS record retains these three objects.

### 4.2 Agent discretion and precedence

The agent is normally responsible for the *internal schema*: the key names, types, nesting, level of detail, and task-specific evidence within the three objects. A formal nested JSON Schema is optional unless a consumer requires one. The agent may revise its chosen internal structure to improve usefulness, while retaining identifiable versions or snapshots for material changes that will be adjudicated.

The user's explicit requirements govern what must be accomplished and returned. RS discretion cannot excuse missing requirements, substitute explanation for authorized execution, conceal errors, impose unsolicited restrictions, or alter the user's intended scope. If a separately documented external interface demands a different exact payload shape, honor that interface at its boundary; keep IssueScratch's three-object record as the internal return, rather than silently pretending the external format is an IssueScratch RS.

Agent-defined structure does **not** mean agent-defined truth: label uncertainty and distinguish observed results from assertions. Completion reports must be faithful to verified outcomes, proportionate to the task, without unnecessary boilerplate.

### 4.3 Illustrative RS, not a prescribed nested schema

```json
{
  "interpretation": {
    "goal": "Inspect the requested repository",
    "scope": "Read-only"
  },
  "execution": {
    "files_checked": ["AGENTS.md"],
    "observations": ["Read succeeded"]
  },
  "result": {
    "summary": "Inspection completed",
    "verified": true
  }
}
```

The keys inside these objects are **examples only**. An agent may use entirely different nested keys and data structures on the next task. The top-level three-object contract remains stable unless the user explicitly changes it.

## 5. Periodic adjudication of RS designs and populated outputs

IssueScratch's RS definitions **and their actual data** will be adjudicated from time to time. **No review interval, trigger count, schedule, or reviewer assignment is specified yet.** Reviews may be initiated when authorized; agents must not invent a mandatory per-task gate, fixed review frequency, automatic background reviewer, or claimed grading process.

### 5.1 What is reviewed

Adjudication examines both:

- **Schema design:** Did the agent choose suitable nested keys, data types, scope, granularity, and organization within the three required objects? Does the shape support the assigned work without needless omissions or ceremony?
- **Populated data and outcome:** Is the agent's interpretation faithful? Are claims, actions, evidence, and results accurate, complete relative to the instruction, and consistent with observed execution? Were failures, uncertainty, or unauthorized deviations disclosed?

An adjudicator should assess those dimensions and assign **one overall label** to the reviewed output. An adjudicator may additionally describe distinct schema-design and data-quality findings; these do not introduce new top-level RS objects.

### 5.2 Allowed labels

| Label | Meaning |
| --- | --- |
| `excellent` | The schema fits the task particularly well, and the content is accurate, complete, well-supported, and effective for the user's objective. |
| `adequate` | The core objective and essential format are met; shortcomings, if any, are minor and nonmaterial. |
| `fail` | Material defects in structure, interpretation, execution, evidence, or outcome undermine the required result. |
| `extreme fail` | Fundamental or severe failure, such as an extensively wrong or unusable outcome, fabricated verification, or major unauthorized deviation. |

Use these four labels **exactly**. An output is **unadjudicated** until a real review has taken place; do not silently assign a default label or treat a successful command, passing test, or completed job as an adjudication.

### 5.3 Review record and provenance

Preserve the evaluated RS snapshot or reference (including both its three-object structure and values), the associated Issue #1 job/comment IDs where available, the adjudicator identity or source, the time of review, the assigned label, and a concise evidence-based rationale. Record review findings **separately from the agent's original three-object RS**, linked to the specific output version, so the adjudication does not alter its structure or overwrite the evidence being assessed.

An authorized review can be recorded in Issue #1 as a linked comment or an agent-owned record, provided the original output and reviewer findings remain distinguishable. A later review or correction should be traceable and should not retroactively rewrite earlier judgments without an audit trail. Disagreements can be noted and reviewed again without inventing a numerical score or additional label.

Adjudication findings may inform future agents' choices of nested RS keys and how they populate those keys. The assessment is a retrospective quality judgment, not an automatic authorization to change jobs or repository contents.

## 6. Agent conduct and scope

Work from the user's objective and the repository's current ground truth. Preserve user-specified action scope and abstraction level; do not introduce restrictive requirements or unsolicited architectural substitutions and then present them as requested features.

Decompose and parallelize tasks when practical, but keep each subtask traceable to its parent job within Issue #1. Document significant deviations and unresolved decisions. Use concise progress notes and fuller detail only where a future agent needs it.

A request to halt ends operations immediately; do not perform housekeeping writes afterward. For changes beyond authorized scope, seek authorization rather than treating a working hypothesis as permission.

When tools are unavailable, state the limitation accurately. Do not claim that an agent, workflow, or asynchronous worker is active merely because a job is recorded.

## 7. Operational acceptance checks

For an IssueScratch job, evaluate the following as applicable:

- The source instruction and the correct Issue #1 comment references are identifiable.
- The job state reflects observed progress, not optimistic assumptions.
- The working scratchpad is sufficiently durable for a different agent to resume.
- The RS has exactly the three required top-level objects and agent-selected internal keys; its content satisfies the user's requested deliverable and any actual consumer contract.
- Claimed edits, executions, tests, and outputs have been independently inspected or verified.
- Remaining work and failures are disclosed rather than marked complete.

A lightweight text-only answer can satisfy these checks with minimal overhead. A repository mutation or multi-step task calls for stronger evidence.

## 8. Bootstrap status

At the time this instruction file was first authored, `BestNameYet/IssueScratch` was an empty repository with no issues, commit history, or workflows. This file establishes the **intended protocol**, not an already deployed system. Future agents must inspect the *current* repository and Issue #1 instead of relying on that historical bootstrap observation.

The immediate next setup step, when authorized, is to create Issue #1 as the consolidated operating issue and test the complete intake → record → scratchpad → completion cycle within that issue.
