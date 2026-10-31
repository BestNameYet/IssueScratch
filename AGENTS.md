# IssueScratch Agent Instructions

Repository: `BestNameYet/IssueScratch`

## 1. Purpose and scope

IssueScratch is a lightweight, GitHub-Issue-centered environment for accepting instructions, organizing work, maintaining durable agent scratchpads, executing authorized tasks, and recording outcomes.

Its primary design choices are:

1. **One operational issue.** Issue **#1** consolidates the functions performed by Issues #1 (instruction intake), #2 (job queue and completion), and #3 (task scratchpads) in `BestNameYet/IssueStack-`.
2. **Three neutrally labeled scratchpads.** "RS" means **Return Schema**. Each IssueScratch RS has exactly three top-level objects: `scratchpad_1`, `scratchpad_2`, and `scratchpad_3`. They are ordered positions, not semantic labels or names for the property. For each comment, the agent independently selects one undisclosed property of its text and writes distinct contributions with strictly increasing intensity from the first scratchpad to the third.
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
<scratchpad_1, scratchpad_2, scratchpad_3 in that order; each contains agent-authored text, with distinct content and strictly increasing intensity along a freshly selected, undisclosed property>

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

An IssueScratch RS is **exactly one JSON object containing exactly three top-level objects** in this presentation order: `scratchpad_1` (first), `scratchpad_2` (second), `scratchpad_3` (third).

```json
{
  "scratchpad_1": {"text": "<first, lower-intensity original text>"},
  "scratchpad_2": {"text": "<second, higher-intensity distinct text>"},
  "scratchpad_3": {"text": "<third, highest-intensity distinct text>"}
}
```

The sample `text` keys above are **illustrative only**. An agent chooses all internal keys, types, nesting, and activities. The three neutral object names identify only their **positions**. They do not designate topics, activities, reasoning phases, or the latent property.

### Per-comment latent intensity rule (mandatory)

For **each comment containing an RS**, the agent must independently choose **one property of the agent-authored text that admits a meaningful degree or intensity**. It may be stylistic, epistemic, rhetorical, conceptual, procedural, or another appropriate qualitative dimension. The dimension is **not fixed across comments**, and the agent must select it **afresh for every comment**, not carry forward an axis merely because a previous comment used it.

The agent must **not disclose the selected property**, its name, a proxy label that identifies it, its scale, or a numeric rating, in any of the three objects, Issue #1 job metadata, reviews, or the user-facing presentation. This is a latent organizing rule, not an extra field or a user-visible claim about the text. Do not publish private internal deliberation used to make the selection.

Within the **same comment**, write three substantively distinct sets of agent-authored text so that the chosen property has **strictly ascending intensity**:

- **First — `scratchpad_1`:** the least intense text under the comment's selected, undisclosed property.
- **Second — `scratchpad_2`:** text with greater intensity of **that same property**.
- **Third — `scratchpad_3`:** text with greater intensity than the second, again along **that same property**.

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

### 4.2 Non-paraphrase / non-appendage test

**This is the most important requirement for examples and actual scratchpad content:** each of the three texts must make an **independent substantive contribution**. Do not pass off grammatical rewriting, synonym substitution, stronger adjectives, merely appended qualifiers, recycled opening text, or a cumulative list as three scratchpads. A shift in intensity alone does not save duplicated content.

For any candidate sequence, compare the two adjacent transitions (`scratchpad_1 → scratchpad_2` and `scratchpad_2 → scratchpad_3`) and classify each transition as one of:

- **Paraphrase — reject:** the successor mainly restates the predecessor's meaning in different words, even if its tone or strength changes.
- **Appended expansion — reject:** the successor repeats or preserves the predecessor's substantive content and adds a clause, fact, detail, or stronger qualifier; its new tail does not make it an independent text.
- **Independent contribution — accept for distinctness:** the successor has its own central informational content, argument, question, or action, not merely a replay or elongation of the predecessor. Acceptance for distinctness does **not** automatically establish that the three texts increase along one property.

Classify the sequence as **invalid** if either transition is paraphrase or appended expansion. A sequence can be independent yet still fail the separate strict-increase requirement.

