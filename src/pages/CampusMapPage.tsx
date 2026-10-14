import React, { useState, useMemo, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Location, Connection } from '../types';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Clock, 
  Footprints, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  X,
  Play,
  Pause,
  ChevronRight
} from 'lucide-react';

export const CampusMapPage: React.FC = () => {
  const { 
    locations, 
    connections, 
    selectedFromId, 
    setSelectedFromId, 
    selectedToId, 
    setSelectedToId, 
    activeRoute, 
    calculateRoute,
    focusedLocationId,
    setFocusedLocationId,
    navigateToChatWithPrompt
  } = useNavigation();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'BFS' | 'DFS'>('BFS');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<Location | null>(() => {
    if (focusedLocationId) {
      return locations.find(l => l.id === focusedLocationId) || null;
    }
    return null;
  });

  const [animatingStep, setAnimatingStep] = useState<number | null>(null);
  const [isPlayingRoute, setIsPlayingRoute] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const categories = ['All', 'Departments', 'Laboratories', 'Library', 'Administrative', 'Food/Canteen', 'Hostel', 'Sports', 'Other'];

  const filteredLocations = useMemo(() => {
    if (activeCategory === 'All') return locations;
    return locations.filter(l => l.category === activeCategory);
  }, [locations, activeCategory]);

  const handleShowRoute = () => {
    calculateRoute(selectedFromId, selectedToId, selectedAlgorithm);
  };

  const handleNodeClick = (loc: Location) => {
    setSelectedNodeDetails(loc);
    setFocusedLocationId(loc.id);
  };

  const handleSetAsStart = (id: string) => {
    setSelectedFromId(id);
    if (selectedToId && id !== selectedToId) {
      calculateRoute(id, selectedToId, selectedAlgorithm);
    }
  };

  const handleSetAsDestination = (id: string) => {
    setSelectedToId(id);
    if (selectedFromId && id !== selectedFromId) {
      calculateRoute(selectedFromId, id, selectedAlgorithm);
    }
  };

  // Build route path segments for visual SVG highlight
  const routeEdgePairs = useMemo(() => {
    if (!activeRoute || activeRoute.path.length < 2) return new Set<string>();
    const pairs = new Set<string>();
    for (let i = 0; i < activeRoute.path.length - 1; i++) {
      const a = activeRoute.path[i].id;
      const b = activeRoute.path[i + 1].id;
      pairs.add(`${a}--${b}`);
      pairs.add(`${b}--${a}`);
    }
    return pairs;
  }, [activeRoute]);

  // SVG route path coordinates
  const routePolylinePoints = useMemo(() => {
    if (!activeRoute || activeRoute.path.length < 2) return '';
    return activeRoute.path.map(p => `${p.x},${p.y}`).join(' ');
  }, [activeRoute]);

  // Helper for category color badges
  const getCategoryColor = (cat: Location['category']) => {
    switch (cat) {
      case 'Departments': return '#2563EB'; // Blue
      case 'Laboratories': return '#7C3AED'; // Purple
      case 'Library': return '#D97706'; // Amber
      case 'Administrative': return '#4F46E5'; // Indigo
      case 'Food/Canteen': return '#EA580C'; // Orange
      case 'Sports': return '#0891B2'; // Cyan/Teal (non-green to avoid start-point confusion)
      case 'Hostel': return '#0D9488'; // Teal
      case 'Parking': return '#64748B'; // Slate
      default: return '#0284C7';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header & Prototype Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Campus Map
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              SAMPLE / PROTOTYPE CAMPUS DATA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kakinada Institute of Engineering & Technology, Korangi · Campus represented as a graph (Nodes = Locations, Edges = Walkable Connections)
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold px-2 text-slate-600 dark:text-slate-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.7))}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Route Selector Bar as specified in prompt */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Starting Point */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              From (Start Location)
            </label>
            <select
              value={selectedFromId}
              onChange={(e) => setSelectedFromId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.shortCode})
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              To (Destination)
            </label>
            <select
              value={selectedToId}
              onChange={(e) => setSelectedToId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.shortCode})
                </option>
              ))}
            </select>
          </div>

          {/* Show Route Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleShowRoute}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Show Route</span>
            </button>
          </div>
        </div>

        {/* ADSA Algorithm Selection: BFS / DFS */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Graph Algorithm:</span>
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setSelectedAlgorithm('BFS');
                  if (activeRoute) calculateRoute(selectedFromId, selectedToId, 'BFS');
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedAlgorithm === 'BFS'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                BFS (Shortest Route)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAlgorithm('DFS');
                  if (activeRoute) calculateRoute(selectedFromId, selectedToId, 'DFS');
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedAlgorithm === 'DFS'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                DFS (Depth-First)
              </button>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (Official Project Requirement: BFS / DFS)
            </span>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Filter Pins:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visually Highlighted Route Banner: START -> PATH -> DESTINATION */}
      {activeRoute && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[11px]">
              Route calculated using {activeRoute.algorithm || selectedAlgorithm}
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <span className="text-emerald-600 dark:text-emerald-400">START:</span> {activeRoute.from.name}
              <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-blue-600 dark:text-blue-400">PATH:</span> ({activeRoute.path.length} nodes)
              <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-red-600 dark:text-red-400">DESTINATION:</span> {activeRoute.to.name}
            </div>
          </div>
          <div className="font-mono text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
            ~{activeRoute.totalDistance}m · ~{activeRoute.estimatedTime} min
          </div>
        </div>
      )}

      {/* Main Map Viewer & Info Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Schematic SVG Map Canvas */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
          {/* Map Top Status Bar */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>KIET Campus Schematic Grid (Korangi)</span>
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Click any pin to inspect details
            </span>
          </div>

          {/* SVG Map Container with Zoom Scale */}
          <div className="relative overflow-auto p-4 flex items-center justify-center min-h-[480px] bg-slate-100/50 dark:bg-slate-950/60">
            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
              className="w-full max-w-[960px]"
            >
              <svg
                ref={svgRef}
                viewBox="0 0 1000 640"
                className="w-full h-auto drop-shadow-sm select-none"
              >
                {/* Background Campus Campus Grass / Field */}
                <rect x="20" y="20" width="960" height="600" rx="24" fill="#F1F5F9" className="dark:fill-slate-900" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />

                {/* Campus Boundary and Perimeter Lawn Areas */}
                <path d="M 60 500 Q 80 570 180 590 L 880 590 Q 940 570 940 480 L 940 100 Q 920 50 820 50 L 120 50 Q 60 70 60 160 Z" fill="#E2E8F0" className="dark:fill-slate-800/40" />

                {/* Central Academic Quadrangle Lawn */}
                <circle cx="480" cy="360" r="70" fill="#E0F2FE" className="dark:fill-blue-950/30" stroke="#BAE6FD" strokeWidth="1.5" />
                <text x="480" y="365" textAnchor="middle" className="text-[11px] fill-sky-800 dark:fill-sky-300 font-medium">Central Quad</text>

                {/* Graph Connections (Footpaths / Campus Roads) */}
                {connections.map(conn => {
                  const locA = locations.find(l => l.id === conn.fromLocation);
                  const locB = locations.find(l => l.id === conn.toLocation);
                  if (!locA || !locB) return null;

                  const isPartofActiveRoute = routeEdgePairs.has(`${locA.id}--${locB.id}`);

                  return (
                    <g key={conn.id}>
                      {/* Base road line */}
                      <line
                        x1={locA.x}
                        y1={locA.y}
                        x2={locB.x}
                        y2={locB.y}
                        stroke={isPartofActiveRoute ? "#2563EB" : "#94A3B8"}
                        strokeWidth={isPartofActiveRoute ? "5" : "2"}
                        strokeDasharray={isPartofActiveRoute ? "none" : "4 4"}
                        strokeLinecap="round"
                        opacity="0.75"
                      />
                      {/* Distance label on road mid-point */}
                      <rect
                        x={(locA.x + locB.x) / 2 - 14}
                        y={(locA.y + locB.y) / 2 - 8}
                        width="28"
                        height="14"
                        rx="4"
                        fill="#FFFFFF"
                        className="dark:fill-slate-800"
                        stroke="#E2E8F0"
                        strokeWidth="0.5"
                      />
                      <text
                        x={(locA.x + locB.x) / 2}
                        y={(locA.y + locB.y) / 2 + 2}
                        textAnchor="middle"
                        className="text-[8px] fill-slate-500 dark:fill-slate-400 font-mono font-medium"
                      >
                        {conn.distance}m
                      </text>
                    </g>
                  );
                })}

                {/* Highlighted Active Route Polyline Overlay */}
                {activeRoute && activeRoute.path.length > 1 && (
                  <polyline
                    points={routePolylinePoints}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Location Nodes / Building Pins (Rock-solid static rendering, no motion/glitch) */}
                {filteredLocations.map(loc => {
                  const isStart = loc.id === selectedFromId;
                  const isDest = loc.id === selectedToId;
                  const isSelected = selectedNodeDetails?.id === loc.id;
                  const isInRoute = activeRoute?.path.some(p => p.id === loc.id);

                  const nodeColor = isStart 
                    ? '#10B981' // Green
                    : isDest 
                    ? '#EF4444' // Red
                    : isInRoute 
                    ? '#2563EB' 
                    : getCategoryColor(loc.category);

                  return (
                    <g
                      key={loc.id}
                      onClick={() => handleNodeClick(loc)}
                      className="cursor-pointer"
                    >
                      {/* Main Node Pin Circle - Static solid sizing */}
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r="12"
                        fill={nodeColor}
                        stroke="#FFFFFF"
                        strokeWidth={isStart || isDest || isSelected ? "3" : "2"}
                      />

                      {/* Static white center indicator for Start or Destination */}
                      {(isStart || isDest) && (
                        <circle
                          cx={loc.x}
                          cy={loc.y}
                          r="4"
                          fill="#FFFFFF"
                        />
                      )}

                      {/* Node Label Text */}
                      <text
                        x={loc.x}
                        y={loc.y - 15}
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-slate-800 dark:fill-slate-100 pointer-events-none"
                      >
                        {loc.shortCode}
                      </text>

                      {/* Subtitle / Name below node */}
                      <text
                        x={loc.x}
                        y={loc.y + 19}
                        textAnchor="middle"
                        className="text-[8.5px] font-medium fill-slate-600 dark:fill-slate-300 pointer-events-none"
                      >
                        {loc.name.length > 20 ? `${loc.name.slice(0, 18)}...` : loc.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Map Legend */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
                <span>Start Point</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
                <span>Destination</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" />
                <span>Active Path</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Nodes: {locations.length} | Pathways: {connections.length}
            </div>
          </div>
        </div>

        {/* Right Column: Route Directions / Node Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Route Summary Card */}
          {activeRoute ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Route calculated using {activeRoute.algorithm || selectedAlgorithm}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeRoute.from.shortCode} → {activeRoute.to.shortCode}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    START → PATH → DESTINATION
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    ~{activeRoute.totalDistance}m
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>~{activeRoute.estimatedTime} min walk</span>
                  </div>
                </div>
              </div>

              {/* Turn-by-Turn Steps */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Follow Walking Directions:
                </div>
                {activeRoute.steps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              {/* Ask chatbot about this route */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => navigateToChatWithPrompt(`I am at ${activeRoute.from.name}. How do I reach ${activeRoute.to.name}?`)}
                  className="w-full py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask Chatbot About Route
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
              <Navigation className="w-8 h-8 text-blue-600 mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ready to calculate route
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select your starting point and destination above, then click "Show Route" to calculate the shortest path.
                </p>
              </div>
            </div>
          )}

          {/* Selected Node Details Card */}
          {selectedNodeDetails && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {selectedNodeDetails.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedNodeDetails.name}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedNodeDetails(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold text-slate-900 dark:text-white">Building:</span> {selectedNodeDetails.building}</p>
                <p><span className="font-semibold text-slate-900 dark:text-white">Floor:</span> {selectedNodeDetails.floor}</p>
                {selectedNodeDetails.timings && (
                  <p><span className="font-semibold text-slate-900 dark:text-white">Hours:</span> {selectedNodeDetails.timings}</p>
                )}
                <p className="pt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedNodeDetails.description}
                </p>
              </div>

              {/* Set as Start / Dest Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleSetAsStart(selectedNodeDetails.id)}
                  className="py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-medium rounded-lg transition-colors text-center"
                >
                  Set as Start
                </button>
                <button
                  onClick={() => handleSetAsDestination(selectedNodeDetails.id)}
                  className="py-1.5 px-3 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium rounded-lg transition-colors text-center"
                >
                  Set as Destination
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
