/**
 * PYTHON INTENT CLASSIFIER (Transpiled / Client Bridge)
 *
 * Subject: Python
 * Role in Project:
 * - Keyword-based intent classification
 * - Directions / Timing / General classification
 * - JSON response returned to Java
 *
 * Note: Uses simple and transparent keyword matching.
 * Does NOT use machine learning or LLMs.
 */

export type CampusIntent = 'directions' | 'timing' | 'general';

export interface PythonIntentResponse {
  intent: CampusIntent;
  matchedKeywords: string[];
  rawQuery: string;
}

// Transparent keyword sets for each intent category
const TIMING_KEYWORDS = [
  'time',
  'timings',
  'what time',
  'when does',
  'when do',
  'open',
  'opens',
  'close',
  'closes',
  'closing',
  'opening',
  'hours',
  'working hours',
  'schedule'
];

const DIRECTION_KEYWORDS = [
  'where is',
  'where are',
  "where's",
  'where can i find',
  'how do i reach',
  'how can i reach',
  'how to reach',
  'how do i get to',
  'how to get to',
  'how can i get to',
  'i need to go to',
  'i want to go to',
  'reach the',
  'reach lab',
  'reach library',
  'route to',
  'route from',
  'way to',
  'directions to',
  'direction to',
  'show me the route',
  'take me to',
  'guide me to',
  'step by step',
  'how to walk',
  'path to',
  'walk to',
  'from',
  'location'
];

const GENERAL_KEYWORDS = [
  'tell me about',
  'about the campus',
  'about campus',
  'what facilities',
  'facilities are available',
  'facilities',
  'overview',
  'information',
  'info',
  'help',
  'who are you',
  'what can you do',
  'introduce',
  'welcome',
  'hi',
  'hello',
  'hey',
  'namaste',
  'greetings',
  'thank you',
  'thanks'
];

/**
 * Classifies a student's raw text query into ONLY:
 * 1. "directions"
 * 2. "timing"
 * 3. "general"
 *
 * Returns a simple JSON response: { "intent": ... }
 */
export function classifyIntentWithPython(rawText: string): PythonIntentResponse {
  const query = rawText.toLowerCase().trim();
  const matchedKeywords: string[] = [];

  // Check 1: Timing keywords take precedence when timing words are present
  // e.g. "What time does the library open?", "When does the lab close?"
  for (const kw of TIMING_KEYWORDS) {
    if (query.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }
  if (matchedKeywords.length > 0) {
    return {
      intent: 'timing',
      matchedKeywords,
      rawQuery: rawText
    };
  }

  // Check 2: Direction keywords
  // e.g. "Where is the library?", "How do I reach the lab?", "Where is the lecture hall?"
  for (const kw of DIRECTION_KEYWORDS) {
    if (query.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }
  if (matchedKeywords.length > 0) {
    return {
      intent: 'directions',
      matchedKeywords,
      rawQuery: rawText
    };
  }

  // Check 3: General campus queries
  // e.g. "Tell me about the campus.", "What facilities are available?"
  for (const kw of GENERAL_KEYWORDS) {
    if (query.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }
  if (matchedKeywords.length > 0) {
    return {
      intent: 'general',
      matchedKeywords,
      rawQuery: rawText
    };
  }

  // Fallback: If no explicit keyword was found, default to 'general'
  return {
    intent: 'general',
    matchedKeywords: ['default-fallback'],
    rawQuery: rawText
  };
}