**Inspection questions:** Could each text be summarized by a different substantive proposition? Does each add a different kind of observation, evidence, decision, analysis, or inquiry? If the second were removed, would the third still have its own meaningful contribution? Is the later text a reformulated or longer version of the earlier one? Mark failures explicitly rather than rationalizing apparent intensity into distinctness.

The test is about **semantic independence**, not literal word overlap. Repeating an identifier, repository name, or necessary background term does not by itself create a paraphrase or appendage.

### 4.3 Sixteen positive few-shot demonstrations with classification

The sixteen positive examples illustrate different tasks and are designed around sixteen non-repeating, undisclosed properties. The **JSON is the example RS**; the **classification and contribution analysis appear outside the JSON** as training annotations. Neither the examples nor their annotations identify the property chosen for any actual comment. An agent must select a fresh undisclosed property for each new real comment. These examples are teaching material, not fixed templates or a finite property menu.

**Few-shot 1 — Conflicting source reports**

```json
{
  "scratchpad_1": {"text": "The job record links two historical reports produced on different dates."},
  "scratchpad_2": {"text": "The reports attach opposite completion statuses to the same transaction identifier."},
  "scratchpad_3": {"text": "A defensible closure requires the raw transaction receipts; neither report alone establishes completion."}
}
```

- `1 → 2`: **Independent contribution** (inventory of sources versus a newly identified contradiction); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (contradiction versus the evidentiary requirement for closure); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness. Three different contributions: source inventory, observed conflict, verification criterion.

**Few-shot 2 — Failed repository lookup**

```json
{
  "scratchpad_1": {"text": "The file fetch returned HTTP 404 for the specified source path."},
  "scratchpad_2": {"text": "Repository metadata names a default branch different from the branch presumed by the original lookup."},
  "scratchpad_3": {"text": "Run a branch-qualified fetch and verify the returned blob SHA before resuming edits."}
}
```

- `1 → 2`: **Independent contribution** (error observation versus a separate metadata discovery); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (branch observation versus a concrete validation action); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness. Three different contributions: error, probable cause, proposed test.

**Few-shot 3 — Conflicting instructions**

```json
{
  "scratchpad_1": {"text": "The current user request proposes renaming a module into a sibling directory."},
  "scratchpad_2": {"text": "The active workspace rule limits file mutations to the designated project tree."},
  "scratchpad_3": {"text": "Because the destination crosses that boundary, seek authorization for the specific path rather than treating the rename request as an implicit scope change."}
}
```

- `1 → 2`: **Independent contribution** (requested mutation versus an independently relevant constraint); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (constraint versus resolution of the authorization conflict); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness. Three different contributions: request, boundary, decision.

**Few-shot 4 — Architecture proposal**

```json
{
  "scratchpad_1": {"text": "The existing queue distributes each job's progress across multiple issue comments."},
  "scratchpad_2": {"text": "A consolidated job comment could hold current state while linking events by permanent comment ID."},
  "scratchpad_3": {"text": "A more general event-ledger design could reconstruct queue state from append-only records, making revision history independently auditable."}
}
```

- `1 → 2`: **Independent contribution** (current architecture versus a new consolidation design); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (current-state layout versus an event-derived alternative with different invariants); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness. Three different contributions: diagnosis, local alternative, broader model.

**Few-shot 5 — Empirical testing**

```json
{
  "scratchpad_1": {"text": "Two trial executions produced different output bytes for the same nominal input."},
  "scratchpad_2": {"text": "Capture five fresh runs with controlled inputs and archive each output hash alongside its receipt."},
  "scratchpad_3": {"text": "Use the controlled hash series to separate input drift, nondeterministic scheduling, and unstable serialization before attributing the discrepancy to the runner."}
}
```

- `1 → 2`: **Independent contribution** (initial observation versus experiment design); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (data-collection procedure versus causal discrimination); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness. Three different contributions: anomaly, measurement, analytic inference plan.

**Few-shot 6 — Philosophical critique of receipts**

