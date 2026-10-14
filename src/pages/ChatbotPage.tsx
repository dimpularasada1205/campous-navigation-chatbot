import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { processChatQuery } from '../utils/chatbotEngine';
import { ChatMessage, Location } from '../types';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  MapPin, 
  Navigation, 
  RotateCcw, 
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowDown,
  Layers,
  Code2,
  FileCode,
  Binary
} from 'lucide-react';

export const ChatbotPage: React.FC = () => {
  const { 
    locations, 
    connections, 
    navigateToMapWithRoute, 
    navigateToMapFocus, 
    chatPrefillPrompt, 
    clearChatPrefill 
  } = useNavigation();

  const [inputMessage, setInputMessage] = useState('');
  const [currentStartPoint, setCurrentStartPoint] = useState<string>('main-gate');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial text-only welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: `Hello! 👋 I'm your KIET Campus Navigation Chatbot.

I can help new students, faculty, and visitors find lecture halls, departments, and labs across the campus.

Try asking:
• "Where is the library?"
• "How do I reach the lab?"
• "Where is the lecture hall?"
• "What time does the library open?"
• "When does the lab close?"
• "Tell me about the campus."
• "What facilities are available?"

Type your question below to get directions or campus information!`,
        timestamp: new Date(),
        quickReplies: [
          'Where is the library?',
          'How do I reach the lab?',
          'Where is the lecture hall?',
          'What time does the library open?',
          'Tell me about the campus.',
          'What facilities are available?'
        ]
      }
    ];
  });

  // Handle prefilled prompts from Home or other pages
  useEffect(() => {
    if (chatPrefillPrompt) {
      handleSendQuery(chatPrefillPrompt);
      clearChatPrefill();
    }
  }, [chatPrefillPrompt]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendQuery = (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Process through Java Chatbot Shell -> Python Classifier -> AI Agent -> ADSA Graph
    setTimeout(() => {
      const botResponse = processChatQuery(
        text,
        locations,
        connections,
        { currentStartLocationId: currentStartPoint }
      );
      // Strictly text-based response. NO audio, NO text-to-speech.
      setMessages(prev => [...prev, botResponse]);
    }, 200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(inputMessage);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'bot',
        text: `Chat cleared. Where would you like to navigate on the KIET campus?`,
        timestamp: new Date(),
        quickReplies: [
          'Where is the library?',
          'How do I reach the lab?',
          'Where is the CSE department?',
          'What facilities are available?'
        ]
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      {/* Expandable "How It Works" Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => setShowHowItWorks(prev => !prev)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                How It Works
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                (Technical Architecture & Four-Subject Pipeline)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>{showHowItWorks ? 'Hide Flow' : 'View System Flow'}</span>
            {showHowItWorks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showHowItWorks && (
          <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The project demonstrates an end-to-end technical flow across four core curriculum disciplines:
              <strong className="text-slate-800 dark:text-slate-200"> OOPJ, Python, AI, and ADSA</strong>.
            </p>

            {/* Visual Technical Flow Diagram */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <div className="max-w-md mx-auto space-y-1.5 text-center text-xs">
                {/* 1. Student Query */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white shadow-2xs">
                  Student Query
                </div>
                <div className="flex justify-center text-blue-500">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* 2. Java Chatbot Shell */}
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 font-semibold text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Java Chatbot Shell (OOPJ)</span>
                </div>
                <div className="flex justify-center text-blue-500">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* 3. Python Intent Classifier */}
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Python Intent Classifier (Keyword-Based)</span>
                </div>
                <div className="flex justify-center text-blue-500">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* 4. Directions / Timing / General */}
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                  Directions / Timing / General
                </div>
                <div className="flex justify-center text-blue-500">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* 5. AI Intelligent Agent */}
                <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 font-semibold text-purple-900 dark:text-purple-200 flex items-center justify-center gap-2">
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Intelligent Agent (Decision Making)</span>
                </div>
                <div className="flex justify-center text-blue-500">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* 6. ADSA Campus Graph */}
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 font-semibold text-indigo-900 dark:text-indigo-200 flex items-center justify-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>ADSA Campus Graph (Nodes & Edges)</span>
                </div>
                <div className="flex justify-center text-blue-500">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* 7. BFS / DFS */}
                <div className="p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 font-semibold text-cyan-900 dark:text-cyan-200 flex items-center justify-center gap-2">
                  <Binary className="w-3.5 h-3.5" />
                  <span>BFS / DFS Pathfinding</span>
                </div>
                <div className="flex justify-center text-blue-500">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* 8. Final Navigation Response */}
                <div className="p-2.5 rounded-lg bg-blue-600 text-white font-bold shadow-2xs">
                  Navigation Response (Text-Only)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Python Intent Classification:</strong>
                Transparent keyword matching returning <code>{`{ "intent": "directions" }`}</code>, <code>{`{ "intent": "timing" }`}</code>, or <code>{`{ "intent": "general" }`}</code>.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">ADSA BFS / DFS:</strong>
                Breadth-First Search (BFS) is the primary algorithm for finding shortest unweighted graph pathways.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Interface */}
      <div className="h-[580px] sm:h-[620px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Chatbot Header */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  KIET CampusNav Assistant
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Text-Based Campus Navigation · Java / Python / AI / ADSA Architecture
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Start Location Selector */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-slate-400">Start location:</span>
              <select
                value={currentStartPoint}
                onChange={(e) => setCurrentStartPoint(e.target.value)}
                className="py-1 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleClearChat}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${
                  isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isBot
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5">
                  {/* Flow Trace Badge for Bot Messages */}
                  {isBot && msg.flowTrace && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 px-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                        Intent: {msg.flowTrace.intent}
                      </span>
                      {msg.flowTrace.algorithm && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-semibold">
                          ADSA: {msg.flowTrace.algorithm}
                        </span>
                      )}
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      isBot
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                        : 'bg-blue-600 text-white rounded-tr-xs'
                    }`}
                  >
                    {msg.text}

                    {/* View Route on Map Link (Text only, no audio buttons) */}
                    {msg.route && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => navigateToMapWithRoute(msg.route!.from.id, msg.route!.to.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          View Route on Campus Map
                        </button>
                      </div>
                    )}

                    {/* Target Location Card (without route) */}
                    {msg.targetLocation && !msg.route && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <button
                          onClick={() => navigateToMapFocus(msg.targetLocation!.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          Locate on Map
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick reply suggestion buttons */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (reply === 'View Route on Map' && msg.route) {
                              navigateToMapWithRoute(msg.route.from.id, msg.route.to.id);
                            } else {
                              handleSendQuery(reply);
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar (Normal Text Input Box + Send Button, TEXT ONLY, NO AUDIO) */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask for directions or timing (e.g., 'Where is the library?', 'Where is the lab?')..."
              className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Text-only chatbot · BFS graph shortest-path navigation</span>
            <span className="hidden sm:inline">Kakinada Institute of Engineering and Technology (KIET)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
