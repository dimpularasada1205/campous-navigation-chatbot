package kiet.campusnav;

import java.util.*;

/**
 * PROJECT TITLE: KIET Campus Navigation Chatbot
 *
 * Subject Demonstration:
 * 1. Artificial Intelligence (AI) - Intelligent-agent query handling & navigation decision making.
 * 2. Advanced Data Structures & Algorithms (ADSA) - Campus represented as a graph, BFS/DFS pathfinding.
 * 3. Object-Oriented Programming through Java (OOPJ) - Java chatbot shell, Classes, Objects, Methods, Encapsulation.
 * 4. Python - Keyword-based intent classification (Directions / Timing / General).
 *
 * TECHNICAL FLOW:
 * STUDENT QUERY -> JAVA / OOPJ CHATBOT SHELL -> FORWARD TO PYTHON INTENT CLASSIFIER ->
 * DIRECTIONS / TIMING / GENERAL -> JAVA RECEIVES INTENT -> AI INTELLIGENT AGENT ->
 * ADSA CAMPUS GRAPH -> BFS / DFS -> FINAL TEXT RESPONSE
 */

// ==========================================
// 1. DOMAIN MODELS (OOP Encapsulation)
// ==========================================

class LocationNode {
    private String id;
    private String name;
    private String shortCode;
    private String building;
    private String floor;
    private String timings;
    private List<String> aliases;

    public LocationNode(String id, String name, String shortCode, String building, String floor, String timings, List<String> aliases) {
        this.id = id;
        this.name = name;
        this.shortCode = shortCode;
        this.building = building;
        this.floor = floor;
        this.timings = timings;
        this.aliases = aliases;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getShortCode() { return shortCode; }
    public String getBuilding() { return building; }
    public String getFloor() { return floor; }
    public String getTimings() { return timings; }
    public List<String> getAliases() { return aliases; }
}

class Edge {
    private String targetNodeId;
    private double distance; // in meters
    private double time; // in minutes
    private String description;

    public Edge(String targetNodeId, double distance, double time, String description) {
        this.targetNodeId = targetNodeId;
        this.distance = distance;
        this.time = time;
        this.description = description;
    }

    public String getTargetNodeId() { return targetNodeId; }
    public double getDistance() { return distance; }
    public double getTime() { return time; }
    public String getDescription() { return description; }
}

// ==========================================
// 2. ADSA CAMPUS GRAPH (BFS & DFS)
// ==========================================

class CampusGraph {
    private Map<String, LocationNode> locations;
    private Map<String, List<Edge>> adjacencyList;

    public CampusGraph() {
        this.locations = new HashMap<>();
        this.adjacencyList = new HashMap<>();
    }

    public void addLocation(LocationNode loc) {
        locations.put(loc.getId(), loc);
        adjacencyList.putIfAbsent(loc.getId(), new ArrayList<>());
    }

    public void addPathway(String fromId, String toId, double distance, double time, String description) {
        adjacencyList.get(fromId).add(new Edge(toId, distance, time, description));
        // Undirected graph (bidirectional walkways)
        adjacencyList.get(toId).add(new Edge(fromId, distance, time, "Walk along pathway toward destination."));
    }

    public LocationNode findLocation(String query) {
        if (query == null) return null;
        String clean = query.trim().toLowerCase().replaceAll("[?!,.]", " ");

        // Priority 1: Exact matches or longer aliases (e.g. "cse lab" over "cse")
        LocationNode bestMatch = null;
        int longestMatch = 0;

        for (LocationNode loc : locations.values()) {
            if (clean.equals(loc.getId().toLowerCase()) || clean.equals(loc.getShortCode().toLowerCase())) {
                return loc;
            }
            String nameLower = loc.getName().toLowerCase();
            if (clean.contains(nameLower) && nameLower.length() > longestMatch) {
                bestMatch = loc;
                longestMatch = nameLower.length();
            }
            for (String alias : loc.getAliases()) {
                String aliasLower = alias.toLowerCase();
                if (clean.contains(aliasLower) && aliasLower.length() > longestMatch) {
                    bestMatch = loc;
                    longestMatch = aliasLower.length();
                }
            }
        }
        return bestMatch;
    }

