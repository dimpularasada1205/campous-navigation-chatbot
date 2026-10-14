/**
 * OBJECT-ORIENTED PROGRAMMING THROUGH JAVA (OOPJ) & AI AGENT ARCHITECTURE
 *
 * Subject Alignment:
 * 1. Object-Oriented Programming through Java (OOPJ):
 *    - Java Chatbot Shell
 *    - Classes and Objects (StudentQuery, CampusGraphHandler, AIAgentDecisionMaker, ResponseTemplateSelector, JavaChatbotShell)
 *    - Encapsulation, Methods, and Clean Abstraction
 *
 * 2. Artificial Intelligence (AI):
 *    - Intelligent-Agent Based Query Handling and Navigation Decision Making
 *    - Goal-directed perception-deliberation-action cycle
 *    - Rule/Agent-based decision making without claiming LLM/deep learning
 *
 * Technical Flow:
 * STUDENT QUERY -> JAVA CHATBOT SHELL -> FORWARD TO PYTHON INTENT CLASSIFIER ->
 * DIRECTIONS / TIMING / GENERAL -> JAVA RECEIVES INTENT -> AI INTELLIGENT AGENT ->
 * ADSA CAMPUS GRAPH -> BFS / DFS -> FINAL TEXT RESPONSE
 */

import { Location, Connection, RouteResult, ChatMessage, FlowTrace } from '../types';
import { CampusIntent } from './pythonClassifier';
import { findShortestPath } from './routeAlgorithm';
import { extractEntityAndIntent, ExtractedQuery } from './entityExtractor';

/**
 * 1. Class StudentQuery (OOP Encapsulation)
 * Holds student's raw text query, timestamps, and context state.
 */
export class StudentQuery {
  private rawQuery: string;
  private currentStartLocationId: string;
  private timestamp: Date;

  constructor(rawQuery: string, currentStartLocationId: string = 'main-gate') {
    this.rawQuery = rawQuery;
    this.currentStartLocationId = currentStartLocationId;
    this.timestamp = new Date();
  }

  public getRawQuery(): string {
    return this.rawQuery;
  }

  public getCurrentStartLocationId(): string {
    return this.currentStartLocationId;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }
}

/**
 * 2. Class CampusGraphHandler (ADSA Bridge)
 * Encapsulates the campus graph and delegates pathfinding to BFS/DFS.
 */
export class CampusGraphHandler {
  private locations: Location[];
  private connections: Connection[];

  constructor(locations: Location[], connections: Connection[]) {
    this.locations = locations;
    this.connections = connections;
  }

  public findRoute(startId: string, destId: string, algorithm: 'BFS' | 'DFS' = 'BFS'): RouteResult | null {
    return findShortestPath(startId, destId, this.locations, this.connections, algorithm);
  }

  public getLocationById(id: string): Location | undefined {
    return this.locations.find(l => l.id === id);
  }

  public getAllLocations(): Location[] {
    return this.locations;
  }
}

/**
 * 3. Class AIAgentDecisionMaker (AI Component)
 * “Intelligent-agent based query handling and navigation decision making.”
 *
 * Acts as the agent brain:
 * - Perceives student query & Python-classified intent & extracted entity
 * - Decides action policy:
 *   a) SPECIFIC TIMING: Return ONLY the specific facility asked about.
 *   b) SPECIFIC DIRECTIONS: Execute BFS/DFS for the target destination.
 *   c) BROAD / ALL LOCATIONS: List all prototype campus locations when asked.
 *   d) GENERAL: General campus overview without dumping entire location specs.
 */
export class AIAgentDecisionMaker {
  private graphHandler: CampusGraphHandler;

  constructor(graphHandler: CampusGraphHandler) {
    this.graphHandler = graphHandler;
  }