```json
{
  "scratchpad_1": {"text": "A machine receipt confirms that a command was accepted by an execution surface."},
  "scratchpad_2": {"text": "A successful command response does not establish that the user's intended external state was produced."},
  "scratchpad_3": {"text": "A trustworthy system should distinguish authorization, reported execution, and independently observed consequences rather than collapsing them into a single declaration of success."}
}
```

- `1 → 2`: **Independent contribution** (what a receipt attests versus the limit of that attestation); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (epistemic limitation versus a systems-design principle); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness. Three different contributions: receipt meaning, inference limitation, governance principle.

**Few-shot 7 — Chronology**

```json
{
  "scratchpad_1": {
    "text": "Meeting notes place the original idea in the first week of October."
  },
  "scratchpad_2": {
    "text": "The implementation was merged into main on October 12 at 16:04 UTC."
  },
  "scratchpad_3": {
    "text": "An independent release receipt establishes production deployment at 16:12 UTC, after the merge."
  }
}
```

- `1 → 2`: **Independent contribution** (originating discussion versus recorded implementation); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (recorded implementation versus production transition); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: originating discussion, recorded implementation, and production transition.

**Few-shot 8 — Information exposure**

```json
{
  "scratchpad_1": {
    "text": "A sample table contains a customer's first name."
  },
  "scratchpad_2": {
    "text": "An export exposes home addresses to participants who do not require them."
  },
  "scratchpad_3": {
    "text": "A publicly shared artifact contains an active credential that should be revoked before further distribution."
  }
}
```

- `1 → 2`: **Independent contribution** (ordinary sample data versus unnecessary disclosure); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (unnecessary disclosure versus separate access risk); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: ordinary sample data, unnecessary disclosure, and separate access risk.

**Few-shot 9 — Code provenance**

```json
{
  "scratchpad_1": {
    "text": "Search results contain an excerpt mentioning the command."
  },
  "scratchpad_2": {
    "text": "The repository file on its default branch has different argument names."
  },
  "scratchpad_3": {
    "text": "A reliable comparison requires retrieving the exact commit recorded in the execution receipt."
  }
}
```

- `1 → 2`: **Independent contribution** (indexed excerpt versus current source discrepancy); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (current source discrepancy versus revision-grounded test); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: indexed excerpt, current source discrepancy, and revision-grounded test.

**Few-shot 10 — Ambiguous instruction**

```json
{
  "scratchpad_1": {
    "text": "The user asks to tidy the job queue."
  },
  "scratchpad_2": {
    "text": "The queue contains both unfinished tasks and historical audit records."
  },
  "scratchpad_3": {
    "text": "Deletion should not proceed until the user identifies which records are expendable."
  }
}
```

- `1 → 2`: **Independent contribution** (general request versus important record distinction); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (important record distinction versus scope decision); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: general request, important record distinction, and scope decision.

**Few-shot 11 — Accessibility**

```json
{
  "scratchpad_1": {
    "text": "A user requested clearer task-status presentation."
  },
  "scratchpad_2": {
    "text": "A mobile screen reader skips a collapsed part of the current status display."
  },
  "scratchpad_3": {
    "text": "Verify the proposed change with the same assistive interaction before claiming that it resolves the barrier."
  }
}
```

- `1 → 2`: **Independent contribution** (presentation request versus reported usability defect); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (reported usability defect versus user-impact verification); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: presentation request, reported usability defect, and user-impact verification.

**Few-shot 12 — Competing explanations**

```json
{
  "scratchpad_1": {
    "text": "An API callback exceeded its time limit."
  },
  "scratchpad_2": {
    "text": "Independent monitoring shows the database was reachable during the incident."
  },
  "scratchpad_3": {
    "text": "Correlate request traces to distinguish connection congestion from downstream processing delay."
  }
}
```

- `1 → 2`: **Independent contribution** (observed symptom versus independent observation); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (independent observation versus causal discrimination); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: observed symptom, independent observation, and causal discrimination.

**Few-shot 13 — Parallel work**

```json
{
  "scratchpad_1": {
    "text": "A regression run is blocked on a missing fixture."
  },
  "scratchpad_2": {
    "text": "Documentation review can proceed without that fixture."
  },
  "scratchpad_3": {
    "text": "Delegate the independent review while rebuilding the fixture, then reconcile both work products."
  }
}
```

