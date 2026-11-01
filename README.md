# IssueScratch

IssueScratch is an experimental, GitHub Issue-based workspace for capturing heterogeneous scratchpad arrays, measuring their structure deterministically, and representing source documents as lossless, opcode-annotated JSON. This README is the **repository manifest and navigation guide**; [`AGENTS.md`](AGENTS.md), not this overview, contains the normative agent procedures.

- **Repository:** [BestNameYet/IssueScratch](https://github.com/BestNameYet/IssueScratch)
- **Operating surface:** [Issue #1](https://github.com/BestNameYet/IssueScratch/issues/1) — intake, working records, scratchpads, and verification remain logically distinct inside one issue.
- **Language/runtime:** Node.js (CommonJS) and GitHub Actions.
- **Source of truth:** The repository files and current Issue #1 instructions. Check both before operating; this manifest describes the inspected structure, not a substitute for reading instructions.
- **Manifest revision:** October 31, 2026; paths are relative to the repository root.

## Repository structure

```text
IssueScratch/
├── README.md
├── AGENTS.md
├── .github/
│   └── workflows/
│       └── issue1-json-validator.yml
├── src/
│   ├── issue1-diagnostics.js
│   ├── issue1-diagnostics.test.js
│   ├── framing-controller.js
│   ├── framing-controller.test.js
│   ├── artifact-publisher.js
│   ├── artifact-publisher.test.js
│   ├── opcode-document-adapter.js
│   ├── opcode-document-adapter.test.js
│   └── types/
│       ├── issuescratch.permitted-uses-and-input-types.v1.json
│       ├── issuescratch.scratchpad-field-registry.v1.json
│       ├── issuescratch.scratchpad-field-registry.v2.json
│       ├── issuescratch.operation-registry.v1.json
│       ├── issuescratch.opcode-adapter-contract.v1.json
│       ├── issuescratch.framing-controller.v1.json
│       └── issuescratch.higher-order-operators.v1.json
├── experiments/
│   ├── general-purpose-job-prompts.v1.json
│   ├── general-purpose-job-opcode-map.v1.json
│   ├── general-purpose-job-prompts.opcoded.v1.json
│   └── readme-job-001.candidate.md
└── workspaces/
    └── issue1-diagnostics/
        └── comments/
            └── <comment-id>/
                ├── state.json
                ├── revisions/
                │   └── <source-body-sha256>.json
                └── instructions/
                    └── <zero-padded-next-index>.json
```

The `workspaces/` example is a **path pattern**, not a literal `<comment-id>` directory. The number of comment directories and revision files changes as new events are processed.

## File manifest

### Governance and automation

| Path | Role |
| --- | --- |
| [`README.md`](README.md) | Human-readable manifest, architecture, invocation examples, and operational status. |
| [`AGENTS.md`](AGENTS.md) | Authoritative, JSON-formatted agent instructions, including numbered `IS.*` procedural opcodes, scope, return schema, job handling, and acceptance checks. |
| [`.github/workflows/issue1-json-validator.yml`](.github/workflows/issue1-json-validator.yml) | GitHub Actions entry point: tests the Node modules; diagnoses Issue #1 comments; persists revision and state JSON; converts and verifies the prompt manifest during non-comment runs. |

### Executable Node.js components

| Path | Role |
| --- | --- |
| [`src/issue1-diagnostics.js`](src/issue1-diagnostics.js) | Parses comment bodies; measures Unicode code-point characters, serialized JSON lengths, keys, nested arrays, and per-index distributions; validates root-array/wrapper shape; advances per-comment accepted-index state. |
| [`src/issue1-diagnostics.test.js`](src/issue1-diagnostics.test.js) | Tests parsing failures, nested arrays, per-index measurements, unchanged-prefix checks, duplicate events, historical snapshots, and the index-18 progression limit. |
| [`src/framing-controller.js`](src/framing-controller.js) | Selects and persists one higher-order OP.02 frame operator per three-index exercise, optionally chooses an ABSTRACT mode, independently selects atomic OP.01 actions, and structurally validates substantive solver outputs. |
| [`src/framing-controller.test.js`](src/framing-controller.test.js) | Tests five frame-level selections, stable operator/mode reuse across three slots, source lineage, four ABSTRACT modes, atomic choices, input/output validation and 19-entry progression. |
| [`src/artifact-publisher.js`](src/artifact-publisher.js) | Generic completed-job artifact verifier: source-authorized destinations, nineteen accepted revisions, five persisted higher-order frames, eighteen matching instructions and final UTF-8 content. No filename-specific rules. |
| [`src/artifact-publisher.test.js`](src/artifact-publisher.test.js) | Tests the common publication contract, explicit source authorization, path safety, source integrity, controller receipts and destination matching. |
| [`src/opcode-document-adapter.js`](src/opcode-document-adapter.js) | Command-line and module adapter from document bytes to a JSON-object envelope retaining original bytes, SHA-256, source-linked records, and declared reusable operation steps. Provides `convert` and `verify`. |
| [`src/opcode-document-adapter.test.js`](src/opcode-document-adapter.test.js) | Tests byte-for-byte preservation, typed JSON/text/binary input handling, operation reuse, invalid profile/opcode rejection, tampering, and command-line round-trip verification. |

### Schemas, catalogs, and reference contracts

| Path | Role |
| --- | --- |
| [`src/types/issuescratch.permitted-uses-and-input-types.v1.json`](src/types/issuescratch.permitted-uses-and-input-types.v1.json) | **Current canonical** scratchpad use-and-type catalog: 152 flat permitted-use statements with expected typed inputs, 59 registered fields, 68 named object types, and 17 illustrative scratchpads. Not a mandatory allocation of roles to indices. |
| [`src/types/issuescratch.scratchpad-field-registry.v1.json`](src/types/issuescratch.scratchpad-field-registry.v1.json) | Earlier scratchpad field/type registry, retained for provenance and historical comparison. |
| [`src/types/issuescratch.scratchpad-field-registry.v2.json`](src/types/issuescratch.scratchpad-field-registry.v2.json) | Later standalone field/type registry, retained as a legacy reference; superseded for active use by the combined canonical catalog above. |
| [`src/types/issuescratch.operation-registry.v1.json`](src/types/issuescratch.operation-registry.v1.json) | Declares 16 reusable functional operations under `OP.01.*`, their descriptions, and abstract input/output contracts. These are *not* record IDs or execution receipts. |
| [`src/types/issuescratch.opcode-adapter-contract.v1.json`](src/types/issuescratch.opcode-adapter-contract.v1.json) | Formal lossless conversion procedure and envelope contract, including `IS.09.001`–`IS.09.008`, source/projection separation, supported formats, and limitations. |
| [`src/types/issuescratch.framing-controller.v1.json`](src/types/issuescratch.framing-controller.v1.json) | Versioned 19-index controller profile: five nested preparation roles, five three-index higher-order frames, two stable referents per frame, three reconciler indices, atomic operation pool and structural frame-output rules. |
| [`src/types/issuescratch.higher-order-operators.v1.json`](src/types/issuescratch.higher-order-operators.v1.json) | Formal OP.02 contracts for SOLVER_LIFT and ABSTRACT, including typed inputs/outputs, CONTRACT/IMPLEMENTATION/CONSTRUCT/GENERAL modes and lineage-preservation invariants. |

### Experimental inputs and converted outputs

| Path | Role |
| --- | --- |
| [`experiments/general-purpose-job-prompts.v1.json`](experiments/general-purpose-job-prompts.v1.json) | Original 17-prompt batch (`P01`–`P17`) spanning writing, philosophy, mathematics, coding, planning, translation, and analysis. The prompts are source material, not completed jobs. |
| [`experiments/general-purpose-job-opcode-map.v1.json`](experiments/general-purpose-job-opcode-map.v1.json) | Explicit mapping profile assigning sequences of shared operation opcodes to the 17 prompt IDs. It declares intended operations; it does not execute them. |
| [`experiments/general-purpose-job-prompts.opcoded.v1.json`](experiments/general-purpose-job-prompts.opcoded.v1.json) | Generated JSON-object projection of the job batch. Contains exact source bytes in Base64, a source hash, stable record IDs, source pointers, and operation sequences. Regenerate through the adapter rather than editing independently. |
| [`experiments/readme-job-001.candidate.md`](experiments/readme-job-001.candidate.md) | Early candidate generated from a 17-entry comment imported complete, retained for comparison; **not** a completed controller-driven run. |

### Persistent operational workspace

| Path pattern | Role |
| --- | --- |
| [`workspaces/issue1-diagnostics/comments/`](workspaces/issue1-diagnostics/comments/) | One directory per permanent Issue #1 comment ID; written by the GitHub Actions workflow. |
| `workspaces/issue1-diagnostics/comments/<comment-id>/state.json` | Current **JSON object**: progression state, accepted prefix hash, latest revision pointer, validation result, and revision-history entries. |
| `workspaces/issue1-diagnostics/comments/<comment-id>/revisions/<source-body-sha256>.json` | Immutable-per-content **JSON object**: diagnostics and transition information for an observed source revision, including lengths and keys at each index. |
| `workspaces/issue1-diagnostics/comments/<comment-id>/instructions/<zero-padded-index>.json` | Per-index selected function, source revision, random draw, and framing requirements stored as a JSON object. |
| [`workspaces/readme-job-001/receipt.json`](workspaces/readme-job-001/receipt.json) | Historical README experiment receipt, retained for provenance; it is not an active publication procedure. |
| `workspaces/issue1-diagnostics/comments/<comment-id>/published-artifacts/<source-sha256>.json` | Workflow-owned generic artifact publication receipt; records destination paths, verified blob SHA values and source lineage for any finalized artifact. |

Workspaces contain runtime evidence, not authoritative instructions. Preserve saved records and revision identities; do not rewrite historical diagnostics to make results appear more successful.

## How the components interact

### 1. Scratchpad return format and per-comment progression

For **completed** new return-schema (RS) records, [`AGENTS.md`](AGENTS.md) requires a single root JSON array of at least 19 entries. Every entry is exactly one wrapper object with the literal key `scratchpad`; its value is a **nonempty heterogeneous JSON object**. Registered typed fields are independently optional. This compact example shows the *shape only*, not a complete RS:

```json
[
  { "scratchpad": { "text[string]": "Example entry at index 0" } },
  { "scratchpad": { "text[string]": "Different entry at index 1" } }
]
```

Intermediate drafts may have 1–18 entries. Each newly accepted revision must add exactly **one** entry and preserve the previously accepted prefix. For a comment created through the incremental process, the state processor tracks accepted indices `0` through `18`; after index 18 it stops advancing the accepted index while continuing JSON validation and diagnostic snapshots. Historical arrays found during an initial scan are labeled historical snapshots, **not** fabricated incremental events.

The workflow checks JSON syntax, one root array, nonempty single-key wrapper shape, and structural progression. It **does not** evaluate whether contributions are semantically distinct or accurate. Nested arrays inside scratchpad values are allowed and counted independently of the root array.

### Updated nineteen-index layout (v1.6)

The new completion contract uses **one preparation index + fifteen reframing indices + three reconciliation indices = nineteen top-level entries**:

| Outer index | Purpose |
| --- | --- |
| 0 | One substantive scratchpad containing exactly five nested scratchpads: instruction/context projections with an initial provisional atomic opcode mapping, requirements rumination, adversarial review, atomistic action decomposition, and revised opcode rendering. |
| 1–15 | Five recursive reframing exercises, each consisting of reference A, reference B, and a scope-preserving narrative expansion. |
| 16 | Collect and reconcile all prior entries, identify omissions and conflicts. |
| 17 | Construct individually typed opcode steps for earlier content, including **every nested preparatory scratchpad**, with complete source-pointer coverage. |
| 18 | Final synthesis, coverage checks and a proposed output addressing the original instruction. |

Nested preparatory scratchpad 0 contains a **`context_elements[array<object>]`** record of relevant prior-conversation material with source, authority, and sequence. It also contains `initial_opcode_projection[array<object>]` with provisional *action-by-action* OP mappings. The original instruction, minimalist/maximalist intent, explicit intent, inferred beginning state, inferred post state, and inferred change are distinct projections; inference is not silently promoted to an explicit request.

This layout is structurally checked by the controller and remains separate from the semantic question of whether the worker interpreted or executed a selected function faithfully. The previously completed 17-entry README experiment and its output remain historical records; they do not satisfy the new nineteen-entry contract.

### Higher-order framing operators (profile v2.1)

Five **three-index exercises** occupy outer indices 1–15. The controller chooses **one** higher-order operation at the start of each exercise (when the preceding index is accepted), rather than selecting a different framing operation for each of the exercise's three slots.

| Higher-order opcode | Operation | Required transformation |
| --- | --- | --- |
| `OP.02.001 — SOLVER_LIFT` | Treat the previous solver—its problem, method, assumptions, interim results, limitations and source references—as the **input and subject of an enclosing solver**. | Construct a genuinely different, next-level solver input rather than merely rephrasing the original instruction. |
| `OP.02.002 — ABSTRACT` | Transform the subject's representation under one explicitly selected mode. | Preserve source mapping, explain retained properties and suppressed details, and produce the typed output specified by the mode. |

**ABSTRACT modes:** `CONTRACT` models interfaces/obligations/preconditions/postconditions; `IMPLEMENTATION` models components/algorithms/dependencies **without writing or executing code**; `CONSTRUCT` models structural elements/relationships; `GENERAL` extracts cross-instance properties and limits. All four are declared in the [higher-order registry](src/types/issuescratch.higher-order-operators.v1.json).

**Selection and persistence:** At each frame's first slot (outer indices **1, 4, 7, 10, 13**), `node:crypto.randomInt(2)` selects SOLVER_LIFT or ABSTRACT equally. Conditional on ABSTRACT, `node:crypto.randomInt(4)` selects one mode. The workflow saves that selection in `progression.frame_selections` and retains it for the entire three-slot frame; retries replay saved choices without new draws. Separately, one of 14 registered atomic `OP.01.*` actions is selected per next index and may support the enclosing transformation. The atomic action is **not** the frame operator.

**Substantive scratchpad contract:** Slot A supplies `solver_or_subject[object]` with source references and inner-solver details; slot B supplies `enclosing_target[object]` with criteria and invariants; slot C supplies `higher_order_result[object]` with `preserved_properties`, `suppressed_details`, `introduced_assumptions`, `source_mapping`, `next_solver_input`, and either a SOLVER_LIFT `outer_solver_input` or mode-specific ABSTRACT `representation`. These are **task content fields**, not workflow metadata or agent acknowledgements. The validator checks their shape, but cannot establish that the authored abstraction is substantively correct.

Each new frame may choose another higher-order operation. The five frame outputs form a traceable hierarchy leading into the reconciliation stages at indices 16–18. The controller **selects and publishes instructions**; an external agent remains responsible for authoring solver transformations.

### 2. Event-driven diagnostics

The single workflow responds to `issue_comment.created` and `issue_comment.edited` events **on Issue #1**. On `push` to selected implementation/input paths or manual `workflow_dispatch`, it also scans existing Issue #1 comments. It runs automated tests first.

For each observed comment revision it deterministically records:

- Source-body SHA-256, total source characters (Unicode code points), and UTF-8 byte count.
- Whether JSON parses, whether its root is one array, its length, and nested-array count.
- Per-index serialized character and byte counts, string-content character counts, key occurrences, scratchpad field names, and share of total indexed content.
- Per-key JSON-value and text-value character totals, pointers, and repeat counts.
- Acceptance/rejection transition, current accepted entry count, latest diagnostic pointer, and revision history.

Invalid JSON is **not silently repaired or rewritten**. Its failure is recorded as a JSON object and it cannot advance accepted progression. Duplicate observations of the same content hash do not advance state twice. State files and diagnostic snapshots remain separate from the user-authored issue comment.

**Framing controller v2.1:** Index 0 contains five nested preparatory scratchpads. Across five three-slot frames (indices 1–15), the workflow persists one higher-order SOLVER_LIFT or ABSTRACT choice per frame, plus an independently selected atomic OP.01 action per index. Indices 16–18 reconcile source coverage and opcode steps. Invalid/imported-complete arrays do not issue instructions, index 18 terminates progression, and retry recovery preserves the ordered random draws. See the higher-order contracts above.

The controller **selects and publishes** the next instruction; it does **not** autonomously execute the function, produce the next scratchpad, or assess semantic correctness. **Higher-order frame verification:** [Source comment 6548995651](https://github.com/BestNameYet/IssueScratch/issues/1#issuecomment-6548995651) was accepted sequentially through indices 0–3; the [controller history](https://github.com/BestNameYet/IssueScratch/issues/1#issuecomment-6548997266) demonstrates ABSTRACT/IMPLEMENTATION selected once, retained across all three slots, then a fresh selection for F1. [GitHub Actions run 41241263066](https://github.com/BestNameYet/IssueScratch/actions/runs/41241263066) passed all 43 tests. No full nineteen-index execution or semantic correctness claim follows from this proof. The [new 19-entry schema live probe](https://github.com/BestNameYet/IssueScratch/issues/1#issuecomment-6548830869) verified a five-part initial preparation followed by an agent-authored index-1 entry, with randomly chosen instructions persisted in the [controller comment](https://github.com/BestNameYet/IssueScratch/issues/1#issuecomment-6548832768) ([first successful run](https://github.com/BestNameYet/IssueScratch/actions/runs/41239803917), [second successful run](https://github.com/BestNameYet/IssueScratch/actions/runs/41239852275)). The earlier 17-entry README experiment is historical. New README authoring is handled by the same generic artifact publication contract as any other text file; no complete 19-entry artifact publication has yet been verified.

### 3. Generic artifact publication — no special README path

The same procedure applies to **every authorized UTF-8 repository artifact**, including `README.md`. A job may declare one or more destinations in the first nested preparatory scratchpad at outer index 0:

- `artifact_targets[array<object>]`: an array of `{ "path": "repository/relative/path", "source_context_id": "C1" }` records. Each `source_context_id` must resolve to a `context_elements[array<object>]` entry with `authority: "explicit_user"`. The source comment must be authored by the repository owner for automatic repository mutation.
- `artifacts[array<object>]` at outer index 18: one `{ "path": "...", "content": "complete UTF-8 output" }` for each declared target. Destination names, not file types, are checked for equality.

After verifying all **19 sequentially accepted source revisions**, five retained higher-order frame selections, 18 source-linked instructions and their immutable receipts, and the current source-body digest, [the workflow](.github/workflows/issue1-json-validator.yml) writes each artifact directly to its requested path using the existing blob SHA as an optimistic concurrency guard. If a file exists—including `README.md`—its contents are **replaced in place**, read back, and verified; the workflow stores a source-linked receipt under `workspaces/issue1-diagnostics/comments/<comment-id>/published-artifacts/`. The same rule applies to a new path, which is created.

This is not a semantic review or permission to invent an artifact target. Publication is not automatic for a source without an explicitly user-grounded target, an owner-authored comment, or full verified completion. There is **no README-only candidate generator, promotion step, comparison hold, or filename-specific approval requirement**. Historical experiment candidates and receipts remain in the repository only as records of earlier runs.

### 4. Document → opcode JSON conversion

The [adapter contract](src/types/issuescratch.opcode-adapter-contract.v1.json) distinguishes three identities:

| Identifier | Meaning |
| --- | --- |
| `IS.*` | Unique, normative procedural clause in `AGENTS.md`. |
| `OP.01.*` | Reusable abstract operation, e.g. CAPTURE, GENERATE, ANALYZE, VALIDATE, EMIT. Multiple records may use the same opcode. |
| `P01`–`P17` (or another `record_id`) | Stable source-record identity. Not an operation or procedure opcode. |

The converter preserves the complete original document bytes in a JSON-object envelope. Valid JSON can be projected into source-pointer-linked records; ordinary UTF-8 text becomes line views; otherwise bytes are preserved as opaque Base64. Without an explicit mapping profile the converter uses only `CAPTURE → EMIT`; it **does not guess** semantic operations. Explicit profiles add intermediate registered opcodes. Conversion and opcode declaration are not proof of execution or correctness of the requested tasks.

## Run and verify locally

A Node.js installation with the built-in `node:test` runner is sufficient; the current repository does not include a `package.json` or third-party package installation step.

From the repository root:

```bash
# Run all automated test suites.
node --test src/*.test.js

# Create a fresh opcode-encoded projection of the 17 prompts.
node src/opcode-document-adapter.js convert \
  --input experiments/general-purpose-job-prompts.v1.json \
  --output experiments/general-purpose-job-prompts.opcoded.v1.json \
  --registry src/types/issuescratch.operation-registry.v1.json \
  --profile experiments/general-purpose-job-opcode-map.v1.json

# Verify the converted artifact against the original source and registry.
node src/opcode-document-adapter.js verify \
  --input experiments/general-purpose-job-prompts.v1.json \
  --output experiments/general-purpose-job-prompts.opcoded.v1.json \
  --registry src/types/issuescratch.operation-registry.v1.json
```

The CLI can also convert an arbitrary UTF-8 or binary file without a mapping profile, using `--input`, `--output`, and `--registry`. That case preserves the source exactly but deliberately does not infer higher-level actions.

For deployed behavior, check [GitHub Actions](https://github.com/BestNameYet/IssueScratch/actions), inspect the specific execution receipt, and read back its saved state/diagnostic files. **A passing unit test, a file commit, and an end-to-end event-driven execution are different forms of evidence.**

## Present boundaries and maintenance

- **Implemented:** one Issue #1 diagnostic workflow; per-comment JSON-object state and metrics; persisted higher-order framing and atomic choices; typed source-linked input/output validation and instruction publication; one general artifact publication workflow step with destination replacement and readback; a lossless document adapter; operation registries and automated tests.
- **Not implemented/verified:** autonomous agent execution of published functions, creation of the next scratchpad by the workflow, or a complete live 19-index artifact publication. Generic publisher code and tests must be verified in a new workflow execution before claiming deployed success. Earlier README candidates remain historical only.
- **Experiment status:** the 17 prompts are prepared and opcode-mapped, but producing the converted manifest does not mean the 17 agent tasks were run.
- **Historical compatibility:** preserve older three-object and seven-entry records rather than rewriting them to the current 19-entry RS contract.
- **On changes:** review `AGENTS.md` and Issue #1 first; update this file manifest when adding, moving, renaming, or changing the responsibilities of major components. Regenerate derived files from their declared sources, validate JSON records, run tests, and verify the GitHub Actions result before claiming operational success.

The most important entry points are **[`AGENTS.md`](AGENTS.md)** for rules, **[Issue #1](https://github.com/BestNameYet/IssueScratch/issues/1)** for work, **[the workflow](.github/workflows/issue1-json-validator.yml)** for event handling, **[the canonical type catalog](src/types/issuescratch.permitted-uses-and-input-types.v1.json)** for permitted scratchpad content, and **[the opcode adapter](src/opcode-document-adapter.js)** for reversible document conversion.

## Index projection procedure

Read [docs/index-projection-procedure.json](docs/index-projection-procedure.json) for the language-independent opcode/JSON procedure used to construct each index's projection for a renderer. It specifies the inputs, operations, dependencies, outputs, reasons and failure handling. Retrieve the complete document from that repository-relative path before reviewing or implementing projection logic. [src/index-projection.js](src/index-projection.js) is the current JavaScript implementation; its presence does not establish conformance to the procedure or completed UI rendering.

## Agent input validation

Read [docs/agent-input-validation-procedure.json](docs/agent-input-validation-procedure.json) in full for the structural input acceptance band, per-index contract binding and precise error responses. Semantic quality is excluded. Accepted input and handled rejection both terminate validation successfully; rejection never authorizes advancement. This document specifies validation and does not claim a deployed implementation.
