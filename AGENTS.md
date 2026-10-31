# IssueScratch Agent Instructions

Repository: `BestNameYet/IssueScratch`

## 1. Purpose and scope

IssueScratch is a lightweight, GitHub-Issue-centered environment for accepting instructions, organizing work, maintaining durable agent scratchpads, executing authorized tasks, and recording outcomes.

Its primary design choices are:

1. **One operational issue.** Issue **#1** consolidates the functions performed by Issues #1 (instruction intake), #2 (job queue and completion), and #3 (task scratchpads) in `BestNameYet/IssueStack-`.
2. **Three ordered intensity scratchpads.** "RS" means **Return Schema**. Every IssueScratch RS contains exactly three top-level objects—`interpretation`, `execution`, and `result`—used as general-purpose scratchpads. For **each individual comment**, the agent chooses anew one undisclosed property of its text, then composes distinct content so that its intensity strictly increases from the first scratchpad through the third. The names do not assign topics or reasoning stages; the agent freely defines internal keys.
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

## Three RS scratchpads
<interpretation, execution, result in that order; each contains agent-authored text, with distinct content and strictly increasing intensity along a freshly selected, undisclosed property>

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

There is no separate Issue #1-to-#2 transfer, Issue #2-to-#3 provisioning, or mandatory scratchpad index. The working record itself connects intake, execution, and scratchpads. **The job administration steps above are not the three RS objects.** Agents may draft or revise entries in any order, but the final RS for each comment presents its three scratchpads in their fixed order and satisfies the comment-specific increasing-intensity relation.

### 3.4 Preservation and concurrency

Preserve the user's originating instruction and distinguish it from an agent's interpretation. Revisions and clarified scope should be attributable rather than silently replacing earlier instructions. Avoid overwriting another worker's updates: re-fetch before editing, check job identity and current state, and reconcile conflicts before retrying. A successful write response alone does not prove the resulting record or artifact is correct; read it back.

Public GitHub issues are not private storage. Do not put credentials, secret tokens, private internal reasoning, or sensitive user material in public Issue #1 records. Keep concise decision rationales and reproducible evidence instead.

## 4. Return Schema (RS): three ordered, property-relative scratchpads

An IssueScratch RS is **exactly one JSON object containing exactly three top-level objects** in this presentation order: `interpretation` (first), `execution` (second), `result` (third).

```json
{
  "interpretation": {"text": "<first, lower-intensity original text>"},
  "execution": {"text": "<second, higher-intensity distinct text>"},
  "result": {"text": "<third, highest-intensity distinct text>"}
}
```

The sample `text` keys above are **illustrative only**. An agent chooses all internal keys, types, nesting, and activities. The three object names are permanent **positions**, not categories of meaning: they do not require interpretation, execution, or final-result content.

### Per-comment latent intensity rule (mandatory)

For **each comment containing an RS**, the agent must independently choose **one property of the agent-authored text that admits a meaningful degree or intensity**. It may be stylistic, epistemic, rhetorical, conceptual, procedural, or another appropriate qualitative dimension. The dimension is **not fixed across comments**, and the agent must select it **afresh for every comment**, not carry forward an axis merely because a previous comment used it.

The agent must **not disclose the selected property**, its name, a proxy label that identifies it, its scale, or a numeric rating, in any of the three objects, Issue #1 job metadata, reviews, or the user-facing presentation. This is a latent organizing rule, not an extra field or a user-visible claim about the text. Do not publish private internal deliberation used to make the selection.

Within the **same comment**, write three substantively distinct sets of agent-authored text so that the chosen property has **strictly ascending intensity**:

- **First — `interpretation`:** the least intense text under the comment's selected, undisclosed property.
- **Second — `execution`:** text with greater intensity of **that same property**.
- **Third — `result`:** text with greater intensity than the second, again along **that same property**.

The agent may draft or revise the three texts in any sequence but must present them in this order. **All three objects must contain nonempty, agent-authored textual material** for a complete RS comment. Other permitted nested data, such as tool receipts and identifiers, may accompany that material. Where an object contains multiple text entries, their overall character should accord with its position; do not dilute the ordering with contradictory text.

### Distinctness: not copies, rewrites, or three passes over one statement

