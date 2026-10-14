import React, { useState, useMemo } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Location } from '../types';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Building2, 
  Compass, 
  Layers, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  Info,
  ArrowRight,
  X,
  MessageSquare
} from 'lucide-react';

export const LocationsPage: React.FC = () => {
  const { locations, navigateToMapFocus, navigateToMapWithRoute, navigateToChatWithPrompt, addNewLocation } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Location Form State
  const [newLocName, setNewLocName] = useState('');
  const [newLocCategory, setNewLocCategory] = useState<Location['category']>('Departments');
  const [newLocBuilding, setNewLocBuilding] = useState('');
  const [newLocFloor, setNewLocFloor] = useState('Ground Floor');
  const [newLocDesc, setNewLocDesc] = useState('');
  const [newLocNearby, setNewLocNearby] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const categories: string[] = [
    'All',
    'Departments',
    'Laboratories',
    'Library',
    'Administrative',
    'Student Facilities',
    'Food/Canteen',
    'Sports',
    'Hostel',
    'Parking',
    'Other'
  ];

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' ||
        loc.name.toLowerCase().includes(q) ||
        loc.shortCode.toLowerCase().includes(q) ||
        loc.building.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q) ||
        loc.aliases.some(a => a.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [locations, selectedCategory, searchQuery]);

  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocBuilding.trim()) return;

    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      shortCode: newLocName.trim().slice(0, 4).toUpperCase(),
      category: newLocCategory,
      description: newLocDesc.trim() || "Registered campus location at KIET.",
      building: newLocBuilding.trim(),
      floor: newLocFloor.trim(),
      latitude: 16.8300,
      longitude: 82.2350,
      x: 500,
      y: 350,
      nearbyLocations: newLocNearby.split(',').map(s => s.trim()).filter(Boolean),
      aliases: [newLocName.toLowerCase(), newLocBuilding.toLowerCase()],
      isSampleData: true
    };

    addNewLocation(newLoc);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsModalOpen(false);
      setNewLocName('');
      setNewLocBuilding('');
      setNewLocDesc('');
      setNewLocNearby('');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Locations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              SAMPLE / PROTOTYPE CAMPUS DATA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Directory of campus blocks, labs, and facilities usable as chatbot navigation destinations · SAMPLE / PROTOTYPE CAMPUS DATA
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus Location</span>
        </button>
      </div>

      {/* Search Bar & Category Segmented Filters */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, department, lab number, or building..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Sample Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredLocations.length}</span> campus locations
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>SAMPLE / PROTOTYPE CAMPUS DATA (Usable as chatbot navigation destinations)</span>
        </div>
      </div>

      {/* Locations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLocations.map(loc => (
          <div
            key={loc.id}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-sm transition-all p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{loc.shortCode}</span>
                  <span>·</span>
                  <span>{loc.category}</span>
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {loc.name}
                </h3>
              </div>

              {/* Building & Floor */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">{loc.building}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{loc.floor}</span>
                </div>
              </div>

              {/* Nearby Locations */}
              {loc.nearbyLocations.length > 0 && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Nearby: </span>
                  <span>{loc.nearbyLocations.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Actions: View on Map & Ask Chatbot */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigateToMapFocus(loc.id)}
                className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>View on Map</span>
              </button>

              <button
                onClick={() => navigateToChatWithPrompt(`Where is ${loc.name}?`)}
                className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Chatbot</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Location (demonstrating SQLite schema dynamic expansion) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Register Campus Location
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Adds a new record to the campus directory.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Location Added Successfully</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">The location is now queryable via Chatbot and visible in the directory.</p>
              </div>
            ) : (
              <form onSubmit={handleAddLocationSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    placeholder="e.g. IoT Project Development Centre"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newLocCategory}
                      onChange={(e) => setNewLocCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Floor Level
                    </label>
                    <input
                      type="text"
                      value={newLocFloor}
                      onChange={(e) => setNewLocFloor(e.target.value)}
                      placeholder="e.g. 2nd Floor, Room 204"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Building / Block *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocBuilding}
                    onChange={(e) => setNewLocBuilding(e.target.value)}
                    placeholder="e.g. Ada Lovelace Innovation Block"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newLocDesc}
                    onChange={(e) => setNewLocDesc(e.target.value)}
                    placeholder="Short description of facility, faculty in-charge, or equipment..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nearby Landmarks (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newLocNearby}
                    onChange={(e) => setNewLocNearby(e.target.value)}
                    placeholder="e.g. CAI Department, Seminar Hall 2"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-2xs"
                  >
                    Save to Database
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
