import React from 'react';
import { 
  Building2, 
  MapPin, 
  Compass, 
  HelpCircle, 
  Target, 
  Lightbulb, 
  Code, 
  GraduationCap, 
  CheckCircle2 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16">
      {/* College & Project Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Kakinada Institute of Engineering and Technology (KIET)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            KIET Campus Navigation Chatbot
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              Korangi, Kakinada District, Andhra Pradesh - 533461, India
            </span>
            <span>·</span>
            <span className="text-blue-300">Academic Project (2nd / 3rd Year Engineering)</span>
          </div>
        </div>
      </div>

      {/* Main Content: Project Overview & Objectives */}
      <div className="space-y-8">
        {/* 1. About the Project */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            About the Project
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The <strong className="text-slate-900 dark:text-white">KIET Campus Navigation Chatbot</strong> is an academic web application created for the Kakinada Institute of Engineering and Technology (KIET), located at Korangi, Kakinada, Andhra Pradesh, India.
            The application serves as an interactive, digital wayfinding solution that empowers newly admitted students, visiting parents, faculty members, and campus guests to effortlessly discover academic departments, computing laboratories, administrative offices, sports amenities, and food courts across the campus.
          </p>
        </section>

        {/* 2. Problem We Are Solving */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            Problem We Are Solving
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">1. Complex Multi-Block Campus Layout</span>
              <p>New first-year students and parents frequently get lost searching for specific departmental laboratories or administrative offices.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">2. Inefficient Oral Inquiries</span>
              <p>Visitors rely on asking security guards or busy passersby for manual directions, which often leads to ambiguous verbal instructions and walking detour routes.</p>
            </div>
          </div>
        </section>

        {/* 3. Project Objective */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Project Objective
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Develop an accessible, natural language navigation chatbot that immediately extracts destination intents and provides turn-by-turn guidance.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Implement graph theory and Shortest Path Algorithms to compute optimal walking paths between any two campus points.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Provide an interactive schematic campus map that visually renders routes and highlights node markers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Structure a clean, maintainable relational database schema capable of accommodating verified campus blueprints and expansion records.</span>
            </li>
          </ul>
        </section>

        {/* 4. How It Works */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-1">
              <span className="font-bold text-blue-900 dark:text-blue-200">1. Java Chatbot Shell</span>
              <p className="text-slate-600 dark:text-slate-300">Receives student's raw query and forwards it to the Python intent classifier.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-1">
              <span className="font-bold text-blue-900 dark:text-blue-200">2. Python Classifier</span>
              <p className="text-slate-600 dark:text-slate-300">Classifies student queries into Directions, Timing, or General and returns JSON to Java.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-1">
              <span className="font-bold text-blue-900 dark:text-blue-200">3. AI Intelligent Agent</span>
              <p className="text-slate-600 dark:text-slate-300">Intelligent-agent query handling and navigation decision making based on classified intent.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-1">
              <span className="font-bold text-blue-900 dark:text-blue-200">4. ADSA BFS/DFS Graph</span>
              <p className="text-slate-600 dark:text-slate-300">Runs BFS/DFS over campus graph to generate shortest path and outputs text-only directions.</p>
            </div>
          </div>
        </section>

        {/* 5. Technologies & Disciplines Demonstrated */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-600" />
            Curriculum Disciplines Demonstrated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">1. AI</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Intelligent-agent query handling & navigation decision making</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">2. ADSA</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Campus graph (Nodes & Edges), BFS & DFS pathfinding</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">3. OOPJ</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Java chatbot shell, Classes, Objects, Methods, Encapsulation</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">4. Python</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Keyword-based intent classification & JSON response</span>
            </div>
          </div>
        </section>

        {/* 6. Academic Concepts Used */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Academic Concepts Used
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <p>• <strong>Graph Theory (Discrete Math):</strong> Vertex representation for campus locations, edges for walkable pathways.</p>
            <p>• <strong>Algorithm Analysis (ADSA):</strong> Shortest path algorithm using BFS (Breadth-First Search) O(V + E) for unweighted shortest path, and DFS (Depth-First Search).</p>
            <p>• <strong>Object-Oriented Programming:</strong> Encapsulation of entities, clean modular separation of data access, algorithm, and UI.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
