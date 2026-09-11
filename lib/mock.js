// ============================================================
// TransformAI - Local Fallback Generator
//
// IMPORTANT:
// This is NOT AI generation.
// It is only a reliability fallback when Gemini is unavailable.
// ============================================================


// ============================================================
// BASIC HELPERS
// ============================================================

function cleanText(text) {

  return String(
    text || ''
  )
    .replace(/\s+/g, ' ')
    .trim();

}


function getLanguage(params) {

  return String(
    params?.language ||
    'English'
  ).toLowerCase();

}


function isTamil(params) {

  return getLanguage(params)
    .includes('tamil');

}


function isHindi(params) {

  return getLanguage(params)
    .includes('hindi');

}


function isSpanish(params) {

  return getLanguage(params)
    .includes('spanish');

}


function isFrench(params) {

  return getLanguage(params)
    .includes('french');

}


// ============================================================
// FACT EXTRACTION FALLBACK
// ============================================================

function extractFactGraphMock(
  sourceText
) {

  const source =
    cleanText(
      sourceText
    );


  const sentences =
    source
      .split(
        /(?<=[.!?])\s+/
      )
      .map(cleanText)
      .filter(Boolean);


  const numbers =
    source.match(
      /\b\d[\d,.]*%?\b/g
    ) || [];


  const dates =
    source.match(
      /\b(?:\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})\b/g
    ) || [];


  const keywords = [];


  const importantWords = [

    'AI',

    'artificial intelligence',

    'platform',

    'learning',

    'students',

    'college',

    'education',

    'mobile',

    'computer',

    'progress',

    'resources',

    'personalized',

    'technology',

    'announcement',

    'launch'

  ];


  for (
    const word of importantWords
  ) {

    if (
      source
        .toLowerCase()
        .includes(
          word.toLowerCase()
        )
    ) {

      keywords.push(word);

    }

  }


  return {

    summary:
      sentences
        .slice(0, 2)
        .join(' '),

    facts:
      sentences
        .slice(0, 12),

    numbers:
      [...new Set(numbers)],

    dates:
      [...new Set(dates)],

    entities: [],

    keywords:
      [...new Set(keywords)],

    intent:
      sentences[0] ||
      'Inform the audience',

    _mode: 'demo'

  };

}


// ============================================================
// COMMON DEMO TRANSLATIONS
// ============================================================

