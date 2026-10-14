"""
PYTHON INTENT CLASSIFIER

Role in Project:
- Simple keyword-based intent classification
- Classifies queries into ONLY:
  1. directions
  2. timing
  3. general
- Returns a simple JSON response:
  { "intent": "directions" } or { "intent": "timing" } or { "intent": "general" }

Note: Transparent keyword-based logic. No machine learning or LLM is claimed.
"""

TIMING_KEYWORDS = [
    'time', 'timings', 'what time', 'when does', 'when do', 'open', 'opens',
    'close', 'closes', 'closing', 'opening', 'hours', 'working hours', 'schedule'
]

DIRECTIONS_KEYWORDS = [
    'where is', 'where are', "where's", 'where can i find', 'how do i reach',
    'how can i reach', 'how to reach', 'how do i get to', 'how to get to',
    'i need to go to', 'i want to go to', 'route to', 'route from', 'way to',
    'directions to', 'direction to', 'show me the route', 'take me to',
    'guide me to', 'step by step', 'path to', 'walk to', 'from', 'location'
]

GENERAL_KEYWORDS = [
    'tell me about', 'about the campus', 'about campus', 'what facilities',
    'facilities are available', 'facilities', 'overview', 'information', 'info',
    'help', 'who are you', 'what can you do', 'introduce', 'welcome', 'hi',
    'hello', 'hey', 'namaste', 'thank you', 'thanks'
]

def classify_intent(query_text):
    """
    Transparent keyword classifier. Returns dict: {"intent": "..."}
    """
    if not query_text:
        return {"intent": "general"}

    clean = query_text.lower().strip()

    # 1. Timing check
    for kw in TIMING_KEYWORDS:
        if kw in clean:
            return {"intent": "timing"}

    # 2. Directions check
    for kw in DIRECTIONS_KEYWORDS:
        if kw in clean:
            return {"intent": "directions"}

    # 3. General check
    for kw in GENERAL_KEYWORDS:
        if kw in clean:
            return {"intent": "general"}

    return {"intent": "general"}
