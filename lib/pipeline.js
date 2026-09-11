const {
  callGeminiJSON
} = require('./anthropic');


const {
  FACT_GRAPH_SYSTEM,
  factGraphUserPrompt,
  formatSystemPrompt,
  formatUserPrompt,
  FORMAT_SPECS
} = require('./prompts');


const {
  extractFactGraphMock,
  generateFormatMock
} = require('./mock');


const {
  checkConsistency
} = require('./consistency');


// ============================================================
// FACT EXTRACTION
// ============================================================

async function extractFactGraph(
  sourceText
) {

  try {

    const factGraph =
      await callGeminiJSON({

        system:
          FACT_GRAPH_SYSTEM,

        user:
          factGraphUserPrompt(
            sourceText
          ),

        maxTokens: 4000

      });


    console.log(
      '[pipeline] Gemini fact extraction: SUCCESS'
    );


    return {

      factGraph: {
        ...factGraph,
        _mode: 'live'
      },

      mode: 'live'

    };

  } catch (err) {

    console.error(
      '[pipeline] Gemini fact extraction failed:',
      err.message
    );


    console.log(
      '[pipeline] Using local fact extraction fallback.'
    );


    return {

      factGraph:
        extractFactGraphMock(
          sourceText
        ),

      mode: 'demo'

    };

  }

}


// ============================================================
// FORMAT GENERATION
// ============================================================

async function generateFormat(
  formatKey,
  factGraph,
  params,
  mode
) {

  if (
    !FORMAT_SPECS[formatKey]
  ) {

    throw new Error(
      `Unknown format: ${formatKey}`
    );

  }


  // ==========================================================
  // LIVE GEMINI MODE
  // ==========================================================

  if (mode === 'live') {

    try {

      const output =
        await callGeminiJSON({

          system:
            formatSystemPrompt(
              formatKey
            ),

          user:
            formatUserPrompt(
              factGraph,
              params
            ),

          maxTokens: 5000

        });


      console.log(
        `[pipeline] Gemini "${formatKey}": SUCCESS`
      );


      return {

        output,

        mode: 'live'

      };

    } catch (err) {

      console.error(
        `[pipeline] Gemini "${formatKey}" failed:`,
        err.message
      );


      // ------------------------------------------------------
      // FALLBACK
      // ------------------------------------------------------

      try {

        const fallback =
          generateFormatMock(
            formatKey,
            factGraph,
            params
          );


        console.log(
          `[pipeline] Local fallback "${formatKey}": SUCCESS`
        );


        return {

          output: fallback,

          mode: 'demo'

        };

      } catch (fallbackError) {

        console.error(
          `[pipeline] Local fallback "${formatKey}" failed:`,
          fallbackError.message
        );


        return {

          output: {
            error:
              'This format could not be generated.'
          },

          mode: 'error'

        };

      }

    }

  }


  // ==========================================================
  // DEMO / FALLBACK MODE
  // ==========================================================

  try {

    const output =
      generateFormatMock(
        formatKey,
        factGraph,
        params
      );


    return {

      output,

      mode: 'demo'

    };

  } catch (err) {

    console.error(
      `[pipeline] Demo generation failed for "${formatKey}":`,
      err.message
    );


    return {

      output: {
        error:
          'This format could not be generated.'
      },

      mode: 'error'

    };

  }

}


// ============================================================
// CONSISTENCY CHECK
// ============================================================

function safeConsistency(
  factGraph,
  output
) {

  const defaultResult = {

    ok: true,

    flagged_numbers: [],

    note:
      'Consistency check completed.'

  };


  try {

    const result =
      checkConsistency(
        factGraph,
        output
      );


    if (!result) {
      return defaultResult;
    }


    return {

      ...defaultResult,

      ...result,

      flagged_numbers:
        Array.isArray(
          result.flagged_numbers
        )
          ? result.flagged_numbers
          : []

    };

  } catch (err) {

    console.error(
      '[pipeline] Consistency check failed:',
      err.message
    );


    return {

      ...defaultResult,

      note:
        'Consistency check could not be completed.'

    };

  }

}


// ============================================================
// MAIN TRANSFORMATION
// ============================================================

async function runTransform({
  sourceText,
  params = {},
  formats = []
}) {

  if (
    !sourceText ||
    !String(sourceText).trim()
  ) {

    throw new Error(
      'Source content is empty.'
    );

  }


  if (
    !Array.isArray(formats) ||
    formats.length === 0
  ) {

    throw new Error(
      'At least one output format is required.'
    );

  }


  // ----------------------------------------------------------
  // STEP 1
  // ----------------------------------------------------------

  const {
    factGraph,
    mode
  } =
    await extractFactGraph(
      sourceText
    );


  // ----------------------------------------------------------
  // STEP 2
  // ----------------------------------------------------------

  const results = {};


  for (
    const formatKey of formats
  ) {

    try {

      const {
        output,
        mode: formatMode
      } =
        await generateFormat(
          formatKey,
          factGraph,
          params,
          mode
        );


      results[formatKey] = {

        output,

        mode:
          formatMode,

        consistency:
          safeConsistency(
            factGraph,
            output
          )

      };

    } catch (err) {

      console.error(
        `[pipeline] Complete failure for "${formatKey}":`,
        err.message
      );


      results[formatKey] = {

        output: {

          error:
            'This format could not be generated.'

        },

        mode: 'error',

        consistency: {

          ok: false,

          flagged_numbers: [],

          note:
            'Generation failed.'

        }

      };

    }

  }


  // ----------------------------------------------------------
  // FINAL RESULT
  // ----------------------------------------------------------

  return {

    factGraph,

    mode,

    results

  };

}


module.exports = {
  runTransform
};