function localizedText(
  text,
  params
) {

  if (!text) {
    return '';
  }


  // ----------------------------------------------------------
  // TAMIL
  // ----------------------------------------------------------

  if (isTamil(params)) {

    const translations = {

      'The college is launching a new AI-powered learning platform next month.':
        'எங்கள் கல்லூரி அடுத்த மாதம் புதிய AI அடிப்படையிலான கற்றல் தளத்தை அறிமுகப்படுத்துகிறது.',

      'The platform provides personalized study materials.':
        'இந்த தளம் தனிப்பயனாக்கப்பட்ட பாடப் பொருட்களை வழங்குகிறது.',

      'The platform tracks student progress.':
        'இந்த தளம் மாணவர்களின் கற்றல் முன்னேற்றத்தை கண்காணிக்கிறது.',

      'The platform recommends learning resources based on individual performance.':
        'தனிப்பட்ட செயல்திறனின் அடிப்படையில் இந்த தளம் கற்றல் ஆதாரங்களை பரிந்துரைக்கிறது.',

      'Students can access the platform through both mobile devices and computers.':
        'மாணவர்கள் மொபைல் சாதனங்கள் மற்றும் கணினிகள் மூலம் இந்த தளத்தை அணுகலாம்.',

      'The system is designed to help students study more effectively and identify subjects or topics where they need additional support.':
        'மாணவர்கள் திறம்பட படிக்கவும் கூடுதல் உதவி தேவைப்படும் பாடங்கள் அல்லது தலைப்புகளை அடையாளம் காணவும் இந்த அமைப்பு உதவுகிறது.',

      'The platform will initially be available to all undergraduate students.':
        'இந்த தளம் முதற்கட்டமாக அனைத்து இளங்கலை மாணவர்களுக்கும் கிடைக்கும்.'

    };


    return (
      translations[text] ||
      text
    );

  }


  // ----------------------------------------------------------
  // HINDI
  // ----------------------------------------------------------

  if (isHindi(params)) {

    const translations = {

      'The college is launching a new AI-powered learning platform next month.':
        'हमारा कॉलेज अगले महीने एक नया AI-संचालित लर्निंग प्लेटफॉर्म लॉन्च कर रहा है।',

      'The platform provides personalized study materials.':
        'यह प्लेटफॉर्म व्यक्तिगत अध्ययन सामग्री प्रदान करता है।',

      'The platform tracks student progress.':
        'यह प्लेटफॉर्म छात्रों की प्रगति को ट्रैक करता है।',

      'The platform recommends learning resources based on individual performance.':
        'यह प्लेटफॉर्म व्यक्तिगत प्रदर्शन के आधार पर सीखने के संसाधनों की सिफारिश करता है।',

      'Students can access the platform through both mobile devices and computers.':
        'छात्र मोबाइल उपकरणों और कंप्यूटर दोनों के माध्यम से इस प्लेटफॉर्म का उपयोग कर सकते हैं।',

      'The system is designed to help students study more effectively and identify subjects or topics where they need additional support.':
        'यह प्रणाली छात्रों को अधिक प्रभावी ढंग से अध्ययन करने और उन विषयों की पहचान करने में मदद करती है जहाँ उन्हें अतिरिक्त सहायता की आवश्यकता है।',

      'The platform will initially be available to all undergraduate students.':
        'यह प्लेटफॉर्म शुरुआत में सभी स्नातक छात्रों के लिए उपलब्ध होगा।'

    };


    return (
      translations[text] ||
      text
    );

  }


  // ----------------------------------------------------------
  // SPANISH
  // ----------------------------------------------------------

  if (isSpanish(params)) {

    const translations = {

      'The college is launching a new AI-powered learning platform next month.':
        'La universidad lanzará el próximo mes una nueva plataforma de aprendizaje impulsada por IA.',

      'The platform provides personalized study materials.':
        'La plataforma proporciona materiales de estudio personalizados.',

      'The platform tracks student progress.':
        'La plataforma realiza un seguimiento del progreso de los estudiantes.',

      'The platform recommends learning resources based on individual performance.':
        'La plataforma recomienda recursos de aprendizaje según el rendimiento individual.',

      'Students can access the platform through both mobile devices and computers.':
        'Los estudiantes pueden acceder a la plataforma mediante dispositivos móviles y computadoras.',

      'The platform will initially be available to all undergraduate students.':
        'La plataforma estará disponible inicialmente para todos los estudiantes universitarios.'

    };


    return (
      translations[text] ||
      text
    );

  }


  // ----------------------------------------------------------
  // FRENCH
  // ----------------------------------------------------------

  if (isFrench(params)) {

    const translations = {

      'The college is launching a new AI-powered learning platform next month.':
        'Notre établissement lancera le mois prochain une nouvelle plateforme d’apprentissage basée sur l’IA.',

      'The platform provides personalized study materials.':
        'La plateforme fournit des supports d’étude personnalisés.',

      'The platform tracks student progress.':
        'La plateforme suit les progrès des étudiants.',

      'The platform recommends learning resources based on individual performance.':
        'La plateforme recommande des ressources d’apprentissage en fonction des performances individuelles.',

      'Students can access the platform through both mobile devices and computers.':
        'Les étudiants peuvent accéder à la plateforme depuis des appareils mobiles et des ordinateurs.',

      'The platform will initially be available to all undergraduate students.':
        'La plateforme sera initialement disponible pour tous les étudiants de premier cycle.'

    };


    return (
      translations[text] ||
      text
    );

  }


  return text;

}


// ============================================================
// FACT HELPERS
// ============================================================

function getFacts(
  factGraph
) {

  if (
    factGraph &&
    Array.isArray(
      factGraph.facts
    )
  ) {

    return factGraph.facts
      .map(cleanText)
      .filter(Boolean);

  }


  return [];

}


// ============================================================
// GENERATE FORMAT
// ============================================================

