import { Location } from '../types';
import { CampusIntent } from './pythonClassifier';

export interface ExtractedQuery {
  intent: CampusIntent;
  targetEntity?: Location;
  startEntity?: Location;
  isBroadLocationsQuery: boolean;
  rawText: string;
}

const TIMING_PATTERNS = [
  /\b(time|timings|what\s+time|when\s+does|when\s+do|open|opens|opening|close|closes|closing|hours|schedule)\b/i
];

const DIRECTION_PATTERNS = [
  /\b(where\s+is|where\s+are|where\'s|where\s+can\s+i\s+find|how\s+do\s+i\s+reach|how\s+can\s+i\s+reach|how\s+to\s+reach|how\s+to\s+get\s+to|how\s+do\s+i\s+get\s+to|directions?\s+to|route\s+to|route\s+from|way\s+to|take\s+me\s+to|guide\s+me\s+to|i\s+need\s+to\s+go\s+to|i\s+want\s+to\s+go\s+to|locate|location)\b/i
];

const BROAD_LOCATIONS_PATTERNS = [
  /\b(all\s+locations|list\s+all\s+locations|list\s+all|list\s+locations|show\s+all\s+locations|show\s+all|all\s+facilities|tell\s+me\s+about\s+all\s+campus\s+facilities|every\s+location|all\s+departments)\b/i
];

/**
 * Extracts BOTH Intent and Target Entity from student query.
 */
export function extractEntityAndIntent(
  rawQuery: string,
  locations: Location[],
  defaultStartLocationId: string = 'main-gate'
): ExtractedQuery {
  const clean = rawQuery.toLowerCase().replace(/[?!,.]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Check if user is asking for broad list of all locations
  const isBroadLocationsQuery = BROAD_LOCATIONS_PATTERNS.some(p => p.test(clean));

  // 2. Classify Intent: timing vs directions vs general
  let intent: CampusIntent = 'general';
  if (TIMING_PATTERNS.some(p => p.test(clean))) {
    intent = 'timing';
  } else if (DIRECTION_PATTERNS.some(p => p.test(clean))) {
    intent = 'directions';
  }

  // 3. Extract Target Entity / Destination
  // Sort locations by alias/name length descending so longer phrases match first (e.g. "cse lab" matches before "cse")
  let targetEntity: Location | undefined;
  let startEntity: Location | undefined;

  // Check for "from [Start] to [Dest]"
  const fromToMatch = clean.match(/(?:from|at|starting\s+at)\s+([a-z0-9\s&]+?)\s+(?:to|reach|get\s+to|towards)\s+([a-z0-9\s&]+)/i);
  if (fromToMatch) {
    const rawStart = fromToMatch[1].trim();
    const rawDest = fromToMatch[2].trim();
    startEntity = findEntityInText(rawStart, locations);
    targetEntity = findEntityInText(rawDest, locations);
    intent = 'directions';
  }

  // Check for "reach [Dest] from [Start]"
  if (!targetEntity) {
    const reachFromMatch = clean.match(/(?:reach|get\s+to|route\s+to)\s+([a-z0-9\s&]+?)\s+from\s+([a-z0-9\s&]+)/i);
    if (reachFromMatch) {
      targetEntity = findEntityInText(reachFromMatch[1].trim(), locations);
      startEntity = findEntityInText(reachFromMatch[2].trim(), locations);
      intent = 'directions';
    }
  }

  // General Entity Scan across query
  if (!targetEntity) {
    targetEntity = findEntityInText(clean, locations);
  }

  // If a specific entity was found and no timing keyword was used, but the user asked about it, treat as directions if appropriate
  if (targetEntity && intent === 'general') {
    // Queries like "library", "cse lab", "lecture hall", "library location", "where is library"
    if (clean.includes('where') || clean.includes('how') || clean.includes('reach') || clean.includes('location') || clean.split(' ').length <= 4) {
      intent = 'directions';
    }
  }

  if (!startEntity) {
    startEntity = locations.find(l => l.id === defaultStartLocationId) || locations.find(l => l.id === 'main-gate');
  }

  return {
    intent,
    targetEntity,
    startEntity,
    isBroadLocationsQuery,
    rawText: rawQuery
  };
}

/**
 * Searches for a location entity inside text, prioritizing longer exact tokens.
 */
function findEntityInText(text: string, locations: Location[]): Location | undefined {
  const clean = text.toLowerCase().trim();

  // Candidate matches scored by length of match
  let candidates: { loc: Location; matchLen: number }[] = [];

  for (const loc of locations) {
    // 1. Exact ID
    if (clean === loc.id.toLowerCase()) {
      return loc;
    }

    // 2. Exact shortCode
    if (clean.split(/\s+/).includes(loc.shortCode.toLowerCase())) {
      candidates.push({ loc, matchLen: loc.shortCode.length + 5 });
    }

    // 3. Name check (exact or substring)
    const nameLower = loc.name.toLowerCase();
    if (clean.includes(nameLower)) {
      candidates.push({ loc, matchLen: nameLower.length });
    }

    // 4. Aliases
    for (const alias of loc.aliases) {
      const aliasLower = alias.toLowerCase();
      // Match whole phrase or token
      const regex = new RegExp(`\\b${escapeRegExp(aliasLower)}\\b`, 'i');
      if (regex.test(clean)) {
        candidates.push({ loc, matchLen: aliasLower.length });
      }
    }
  }

  if (candidates.length > 0) {
    // Sort descending by match length
    candidates.sort((a, b) => b.matchLen - a.matchLen);
    return candidates[0].loc;
  }

  return undefined;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
