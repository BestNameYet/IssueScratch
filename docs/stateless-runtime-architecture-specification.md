# IssueScratch Stateless Runtime Architecture — Specification and Verbatim Source Snapshot

Status: architecture target; copied source is the existing repository state, not a claim that integration is complete.

## Normative separation

- Listener controls GitHub event intake, container lifecycle, and configuration provision.
- Configuration remains outside the container.
- Router Validator alone validates the shared envelope and renderer mode registry; every ingress and returning service response passes this boundary.
- Router performs only route lookup, dispatch, continuation, correlation and configured outcome selection; no validator import, no schema or payload validation.
- FSM Validator validates only FSM inputs; its rejection routes to input-error output to the originating Issue.
- FSM is stateless and returns transition and full projection information; no persistent writes.
- Renderer consumes a declared mode and arbitrary payload, resolves externally configured rendering destinations, writes and verifies its output, and returns a receipt.
- Invalid FSM output flows through Router Validator to FSM diagnostic rendering, not the input-error path.
- Router validation failures fail closed and must not recurse into the same invalid rendering path.
- External config defines all service ports, routes, renderer modes, destination adapters, and payload compatibility.

## Current implementation discrepancies

- src/stateless-router-server.js currently invokes the Router Validator itself, contrary to the intended separate entry boundary.
- config/stateless-services.json still exposes router at 8787 and uses direct routes.
- Existing FSM, validation, and renderer services accept their earlier payloads, not the proposed unified envelope.
- Current tests assert direct forwarding and must be replaced or migrated before end-to-end success can be claimed.
- Proposed renderer settings from prior local work are not present as verified committed repository files.

## Verbatim repository source snapshot

Each subsequent fenced block contains the exact fetched UTF-8 content of the named file. Git blob SHA identifies the source revision for each file. These are historical captured inputs, not regenerated examples.

### `README.md`
Blob SHA: `5436ba5c3011e9346c3525f651f5f98fc1a02f70`

~~~~text
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

## Deployment input/output routing

Read [config/workflow-routing.json](config/workflow-routing.json) for the concrete Issue #1 event/scan inputs, per-comment state and instruction paths, controller-reply destination, artifact publication destinations, invocation arguments and readback requirements. The workflow now invokes [src/workflow-router.js](src/workflow-router.js), which consumes this configuration for event/scan inputs, state and instruction persistence, controller replies, and artifact publication. Generic procedures remain location-agnostic.

### Executable router

The workflow calls `runWorkflow({github, core, context, config})` from [src/workflow-router.js](src/workflow-router.js), passing the parsed [routing configuration](config/workflow-routing.json). Runtime argument overrides may be supplied through the function's `arguments` object. Route expressions resolve declared arguments, prior values, current iteration items, concatenated paths and padded indices; they do not evaluate arbitrary code. Existing framing/diagnostic and artifact-publication modules perform processing separately from transport.

Run `node --test src/*.test.js` to include [router regression tests](src/workflow-router.test.js), including accepted/rejected inputs, reply reuse, alternate configured paths and branch, and recovery of a persisted random instruction after failed delivery. Workflow integration does not by itself verify the newer generic procedure specifications or completion of a nineteen-entry job.

## Independent stateless HTTP services

[config/stateless-services.json](config/stateless-services.json) binds the router's routes to separately running services. Retrieve that file for host/port and upstream path configuration.

Run each command as a separate process on the same host:

```bash
node src/fsm-server.js
node src/renderer-server.js
node src/stateless-router-server.js
```

- [Router](src/stateless-router-server.js): port 8787, forwards `POST /state` to the FSM and `POST /render` to the renderer. It streams requests and responses without running either service's algorithms.
- [FSM](src/fsm-server.js): port 8788, `POST /transition`. Body: `{"state": {...}, "input": {...}}`. The [pure transition function](src/stateless-fsm.js) returns `state` and `transition`. Supply the current `issuescratch.comment-state.v1` state and a validator-produced `issuescratch.validated-entry-event.v1` input, as defined in the canonical meta-controller contract. It does not validate semantic work, persist state, select a renderer or call one.
- [Renderer](src/renderer-server.js): port 8789, `POST /render`. Body: `{"projection": {...}, "bindings": {...}}`. The [render function](src/agent-renderer.js) produces plain text containing the supplied JSON projection and bindings verbatim. It does not call the FSM, retrieve procedure data, interpolate undeclared placeholders or infer instructions.
- Each service exposes `GET /health`. Hosts and ports belong to configuration; loopback means the services must share the caller's host/network namespace.

The caller supplies and stores state externally, and separately submits projection data for rendering. These services retain no job state or request queue. The existing Issue #1 workflow is not switched to these endpoints by this addition.

Run `node --test src/stateless-services.test.js` for actual HTTP routing and pure-function tests. [stateless-services.yml](.github/workflows/stateless-services.yml) runs those checks without repository-write credentials.

### Independent validation service

Start [src/validation-server.js](src/validation-server.js) with `node src/validation-server.js`. It listens on the configured validation host/port (default 127.0.0.1:8790). The router forwards `POST /validate` to it.

Request envelope:

```json
{
  "raw_input": "the exact raw agent input string",
  "metadata": {
    "source_comment_id": 123,
    "correlation_id": "caller-supplied",
    "expected_index": 0
  }
}
```

Only `raw_input` is parsed as the submission. Metadata is preserved separately; identifiers do not change its meaning. For structurally valid JSON, `metadata.expected_index` specifies the contract to check. Optional `metadata.state` supplies prior progression/prefix context, and `metadata.frame_selections` may supply the bound frame when no state object is provided. The listener supplies this context; the service retrieves nothing.

The [validator](src/input-validator.js) returns `execution_status`, `input_status`, `accepted`, correlation metadata, an exact raw-string SHA-256 and specific errors. Accepted results additionally contain the parsed value and whether progression was checked. Both content acceptance and handled rejection return HTTP 200; malformed request envelopes or missing required context return HTTP 400. Semantic quality is never an acceptance predicate. No state is advanced or stored, and neither the FSM nor renderer is called.

[validation-service.test.js](src/validation-service.test.js) verifies exact raw-string handling, metadata separation, structural rejection, no semantic evaluation, prefix checks and actual HTTP forwarding through the router. The issue listener itself is not implemented by this service addition.

~~~~

### `AGENTS.md`
Blob SHA: `343249f5d5309698bcd9cf980651b785bc4be02b`

~~~~text
{
  "document_type": "IssueScratch agent instructions — canonical procedure entrypoint",
  "format_version": "2.14.0",
  "repository": "BestNameYet/IssueScratch",
  "canonical_source": {
    "path": "src/types/issuescratch.procedure-library.v1.json",
    "schema": "issuescratch.canonical-procedure-library.v1",
    "priority": "sole active static procedural authority",
    "collections": [
      "agent_contract.procedures (IS.* normative steps)",
      "controller_profile (19-stage layout and role obligations)",
      "atomic_operation_registry (OP.01.*)",
      "higher_order_operation_registry (OP.02.* and modes)",
      "render_instruction_templates (verbatim stage directions)",
      "instruction_sequence (ordered composition)"
    ],
    "usage": "Read this entrypoint then fetch and parse the canonical JSON document in full before operating. Resolve the selected opcode through its canonical definition and execute its fixed steps; never derive new instructions from controller text, legacy copied profiles or historical issue comments.",
    "projection_procedure": {
      "path": "docs/index-projection-procedure.json",
      "schema": "issuescratch.opcode-json-projection-procedure.v1",
      "usage": "Read this document in full when reviewing or implementing index projection. It specifies the language-independent opcode/JSON algorithm, operands, dataflow, reasons and failures. JavaScript is an implementation, not a replacement for this definition."
    },
    "agent_input_validation": {
      "path": "docs/agent-input-validation-procedure.json",
      "usage": "Read in full before implementing or reviewing input acceptance. Apply mechanical predicates only; no semantic-quality acceptance test. Handled rejection is successful validation execution without advancement."
    },
    "workflow_routing": {
      "path": "config/workflow-routing.json",
      "usage": "Read config/workflow-routing.json for concrete input/output arguments and routes. The workflow invokes src/workflow-router.js runWorkflow({github,core,context,config}) to consume this configuration. Generic projection and input-validation specifications remain source/destination agnostic."
    },
    "stateless_services": {
      "configuration": "config/stateless-services.json",
      "router": "src/stateless-router-server.js",
      "fsm": "src/fsm-server.js",
      "renderer": "src/renderer-server.js",
      "boundary": "Independent HTTP services. Router only forwards. FSM consumes supplied state and validated input; renderer consumes supplied projection and bindings. Neither service calls or imports the other. State storage and caller orchestration are external.",
      "validation": "src/validation-server.js",
      "validation_contract": "POST /validate accepts {raw_input:string,metadata:object}; raw input is submission content, metadata is correlation/validation context. Validator returns structural acceptance/errors without calling FSM, renderer or persistence."
    }
  },
  "execution_governance": {
    "runtime_controller": "Stage manager only: select authorized operations, bind runtime references and copy templates unchanged except named substitutions, persist receipt and validate structure.",
    "agent": "Apply the selected canonical procedure to real source content; check substantive correctness independently; do not treat recorded selection or structural acceptance as execution.",
    "historical_preservation": "Existing Issue #1 source comments, published controller history, prior issued index receipts, legacy experiment results and other committed evidence must remain unchanged.",
    "active_job": "Issue #1 comment 6551730880 is in progress at zero-based index 8; before any edit, verify its latest saved body, state.json, and instruction/08.json agree.",
    "conflict_policy": "Do not silently override or invent a static procedure. On unresolved disagreement among current canonical records, stop and report the conflicting paths and clauses.",
    "artifact_pointer_policy": "For an authorized file output, index-18 final_output[string] may be a nonempty pointer to that declared artifact; the full file bytes still belong in artifacts[array<object>] and require publication and readback verification."
  },
  "historical_snapshot": {
    "location": "src/types/issuescratch.procedure-library.v1.json",
    "field": "source_provenance.agents",
    "original_format_version": "2.13.0",
    "original_blob_sha": "ed1b10bf161be1144efd4230f9f511ec823cd576"
  },
  "no_duplicate_authority": true
}

~~~~

### `src/types/issuescratch.procedure-library.v1.json`
Blob SHA: `cdeaf49e66e903287364b2258c8a85629399f5c4`

