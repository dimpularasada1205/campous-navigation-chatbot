import { Location, Connection, ChatMessage } from '../types';
import { JavaChatbotShell } from './javaChatbotShell';

/**
 * Technical Architecture Entry Point:
 *
 * STUDENT QUERY
 *       ↓
 * JAVA / OOPJ CHATBOT SHELL
 *       ↓
 * JAVA FORWARDS RAW QUERY TO PYTHON
 *       ↓
 * PYTHON KEYWORD-BASED INTENT CLASSIFIER
 *       ↓
 * DIRECTIONS / TIMING / GENERAL
 *       ↓
 * JAVA RECEIVES INTENT
 *       ↓
 * AI INTELLIGENT-AGENT HANDLING
 *       ↓
 * ADSA CAMPUS GRAPH
 *       ↓
 * BFS / DFS PATHFINDING
 *       ↓
 * FINAL TEXT RESPONSE
 */
export function processChatQuery(
  userQuery: string,
  locations: Location[],
  connections: Connection[],
  userContext?: { currentStartLocationId?: string }
): ChatMessage {
  const javaShell = new JavaChatbotShell(locations, connections);
  const startId = userContext?.currentStartLocationId || 'main-gate';
  return javaShell.processStudentQuery(userQuery, startId);
}
