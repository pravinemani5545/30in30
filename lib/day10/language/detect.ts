interface DetectionResult {
  language: string;
  confidence: "high" | "low";
}

const patterns: Array<{ language: string; tests: RegExp[] }> = [
  {
    language: "TypeScript",
    tests: [
      /:\s*(string|number|boolean|void|any|unknown|never)\b/,
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /<\w+>/,
      /as\s+\w+/,
    ],
  },
  {
    language: "JavaScript",
    tests: [
      /\b(const|let|var)\s+\w+\s*=/,
      /=>\s*[{(]/,
      /\bfunction\s+\w+/,
      /\brequire\s*\(/,
      /\bmodule\.exports\b/,
    ],
  },
  {
    language: "Python",
    tests: [
      /\bdef\s+\w+\s*\(/,
      /\bimport\s+\w+/,
      /\bclass\s+\w+.*:/,
      /\bself\b/,
      /\bprint\s*\(/,
    ],
  },
  {
    language: "SQL",
    tests: [
      /\bSELECT\b/i,
      /\bFROM\b/i,
      /\bWHERE\b/i,
      /\bINSERT\s+INTO\b/i,
      /\bCREATE\s+TABLE\b/i,
    ],
  },
  {
    language: "Go",
    tests: [
      /\bfunc\s+\w+/,
      /\bpackage\s+\w+/,
      /\bfmt\.\w+/,
      /:=\s*/,
      /\bgo\s+\w+/,
    ],
  },
  {
    language: "Rust",
    tests: [
      /\bfn\s+\w+/,
      /\blet\s+mut\b/,
      /\bimpl\s+\w+/,
      /\buse\s+\w+::/,
      /->.*\{/,
    ],
  },
  {
    language: "Java",
    tests: [
      /\bpublic\s+(static\s+)?class\b/,
      /\bSystem\.out\./,
      /\bprivate\s+\w+\s+\w+/,
      /\bnew\s+\w+\s*\(/,
      /@Override/,
    ],
  },
  {
    language: "Shell",
    tests: [/^#!/, /\becho\s+/, /\bfi\b/, /\bdone\b/, /\$\{?\w+\}?/],
  },
  {
    language: "PHP",
    tests: [
      /\$\w+\s*=/,
      /<\?php/,
      /\bfunction\s+\w+.*\$/,
      /\becho\s+/,
      /->\w+/,
    ],
  },
  {
    language: "Ruby",
    tests: [
      /\bdef\s+\w+/,
      /\bend\b/,
      /\bputs\s+/,
      /\bdo\s*\|/,
      /\brequire\s+['"]/,
    ],
  },
];

export function detectLanguage(code: string): DetectionResult {
  const scores: Record<string, number> = {};

  for (const { language, tests } of patterns) {
    let hits = 0;
    for (const test of tests) {
      if (test.test(code)) hits++;
    }
    if (hits > 0) scores[language] = hits;
  }

  const entries = Object.entries(scores).sort(([, a], [, b]) => b - a);

  if (entries.length === 0) {
    return { language: "Unknown", confidence: "low" };
  }

  const [topLang, topScore] = entries[0];
  const confidence = topScore >= 3 ? "high" : "low";

  return { language: topLang, confidence };
}