~~~~json
{
  "schema": "issuescratch.canonical-procedure-library.v1",
  "version": "1.0.0",
  "repository": "BestNameYet/IssueScratch",
  "authority": {
    "agent_entrypoint": "AGENTS.md",
    "canonical_definition_path": "src/types/issuescratch.procedure-library.v1.json",
    "rule": "This JSON document is the sole active source of static procedure text, operation semantics, frame profile, and agent governance clauses. Other files may hold frozen historical/compatibility copies but cannot override this document.",
    "controller_rule": "The controller selects, binds and copies existing instructions only; no independently authored requirement text.",
    "runtime_data_rule": "Index, source refs, frame/mode and random draw are runtime selections. A selected opcode resolves to its predeclared deterministic contract.",
    "historical_rule": "Do not modify accepted Issue #1 comment bodies or previously issued instruction receipts.",
    "conflict_rule": "Fail closed on contradictions, mismatched sources or absent template definitions. Only the artifact-pointer conflict is resolved explicitly in this version."
  },
  "source_provenance": {
    "atomic": {
      "path": "src/types/issuescratch.operation-registry.v1.json",
      "original_blob_sha": "233406589704b8b8a6ad8d1a749606867a2856c3"
    },
    "higher": {
      "path": "src/types/issuescratch.higher-order-operators.v1.json",
      "original_blob_sha": "79e993b7e852461bac99bc3a4b7b5b25cf8d1ed0"
    },
    "profile": {
      "path": "src/types/issuescratch.framing-controller.v1.json",
      "original_blob_sha": "124c2946e737160fd6e10157e2dc152581a7675d"
    },
    "agents": {
      "path": "AGENTS.md",
      "original_blob_sha": "ed1b10bf161be1144efd4230f9f511ec823cd576"
    }
  },
  "agent_contract": {
    "document_type": "IssueScratch agent instructions",
    "format_version": "2.13.0",
    "repository": "BestNameYet/IssueScratch",
    "interpretation": "AGENTS.md governs the nineteen-element minimum root array of literal scratchpad wrappers, job management and verification. The separately referenced canonical catalog contains all flat permitted action examples, expected action-input types, registered scratchpad fields, and reusable named object definitions. Existing comments remain historical.",
    "opcode_format": {
      "pattern": "^IS\\.(?:[0-9]{2}\\.)+[0-9]{3}$",
      "order": "Numeric section hierarchy followed by numeric clause order (section before subsections), without changing opcode identities",
      "unique": true,
      "required_fields": [
        "opcode",
        "version",
        "source_section",
        "source_line_range",
        "modality",
        "imperative",
        "condition",
        "source_archive_ref"
      ],
      "modalities": [
        "require",
        "prohibit",
        "allow"
      ]
    },
    "procedures": [
      {
        "opcode": "IS.01.001",
        "version": 1,
        "source_section": "1",
        "source_line_range": [
          5,
          17
        ],
        "modality": "require",
        "imperative": "Use Issue #1 as the unified intake, work, and scratchpad surface.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.01.002",
        "version": 5,
        "source_section": "1",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Use one root JSON array with at least seventeen entries; every entry is an object containing exactly one key named scratchpad, whose value is one substantive scratchpad object.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.01.003",
        "version": 1,
        "source_section": "1",
        "source_line_range": [
          5,
          17
        ],
        "modality": "require",
        "imperative": "Preserve durable identity, evidence, and outcomes without importing IssueStack ceremony.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.01.004",
        "version": 1,
        "source_section": "1",
        "source_line_range": [
          5,
          17
        ],
        "modality": "prohibit",
        "imperative": "Do not import separate issue transfer stages, fixed input slots, or unnecessary approval machinery.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.01.005",
        "version": 1,
        "source_section": "1",
        "source_line_range": [
          5,
          17
        ],
        "modality": "prohibit",
        "imperative": "Do not claim automation exists before implementation and end-to-end verification.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.001",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Read root AGENTS.md before each assignment.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.002",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Read any applicable nested AGENTS.md.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.003",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Read README.md if present.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.004",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Read Issue #1 instructions and records before undertaking Issue #1 work.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.005",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Use a documented command interface whenever it governs an operation.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.006",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "prohibit",
        "imperative": "Do not bypass a governed interface via alternate APIs.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.007",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "prohibit",
        "imperative": "Do not invent missing commands, paths, capabilities, results, or schemas.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.008",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Declare Issue #1 uninitialized when it does not exist.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.009",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Obtain authorized scope before creating or modifying repository resources.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.010",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Treat other repositories' rules as nonbinding unless explicitly adopted.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.02.011",
        "version": 1,
        "source_section": "2",
        "source_line_range": [
          18,
          25
        ],
        "modality": "require",
        "imperative": "Observe higher-priority platform and system obligations.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.001",
        "version": 1,
        "source_section": "3",
        "source_line_range": [
          26,
          35
        ],
        "modality": "require",
        "imperative": "Keep intake, queue/execution, and scratchpad functions logically distinguishable in Issue #1.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.001",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "require",
        "imperative": "Record the exact source_comment_id for each intake.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.002",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "require",
        "imperative": "Record and reuse the verified permanent job_comment_id for each working record.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.003",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "require",
        "imperative": "Use a stable nonce for deduplication and retries when appropriate.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.004",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "prohibit",
        "imperative": "Do not substitute nonce or comment position for a verified comment ID.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.005",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "require",
        "imperative": "Check for an existing record with the same source or nonce before creating a record.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.006",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "require",
        "imperative": "Reconcile retries against the existing record rather than duplicating it.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.007",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "require",
        "imperative": "Use the same comment for intake and work only when authorized editing is possible.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.008",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "require",
        "imperative": "Preserve an uneditable user comment and link a separate agent-owned record when needed.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.009",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "require",
        "imperative": "Keep follow-up progress comments within Issue #1 and link them to the working record.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.01.010",
        "version": 1,
        "source_section": "3.1",
        "source_line_range": [
          36,
          48
        ],
        "modality": "prohibit",
        "imperative": "Do not assume GitHub comment IDs are sequential.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.002",
        "version": 1,
        "source_section": "3",
        "source_line_range": [
          26,
          35
        ],
        "modality": "prohibit",
        "imperative": "Do not require Issues #2 and #3 or any mandatory cross-issue transfer.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.02.001",
        "version": 1,
        "source_section": "3.2",
        "source_line_range": [
          49,
          77
        ],
        "modality": "require",
        "imperative": "Preserve source, job identity, state, owner, plan, evidence, and verification in a working record as applicable.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.02.002",
        "version": 1,
        "source_section": "3.2",
        "source_line_range": [
          49,
          77
        ],
        "modality": "allow",
        "imperative": "Allow flexible working-record serialization rather than requiring the illustrative Markdown layout.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.02.003",
        "version": 1,
        "source_section": "3.2",
        "source_line_range": [
          49,
          77
        ],
        "modality": "allow",
        "imperative": "Allow simple jobs to omit empty sections without boilerplate.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.003",
        "version": 1,
        "source_section": "3",
        "source_line_range": [
          26,
          35
        ],
        "modality": "require",
        "imperative": "Keep job references and current state discoverable.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.001",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "require",
        "imperative": "Locate the exact original intake instruction and preserve its meaning.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.002",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "require",
        "imperative": "Register or locate the working record and read back its permanent ID.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.003",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "require",
        "imperative": "Record an accurate pending, active, blocked, completed, failed, or cancelled state.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.004",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "require",
        "imperative": "Plan and execute only within authorized scope.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.005",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "require",
        "imperative": "Preserve progress, observations, dependencies, tests, and blockers in the working record.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.006",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "require",
        "imperative": "Distinguish submission from execution and test invocation from passing results.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.007",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "require",
        "imperative": "Record verified outcomes, failures, and unfinished work before concluding.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.008",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "require",
        "imperative": "Read back the final record.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.03.009",
        "version": 4,
        "source_section": "3.3",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Place job administration metadata inside a registered optional field of a scratchpad value or in a separately linked Issue #1 record, and do not add sibling keys beside scratchpad in the array wrapper.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.03.03.010",
        "version": 3,
        "source_section": "3.3",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Preserve ascending array index order regardless of drafting order.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.03.03.011",
        "version": 1,
        "source_section": "3.3",
        "source_line_range": [
          78,
          89
        ],
        "modality": "prohibit",
        "imperative": "Do not require external queue or scratchpad issues.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.04.001",
        "version": 1,
        "source_section": "3.4",
        "source_line_range": [
          90,
          95
        ],
        "modality": "require",
        "imperative": "Preserve the original user instruction separately from its interpretation.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.04.002",
        "version": 1,
        "source_section": "3.4",
        "source_line_range": [
          90,
          95
        ],
        "modality": "require",
        "imperative": "Attribute revised scope and clarified instructions without silently replacing earlier versions.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.04.003",
        "version": 1,
        "source_section": "3.4",
        "source_line_range": [
          90,
          95
        ],
        "modality": "require",
        "imperative": "Re-fetch and check job identity and state before editing a comment.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.04.004",
        "version": 1,
        "source_section": "3.4",
        "source_line_range": [
          90,
          95
        ],
        "modality": "require",
        "imperative": "Reconcile conflicts before retrying concurrent writes.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.04.005",
        "version": 1,
        "source_section": "3.4",
        "source_line_range": [
          90,
          95
        ],
        "modality": "require",
        "imperative": "Read back every write and verify its effective content.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.04.006",
        "version": 1,
        "source_section": "3.4",
        "source_line_range": [
          90,
          95
        ],
        "modality": "prohibit",
        "imperative": "Do not overwrite another worker's intervening updates.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.04.007",
        "version": 1,
        "source_section": "3.4",
        "source_line_range": [
          90,
          95
        ],
        "modality": "prohibit",
        "imperative": "Do not treat write success alone as evidence of correct contents.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.04.008",
        "version": 1,
        "source_section": "3.4",
        "source_line_range": [
          90,
          95
        ],
        "modality": "prohibit",
        "imperative": "Do not publish secrets, tokens, private chain-of-thought, or sensitive information in public issue records.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.001",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Read back a newly created GitHub Issue comment and verify its permanent comment ID.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.002",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Read back an edited GitHub Issue comment and verify the complete current saved body.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.003",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Display the full untruncated saved body in the user-facing ChatGPT conversation as the closing step of every comment create or edit.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.004",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Display the verified permanent comment ID beside that complete body.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.005",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Preserve every character, key, value, whitespace, newline, and historical and current revision marker in the echo.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.006",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Display the complete current version after edits, not just changed fields.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.007",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Display each affected comment separately with its own verified ID.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.008",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Split an overlong ChatGPT display into contiguous ordered parts without dropping content.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.009",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Report explicitly if platform limits prevent a complete echo.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.010",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "require",
        "imperative": "Report unsuccessful writes or read-backs without presenting drafts as saved results.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.011",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "prohibit",
        "imperative": "Do not substitute an excerpt, link, summary, attachment, ellipsis, or length for full comment contents.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.012",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "prohibit",
        "imperative": "Do not truncate or rewrite the GitHub comment merely to shorten its ChatGPT echo.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.03.05.013",
        "version": 1,
        "source_section": "3.5",
        "source_line_range": [
          96,
          108
        ],
        "modality": "prohibit",
        "imperative": "Do not claim an echo is complete until the whole comment has actually been displayed.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.001",
        "version": 6,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Return every new RS record as one root JSON array of at least nineteen entries, each exactly {\"scratchpad\": <nonempty heterogeneous JSON object>}.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.01.001",
        "version": 6,
        "source_section": "4.1",
        "source_line_range": null,
        "modality": "allow",
        "imperative": "Permit any action listed in the linked canonical uses-and-input-types document within the scratchpad value of any array index.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.01.002",
        "version": 6,
        "source_section": "4.1",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not treat the linked uses-and-input-types catalog as a checklist, closed vocabulary, mandatory activity list, or prescribed allocation of actions to scratchpads.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.01.003",
        "version": 1,
        "source_section": "4.1",
        "source_line_range": [
          147,
          196
        ],
        "modality": "require",
        "imperative": "Verify current comment edit authorization independently of a stewardship claim.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.01.004",
        "version": 1,
        "source_section": "4.1",
        "source_line_range": [
          147,
          196
        ],
        "modality": "require",
        "imperative": "Verify actual results independently of any recorded tool call.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.01.005",
        "version": 1,
        "source_section": "4.1",
        "source_line_range": [
          147,
          196
        ],
        "modality": "require",
        "imperative": "Distinguish cryptic notes and speculation from verified claims.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.01.006",
        "version": 1,
        "source_section": "4.1",
        "source_line_range": [
          147,
          196
        ],
        "modality": "prohibit",
        "imperative": "Do not disclose restricted data, credentials, private internal chain-of-thought, or unsupported access claims.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.01.007",
        "version": 6,
        "source_section": "4.1",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Treat the permitted-use statements in the linked canonical document as one flat shuffled collection; their adjacency conveys no semantic relationship.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.01.008",
        "version": 6,
        "source_section": "4.1",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not infer parent actions, subtype hierarchy, category, or fixed scratchpad-index assignment from the order of the linked catalog.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.01.014",
        "version": 6,
        "source_section": "4.1",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Require the external catalog to specify expected action inputs using typed fields and preexisting named object types rather than assigning a data type to the action-description string.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.01.015",
        "version": 6,
        "source_section": "4.1",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not require an action's complete input contract to be populated when merely recording a partial observation; validate any present fields according to their declared types.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.002",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Arrange the single-key scratchpad wrappers by ascending zero-based array index.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.02.001",
        "version": 4,
        "source_section": "4.2",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Check each adjacent pair of scratchpad values in the root array for semantic independence.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.02.002",
        "version": 4,
        "source_section": "4.2",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Classify each adjacent pair of scratchpad values in the root array as paraphrase, appended expansion, or independent contribution.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.02.003",
        "version": 4,
        "source_section": "4.2",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Reject a new RS when any adjacent scratchpad values merely paraphrase or append to one another.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.02.005",
        "version": 1,
        "source_section": "4.2",
        "source_line_range": [
          197,
          212
        ],
        "modality": "require",
        "imperative": "Check that each contribution contains its own substantive proposition, observation, evidence, or action.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.02.006",
        "version": 1,
        "source_section": "4.2",
        "source_line_range": [
          197,
          212
        ],
        "modality": "require",
        "imperative": "Mark violations explicitly instead of rationalizing them.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.02.007",
        "version": 1,
        "source_section": "4.2",
        "source_line_range": [
          197,
          212
        ],
        "modality": "prohibit",
        "imperative": "Do not reject independent contributions merely because identifiers or necessary terms recur.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.03.001",
        "version": 6,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Read the linked canonical permitted-uses-and-input-types document and its named object type definitions before selecting typed fields in a new scratchpad record.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.03.002",
        "version": 2,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "allow",
        "imperative": "Allow the agent to choose any subset of registered keys independently within each scratchpad.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.03.003",
        "version": 2,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not require an unused registered key, an empty array, or a null placeholder merely because that key is registered.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.03.004",
        "version": 6,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Accept all 38 previously permitted-use field declarations and 21 observed legacy field declarations as available optional types from the linked canonical catalog.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.03.005",
        "version": 2,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Use the registered field type for each chosen key; validate the value of that key independently of all absent keys.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.03.006",
        "version": 2,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "allow",
        "imperative": "Allow additional suitable scratchpad keys when their types are appropriately defined without converting the catalog into a closed vocabulary.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.03.007",
        "version": 2,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Preserve all existing unannotated historical keys and value forms without migrating or invalidating earlier Issue #1 comments.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.03.008",
        "version": 2,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not describe registry declaration as deployed runtime enforcement unless the relevant validator is implemented and tested.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.03.009",
        "version": 6,
        "source_section": "4.3",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Consult the combined canonical catalog for both permitted actions and registered field/named-object definitions; use the older standalone registry only for historical revision comparison.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.04.001",
        "version": 2,
        "source_section": "4.4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Treat each JSON object as an open heterogeneous container whose keys may each have different value types.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.04.002",
        "version": 2,
        "source_section": "4.4",
        "source_line_range": null,
        "modality": "allow",
        "imperative": "Allow any selection of independently typed keys in an object without requiring its other registered fields.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.04.003",
        "version": 2,
        "source_section": "4.4",
        "source_line_range": null,
        "modality": "allow",
        "imperative": "Permit string, number, boolean, null, object, and array values where their individual declarations allow them.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.04.004",
        "version": 2,
        "source_section": "4.4",
        "source_line_range": null,
        "modality": "allow",
        "imperative": "Allow nested objects with additional appropriately typed keys and with omitted optional keys.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.04.005",
        "version": 2,
        "source_section": "4.4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Respect named object declarations and nested value types for fields that are actually present.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.04.006",
        "version": 2,
        "source_section": "4.4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Retain legacy primitive arrays without requiring conversion to named-object arrays.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.04.007",
        "version": 2,
        "source_section": "4.4",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not impose a fixed mapping between activity types and scratchpad positions.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.005",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Populate the scratchpad value in every array entry with nonempty substantive agent-authored fields; prohibit empty, primitive, null or array scratchpad values.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.05.001",
        "version": 1,
        "source_section": "4.5",
        "source_line_range": [
          543,
          548
        ],
        "modality": "require",
        "imperative": "Follow explicit user instructions, tool contracts, authorized repository scope, and higher-priority obligations.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.05.002",
        "version": 1,
        "source_section": "4.5",
        "source_line_range": [
          543,
          548
        ],
        "modality": "require",
        "imperative": "Fulfill the user's requested deliverable format and tests independently of the flexible RS nested schema.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.05.003",
        "version": 1,
        "source_section": "4.5",
        "source_line_range": [
          543,
          548
        ],
        "modality": "require",
        "imperative": "Ground verified facts and completed operations in observed evidence.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.05.004",
        "version": 1,
        "source_section": "4.5",
        "source_line_range": [
          543,
          548
        ],
        "modality": "require",
        "imperative": "Preserve material version changes or references to earlier snapshots.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.05.005",
        "version": 1,
        "source_section": "4.5",
        "source_line_range": [
          543,
          548
        ],
        "modality": "prohibit",
        "imperative": "Do not mistake exploratory notes for execution receipts.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.05.006",
        "version": 1,
        "source_section": "4.5",
        "source_line_range": [
          543,
          548
        ],
        "modality": "prohibit",
        "imperative": "Do not hide missing deliverables, unauthorized changes, or failures behind RS structure.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.04.006",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Make the substantive contents of the scratchpad value in each array element distinct from those of other array elements, not paraphrases or appended expansions.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.009",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Keep the zero-based array indices and the identical scratchpad wrapper key free of fixed semantic roles or topic assignments.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.011",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Record job metadata using an optional registered field inside a selected scratchpad value or a separately linked Issue #1 record; never add it as a sibling of the wrapper key.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.012",
        "imperative": "Require a minimum of nineteen scratchpad-wrapped array entries; do not require array lengths greater than nineteen to be prime.",
        "modality": "require",
        "version": 6,
        "source_section": "4",
        "source_line_range": null,
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.013",
        "imperative": "Allow additional single-key scratchpad-wrapped objects beyond nineteen entries without a maximum length.",
        "modality": "allow",
        "version": 6,
        "source_section": "4",
        "source_line_range": null,
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.014",
        "imperative": "Apply the nineteen-entry-minimum single-key scratchpad-wrapper array format to new RS records only; preserve historical three-named-object records, the unwrapped seven-entry Job #6 and the wrapped seven-entry Job #7 unchanged.",
        "modality": "require",
        "version": 6,
        "source_section": "4",
        "source_line_range": null,
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.015",
        "imperative": "Distinguish the root array of wrappers from arrays nested inside a scratchpad's selected typed values.",
        "modality": "prohibit",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.016",
        "imperative": "Treat the existing issue-comment JSON normalizer as syntax-only; do not claim it enforces the required scratchpad wrapper or typed content.",
        "modality": "require",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.017",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Require exactly one own property with the literal name scratchpad on each array element.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.018",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Require each scratchpad property to contain one nonempty open heterogeneous JSON object, whose fields are independently selected and typed.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.019",
        "version": 4,
        "source_section": "4",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not use type-annotated names such as scratchpad[object<...>] for the required wrapper property; its literal JSON key is scratchpad.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.020",
        "version": 2,
        "source_section": "4",
        "source_line_range": null,
        "modality": "allow",
        "imperative": "Permit one-entry-at-a-time draft arrays of lengths 1 through 18 during an active comment's progression. Such interim revisions are not completed RS records; only a completed array meeting the nineteen-entry minimum is an RS under the standing contract.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.04.021",
        "version": 1,
        "source_section": "4",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Recognize that the progress-tracking workflow validates JSON syntax, a single root array, and literal single-key nonempty scratchpad wrapper shape; it performs no semantic validation of independent content.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.05.001",
        "version": 1,
        "source_section": "5",
        "source_line_range": [
          549,
          552
        ],
        "modality": "require",
        "imperative": "Initiate periodic RS adjudication only when authorized.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.01.001",
        "version": 1,
        "source_section": "5.1",
        "source_line_range": [
          553,
          560
        ],
        "modality": "require",
        "imperative": "Review actual populated RS content and organization.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.01.003",
        "version": 3,
        "source_section": "5.1",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Evaluate whether every adjacent array transition contributes independent substantive content.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.05.01.004",
        "version": 1,
        "source_section": "5.1",
        "source_line_range": [
          553,
          560
        ],
        "modality": "require",
        "imperative": "Evaluate claim evidence, tool records, factual correctness, user boundaries, and outcomes.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.01.006",
        "version": 1,
        "source_section": "5.1",
        "source_line_range": [
          553,
          560
        ],
        "modality": "require",
        "imperative": "Assign exactly one overall adjudication label.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.01.008",
        "version": 3,
        "source_section": "5.1",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not penalize unusual topical placement at any scratchpad array index.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.05.01.009",
        "version": 3,
        "source_section": "5.1",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Keep retrospective adjudication findings separate from the original scratchpad array; do not introduce non-object array elements for review findings.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.05.002",
        "version": 1,
        "source_section": "5",
        "source_line_range": [
          549,
          552
        ],
        "modality": "prohibit",
        "imperative": "Do not invent a fixed review interval, per-task gate, reviewer, or automatic grading process.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.02.001",
        "version": 1,
        "source_section": "5.2",
        "source_line_range": [
          561,
          571
        ],
        "modality": "require",
        "imperative": "Choose adjudication labels only from excellent, adequate, fail, and extreme fail.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.02.002",
        "version": 1,
        "source_section": "5.2",
        "source_line_range": [
          561,
          571
        ],
        "modality": "require",
        "imperative": "Keep an output unadjudicated until an actual review occurs.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.02.003",
        "version": 1,
        "source_section": "5.2",
        "source_line_range": [
          561,
          571
        ],
        "modality": "prohibit",
        "imperative": "Do not assign a default grade or treat job completion as an adjudication.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.03.001",
        "version": 1,
        "source_section": "5.3",
        "source_line_range": [
          572,
          579
        ],
        "modality": "require",
        "imperative": "Preserve a snapshot or exact reference to the reviewed RS version.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.03.002",
        "version": 1,
        "source_section": "5.3",
        "source_line_range": [
          572,
          579
        ],
        "modality": "require",
        "imperative": "Record its Issue #1 IDs, reviewer identity, review time, grade, and evidence-based rationale.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.03.003",
        "version": 3,
        "source_section": "5.3",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Keep retrospective review findings separate from the originally reviewed scratchpad array.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.05.03.004",
        "version": 1,
        "source_section": "5.3",
        "source_line_range": [
          572,
          579
        ],
        "modality": "require",
        "imperative": "Preserve later reviews, disagreements, and corrections with an audit trail.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.05.03.005",
        "version": 1,
        "source_section": "5.3",
        "source_line_range": [
          572,
          579
        ],
        "modality": "prohibit",
        "imperative": "Do not treat retrospective adjudication as authorization to change repository content or jobs.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.001",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "require",
        "imperative": "Work from the user's objective and verified repository ground truth.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.002",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "require",
        "imperative": "Preserve the user's intended scope and abstraction level.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.003",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "prohibit",
        "imperative": "Do not impose unsolicited restrictions or architectural substitutions.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.004",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "require",
        "imperative": "Parallelize independent tasks where practical and retain their links to the parent Issue #1 job.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.005",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "require",
        "imperative": "Document consequential deviations, unresolved decisions, and failures.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.006",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "require",
        "imperative": "Stop all work immediately on a halt request without housekeeping writes.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.007",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "require",
        "imperative": "Seek authorization before making out-of-scope changes.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.008",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "require",
        "imperative": "Report unavailable tools and missing permissions accurately.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.06.009",
        "version": 1,
        "source_section": "6",
        "source_line_range": [
          580,
          589
        ],
        "modality": "prohibit",
        "imperative": "Do not claim asynchronous workflows are operational without proof.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.07.001",
        "version": 1,
        "source_section": "7",
        "source_line_range": [
          590,
          602
        ],
        "modality": "require",
        "imperative": "Verify source instructions and durable Issue #1 comment IDs.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.07.002",
        "version": 1,
        "source_section": "7",
        "source_line_range": [
          590,
          602
        ],
        "modality": "require",
        "imperative": "Record actual rather than optimistic job states.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.07.003",
        "version": 1,
        "source_section": "7",
        "source_line_range": [
          590,
          602
        ],
        "modality": "require",
        "imperative": "Keep enough scratchpad evidence for continuation by another agent.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.07.005",
        "version": 1,
        "source_section": "7",
        "source_line_range": [
          590,
          602
        ],
        "modality": "require",
        "imperative": "Verify claimed edits, tests, executions, and outputs against real evidence.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.07.006",
        "version": 1,
        "source_section": "7",
        "source_line_range": [
          590,
          602
        ],
        "modality": "require",
        "imperative": "Disclose remaining work and failures.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.07.007",
        "version": 1,
        "source_section": "7",
        "source_line_range": [
          590,
          602
        ],
        "modality": "require",
        "imperative": "Use stronger verification for repository mutations and multi-step jobs.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.07.008",
        "version": 1,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For each Issue #1 comment creation or edit, save deterministic measurements by comment ID and source revision under workspaces/issue1-diagnostics/comments/<comment_id>/, with index-level character lengths, key occurrences, and nested-array counts.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.009",
        "version": 1,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Write per-comment state and each unique diagnostic snapshot as independently valid JSON objects; store current state in state.json and immutable content-hash-named diagnostic objects in revisions/.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.010",
        "version": 2,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Advance progression only when a valid single root array adds exactly one new scratchpad entry without changing the previously accepted prefix; freeze accepted index tracking after index 18 while continuing syntax and diagnostic validation on later edits.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.011",
        "version": 1,
        "source_section": "7",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not rewrite an invalid JSON submission into a valid wrapper merely to normalize syntax; preserve the user comment unchanged and record the failure in the diagnostic JSON and workflow report.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.012",
        "version": 2,
        "source_section": "7",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not treat historical backfill or a complete first-submission array as evidence of sequential index progression; do not treat publication of a framing function as evidence that an external agent executed it.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.013",
        "version": 1,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Load the current versioned framing-controller profile and registered OP opcode catalog before selecting the next function on any eligible accepted incremental index.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.014",
        "version": 2,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "At each new three-index framing exercise (indices 1, 4, 7, 10, 13), randomly select one higher-order operation from SOLVER_LIFT or ABSTRACT with node:crypto.randomInt; if ABSTRACT, independently select one of its four explicit modes. Preserve that choice across all three slots while selecting atomic OP.01 operators independently for each eligible next index.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.015",
        "version": 2,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Persist the higher-order frame selection (operator opcode, optional abstraction mode, selection ordinal, source lineage, and input/output contract) once per frame in progression.frame_selections and each frame instruction, alongside the independently chosen atomic OP.01 operation and all ordered random draws.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.016",
        "version": 2,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Recover the full ordered random-draw sequence (higher-order operator, optional ABSTRACT mode, atomic operator) after retries or interrupted execution and reuse every persisted frame choice within that frame; do not reroll a higher-order operator on its second or third index.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.017",
        "version": 1,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Publish the next function in a separate source-linked Issue #1 controller comment while retaining previous instruction records in its history; validate the saved body and ignore controller-generated comments as input arrays.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.018",
        "version": 2,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Maintain five three-index framing exercises in indices 1–15, each with two distinguishable referents and a transformed output at its third slot. Apply a single selected higher-order operator to all three slots; preserve the chain of inner solver, enclosing solver, source attribution and invariants across the five levels.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.019",
        "version": 2,
        "source_section": "7",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not issue a new operation when source JSON or required framing content is structurally invalid, the accepted prefix changes, a complete array is imported without sequential edits, or the nineteenth tracked index has already been accepted. Do not silently establish a new framing choice mid-frame.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.07.020",
        "version": 3,
        "source_section": "7",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Treat every requested repository artifact, including README.md, identically: after a controlled nineteen-entry completion and verified publication contract, write the finalized content directly to the declared repository-relative path, replacing its prior content using the current blob SHA; verify the saved bytes and record a source-linked generic publication receipt. Do not create special candidate, comparison, or promotion gates based on filename.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.08.001",
        "version": 1,
        "source_section": "8",
        "source_line_range": [
          603,
          608
        ],
        "modality": "require",
        "imperative": "Inspect the current repository and Issue #1 rather than trusting historical bootstrap statements.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.08.002",
        "version": 1,
        "source_section": "8",
        "source_line_range": [
          603,
          608
        ],
        "modality": "require",
        "imperative": "Verify the actual intake-to-completion cycle before declaring it functional.",
        "condition": null,
        "source_archive_ref": "source_archive.original_blob_sha"
      },
      {
        "opcode": "IS.09.001",
        "version": 1,
        "source_section": "9",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Load original bytes and select the appropriate source extractor; default to opaque preservation for unsupported formats.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.09.002",
        "version": 1,
        "source_section": "9",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Compute canonical byte length and SHA-256, and retain exact original bytes in base64 before any transformation.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.09.003",
        "version": 1,
        "source_section": "9",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Extract source-linked records and assign record identities separately from functional opcodes.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.09.004",
        "version": 1,
        "source_section": "9",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Assign CAPTURE and EMIT; add only explicitly mapped, registry-valid intermediate operator opcodes.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.09.005",
        "version": 1,
        "source_section": "9",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Output one valid JSON object holding source, conversion metadata, and operation-coded records. Never replace or mutate the original document.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.09.006",
        "version": 1,
        "source_section": "9",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Verify byte-for-byte restoration, source digest, record coverage, pointers, original values, text fields, opcode validity, and step ordering.",
        "condition": "before claiming success",
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.09.007",
        "version": 1,
        "source_section": "9",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Refuse unrecognized opcodes, duplicated identities, invalid mappings, and loss of source provenance; report errors instead of silently dropping source material.",
        "condition": "on any conflict",
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.09.008",
        "version": 1,
        "source_section": "9",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Keep opcode classification separate from execution and semantic assessment; never claim that output instructions have been performed.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.001",
        "version": 2,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For controller-driven Issue #1 jobs, create a fresh source comment with exactly one substantive scratchpad entry and verify its permanent GitHub comment ID by reading back its entire body. Keep job registration and workflow artifacts outside the source comment.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.002",
        "version": 3,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "The agent handshake is limited to the existing Issue #1 scratchpad comment: one added entry per edit and readback of the same comment ID. The workflow alone validates, selects, publishes, and persists external state/instruction/diagnostic records; the agent does not write workflow metadata or acknowledgement artifacts.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.003",
        "version": 1,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "After creating or editing a source comment, poll its actual saved body and the matching per-comment state until the submitted revision is diagnosed and exactly one additional index is accepted; reject stale state, different comment ID, or a superseded source revision.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.004",
        "version": 2,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For each accepted index below 18, poll the source-linked controller reply and saved instruction receipt; verify source comment ID, accepted prefix, selected atomic opcode, higher-order frame identity and mode when applicable, source revision hash, and delivered state before writing the next substantive scratchpad.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.005",
        "version": 4,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "The worker edits only its substantive Issue #1 array comment. After the worker's edit, the workflow must automatically record its acceptance, submitted source revision SHA-256, target index, and previously issued operation as JSON under the per-comment workspace. No agent-written acknowledgement file or scratchpad field is required.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.006",
        "version": 4,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Apply the last published operation to create substantive content, append exactly one scratchpad object while preserving prior entries, and read back the edited comment. Poll for workflow confirmation. Do not submit an additional acknowledgement to GitHub or write any repository file.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.007",
        "version": 2,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Observe at most twelve polling cycles for each submitted comment revision, consulting saved comment, controller instruction and workflow-run evidence. Workflow failures or lack of progress stop the agent's comment edits; recording blockers in workspace is a workflow responsibility, not an extra agent action.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.008",
        "version": 1,
        "source_section": "10",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not advance to the next index until the previous revision and its next function have been independently read back and cross-checked; never create a second job comment as a recovery for a verified existing one.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.009",
        "version": 6,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "At index 18, the worker must SUBMIT the actual solution or deliverable compiled from indices 0–17, with final_output[string] containing the full response for a response task or a nonempty pointer/reference to a declared artifact for a file task, and full path/content in artifacts[array<object>] for declared file targets. After workflow acceptance, the agent verifies the final source digest, five frame selections, eighteen instructions, actual output and destination/receipt readback if publishing. The controller's completed status certifies structural progression only.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.010",
        "version": 2,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For a completed job requesting artifact output, use the same generic finalization rule for every authorized repository-relative path. Declare artifact_targets[array<object>] in the first nested preparatory scratchpad, each with path and source_context_id referencing an explicit_user context element; place corresponding UTF-8 {path,content} records in final outer index 18 under artifacts[array<object>]. The workflow replaces existing destination files in place and verifies their contents. No filename-specific exemptions or extra approval for README.md.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.011",
        "version": 5,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "The workflow, not the worker, owns state, diagnostics, instructions, run receipts and general artifact publication following completion. During controlled job execution the worker writes only its existing Issue #1 source comment and reads back workflow outputs; the workflow writes finalized artifacts to their declared paths after all general publication checks.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.012",
        "version": 7,
        "source_section": "10",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Never equate structural acceptance of nineteen entries with verified task success. The acting agent must independently judge whether the actual deliverable included at index 18 satisfies the original user instructions, content and format requirements, applicable tests and domain checks. For user-authorized files, require generic publication receipt and exact file readback before reporting success; otherwise report incomplete or blocked.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.10.013",
        "version": 2,
        "source_section": "10",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Commit implementation and workflow-maintenance changes directly on main, without PRs. During controller-driven job execution, the worker's ONLY write operation is creating or editing its substantive Issue #1 comment. All workspace and diagnostic writes are performed by the workflow itself.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.001",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For new 19-index runs, place one preparatory outer scratchpad at index 0 containing a nested array of exactly five separately wrapped nonempty scratchpad objects.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.002",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "In nested preparatory scratchpad 0, preserve the original instruction and explicitly separate context_elements, initial action-level opcode projection, minimalist and maximalist user intent, explicit intent, inferred beginning state, inferred desired post state and inferred change.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.003",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Represent surrounding conversation as an ordered context_elements array with stable IDs, source references, representation type, authority type, provenance and relevance. Distinguish explicit user statements, assistant statements, repository rules and inference.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.004",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Construct an immediate provisional initial_opcode_projection from the verbatim instruction and context_elements. Its steps must map bounded actions, not the whole instruction as one oversized command, to registered reusable OP opcodes with typed operands, source/context references, result IDs and dependencies.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.005",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Use nested preparatory scratchpad 1 to examine requirements and uncertainties, nested scratchpad 2 for adversarial review, nested scratchpad 3 for independently identifiable atomic actions and their dependencies, and nested scratchpad 4 for revised step-by-step opcode rendering with action coverage.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.006",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Map the preliminary opcode projection to the later atomistic decomposition, retaining explicit provenance and recording additions, deletions and revisions without altering the original instruction or confusing inference with authorization.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.007",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Perform five sequential reframing exercises at outer indices 1–15; each exercise consumes three scratchpads for reference A, reference B and a substantive enclosing narrative expansion. Maintain identity and attribution across frames.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.008",
        "version": 2,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Reserve the final three entries as a direct solution-production sequence: index 16 reconciles every preceding contribution and resolves conflicting requirements; index 17 compiles the reconciled material and action-level opcode lineage into a coherent actionable solution; index 18 produces the actual requested answer or complete artifact contents and records agent-performed checks. These entries must culminate in a deliverable, not merely a proposed solution or plan.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.009",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not treat CAPTURE/EMIT or one GENERATE/TRANSFORM opcode as sufficient decomposition of a multi-action instruction. Require separately traceable action IDs, individually bound opcode steps, operands, source pointers and explicit coverage.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.010",
        "version": 2,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "The controller structurally validates the mandatory preparatory, framing and final-entry fields. The acting agent—not the controller—must evaluate whether the compiled solution and deliverable are substantively correct, complete, useful, and faithful to the user's request; do not assert that source/field validation proves semantic compliance.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.011",
        "version": 1,
        "source_section": "11",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not insert controller acknowledgements, workflow metadata or status markers into the substantive scratchpad array; agent writes are confined to the existing Issue #1 source comment and all workflow state/output writes are workflow-owned.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.11.012",
        "version": 2,
        "source_section": "11",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Retain earlier completed 17-entry jobs and their historical candidate/receipt files as historical records without making them operative publication procedures. The 19-entry format and general artifact publisher apply prospectively and do not retroactively upgrade historical jobs.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.001",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Register SOLVER_LIFT (OP.02.001) and ABSTRACT (OP.02.002) as separate higher-order operators, distinguished from ordinary atomic OP.01.* functions. Use the versioned higher-order operator registry as their formal contract.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.002",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Select the higher-order operator once when entering a frame, with a uniform random draw between SOLVER_LIFT and ABSTRACT; choose one of CONTRACT, IMPLEMENTATION, CONSTRUCT, GENERAL only if ABSTRACT was selected, using a separate uniform draw.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.003",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Bind the one selected frame operator and optional mode to each of its three scratchpads, with reference A describing the inner solver, reference B describing the enclosing target, and the third entry containing the transformed solver or representation.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.004",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For SOLVER_LIFT, the enclosing solver must take the inner solver's problem, method, assumptions, intermediate results, limitations and provenance as its subject and input. Do not substitute a paraphrase of the original user task for the new solver's input.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.005",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For ABSTRACT, choose and preserve exactly one mode: CONTRACT for obligations/interfaces/invariants, IMPLEMENTATION for a nonexecuting model of mechanisms and dependencies, CONSTRUCT for structural elements/relationships, or GENERAL for cross-instance properties and limits.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.006",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Every completed third-slot framing result must identify preserved properties, intentionally suppressed details, introduced assumptions, source mappings, and a distinctly framed next-solver input. The selected mode must supply its required output fields.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.007",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Keep the higher-order selection stable for the full three-index frame and persist all five frame selections in progression.frame_selections. Each subsequent frame may independently select its new higher-order operator, retaining ancestry to the preceding frame and original instruction.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.008",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Preserve atomic OP.01 choice as a separately selected supporting function per index. An atomic operation cannot replace the selected higher-order framing operation, nor can naming an opcode count as its execution.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.009",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Validate the structural presence of source-linked inner-solver inputs, enclosing targets and the operator-specific third-slot result before accepting frame indices. A structural validator cannot certify reasoning depth, semantic correctness or implementation execution.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.010",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not add workflow acknowledgements, controller IDs or operational receipt metadata to substantive scratchpads. All operational frame selection and replay state remains workflow-owned; the agent edits only its Issue #1 source comment during a job.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.12.011",
        "version": 1,
        "source_section": "12",
        "source_line_range": null,
        "modality": "require",
        "imperative": "The final reconciliation stage must account for all five higher-order frame operators, their abstraction modes, retained and omitted properties, and traceable source mappings before an agent claims a synthesized output addresses the original instruction.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.001",
        "version": 2,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Use one mandatory agent–workflow handshake from intake and job creation through the final user-requested deliverable at index 18 and verification of its saved/published result. The final three entries ARE the solution process: reconcile at 16, compile at 17, deliver at 18. No separate content-generation stage follows the nineteenth entry; subsequent readbacks verify delivery.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.002",
        "version": 1,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Before creating a job, read README.md, root and applicable nested AGENTS.md, Issue #1 rules, current controller/profile/type catalog, and any previous job with the same instruction, source, or nonce. Establish intended output artifacts, explicit authorization and success criteria, and deduplicate without altering historical completed jobs.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.003",
        "version": 1,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Start the handshake by creating exactly one new Issue #1 source comment containing a single root-array scratchpad entry at index 0 and its five nested preparatory scratchpads. Verify the permanent comment ID, author, complete saved body, correct target declarations, and initial source SHA-256 before relying on any workflow event.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.004",
        "version": 1,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Require the workflow to acknowledge index 0 with a persisted state.json acceptance, an immutable diagnostic revision, and a source-linked controller instruction and instruction receipt for index 1. Compare their source comment ID, source revision hash, accepted_entries=1, next_index=1 and delivered status before advancing.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.005",
        "version": 1,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For every subsequent tracked index i (1 through 18), treat the next index as a gated handshake: independently read the saved source and persisted prior state, consume the exact published controller instruction for i and its immutable receipt, produce a distinct substantive scratchpad, append only that entry to the same source comment, then read back the resulting comment body.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.006",
        "version": 1,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "After each edit, poll only the same comment's persisted state, immutable diagnostic revision, controller reply, and instruction receipt until the workflow accepts exactly one new entry and confirms the submitted SHA-256, the unchanged accepted prefix, correct comment identity, instruction lineage, and next target. Never infer acknowledgement from a successful API submission or an unrelated workflow run.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.007",
        "version": 1,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Between accepted indices 1 and 18, verify that the controller has published precisely the next instruction for the source-linked revision, including the selected atomic opcode, higher-order frame identity and mode when applicable, ordered random draws, persisted frame choice, and readback of the immutable instruction JSON. Preserve all accepted entries without modification.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.008",
        "version": 2,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "Preserve the five controller-guided three-slot frames at indices 1–15. For the final three entries, the agent reconciles all contributions at index 16, compiles them into a usable solution at index 17, and produces the actual user-requested answer or full artifact at index 18. Every final result must retain source lineage from initial preparation through the five frames.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.009",
        "version": 1,
        "source_section": "13",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not jump indices, batch several future entries into one revision, create a new source comment to bypass an existing blocked comment, reroll persisted operations, write agent-authored workflow acknowledgements, or replace workflow receipt verification with narrative assertions.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.010",
        "version": 2,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "At index 18, the agent must use the preceding reconciled and compiled solution to actually deliver the requested result, not merely promise a result or supply an artifact plan. Independently verify its semantic and format coverage against the original instructions; the controller acknowledges structure/progression but cannot determine whether the task's content is correct. After accepted index 18, only readback/publication verification and reporting remain.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.011",
        "version": 2,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For a file-producing task, put the complete UTF-8 artifact in index-18 artifacts[array<object>] with the exact previously declared path, and perform all applicable domain checks (including real opcode-document adapter validation when required). The workflow then performs its generic publication operation. The agent independently checks the actual published bytes/hash and source-linked receipt; this verifies the deliverable already produced at index 18.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.012",
        "version": 2,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "For a response-only or otherwise non-repository task, produce the complete requested answer or substantive outcome in index-18 final_output[string], and independently evaluate it using task-specific criteria and externally inspectable evidence where applicable. A placeholder, proposal, TODO list, or declaration of future execution is not a completed deliverable.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.013",
        "version": 2,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "If the result cannot be substantively completed by index 18, do not misrepresent a plan or an unverified result as a completed deliverable. The currently deployed controller has no verified extended handshake beyond index 18; preserve the accepted source, report incomplete/blocked with missing work, and use a separately documented/tested continuation only if later authorized and implemented.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.014",
        "version": 1,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "On a failed, stale, missing or contradictory acknowledgement, bound polling to the documented limit, preserve the last verified revision and controller decisions, inspect the real workflow failure, and report blocked with the exact comment ID, accepted index, missing evidence and safe next action; do not silently retry with a different comment.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.015",
        "version": 2,
        "source_section": "13",
        "source_line_range": null,
        "modality": "require",
        "imperative": "After the substantive deliverable is produced at index 18, independently reread the persisted progression and the final answer or published files/receipts. Report permanent source comment ID, accepted count, controller status, actual output location or answer, relevant hashes, performed tests and any failure. This terminal readback verifies the deliverable; it does not create or redefine the solution.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      },
      {
        "opcode": "IS.13.016",
        "version": 2,
        "source_section": "13",
        "source_line_range": null,
        "modality": "prohibit",
        "imperative": "Do not claim that the deterministic controller is capable of judging answer quality, source interpretation, semantic task success, or artifact usefulness. Such evaluation belongs to the acting agent and domain-specific validation. Controller acceptance certifies only configured structural/index/provenance conditions; reports must distinguish these from deliverable success.",
        "condition": null,
        "source_archive_ref": "source_archive.current_amendment"
      }
    ],
    "reference_data": {
      "sections": [
        {
          "id": "1",
          "title": "Purpose and scope",
          "start_line": 5,
          "end_line": 17,
          "kind": "archived_source_reference"
        },
        {
          "id": "2",
          "title": "Read-before-operation rule",
          "start_line": 18,
          "end_line": 25,
          "kind": "archived_source_reference"
        },
        {
          "id": "3",
          "title": "Issue #1 is the unified operating surface",
          "start_line": 26,
          "end_line": 35,
          "kind": "archived_source_reference"
        },
        {
          "id": "3.1",
          "title": "Job identity",
          "start_line": 36,
          "end_line": 48,
          "kind": "archived_source_reference"
        },
        {
          "id": "3.2",
          "title": "Suggested working-record structure",
          "start_line": 49,
          "end_line": 77,
          "kind": "archived_source_reference"
        },
        {
          "id": "3.3",
          "title": "State and progression",
          "start_line": 78,
          "end_line": 89,
          "kind": "archived_source_reference"
        },
        {
          "id": "3.4",
          "title": "Preservation and concurrency",
          "start_line": 90,
          "end_line": 95,
          "kind": "archived_source_reference"
        },
        {
          "id": "3.5",
          "title": "Mandatory closing step after creating or editing a comment: full ChatGPT echo",
          "start_line": 96,
          "end_line": 108,
          "kind": "archived_source_reference"
        },
        {
          "id": "4",
          "title": "Return Schema (RS): root array with at least seventeen scratchpad-wrapped objects",
          "start_line": null,
          "end_line": null,
          "kind": "current_instruction"
        },
        {
          "id": "4.1",
          "title": "Permitted scratchpad uses and expected input types (linked canonical catalog)",
          "start_line": null,
          "end_line": null,
          "kind": "current_instruction"
        },
        {
          "id": "4.2",
          "title": "Independent contributions across adjacent scratchpad array objects",
          "start_line": null,
          "end_line": null,
          "kind": "current_instruction"
        },
        {
          "id": "4.3",
          "title": "Optional registered field types (linked canonical catalog)",
          "start_line": null,
          "end_line": null,
          "kind": "current_instruction"
        },
        {
          "id": "4.4",
          "title": "Open heterogeneous object members",
          "start_line": null,
          "end_line": null,
          "kind": "current_instruction"
        },
        {
          "id": "4.5",
          "title": "Precedence and fidelity",
          "start_line": 543,
          "end_line": 548,
          "kind": "archived_source_reference"
        },
        {
          "id": "5",
          "title": "Periodic adjudication of RS designs and populated outputs",
          "start_line": 549,
          "end_line": 552,
          "kind": "archived_source_reference"
        },
        {
          "id": "5.1",
          "title": "What is reviewed",
          "start_line": 553,
          "end_line": 560,
          "kind": "archived_source_reference"
        },
        {
          "id": "5.2",
          "title": "Allowed labels",
          "start_line": 561,
          "end_line": 571,
          "kind": "archived_source_reference"
        },
        {
          "id": "5.3",
          "title": "Review record and provenance",
          "start_line": 572,
          "end_line": 579,
          "kind": "archived_source_reference"
        },
        {
          "id": "6",
          "title": "Agent conduct and scope",
          "start_line": 580,
          "end_line": 589,
          "kind": "archived_source_reference"
        },
        {
          "id": "7",
          "title": "Operational acceptance checks",
          "start_line": 590,
          "end_line": 602,
          "kind": "archived_source_reference"
        },
        {
          "id": "8",
          "title": "Bootstrap status",
          "start_line": 603,
          "end_line": 608,
          "kind": "archived_source_reference"
        },
        {
          "id": "9",
          "title": "Document-to-JSON procedural opcode adapter",
          "start_line": null,
          "end_line": null,
          "kind": "current_normative_extension"
        },
        {
          "id": "10",
          "title": "Agent–workflow framing handshake and bounded indexed polling",
          "start_line": null,
          "end_line": null,
          "kind": "current_normative_extension"
        },
        {
          "id": "11",
          "title": "Contextual preparation, five reframings, and atomic opcode reconciliation",
          "start_line": null,
          "end_line": null,
          "kind": "current_normative_extension"
        },
        {
          "id": "12",
          "title": "Higher-order SOLVER_LIFT and ABSTRACT framing, mode selection and lineage",
          "start_line": null,
          "end_line": null,
          "kind": "current_normative_extension"
        },
        {
          "id": "13",
          "title": "Mandatory end-to-end job lifecycle handshake and continuation beyond minimum RS",
          "start_line": null,
          "end_line": null,
          "kind": "current_normative_extension"
        }
      ],
      "suggested_record_template": "<!-- issuescratch:job:v2 -->\n# Job: <concise description>\n\nSource: Issue #1 comment <source_comment_id>\nJob: Issue #1 comment <job_comment_id, once known>\nNonce: <stable nonce, if used>\nState: pending | active | blocked | completed | failed | cancelled\n\n## Instruction and scope\n<faithful interpretation; link to original instruction>\n\n## Scratchpad return array\n<one root JSON array with at least seventeen entries starting at index 0; each entry is {\"scratchpad\": {<independently selected typed fields>}}; the outer wrapper contains only the literal key scratchpad and its value is a nonempty heterogeneous object; no unused registered fields are required>\n\n## Verification and receipt\n<observed outcomes, checks performed, failures, links, remaining work>",
      "allowed_RS_transition_classifications": [
        "paraphrase",
        "appended expansion",
        "independent contribution"
      ],
      "adjudication_labels": [
        "excellent",
        "adequate",
        "fail",
        "extreme fail"
      ],
      "job_states": [
        "pending",
        "active",
        "blocked",
        "completed",
        "failed",
        "cancelled"
      ],
      "registered_scratchpad_fields": {
        "version": "issuescratch.scratchpad-permitted-uses-and-input-types",
        "path": "src/types/issuescratch.permitted-uses-and-input-types.v1.json",
        "blob_sha": "a335225df90e356832cdc0aacabad564899245d9",
        "git_url": "https://github.com/BestNameYet/IssueScratch/blob/main/src/types/issuescratch.permitted-uses-and-input-types.v1.json",
        "declared_fields": 59,
        "permitted_use_fields": 38,
        "observed_existing_fields": 21,
        "named_object_types": 68,
        "registered_keys_optional": true,
        "may_omit_any_registered_key": true,
        "object_member_types_independent": true,
        "legacy_records_preserved": true,
        "enforcement_state": "The type registry and AGENTS.md specify a required wrapper, but the deployed comment-normalization workflow verifies JSON syntax only.",
        "root_type": "array",
        "minimum_items": 19,
        "item_type": "single_key_wrapper_object",
        "zero_based_indices": true,
        "no_maximum_items": true,
        "prime_total_not_required": true,
        "wrapper_key": "scratchpad",
        "wrapper_additional_keys_allowed": false,
        "wrapper_value_type": "open_heterogeneous_json_object",
        "registry_location": "reference_data.registered_scratchpad_fields",
        "named_type_definitions_location": "reference_data.named_object_types",
        "combined_catalog": true
      },
      "scratchpad_array": {
        "root_type": "array",
        "minimum_items": 19,
        "first_index": 0,
        "maximum_items": null,
        "item_type": "single_key_object_wrapper",
        "item_minimum_fields": 1,
        "item_keys_optional": false,
        "selection": "Choose any applicable registered typed fields inside each scratchpad value. The outer wrapper must have exactly the literal key scratchpad.",
        "array_length_prime_requirement": false,
        "legacy_record_compatibility": "Earlier three-named-object records, the unwrapped seven-entry Job #6 and the wrapped seven-entry Job #7 remain unchanged as historical records.",
        "item_required_key": "scratchpad",
        "item_additional_keys_allowed": false,
        "item_value_type": "open_heterogeneous_json_object"
      },
      "activity_examples_count": 152,
      "permitted_uses_and_input_types": {
        "document_type": "issuescratch.scratchpad-permitted-uses-and-input-types",
        "format_version": "1.1.0",
        "path": "src/types/issuescratch.permitted-uses-and-input-types.v1.json",
        "blob_sha": "03a624ae2cbc8fa84ce95aa6a98af1060a50f249",
        "git_url": "https://github.com/BestNameYet/IssueScratch/blob/main/src/types/issuescratch.permitted-uses-and-input-types.v1.json",
        "use_cases": 152,
        "use_case_expected_inputs_typed": 152,
        "registered_scratchpad_fields": 59,
        "named_object_types": 68,
        "example_scratchpads": 17,
        "location_of_actions": "reference_data.permitted_use_cases",
        "location_of_named_types": "reference_data.named_object_types",
        "location_of_field_registry": "reference_data.registered_scratchpad_fields",
        "precedence": "Authoritative use and input-type catalog; AGENTS.md remains authoritative on workflow, safeguards, and scratchpad array shape."
      },
      "comment_diagnostics": {
        "schema_state": "issuescratch.comment-state.v1",
        "schema_revision": "issuescratch.comment-diagnostics.v1",
        "workspace_root": "workspaces/issue1-diagnostics/comments",
        "state_path_pattern": "workspaces/issue1-diagnostics/comments/<comment_id>/state.json",
        "revision_path_pattern": "workspaces/issue1-diagnostics/comments/<comment_id>/revisions/<sha256-of-raw-comment>.json",
        "workflow_path": ".github/workflows/issue1-json-validator.yml",
        "workflow_blob_sha": "5cc1e0ff10a6f49b52e5e5a9f18fe7ab6f6c9dae",
        "implementation_path": "src/issue1-diagnostics.js",
        "implementation_blob_sha": "98371f51c09e56b622ccf9784fd2e1461eaffb90",
        "source_events": [
          "issue_comment.created",
          "issue_comment.edited"
        ],
        "acceptance": "Exactly one new wrapped scratchpad entry per accepted edit, from index 0 through index 18, without changing earlier accepted content.",
        "after_index_16": "Historical 17-entry runs remain unchanged. New runs freeze at index 18 after 19 accepted entries, while JSON and diagnostics continue.",
        "invalid_json": "Record in saved JSON state and revision object without altering user-authored comment.",
        "measurements": [
          "raw source characters",
          "raw bytes",
          "root array length",
          "total nested arrays",
          "per-index serialized JSON characters",
          "per-index string-value characters",
          "per-index keys and recursive key occurrences",
          "per-key value JSON/text character totals",
          "per-index contribution in basis points"
        ],
        "existing_records": "Workflow dispatch/push scans record preexisting comments as historical snapshots; they are not claimed as sequentially accepted progression.",
        "function_dispatch_state": "Use the versioned 1+15+3 framing-controller profile and randomly select a substantive registered opcode for next indices 1 through 18; publishing does not constitute autonomous agent execution.",
        "root_objects_required": true,
        "semantic_adjudication": false,
        "after_index_18": "Freeze accepted entries at 19; continue structural JSON validation and revision diagnostics."
      },
      "document_opcode_adapter": {
        "contract_path": "src/types/issuescratch.opcode-adapter-contract.v1.json",
        "registry_path": "src/types/issuescratch.operation-registry.v1.json",
        "registry_blob_sha": "233406589704b8b8a6ad8d1a749606867a2856c3",
        "adapter_path": "src/opcode-document-adapter.js",
        "tests_path": "src/opcode-document-adapter.test.js",
        "first_source": "experiments/general-purpose-job-prompts.v1.json",
        "first_mapping_profile": "experiments/general-purpose-job-opcode-map.v1.json",
        "first_converted_output": "experiments/general-purpose-job-prompts.opcoded.v1.json",
        "converted_output_sha": "6ded15c09b8959e15280e5abcf184072f4099e63",
        "operation_opcode_namespace": "OP.01",
        "procedure_opcode_namespace": "IS",
        "operation_count": 16,
        "record_identity_separate_from_opcode": true,
        "lossless_exact_source_bytes": true,
        "semantic_inference_by_default": false,
        "specialized_operations_require_explicit_mapping": true,
        "binary_files_preserved_without_implicit_parsing": true,
        "output_is_json_object_not_scratchpad_array": true,
        "execution_receipt_separate_from_declaration": true
      },
      "framing_controller": {
        "profile_path": "src/types/issuescratch.framing-controller.v1.json",
        "profile_sha": "124c2946e737160fd6e10157e2dc152581a7675d",
        "profile_version": "2.1.1",
        "implementation_path": "src/framing-controller.js",
        "implementation_sha": "d889b283fc0591362f4a7a6ca8e407a8d152f605",
        "tests_path": "src/framing-controller.test.js",
        "workflow_path": ".github/workflows/issue1-json-validator.yml",
        "workflow_sha": "11e220634dcabeeb3ebfdfc056f86edff77e899b",
        "random_function_registry": "src/types/issuescratch.operation-registry.v1.json",
        "random_pool_size": 14,
        "random_selection": "node:crypto.randomInt",
        "reference_slots": 15,
        "unrestricted_slots": 0,
        "persistent_instruction_pattern": "workspaces/issue1-diagnostics/comments/<comment_id>/instructions/<zero-padded-index>.json",
        "persistent_state_pattern": "workspaces/issue1-diagnostics/comments/<comment_id>/state.json",
        "controller_comment_schema": "issuescratch.frame-control-comment.v1",
        "live_probe_source_comment": 6548135349,
        "live_probe_controller_comment": 6548137149,
        "live_probe_verified_indices": [
          0,
          1
        ],
        "live_probe_workflow_run_ids": [
          41234676639,
          41234726263
        ],
        "execution_scope": "Controller selects, validates structure and index progression, and publishes source-linked instructions; the agent authors a deliverable at index 18 and performs semantic verification independently.",
        "preparatory_outer_index": 0,
        "preparatory_nested_scratchpads": 5,
        "framing_outer_indices": "1–15 (five sets of three)",
        "reconciliation_outer_indices": [
          16,
          17,
          18
        ],
        "initial_contextual_opcode_projection": true,
        "atomic_opcode_steps": true,
        "terminal_index": 18,
        "expected_instruction_count": 18,
        "historical_live_probe_verified_indices": [
          0,
          1
        ],
        "prior_17_entry_experiment": "historical; retained without modification",
        "latest_live_probe_source_comment": 6548995651,
        "latest_live_probe_controller_comment": 6548997266,
        "latest_live_probe_accepted_indices": [
          0,
          1,
          2,
          3
        ],
        "latest_live_probe_verified_next_function_indices": [
          1,
          2,
          3,
          4
        ],
        "latest_live_probe_workflow_run_ids": [
          41241007593,
          41241048287,
          41241090538,
          41241155327
        ],
        "latest_live_probe_scope": "One complete three-index first frame, with ABSTRACT / IMPLEMENTATION chosen once and retained, plus new second-frame selection; 19-index completion not claimed.",
        "verified_on_main": true,
        "test_suite_run": 41241263066,
        "test_count": 43,
        "frame_count": 5,
        "higher_order_frame_selection_count": 5,
        "higher_order_registry_path": "src/types/issuescratch.higher-order-operators.v1.json",
        "higher_order_mode_count": 4,
        "frame_selections_state_key": "progression.frame_selections",
        "frame_input_validation": true,
        "frame_output_validation": true,
        "historical_17_entry_readme_comment": 6547874447
      },
      "agent_workflow_handshake": {
        "schema": "issuescratch.agent-workflow-handshake.v1.4",
        "job_scope": "Issue #1 source comment",
        "controller_profile": "src/types/issuescratch.framing-controller.v1.json",
        "workflow_path": ".github/workflows/issue1-json-validator.yml",
        "source_of_truth": "GitHub-retrieved comment body + per-comment state.json + immutable instruction JSON + source-linked controller reply",
        "index_sequence": "Index 0 prepares, indices 1–15 frame, index 16 reconciles all preceding work, index 17 compiles the solution, and index 18 supplies the actual answer or artifact contents. Controller source-linked acknowledgments gate each revision; following acceptance the agent reads back the published result.",
        "ack_keys": [],
        "max_poll_cycles_per_revision": 12,
        "poll_checks": [
          "same GitHub comment ID",
          "current source revision SHA-256",
          "progression.accepted_entries incremented by one",
          "controller status delivered and instruction targets next index",
          "workflow run conclusion if identifiable"
        ],
        "terminal_acceptance": [
          "19 sequentially accepted revisions and saved source/hash lineage",
          "five higher-order selections and eighteen source-linked instruction receipts",
          "index 16 reconciliation and index 17 coherent compiled solution",
          "agent-authored actual requested deliverable in index 18 (not a plan or placeholder)",
          "acting agent independently tests semantic/request coverage and relevant content/format validations",
          "where requested, exact published artifact content and generic publication receipt read back",
          "completion claimed only for observed delivered result, with the controller's structural acceptance reported separately"
        ],
        "failure": "On 12 bounded polling cycles, stale/failed acknowledgement, unsupported extension, missing result or unverified publication, stop as blocked, preserve current comment and receipts, report exact missing evidence; do not submit another comment.",
        "comment_echo_requirement": "Existing IS.03.05 obligations unchanged, but full echoes may be limited by the UI; record any inability explicitly.",
        "acknowledgement_location": "per-comment revision diagnostic JSON and state.json history",
        "acknowledgement_type": "automatic workflow-derived acceptance receipt, not worker authored",
        "source_comment_contract": "Only substantive, single-key scratchpad wrappers. No job IDs, controller acknowledgements, hashes, opcodes, metadata fields, or workflow markers required in the comment.",
        "job_registration": "Job registration is independent from generic output; publisher reads explicit source-linked artifact targets from the initial preparation, never inferred from prose or filename.",
        "acknowledgement_timing": "The workflow records the accepted revision after the comment edit event; no explicit agent acknowledgement.",
        "acknowledgement_protocol": [
          "agent edits exactly one substantive scratchpad in Issue #1 source comment",
          "agent re-reads saved comment ID and body",
          "workflow validates and persists state, revision diagnostics, operation and response",
          "agent reads state and controller output before next edit"
        ],
        "acceptance_is_separate_from_submission": true,
        "repository_write_branch": "main",
        "pull_requests_allowed": false,
        "agent_writable_surfaces": [
          "Issue #1 source comment only"
        ],
        "workflow_writable_surfaces": [
          "workspaces/",
          "Issue #1 controller reply",
          "user-authorized artifact paths declared in the source, after completed verification"
        ],
        "agent_workspace_writes_allowed": false,
        "agent_workflow_file_writes_allowed_during_job": false,
        "scope": "Mandatory source comment handshake from index 0 through index 18, culminating in an agent-authored deliverable. Controller acknowledgments are structural; the agent tests the actual index-18 result. Publication/receipt readback verifies the result, not a later generation stage.",
        "minimum_entries": 19,
        "default_current_terminal_index": 18,
        "tracked_extension_implemented": false,
        "entries_beyond_19": "Allowed in conceptual RS contract; controller cannot currently accept/acknowledge index >= 19. Do not continue unacknowledged or assert task completion.",
        "lifecycle_handshake_ref": "reference_data.job_lifecycle_handshake"
      },
      "preparation_and_reconciliation": {
        "profile_path": "src/types/issuescratch.framing-controller.v1.json",
        "profile_version": "1.6.0",
        "outer_minimum_items": 19,
        "outer_preparation_index": 0,
        "nested_preparation_count": 5,
        "nested_preparation_roles": [
          "contextual_instruction_and_initial_opcode_projection",
          "requirements_rumination",
          "adversarial_review",
          "atomistic_action_decomposition",
          "atomic_opcode_rendering"
        ],
        "context_field": "context_elements[array<object>]",
        "initial_opcode_field": "initial_opcode_projection[array<object>]",
        "framing_indices": {
          "start": 1,
          "end": 15,
          "exercises": 5,
          "entries_per_exercise": 3
        },
        "reconciliation_indices": [
          16,
          17,
          18
        ],
        "terminal_index": 18,
        "minimum_atomic_op_steps": 2,
        "historical_runs_preserved": true,
        "workflow_artifacts_in_agent_comment": false,
        "reconciliation_roles": [
          "16:reconcile",
          "17:compile",
          "18:deliver"
        ],
        "final_deliverable_index": 18,
        "agent_verifies_semantic_deliverable": true
      },
      "higher_order_framing": {
        "registry_path": "src/types/issuescratch.higher-order-operators.v1.json",
        "registry_blob_sha": "79e993b7e852461bac99bc3a4b7b5b25cf8d1ed0",
        "operator_ids": [
          "OP.02.001",
          "OP.02.002"
        ],
        "mode_ids": [
          "CONTRACT",
          "IMPLEMENTATION",
          "CONSTRUCT",
          "GENERAL"
        ],
        "selection_indices": [
          1,
          4,
          7,
          10,
          13
        ],
        "operator_random_method": "crypto.randomInt(2) once per 3-index frame",
        "conditional_abstract_mode_random_method": "crypto.randomInt(4) when ABSTRACT chosen",
        "atomic_function_registry": "src/types/issuescratch.operation-registry.v1.json",
        "atomic_registry_blob_sha": "233406589704b8b8a6ad8d1a749606867a2856c3",
        "atomic_random_method": "crypto.randomInt(14) per target index",
        "persisted_frame_state_path": "progression.frame_selections",
        "persisted_draw_receipt": "next_function.random_selection.draws",
        "substantive_input_fields": [
          "solver_or_subject[object]",
          "enclosing_target[object]"
        ],
        "substantive_output_field": "higher_order_result[object]",
        "reframing_count": 5,
        "scope": "indices 1..15, three entries per frame",
        "validation": "structural only, semantic agent execution unverified",
        "no_worker_workspace_writes": true,
        "no_worker_workflow_writes": true,
        "main_branch_only": true
      },
      "artifact_publication": {
        "schema": "issuescratch.generic-artifact-publication.v1",
        "implementation_path": "src/artifact-publisher.js",
        "tests_path": "src/artifact-publisher.test.js",
        "workflow_path": ".github/workflows/issue1-json-validator.yml",
        "authorizing_actor": "repository owner, source comment author",
        "authorization": "artifact_targets declared in nested preparation index 0 with paths and source_context_id referencing explicit_user context",
        "output": "artifacts[array<object>] at outer index 18; UTF-8 path/content records matching declared paths",
        "preconditions": [
          "19 consecutive accepted revisions",
          "5 saved higher-order frame selections",
          "18 controller instructions matched to immutable instruction receipts",
          "current source digest and controller completion"
        ],
        "publication": "Use a single generic create-or-update GitHub file operation with optimistic blob SHA concurrency; any existing artifact is replaced directly regardless of filename",
        "receipt_pattern": "workspaces/issue1-diagnostics/comments/<comment_id>/published-artifacts/<source-sha256>.json",
        "receipt_schema": "issuescratch.artifact-publication-receipt.v1",
        "no_special_readme_rule": true,
        "historical_experiments": "Retain old candidate files and receipts only as historical evidence; no new README-only generation or comparison steps"
      },
      "job_lifecycle_handshake": {
        "schema": "issuescratch.job-lifecycle-handshake.v1.1",
        "mandatory": true,
        "scope": "Each controlled Issue #1 job culminates in substantive user-requested deliverable at index 18; subsequent output readback is verification, never a separate solution-generation stage.",
        "minimum_outer_entries": 19,
        "phases": [
          {
            "phase": "preflight",
            "worker_action": "Read instructions and current sources; deduplicate; record user-authorized output, validators and task success criteria",
            "workflow_evidence": "none required before source creation",
            "advance": "only if a fresh job is authorized and no matching active source job exists"
          },
          {
            "phase": "source_creation",
            "worker_action": "Create single source comment with one index-0 entry and five nested preparatory scratchpads; read back comment ID, author, full JSON and hash",
            "workflow_evidence": "immutable GitHub source comment",
            "advance": "only after source identity is independently verified"
          },
          {
            "phase": "first_acceptance",
            "worker_action": "Inspect saved state and instruction 01 and controller reply",
            "workflow_evidence": "accepted_entries=1, next_index=1, matching source hash, persisted index-1 instruction and delivered status",
            "advance": "only when all sources agree"
          },
          {
            "phase": "tracked_loop",
            "worker_action": "For i=1..18, apply exactly the published instruction, append one distinct substantive entry without mutating prefix, read back source, then poll state, revision and next instruction/receipt",
            "workflow_evidence": "one accepted transition per edit; source hash, prefix, selected operation and frame persisted; next index verified",
            "advance": "only after independent acknowledgement of the current index and delivered next instruction"
          },
          {
            "phase": "solution_reconciliation_and_compilation",
            "worker_action": "At index 16 reconcile preceding work; at index 17 compile a coherent working solution; at index 18 submit the complete requested answer or file bytes. Perform agent-owned content and requirement checks while composing these entries.",
            "workflow_evidence": "19 accepted revisions, five framing selections, eighteen immutable controller instructions, terminal digest; structural receipt only",
            "advance": "only after the agent produced a concrete deliverable at index 18; controller acceptance alone is not a semantic success check"
          },
          {
            "phase": "delivery_verification",
            "worker_action": "Independently evaluate the actual index-18 deliverable for the original user's requested content, format, access and correctness; inspect published destination bytes and receipts for files.",
            "workflow_evidence": "workflow-owned publication receipt and destination readback where applicable; task-specific evidence independently inspected by agent",
            "advance": "only if the index-18 result is substantively produced and verified; no new plan or content-generation stage"
          },
          {
            "phase": "terminal_readback",
            "worker_action": "Read final saved state and the same index-18 output, file readback and generic publication receipts; report completed only if the actual deliverable is verified, otherwise blocked/incomplete.",
            "workflow_evidence": "exact job identity, completion status and immutable receipts",
            "advance": "mark completed only with both minimum_proof and deliverables evidence"
          },
          {
            "phase": "extension_if_needed",
            "worker_action": "If original task remains unfinished after index 18, retain same identity and fail closed until a separately implemented/tested continuation protocol supports each extra index",
            "workflow_evidence": "current controller has no accepted indices beyond 18",
            "advance": "never describe post-19 material as an accepted handshake without verified controller support"
          }
        ],
        "no_worker_workspace_writes": true,
        "no_special_readme_path": true,
        "abort_on_unverified_transition": true,
        "implementation_status": {
          "tracked_0_through_18": "Controller source progression and structural validation; final item must contain an agent-authored deliverable under the procedural contract, but semantic adequacy cannot be controller-certified.",
          "post_19": "not implemented",
          "semantic_task_completion": "Not controller-enforced: the agent evaluates semantic adequacy and correctness of its index-18 deliverable and records evidence; the workflow only validates configured structural conditions."
        },
        "agent_owned_semantic_verification": true,
        "delivery_is_index_18": true,
        "post_index_18_activity": "verification and readback only"
      }
    },
    "source_archive": {
      "original_blob_sha": "8a0912e5cfa641a899e19ba02cbefde7f61d59bd",
      "previous_active_document_blob_sha": "837b72c80bf1fb0a5e2a68ac03532fda0a125642",
      "historic_file_url": "https://github.com/BestNameYet/IssueScratch/blob/b57af6a799b66ae2798b651f77d1208f0f1995af/AGENTS.md",
      "current_amendment": "Correct the terminal phase: indices 16–18 reconcile, compile, then DELIVER the actual result. Controller only authenticates structure and source progression; the acting agent independently assesses correctness, completeness and utility, and verifies publication receipts as evidence after index 18. No separate solution-generation stage.",
      "previous_type_registry_reference": {
        "path": "src/types/issuescratch.scratchpad-field-registry.v2.json",
        "blob_sha": "1cb51d65f22264ada20e35c7c908452aabbfd57e",
        "version": "issuescratch.scratchpad-field-registry.v2"
      }
    },
    "coverage": {
      "active_section_count": 25,
      "active_procedure_count": 208,
      "registered_fields": 59,
      "linked_registry_sha": "03a624ae2cbc8fa84ce95aa6a98af1060a50f249",
      "active_examples": 0,
      "source_traceability": "Historical procedures reference their original blob SHA and source section; new procedures reference the current amendment. Deleted historical text remains in Git history, not in this active document.",
      "all_active_sections_mapped": true,
      "array_root_minimum_items": 19,
      "legacy_RS_objects_preserved": true,
      "array_item_wrapper_key": "scratchpad",
      "array_item_wrapper_exact_keys": true,
      "expanded_flat_permitted_activities": 152,
      "shuffled_illustrative_scratchpads": 17,
      "linked_uses_types_sha": "03a624ae2cbc8fa84ce95aa6a98af1060a50f249",
      "externalized_permitted_use_statements": true,
      "externalized_named_types": true,
      "comment_diagnostics_enabled": true,
      "comment_diagnostics_history_json_objects": true,
      "comment_tracking_maximum_index": 18,
      "comment_progression_function_selected": true,
      "document_opcode_adapter": true,
      "operation_registry_entries": 16,
      "opcode_procedural_sort_valid": true,
      "framing_controller_random_selection": true,
      "framing_controller_issued_live_indices": 2,
      "framing_controller_agent_semantic_execution": false,
      "agent_workflow_handshake_defined": true,
      "preparation_nested_count": 5,
      "reframing_exercises": 5,
      "reconciliation_slots": 3,
      "initial_opcode_projection_required": true,
      "framing_controller_current_live_probe_accepted": 4,
      "framing_controller_complete_19_index_run_verified": false,
      "higher_order_operators": 2,
      "higher_order_abstraction_modes": 4,
      "higher_order_framing_selection_count": 5,
      "higher_order_full_run_verified": false,
      "higher_order_one_frame_live_verified": true,
      "higher_order_live_accepted_indices": 4,
      "higher_order_tests_passed": 43,
      "higher_order_test_run": 41241263066,
      "generic_artifact_publication": true,
      "readme_specific_publication_active": false,
      "required_end_to_end_job_handshake": true,
      "extended_entry_handshake_deployed": false,
      "final_deliverable_required": true,
      "final_deliverable_semantic_verification_owner": "agent",
      "controller_semantic_enforcement": false
    }
  },
  "controller_profile": {
    "schema": "issuescratch.framing-controller-profile.v1",
    "version": "2.1.1",
    "purpose": "One preparation entry; five three-slot higher-order frames; three solution-producing final entries: reconcile all source work (16), compile it into an actionable solution (17), and produce the requested deliverable (18). The controller verifies structure and source-linked progression; the agent independently evaluates the delivered result against the user's task.",
    "source": "An original instruction must be substantively unpacked before reframing, and opcode reconciliation must cover preceding scratchpads and the preparatory array.",
    "first_index": 0,
    "last_tracked_index": 18,
    "frame_count": 5,
    "slots_per_frame": 3,
    "reference_ids": [
      "R-A",
      "R-B"
    ],
    "free_indices": [],
    "layout": "0: one preparatory scratchpad holding five nested scratchpads; 1..15: five frames of R-A, R-B and narrative expansion (3 each); 16: reconcile all contributions; 17: compile a coherent solution with atomic opcode lineage; 18: produce the actual answer/artifact and agent-evaluate it.",
    "selection_method": "On the first slot of each three-index frame, draw SOLVER_LIFT or ABSTRACT uniformly using crypto.randomInt(2). If ABSTRACT is chosen, draw one mode from CONTRACT, IMPLEMENTATION, CONSTRUCT, GENERAL using crypto.randomInt(4). Retain that single higher-order choice across the frame's three indices. Independently draw an eligible OP.01 atomic function for each new index, including reconciliation. Persist every draw and never reroll after interruption.",
    "constraints": [
      "Each accepted revision is a single root JSON array and adds exactly one scratchpad wrapper at its next zero-based index.",
      "Preserve all previously accepted entries without edits; keep references R-A and R-B distinct through all five frames.",
      "An enclosing statement about an inner claim must not silently become a direct assertion that the inner claim is true.",
      "Each narrative expansion adds new substantive content rather than merely paraphrasing the preceding frame.",
      "No semantic compliance checker is asserted: the workflow checks structural validity and retains complete diagnostic evidence.",
      "After index 18, freeze progression while continuing JSON validation.",
      "The preparatory entry retains the entire original instruction and an explicit opcode rendering as substantive scratchpad content, not workflow metadata.",
      "The three final entries are explicitly reconciliatory, not unrestricted.",
      "The opcode reconciler must reference the preparatory array and all earlier framing entries without promoting narrated claims to verified truths.",
      "Opcode rendering is action-granular; each action is mapped to bound OP steps with operands and traceability, not one omnibus opcode.",
      "The adversarial preparation must drive concrete checks for the action decomposition and the final reconciler.",
      "The preparatory instruction record must include explicit, minimalist, maximalist, inferred beginning/post states, and inferred change as distinct projections.",
      "Prepare an initial context-aware opcode-step projection in the first of the five nested preparatory scratchpads, with context_elements as an explicitly typed array.",
      "Keep the first opcode projection provisional and preserve traceability through adversarial review, atomic decomposition, final rendering and reconciliation.",
      "Select exactly one OP.02 higher-order framing operator for each of the five three-index exercises; never choose a separate higher-order operator for each slot.",
      "SOLVER_LIFT takes the preceding solver, its assumptions/method/limitations and its provenance as input to an enclosing solver; it must not simply paraphrase the original problem.",
      "ABSTRACT changes representation under one of four explicit modes; IMPLEMENTATION represents a mechanism without executing code.",
      "Retain the same higher-order mode/operator through all three slots, and preserve identity, attribution, invariants, suppression lists and source mapping across frames.",
      "Retain independently selected atomic OP.01 steps per index where useful; atomic and higher-order choices have different semantics and must not be conflated.",
      "No claim of semantic correctness or actual solver execution follows from structural validation or opcode publication.",
      "Require substantive frame input and transformed output structures, including source mappings, under the selected higher-order operator; an opcode name alone cannot satisfy the third slot."
    ],
    "delivery": "Persist next_function as a JSON object in comment state, record an instruction JSON object in the workspace, and publish/update a source-linked controller comment on Issue #1. This publishes instructions; an external agent still must act on them.",
    "candidate_status": "Revised 1+15+3 layout requires updated tests and end-to-end run",
    "random_function_pool": [
      "OP.01.002",
      "OP.01.003",
      "OP.01.004",
      "OP.01.005",
      "OP.01.006",
      "OP.01.007",
      "OP.01.008",
      "OP.01.009",
      "OP.01.010",
      "OP.01.011",
      "OP.01.012",
      "OP.01.013",
      "OP.01.014",
      "OP.01.015"
    ],
    "random_pool_registry": "src/types/issuescratch.operation-registry.v1.json",
    "random_exclusions": {
      "OP.01.001": "CAPTURE is source preservation, not a substantive operator",
      "OP.01.016": "EMIT is serialization, not a substantive operator"
    },
    "operation_application": "The selected operation is applied by the agent to the designated scratchpad/frame inputs, while its fixed structural obligations preserve two referent identities and increase framing depth. OP functions are abstract; the workflow does not itself generate the agent's narrative.",
    "enclosing_actions_obsolete_at_version": "1.1.0",
    "preparatory_index": 0,
    "preparatory_array_length": 5,
    "preparatory_field": "preparation[array<object>]",
    "preparatory_nested_wrapper_key": "scratchpad",
    "preparatory_roles": [
      {
        "index": 0,
        "role": "contextual_instruction_and_initial_opcode_projection",
        "requirements": [
          "Preserve the full original instruction as text, without replacing the verbatim source.",
          "Capture relevant surrounding conversation in a context_elements array, with source references, order, excerpt/summary status, and explicit-vs-inferred authority.",
          "Immediately produce an initial_opcode_projection array after examining the instruction against the context_elements; use separate atomic action steps rather than one omnibus opcode.",
          "Supply minimalist and maximalist user-intent projections, explicit intent, inferred beginning state, inferred desired post state, and inferred change.",
          "Flag the initial opcode projection as provisional; later adversarial review and atomistic decomposition may revise it without modifying the source wording.",
          "Do not treat projected intent as an independently issued user command."
        ],
        "projection_fields": {
          "verbatim_instruction": "Preserve the source wording exactly without replacing it with the projection.",
          "context_elements": "Ordered array of relevant surrounding-conversation elements, each linked to an identifiable source and explicitly typed by authority.",
          "initial_opcode_projection": "Ordered, context-aware, action-granular preliminary OP steps. Every step cites source instruction/context and is flagged provisional.",
          "minimalist_user_intent": "Smallest defensible user goal.",
          "maximalist_user_intent": "Largest defensible user goal bounded by source.",
          "explicit_intent": "Directly stated requirements grounded in source wording.",
          "inferred_beginning_state": "Inferred state before work, with basis and uncertainty.",
          "inferred_post_state": "Inferred desired future state, not an execution claim.",
          "inferred_change": "Difference between inferred beginning and post states, with provenance."
        },
        "inference_rules": [
          "Explicit intent must have clear grounding in original wording.",
          "All inferred content requires evidence_basis and uncertainty or an explicit unknown marker.",
          "Competing plausible readings may be represented without selecting a winner.",
          "Inferred post state is desired/anticipated, not evidence of actual completion."
        ],
        "context_element_contract": {
          "required_fields": [
            "context_id",
            "sequence",
            "source_kind",
            "source_ref",
            "content",
            "representation",
            "authority",
            "relevance"
          ],
          "source_kind_options": [
            "user_message",
            "assistant_message",
            "repository_rule",
            "previous_job_record",
            "other"
          ],
          "representation_options": [
            "verbatim_excerpt",
            "faithful_summary"
          ],
          "authority_options": [
            "explicit_user",
            "assistant_interpretation",
            "repository_instruction",
            "historical_observation",
            "inferred"
          ],
          "constraints": [
            "Preserve temporal order and source references; do not confuse assistant proposals with user instructions.",
            "Only claim an exact quote when representation=verbatim_excerpt and the words actually match source.",
            "Record omissions or uncertainty instead of manufacturing context.",
            "The context_elements array is substantive source interpretation, not a workflow handshake or acknowledgement."
          ]
        },
        "initial_opcode_contract": {
          "required_step_fields": [
            "step_id",
            "action_id",
            "opcode",
            "operands",
            "depends_on",
            "result_ref",
            "source_refs",
            "context_refs",
            "status"
          ],
          "status": "provisional",
          "minimum_steps": 2,
          "mapping": "Each step maps a bounded action to exactly one registered OP opcode. The source_refs and context_refs must resolve to the original instruction or entries of context_elements.",
          "prohibits": [
            "Single OP code for the entire instruction",
            "Substituting CAPTURE or EMIT for substantive actions",
            "Claiming a projection has already been executed"
          ],
          "revision_path": "Nested preparatory scratchpads 2 (adversarial review), 3 (atomistic decomposition), and 4 (revised opcode rendering)."
        }
      },
      {
        "index": 1,
        "role": "requirements_rumination",
        "requirements": [
          "Examine explicit and implicit demands, ambiguities, boundary cases, and acceptance criteria; reason about the full instruction without replacing the verbatim source."
        ]
      },
      {
        "index": 2,
        "role": "adversarial_review",
        "requirements": [
          "Challenge assumptions, identify contradictory or underdetermined requirements, test failure cases, and identify unauthorized interpretations.",
          "Present counterarguments and discriminating checks rather than merely restating the requirements.",
          "Challenge contextual assumptions and the initial opcode projection, distinguishing explicit user instructions from assistant-originated or inferred context."
        ]
      },
      {
        "index": 3,
        "role": "atomistic_action_decomposition",
        "requirements": [
          "Break the instruction into independently identifiable executable actions; each action has a stable action_id, source span or quote, typed inputs, expected output, dependencies, and explicit completion predicate.",
          "Avoid a single omnibus action or one operator standing for the entire instruction.",
          "Use adversarial findings to identify missing actions or failure paths.",
          "Tag each atomic action with its source projection, distinguishing explicitly requested actions from inferred supporting actions.",
          "Compare atomic actions with the initial contextual opcode projection and trace divergences."
        ]
      },
      {
        "index": 4,
        "role": "atomic_opcode_rendering",
        "requirements": [
          "Render every decomposed action as one or more reusable operation opcodes with typed operands, explicit dependencies, and expected result references.",
          "Maintain a one-to-many or many-to-many mapping between actions and opcode steps where required; do not represent all instructions as one giant command.",
          "Carry forward the source instruction, adversarial checks, and decomposition identifiers.",
          "Do not claim the opcode declaration executes any action.",
          "Retain links from atomic opcode steps to the instruction projections and record which steps implement explicit versus inferred actions.",
          "Reconcile the final action-level rendering with the initial contextual projection, including contextual authority, provenance and deviations."
        ]
      }
    ],
    "frame_start_index": 1,
    "frame_end_index": 15,
    "reconciliation_indices": [
      16,
      17,
      18
    ],
    "reconciliation_roles": [
      {
        "index": 16,
        "role": "collect_and_reconcile",
        "read_indices": "0..15",
        "requirements": [
          "Consolidate all preparatory and framing entries into one source-traceable account of the user's problem, evidence, constraints, and useful intermediate results.",
          "Resolve conflicts, distinguish explicit user requirements from inference, identify unresolved gaps, and specify the complete solution that the next entry must compile.",
          "Carry all relevant contributions forward; the output of this step must be usable by the solution compiler, not merely a summary of previous entries."
        ]
      },
      {
        "index": 17,
        "role": "opcode_reconciliation",
        "read_indices": "0..16",
        "requirements": [
          "Compile the reconciled contributions and the agent's substantive work into a coherent actionable solution that satisfies the original user's request; do not stop at an opcode projection.",
          "Preserve individually registered opcode steps with typed operands, dependencies, result references and source pointers, accounting for all five preparatory scratchpads and framing outputs.",
          "Supply the deliverable specification and actual solution content or construction inputs needed by index 18, with explicit linkage between requirements, outputs, and verification predicates.",
          "Distinguish declared operations from operations actually performed; selected opcodes and structural validity are not proof that compilation or task execution succeeded."
        ]
      },
      {
        "index": 18,
        "role": "final_synthesis_and_validation",
        "read_indices": "0..17",
        "requirements": [
          "Use the compiled solution from index 17 to produce the ACTUAL user-requested deliverable in index 18, not a proposed answer, TODO list, outline, or artifact plan.",
          "For a response-only task, include the complete user-facing answer in final_output[string]. For an explicitly authorized repository-file task, include the complete UTF-8 target content in artifacts[array<object>] with the previously declared exact destination path; final_output[string] may instead point to the declared artifact (repository-relative path or JSON pointer).",
          "Independently, as the acting agent, inspect the actual deliverable against the original user instruction, required format, source provenance, and domain-specific validation (for example, the real opcode-document adapter where required). Distinguish observed results from inferred assertions.",
          "Report any missing or failed essential deliverable checks as incomplete/blocked; do not claim success solely because the controller accepted the nineteenth entry.",
          "Keep workflow acknowledgments, publication receipts and later readback as external evidence of publishing the content already supplied at index 18; they do not constitute another content-generation stage."
        ]
      }
    ],
    "atomistic_mapping_contract": {
      "minimum_independent_actions": 2,
      "action_fields": [
        "action_id",
        "source_text_or_span",
        "verb",
        "inputs",
        "expected_output",
        "depends_on",
        "completion_test"
      ],
      "step_fields": [
        "step_id",
        "action_id",
        "opcode",
        "operands",
        "depends_on",
        "result_ref",
        "validation"
      ],
      "rule": "A rendered step binds exactly one registered OP operator to a bounded action or subaction. Each decomposed action must be mapped; composite instructions require multiple explicit steps. CAPTURE and EMIT may bookend the artifact but are not substitutes for the substantive steps.",
      "adversarial_review_link": "Every review objection must be explicitly resolved, rejected with rationale, or recorded as unresolved before final synthesis.",
      "instruction_provenance": "The original instruction and all named intent/state projections remain available at nested preparatory index 0; action decomposition at nested index 3 must cite those projections and distinguish explicit versus inferred actions.",
      "initial_projection_pointer": "/0/scratchpad/preparation[array<object>]/0/scratchpad/initial_opcode_projection[array<object>]",
      "context_pointer": "/0/scratchpad/preparation[array<object>]/0/scratchpad/context_elements[array<object>]",
      "revision_rule": "Nested index 4 must reconcile each preliminary step with atomistic actions from nested index 3, recording amended, retained, rejected and added step mappings."
    },
    "higher_order_registry_path": "src/types/issuescratch.higher-order-operators.v1.json",
    "higher_order_operator_pool": [
      "OP.02.001",
      "OP.02.002"
    ],
    "higher_order_abstract_modes": [
      "CONTRACT",
      "IMPLEMENTATION",
      "CONSTRUCT",
      "GENERAL"
    ],
    "higher_order_frame_selection": "one new higher-order selection per frame, at indices 1,4,7,10,13; reuse at every later index inside the same frame",
    "higher_order_randomness": "50/50 operator class; four modes equiprobable conditional on ABSTRACT; atomic operator is independently selected from fourteen OP.01 codes at each index",
    "frame_input_contract": {
      "inner_solver_fields": [
        "problem_ref",
        "method_ref",
        "assumptions_ref",
        "intermediate_result_refs",
        "limitations_ref",
        "source_refs"
      ],
      "abstraction_fields": [
        "subject_ref",
        "context_refs",
        "invariants",
        "mode",
        "target"
      ],
      "frame_lineage_fields": [
        "frame_id",
        "enclosing_frame_id",
        "source_indices",
        "source_refs",
        "invariants"
      ],
      "frame_output_fields": [
        "preserved_properties",
        "suppressed_details",
        "introduced_assumptions",
        "source_mapping",
        "next_solver_input"
      ],
      "note": "At framing slot 0 identify the inner solver/subject; slot 1 identify enclosing perspective and invariants; slot 2 construct transformed output plus source mappings. No autonomous solver execution is implied."
    },
    "frame_selection_persistence": {
      "state_field": "progression.frame_selections",
      "instruction_field": "higher_order_frame",
      "choice_receipt": "Same per-index immutable instruction JSON and controller comment used by OP.01 selections",
      "replay": "Upon retry, re-read the saved per-index draw sequence (operator, optional mode, atomic), and use the existing frame selection for the other two slots.",
      "compatibility": "Prior issued instructions remain immutable; this operator profile applies to newly initiated frames and new comments."
    },
    "substantive_frame_output_contract": {
      "index_role_fields": {
        "reference_a": "solver_or_subject[object]",
        "reference_b": "enclosing_target[object]",
        "third_slot": "higher_order_result[object]"
      },
      "required_solver_fields": [
        "problem_ref",
        "method_ref",
        "assumptions_ref",
        "intermediate_result_refs",
        "limitations_ref",
        "source_refs"
      ],
      "required_enclosing_target_fields": [
        "target_ref",
        "context_refs",
        "invariants",
        "purpose"
      ],
      "required_result_fields": [
        "preserved_properties",
        "suppressed_details",
        "introduced_assumptions",
        "source_mapping",
        "next_solver_input"
      ],
      "solver_lift_specific": "outer_solver_input object with subject_solver_ref, question_about_solver, problem_ref, source_refs",
      "abstraction_specific": "representation object with the fields declared by the selected CONTRACT, IMPLEMENTATION, CONSTRUCT or GENERAL mode",
      "validation": "Structural validation of content fields and source references against current frame selection. It does not prove semantic correctness or execution.",
      "source_comment_policy": "These fields are substantive solver output, NOT workflow acknowledgement, selection metadata, controller IDs or execution receipts."
    },
    "agent_deliverable_contract": {
      "schema": "issuescratch.agent-final-deliverable.v1",
      "indices": {
        "reconcile": 16,
        "compile": 17,
        "deliver": 18
      },
      "required_principle": "Every completed controlled task culminates in a substantive deliverable at index 18, grounded in the compiled output of indices 16 and 17.",
      "response_delivery": "final_output[string] must contain the actual answer, not a plan to answer.",
      "artifact_delivery": "For targets declared by the user, artifacts[array<object>] at index 18 contains full UTF-8 path/content objects. The existing general publisher verifies its own technical preconditions and writes the exact output after controller acceptance.",
      "verification_owner": "The acting agent evaluates semantic adequacy, requirement coverage, originality, provenance, applicable tests, and whether the submitted output actually addresses the user request.",
      "controller_boundary": "The controller can verify syntax, shape, identity, ordinal progression, framing structures, and persisted instruction receipts; it cannot verify the semantic adequacy, correctness, or usefulness of the delivered answer.",
      "post_acceptance": "The acting agent independently checks destination readback and external receipts and reports success only if delivery evidence matches the user's requirements. This is verification of index 18, not a new generation step.",
      "failure": "If a substantive deliverable cannot be produced, report incomplete/blocked and identify deficiencies; do not substitute an outline, a candidate plan, or a completion claim."
    }
  },
  "atomic_operation_registry": {
    "document_type": "issuescratch.operation-registry",
    "format_version": "1.0.0",
    "opcode_namespace": "OP.01",
    "opcode_pattern": "^OP\\.01\\.[0-9]{3}$",
    "relationship_to_agents_opcode": "OP.* is a reusable functional operation namespace distinct from the unique IS.* procedure identifiers in AGENTS.md. A job/record identity is not an operation opcode.",
    "registry_intent": "Small, extensible vocabulary of first-level operators; higher-order procedures are sequences or compositions. These describe requested operations, not proof of execution or semantic correctness.",
    "operational_semantics": "An opcode selects an abstract operation. Any concrete executor must separately register and verify the function or transformation used to realize it; no opcode by itself grants tool permissions or establishes task completion.",
    "no_semantic_guess": "Generic conversion MUST use CAPTURE only when no explicit mapping profile exists. Specialized opcode sequences are supplied by a mapping profile, not inferred from arbitrary prose.",
    "primitives": [
      {
        "opcode": "OP.01.001",
        "name": "CAPTURE",
        "description": "Preserve a source fragment and its identity without interpreting its meaning",
        "input_contract": "source_fragment",
        "output_contract": "source_reference"
      },
      {
        "opcode": "OP.01.002",
        "name": "GENERATE",
        "description": "Produce new content under given constraints",
        "input_contract": "input_and_constraints",
        "output_contract": "candidate"
      },
      {
        "opcode": "OP.01.003",
        "name": "TRANSFORM",
        "description": "Convert existing material while respecting stated invariants",
        "input_contract": "existing_content_and_constraints",
        "output_contract": "transformed_content"
      },
      {
        "opcode": "OP.01.004",
        "name": "ANALYZE",
        "description": "Extract or examine properties and relationships",
        "input_contract": "subject_and_questions",
        "output_contract": "observations"
      },
      {
        "opcode": "OP.01.005",
        "name": "EVALUATE",
        "description": "Appraise a claim or artifact against declared criteria",
        "input_contract": "subject_and_criteria",
        "output_contract": "assessment"
      },
      {
        "opcode": "OP.01.006",
        "name": "COMPARE",
        "description": "Contrast two or more subjects with respect to dimensions",
        "input_contract": "subjects_and_dimensions",
        "output_contract": "comparison"
      },
      {
        "opcode": "OP.01.007",
        "name": "COMPUTE",
        "description": "Apply an explicit mathematical or computational procedure",
        "input_contract": "function_and_operands",
        "output_contract": "result"
      },
      {
        "opcode": "OP.01.008",
        "name": "DESIGN",
        "description": "Specify a structure or mechanism meeting requirements",
        "input_contract": "requirements",
        "output_contract": "design"
      },
      {
        "opcode": "OP.01.009",
        "name": "PLAN",
        "description": "Arrange actions with constraints and dependencies",
        "input_contract": "goal_and_constraints",
        "output_contract": "plan"
      },
      {
        "opcode": "OP.01.010",
        "name": "SELECT",
        "description": "Choose one or more candidates according to a rule",
        "input_contract": "candidates_and_rule",
        "output_contract": "selection"
      },
      {
        "opcode": "OP.01.011",
        "name": "APPLY",
        "description": "Apply a named, separately defined function to arguments",
        "input_contract": "function_ref_and_arguments",
        "output_contract": "result"
      },
      {
        "opcode": "OP.01.012",
        "name": "BRANCH",
        "description": "Select a branch based on an explicit predicate",
        "input_contract": "condition_and_branches",
        "output_contract": "selected_branch"
      },
      {
        "opcode": "OP.01.013",
        "name": "ITERATE",
        "description": "Repeat a specified operator under an explicit bound or stopping test",
        "input_contract": "operator_state_and_stop_condition",
        "output_contract": "iteration_result"
      },
      {
        "opcode": "OP.01.014",
        "name": "VALIDATE",
        "description": "Check a result against machine-checkable or declared conditions",
        "input_contract": "result_and_conditions",
        "output_contract": "validation_result"
      },
      {
        "opcode": "OP.01.015",
        "name": "REFERENCE",
        "description": "Bind or resolve an identifier, scope, or contextual relationship",
        "input_contract": "reference_and_environment",
        "output_contract": "resolution"
      },
      {
        "opcode": "OP.01.016",
        "name": "EMIT",
        "description": "Return or serialize an artifact without claiming successful evaluation",
        "input_contract": "artifact_and_format",
        "output_contract": "output"
      }
    ],
    "mapping_profile_example": "experiments/general-purpose-job-opcode-map.v1.json"
  },
  "higher_order_operation_registry": {
    "schema": "issuescratch.higher-order-operators.v1",
    "version": "1.0.0",
    "description": "Five recursive frames each select exactly one higher-order operator, retaining that selection across all three frame indices. Atomic OP.01 functions remain available per index and never substitute for the frame operator.",
    "namespace": "OP.02",
    "selection": {
      "operator_pool": [
        "OP.02.001",
        "OP.02.002"
      ],
      "mechanism": "node:crypto.randomInt(2) once at the beginning of each three-index frame",
      "mode_selection": "When OP.02.002 is selected, independently draw one of four ABSTRACT modes uniformly with crypto.randomInt(4); preserve both selections through the frame.",
      "retention": "Commit selected operator, mode, random ordinals and source revision into controller per-comment state and immutable next-function instruction, never choose again inside that frame.",
      "randomness_note": "No claim of uniformity across all five resulting behaviors; operator types are 50/50, modes conditioned on ABSTRACT."
    },
    "operators": [
      {
        "opcode": "OP.02.001",
        "name": "SOLVER_LIFT",
        "class": "higher_order",
        "input_contract": {
          "inner_solver": {
            "problem_ref": "string",
            "method_ref": "string",
            "assumptions_ref": "string",
            "intermediate_result_refs": "string[]",
            "limitations_ref": "string",
            "source_refs": "string[]"
          },
          "enclosing_context_refs": "string[]",
          "question_about_solver": "string"
        },
        "output_contract": {
          "outer_solver_input": "object",
          "changed_reasoning_level": "integer",
          "preserved_invariants": "string[]",
          "source_lineage": "object[]",
          "unresolved": "object[]"
        },
        "semantics": "Construct an enclosing solver whose subject is the preceding solver (including its method, assumptions, and limitations), rather than merely reissuing the original problem.",
        "constraints": [
          "The inner solver is an input artifact, not an automatically executed subroutine.",
          "Retain a trace from every new assertion to the inner solver and original source.",
          "No semantic execution claimed by assigning opcode."
        ]
      },
      {
        "opcode": "OP.02.002",
        "name": "ABSTRACT",
        "class": "higher_order",
        "input_contract": {
          "subject_ref": "string",
          "context_refs": "string[]",
          "invariants": "string[]",
          "mode": "CONTRACT|IMPLEMENTATION|CONSTRUCT|GENERAL",
          "target": "string"
        },
        "output_contract": {
          "representation": "object",
          "preserved_properties": "string[]",
          "suppressed_details": "string[]",
          "new_assumptions": "object[]",
          "source_mapping": "object[]",
          "unresolved_questions": "object[]",
          "next_solver_input": "object"
        },
        "semantics": "Change the subject's representation under an explicitly selected abstraction mode while preserving source traceability and recording intentionally omitted details.",
        "constraints": [
          "IMPLEMENTATION denotes an abstraction of implementation mechanisms, not authorization to implement code.",
          "The output must be distinguishable from merely paraphrasing the prior solver.",
          "Selection and structural validation are not evidence of correct semantic abstraction."
        ]
      }
    ],
    "modes": [
      {
        "id": "CONTRACT",
        "description": "Model obligations, interfaces, preconditions, postconditions, and invariants.",
        "required_output_fields": [
          "obligations",
          "interfaces",
          "preconditions",
          "postconditions",
          "invariants"
        ]
      },
      {
        "id": "IMPLEMENTATION",
        "description": "Model architecture, components, algorithms and dependencies without executing or writing code.",
        "required_output_fields": [
          "components",
          "algorithms",
          "dependencies",
          "operational_boundaries"
        ]
      },
      {
        "id": "CONSTRUCT",
        "description": "Reconstruct the subject as an organized formal or conceptual structure.",
        "required_output_fields": [
          "elements",
          "relationships",
          "construction_rules",
          "invariants"
        ]
      },
      {
        "id": "GENERAL",
        "description": "Extract properties that survive across instances or domains, with counterexamples and limits.",
        "required_output_fields": [
          "generalized_properties",
          "supporting_instances",
          "counterexamples",
          "scope_limits"
        ]
      }
    ],
    "frame_structure": [
      {
        "slot": 0,
        "role": "reference_a",
        "requirements": [
          "Identify preceding solver or subject representation with source lineage, method and limitations.",
          "Do not invent a completed solver when only a draft or stated problem exists."
        ]
      },
      {
        "slot": 1,
        "role": "reference_b",
        "requirements": [
          "Identify higher-order perspective, target contract/construct/mechanism, criteria and invariants.",
          "Preserve the source and attribution of inner claims."
        ]
      },
      {
        "slot": 2,
        "role": "apply_and_project",
        "requirements": [
          "Apply the selected higher-order operator, not merely repeat or rename the preceding material.",
          "Record preserved properties, suppressed details, introduced assumptions and source mappings.",
          "Produce a separately identifiable next solver input or representation."
        ]
      }
    ],
    "shared_invariants": [
      "Two distinguishable referents across levels",
      "Traceable ancestry of each enclosing solver",
      "No promotion of inferred claims to direct user instructions",
      "Meaningful change of reasoning level or representation"
    ],
    "outside_scope": [
      "Autonomous execution of a chosen solver",
      "Semantic verification of the content generated by an agent",
      "Unrestricted repository mutation by the agent",
      "Changing the 19 outer-index allocation"
    ]
  },
  "render_instruction_templates": [
    {
      "opcode": "R.01.001",
      "key": "reconcile.atomic",
      "text": "Use atomic {atomic_name} ({atomic_opcode}) for a bounded supporting action.",
      "source_opcodes": [
        "IS.10.006",
        "IS.12.008"
      ]
    },
    {
      "opcode": "R.01.002",
      "key": "reconcile.lineage",
      "text": "Reconcile all five persisted higher-order frames and their lineage, not merely the atomic function choices.",
      "source_opcodes": [
        "IS.12.011"
      ]
    },
    {
      "opcode": "R.01.003",
      "key": "reconcile.append",
      "text": "Append exactly one substantive scratchpad at index {index}; keep the accepted prefix unchanged.",
      "source_opcodes": [
        "IS.10.006"
      ]
    },
    {
      "opcode": "R.01.004",
      "key": "frame.atomic",
      "text": "Use atomic {atomic_name} ({atomic_opcode}) inside the fixed higher-order frame {frame_name}{mode_suffix}. An opcode instruction is not execution evidence.",
      "source_opcodes": [
        "IS.12.003",
        "IS.12.008"
      ]
    },
    {
      "opcode": "R.01.005",
      "key": "frame.lineage.input",
      "text": "The enclosing frame receives the preceding solver or subject as an input with problem, method, assumptions, intermediate results, limitations and source references.",
      "source_opcodes": [
        "IS.12.003",
        "IS.12.004"
      ]
    },
    {
      "opcode": "R.01.006",
      "key": "frame.lineage.preserve",
      "text": "Preserve source mapping, referent identities, attribution and invariants; record suppressed details, introduced assumptions and unresolved questions.",
      "source_opcodes": [
        "IS.12.006"
      ]
    },
    {
      "opcode": "R.01.007",
      "key": "frame.lineage.transform",
      "text": "Build a distinct new solver input or representation, not a paraphrase or an ungrounded claim of higher abstraction.",
      "source_opcodes": [
        "IS.12.004",
        "IS.12.005"
      ]
    },
    {
      "opcode": "R.01.008",
      "key": "frame.A.identify",
      "text": "Reference A: identify the prior solver or subject representation, with its assumptions, method, evidence and limitations.",
      "source_opcodes": [
        "IS.12.003"
      ]
    },
    {
      "opcode": "R.01.009",
      "key": "frame.A.cite",
      "text": "Cite the actual preceding solver or preparatory instruction; do not invent completed execution.",
      "source_opcodes": [
        "IS.11.010"
      ]
    },
    {
      "opcode": "R.01.010",
      "key": "frame.B.identify",
      "text": "Reference B: identify the enclosing perspective, selected abstraction mode if applicable, target representation, and preservation criteria.",
      "source_opcodes": [
        "IS.12.003"
      ]
    },
    {
      "opcode": "R.01.011",
      "key": "frame.B.distinguish",
      "text": "Differentiate this framing reference from the inner solver or subject.",
      "source_opcodes": [
        "IS.12.004"
      ]
    },
    {
      "opcode": "R.01.012",
      "key": "frame.append.reference",
      "text": "Append exactly one substantive scratchpad at index {index} and retain the accepted prefix.",
      "source_opcodes": [
        "IS.10.006"
      ]
    },
    {
      "opcode": "R.01.013",
      "key": "frame.reuse",
      "text": "Apply the *same* higher-order choice as the other two slots of {frame_id}; do not reroll or switch modes.",
      "source_opcodes": [
        "IS.12.007"
      ]
    },
    {
      "opcode": "R.01.014",
      "key": "frame.solver_lift",
      "text": "Construct a higher-level solver whose subject is the previous solver, including its method, assumptions, intermediate results and limitations.",
      "source_opcodes": [
        "IS.12.004"
      ]
    },
    {
      "opcode": "R.01.015",
      "key": "frame.abstract",
      "text": "Construct an explicit {mode} representation with its specified fields; IMPLEMENTATION describes mechanisms, not execution.",
      "source_opcodes": [
        "IS.12.005"
      ]
    },
    {
      "opcode": "R.01.016",
      "key": "frame.result.fields",
      "text": "Supply preserved_properties, suppressed_details, introduced_assumptions, source_mapping, and next_solver_input in substantive output.",
      "source_opcodes": [
        "IS.12.006"
      ]
    },
    {
      "opcode": "R.01.017",
      "key": "frame.expand",
      "text": "Add substantive development rather than a quotation ladder or paraphrase.",
      "source_opcodes": [
        "IS.11.007"
      ]
    },
    {
      "opcode": "R.01.018",
      "key": "frame.append.result",
      "text": "Append exactly one substantive scratchpad at index {index}; retain the accepted prefix.",
      "source_opcodes": [
        "IS.10.006"
      ]
    },
    {
      "opcode": "R.01.019",
      "key": "selection.replay_note",
      "text": "Replay the complete ordered draw list for the exact source revision; frame choices are persisted once per frame.",
      "source_opcodes": [
        "IS.12.007"
      ]
    }
  ],
  "instruction_sequence": {
    "reconcile": [
      "reconcile.atomic",
      "$reconciliation_role_requirements",
      "reconcile.lineage",
      "reconcile.append"
    ],
    "frame_reference_A": [
      "frame.atomic",
      "frame.A.identify",
      "frame.A.cite",
      "frame.lineage.input",
      "frame.lineage.preserve",
      "frame.lineage.transform",
      "frame.append.reference"
    ],
    "frame_reference_B": [
      "frame.atomic",
      "frame.B.identify",
      "frame.B.distinguish",
      "frame.lineage.input",
      "frame.lineage.preserve",
      "frame.lineage.transform",
      "frame.append.reference"
    ],
    "frame_result": [
      "frame.atomic",
      "frame.reuse",
      "$selected_frame_transform",
      "frame.result.fields",
      "frame.lineage.input",
      "frame.lineage.preserve",
      "frame.lineage.transform",
      "frame.expand",
      "frame.append.result"
    ]
  },
  "resolved_conflicts": [
    {
      "id": "C001",
      "description": "For a file-artifact job, final_output[string] may be a pointer to the artifact (path or JSON pointer), while artifacts[array<object>] contains its full UTF-8 content.",
      "source": "User clarification in current conversation",
      "affected_procedure": "IS.10.009",
      "affected_profile_index": 18
    }
  ],
  "compatibility": {
    "frozen_profile_path": "src/types/issuescratch.framing-controller.v1.json",
    "frozen_atomic_registry_path": "src/types/issuescratch.operation-registry.v1.json",
    "frozen_higher_registry_path": "src/types/issuescratch.higher-order-operators.v1.json",
    "legacy_snapshots": "Prior receipts remain unchanged and their profile/registries remain available for provenance. The runtime checks current compatibility snapshots against canonical definitions."
  },
  "meta_controller_contract": {
    "schema": "issuescratch.meta-controller-contract.v1",
    "version": "1.0.0",
    "principle": "One reusable verified-entry transition protocol for all 19 indices. Index contracts supply inputs, validation predicates and semantic self-evaluation; the meta-controller manages persisted state, event processing, selection and rendering without semantic authority.",
    "scope": {
      "start": 0,
      "end": 18,
      "accepted_entries_initial": 0,
      "terminal_accepted_entries": 19,
      "progression_mode": "incremental"
    },
    "state_store": {
      "path_template": "workspaces/issue1-diagnostics/comments/{source_comment_id}/state.json",
      "schema": "issuescratch.comment-state.v1",
      "fields": [
        "comment_id",
        "progression.mode",
        "progression.accepted_entries",
        "progression.last_accepted_index",
        "progression.next_index",
        "progression.accepted_prefix_sha256",
        "progression.complete",
        "progression.next_function",
        "progression.function_selection",
        "progression.frame_selections",
        "progression.controller_comment_id",
        "progression.controller_status",
        "last_processed_revision_sha256",
        "latest_diagnostic_path",
        "latest_validation",
        "history"
      ],
      "source_comment": "The GitHub Issue #1 source comment is the only agent-writable surface. The state store is workflow-owned.",
      "receipt_templates": {
        "revision": "workspaces/issue1-diagnostics/comments/{source_comment_id}/revisions/{source_revision_sha256}.json",
        "next_instruction": "workspaces/issue1-diagnostics/comments/{source_comment_id}/instructions/{index_two_digit}.json"
      },
      "replay": "Use existing receipt and source-linked state to replay selections; no reroll on retry; fail closed on mismatched identity, digest or persisted choice."
    },
    "state_input": {
      "source": "Validator result for freshly re-fetched saved Issue #1 comment, not an agent-supplied transition signal.",
      "schema": "issuescratch.validated-entry-event.v1",
      "required": [
        "source_comment_id",
        "source_revision_sha256",
        "candidate_index",
        "contract_id",
        "validation_status",
        "expected_prefix_sha256"
      ],
      "validation_status_enum": [
        "valid",
        "invalid",
        "duplicate",
        "stale",
        "unavailable",
        "conflict"
      ],
      "guaranteed_by_validator": "Only valid means that syntax, structure, identity, accepted prefix and contract-specified machine checks passed. Never a claim of semantic adequacy."
    },
    "uniform_transition": {
      "valid": {
        "guard": "saved_identity_and_revision_and_prefix_match && validated_candidate_index_equals_next_index",
        "action": "accept_exactly_one",
        "state_change": "accepted_entries +1; last_accepted_index = submitted_index; accepted_prefix_sha256 = hash(saved accepted prefix); next_index = null when terminal else accepted_entries; complete = accepted_entries===19",
        "effects": [
          "persist_revision_diagnostic",
          "persist_state",
          "resolve_any_authorized_random_choices",
          "persist_next_instruction_receipt",
          "render_next_canonical_step_if_nonterminal"
        ],
        "semantic_verdict": false
      },
      "invalid": {
        "guard": "invalid JSON, missing required field, wrong type, invalid opcode, invalid source or missing input",
        "action": "request_valid_input",
        "state_change": "No change to accepted index, accepted prefix, selected frame or selected opcode.",
        "effects": [
          "record_diagnostic",
          "identify_specific_missing_or_invalid_fields",
          "retain_current_step",
          "ask_for_corrected_valid_input"
        ]
      },
      "unavailable": {
        "guard": "missing required source, inaccessible source, or incomplete input",
        "action": "request_valid_input",
        "state_change": "None",
        "effects": [
          "report_precise_missing_source",
          "retain_current_step"
        ]
      },
      "duplicate": {
        "guard": "previously recorded exact saved revision",
        "action": "idempotent_replay",
        "state_change": "None",
        "effects": [
          "keep_prior_selection_and_instruction",
          "do_not_reroll"
        ]
      },
      "stale": {
        "guard": "superseded event payload, changed saved source or accepted-prefix mismatch",
        "action": "reject_and_refresh",
        "state_change": "No accepted-index advancement",
        "effects": [
          "fetch_current_source",
          "request_correction_or_halt_if_conflict"
        ]
      },
      "conflict": {
        "guard": "contradictory canonical procedures, inconsistent immutable receipt or state source",
        "action": "halt",
        "state_change": "None",
        "effects": [
          "record_failure",
          "never_invent_transition_or_input"
        ]
      },
      "terminal": {
        "guard": "validated index 18 with 19 accepted entries",
        "action": "complete_structurally",
        "state_change": "next_index=null; complete=true",
        "effects": [
          "perform_separate_post_acceptance_verification_and_publication_if_applicable"
        ],
        "semantic_verdict": false
      }
    },
    "subcontrollers": {
      "preparation": {
        "indices": [
          0
        ],
        "entry_contract": "index_contracts[0]",
        "responsibility": "Validate the single outer wrapper containing five distinct nested preparation stages. No new random choice."
      },
      "framing": {
        "indices": [
          1,
          15
        ],
        "frame_formula": "frame_number=floor((index-1)/3); slot=(index-1)%3",
        "slot_roles": [
          "reference_a",
          "reference_b",
          "framing_result"
        ],
        "responsibility": "Resolve an already-authorized higher-order operator and its selected mode, keep them fixed across all three slots, and verify corresponding structural fields."
      },
      "reconciliation": {
        "indices": [
          16,
          18
        ],
        "stages": [
          "collect_and_reconcile",
          "opcode_reconciliation",
          "final_synthesis_and_validation"
        ],
        "responsibility": "Validate source coverage, final artifact/answer shape and terminal evidence without semantic certification."
      },
      "random_selector": {
        "indices": [
          1,
          18
        ],
        "responsibility": "Draw only from registered and authorized pools and persist ordinals; no interpretation or semantic generation.",
        "selection_points": {
          "higher_order_frame_start": [
            1,
            4,
            7,
            10,
            13
          ],
          "abstraction_mode": "Only on frame start when selected higher_order_operator is OP.02.002",
          "atomic": "Each index 1 through 18"
        },
        "algorithm": "node:crypto.randomInt",
        "replay": "Selected values immutable per source revision and frame."
      }
    },
    "hooks": {
      "hook_contract": {
        "input": [
          "source_comment_id",
          "source_revision_sha256",
          "candidate_index",
          "contract_id",
          "state_snapshot"
        ],
        "output": [
          "handler_id",
          "outcome",
          "diagnostic_or_receipt_ref"
        ],
        "constraints": [
          "Handlers do not advance state independently",
          "Handlers do not synthesize canonical procedure",
          "Failures must be recorded and must not be hidden by other successful hooks"
        ]
      },
      "registered": [
        {
          "handler_id": "diagnostics",
          "trigger": [
            "on_candidate_saved",
            "on_validation_result"
          ],
          "required": true,
          "behavior": "Collect structural metrics, validation results, source digest and error details."
        },
        {
          "handler_id": "state_persistence",
          "trigger": [
            "on_validated_acceptance",
            "on_nonadvancing_error"
          ],
          "required": true,
          "behavior": "Persist state and verify readback; only validated accepted entry may increment index."
        },
        {
          "handler_id": "random_selection",
          "trigger": [
            "on_new_index_after_acceptance"
          ],
          "required": true,
          "behavior": "Execute authorized draws and persist/replay selections."
        },
        {
          "handler_id": "instruction_receipt",
          "trigger": [
            "on_next_step_resolved"
          ],
          "required": true,
          "behavior": "Persist immutable index instruction and verify same revision and source."
        },
        {
          "handler_id": "step_renderer",
          "trigger": [
            "on_next_step_resolved",
            "on_input_correction_required"
          ],
          "required": true,
          "behavior": "Present the exact selected canonical instruction and input request in the controller comment; execution history stays in external records."
        },
        {
          "handler_id": "artifact_publisher",
          "trigger": [
            "on_structural_completion"
          ],
          "required": false,
          "behavior": "Use separately verified source-authorized artifact path and full-byte readback."
        }
      ],
      "extensibility": "Additional diagnostic, observational, evaluative or publication handlers can be registered with declared triggers and contracts; they cannot define an alternative transition or claim semantic success."
    },
    "semantic_boundary": "The index contract exposes agent-facing evaluatory criteria; deterministic acceptance is strictly machine-verifiable. Semantic failure causes the agent to correct or ask for valid input before claiming completion."
  },
  "index_contracts": [
    {
      "contract_id": "IS.INDEX.000",
      "index": 0,
      "definition_ref": "#/index_contract_definitions/common",
      "kind": "preparation",
      "phase": "initial",
      "role": "five_nested_preparatory_scratchpads",
      "output": {
        "scratchpad_contract": {
          "preparation[array<object>]": {
            "type": "array",
            "length": 5,
            "items": {
              "exact_wrapper": "scratchpad",
              "type": "nonempty_object"
            },
            "stage_refs": [
              {
                "nested_index": 0,
                "role": "contextual_instruction_and_initial_opcode_projection",
                "procedure_ref": "controller_profile.preparatory_roles[0]"
              },
              {
                "nested_index": 1,
                "role": "requirements_rumination",
                "procedure_ref": "controller_profile.preparatory_roles[1]"
              },
              {
                "nested_index": 2,
                "role": "adversarial_review",
                "procedure_ref": "controller_profile.preparatory_roles[2]"
              },
              {
                "nested_index": 3,
                "role": "atomistic_action_decomposition",
                "procedure_ref": "controller_profile.preparatory_roles[3]"
              },
              {
                "nested_index": 4,
                "role": "atomic_opcode_rendering",
                "procedure_ref": "controller_profile.preparatory_roles[4]"
              }
            ]
          }
        }
      },
      "semantic_completion": {
        "stage_criteria": [
          "Preserve original instruction and surrounding context with source attribution; do not confuse assistant interpretation with explicit user authority.",
          "Produce distinct minimalist/maximalist intent interpretations and bounded inferred beginning, desired end, and inferred change.",
          "Provisional opcode projection decomposes the request into individually traceable actions with inputs/dependencies; do not claim execution.",
          "Five nested stages provide substantive requirements analysis, adversarial challenges, independent action decomposition, and reconciled opcode rendering.",
          "Disclose missing context rather than inventing it."
        ]
      },
      "normative_clauses": [
        "IS.11.002",
        "IS.11.003",
        "IS.11.004",
        "IS.11.005",
        "IS.11.006",
        "IS.11.009"
      ]
    },
    {
      "contract_id": "IS.INDEX.001",
      "index": 1,
      "definition_ref": "#/index_contract_definitions/reference_a"
    },
    {
      "contract_id": "IS.INDEX.002",
      "index": 2,
      "definition_ref": "#/index_contract_definitions/reference_b"
    },
    {
      "contract_id": "IS.INDEX.003",
      "index": 3,
      "definition_ref": "#/index_contract_definitions/framing_result"
    },
    {
      "contract_id": "IS.INDEX.004",
      "index": 4,
      "definition_ref": "#/index_contract_definitions/reference_a"
    },
    {
      "contract_id": "IS.INDEX.005",
      "index": 5,
      "definition_ref": "#/index_contract_definitions/reference_b"
    },
    {
      "contract_id": "IS.INDEX.006",
      "index": 6,
      "definition_ref": "#/index_contract_definitions/framing_result"
    },
    {
      "contract_id": "IS.INDEX.007",
      "index": 7,
      "definition_ref": "#/index_contract_definitions/reference_a"
    },
    {
      "contract_id": "IS.INDEX.008",
      "index": 8,
      "definition_ref": "#/index_contract_definitions/reference_b"
    },
    {
      "contract_id": "IS.INDEX.009",
      "index": 9,
      "definition_ref": "#/index_contract_definitions/framing_result"
    },
    {
      "contract_id": "IS.INDEX.010",
      "index": 10,
      "definition_ref": "#/index_contract_definitions/reference_a"
    },
    {
      "contract_id": "IS.INDEX.011",
      "index": 11,
      "definition_ref": "#/index_contract_definitions/reference_b"
    },
    {
      "contract_id": "IS.INDEX.012",
      "index": 12,
      "definition_ref": "#/index_contract_definitions/framing_result"
    },
    {
      "contract_id": "IS.INDEX.013",
      "index": 13,
      "definition_ref": "#/index_contract_definitions/reference_a"
    },
    {
      "contract_id": "IS.INDEX.014",
      "index": 14,
      "definition_ref": "#/index_contract_definitions/reference_b"
    },
    {
      "contract_id": "IS.INDEX.015",
      "index": 15,
      "definition_ref": "#/index_contract_definitions/framing_result"
    },
    {
      "contract_id": "IS.INDEX.016",
      "index": 16,
      "definition_ref": "#/index_contract_definitions/common",
      "kind": "reconciliation",
      "phase": "collect_and_reconcile",
      "role": "collect_and_reconcile",
      "output": {
        "scratchpad_contract": {
          "covered_indexes[array<number>]": {
            "type": "array",
            "must_include": "0..15"
          },
          "reconciliation[object]": {
            "type": "object"
          }
        }
      },
      "semantic_completion": {
        "stage_criteria": [
          "Reconcile every preceding contribution without silently discarding contradictory evidence or original user requirements.",
          "Prepare a usable solution input, not merely a summary."
        ]
      },
      "normative_clauses": [
        "IS.12.011"
      ]
    },
    {
      "contract_id": "IS.INDEX.017",
      "index": 17,
      "definition_ref": "#/index_contract_definitions/common",
      "kind": "reconciliation",
      "phase": "opcode_reconciliation",
      "role": "opcode_reconciliation",
      "output": {
        "scratchpad_contract": {
          "opcode_steps[array<object>]": {
            "type": "array",
            "source_pointer_required": true
          },
          "covered_source_pointers[array<string>]": {
            "type": "array",
            "must_cover": "outer indices 0..16 plus five preparatory nested stages and original instruction/projection pointers"
          }
        }
      },
      "semantic_completion": {
        "stage_criteria": [
          "Compile all source-linked actions and preparatory/frame inputs into an actionable, complete solution.",
          "Distinguish opcodes requested from those actually executed and prove action coverage."
        ]
      },
      "normative_clauses": [
        "IS.12.011"
      ]
    },
    {
      "contract_id": "IS.INDEX.018",
      "index": 18,
      "definition_ref": "#/index_contract_definitions/common",
      "kind": "reconciliation",
      "phase": "final_synthesis_and_validation",
      "role": "final_synthesis_and_validation",
      "output": {
        "scratchpad_contract": {
          "final_reconciliation[object]": {
            "type": "object"
          },
          "final_output[string]": {
            "type": "nonempty_string",
            "artifact_case": "may be a pointer to declared artifact"
          },
          "coverage[object]": {
            "type": "object"
          },
          "artifacts[array<object>]": {
            "type": "conditional",
            "when": "artifact targets declared by original user",
            "item_fields": [
              "path",
              "content"
            ],
            "content_type": "full_UTF8"
          }
        }
      },
      "semantic_completion": {
        "stage_criteria": [
          "Produce the actual user-requested answer or full authorized artifact and evaluate it independently against user requirements.",
          "For authorized file output, complete UTF-8 content must appear in artifacts; final_output may be a pointer, not a false publication claim.",
          "Treat structural completion as separate from published artifact readback and semantic correctness."
        ]
      },
      "normative_clauses": [
        "IS.12.011"
      ]
    }
  ],
  "shared_semantic_completion_criteria": [
    {
      "id": "SEM.COMMON.01",
      "criterion": "Source fidelity, provenance and attribution",
      "success": "Claims trace to source references; no invented execution, authorship or user authorization."
    },
    {
      "id": "SEM.COMMON.02",
      "criterion": "Substantive fulfillment of the selected step",
      "success": "Performs the actual requested transformation rather than naming an opcode or paraphrasing."
    },
    {
      "id": "SEM.COMMON.03",
      "criterion": "Conformity to original user intent",
      "success": "Preserves explicit requirements; identifies uncertain or unsupported inferences."
    },
    {
      "id": "SEM.COMMON.04",
      "criterion": "Honest limitations and failure handling",
      "success": "Requests necessary valid input on blockers and does not assert unverified results."
    }
  ],
  "index_contract_definitions": {
    "common": {
      "input": {
        "required": [
          "canonical semantic procedure",
          "all referenced substantive source material"
        ]
      },
      "semantic_completion": {
        "evaluator": "acting_agent_only",
        "criteria_refs": [
          "SEM.COMMON.01",
          "SEM.COMMON.02",
          "SEM.COMMON.03",
          "SEM.COMMON.04"
        ],
        "missing_source": "Disclose missing substantive input; do not invent it or claim semantic completion."
      },
      "status": "agent_semantic_requirements"
    },
    "framing": {
      "definition_ref": "#/index_contract_definitions/common",
      "kind": "framing",
      "normative_clauses": [
        "IS.12.006"
      ]
    },
    "reference_a": {
      "definition_ref": "#/index_contract_definitions/framing",
      "phase": "reference_a",
      "role": "inner_solver_or_subject",
      "output": {
        "scratchpad_contract": {
          "solver_or_subject[object]": {
            "type": "object",
            "required_fields": [
              "problem_ref",
              "method_ref",
              "assumptions_ref",
              "intermediate_result_refs",
              "limitations_ref",
              "source_refs"
            ]
          }
        }
      },
      "semantic_completion": {
        "stage_criteria": [
          "Reference the real preceding solver or subject with method, assumptions, evidence, intermediate results and limitations.",
          "Preserve source identities and distinguish an unexecuted projected step from a completed operation."
        ]
      }
    },
    "reference_b": {
      "definition_ref": "#/index_contract_definitions/framing",
      "phase": "reference_b",
      "role": "enclosing_reference",
      "output": {
        "scratchpad_contract": {
          "enclosing_target[object]": {
            "type": "object",
            "required_fields": [
              "target_ref",
              "context_refs",
              "invariants",
              "purpose"
            ]
          }
        }
      },
      "semantic_completion": {
        "stage_criteria": [
          "Describe a genuinely different enclosing target with its context, invariants, assumptions and source mappings.",
          "Clearly distinguish the enclosing perspective from the reference-A solver."
        ]
      }
    },
    "framing_result": {
      "definition_ref": "#/index_contract_definitions/framing",
      "phase": "framing_result",
      "role": "transformed_enclosing_output",
      "output": {
        "scratchpad_contract": {
          "higher_order_result[object]": {
            "type": "object",
            "required_fields": [
              "preserved_properties",
              "suppressed_details",
              "introduced_assumptions",
              "source_mapping",
              "next_solver_input"
            ],
            "selected_operator_specific": "higher_order_operation_registry.operators[].output_contract and selected mode required_output_fields"
          }
        }
      },
      "semantic_completion": {
        "stage_criteria": [
          "Produce a substantive output satisfying the exact selected higher-order operation and mode—not a label, repetition or paraphrase.",
          "Preserve and map invariants, disclosed omissions, assumptions, unresolved questions, sources and the next solver input.",
          "Perform the supplied higher-order operation and mode without inventing transformed results."
        ]
      }
    }
  },
  "index_contract_reference_rules": {
    "reference_form": "definition_ref is a local RFC 6901 pointer within this document, not an executable instruction.",
    "resolution": "Resolve the referenced definition once. Compose it with unique local fields by recursive object merge. Arrays and scalar values are atomic. Any unequal overlapping leaf, missing reference or reference cycle is an error; no silent override.",
    "iteration": "Iterate index_contracts records only. Definitions are a lookup collection, not additional stages. Read the referenced definition without copying its contents into each saved index record.",
    "preservation": "Composition must reproduce the prior agent-only contracts exactly; this change neither adds state-machine obligations nor modifies semantic work."
  },
  "agent_step_rendering": {
    "schema": "issuescratch.programmatic-index-projection.v1",
    "projection_program": {
      "module": "src/index-projection.js",
      "export": "createProjection",
      "arguments": [
        "current canonical procedure object",
        "optional supplied inputs keyed by current index"
      ],
      "call": "createProjection(currentProcedure, inputsByIndex)",
      "authority": "Implementation of agent_step_rendering.opcode_procedure; the opcode/JSON procedure defines the algorithm independently of language."
    },
    "source_binding": "The caller supplies the current procedure on each projection request. No generated per-index path list or fixed index count is stored.",
    "output_contract": {
      "shared": "Current shared agent requirements, once",
      "shared_semantic_criteria": "Current verbatim criteria resolved by identity",
      "definitions": "Unique projected contract content, stored once per distinct content",
      "index_projections": "Current index identity plus derived projection_key and externally supplied inputs when present"
    },
    "renderer_boundary": "This function builds projection data only. A future renderer consumes shared, referenced unique definition and supplied_inputs for the current index. It must not summarize or invent instruction text. This function does not render UI, advance state, choose operators or persist workflow records.",
    "change_behavior": "Changes to current contract content, shared criteria, definition bindings, index order or index membership are reflected on the next call without regenerating a literal pointer table.",
    "opcode_procedure": {
      "document_ref": "docs/index-projection-procedure.json",
      "schema": "issuescratch.opcode-json-projection-procedure.v1",
      "access": "Read the complete JSON document at this repository-relative path. It defines the language-independent projection algorithm.",
      "authority": "Authoritative projection subprocedure referenced by this unified procedure; do not replace it with implementation code or a summary."
    }
  },
  "agent_input_validation": {
    "document_ref": "docs/agent-input-validation-procedure.json",
    "schema": "issuescratch.agent-input-validation-procedure.v1",
    "scope": "Structural acceptance/rejection only; semantic quality is excluded. Handled rejections terminate validation successfully without advancement.",
    "implementation_status": "specified_not_implemented"
  }
}

~~~~

### `docs/agent-input-validation-procedure.json`
Blob SHA: `19c203e955660feb4b39aaf7653e46198dfc0b87`

~~~~json
{
  "schema": "issuescratch.agent-input-validation-procedure.v1",
  "version": "1.1.0",
  "purpose": "Define the admissible agent-submission band and deterministic rejection responses. This is an input-validation specification; it does not implement a validator.",
  "boundary": {
    "machine_validation": "JSON syntax, envelope shape, current-index structural fields and supplied progression identity/prefix predicates only.",
    "semantic_validation": "None. Do not evaluate meaning, quality, correctness, usefulness, reasoning depth, source interpretation, or whether the task is substantively complete.",
    "semantic_fields": "A field named semantic_completion or final_output does not authorize semantic evaluation; only explicitly declared structural type/presence predicates apply.",
    "termination": "Both accepted and rejected submissions are successfully processed validation outcomes. Rejection is not a process crash, acceptance or advancement. Infrastructure failures remain explicit execution failures."
  },
  "inputs": {
    "payload_text": "Complete candidate JSON text supplied as a value by the caller, regardless of its origin.",
    "source_identity": "Opaque submission/context identity supplied by the caller; it identifies a logical validation context, not an input location.",
    "state_snapshot": "Current accepted prefix and expected index supplied as values; this procedure neither retrieves nor persists state.",
    "procedure": "Current procedure object and structural definitions supplied as values.",
    "bound_operation": "Supplied operator/mode when the structural output schema depends on it."
  },
  "shared_definitions": {
    "wrapper": {
      "type": "object",
      "exact_keys": [
        "scratchpad"
      ],
      "scratchpad": {
        "type": "object",
        "nonempty": true
      }
    },
    "types": {
      "object": "non-null, non-array JSON object",
      "array": "JSON array",
      "nonempty_string": "JSON string with at least one non-whitespace character",
      "string": "JSON string",
      "conditional": "Evaluate only its declared structural applicability rule; never guess from semantic prose"
    },
    "error": {
      "fields": [
        "code",
        "message",
        "pointer",
        "expected",
        "observed"
      ],
      "pointer": "RFC 6901 pointer to failing input; empty string for root or parse failure",
      "observed": "Type/shape summary, not an echo of the full submission"
    },
    "result": {
      "fields": [
        "execution_status",
        "input_status",
        "accepted",
        "advance_allowed",
        "errors"
      ],
      "execution_status": [
        "succeeded",
        "failed"
      ],
      "input_status": [
        "accepted",
        "rejected",
        "not_evaluated"
      ]
    },
    "preserved_prefix": "Compare parsed JSON values using the prefix representation and equality/hash convention supplied with the validation context. Formatting-only differences are not substantive prefix changes."
  },
  "accepted_band": {
    "all_required": true,
    "predicates": [
      {
        "id": "V01",
        "check": "payload_text parses as exactly one JSON value without Markdown fences, prose or trailing non-whitespace text",
        "error": "INVALID_JSON"
      },
      {
        "id": "V02",
        "check": "root is one JSON array",
        "error": "INVALID_ROOT"
      },
      {
        "id": "V03",
        "check": "every root entry satisfies shared_definitions.wrapper",
        "error": "INVALID_WRAPPER"
      },
      {
        "id": "V04",
        "check": "supplied candidate identity matches the expected logical context identity supplied by the caller",
        "error": "SOURCE_MISMATCH"
      },
      {
        "id": "V05",
        "check": "candidate adds exactly one entry at the supplied expected index and stays within the supplied progression protocol",
        "error": "OUT_OF_SEQUENCE"
      },
      {
        "id": "V06",
        "check": "previously accepted prefix matches the supplied accepted-prefix value/hash",
        "error": "PREFIX_CHANGED"
      },
      {
        "id": "V07",
        "check": "current index exists uniquely in current procedure; resolve definition_ref using current index_contract_reference_rules",
        "error": "CONTRACT_UNAVAILABLE",
        "classification": "execution failure if canonical configuration is absent or contradictory; do not blame agent input"
      },
      {
        "id": "V08",
        "check": "new scratchpad satisfies the current resolved output.scratchpad_contract structural requirements",
        "error": "INVALID_FIELD"
      },
      {
        "id": "V09",
        "check": "conditional/operator-specific output fields satisfy their supplied structural schema, when applicable",
        "error": "INVALID_OPERATION_OUTPUT"
      }
    ],
    "non_predicates": [
      "Whether a string is true or a good answer",
      "Whether framing is deep or original",
      "Whether an opcode was semantically executed",
      "Whether the final deliverable actually satisfies the user",
      "Whether cited evidence supports a substantive claim"
    ],
    "nonempty_rule": "Only enforce nonempty content where explicitly specified; empty arrays/objects are not automatically invalid for every field.",
    "unknown_fields": "Do not reject additional substantive scratchpad fields unless an exact-key rule explicitly prohibits them; outer wrapper remains exact-key.",
    "missing_schema": "If a required structural rule cannot be resolved unambiguously, terminate with an explicit configuration failure instead of inventing a schema or treating the agent submission as invalid."
  },
  "per_index_binding": {
    "iteration": "For each current index_contracts record, identify by index/contract_id rather than a saved positional pointer table.",
    "resolve": "Resolve its current definition_ref recursively with exact conflict/cycle checks.",
    "structural_source": "Resolved output.scratchpad_contract supplies required field names, types, nested required_fields, exact wrapper/length requirements and explicit coverage requirements.",
    "criteria_exclusion": "Never execute semantic_completion.stage_criteria or shared semantic criteria as acceptance predicates.",
    "preparation": "Use the declared five-part preparation shape and its explicitly defined field/type requirements.",
    "framing": "Use the declared reference-A/reference-B/result output shape. Supplied operator and mode determine only the applicable output-field schema, not a semantic verdict.",
    "reconciliation": "Check declared coverage arrays and field structures; do not determine whether reconciliation is substantively adequate.",
    "final": "Check the final field types and any conditional output-data structures declared by the supplied contract. Structural acceptance does not establish semantic success or actual delivery.",
    "unsupported_rule_language": "Unsupported or ambiguous schema clauses are configuration failures, not implied authorization for model judgment."
  },
  "error_catalog": {
    "INVALID_JSON": "Invalid JSON. Submit one JSON array without Markdown fences or surrounding text.",
    "INVALID_ROOT": "Invalid root type. Expected one JSON array.",
    "INVALID_WRAPPER": "Invalid entry wrapper. Expected exactly one nonempty scratchpad object.",
    "SOURCE_MISMATCH": "Submission identity does not match the supplied validation context.",
    "OUT_OF_SEQUENCE": "Invalid entry count or index. Submit only the requested next entry.",
    "PREFIX_CHANGED": "Previously accepted entries were changed. Preserve the accepted prefix.",
    "INVALID_FIELD": "Missing or invalid field. Correct the field identified by pointer and expected type.",
    "INVALID_OPERATION_OUTPUT": "Output does not match the structural fields required by the supplied operation or mode.",
    "CONTRACT_UNAVAILABLE": "Validation configuration unavailable or inconsistent. No acceptance decision was made.",
    "EXECUTION_UNAVAILABLE": "Required input, state or configuration values were not supplied. No acceptance decision was made."
  },
  "procedure": [
    {
      "step_id": "IV01",
      "opcode": "OP.01.015",
      "action": "bind_supplied_input",
      "inputs": [
        "payload_text",
        "source_identity",
        "state_snapshot",
        "procedure",
        "bound_operation"
      ],
      "result_ref": "bound_input",
      "reason": "Bind the supplied candidate and validation context; do not retrieve input or rely on an agent acceptance claim."
    },
    {
      "step_id": "IV02",
      "opcode": "OP.01.014",
      "action": "validate_syntax_and_envelope",
      "inputs": [
        "bound_input"
      ],
      "checks": [
        "V01",
        "V02",
        "V03"
      ],
      "result_ref": "envelope_result",
      "on_invalid": "Return rejected result with a specific error; terminate successfully.",
      "reason": "Malformed envelopes are outside the admissible band regardless of meaning."
    },
    {
      "step_id": "IV03",
      "opcode": "OP.01.014",
      "action": "validate_progression",
      "inputs": [
        "bound_input",
        "envelope_result"
      ],
      "checks": [
        "V04",
        "V05",
        "V06"
      ],
      "result_ref": "progression_result",
      "on_invalid": "Return rejected result without advancement; terminate successfully.",
      "reason": "A valid JSON value is not sufficient if it edits accepted history or skips the requested entry."
    },
    {
      "step_id": "IV04",
      "opcode": "OP.01.015",
      "action": "resolve_current_structural_contract",
      "inputs": [
        "procedure",
        "progression_result"
      ],
      "checks": [
        "V07"
      ],
      "result_ref": "structural_contract",
      "on_failure": "Return failed/not_evaluated configuration result; no advancement.",
      "reason": "Input shape follows the current supplied contract rather than a duplicated fixed list of schemas."
    },
    {
      "step_id": "IV05",
      "opcode": "OP.01.014",
      "action": "validate_declared_structural_fields",
      "inputs": [
        "bound_input",
        "structural_contract"
      ],
      "checks": [
        "V08",
        "V09"
      ],
      "result_ref": "field_result",
      "on_invalid": "Return rejected result with pointer/type errors; terminate successfully.",
      "reason": "Only declared mechanical predicates narrow acceptance. Semantic claims are not judged."
    },
    {
      "step_id": "IV06",
      "opcode": "OP.01.016",
      "action": "emit_accepted_result",
      "inputs": [
        "field_result"
      ],
      "result": {
        "execution_status": "succeeded",
        "input_status": "accepted",
        "accepted": true,
        "advance_allowed": true,
        "errors": []
      },
      "reason": "Return structural acceptance as a value. The caller decides whether a separately configured state-management operation consumes it."
    }
  ],
  "outcomes": {
    "accepted": {
      "execution_status": "succeeded",
      "input_status": "accepted",
      "accepted": true,
      "advance_allowed": true,
      "errors": []
    },
    "rejected": {
      "execution_status": "succeeded",
      "input_status": "rejected",
      "accepted": false,
      "advance_allowed": false,
      "errors": "One or more specific error records; preserve accepted state."
    },
    "execution_failure": {
      "execution_status": "failed",
      "input_status": "not_evaluated",
      "accepted": false,
      "advance_allowed": false,
      "errors": "Explicit source/state/configuration failure; do not call this a semantic rejection."
    }
  },
  "examples": [
    {
      "case": "Malformed JSON",
      "body": "[{",
      "outcome": "rejected",
      "code": "INVALID_JSON",
      "execution_status": "succeeded"
    },
    {
      "case": "Valid JSON object instead of array",
      "body": "{}",
      "outcome": "rejected",
      "code": "INVALID_ROOT",
      "execution_status": "succeeded"
    },
    {
      "case": "Empty scratchpad",
      "body": "[{\"scratchpad\":{}}]",
      "outcome": "rejected",
      "code": "INVALID_WRAPPER",
      "execution_status": "succeeded"
    },
    {
      "case": "Correct structure with a factually wrong or low-quality answer",
      "precondition": "Every declared machine predicate passes",
      "outcome": "accepted",
      "execution_status": "succeeded",
      "meaning": "No semantic endorsement."
    },
    {
      "case": "Missing required current contract",
      "outcome": "not_evaluated",
      "execution_status": "failed",
      "code": "CONTRACT_UNAVAILABLE"
    }
  ],
  "environment_boundary": {
    "scope": "Pure procedure over supplied in-memory values; independent of storage, transport, hosting service, user interface and delivery destination.",
    "caller_responsibility": "A separately configured adapter obtains inputs and receives results. This procedure does not choose, describe or access those locations.",
    "input_rule": "Inputs are values passed to this procedure; names and references identify logical data, not physical sources.",
    "output_rule": "Return result values to the caller. EMIT means returning/serializing a value; it does not mean writing a file, posting a comment or sending a message.",
    "references": "RFC 6901 references resolve within the supplied procedure object only, without external retrieval.",
    "configuration": "Concrete input/output bindings and adapter implementations belong in a separate configuration document."
  }
}

~~~~

### `docs/index-projection-procedure.json`
Blob SHA: `6c2baaf8cf836be0446fe3bac5dbc32bed388285`

~~~~json
{
  "schema": "issuescratch.opcode-json-projection-procedure.v1",
  "authority": "Canonical language-independent projection procedure. JavaScript, Python or another implementation must realize these steps; implementation code does not define their meaning.",
  "purpose": "Derive per-index agent-facing projection data from current procedure content while defining shared content once.",
  "representation": {
    "ref": "Named runtime value or prior result; never executable source code",
    "literal": "Exact constant JSON value",
    "field": "Object field lookup; missing fields fail unless explicitly optional",
    "operations": "OP.01 opcodes name registered operations. action binds the opcode to the fixed algorithm described here. No implicit semantic inference."
  },
  "inputs": {
    "procedure": "Current complete canonical procedure JSON object",
    "supplied_inputs_by_index": "Optional externally supplied substantive inputs keyed by index"
  },
  "outputs": {
    "shared": "Resolved common agent requirements, once",
    "shared_semantic_criteria": "Current criterion definitions referenced by shared criteria IDs",
    "definitions": "Distinct index-specific projection bodies, once each",
    "index_projections": "Ordered index identity, projection key and supplied substantive inputs when present"
  },
  "invariants": [
    "Read current procedure values at invocation time; do not save an index-position pointer table.",
    "Preserve procedure wording and JSON values without paraphrase.",
    "Preserve input index order and identities; no fixed number of indices.",
    "Do not infer or choose a framing operator, abstraction mode or substantive input.",
    "This procedure neither renders UI nor advances state.",
    "Reject missing references, cycles, conflicting inheritance, duplicate identities and missing criteria; do not emit a partial successful result."
  ],
  "steps": [
    {
      "step_id": "P01",
      "opcode": "OP.01.014",
      "action": "validate_inputs",
      "operands": {
        "procedure": {
          "ref": "procedure"
        },
        "required_fields": {
          "literal": [
            "index_contracts",
            "index_contract_definitions",
            "shared_semantic_completion_criteria"
          ]
        },
        "predicates": {
          "literal": [
            "procedure is an object",
            "index_contracts is an array",
            "index_contract_definitions.common is an object",
            "shared_semantic_completion_criteria is an array",
            "supplied_inputs_by_index is an object when supplied"
          ]
        }
      },
      "result_ref": "validated_inputs",
      "depends_on": [],
      "reason": "Establish actual sources and reject malformed input before deriving any instructions."
    },
    {
      "step_id": "P02",
      "opcode": "OP.01.011",
      "action": "apply_subprocedure",
      "operands": {
        "function": {
          "literal": "RESOLVE"
        },
        "arguments": {
          "source": {
            "field": [
              {
                "ref": "procedure"
              },
              {
                "literal": "index_contract_definitions"
              },
              {
                "literal": "common"
              }
            ]
          },
          "procedure": {
            "ref": "procedure"
          },
          "reference_chain": {
            "literal": []
          }
        }
      },
      "result_ref": "common",
      "depends_on": [
        "P01"
      ],
      "reason": "Obtain shared obligations from their current definition rather than repeating or rewriting them."
    },
    {
      "step_id": "P03",
      "opcode": "OP.01.003",
      "action": "initialize_projection_accumulator",
      "operands": {
        "value": {
          "literal": {
            "definitions": {},
            "signature_to_key": {},
            "index_projections": [],
            "seen_contract_ids": [],
            "seen_indices": []
          }
        }
      },
      "result_ref": "accumulator",
      "depends_on": [
        "P02"
      ],
      "reason": "Maintain one lookup for distinct content while preserving separately ordered index occurrences."
    },
    {
      "step_id": "P04",
      "opcode": "OP.01.013",
      "action": "iterate_current_indices",
      "operands": {
        "items": {
          "field": [
            {
              "ref": "procedure"
            },
            {
              "literal": "index_contracts"
            }
          ]
        },
        "item_name": {
          "literal": "contract"
        },
        "state": {
          "ref": "accumulator"
        },
        "body": {
          "literal": "PROJECT_ONE"
        },
        "stop": {
          "literal": "after every supplied index contract; no invented or fixed index count"
        }
      },
      "result_ref": "projected",
      "depends_on": [
        "P03"
      ],
      "reason": "Each occurrence is projected from its actual current contract; repeated content reuses a definition."
    },
    {
      "step_id": "P05",
      "opcode": "OP.01.015",
      "action": "resolve_criteria_by_identity",
      "operands": {
        "ids": {
          "field": [
            {
              "ref": "common"
            },
            {
              "literal": "semantic_completion"
            },
            {
              "literal": "criteria_refs"
            }
          ]
        },
        "catalog": {
          "field": [
            {
              "ref": "procedure"
            },
            {
              "literal": "shared_semantic_completion_criteria"
            }
          ]
        },
        "match_field": {
          "literal": "id"
        },
        "cardinality": {
          "literal": "exactly one definition per requested ID"
        },
        "order": {
          "literal": "requested criterion ID order"
        }
      },
      "result_ref": "criteria",
      "depends_on": [
        "P02"
      ],
      "reason": "Array position must not determine which criterion a reference means."
    },
    {
      "step_id": "P06",
      "opcode": "OP.01.016",
      "action": "emit_projection",
      "operands": {
        "schema": {
          "literal": "issuescratch.dynamic-index-projection.v1"
        },
        "shared": {
          "ref": "common"
        },
        "shared_semantic_criteria": {
          "ref": "criteria"
        },
        "definitions": {
          "field": [
            {
              "ref": "projected"
            },
            {
              "literal": "definitions"
            }
          ]
        },
        "index_projections": {
          "field": [
            {
              "ref": "projected"
            },
            {
              "literal": "index_projections"
            }
          ]
        }
      },
      "result_ref": "projection",
      "depends_on": [
        "P04",
        "P05"
      ],
      "reason": "Return concrete projection data for a renderer, without claiming that UI rendering or task execution occurred."
    }
  ],
  "subprocedures": {
    "RESOLVE": {
      "inputs": [
        "source",
        "procedure",
        "reference_chain"
      ],
      "steps": [
        {
          "step_id": "R01",
          "opcode": "OP.01.014",
          "action": "validate_definition",
          "operands": {
            "source": {
              "ref": "source"
            },
            "predicate": {
              "literal": "source must be a non-null non-array object"
            }
          },
          "result_ref": "definition",
          "depends_on": [],
          "reason": "Only objects can supply contract fields."
        },
        {
          "step_id": "R02",
          "opcode": "OP.01.012",
          "action": "branch_on_definition_reference",
          "operands": {
            "condition": {
              "has_field": [
                {
                  "ref": "source"
                },
                {
                  "literal": "definition_ref"
                }
              ]
            },
            "absent": {
              "literal": "Return a deep copy of source"
            },
            "present": {
              "literal": "Continue R03–R05"
            }
          },
          "result_ref": "branch",
          "depends_on": [
            "R01"
          ],
          "reason": "Unreferenced definitions are already concrete; referenced definitions need explicit resolution."
        },
        {
          "step_id": "R03",
          "opcode": "OP.01.015",
          "action": "resolve_local_pointer",
          "operands": {
            "pointer": {
              "field": [
                {
                  "ref": "source"
                },
                {
                  "literal": "definition_ref"
                }
              ]
            },
            "root": {
              "ref": "procedure"
            },
            "rules": {
              "literal": [
                "Require #/ local RFC 6901 pointer",
                "Decode ~1 and ~0; reject malformed escapes",
                "Traverse own fields only; missing target fails",
                "Reject a pointer already in reference_chain"
              ]
            }
          },
          "result_ref": "parent_source",
          "depends_on": [
            "R02"
          ],
          "reason": "Resolve against the current document and prevent stale targets or recursive loops."
        },
        {
          "step_id": "R04",
          "opcode": "OP.01.011",
          "action": "apply_subprocedure",
          "operands": {
            "function": {
              "literal": "RESOLVE"
            },
            "arguments": {
              "source": {
                "ref": "parent_source"
              },
              "procedure": {
                "ref": "procedure"
              },
              "reference_chain": {
                "literal": "prior chain plus the current definition_ref value"
              }
            }
          },
          "result_ref": "parent",
          "depends_on": [
            "R03"
          ],
          "reason": "Follow the full inheritance chain; one level of lookup would omit obligations."
        },
        {
          "step_id": "R05",
          "opcode": "OP.01.011",
          "action": "apply_subprocedure",
          "operands": {
            "function": {
              "literal": "MERGE_EXACT"
            },
            "arguments": {
              "left": {
                "ref": "parent"
              },
              "right": {
                "literal": "deep copy of source excluding definition_ref"
              }
            }
          },
          "result_ref": "resolved",
          "depends_on": [
            "R04"
          ],
          "reason": "Compose inherited and local fields without permitting silent overrides."
        }
      ]
    },
    "MERGE_EXACT": {
      "inputs": [
        "left",
        "right"
      ],
      "algorithm": [
        "Start with a deep copy of left.",
        "For each own field in right: if absent in left, copy its complete value.",
        "If both values are objects, recursively apply MERGE_EXACT.",
        "Treat arrays and scalar values atomically. Existing atomic values must be equal; otherwise fail with the conflicting field.",
        "Reject unsafe prototype-related field names; do not mutate either input."
      ],
      "reason": "Inheritance is composition of compatible obligations, not permission to replace them."
    },
    "SUBTRACT_COMMON": {
      "inputs": [
        "resolved_contract",
        "common"
      ],
      "algorithm": [
        "For every resolved contract field absent from common, retain the complete field.",
        "For object fields present in both, recurse and retain only nonempty differences.",
        "For atomic fields present in both, require structural equality; omit equal fields and fail on disagreement.",
        "Remove contract_id and index from the resulting reusable content body; retain those identities on the index occurrence."
      ],
      "reason": "Shared obligations are defined once; index identity must not prevent reuse of otherwise identical content."
    },
    "PROJECT_ONE": {
      "inputs": [
        "contract",
        "procedure",
        "common",
        "accumulator",
        "supplied_inputs_by_index"
      ],
      "steps": [
        {
          "step_id": "I01",
          "opcode": "OP.01.011",
          "action": "apply_subprocedure",
          "operands": {
            "function": {
              "literal": "RESOLVE"
            },
            "arguments": {
              "source": {
                "ref": "contract"
              },
              "procedure": {
                "ref": "procedure"
              },
              "reference_chain": {
                "literal": []
              }
            }
          },
          "result_ref": "effective_contract",
          "depends_on": [],
          "reason": "Read the current effective semantic contract, including inherited fields."
        },
        {
          "step_id": "I02",
          "opcode": "OP.01.014",
          "action": "validate_identity",
          "operands": {
            "source": {
              "ref": "effective_contract"
            },
            "predicates": {
              "literal": [
                "index is a nonnegative safe integer",
                "contract_id is a string",
                "index and contract_id have not occurred previously"
              ]
            }
          },
          "result_ref": "identity",
          "depends_on": [
            "I01"
          ],
          "reason": "Preserve unambiguous index occurrences even when their content is shared."
        },
        {
          "step_id": "I03",
          "opcode": "OP.01.011",
          "action": "apply_subprocedure",
          "operands": {
            "function": {
              "literal": "SUBTRACT_COMMON"
            },
            "arguments": {
              "resolved_contract": {
                "ref": "effective_contract"
              },
              "common": {
                "ref": "common"
              }
            }
          },
          "result_ref": "unique_content",
          "depends_on": [
            "I02"
          ],
          "reason": "Isolate only the work that differs from shared obligations."
        },
        {
          "step_id": "I04",
          "opcode": "OP.01.006",
          "action": "compare_projection_content",
          "operands": {
            "candidate": {
              "ref": "unique_content"
            },
            "existing": {
              "field": [
                {
                  "ref": "accumulator"
                },
                {
                  "literal": "definitions"
                }
              ]
            },
            "equality": {
              "literal": "Structural JSON equality: object key order ignored; array order and scalar types preserved"
            }
          },
          "result_ref": "existing_projection_key_or_absent",
          "depends_on": [
            "I03"
          ],
          "reason": "Repeated framing roles reuse content; changed work receives its own derived projection."
        },
        {
          "step_id": "I05",
          "opcode": "OP.01.012",
          "action": "reuse_or_define_projection",
          "operands": {
            "condition": {
              "literal": "I04 found equal content"
            },
            "if_true": {
              "literal": "Reuse its projection key"
            },
            "if_false": {
              "literal": "Allocate projection_(distinct-definition-count + 1), save unique_content once, and retain the content-to-key association"
            }
          },
          "result_ref": "projection_key",
          "depends_on": [
            "I04"
          ],
          "reason": "Keys are derived at invocation time rather than fixed to old procedure positions."
        },
        {
          "step_id": "I06",
          "opcode": "OP.01.003",
          "action": "append_index_projection",
          "operands": {
            "record_fields": {
              "literal": [
                "index from effective_contract",
                "contract_id from effective_contract",
                "projection_key from I05",
                "supplied_inputs only when externally present for that index"
              ]
            },
            "effects": {
              "literal": [
                "Append occurrence in current input order",
                "Record seen index and contract_id",
                "Preserve supplied values without inventing defaults"
              ]
            }
          },
          "result_ref": "updated_accumulator",
          "depends_on": [
            "I05"
          ],
          "reason": "Bind unique work and external substantive inputs to this occurrence without copying shared definitions."
        }
      ]
    }
  },
  "failure_contract": {
    "outcome": "error, not successful projection",
    "required_information": [
      "failed step or subprocedure",
      "missing reference, conflicting field or invalid identity",
      "observed failure"
    ],
    "partial_output": "Do not return partial data as a complete projection."
  },
  "environment_boundary": {
    "scope": "Pure procedure over supplied in-memory values; independent of storage, transport, hosting service, user interface and delivery destination.",
    "caller_responsibility": "A separately configured adapter obtains inputs and receives results. This procedure does not choose, describe or access those locations.",
    "input_rule": "Inputs are values passed to this procedure; names and references identify logical data, not physical sources.",
    "output_rule": "Return result values to the caller. EMIT means returning/serializing a value; it does not mean writing a file, posting a comment or sending a message.",
    "references": "RFC 6901 references resolve within the supplied procedure object only, without external retrieval.",
    "configuration": "Concrete input/output bindings and adapter implementations belong in a separate configuration document."
  }
}

~~~~

### `config/workflow-routing.json`
Blob SHA: `aca893ad833232ddc7b80c60b053b934cdfb6060`

~~~~json
{
  "schema": "issuescratch.workflow-routing-config.v1",
  "version": "1.0.0",
  "purpose": "Concrete deployment bindings for the otherwise source/destination-agnostic projection and input-validation procedures.",
  "status": "consumed_by_workflow_live_scan_verified",
  "inspected_implementation": {
    "workflow": ".github/workflows/issue1-json-validator.yml",
    "blob_sha": "fc11d6cbc5cc5efc0f1f005830f0de7c8b3451ce",
    "repository": "BestNameYet/IssueScratch"
  },
  "procedure_documents": {
    "projection": "docs/index-projection-procedure.json",
    "validation": "docs/agent-input-validation-procedure.json"
  },
  "expression_contract": {
    "argument": "Resolve a declared invocation argument; missing required arguments fail before I/O.",
    "value": "Resolve a named prior operation result or caller-supplied derived value.",
    "item": "Resolve a field of the current iteration item.",
    "concat": "Concatenate evaluated strings; no evaluation of source code.",
    "format_index": "Format a supplied nonnegative integer as a decimal string padded to at least two digits.",
    "path_guard": "All repository output paths must pass the configured guard before use."
  },
  "defaults": {
    "owner": "BestNameYet",
    "repo": "IssueScratch",
    "issue_number": 1,
    "branch": "main",
    "page_size": 100,
    "workspace_root": "workspaces/issue1-diagnostics/comments"
  },
  "invocation_arguments": {
    "owner": {
      "type": "string",
      "default_ref": "defaults.owner"
    },
    "repo": {
      "type": "string",
      "default_ref": "defaults.repo"
    },
    "issue_number": {
      "type": "positive_integer",
      "default_ref": "defaults.issue_number"
    },
    "branch": {
      "type": "string",
      "default_ref": "defaults.branch"
    },
    "event_name": {
      "type": "string",
      "required": true
    },
    "event_action": {
      "type": "string",
      "required_when": "event_name == issue_comment"
    },
    "event_issue_number": {
      "type": "positive_integer",
      "required_when": "event_name == issue_comment"
    },
    "event_comment_id": {
      "type": "positive_safe_integer",
      "required_when": "event_name == issue_comment"
    },
    "workspace_root": {
      "type": "safe_repository_relative_path",
      "default_ref": "defaults.workspace_root"
    },
    "page_size": {
      "type": "integer_1_to_100",
      "default_ref": "defaults.page_size"
    },
    "credential": {
      "type": "runtime_credential_handle",
      "required": true,
      "storage": "Never serialize a token into this configuration; workflow supplies its authorized credential."
    }
  },
  "triggers": {
    "issue_comment": {
      "actions": [
        "created",
        "edited"
      ],
      "guard": {
        "equal": [
          {
            "argument": "event_issue_number"
          },
          {
            "argument": "issue_number"
          }
        ]
      },
      "input_route": "event_comment"
    },
    "push": {
      "input_route": "scan_issue_comments",
      "scope": "Existing workflow path filters remain authoritative; this file does not alter workflow triggers."
    },
    "workflow_dispatch": {
      "input_route": "scan_issue_comments"
    }
  },
  "input_routes": {
    "event_comment": {
      "operation": "issues.getComment",
      "arguments": {
        "owner": {
          "argument": "owner"
        },
        "repo": {
          "argument": "repo"
        },
        "comment_id": {
          "argument": "event_comment_id"
        }
      },
      "output": "candidate_comments",
      "normalization": "Wrap returned current comment in a one-item collection; event payload body is not trusted as current."
    },
    "scan_issue_comments": {
      "operation": "issues.listComments",
      "arguments": {
        "owner": {
          "argument": "owner"
        },
        "repo": {
          "argument": "repo"
        },
        "issue_number": {
          "argument": "issue_number"
        },
        "per_page": {
          "argument": "page_size"
        }
      },
      "pagination": "Fetch every page via the API pagination mechanism before ending the scan.",
      "output": "candidate_comments"
    },
    "current_comment": {
      "operation": "issues.getComment",
      "arguments": {
        "owner": {
          "argument": "owner"
        },
        "repo": {
          "argument": "repo"
        },
        "comment_id": {
          "item": "id"
        }
      },
      "output": "current_comment",
      "reason": "Re-fetch each candidate so an edited event or scan snapshot cannot supply a stale body."
    },
    "repository_json": {
      "operation": "repos.getContent",
      "arguments": {
        "owner": {
          "argument": "owner"
        },
        "repo": {
          "argument": "repo"
        },
        "path": {
          "value": "repository_path"
        },
        "ref": {
          "argument": "branch"
        }
      },
      "decode": "Require file/base64; decode UTF-8 and parse JSON.",
      "not_found": "Return absent; distinguish from authorization or network failures."
    }
  },
  "iteration": {
    "source": "candidate_comments",
    "mode": "sequential",
    "identity_field": "id",
    "skip": {
      "predicate": "Parsed body has schema issuescratch.frame-control-comment.v1",
      "reason": "Do not consume controller replies as new agent submissions."
    },
    "per_item": [
      {
        "route": "current_comment",
        "result": "current_comment"
      },
      {
        "derive": "source_comment_id",
        "from": "current_comment.id"
      },
      {
        "derive": "payload_text",
        "from": "current_comment.body",
        "default": ""
      },
      {
        "derive": "source_identity",
        "fields": {
          "owner": {
            "argument": "owner"
          },
          "repo": {
            "argument": "repo"
          },
          "issue_number": {
            "argument": "issue_number"
          },
          "comment_id": {
            "value": "source_comment_id"
          }
        }
      },
      {
        "derive": "source_revision_sha256",
        "algorithm": "SHA-256 over exact UTF-8 payload_text"
      },
      {
        "route": "repository_json",
        "path_binding": "paths.state",
        "result": "state_snapshot",
        "absent": "Use the separately defined initial-state contract; never invent prior accepted progress."
      },
      {
        "invoke": "validation",
        "arguments": {
          "payload_text": {
            "value": "payload_text"
          },
          "source_identity": {
            "value": "source_identity"
          },
          "state_snapshot": {
            "value": "state_snapshot"
          },
          "procedure": {
            "value": "current_procedure"
          },
          "bound_operation": {
            "value": "issued_operation"
          }
        }
      },
      {
        "invoke": "projection",
        "arguments": {
          "procedure": {
            "value": "current_procedure"
          },
          "supplied_inputs_by_index": {
            "value": "substantive_inputs_by_index"
          }
        },
        "when": "A next agent-facing step is required by the separately defined state protocol."
      }
    ],
    "recovery": "Reuse persisted source identity, instruction, draw and reply records. Do not create a new source comment or reroll to recover a partial delivery."
  },
  "paths": {
    "root": {
      "concat": [
        {
          "argument": "workspace_root"
        },
        "/",
        {
          "value": "source_comment_id"
        }
      ]
    },
    "state": {
      "concat": [
        {
          "argument": "workspace_root"
        },
        "/",
        {
          "value": "source_comment_id"
        },
        "/state.json"
      ]
    },
    "revision": {
      "concat": [
        {
          "argument": "workspace_root"
        },
        "/",
        {
          "value": "source_comment_id"
        },
        "/revisions/",
        {
          "value": "source_revision_sha256"
        },
        ".json"
      ]
    },
    "instruction": {
      "concat": [
        {
          "argument": "workspace_root"
        },
        "/",
        {
          "value": "source_comment_id"
        },
        "/instructions/",
        {
          "format_index": {
            "value": "target_index"
          }
        },
        ".json"
      ]
    },
    "publication_receipt": {
      "concat": [
        {
          "argument": "workspace_root"
        },
        "/",
        {
          "value": "source_comment_id"
        },
        "/published-artifacts/",
        {
          "value": "source_revision_sha256"
        },
        ".json"
      ]
    }
  },
  "output_arguments": {
    "target_index": "Next index supplied by state protocol; not chosen by routing.",
    "repository_path": "Evaluated configured path for the selected output route.",
    "record_value": "Structured result supplied by diagnostics/state/instruction/publication logic.",
    "existing_blob_sha": "Current destination blob SHA, read before replacing a repository file.",
    "known_reply_id": "Existing progression.controller_comment_id when present.",
    "rendered_body": "Complete instruction/comment body supplied by renderer; routing does not author semantic text.",
    "artifact_path": "Exact explicitly authorized target path supplied by verified publication plan.",
    "artifact_content": "Full UTF-8 content supplied by verified publication plan.",
    "summary_rows": "Per-input acceptance/rejection/error report supplied by validation and persistence functions."
  },
  "output_routes": {
    "state": {
      "operation": "repository_json_write",
      "path_binding": "paths.state",
      "mode": "create_or_replace_with_current_blob_sha",
      "required_readback": true
    },
    "diagnostic": {
      "operation": "repository_json_write",
      "path_binding": "paths.revision",
      "mode": "immutable_create_or_require_exact_existing_value",
      "required_readback": true
    },
    "instruction": {
      "operation": "repository_json_write",
      "path_binding": "paths.instruction",
      "mode": "immutable_create_or_require_exact_existing_value",
      "required_readback": true
    },
    "controller_reply": {
      "destination": {
        "owner": {
          "argument": "owner"
        },
        "repo": {
          "argument": "repo"
        },
        "issue_number": {
          "argument": "issue_number"
        }
      },
      "lookup_order": [
        "Use known_reply_id if present and verify its source linkage.",
        "Otherwise paginate comments in configured issue and locate the existing controller record whose source_comment_id matches.",
        "If no matching reply exists, create one in the configured issue."
      ],
      "create": {
        "operation": "issues.createComment",
        "arguments": {
          "owner": {
            "argument": "owner"
          },
          "repo": {
            "argument": "repo"
          },
          "issue_number": {
            "argument": "issue_number"
          },
          "body": {
            "value": "rendered_body"
          }
        }
      },
      "update": {
        "operation": "issues.updateComment",
        "arguments": {
          "owner": {
            "argument": "owner"
          },
          "repo": {
            "argument": "repo"
          },
          "comment_id": {
            "value": "resolved_reply_id"
          },
          "body": {
            "value": "rendered_body"
          }
        }
      },
      "verify": {
        "operation": "issues.getComment",
        "arguments": {
          "owner": {
            "argument": "owner"
          },
          "repo": {
            "argument": "repo"
          },
          "comment_id": {
            "value": "resolved_reply_id"
          }
        },
        "predicate": "Saved body equals intended rendered_body."
      },
      "history": "Preserve source-linked controller history using the existing publication contract; no duplicate source-revision/target-index entry."
    },
    "validation_report": {
      "operation": "workflow_summary",
      "arguments": {
        "rows": {
          "value": "summary_rows"
        }
      },
      "current_behavior": "Existing workflow reports malformed/rejected inputs in saved diagnostics and workflow warnings/summary; it does not currently publish a dedicated correction comment.",
      "source_comment_mutation": false
    },
    "artifacts": {
      "operation": "repos.createOrUpdateFileContents",
      "arguments": {
        "owner": {
          "argument": "owner"
        },
        "repo": {
          "argument": "repo"
        },
        "branch": {
          "argument": "branch"
        },
        "path": {
          "value": "artifact_path"
        },
        "content": {
          "encoding": "base64_utf8",
          "value": {
            "value": "artifact_content"
          }
        },
        "sha": {
          "value": "existing_blob_sha"
        }
      },
      "sha_rule": "Omit sha only for verified absent destination.",
      "guard": "Only a completed verified publication plan may invoke; routing configuration does not authorize arbitrary artifact paths.",
      "required_readback": "Read same branch/path and compare exact UTF-8 bytes and digest."
    },
    "publication_receipt": {
      "operation": "repository_json_write",
      "path_binding": "paths.publication_receipt",
      "mode": "immutable_create_or_require_exact_existing_value",
      "required_readback": true
    }
  },
  "repository_json_write": {
    "operation": "repos.createOrUpdateFileContents",
    "arguments": {
      "owner": {
        "argument": "owner"
      },
      "repo": {
        "argument": "repo"
      },
      "branch": {
        "argument": "branch"
      },
      "path": {
        "value": "repository_path"
      },
      "content": {
        "encoding": "base64",
        "serialization": "JSON.stringify(record_value,null,2) + newline"
      },
      "sha": {
        "value": "existing_blob_sha"
      }
    },
    "preconditions": [
      "Evaluate and validate configured path.",
      "Fetch existing destination from the same branch.",
      "Require JSON object root for state/diagnostic/instruction/receipt records.",
      "For immutable routes require exact equality if present, never overwrite a conflict."
    ],
    "verification": {
      "operation": "repos.getContent",
      "arguments": {
        "owner": {
          "argument": "owner"
        },
        "repo": {
          "argument": "repo"
        },
        "path": {
          "value": "repository_path"
        },
        "ref": {
          "argument": "branch"
        }
      },
      "test": "Decode and compare saved JSON to record_value."
    }
  },
  "guards": {
    "paths": [
      "Repository-relative; no absolute path, empty segment, dot/dot-dot traversal, backslash or NUL.",
      "Validate source ID and digest before interpolation.",
      "Artifact paths must match the separately verified authorized target set."
    ],
    "source_mutation": "This deployment never rewrites the agent source comment while validating, rendering or routing results.",
    "concurrency": {
      "group": "issuescratch-issue1-state",
      "cancel_in_progress": false,
      "mode": "Serialize writes to the target branch; use blob SHA concurrency for replacement."
    },
    "failures": "Expose missing arguments, failed reads, conflicts and failed readbacks. Do not relabel transport/persistence failure as invalid agent JSON.",
    "permissions": {
      "contents": "write",
      "issues": "write"
    }
  },
  "integration_boundary": "Workflow invokes the configured router for comment processing, persistence, instruction delivery and verified artifact publication. Existing prompt conversion remains its separate workflow step. The newly specified generic procedures are not claimed to be independently implemented or conformant by this routing extraction.",
  "runtime": {
    "script": "src/workflow-router.js",
    "entrypoint": "runWorkflow",
    "arguments": [
      "github",
      "core",
      "context",
      "config"
    ],
    "workflow": ".github/workflows/issue1-json-validator.yml",
    "load_configuration": "Read config/workflow-routing.json on each workflow invocation.",
    "processing": "Delegates to existing framing-controller and artifact-publisher modules; the router binds transport/configuration and does not define semantic work.",
    "test_command": "node --test src/*.test.js"
  },
  "verification": {
    "workflow_run_id": 41267354831,
    "workflow_head_sha": "87747a507e2052855e93d0f21368573a005459d2",
    "workflow_conclusion": "success",
    "router_step_conclusion": "success",
    "tests": {
      "passed": 54,
      "failed": 0
    },
    "scope": "Live push-triggered issue scan; event-mode acceptance and recovery verified by transport regression tests, not a new live nineteen-entry task."
  }
}

~~~~

### `config/stateless-services.json`
Blob SHA: `7818071e4360e74dd1613f23c716e219a2d6048d`

~~~~json
{
  "schema": "issuescratch.stateless-services.v1",
  "services": {
    "router": {
      "host": "127.0.0.1",
      "port": 8787
    },
    "fsm": {
      "host": "127.0.0.1",
      "port": 8788
    },
    "renderer": {
      "host": "127.0.0.1",
      "port": 8789
    },
    "validation": {
      "host": "127.0.0.1",
      "port": 8790
    }
  },
  "routes": [
    {
      "method": "POST",
      "path": "/state",
      "service": "fsm",
      "upstream_path": "/transition"
    },
    {
      "method": "POST",
      "path": "/render",
      "service": "renderer",
      "upstream_path": "/render"
    },
    {
      "method": "POST",
      "path": "/validate",
      "service": "validation",
      "upstream_path": "/validate"
    }
  ],
  "boundary": "Router forwards HTTP requests and responses only. FSM and renderer do not reference each other. The caller supplies current state and validated input, persists returned state externally, and separately supplies projection/bindings for rendering. No job state, queues, orchestration or diagnostics are stored in these services. Validation is a separate service. Its request envelope contains raw_input and metadata; only raw_input is treated as agent submission content. Metadata supplies correlation and validation context."
}

~~~~

### `src/router-envelope-validator.js`
Blob SHA: `66495b58e9de04c9a8bbd47beba09ca7463b3dc3`

~~~~javascript
"use strict";
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function reject(code,message){return {ok:false,error:{code,message}};}
function validateEnvelope(input,settings,{renderer=false,route=null}={}){
 if(!object(input))return reject("INVALID_ENVELOPE","Envelope must be a JSON object");
 if(input.contract!=="router.envelope.v1")return reject("INVALID_CONTRACT","Unsupported envelope contract");
 if(typeof input.request_id!=="string"||!input.request_id.trim())return reject("INVALID_REQUEST_ID","request_id is required");
 if(!["request","result","rejection","error"].includes(input.type))return reject("INVALID_TYPE","Unrecognized envelope type");
 if(typeof input.payload_contract!=="string"||!input.payload_contract.trim())return reject("INVALID_PAYLOAD_CONTRACT","payload_contract is required");
 if(!Object.hasOwn(input,"payload")||!Object.hasOwn(input,"error"))return reject("INVALID_SHAPE","payload and error must be present");
 if(input.type==="error"&&(!object(input.error)||typeof input.error.code!=="string"))return reject("INVALID_ERROR","Error envelope requires structured error");
 if(renderer){
  if(typeof input.mode!=="string"||!input.mode.trim())return reject("MODE_REQUIRED","Renderer mode must be declared");
  const mode=settings?.modes?.[input.mode];
  if(!object(mode))return reject("UNKNOWN_MODE","Renderer mode is not configured");
  if(typeof mode.format!=="string"||typeof mode.destination!=="string"||!object(settings?.destinations?.[mode.destination]))return reject("INVALID_MODE_CONFIG","Renderer mode has no configured format or destination");
  if(Array.isArray(mode.payload_contracts)&&!mode.payload_contracts.includes(input.payload_contract))return reject("INCOMPATIBLE_PAYLOAD","Payload contract not permitted for mode");
  if(Array.isArray(route?.allowed_modes)&&!route.allowed_modes.includes(input.mode))return reject("MODE_NOT_ALLOWED","Mode not authorized for route");
 }
 return {ok:true,value:input};
}
module.exports={validateEnvelope};

~~~~

### `src/stateless-router-server.js`
Blob SHA: `27822adf37c3a08a464d70c2adacba3ad03e6d76`

~~~~javascript
"use strict";
const http=require("node:http"),https=require("node:https");
const {validateEnvelope}=require("./router-envelope-validator");
const json=(res,status,value)=>{res.writeHead(status,{"content-type":"application/json","cache-control":"no-store"});res.end(JSON.stringify(value));};
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function createRouterServer(config,{validator=validateEnvelope}={}){
 if(!object(config)||!Array.isArray(config.routes)||!object(config.services))throw Error("Invalid router configuration");
 return http.createServer(async(req,res)=>{
  const url=new URL(req.url,"http://localhost");
  if(req.method==="GET"&&url.pathname==="/health"){json(res,200,{ok:true});return;}
  const route=config.routes.find(x=>x.method===req.method&&x.path===url.pathname);
  if(!route){json(res,404,{error:"Unknown route"});return;}
  try{
   if(req.method!=="POST")throw Object.assign(Error("Unsupported method"),{status:405});
   let raw="";for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1048576)throw Object.assign(Error("Request too large"),{status:413});}
   let envelope;try{envelope=JSON.parse(raw);}catch{json(res,400,{error:{code:"INVALID_JSON"}});return;}
   // No route may dispatch before its inbound envelope passes the Router Validator.
   const validated=validator(envelope,config.renderer_settings,{renderer:route.service==="renderer",route});
   if(!validated.ok){json(res,422,{error:validated.error});return;}
   const service=config.services[route.service];
   if(!object(service)||typeof route.upstream_path!=="string")throw Error("Missing configured service");
   const target=new URL("http://"+service.host+":"+service.port+route.upstream_path);
   const transport=target.protocol==="https:"?https:http;
   const reply=await new Promise((resolve,reject)=>{
    const outbound=transport.request(target,{method:"POST",headers:{"content-type":"application/json"}},async upstream=>{
     try{let text="";for await(const piece of upstream){text+=piece;if(Buffer.byteLength(text)>1048576)throw Error("Response too large");}
      const parsed=JSON.parse(text);resolve({status:upstream.statusCode,body:parsed});}catch(e){reject(e);}
    });
    outbound.on("error",reject);outbound.setTimeout(config.timeout_ms||30000,()=>outbound.destroy(Error("Upstream timeout")));
    outbound.end(JSON.stringify(envelope));
   });
   // All service responses return through the Router Validator before being exposed.
   const checked=validator(reply.body,config.renderer_settings,{renderer:false,route});
   if(!checked.ok){json(res,502,{error:{code:"INVALID_UPSTREAM_ENVELOPE",details:checked.error}});return;}
   if(checked.value.request_id!==envelope.request_id){json(res,502,{error:{code:"CORRELATION_MISMATCH"}});return;}
   json(res,reply.status>=400?502:200,checked.value);
  }catch(e){json(res,e.status||502,{error:{code:"ROUTING_FAILURE",message:e.message}});}
 });
}
module.exports={createRouterServer};
if(require.main===module){const config=require("../config/stateless-services.json");const {host,port}=config.services.router;createRouterServer(config).listen(port,host,()=>console.log("Router listening on "+host+":"+port));}

