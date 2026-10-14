import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { CAMPUS_METADATA } from '../data/campusData';
import { 
  Search, 
  MessageSquare, 
  Map, 
  Layers, 
  Compass, 
  Clock, 
  ArrowRight, 
  Building2, 
  Navigation, 
  BookOpen, 
  Coffee, 
  Laptop, 
  Sparkles,
  Info,
  MapPin,
  GraduationCap
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    locations, 
    searchHistory, 
    setActiveTab, 
    navigateToMapFocus, 
    navigateToMapWithRoute,
    navigateToChatWithPrompt 
  } = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Filtered locations for the autocomplete search
  const filteredLocations = searchQuery.trim() === ''
    ? []
    : locations.filter(loc => 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6);

  const handleSearchSelect = (locId: string) => {
    navigateToMapFocus(locId);
    setSearchQuery('');
    setDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (filteredLocations.length > 0) {
      handleSearchSelect(filteredLocations[0].id);
    } else {
      navigateToChatWithPrompt(`Where is ${searchQuery}?`);
    }
  };

  const popularDestinations = [
    {
      id: 'cse-dept',
      name: 'CSE Department',
      desc: 'Computer Science & Engineering Block',
      icon: Laptop,
      category: 'Academic',
      code: 'CSE'
    },
    {
      id: 'cai-dept',
      name: 'CAI Department',
      desc: 'Artificial Intelligence & Data Science',
      icon: Sparkles,
      category: 'Academic',
      code: 'CAI'
    },
    {
      id: 'library',
      name: 'Library',
      desc: 'Central Knowledge Resource Centre & Reading Hall',
      icon: BookOpen,
      category: 'Facilities',
      code: 'LIB'
    },
    {
      id: 'cse-lab',
      name: 'CSE Lab',
      desc: 'Computer science programming laboratory',
      icon: Laptop,
      category: 'Laboratories',
      code: 'LAB'
    },
    {
      id: 'canteen',
      name: 'Main Canteen',
      desc: 'Cafeteria, Snacks & Refreshments',
      icon: Coffee,
      category: 'Food Court',
      code: 'FOOD'
    },
    {
      id: 'admin-block',
      name: 'Administrative Block',
      desc: 'Principal Office & Exam Cell',
      icon: Building2,
      category: 'Admin',
      code: 'ADMIN'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white shadow-xl">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img 
            src={CAMPUS_METADATA.heroImage} 
            alt="KIET Campus" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 max-w-4xl space-y-6">
          {/* Institution Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <span>Kakinada Institute of Engineering and Technology (KIET), Korangi</span>
          </div>

          {/* Heading & Subtitle as requested */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              KIET Campus Navigation Chatbot
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl">
              Find campus locations and routes using an intelligent navigation chatbot.
            </p>
          </div>

          {/* Large Navigation / Search Area */}
          <div className="relative max-w-2xl pt-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Where do you want to go? (e.g. CSE, Library, Canteen, Lab 3...)"
                  className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Instant Autocomplete Dropdown */}
            {dropdownOpen && filteredLocations.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-30">
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Campus Locations Matching "{searchQuery}"
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredLocations.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => handleSearchSelect(loc.id)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center justify-between group transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {loc.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>{loc.building}</span>
                          <span>·</span>
                          <span>{loc.floor}</span>
                        </div>
                      </div>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Example Links */}
            <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-300">
              <span className="text-slate-400 font-medium">Examples:</span>
              {[
                { label: 'CSE Department', prompt: 'Where is the CSE department?' },
                { label: 'CAI Department', prompt: 'Where is the CAI department?' },
                { label: 'Central Library', prompt: 'How do I reach the library?' },
                { label: 'Computer Lab 3', prompt: 'Where is Lab 3?' },
                { label: 'Canteen', prompt: 'Show me the route to the canteen' },
                { label: 'Admin Office', prompt: 'Where is the Administrative Office?' }
              ].map(ex => (
                <button
                  key={ex.label}
                  onClick={() => navigateToChatWithPrompt(ex.prompt)}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick-Access Feature Cards (4 Main Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Chatbot */}
        <div 
          onClick={() => setActiveTab('chatbot')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Chatbot
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Text-based assistant for directions, timings & queries
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Ask Chatbot</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Campus Map */}
        <div 
          onClick={() => setActiveTab('map')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Campus Map
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Topological graph with BFS/DFS route highlighting
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Open Map</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Locations */}
        <div 
          onClick={() => setActiveTab('locations')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Locations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Browse departments, labs, libraries & facilities
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>View Directory</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Subjects */}
        <div 
          onClick={() => setActiveTab('subjects')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Subjects
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                AI, ADSA, OOPJ, and Python project demonstration
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400">
            <span>Explore Subjects</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Grid: Popular Destinations + Recent Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Destinations (2 cols) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Popular Destinations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frequently visited departments and campus hubs at KIET
              </p>
            </div>
            <button
              onClick={() => setActiveTab('locations')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularDestinations.map(dest => {
              const Icon = dest.icon;
              return (
                <div
                  key={dest.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">{dest.code}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">{dest.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {dest.desc}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => navigateToMapFocus(dest.id)}
                      className="font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Locate on Map
                    </button>
                    <button
                      onClick={() => navigateToMapWithRoute('main-gate', dest.id)}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Get Route
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Searches Section (1 col) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Recent Searches
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged-in user navigation history
              </p>
            </div>
            {searchHistory.length > 0 && (
              <span className="text-xs text-slate-400 font-mono">
                {searchHistory.length} saved
              </span>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {searchHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <Clock className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>No recent searches yet.</p>
                <p className="text-[11px] text-slate-400">Select any two locations on the map or ask the chatbot to see your route history.</p>
              </div>
            ) : (
              searchHistory.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-0.5 max-w-[200px]">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {item.fromName} → {item.toName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{item.timestamp}</span>
                      <span>·</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-medium">~{item.distance}m</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateToMapWithRoute(item.fromId, item.toId)}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    title="Recalculate route"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