  public deliberate(
    studentQuery: StudentQuery
  ): {
    intent: CampusIntent;
    actionType: 'CALCULATE_DIRECTIONS' | 'LOOKUP_TIMING' | 'LIST_ALL_LOCATIONS' | 'PROVIDE_GENERAL_INFO';
    targetEntity?: Location;
    startEntity?: Location;
    route?: RouteResult | null;
    algorithm: 'BFS' | 'DFS';
    isBroadQuery: boolean;
  } {
    const locations = this.graphHandler.getAllLocations();
    const extracted: ExtractedQuery = extractEntityAndIntent(
      studentQuery.getRawQuery(),
      locations,
      studentQuery.getCurrentStartLocationId()
    );

    const algorithm: 'BFS' | 'DFS' = 'BFS'; // Official project requirement: BFS

    // 1. Broad request for all locations
    if (extracted.isBroadLocationsQuery) {
      return {
        intent: 'general',
        actionType: 'LIST_ALL_LOCATIONS',
        algorithm,
        isBroadQuery: true
      };
    }

    // 2. Specific Timing request
    if (extracted.intent === 'timing') {
      return {
        intent: 'timing',
        actionType: 'LOOKUP_TIMING',
        targetEntity: extracted.targetEntity,
        startEntity: extracted.startEntity,
        algorithm,
        isBroadQuery: !extracted.targetEntity
      };
    }

    // 3. Directions request or specific entity identified
    if (extracted.intent === 'directions' || extracted.targetEntity) {
      let route: RouteResult | null = null;
      if (extracted.targetEntity && extracted.startEntity) {
        route = this.graphHandler.findRoute(
          extracted.startEntity.id,
          extracted.targetEntity.id,
          algorithm
        );
      }

      return {
        intent: 'directions',
        actionType: 'CALCULATE_DIRECTIONS',
        targetEntity: extracted.targetEntity,
        startEntity: extracted.startEntity,
        route,
        algorithm,
        isBroadQuery: false
      };
    }

    // 4. Default: General query
    return {
      intent: 'general',
      actionType: 'PROVIDE_GENERAL_INFO',
      algorithm,
      isBroadQuery: false
    };
  }
}

/**
 * 4. Class ResponseTemplateSelector (OOP Response Formatting)
 * Selects and populates clean, text-only responses according to the agent's decision.
 * ENFORCES: Specific query -> Specific answer. No unrelated info dumps.
 */
export class ResponseTemplateSelector {
  /**
   * Generates entity-specific directions response.
   */
  public static formatDirections(
    destination: Location,
    startLocation: Location,
    route: RouteResult | null,
    algorithm: 'BFS' | 'DFS' = 'BFS'
  ): string {
    if (!route) {
      return `${destination.name} selected.\n\n` +
        `Building: ${destination.building} (${destination.floor})\n\n` +
        `Note: No direct walkable path was found in the campus graph from ${startLocation.name}. Please select another starting location or consult the Campus Map.`;
    }

    const stepsText = route.steps
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join('\n');

    return `${destination.name} selected. Route found using ${algorithm}.\n\n` +
      `START: ${startLocation.name}\n` +
      `DESTINATION: ${destination.name} (${destination.building}, ${destination.floor})\n` +
      `ESTIMATED WALK: ~${route.totalDistance}m (approx. ${route.estimatedTime} min)\n\n` +
      `WALKING ROUTE:\n` +
      `${stepsText}\n\n` +
      `View the highlighted route on the Campus Map.`;
  }

  /**
   * Generates entity-specific timing response.
   * Answers ONLY about the requested facility!
   */
  public static formatTiming(targetEntity?: Location): string {
    // If a specific location was asked for: return ONLY that location's timing
    if (targetEntity) {
      if (!targetEntity.timings) {
        return `Sample timing data is not available for ${targetEntity.name} yet.`;
      }

      return `${targetEntity.name} Timings (Sample Data):\n\n` +
        `• Building: ${targetEntity.building} (${targetEntity.floor})\n` +
        `• ${targetEntity.timings}`;
    }

    // If general timing question with no specific entity: brief campus timings
    return `KIET Campus Operational Timings (Sample Data):\n\n` +
      `• Academic Departments: 9:00 AM – 4:30 PM\n` +
      `• Library: 8:00 AM – 8:00 PM\n` +
      `• CSE Lab: 9:00 AM – 5:00 PM\n` +
      `• Canteen: 7:30 AM – 7:30 PM\n` +
      `• Administrative Block: 9:00 AM – 5:00 PM\n\n` +
      `Ask about a specific facility (e.g., "What are the library timings?" or "When does the CSE lab open?").`;
  }

  /**
   * Generates full directory list ONLY when user explicitly asks for all locations.
   */
  public static formatAllLocations(locations: Location[]): string {
    const list = locations
      .map(l => `• ${l.name} (${l.shortCode}) – ${l.building}, ${l.floor}`)
      .join('\n');

    return `KIET Campus Locations (Sample / Prototype Data):\n\n${list}\n\n` +
      `You can ask for directions or timings for any of these locations anytime!`;
  }