~~~~

### `src/input-validator.js`
Blob SHA: `6587bbfeba8979bc2885ff70a564d2ea8946368c`

~~~~javascript
"use strict";
const {createHash}=require("node:crypto");
const {validateEntryStructure}=require("./framing-controller");
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const sha=text=>createHash("sha256").update(text,"utf8").digest("hex");
function argument(ok,message){if(!ok)throw Object.assign(Error(message),{status:400});}
function validate({raw_input,metadata={}},procedure){
 argument(typeof raw_input==="string","raw_input must be a string");
 argument(object(metadata),"metadata must be an object");
 const errors=[];
 const result={
  execution_status:"succeeded",input_status:"rejected",accepted:false,
  metadata:JSON.parse(JSON.stringify(metadata)),raw_sha256:sha(raw_input),errors,semantic_verdict:null
 };
 const reject=(code,message,pointer="")=>{errors.push({code,message,pointer});return result;};
 let array;
 try{array=JSON.parse(raw_input);}catch{return reject("INVALID_JSON","Invalid JSON in raw_input.");}
 if(!Array.isArray(array))return reject("INVALID_ROOT","Expected a single root JSON array.");
 for(let i=0;i<array.length;i++){
  const entry=array[i];
  if(!object(entry)||Object.keys(entry).length!==1||!object(entry.scratchpad)||!Object.keys(entry.scratchpad).length)
   return reject("INVALID_WRAPPER","Expected exactly one nonempty scratchpad object.","/"+i);
 }
 const index=metadata.expected_index;
 argument(Number.isSafeInteger(index)&&index>=0&&index<=procedure.controller_profile.last_tracked_index,"metadata.expected_index is required and must identify a supported index");
 if(array.length!==index+1)return reject("OUT_OF_SEQUENCE","Expected exactly "+(index+1)+" entries.");
 const state=metadata.state;
 if(state!==undefined){
  argument(object(state)&&object(state.progression),"metadata.state must contain progression");
  if(state.progression.next_index!==index||state.progression.accepted_entries!==index)
   return reject("OUT_OF_SEQUENCE","Supplied state does not expect this index.");
  if(sha(JSON.stringify(array.slice(0,index)))!==state.progression.accepted_prefix_sha256)
   return reject("PREFIX_CHANGED","Previously accepted input changed.");
 }
 const problem=validateEntryStructure(array,index,procedure.controller_profile,procedure.atomic_operation_registry,
  state?.progression?.frame_selections||metadata.frame_selections||{});
 if(problem)return reject("INVALID_FIELD",problem.message,"/"+index+"/scratchpad");
 result.input_status="accepted";result.accepted=true;result.value=array;
 result.validation_context={index,progression_checked:state!==undefined};
 return result;
}
module.exports={validate};