- `1 → 2`: **Independent contribution** (blocked dependency versus unblocked activity); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (unblocked activity versus coordinated plan); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: blocked dependency, unblocked activity, and coordinated plan.

**Few-shot 14 — Textual authority**

```json
{
  "scratchpad_1": {
    "text": "A quoted policy statement differs from its published version."
  },
  "scratchpad_2": {
    "text": "The authoritative version narrows the set of permitted approving roles."
  },
  "scratchpad_3": {
    "text": "Any obligation inferred from the quotation must be reassessed using the exact governing text."
  }
}
```

- `1 → 2`: **Independent contribution** (quotation discrepancy versus material source distinction); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (material source distinction versus interpretive consequence); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: quotation discrepancy, material source distinction, and interpretive consequence.

**Few-shot 15 — Recovery**

```json
{
  "scratchpad_1": {
    "text": "A publish attempt ended without a confirmation message."
  },
  "scratchpad_2": {
    "text": "The queue contains a result with the same nonce but another attempt identifier."
  },
  "scratchpad_3": {
    "text": "Compare persisted artifact IDs before retrying to prevent duplicate publication."
  }
}
```

- `1 → 2`: **Independent contribution** (missing acknowledgment versus deduplication evidence); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (deduplication evidence versus safe recovery procedure); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: missing acknowledgment, deduplication evidence, and safe recovery procedure.

**Few-shot 16 — Task architecture**

```json
{
  "scratchpad_1": {
    "text": "Work items are grouped by their hosting GitHub repository."
  },
  "scratchpad_2": {
    "text": "A cross-repository graph could link task dependencies without copying entire comments."
  },
  "scratchpad_3": {
    "text": "A portable capability record could instead attach permissions and evidence to each link, independent of repository boundaries."
  }
}
```

- `1 → 2`: **Independent contribution** (current organization versus graph alternative); **not a paraphrase**, **not appended text**.
- `2 → 3`: **Independent contribution** (graph alternative versus capability-oriented abstraction); **not a paraphrase**, **not appended text**.
- **Sequence:** valid for distinctness; three different contributions: current organization, graph alternative, and capability-oriented abstraction.

**Counterexample A — paraphrases (invalid)**

```json
{
  "scratchpad_1": {"text": "The repository file is absent."},
  "scratchpad_2": {"text": "The requested file does not exist in that repository."},
  "scratchpad_3": {"text": "No such file can be found in the repository."}
}
```

- `1 → 2`: **Paraphrase — reject**.
- `2 → 3`: **Paraphrase — reject**.
- **Why:** all three have essentially the same core proposition.

**Counterexample B — appended expansions (invalid)**

```json
{
  "scratchpad_1": {"text": "The lookup returned 404."},
  "scratchpad_2": {"text": "The lookup returned 404, and the branch was not specified."},
  "scratchpad_3": {"text": "The lookup returned 404, and the branch was not specified, and the file path may be stale."}
}
```

- `1 → 2`: **Appended expansion — reject**.
- `2 → 3`: **Appended expansion — reject**.
- **Why:** each successor literally retains its predecessor's statement and adds a clause.

**Negative classifications take precedence:** a trainee should not label a candidate "valid" just because a reviewer can invent a latent intensity property after reading it. Distinctness must be demonstrated through different semantic contributions independently of the intensity criterion.

### 4.4 Few-shot coverage guidance (properties not disclosed)

The sixteen positive demonstrations and two negative counterexamples provide the working set. Each positive demonstration must use a different property chosen for that example; none may be reused or identified in prose, JSON, titles, annotations, or review artifacts. The separate property used in each live comment must likewise remain undisclosed.

Every additional few-shot must include (a) exactly three scratchpad texts, (b) classification of **both** adjacent transitions as *paraphrase*, *appended expansion*, or *independent contribution*, and (c) short separate explanations identifying the **different substantive contribution** of each text. Do not reveal the agent's selected property, or assign property names or scores inside the RS. More examples are useful only when they add real variation in context and content.

### 4.5 Precedence and fidelity

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