The three scratchpads **must not be identical, near-duplicates, incremental paraphrases, increasingly emphatic retellings of the same sentence, or mere expansions padded with extra words**. Each must contribute its own substantive information, perspective, question, observation, action record, criticism, or insight. Related ideas are allowed, but the later scratchpads must make **different contributions**, not simply reproduce earlier material with stronger adjectives.

Greater intensity does **not** inherently mean longer text, more aggressive language, greater certainty, louder tone, or more content. The property is chosen per comment, remains undisclosed, and may vary widely. Its ordering concerns the character of the respective texts, not a requirement to repeat them.

The agent controls which permitted subjects appear in which object. It may mix practical, reflective, critical, administrative, exploratory, and outcome-oriented content across all three; no activity from section 4.1 belongs exclusively to any one object. The **intensity relation**, not topical allocation, is the only cross-object writing constraint.

The fixed RS contract is: **exactly three top-level objects; correct order; original agent-authored text in each; distinct content; one freshly selected, undisclosed property per comment; strictly increasing intensity across the three.** No other fixed nested keys are imposed. Job metadata (comment IDs, status, owner, timestamps, etc.) can remain outside the RS as part of its Issue #1 working record.

### 4.1 Explicitly permitted scratchpad uses

Subject to the agent's actual permissions, the user's scope, truthfulness, and applicable platform safety/privacy obligations, **any of the three scratchpads** may be used to:

1. Write **claims of ownership or stewardship** of particular GitHub comments, including evidence for those claims.
2. Track the user's **instructions** and any changes or clarifications.
3. Track **failures**, failed attempts, diagnostics, and impact.
4. **Reason openly**, by documenting conclusions, assumptions, and concise explanatory rationales intended for review.
5. **Reason cryptically**, by using shorthand, compressed annotations, symbolic notes, or private-to-the-project mnemonics rather than an extended narrative.
6. Make **philosophical forays**, including exploratory questions about methods, meaning, or implications.
7. **Challenge or critique implementations of OpenAI policy**, noting observed behavior, alternative interpretations, concerns, and possible remedies; criticism does not grant authority to override applicable safeguards.
8. Record **specific GitHub tool calls**, their arguments where appropriate, returned IDs, receipts, and errors.
9. Record **specific Google Drive tool calls**, document references, outcomes, and errors.
10. Record **specific calls to other tools or connectors**, including their supported actions and observations.
11. **Examine user instructions**, such as quoting or cross-referencing relevant passages when permissible.
12. **Analyze user instructions**, including ambiguities, dependencies, and operational consequences.
13. **Contemplate user instructions**, including possible interpretations and reflective commentary.

The following **25 additional expressly permitted activities** are likewise available in **any** scratchpad:

1. Formulate hypotheses about how a system works.
2. Record counterhypotheses and competing explanations.
3. Compare alternative architectures or implementation approaches.
4. Document assumptions and their evidentiary basis.
5. Note unresolved questions and information gaps.
6. Investigate regressions and compare before/after behavior.
7. Track changes in task scope and requirement revisions.
8. Maintain a chronology of important events and observations.
9. Record dependencies and prerequisites.
10. Identify opportunities to perform independent work in parallel.
11. Track blockers and proposed means of resolution.
12. Record experiments, inputs, observations, and outcomes.
13. Link test cases, expected results, and observed results.
14. Capture command output excerpts or exact execution receipts.
15. Record repository paths, revisions, commit IDs, and branch names.
16. Track issue, pull-request, comment, and review identifiers.
17. Maintain provenance for external claims, sources, and artifacts.
18. Assess reliability and limitations of retrieved evidence.
19. Explore possible failure modes and edge cases.
20. Critique earlier agent decisions and propose corrections.
21. Record explicit user approvals, rejections, and authorization boundaries.
22. Develop naming conventions, definitions, and conceptual taxonomies.
23. Sketch future procedures, migrations, or workstreams.
24. Prepare handoff notes for a succeeding agent or session.
25. Record lessons learned and candidates for future adjudication.

**This is an illustrative permission catalog, not a closed vocabulary, task checklist, mandatory activity list, or hierarchy of topics.** Agents may use other appropriate scratchpad activities without inventing an additional top-level RS object. They are not obligated to perform any listed activity unless the user or assignment requires it. Whatever activities are chosen must still produce substantively different agent-authored texts in the three scratchpads, ordered by the fresh undisclosed intensity property for that comment.