~~~~

### `src/validation-server.js`
Blob SHA: `8e25ebddadc0eb8478c516beb3a1406638695421`

~~~~javascript
"use strict";
const {createJsonService}=require("./http-json-service");
const {validate}=require("./input-validator");
function createValidationServer(procedure){
 return createJsonService({"POST /validate":input=>validate(input,procedure)});
}
module.exports={createValidationServer};
if(require.main===module){
 const config=require("../config/stateless-services.json").services.validation;
 const procedure=require("./types/issuescratch.procedure-library.v1.json");
 createValidationServer(procedure).listen(config.port,config.host,()=>console.log("Validation listening on "+config.host+":"+config.port));
}

~~~~

### `src/fsm-server.js`
Blob SHA: `ece41b0b240144473001c35a727543e51d726b32`

~~~~javascript
"use strict";
const {createJsonService}=require("./http-json-service");
const {transition}=require("./stateless-fsm");
function createFsmServer(procedure){
 return createJsonService({"POST /transition":input=>transition(input,procedure)});
}
module.exports={createFsmServer};
if(require.main===module){
 const config=require("../config/stateless-services.json").services.fsm;
 const procedure=require("./types/issuescratch.procedure-library.v1.json");
 createFsmServer(procedure).listen(config.port,config.host,()=>console.log("FSM listening on "+config.host+":"+config.port));
}