  /**
   * Generates general campus overview response.
   */
  public static formatGeneral(): string {
    return `Welcome to the KIET Campus Navigation Chatbot!\n\n` +
      `Institution: Kakinada Institute of Engineering & Technology (KIET), Korangi.\n\n` +
      `I can help new students, faculty, and visitors find their way around campus:\n` +
      `• Directions: "Where is the library?" or "How do I reach the CSE lab?"\n` +
      `• Timings: "What are the library timings?" or "When does the CSE lab open?"\n` +
      `• Directory: "List all campus locations"\n\n` +
      `Type your query below to get directions or specific facility details!`;
  }
}

/**
 * 5. Class JavaChatbotShell (Main OOPJ Shell Component)
 * Coordinates the full student query lifecycle.
 */
export class JavaChatbotShell {
  private campusGraphHandler: CampusGraphHandler;
  private aiAgent: AIAgentDecisionMaker;

  constructor(locations: Location[], connections: Connection[]) {
    this.campusGraphHandler = new CampusGraphHandler(locations, connections);
    this.aiAgent = new AIAgentDecisionMaker(this.campusGraphHandler);
  }

  /**
   * Main pipeline method:
   * Student Query -> Java Shell -> Python Intent Classifier -> AI Agent -> ADSA Graph (BFS/DFS) -> Response.
   */
  public processStudentQuery(
    rawText: string,
    currentStartLocationId: string = 'main-gate'
  ): ChatMessage {
    const studentQuery = new StudentQuery(rawText, currentStartLocationId);

    // AI Intelligent Agent Deliberation
    const decision = this.aiAgent.deliberate(studentQuery);

    let responseText = '';
    let quickReplies: string[] = [];

    if (decision.actionType === 'CALCULATE_DIRECTIONS') {
      if (decision.targetEntity && decision.startEntity) {
        responseText = ResponseTemplateSelector.formatDirections(
          decision.targetEntity,
          decision.startEntity,
          decision.route || null,
          decision.algorithm
        );
        quickReplies = [
          'View Route on Map',
          `What are the ${decision.targetEntity.name} timings?`,
          'Where is the library?',
          'Where is the CSE lab?'
        ];
      } else {
        responseText = `I could not identify the specific destination from your request.\n\nPlease ask for a specific location such as:\n• "Where is the library?"\n• "How do I reach the CSE lab?"\n• "Where is the lecture hall?"`;
        quickReplies = [
          'Where is the library?',
          'How do I reach the CSE lab?',
          'Where is the lecture hall?',
          'List all campus locations'
        ];
      }
    } else if (decision.actionType === 'LOOKUP_TIMING') {
      responseText = ResponseTemplateSelector.formatTiming(decision.targetEntity);
      if (decision.targetEntity) {
        quickReplies = [
          `Where is the ${decision.targetEntity.name}?`,
          'What are the library timings?',
          'When does the CSE lab open?'
        ];
      } else {
        quickReplies = [
          'What are the library timings?',
          'When does the CSE lab open?',
          'Where is the library?'
        ];
      }
    } else if (decision.actionType === 'LIST_ALL_LOCATIONS') {
      responseText = ResponseTemplateSelector.formatAllLocations(
        this.campusGraphHandler.getAllLocations()
      );
      quickReplies = [
        'Where is the library?',
        'How do I reach the CSE lab?',
        'What are the library timings?'
      ];
    } else {
      responseText = ResponseTemplateSelector.formatGeneral();
      quickReplies = [
        'Where is the library?',
        'What are the library timings?',
        'How do I reach the CSE lab?',
        'List all campus locations'
      ];
    }

    const flowTrace: FlowTrace = {
      intent: decision.intent,
      algorithm: decision.algorithm,
      detectedDestination: decision.targetEntity?.name,
      detectedStart: decision.startEntity?.name,
      stage: 'Java Chatbot Shell → Python Classifier → AI Agent → ADSA Graph (BFS) → Response'
    };

    return {
      id: `msg-bot-${Date.now()}`,
      sender: 'bot',
      text: responseText,
      timestamp: new Date(),
      route: decision.route || undefined,
      targetLocation: decision.targetEntity,
      quickReplies,
      flowTrace
    };
  }
}