    public List<LocationNode> getAllLocations() {
        return new ArrayList<>(locations.values());
    }

    /**
     * ADSA BFS: Breadth-First Search for finding shortest path in unweighted graph.
     */
    public List<String> runBFS(String startId, String targetId) {
        if (!locations.containsKey(startId) || !locations.containsKey(targetId)) return null;
        if (startId.equals(targetId)) return Collections.singletonList(startId);

        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        Map<String, String> parentMap = new HashMap<>();

        queue.add(startId);
        visited.add(startId);
        boolean found = false;

        while (!queue.isEmpty()) {
            String current = queue.poll();
            if (current.equals(targetId)) {
                found = true;
                break;
            }

            for (Edge edge : adjacencyList.getOrDefault(current, Collections.emptyList())) {
                String neighbor = edge.getTargetNodeId();
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    parentMap.put(neighbor, current);
                    queue.add(neighbor);
                }
            }
        }

        if (!found) return null;

        List<String> path = new LinkedList<>();
        String curr = targetId;
        while (curr != null) {
            path.add(0, curr);
            curr = parentMap.get(curr);
        }
        return path;
    }

    public LocationNode getLocation(String id) {
        return locations.get(id);
    }
}

// ==========================================
// 3. PYTHON INTENT CLASSIFIER BRIDGE
// ==========================================

class PythonIntentClassifierBridge {
    public static class IntentResult {
        private String intent; // "directions", "timing", "general"

        public IntentResult(String intent) {
            this.intent = intent;
        }

        public String getIntent() { return intent; }
    }

    /**
     * Forwards query to Python Intent Classifier.
     * Keyword-based rule classification into: directions / timing / general.
     */
    public IntentResult forwardToPython(String rawQuery) {
        String clean = rawQuery.toLowerCase().trim();

        // 1. Timing check
        String[] timingKws = {"time", "timings", "what time", "when does", "when do", "open", "opens", "close", "closes", "hours", "schedule"};
        for (String kw : timingKws) {
            if (clean.contains(kw)) {
                return new IntentResult("timing");
            }
        }

        // 2. Directions check
        String[] directionsKws = {"where is", "how do i reach", "how to reach", "how to get", "route", "directions", "from", "location", "take me to", "reach the"};
        for (String kw : directionsKws) {
            if (clean.contains(kw)) {
                return new IntentResult("directions");
            }
        }

        // 3. General check
        return new IntentResult("general");
    }
}

// ==========================================
// 4. AI INTELLIGENT AGENT
// ==========================================

class AIAgent {
    private CampusGraph graph;

    public AIAgent(CampusGraph graph) {
        this.graph = graph;
    }