~~~~

### `src/stateless-fsm.js`
Blob SHA: `116f17e5c9f202cbefe3220316cfef18ed7191af`

~~~~javascript
"use strict";
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const clone=x=>JSON.parse(JSON.stringify(x));
function invalid(ok,message){if(!ok)throw Object.assign(Error(message),{status:400});}
function transition({state,input},procedure){
 invalid(object(state)&&object(state.progression)&&object(input),"Expected state, state.progression and validated input");
 const protocol=procedure.meta_controller_contract,p=state.progression,end=protocol.scope.terminal_accepted_entries;
 invalid(state.schema===protocol.state_store.schema,"State schema mismatch");
 invalid(input.schema===protocol.state_input.schema,"Input schema mismatch");
 invalid(Number.isSafeInteger(p.accepted_entries)&&p.accepted_entries>=0&&p.accepted_entries<=end,"Invalid accepted count");
 invalid(p.next_index===(p.accepted_entries===end?null:p.accepted_entries)&&p.complete===(p.accepted_entries===end),"Inconsistent supplied progression");
 invalid(Number.isSafeInteger(state.comment_id)&&state.comment_id>0&&state.comment_id===input.source_comment_id,"Source identity mismatch");
 const digest=x=>typeof x==="string"&&/^[0-9a-f]{64}$/.test(x);
 invalid(digest(p.accepted_prefix_sha256)&&digest(input.source_revision_sha256),"Missing state or input digest");
 invalid(protocol.state_input.validation_status_enum.includes(input.validation_status),"Unknown validation status");
 let status=input.validation_status;
 const next=clone(state);
 if(p.complete)status="terminal";
 else if(status==="valid"){
  const contract=procedure.index_contracts.find(c=>c.index===p.next_index);
  if(!contract)throw Error("Current index contract is missing");
  invalid(input.candidate_index===p.next_index&&input.contract_id===contract.contract_id,"Candidate index or contract mismatch");
  if(input.expected_prefix_sha256!==p.accepted_prefix_sha256)status="stale";
  else{
   invalid(digest(input.accepted_prefix_sha256_after),"Missing resulting prefix digest");
   const count=p.accepted_entries+1;
   Object.assign(next.progression,{accepted_entries:count,last_accepted_index:count-1,
    next_index:count===end?null:count,complete:count===end,accepted_prefix_sha256:input.accepted_prefix_sha256_after});
   if(count===end)status="terminal";
  }
 }
 const advanced=next.progression.accepted_entries!==p.accepted_entries;
 const rule=protocol.uniform_transition[status];
 return {state:next,transition:{status,action:rule.action,advanced,
  from_index:p.next_index,to_index:next.progression.next_index},
  };
}
module.exports={transition};

