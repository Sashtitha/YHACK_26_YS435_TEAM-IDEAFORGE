// Lightweight, fast consistency check: no extra LLM call, so it's safe to run
// on every request even under demo-day time pressure. It flags numbers that
// show up in a generated output but were never in the source fact graph —
// the cheapest, highest-signal sign of drift/hallucination between formats.
// (A deeper LLM-based validator is the natural next step — see the roadmap.)

function flattenText(value, acc = []) {
  if (value == null) return acc;
  if (typeof value === 'string') acc.push(value);
  else if (Array.isArray(value)) value.forEach((v) => flattenText(v, acc));
  else if (typeof value === 'object') Object.values(value).forEach((v) => flattenText(v, acc));
  return acc;
}

function normalizeNumber(n) {
  return String(n).replace(/[^0-9.]/g, '');
}

function extractNumbers(text) {
  return (text.match(/\$?\b\d[\d,.]*%?\b/g) || []).map(normalizeNumber).filter((n) => n.length > 0);
}

function checkConsistency(factGraph, output) {
  const sourceNumbers = new Set((factGraph.numbers || []).map(normalizeNumber));
  const outputText = flattenText(output).join(' ');
  const outputNumbers = extractNumbers(outputText);

  const flagged = [...new Set(outputNumbers.filter((n) => n.length >= 2 && !sourceNumbers.has(n)))];

  return {
    ok: flagged.length === 0,
    flagged_numbers: flagged,
    note:
      flagged.length === 0
        ? 'No numbers appeared that weren\'t in the source fact graph.'
        : 'Some numbers in this output were not found in the source fact graph — verify before publishing.',
  };
}

module.exports = { checkConsistency };