    public String handleQuery(String rawQuery, String intent, String startId) {
        String clean = rawQuery.toLowerCase().trim();

        // Check if user specifically requested "all locations" / broad list
        if (clean.contains("all locations") || clean.contains("list all") || clean.contains("all facilities")) {
            StringBuilder sb = new StringBuilder();
            sb.append("KIET Campus Locations (Sample / Prototype Data):\n\n");
            for (LocationNode loc : graph.getAllLocations()) {
                sb.append("• ").append(loc.getName()).append(" (").append(loc.getShortCode()).append(") – ")
                  .append(loc.getBuilding()).append(", ").append(loc.getFloor()).append("\n");
            }
            return sb.toString();
        }

        // Specific Timing Request
        if ("timing".equalsIgnoreCase(intent)) {
            LocationNode target = graph.findLocation(rawQuery);
            if (target != null) {
                if (target.getTimings() != null) {
                    return target.getName() + " Timings (Sample Data):\n\n" +
                           "• Building: " + target.getBuilding() + " (" + target.getFloor() + ")\n" +
                           "• " + target.getTimings();
                } else {
                    return "Sample timing data is not available for " + target.getName() + " yet.";
                }
            }

            return "KIET Campus Operational Timings (Sample Data):\n\n" +
                   "• Academic Departments: 9:00 AM – 4:30 PM\n" +
                   "• Library: 8:00 AM – 8:00 PM\n" +
                   "• CSE Lab: 9:00 AM – 5:00 PM\n" +
                   "• Canteen: 7:30 AM – 7:30 PM\n\n" +
                   "Ask about a specific facility (e.g., 'What are the library timings?' or 'When does the CSE lab open?').";
        }

        // Directions Request
        if ("directions".equalsIgnoreCase(intent) || graph.findLocation(rawQuery) != null) {
            LocationNode target = graph.findLocation(rawQuery);
            if (target == null) {
                return "I could not identify the specific destination from your request.\n\nPlease ask for a specific location such as:\n• 'Where is the library?'\n• 'How do I reach the CSE lab?'\n• 'Where is the lecture hall?'";
            }

            LocationNode start = graph.getLocation(startId);
            if (start == null) start = graph.getLocation("main-gate");

            // Execute ADSA BFS
            List<String> path = graph.runBFS(start.getId(), target.getId());
            if (path == null) {
                return "No connected path was found in the campus graph from " + start.getName() + " to " + target.getName() + ".";
            }

            StringBuilder sb = new StringBuilder();
            sb.append(target.getName()).append(" selected. Route found using BFS.\n\n");
            sb.append("START: ").append(start.getName()).append("\n");
            sb.append("DESTINATION: ").append(target.getName()).append(" (").append(target.getBuilding()).append(", ").append(target.getFloor()).append(")\n\n");
            sb.append("WALKING ROUTE:\n");
            for (int i = 0; i < path.size(); i++) {
                LocationNode stepLoc = graph.getLocation(path.get(i));
                sb.append(i + 1).append(". ").append(stepLoc.getName()).append("\n");
            }
            sb.append("\nView the highlighted route on the Campus Map.");
            return sb.toString();
        }

        // General Intent
        return "Welcome to the KIET Campus Navigation Chatbot!\n\n" +
               "Institution: Kakinada Institute of Engineering & Technology (KIET), Korangi.\n\n" +
               "I can help new students, faculty, and visitors find their way around campus:\n" +
               "• Directions: 'Where is the library?' or 'How do I reach the CSE lab?'\n" +
               "• Timings: 'What are the library timings?' or 'When does the CSE lab open?'\n" +
               "• Directory: 'List all campus locations'";
    }
}

// ==========================================
// 5. MAIN JAVA CHATBOT SHELL
// ==========================================

public class CampusChatbotShell {
    private CampusGraph graph;
    private PythonIntentClassifierBridge pythonBridge;
    private AIAgent aiAgent;

    public CampusChatbotShell() {
        this.graph = new CampusGraph();
        this.pythonBridge = new PythonIntentClassifierBridge();
        this.aiAgent = new AIAgent(this.graph);
        initializeSampleData();
    }