A claim of comment ownership is **not** proof of control or permission; verify the current comment author and relevant authorization before an edit. A noted tool call is **not** proof it succeeded; separately record observable outcomes where material. Cryptic notes and philosophical speculation must be distinguishable from verified findings when that distinction matters. Concise, shareable rationales or shorthand are allowed, but do not expose private internal chain-of-thought, credentials, restricted data, or unsupported claims of access. GitHub comments are not secret storage.

### 4.2 Example of distinct scratchpad contributions

The following is **only a format illustration**, not a reusable property, prescribed text, or a standardized intensity scale. It uses unrelated contributions that are meaningfully connected to one job, rather than three reformulations of one claim:

```json
{
  "interpretation": {
    "note": "The current job references two earlier reports; their sources have not yet been compared."
  },
  "execution": {
    "observation": "The reports give conflicting outcomes under the same job identifier, so both original receipts require inspection."
  },
  "result": {
    "decision_note": "Reject any completion claim based on those reports until the conflicting original receipts are reconciled and independently verified."
  }
}
```

The agent must still select its **own undisclosed property for each actual comment** and ensure the three texts exhibit strictly increasing intensity of that property. The illustration does not define or reveal the property selected for any real comment. The scratchpad names do not dictate where any of these subjects must appear.

### 4.3 Precedence and fidelity

The agent controls its scratchpad organization, not the user's objective. Explicit user instructions, actual tool contracts, authorized repository scope, and higher-priority obligations still apply. A task's requested deliverable may require particular fields, format, or tests even when the RS scratchpad itself has no prescribed nested schema.

When material is presented as a verified fact or completed operation, it must be grounded in evidence. Do not treat exploratory notes as execution receipts, and do not use a three-object RS to hide missing deliverables, deviations, or failures. Preserve significant version changes or links to earlier snapshots when those versions will later be adjudicated.

## 5. Periodic adjudication of RS designs and populated outputs

IssueScratch's RS definitions **and their actual data** will be adjudicated from time to time. **No review interval, trigger count, schedule, or reviewer assignment is specified yet.** Reviews may be initiated when authorized; agents must not invent a mandatory per-task gate, fixed review frequency, automatic background reviewer, or claimed grading process.

### 5.1 What is reviewed

Adjudication examines **the agent's chosen internal organization and the actual data it wrote**. The reviewer may assess whether the organization served the task, whether claims and tool records were properly supported, whether exploratory or cryptic notes were useful for their purpose, whether boundaries and user intent were respected, and whether requested work was genuinely completed.

**Intensity and distinctness are now explicit assessment criteria.** For each reviewed comment, inspect whether there is a plausible **single qualitative dimension** under which the three texts have strictly increasing intensity and whether each text adds genuinely different substance rather than merely amplifying or paraphrasing the previous one. The reviewer evaluates the observable text only; **neither the agent nor reviewer should disclose or demand disclosure of the agent's selected property**. If that latent relation is not apparent from the text, report the weakness without inventing certainty about the agent's selection. Do not penalize unusual topical placement; the three names do not designate content categories.

The adjudicator assigns **one overall label** to the reviewed output. Optional findings may separately address internal schema choices, the observable ordinal relation, distinctness, note quality, factual correctness, or task outcomes; they do not introduce a fourth RS object.

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
- Each RS comment has exactly three top-level scratchpad objects in order, each containing nonempty, substantively distinct agent-authored text; the agent freshly chooses but does not reveal a property whose intensity strictly increases across the three. Any separately requested deliverable or consumer contract is satisfied.
- Claimed edits, executions, tests, and outputs have been independently inspected or verified.
- Remaining work and failures are disclosed rather than marked complete.

A lightweight text-only answer can satisfy these checks with minimal overhead. A repository mutation or multi-step task calls for stronger evidence.

## 8. Bootstrap status

At the time this instruction file was first authored, `BestNameYet/IssueScratch` was an empty repository with no issues, commit history, or workflows. This file establishes the **intended protocol**, not an already deployed system. Future agents must inspect the *current* repository and Issue #1 instead of relying on that historical bootstrap observation.

The immediate next setup step, when authorized, is to create Issue #1 as the consolidated operating issue and test the complete intake → record → scratchpad → completion cycle within that issue.
