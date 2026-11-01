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
      "usage": "Concrete repository/issue input and output bindings, invocation arguments, iteration and readback routes. Generic projection and validation procedures remain location-agnostic. Configuration is not yet integrated into the workflow."
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
