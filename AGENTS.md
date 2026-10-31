{
  "document_type": "IssueScratch agent instructions",
  "format_version": "2.11.0",
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
      "version": 4,
      "source_section": "10",
      "source_line_range": null,
      "modality": "require",
      "imperative": "At outer index 18, verify progression.complete, accepted_entries=19, last_accepted_index=18, final source revision digest, five persisted frame selections, and eighteen controller instructions. For any declared artifact target, require the generic artifact publication receipt and exact destination readback before claiming publication success; otherwise report incomplete or blocked.",
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
      "version": 6,
      "source_section": "10",
      "source_line_range": null,
      "modality": "prohibit",
      "imperative": "Do not claim the nineteen-entry job complete based on array length or successful tests alone. Require nineteen accepted revisions, five consistently retained higher-order frame selections, eighteen source-linked instructions, and—when the job declares output artifacts—a verified general publication receipt and final file readback. Never require worker-written control acknowledgements.",
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
      "version": 1,
      "source_section": "11",
      "source_line_range": null,
      "modality": "require",
      "imperative": "Reserve outer indices 16, 17 and 18 for reconciliation: inventory and conflict analysis, atomic opcode projection of all preceding content including all five nested preparatory scratchpads, and final synthesis with validation and identified limitations.",
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
      "version": 1,
      "source_section": "11",
      "source_line_range": null,
      "modality": "require",
      "imperative": "Structurally validate the preparatory nested array and all reconciliation artifacts before accepting the corresponding index. Structural acceptance is not proof of the semantic accuracy of inferred intent or the faithful execution of opcode steps.",
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
      "profile_sha": "351fda7e3e0ec4de6e259f6793f0d78e6a900c49",
      "profile_version": "2.1.0",
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
      "execution_scope": "Node.js runtime selects, saves, and publishes operations. Narrative drafting and semantic application by an external agent remain outside this workflow.",
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
      "schema": "issuescratch.agent-workflow-handshake.v1.2",
      "job_scope": "Issue #1 source comment",
      "controller_profile": "src/types/issuescratch.framing-controller.v1.json",
      "workflow_path": ".github/workflows/issue1-json-validator.yml",
      "source_of_truth": "GitHub-retrieved comment body + per-comment state.json + immutable instruction JSON + source-linked controller reply",
      "index_sequence": "Create outer index 0 with five preparatory scratchpads; append one entry per edit through index 18.",
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
        "19 sequential accepted revisions",
        "completion at index 18",
        "five persisted frames",
        "18 source-linked controller instructions",
        "generic publication receipt and destination readback if an artifact target is declared"
      ],
      "failure": "Stop, report blocked and preserve saved comment, instructions, state and any already verified artifact receipts.",
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
      "agent_workflow_file_writes_allowed_during_job": false
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
      "workflow_artifacts_in_agent_comment": false
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
    }
  },
  "source_archive": {
    "original_blob_sha": "8a0912e5cfa641a899e19ba02cbefde7f61d59bd",
    "previous_active_document_blob_sha": "837b72c80bf1fb0a5e2a68ac03532fda0a125642",
    "historic_file_url": "https://github.com/BestNameYet/IssueScratch/blob/b57af6a799b66ae2798b651f77d1208f0f1995af/AGENTS.md",
    "current_amendment": "Eliminate filename-specific README experiment publication. All source-linked artifacts now use one 19-entry-controlled publication contract, overwrite existing repository paths directly, and require SHA-verified readback and generic receipts. Preserve legacy candidates as historical records. New tests require separate workflow verification.",
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
    "readme_specific_publication_active": false
  }
}
