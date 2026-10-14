import re
from route_algorithm import calculate_shortest_path
from intent_classifier import classify_intent

def find_location_in_db(query, locations_list):
    """
    Finds a location by matching query against id, short_code, name, or aliases.
    Prioritizes longer matches (e.g. 'cse lab' before 'cse').
    """
    if not query:
        return None
    clean = query.strip().lower()

    # Exact ID match
    for loc in locations_list:
        if loc['id'].lower() == clean or (loc.get('short_code') and loc['short_code'].lower() == clean):
            return loc

    # Exact Name match
    for loc in locations_list:
        if loc['name'].lower() == clean:
            return loc

    # Search by alias or name match, prioritizing longer matches
    best_match = None
    longest_len = 0

    for loc in locations_list:
        name_lower = loc['name'].lower()
        if name_lower in clean and len(name_lower) > longest_len:
            best_match = loc
            longest_len = len(name_lower)

        aliases = [a.strip().lower() for a in (loc.get('aliases') or '').split(',') if a.strip()]
        for a in aliases:
            if a in clean and len(a) > longest_len:
                best_match = loc
                longest_len = len(a)

    return best_match

def process_campus_chat_message(user_query, locations_list, connections_list, default_start_id='main-gate'):
    """
    Entity-specific chatbot query processor following the 4-subject project flow.
    Enforces: Specific query -> Specific answer. No unrelated info dumps.
    """
    clean = user_query.strip().lower().replace('?', '').replace('!', '')
    locations_dict = {loc['id']: loc for loc in locations_list}

    # 1. Broad query check: "list all locations" / "all locations"
    if any(p in clean for p in ['all locations', 'list all', 'all facilities', 'every location']):
        lines = [f"• {loc['name']} ({loc.get('short_code', '')}) – {loc.get('building', '')}, {loc.get('floor', '')}" for loc in locations_list]
        return {
            'text': "KIET Campus Locations (Sample / Prototype Data):\n\n" + "\n".join(lines) + "\n\nYou can ask for directions or timings for any of these locations!",
            'is_broad': True,
            'quick_replies': ['Where is the library?', 'How do I reach the CSE lab?', 'What are the library timings?']
        }

    # 2. Python Intent Classification
    intent_data = classify_intent(user_query)
    intent = intent_data.get('intent', 'general')

    # 3. Entity Extraction
    dest_loc = find_location_in_db(clean, locations_list)
    source_loc = None

    # Check for "from X to Y"
    from_to = re.search(r'(?:from|at)\s+([a-z0-9\s&]+?)\s+(?:to|reach|get\s*to)\s+([a-z0-9\s&]+)', clean)
    if from_to:
        source_loc = find_location_in_db(from_to.group(1), locations_list)
        dest_loc = find_location_in_db(from_to.group(2), locations_list) or dest_loc

    # 4. Handle TIMING Intent (Strictly Entity-Specific)
    if intent == 'timing':
        if dest_loc:
            timing_info = dest_loc.get('timings') or "Sample timing data is not available yet."
            return {
                'text': f"{dest_loc['name']} Timings (Sample Data):\n\n• Building: {dest_loc.get('building', '')} ({dest_loc.get('floor', '')})\n• {timing_info}",
                'target_location': dest_loc,
                'intent': 'timing',
                'quick_replies': [f"Where is the {dest_loc['name']}?", "What are the library timings?", "When does the CSE lab open?"]
            }
        else:
            return {
                'text': "KIET Campus Operational Timings (Sample Data):\n\n• Academic Departments: 9:00 AM – 4:30 PM\n• Library: 8:00 AM – 8:00 PM\n• CSE Lab: 9:00 AM – 5:00 PM\n• Canteen: 7:30 AM – 7:30 PM\n\nPlease specify a facility for exact hours (e.g. 'What are the library timings?').",
                'intent': 'timing',
                'quick_replies': ['What are the library timings?', 'When does the CSE lab open?', 'Where is the library?']
            }

    # 5. Handle DIRECTIONS Intent
    if intent == 'directions' or dest_loc:
        if dest_loc:
            start_loc = source_loc or locations_dict.get(default_start_id) or locations_dict.get('main-gate')

            if start_loc:
                route = calculate_shortest_path(start_loc['id'], dest_loc['id'], locations_dict, connections_list, algorithm='BFS')

                if route:
                    steps_formatted = "\n".join([f"{i+1}. {step}" for i, step in enumerate(route['steps'])])
                    response_text = (
                        f"{dest_loc['name']} selected. Route found using BFS.\n\n"
                        f"START: {start_loc['name']}\n"
                        f"DESTINATION: {dest_loc['name']} ({dest_loc.get('building', '')}, {dest_loc.get('floor', '')})\n"
                        f"ESTIMATED WALK: ~{route['total_distance']}m (approx. {route['estimated_time']} min)\n\n"
                        f"WALKING ROUTE:\n{steps_formatted}\n\n"
                        f"View the highlighted route on the Campus Map."
                    )
                    return {
                        'text': response_text,
                        'route': route,
                        'target_location': dest_loc,
                        'intent': 'directions',
                        'quick_replies': ['View Route on Map', f"What are the {dest_loc['name']} timings?", 'Where is the library?']
                    }

            return {
                'text': f"{dest_loc['name']} selected.\n\nBuilding: {dest_loc.get('building', '')} ({dest_loc.get('floor', '')})\n\nNote: No direct path found in graph.",
                'target_location': dest_loc,
                'intent': 'directions'
            }
        else:
            return {
                'text': "I could not identify the specific destination from your request.\n\nPlease ask for a specific location such as:\n• 'Where is the library?'\n• 'How do I reach the CSE lab?'\n• 'Where is the lecture hall?'",
                'intent': 'directions',
                'quick_replies': ['Where is the library?', 'How do I reach the CSE lab?', 'Where is the lecture hall?']
            }

    # 6. GENERAL Intent
    return {
        'text': "Welcome to the KIET Campus Navigation Chatbot!\n\nInstitution: Kakinada Institute of Engineering & Technology (KIET), Korangi.\n\nAsk me for:\n• Directions: 'Where is the library?' or 'How do I reach the CSE lab?'\n• Timings: 'What are the library timings?' or 'When does the CSE lab open?'\n• Directory: 'List all campus locations'",
        'intent': 'general',
        'quick_replies': ['Where is the library?', 'What are the library timings?', 'How do I reach the CSE lab?', 'List all campus locations']
    }