function generateFormatMock(
  formatKey,
  factGraph,
  params = {}
) {

  const facts =
    getFacts(
      factGraph
    );


  const f =
    facts.map(
      fact =>
        localizedText(
          fact,
          params
        )
    );


  const firstFact =
    f[0] ||
    localizedText(
      factGraph?.summary ||
      'Content transformation',
      params
    );


  // ==========================================================
  // SLIDE
  // ==========================================================

  if (
    formatKey === 'slide'
  ) {

    return {

      slides: [

        {

          title:
            isTamil(params)
              ? 'முக்கிய தகவல்கள்'
              : isHindi(params)
                ? 'मुख्य जानकारी'
                : isSpanish(params)
                  ? 'Información principal'
                  : isFrench(params)
                    ? 'Informations principales'
                    : 'Key Information',

          bullets:
            f.slice(
              0,
              3
            )

        },

        {

          title:
            isTamil(params)
              ? 'முக்கிய அம்சங்கள்'
              : isHindi(params)
                ? 'मुख्य बिंदु'
                : isSpanish(params)
                  ? 'Puntos principales'
                  : isFrench(params)
                    ? 'Points principaux'
                    : 'Main Points',

          bullets:
            f.slice(
              3,
              6
            )

        }

      ].filter(
        slide =>
          slide.bullets.length > 0
      )

    };

  }


  // ==========================================================
  // SOCIAL
  // ==========================================================

  if (
    formatKey === 'social'
  ) {

    let post;


    if (isTamil(params)) {

      post =
        `📢 ${firstFact}`;

    } else if (isHindi(params)) {

      post =
        `📢 ${firstFact}`;

    } else if (isSpanish(params)) {

      post =
        `📢 ${firstFact}`;

    } else if (isFrench(params)) {

      post =
        `📢 ${firstFact}`;

    } else {

      post =
        `📢 ${firstFact}`;

    }


    return {

      post,

      hashtags: [

        '#TransformAI',

        '#AI',

        '#ContentTransformation'

      ]

    };

  }


  // ==========================================================
  // ADVISORY
  // ==========================================================

  if (
    formatKey === 'advisory'
  ) {

    return {

      headline:
        isTamil(params)
          ? 'முக்கிய அறிவிப்பு'
          : isHindi(params)
            ? 'महत्वपूर्ण सूचना'
            : isSpanish(params)
              ? 'Anuncio importante'
              : isFrench(params)
                ? 'Annonce importante'
                : 'Important Announcement',

      summary:
        firstFact,

      guidance:
        f.slice(
          1,
          5
        ),

      nextSteps:
        f.length > 5
          ? f[5]
          : firstFact

    };

  }


  // ==========================================================
  // VIDEO
  // ==========================================================

  if (
    formatKey === 'video'
  ) {

    const scenes =
      f.slice(
        0,
        5
      ).map(
        (fact, index) => ({

          visual:
            isTamil(params)
              ? `காட்சி ${index + 1}: ${fact}`
              : isHindi(params)
                ? `दृश्य ${index + 1}: ${fact}`
                : isSpanish(params)
                  ? `Escena ${index + 1}: ${fact}`
                  : isFrench(params)
                    ? `Scène ${index + 1} : ${fact}`
                    : `Scene ${index + 1}: ${fact}`,

          narration:
            fact

        })
      );


    return {

      scenes

    };

  }


  // ==========================================================
  // INFOGRAPHIC
  // ==========================================================

  if (
    formatKey === 'infographic'
  ) {

    const callouts =
      f.slice(
        0,
        5
      ).map(
        (fact, index) => ({

          label:
            isTamil(params)
              ? `முக்கிய தகவல் ${index + 1}`
              : isHindi(params)
                ? `मुख्य जानकारी ${index + 1}`
                : isSpanish(params)
                  ? `Dato clave ${index + 1}`
                  : isFrench(params)
                    ? `Information clé ${index + 1}`
                    : `Key fact ${index + 1}`,

          value:
            fact

        })
      );


    return {

      title:
        isTamil(params)
          ? 'உள்ளடக்கத்தின் முக்கிய தகவல்கள்'
          : isHindi(params)
            ? 'सामग्री की मुख्य जानकारी'
            : isSpanish(params)
              ? 'Información clave'
              : isFrench(params)
                ? 'Informations clés'
                : 'Key Information',

      callouts,

      takeaway:
        firstFact

    };

  }


  throw new Error(
    `Unknown format: ${formatKey}`
  );

}


module.exports = {

  extractFactGraphMock,

  generateFormatMock

};