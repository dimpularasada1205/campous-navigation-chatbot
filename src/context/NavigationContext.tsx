import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location, Connection, RouteResult, SearchHistoryItem } from '../types';
import { INITIAL_LOCATIONS, INITIAL_CONNECTIONS } from '../data/campusData';
import { findShortestPath } from '../utils/routeAlgorithm';

export type NavTab = 'home' | 'chatbot' | 'map' | 'locations' | 'subjects' | 'about';

interface NavigationContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  locations: Location[];
  connections: Connection[];
  selectedFromId: string;
  setSelectedFromId: (id: string) => void;
  selectedToId: string;
  setSelectedToId: (id: string) => void;
  activeRoute: RouteResult | null;
  calculateRoute: (fromId?: string, toId?: string, algorithm?: 'BFS' | 'DFS') => RouteResult | null;
  navigateToMapWithRoute: (fromId: string, toId: string, algorithm?: 'BFS' | 'DFS') => void;
  navigateToMapFocus: (locationId: string) => void;
  navigateToChatWithPrompt: (promptText: string) => void;
  chatPrefillPrompt: string | null;
  clearChatPrefill: () => void;
  searchHistory: SearchHistoryItem[];
  clearSearchHistory: () => void;
  focusedLocationId: string | null;
  setFocusedLocationId: (id: string | null) => void;
  addNewLocation: (newLoc: Location) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [locations, setLocations] = useState<Location[]>(() => {
    // Clean old caches to ensure centralized consistency
    localStorage.removeItem('kiet_locations_table');
    localStorage.removeItem('kiet_locations_table_v2');
    localStorage.removeItem('kiet_locations_table_v3');
    const saved = localStorage.getItem('kiet_locations_table_v4');
    if (saved) {
      try {
        const parsed: Location[] = JSON.parse(saved);
        const hasLibrary = parsed.some(l => l.id === 'library');
        if (hasLibrary) return parsed;
      } catch (e) {
        return INITIAL_LOCATIONS;
      }
    }
    return INITIAL_LOCATIONS;
  });
  const [connections, setConnections] = useState<Connection[]>(() => {
    localStorage.removeItem('kiet_connections_table');
    localStorage.removeItem('kiet_connections_table_v2');
    localStorage.removeItem('kiet_connections_table_v3');
    const saved = localStorage.getItem('kiet_connections_table_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_CONNECTIONS; }
    }
    return INITIAL_CONNECTIONS;
  });

  const [selectedFromId, setSelectedFromId] = useState<string>("main-gate");
  const [selectedToId, setSelectedToId] = useState<string>("library");
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [chatPrefillPrompt, setChatPrefillPrompt] = useState<string | null>(null);
  const [focusedLocationId, setFocusedLocationId] = useState<string | null>(null);

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem('kiet_search_history_table');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: "sh-1",
        timestamp: "Today, 10:15 AM",
        fromId: "main-gate",
        toId: "library",
        fromName: "Main Gate",
        toName: "Library",
        distance: 260
      },
      {
        id: "sh-2",
        timestamp: "Yesterday, 3:40 PM",
        fromId: "cse-dept",
        toId: "canteen",
        fromName: "CSE Department",
        toName: "Canteen",
        distance: 180
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kiet_locations_table_v4', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('kiet_connections_table_v4', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('kiet_search_history_table', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const calculateRoute = (fromId = selectedFromId, toId = selectedToId, algorithm: 'BFS' | 'DFS' = 'BFS'): RouteResult | null => {
    if (!fromId || !toId) return null;
    const res = findShortestPath(fromId, toId, locations, connections, algorithm);
    if (res) {
      setActiveRoute(res);
      // Append to search history
      const newHistoryItem: SearchHistoryItem = {
        id: `sh-${Date.now()}`,
        timestamp: "Just now",
        fromId,
        toId,
        fromName: res.from.name,
        toName: res.to.name,
        distance: res.totalDistance
      };
      setSearchHistory(prev => [newHistoryItem, ...prev.filter(h => !(h.fromId === fromId && h.toId === toId)).slice(0, 9)]);
    }
    return res;
  };

  const navigateToMapWithRoute = (fromId: string, toId: string, algorithm: 'BFS' | 'DFS' = 'BFS') => {
    setSelectedFromId(fromId);
    setSelectedToId(toId);
    setFocusedLocationId(toId);
    const res = findShortestPath(fromId, toId, locations, connections, algorithm);
    if (res) {
      setActiveRoute(res);
    }
    setActiveTab('map');
  };

  const navigateToMapFocus = (locationId: string) => {
    setFocusedLocationId(locationId);
    setSelectedToId(locationId);
    setActiveTab('map');
  };

  const navigateToChatWithPrompt = (promptText: string) => {
    setChatPrefillPrompt(promptText);
    setActiveTab('chatbot');
  };

  const clearChatPrefill = () => setChatPrefillPrompt(null);

  const clearSearchHistory = () => setSearchHistory([]);

  const addNewLocation = (newLoc: Location) => {
    setLocations(prev => [...prev, newLoc]);
  };

  return (
    <NavigationContext.Provider value={{
      activeTab,
      setActiveTab,
      locations,
      connections,
      selectedFromId,
      setSelectedFromId,
      selectedToId,
      setSelectedToId,
      activeRoute,
      calculateRoute,
      navigateToMapWithRoute,
      navigateToMapFocus,
      navigateToChatWithPrompt,
      chatPrefillPrompt,
      clearChatPrefill,
      searchHistory,
      clearSearchHistory,
      focusedLocationId,
      setFocusedLocationId,
      addNewLocation
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};
