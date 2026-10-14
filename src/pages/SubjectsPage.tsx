import React from 'react';
import { 
  Bot, 
  Binary, 
  Code2, 
  FileCode, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

export const SubjectsPage: React.FC = () => {
  const academicSubjects = [
    {
      id: "ai",
      title: "ARTIFICIAL INTELLIGENCE (AI)",
      shortName: "AI",
      icon: Bot,
      tag: "Intelligent-Agent Architecture",
      color: "purple",
      roleHeader: "Role in Project:",
      roles: [
        "Intelligent-agent query handling",
        "Query understanding",
        "BFS/DFS-based navigation decision making"
      ],
      description: "Represented as an intelligent agent with a perception-deliberation-action cycle: receives student query, interprets classified intent, and decides whether to invoke graph pathfinding, provide timing details, or supply general campus information.",
      vivaPoints: [
        "Intelligent Agent model: Goal-directed decision maker",
        "Transparent logic: Rule/Agent-based without claiming LLM/deep learning",
        "State perception: Integrates user start location context",
        "Action selection: Chooses optimal pathfinding or response template"
      ]
    },
    {
      id: "adsa",
      title: "ADVANCED DATA STRUCTURES & ALGORITHMS (ADSA)",
      shortName: "ADSA",
      icon: Binary,
      tag: "Graph Theory & Search Algorithms",
      color: "indigo",
      roleHeader: "Role in Project:",
      roles: [
        "Campus represented as a graph",
        "Locations as nodes",
        "Paths as edges",
        "BFS/DFS pathfinding"
      ],
      description: "The campus layout is modeled as an unweighted/weighted graph G = (V, E) where physical buildings are vertices and walkable pathways are edges. Breadth-First Search (BFS) is the primary algorithm to compute shortest paths.",
      vivaPoints: [
        "Nodes (Vertices): Campus departments, labs, libraries, gates",
        "Edges: Walkable pedestrian connections between landmarks",
        "BFS (Breadth-First Search): Guarantees shortest path in unweighted graph",
        "DFS (Depth-First Search): Alternative graph traversal demonstration"
      ]
    },
    {
      id: "oopj",
      title: "OBJECT-ORIENTED PROGRAMMING THROUGH JAVA (OOPJ)",
      shortName: "OOPJ",
      icon: Code2,
      tag: "Software Engineering & Architecture",
      color: "amber",
      roleHeader: "Role in Project:",
      roles: [
        "Java chatbot shell",
        "Classes and objects",
        "Query processing",
        "Response handling"
      ],
      description: "Java acts as the main chatbot shell and coordination layer. Encapsulates core components into clean classes (StudentQuery, CampusGraph, AIAgent, ResponseTemplateSelector) adhering to object-oriented programming principles.",
      vivaPoints: [
        "Classes & Objects: Encapsulation of state and operations",
        "Methods: Structured message handling and pipeline orchestration",
        "Data Abstraction: Decouples UI layers from internal algorithmic graphs",
        "Modularity: Clean separation between graph handling and text generation"
      ]
    },
    {
      id: "python",
      title: "PYTHON",
      shortName: "PYTHON",
      icon: FileCode,
      tag: "Keyword-Based Intent Classification",
      color: "emerald",
      roleHeader: "Role in Project:",
      roles: [
        "Keyword-based intent classification",
        "Directions / Timing / General classification",
        "JSON response returned to Java"
      ],
      description: "Python implements a simple, transparent keyword-based intent classifier. Categorizes incoming student queries into exactly three classes and outputs a lightweight JSON payload returned to Java.",
      vivaPoints: [
        "Intent Categories: 'directions', 'timing', 'general'",
        "JSON Contract: Structured response format { \"intent\": \"...\" }",
        "Transparent classification: Keyword matching without complex ML overhead",
        "Fast response time: Immediate classification for real-time querying"
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Subjects
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Project Demonstration
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          The four academic subjects demonstrated in the design, data structures, and implementation of the KIET Campus Navigation Chatbot.
        </p>
      </div>

      {/* The 4 Academic Subjects Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {academicSubjects.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div
              key={sub.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-6"
            >
              <div className="space-y-4">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                    0{idx + 1}
                  </span>
                </div>

                {/* Subject Title */}
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {sub.tag}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                    {sub.title}
                  </h2>
                </div>

                {/* Role in Project (Exact Required Points) */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    {sub.roleHeader}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {sub.roles.map((role, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Contribution */}
                <div className="space-y-1 text-xs">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Technical Implementation:
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                {/* Viva Key Points */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Viva Discussion Points:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    {sub.vivaPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span className="text-[11px]">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