~~~~

### `src/renderer-server.js`
Blob SHA: `0a42081f2ab5fd87cf79177e8f523f304f9c8253`

~~~~javascript
"use strict";
const {createJsonService}=require("./http-json-service");
const {render}=require("./agent-renderer");
function createRendererServer(){return createJsonService({"POST /render":input=>render(input)});}
module.exports={createRendererServer};
if(require.main===module){
 const config=require("../config/stateless-services.json").services.renderer;
 createRendererServer().listen(config.port,config.host,()=>console.log("Renderer listening on "+config.host+":"+config.port));
}

~~~~

### `src/agent-renderer.js`
Blob SHA: `a0790134fa41e4f26be9ed68132062f86da33aa7`

~~~~javascript
"use strict";
function render({projection,bindings={}}){
 if(projection===undefined)throw Object.assign(Error("projection is required"),{status:400});
 // Preserve supplied values verbatim; do not infer instructions or perform transitions.
 return {content_type:"text/plain; charset=utf-8",
  text:JSON.stringify(projection,null,2)+"\n\nBindings\n"+JSON.stringify(bindings,null,2)+"\n"};
}
module.exports={render};

~~~~

### `src/index-projection.js`
Blob SHA: `96792f7af5cc7e98eff241c7f80261a6d3a70059`

