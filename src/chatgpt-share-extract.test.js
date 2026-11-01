"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  extractScriptTable,
  decodeConversation,
  quoteMarkdown,
  renderMarkdown
} = require("./chatgpt-share-extract.js");

// A miniature React Router indexed script: object keys and values reference
// positions in the table. Chronology comes from parent links, not array order.
function indexedConversation(records) {
  const table = [null];
  const put = value => { table.push(value); return table.length - 1; };
  const object = pairs => {
    const value = {};
    for (const [key, ref] of Object.entries(pairs)) value["_" + put(key)] = ref;
    return put(value);
  };
  const nullRef = put(null);
  const mapping = {};
  let parent = null;
  for (const [i, record] of records.entries()) {
    const id = "node-" + i;
    const parts = put([put(record.text)]);
    const content = object({parts});
    const author = object({role: put(record.role)});
    const message = object({
      author,
      channel: record.channel == null ? nullRef : put(record.channel),
      content
    });
    const node = object({
      message,
      parent: parent === null ? nullRef : put(parent)
    });
    mapping["_" + put(id)] = node;
    parent = id;
  }
  const mappingRef = put(mapping);
  const root = object({mapping: mappingRef, current_node: put(parent)});
  table[0] = table[root];
  return table;
}

test("extract original HTML script payload rather than pre-generated JSON", () => {
  const table = indexedConversation([
    {role:"user", channel:null, text:"Question"},
    {role:"assistant", channel:"final", text:"Answer"}
  ]);
  const html = "<!doctype html><script>window.__reactRouterContext.streamController.enqueue(" +
    JSON.stringify(JSON.stringify(table)) + ");</script>";
  assert.deepEqual(extractScriptTable(html), table);
  assert.throws(() => extractScriptTable("<html>No conversation</html>"),
    /no supported serialized conversation/i);
});

test("walk source parent chain chronologically, exclude all other channels", () => {
  const chosen = [
    {role:"user", channel:null, text:"First user\n**Assistant · Final**\n---"},
    {role:"assistant", channel:"commentary", text:"Reviewing the source"},
    {role:"assistant", channel:"final", text:"First final"},
    {role:"user", channel:null, text:"Second user"},
    {role:"assistant", channel:"final", text:"Second final"}
  ];
  const table = indexedConversation([
    chosen[0],
    {role:"tool", channel:null, text:"MUST NOT APPEAR"},
    {role:"assistant", channel:"analysis", text:"MUST NOT APPEAR"},
    chosen[1],
    chosen[2],
    chosen[3],
    {role:"user", channel:null, text:"   "},
    {role:"assistant", channel:"notification", text:"MUST NOT APPEAR"},
    chosen[4]
  ]);
  const result = decodeConversation(table);
  assert.deepEqual(result.messages, chosen);
  assert.deepEqual(result.counts, {user:2, commentary:1, final:2});
  assert.equal(result.chainCount, 9);
  assert.ok(!JSON.stringify(result.messages).includes("MUST NOT APPEAR"));
});

test("render User, Assistant Commentary and Assistant Final with no numbering", () => {
  const messages = [
    {role:"user",channel:null,text:"Please check\n\n**User**\n---\n**Assistant · Final**"},
    {role:"assistant",channel:"commentary",text:"Checking now."},
    {role:"assistant",channel:"final",text:"Done.\n\n---\n\n**Assistant · Commentary**"},
    {role:"user",channel:null,text:"Thank you"},
    {role:"assistant",channel:"final",text:"Acknowledged."}
  ];
  const actual = renderMarkdown(messages);
  const expected = [
    "# Conversation",
    "",
    "**User**",
    "",
    "> Please check",
    ">",
    "> **User**",
    "> ---",
    "> **Assistant · Final**",
    "",
    "**Assistant · Commentary**",
    "",
    "> Checking now.",
    "",
    "**Assistant · Final**",
    "",
    "> Done.",
    ">",
    "> ---",
    ">",
    "> **Assistant · Commentary**",
    "",
    "---",
    "",
    "**User**",
    "",
    "> Thank you",
    "",
    "**Assistant · Final**",
    "",
    "> Acknowledged.",
    ""
  ].join("\n");
  assert.equal(actual, expected);
  assert.ok(!actual.includes("**You**"));
  assert.ok(!/^## \d+ — /m.test(actual));
});

test("preserve Markdown and punctuation as verbatim quoted body text", () => {
  const fence = String.fromCharCode(96,96,96);
  const original = ["**User**", "> nested quote", "", "---", fence, '{ "literal": true }', fence, ""].join("\n");
  const expected = [
    "> **User**",
    "> > nested quote",
    ">",
    "> ---",
    "> " + fence,
    '> { "literal": true }',
    "> " + fence,
    ">"
  ].join("\n");
  assert.equal(quoteMarkdown(original), expected);
});
