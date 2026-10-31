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
│   ├── opcode-document-adapter.js
│   ├── opcode-document-adapter.test.js
│   └── types/
│       ├── issuescratch.permitted-uses-and-input-types.v1.json
│       ├── issuescratch.scratchpad-field-registry.v1.json
│       ├── issuescratch.scratchpad-field-registry.v2.json
│       ├── issuescratch.operation-registry.v1.json
│       └── issuescratch.opcode-adapter-contract.v1.json
├── experiments/
│   ├── general-purpose-job-prompts.v1.json
│   ├── general-purpose-job-opcode-map.v1.json
│   └── general-purpose-job-prompts.opcoded.v1.json
└── workspaces/
    └── issue1-diagnostics/
        └── comments/
            └── <comment-id>/
                ├── state.json
                └── revisions/
                    └── <source-body-sha256>.json
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
| [`src/issue1-diagnostics.test.js`](src/issue1-diagnostics.test.js) | Tests parsing failures, nested arrays, per-index measurements, unchanged-prefix checks, duplicate events, historical snapshots, and the index-16 progression limit. |
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

### Experimental inputs and converted outputs

| Path | Role |
| --- | --- |
| [`experiments/general-purpose-job-prompts.v1.json`](experiments/general-purpose-job-prompts.v1.json) | Original 17-prompt batch (`P01`–`P17`) spanning writing, philosophy, mathematics, coding, planning, translation, and analysis. The prompts are source material, not completed jobs. |
| [`experiments/general-purpose-job-opcode-map.v1.json`](experiments/general-purpose-job-opcode-map.v1.json) | Explicit mapping profile assigning sequences of shared operation opcodes to the 17 prompt IDs. It declares intended operations; it does not execute them. |
| [`experiments/general-purpose-job-prompts.opcoded.v1.json`](experiments/general-purpose-job-prompts.opcoded.v1.json) | Generated JSON-object projection of the job batch. Contains exact source bytes in Base64, a source hash, stable record IDs, source pointers, and operation sequences. Regenerate through the adapter rather than editing independently. |

### Persistent operational workspace

| Path pattern | Role |
| --- | --- |
| [`workspaces/issue1-diagnostics/comments/`](workspaces/issue1-diagnostics/comments/) | One directory per permanent Issue #1 comment ID; written by the GitHub Actions workflow. |
| `workspaces/issue1-diagnostics/comments/<comment-id>/state.json` | Current **JSON object**: progression state, accepted prefix hash, latest revision pointer, validation result, and revision-history entries. |
| `workspaces/issue1-diagnostics/comments/<comment-id>/revisions/<source-body-sha256>.json` | Immutable-per-content **JSON object**: diagnostics and transition information for an observed source revision, including lengths and keys at each index. |

Workspaces contain runtime evidence, not authoritative instructions. Preserve saved records and revision identities; do not rewrite historical diagnostics to make results appear more successful.

## How the components interact

### 1. Scratchpad return format and per-comment progression

For **completed** new return-schema (RS) records, [`AGENTS.md`](AGENTS.md) requires a single root JSON array of at least 17 entries. Every entry is exactly one wrapper object with the literal key `scratchpad`; its value is a **nonempty heterogeneous JSON object**. Registered typed fields are independently optional. This compact example shows the *shape only*, not a complete RS:

```json
[
  { "scratchpad": { "text[string]": "Example entry at index 0" } },
  { "scratchpad": { "text[string]": "Different entry at index 1" } }
]
```

Intermediate drafts may have 1–16 entries. Each newly accepted revision must add exactly **one** entry and preserve the previously accepted prefix. For a comment created through the incremental process, the state processor tracks accepted indices `0` through `16`; after index 16 it stops advancing the accepted index while continuing JSON validation and diagnostic snapshots. Historical arrays found during an initial scan are labeled historical snapshots, **not** fabricated incremental events.

The workflow checks JSON syntax, one root array, nonempty single-key wrapper shape, and structural progression. It **does not** evaluate whether contributions are semantically distinct or accurate. Nested arrays inside scratchpad values are allowed and counted independently of the root array.

### 2. Event-driven diagnostics

The single workflow responds to `issue_comment.created` and `issue_comment.edited` events **on Issue #1**. On `push` to selected implementation/input paths or manual `workflow_dispatch`, it also scans existing Issue #1 comments. It runs automated tests first.

For each observed comment revision it deterministically records:

- Source-body SHA-256, total source characters (Unicode code points), and UTF-8 byte count.
- Whether JSON parses, whether its root is one array, its length, and nested-array count.
- Per-index serialized character and byte counts, string-content character counts, key occurrences, scratchpad field names, and share of total indexed content.
- Per-key JSON-value and text-value character totals, pointers, and repeat counts.
- Acceptance/rejection transition, current accepted entry count, latest diagnostic pointer, and revision history.

Invalid JSON is **not silently repaired or rewritten**. Its failure is recorded as a JSON object and it cannot advance accepted progression. Duplicate observations of the same content hash do not advance state twice. State files and diagnostic snapshots remain separate from the user-authored issue comment.

The `next_function` state field and the `function_selection` mechanism are currently **unconfigured**: the workflow does **not yet** select or dispatch recursive-framing functions after each index. State validation is implemented; the proposed operator controller is a separate, unimplemented stage.

### 3. Document → opcode JSON conversion

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
# Run both automated test suites.
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

- **Implemented:** one Issue #1 validator/diagnostic workflow; per-comment JSON-object state and per-revision metrics; deterministic document adapter; 16-operation registry; generated 17-prompt opcode projection; unit tests.
- **Not implemented:** a verified agent-dispatch controller that chooses a next framing operation, causes an agent to act on an accepted index, and closes the full 17-entry experiment automatically.
- **Experiment status:** the 17 prompts are prepared and opcode-mapped, but producing the converted manifest does not mean the 17 agent tasks were run.
- **Historical compatibility:** preserve older three-object and seven-entry records rather than rewriting them to the current 17-entry RS contract.
- **On changes:** review `AGENTS.md` and Issue #1 first; update this file manifest when adding, moving, renaming, or changing the responsibilities of major components. Regenerate derived files from their declared sources, validate JSON records, run tests, and verify the GitHub Actions result before claiming operational success.

The most important entry points are **[`AGENTS.md`](AGENTS.md)** for rules, **[Issue #1](https://github.com/BestNameYet/IssueScratch/issues/1)** for work, **[the workflow](.github/workflows/issue1-json-validator.yml)** for event handling, **[the canonical type catalog](src/types/issuescratch.permitted-uses-and-input-types.v1.json)** for permitted scratchpad content, and **[the opcode adapter](src/opcode-document-adapter.js)** for reversible document conversion.