~~~~javascript
"use strict";
// Build projection DATA from the current procedure. No UI rendering or state transitions.
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const clone=x=>JSON.parse(JSON.stringify(x));
function requireValue(ok,message){if(!ok)throw Error("Index projection: "+message);}
function createProjection(library,inputsByIndex={}){
 requireValue(object(library)&&Array.isArray(library.index_contracts),"missing current index contracts");
 function dereference(ref){
  requireValue(typeof ref==="string"&&ref.startsWith("#/"),"invalid definition reference");
  let value=library;
  for(const part of ref.slice(2).split("/")){
   requireValue(!/~(?:[^01]|$)/.test(part),"invalid pointer escape");
   const key=part.replace(/~1/g,"/").replace(/~0/g,"~");
   requireValue(value!==null&&typeof value==="object"&&own(value,key),"missing definition "+ref);
   value=value[key];
  }
  return value;
 }
 function merge(left,right){
  const out=clone(left);
  for(const [key,value] of Object.entries(right)){
   requireValue(!["__proto__","constructor","prototype"].includes(key),"unsafe key");
   if(!own(out,key))out[key]=clone(value);
   else if(object(out[key])&&object(value))out[key]=merge(out[key],value);
   else requireValue(JSON.stringify(out[key])===JSON.stringify(value),"definition conflict "+key);
  }
  return out;
 }
 function resolve(source,seen=[]){
  requireValue(object(source),"definition must be object");
  const local=clone(source);delete local.definition_ref;
  if(!source.definition_ref)return local;
  requireValue(!seen.includes(source.definition_ref),"reference cycle");
  return merge(resolve(dereference(source.definition_ref),[...seen,source.definition_ref]),local);
 }
 function fingerprint(value){
  if(Array.isArray(value))return "["+value.map(fingerprint).join(",")+"]";
  if(object(value))return "{"+Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+fingerprint(value[k])).join(",")+"}";
  return JSON.stringify(value);
 }
 const common=resolve(library.index_contract_definitions.common);
 function subtract(value,base){
  const unique={};
  for(const [key,item] of Object.entries(value)){
   if(!own(base,key))unique[key]=clone(item);
   else if(object(item)&&object(base[key])){
    const nested=subtract(item,base[key]);if(Object.keys(nested).length)unique[key]=nested;
   }else requireValue(fingerprint(item)===fingerprint(base[key]),"common field disagreement "+key);
  }
  return unique;
 }
 const definitions={},byContent=new Map(),identities=new Set(),indices=new Set();
 const records=library.index_contracts.map(contract=>{
  const effective=resolve(contract);
  requireValue(Number.isSafeInteger(effective.index)&&effective.index>=0,"invalid index");
  requireValue(typeof effective.contract_id==="string"&&!identities.has(effective.contract_id),"duplicate/missing contract identity");
  requireValue(!indices.has(effective.index),"duplicate index");
  identities.add(effective.contract_id);indices.add(effective.index);
  const unique=subtract(effective,common);
  delete unique.index;delete unique.contract_id;
  const signature=fingerprint(unique);
  let key=byContent.get(signature);
  if(!key){key="projection_"+(byContent.size+1);byContent.set(signature,key);definitions[key]=unique;}
  return {index:effective.index,contract_id:effective.contract_id,projection_key:key,
   ...(own(inputsByIndex,effective.index)?{supplied_inputs:clone(inputsByIndex[effective.index])}:{})};
 });
 const criteriaById=new Map((library.shared_semantic_completion_criteria||[]).map(c=>[c.id,c]));
 const criteria=(common.semantic_completion?.criteria_refs||[]).map(id=>{
  requireValue(criteriaById.has(id),"missing semantic criterion "+id);return clone(criteriaById.get(id));
 });
 return {schema:"issuescratch.dynamic-index-projection.v1",shared:common,
  shared_semantic_criteria:criteria,definitions,index_projections:records};
}
module.exports={createProjection};

