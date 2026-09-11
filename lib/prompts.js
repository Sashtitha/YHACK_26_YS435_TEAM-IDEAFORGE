// ============================================================
// TransformAI - Prompt Configuration
// Gemini-powered multilingual content transformation
// ============================================================

const FORMAT_SPECS = {

  slide: {
    label: 'Slide Deck',
    icon: '▦',
    description:
      'A concise presentation with clear slide titles and bullets.'
  },

  social: {
    label: 'Social Post',
    icon: '💬',
    description:
      'A short engaging social media announcement.'
  },

  advisory: {
    label: 'Advisory',
    icon: '🛡',
    description:
      'A clear formal announcement or advisory.'
  },

  video: {
    label: 'Video Script',
    icon: '🎬',
    description:
      'A short scene-by-scene video script.'
  },

  infographic: {
    label: 'Infographic',
    icon: '◔',
    description:
      'A concise visual summary with key callouts.'
  }

};


// ============================================================
// FACT GRAPH
// ============================================================

const FACT_GRAPH_SYSTEM = `
You are the fact extraction engine for TransformAI.

Your job is to read the source material and create a structured
fact graph that will be used to generate multiple content formats.

STRICT RULES:

1. Extract ONLY information explicitly supported by the source.
2. Never invent facts.
3. Never add outside knowledge.
4. Preserve important numbers.
5. Preserve important dates.
6. Preserve names, organizations and places.
7. Preserve claims and actions.
8. Keep the facts concise.
9. Do not reinterpret the source.
10. Return ONLY valid JSON.
11. Do not use Markdown.
12. Do not use code fences.

Return exactly:

{
  "summary": "short summary of the source",
  "facts": [
    "fact 1",
    "fact 2"
  ],
  "numbers": [
    "number exactly as found in source"
  ],
  "dates": [
    "date exactly as found in source"
  ],
  "entities": [
    "important person, organization, place, product or group"
  ],
  "keywords": [
    "important keyword"
  ],
  "intent": "main purpose of the source"
}
`;


function factGraphUserPrompt(sourceText) {

  return `
SOURCE MATERIAL:

${sourceText}

TASK:

Extract the fact graph now.

Use only information contained in the source.

Return ONLY valid JSON.
`;
}


// ============================================================
// FORMAT SYSTEM PROMPT
// ============================================================

function formatSystemPrompt(formatKey) {

  const commonRules = `

You are TransformAI.

You are an AI-powered multilingual multi-format
content transformation system.

Transform the supplied fact graph into the requested format.

CRITICAL RULES:

1. Use ONLY information contained in the fact graph.
2. Do NOT invent facts.
3. Do NOT invent numbers.
4. Do NOT invent dates.
5. Do NOT invent names.
6. Do NOT add outside knowledge.
7. Preserve the meaning of the source.
8. Follow the requested audience.
9. Follow the requested tone.
10. Follow the requested language.
11. Follow the requested detail level.
12. Follow the requested objective.
13. Follow the requested style.
14. JSON keys must remain in English.
15. ALL human-readable VALUES must use the requested language.
16. Do not switch to English unless English is requested.
17. Return ONLY valid JSON.
18. Never return Markdown.
19. Never use code fences.
20. Never add explanations outside JSON.

`;


  const formatInstructions = {

    // --------------------------------------------------------
    // SLIDES
    // --------------------------------------------------------

    slide: `

FORMAT: SLIDE DECK

Create 5 to 7 concise slides.

Each slide must contain:

- title
- 1 to 4 concise bullets

Every slide should communicate a distinct idea.

Do not repeat the same information unnecessarily.

Return exactly:

{
  "slides": [
    {
      "title": "string",
      "bullets": [
        "string"
      ]
    }
  ]
}

`,

    // --------------------------------------------------------
    // SOCIAL
    // --------------------------------------------------------

    social: `

FORMAT: SOCIAL MEDIA POST

Create one concise social media post.

The post must:

- communicate the main message
- be easy to understand
- match the requested audience
- match the requested tone
- contain no unsupported claims

Create 2 to 5 relevant hashtags.

Return exactly:

{
  "post": "string",
  "hashtags": [
    "#hashtag"
  ]
}

`,

    // --------------------------------------------------------
    // ADVISORY
    // --------------------------------------------------------

    advisory: `

FORMAT: ADVISORY

Create a clear professional advisory.

Include:

- headline
- summary
- 3 to 5 guidance points
- practical next steps

Do not invent:

- phone numbers
- contact details
- websites
- dates
- instructions
- organizations

Return exactly:

{
  "headline": "string",
  "summary": "string",
  "guidance": [
    "string"
  ],
  "nextSteps": "string"
}

`,

    // --------------------------------------------------------
    // VIDEO
    // --------------------------------------------------------

    video: `

FORMAT: VIDEO SCRIPT

Create 4 to 5 short scenes.

Each scene must contain:

- visual
- narration

The narration must remain grounded in the source.

Return exactly:

{
  "scenes": [
    {
      "visual": "string",
      "narration": "string"
    }
  ]
}

`,

    // --------------------------------------------------------
    // INFOGRAPHIC
    // --------------------------------------------------------

    infographic: `

FORMAT: INFOGRAPHIC

Create a concise visual summary.

Include:

- short title
- 3 to 5 callouts
- one takeaway

Each callout must contain:

- label
- value

Return exactly:

{
  "title": "string",
  "callouts": [
    {
      "label": "string",
      "value": "string"
    }
  ],
  "takeaway": "string"
}

`
  };


  return (
    commonRules +
    '\n' +
    (
      formatInstructions[formatKey] ||
      ''
    )
  );
}


// ============================================================
// FORMAT USER PROMPT
// ============================================================

function formatUserPrompt(
  factGraph,
  params = {}
) {

  const language =
    params.language ||
    'English';

  const audience =
    params.audience ||
    'General Public';

  const tone =
    params.tone ||
    'Neutral';

  const detail =
    params.detail ||
    'Standard';

  const objective =
    params.objective ||
    'Inform';

  const style =
    params.style ||
    'Plain language';


  return `

FACT GRAPH:

${JSON.stringify(
  factGraph,
  null,
  2
)}

DELIVERY PARAMETERS:

Audience: ${audience}
Tone: ${tone}
Language: ${language}
Detail level: ${detail}
Communication objective: ${objective}
Content style: ${style}


LANGUAGE REQUIREMENT:

ALL human-readable content MUST be written in:

${language}

This includes:

- titles
- headings
- bullets
- post text
- hashtags
- summaries
- guidance
- next steps
- video visuals
- video narration
- infographic titles
- infographic labels
- infographic values
- infographic takeaway


FACTUAL CONSISTENCY:

Use ONLY facts from the fact graph.

Do not invent information.

Do not add unsupported details.

Do not change numbers.

Do not change dates.

Do not add external information.


OUTPUT:

Return ONLY valid JSON.

Do not use Markdown.

Do not use code fences.

Do not add explanations outside JSON.

`;
}


module.exports = {

  FORMAT_SPECS,

  FACT_GRAPH_SYSTEM,

  factGraphUserPrompt,

  formatSystemPrompt,

  formatUserPrompt

};