    private void initializeSampleData() {
        graph.addLocation(new LocationNode("main-gate", "Main Gate", "GATE", "Main Security Pavilion", "Ground Floor", "Opening: Open 24/7 | Closing: Open 24/7", Arrays.asList("main gate", "entrance", "gate", "front gate")));
        graph.addLocation(new LocationNode("admin-block", "Administrative Block", "ADMIN", "Sir CV Raman Block", "Ground & 1st Floor", "Opening: 9:00 AM | Closing: 5:00 PM", Arrays.asList("admin", "admin block", "administrative block", "principal office")));
        graph.addLocation(new LocationNode("library", "Library", "LIB", "Central Library Block", "Ground & 1st Floor", "Opening: 8:00 AM | Closing: 8:00 PM (Reading hall open until 9:30 PM on exam days)", Arrays.asList("library", "central library", "books", "reading room", "study hall")));
        graph.addLocation(new LocationNode("cse-dept", "CSE Department", "CSE", "Turing Academic Block A", "1st Floor", "Opening: 9:00 AM | Closing: 4:45 PM", Arrays.asList("cse", "cse dept", "cse department", "computer science")));
        graph.addLocation(new LocationNode("cai-dept", "CAI Department", "CAI", "Ada Lovelace Wing", "3rd Floor", "Opening: 9:00 AM | Closing: 4:45 PM", Arrays.asList("cai", "cai dept", "cai department", "artificial intelligence")));
        graph.addLocation(new LocationNode("cse-lab", "CSE Lab", "LAB", "Turing Block Ground Wing", "Ground Floor", "Opening: 9:00 AM | Closing: 5:00 PM (Closed on college holidays)", Arrays.asList("cse lab", "lab", "computer lab", "programming lab", "coding lab")));
        graph.addLocation(new LocationNode("lecture-hall", "Lecture Hall Complex", "LH", "Visvesvaraya Block", "1st & 2nd Floors", "Opening: 9:00 AM | Closing: 4:30 PM", Arrays.asList("lecture hall", "lecture halls", "lecture hall complex", "classrooms", "lh")));
        graph.addLocation(new LocationNode("canteen", "Canteen", "FOOD", "Food Court", "Ground Floor", "Opening: 7:30 AM | Closing: 7:30 PM", Arrays.asList("canteen", "cafeteria", "food", "snacks")));

        // Walkway connections
        graph.addPathway("main-gate", "admin-block", 140, 2.0, "Walk directly north along Central Boulevard toward Administrative Block.");
        graph.addPathway("admin-block", "library", 120, 1.8, "Proceed north past central circle; Library entrance faces directly ahead.");
        graph.addPathway("admin-block", "lecture-hall", 100, 1.5, "Walk northeast across the lawn toward Lecture Hall Complex.");
        graph.addPathway("library", "lecture-hall", 85, 1.2, "Walk east along paved corridor connecting Library and Lecture Hall Complex.");
        graph.addPathway("library", "cse-dept", 110, 1.5, "Walk northeast across courtyard into Turing Academic Block.");
        graph.addPathway("library", "cse-lab", 95, 1.2, "Proceed north into Ground Floor wing of Turing Block to reach CSE Lab.");
        graph.addPathway("cse-lab", "cse-dept", 50, 0.8, "Take central stairs up one flight to 1st Floor CSE Department.");
        graph.addPathway("cse-dept", "cai-dept", 80, 1.0, "Ascend to 3rd Floor via central staircase to Ada Lovelace Wing.");
        graph.addPathway("cse-dept", "canteen", 180, 2.2, "Walk southeast along main avenue towards Canteen & Food Court.");
        graph.addPathway("lecture-hall", "canteen", 170, 2.0, "Follow walkway east past academic quadrangle toward Canteen.");
    }

    /**
     * Main pipeline method executing the complete technical flow.
     */
    public String processStudentQuery(String rawStudentQuery) {
        // Step 1: Java forwards raw query to Python
        PythonIntentClassifierBridge.IntentResult pythonResult = pythonBridge.forwardToPython(rawStudentQuery);
        String intent = pythonResult.getIntent();

        // Step 2: Java receives intent and triggers AI Intelligent-Agent Handling
        // Step 3: AI Agent queries ADSA Campus Graph using BFS
        // Step 4: Return final text response
        return aiAgent.handleQuery(rawStudentQuery, intent, "main-gate");
    }

    public static void main(String[] args) {
        CampusChatbotShell shell = new CampusChatbotShell();
        System.out.println("==================================================");
        System.out.println("KIET CAMPUS NAVIGATION CHATBOT - JAVA SHELL");
        System.out.println("==================================================");

        String test1 = "Where is the library?";
        System.out.println("\nQuery 1: " + test1);
        System.out.println(shell.processStudentQuery(test1));

        String test2 = "What are the library timings?";
        System.out.println("\nQuery 2: " + test2);
        System.out.println(shell.processStudentQuery(test2));

        String test3 = "When does the CSE lab open?";
        System.out.println("\nQuery 3: " + test3);
        System.out.println(shell.processStudentQuery(test3));
    }
}