~~~~

### `src/http-json-service.js`
Blob SHA: `1f06430d2b69435bc1becdb1ae4af8602f1e1475`

~~~~javascript
"use strict";
const http=require("node:http");
function createJsonService(routes){
 return http.createServer(async(req,res)=>{
  const send=(status,value)=>{res.writeHead(status,{"content-type":"application/json","cache-control":"no-store"});res.end(JSON.stringify(value));};
  const pathname=new URL(req.url,"http://localhost").pathname;
  if(req.method==="GET"&&pathname==="/health"){send(200,{ok:true});return;}
  const handler=routes[req.method+" "+pathname];
  if(!handler){send(404,{error:"Unknown endpoint"});return;}
  try{
   let body="";
   for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>1048576){send(413,{error:"Request too large"});return;}}
   let input;try{input=JSON.parse(body);}catch{send(400,{error:"Invalid JSON"});return;}
   send(200,await handler(input));
  }catch(error){send(error.status||500,{error:error.message});}
 });
}
module.exports={createJsonService};

~~~~

### `src/stateless-services.test.js`
Blob SHA: `a6d104250d13816ecf915206754dcda399a19f99`

~~~~javascript
"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const procedure=require("./types/issuescratch.procedure-library.v1.json");
async function listen(t,server){
 await new Promise(done=>server.listen(0,"127.0.0.1",done));
 t.after(()=>new Promise(done=>{server.close(done);server.closeAllConnections();}));
 return "http://127.0.0.1:"+server.address().port;
}
const state=()=>({schema:"issuescratch.comment-state.v1",comment_id:12,progression:{mode:"incremental",accepted_entries:0,last_accepted_index:null,next_index:0,complete:false,accepted_prefix_sha256:"a".repeat(64)}});
const event=()=>({schema:"issuescratch.validated-entry-event.v1",source_comment_id:12,source_revision_sha256:"b".repeat(64),candidate_index:0,contract_id:"IS.INDEX.000",validation_status:"valid",expected_prefix_sha256:"a".repeat(64),accepted_prefix_sha256_after:"c".repeat(64)});
test("FSM advances supplied state without mutation or retained state",()=>{
 const {transition}=require("./stateless-fsm"),s=state(),input=event(),before=structuredClone(s);
 const a=transition({state:s,input},procedure),b=transition({state:s,input},procedure);
 assert.deepEqual(s,before);assert.deepEqual(a,b);assert.equal(a.state.progression.next_index,1);
 for(const status of ["invalid","duplicate","stale","unavailable","conflict"]){
  const result=transition({state:s,input:{...input,validation_status:status}},procedure);
  assert.deepEqual(result.state,s);assert.equal(result.transition.advanced,false);
 }
});
test("FSM terminates and rejects a stale prefix without advancing",()=>{
 const {transition}=require("./stateless-fsm");
 const stale=transition({state:state(),input:{...event(),expected_prefix_sha256:"d".repeat(64)}},procedure);
 assert.equal(stale.transition.status,"stale");assert.equal(stale.state.progression.accepted_entries,0);
 const s=state();Object.assign(s.progression,{accepted_entries:18,last_accepted_index:17,next_index:18});
 const result=transition({state:s,input:{...event(),candidate_index:18,contract_id:"IS.INDEX.018"}},procedure);
 assert.equal(result.state.progression.complete,true);assert.equal(result.state.progression.next_index,null);
});
test("renderer renders only supplied projection data and bindings",()=>{
 const {render}=require("./agent-renderer");
 const result=render({projection:{shared:{input:"read"},definition:{output:"write literal {name}"}},bindings:{name:"source"}});
 assert.equal(result.text,'{\n  "shared": {\n    "input": "read"\n  },\n  "definition": {\n    "output": "write literal {name}"\n  }\n}\n\nBindings\n{\n  "name": "source"\n}\n');
 assert.throws(()=>render({}),/projection/);
});
test("router forwards to independent HTTP FSM and renderer services",async t=>{
 const {createFsmServer}=require("./fsm-server");
 const {createRendererServer}=require("./renderer-server");
 const {createRouterServer}=require("./stateless-router-server");
 const fsm=await listen(t,createFsmServer(procedure)),renderer=await listen(t,createRendererServer());
 const router=await listen(t,createRouterServer({routes:[
  {method:"POST",path:"/state",target:fsm+"/transition"},
  {method:"POST",path:"/render",target:renderer+"/render"}
 ]}));
 const post=(path,data)=>fetch(router+path,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
 const a=await post("/state",{state:state(),input:event()});assert.equal(a.status,200);
 assert.equal((await a.json()).state.progression.next_index,1);
 const b=await post("/render",{projection:{instruction:"verbatim"},bindings:{source:"supplied"}});assert.equal(b.status,200);
 assert.match((await b.json()).text,/verbatim/);
 const invalid=await fetch(router+"/state",{method:"POST",body:"{"});assert.equal(invalid.status,400);
 assert.equal((await fetch(router+"/unknown",{method:"POST"})).status,404);
 const again=await post("/state",{state:state(),input:event()});
 assert.equal((await again.json()).state.progression.next_index,1);
});

~~~~
