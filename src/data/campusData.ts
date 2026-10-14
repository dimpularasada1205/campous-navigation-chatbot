import { Location, Connection } from '../types';

export const CAMPUS_METADATA = {
  institution: "Kakinada Institute of Engineering and Technology (KIET)",
  location: "Korangi, Kakinada District, Andhra Pradesh - 533461, India",
  tagline: "Campus Navigation System",
  disclaimer: "SAMPLE / PROTOTYPE CAMPUS DATA - Demonstrating graph-based navigation for students, faculty, and visitors. Can later be replaced with verified KIET campus information.",
  heroImage: "/src/assets/images/kiet_campus_hero_1790694702268.jpg",
  libraryImage: "/src/assets/images/kiet_library_block_1790694725445.jpg",
};

/**
 * Centralized prototype campus location dataset.
 * Used consistently across:
 * - Locations page
 * - Campus Map
 * - Campus Graph (ADSA BFS/DFS)
 * - Chatbot destination handling & entity extraction
 * - Search suggestions
 */
export const INITIAL_LOCATIONS: Location[] = [
  {
    id: "main-gate",
    name: "Main Gate",
    shortCode: "GATE",
    category: "Other",
    description: "Primary entrance and security checkpoint on Kakinada-Yanam Road, Korangi. Gateway to the KIET academic campus.",
    building: "Main Security Pavilion",
    floor: "Ground Floor",
    latitude: 16.8291,
    longitude: 82.2345,
    x: 120,
    y: 530,
    nearbyLocations: ["Student Parking", "Administrative Block", "Health Centre"],
    aliases: ["main gate", "entrance", "gate", "security", "security booth", "entry", "front gate", "campus entrance"],
    isSampleData: true,
    timings: "Opening: Open 24/7 | Closing: Open 24/7 (Visitor registration: 8:30 AM - 5:30 PM)",
    image: "/src/assets/images/kiet_campus_hero_1790694702268.jpg"
  },
  {
    id: "parking",
    name: "Student Parking",
    shortCode: "PARK",
    category: "Parking",
    description: "Designated covered two-wheeler and four-wheeler parking bays adjacent to the entrance gate.",
    building: "East Pavilion Ground",
    floor: "Ground Level",
    latitude: 16.8293,
    longitude: 82.2351,
    x: 230,
    y: 580,
    nearbyLocations: ["Main Gate", "Administrative Block"],
    aliases: ["parking", "bike parking", "car parking", "vehicle stand", "scooter stand", "student parking"],
    isSampleData: true,
    timings: "Opening: 7:30 AM | Closing: 6:30 PM"
  },
  {
    id: "admin-block",
    name: "Administrative Block",
    shortCode: "ADMIN",
    category: "Administrative",
    description: "Houses Principal's Office, Dean Academics, Registrar, Examination Cell, Accounts, and Central Reception.",
    building: "Sir CV Raman Administrative Block",
    floor: "Ground & 1st Floor",
    latitude: 16.8298,
    longitude: 82.2348,
    x: 260,
    y: 430,
    nearbyLocations: ["Main Gate", "Library", "Lecture Hall Complex"],
    aliases: ["admin", "administrative block", "admin block", "principal office", "principal", "accounts", "exam cell", "examination cell", "registrar", "fee counter", "reception", "office"],
    isSampleData: true,
    timings: "Opening: 9:00 AM | Closing: 5:00 PM (Monday – Saturday)"
  },
  {
    id: "library",
    name: "Library",
    shortCode: "LIB",
    category: "Library",
    description: "Central campus library housing technical book volumes, journals, digital access section, and quiet study reading halls.",
    building: "Central Library Block",
    floor: "Ground & 1st Floor",
    latitude: 16.8306,
    longitude: 82.2349,
    x: 380,
    y: 330,
    nearbyLocations: ["Administrative Block", "CSE Department", "Lecture Hall Complex"],
    aliases: [
      "library",
      "central library",
      "the library",
      "books",
      "reading room",
      "digital library",
      "book bank",
      "study hall",
      "central knowledge resource centre",
      "library block"
    ],
    isSampleData: true,
    timings: "Opening: 8:00 AM | Closing: 8:00 PM (Reading hall open until 9:30 PM on exam days)",
    image: "/src/assets/images/kiet_library_block_1790694725445.jpg"
  },
  {
    id: "cse-dept",
    name: "CSE Department",
    shortCode: "CSE",
    category: "Departments",
    description: "Department of Computer Science & Engineering, faculty cabins, HOD office, and seminar hall.",
    building: "Turing Academic Block A",
    floor: "1st & 2nd Floors",
    latitude: 16.8312,
    longitude: 82.2356,
    x: 520,
    y: 260,
    nearbyLocations: ["CAI Department", "CSE Lab", "Library"],
    aliases: ["cse", "cse dept", "cse department", "computer science", "cse block", "cse hod", "cs dept"],
    isSampleData: true,
    timings: "Opening: 9:00 AM | Closing: 4:45 PM (Monday – Saturday)"
  },
  {
    id: "cai-dept",
    name: "CAI Department",
    shortCode: "CAI",
    category: "Departments",
    description: "Department of CSE (Artificial Intelligence & Machine Learning), data science suites, and research rooms.",
    building: "Ada Lovelace Innovation Wing",
    floor: "3rd Floor, Turing Block",
    latitude: 16.8315,
    longitude: 82.2361,
    x: 640,
    y: 210,
    nearbyLocations: ["CSE Department", "AI & IoT Lab", "CSE Lab"],
    aliases: ["cai", "cai dept", "cai department", "artificial intelligence", "ai department", "ai ml", "cai block", "cai hod"],
    isSampleData: true,
    timings: "Opening: 9:00 AM | Closing: 4:45 PM (Monday – Saturday)"
  },
  {
    id: "cse-lab",
    name: "CSE Lab",
    shortCode: "LAB",
    category: "Laboratories",
    description: "Central computer programming laboratory equipped with Linux/Windows dual-boot systems and development tools.",
    building: "Turing Block Ground Wing",
    floor: "Ground Floor",
    latitude: 16.8310,
    longitude: 82.2352,
    x: 480,
    y: 200,
    nearbyLocations: ["CSE Department", "Library", "CAI Department"],
    aliases: [
      "cse lab",
      "the cse lab",
      "computer lab",
      "central computer lab",
      "programming lab",
      "coding lab",
      "systems lab",
      "lab",
      "lab 1",
      "lab 2",
      "lab 3",
      "computer lab 1",
      "computer lab 2"
    ],
    isSampleData: true,
    timings: "Opening: 9:00 AM | Closing: 5:00 PM (Closed on college holidays)"
  },
  {
    id: "lecture-hall",
    name: "Lecture Hall Complex",
    shortCode: "LH",
    category: "Departments",
    description: "Tiered academic lecture halls equipped with projection screens, audio systems, and smart boards for core lectures.",
    building: "Visvesvaraya Academic Block",
    floor: "1st & 2nd Floors",
    latitude: 16.8304,
    longitude: 82.2355,
    x: 450,
    y: 390,
    nearbyLocations: ["Library", "Administrative Block", "CSE Department"],
    aliases: [
      "lecture hall",
      "lecture halls",
      "lecture hall complex",
      "classrooms",
      "classroom",
      "lh",
      "lecture theater",
      "lh 1",
      "lh 2"
    ],
    isSampleData: true,
    timings: "Opening: 9:00 AM | Closing: 4:30 PM (Class hours: 9:20 AM - 4:10 PM)"
  },
  {
    id: "ai-lab",
    name: "AI & IoT Lab",
    shortCode: "AI-LAB",
    category: "Laboratories",
    description: "Specialized lab equipped with GPU workstations for machine learning, neural networks, and embedded IoT hardware kits.",
    building: "Ada Lovelace Innovation Wing",
    floor: "3rd Floor (Room 304)",
    latitude: 16.8318,
    longitude: 82.2363,
    x: 710,
    y: 170,
    nearbyLocations: ["CAI Department", "CSE Department"],
    aliases: ["ai lab", "iot lab", "ai & iot lab", "robotics lab", "machine learning lab", "gpu lab", "innovation lab"],
    isSampleData: true,
    timings: "Opening: 9:30 AM | Closing: 5:00 PM"
  },
  {
    id: "auditorium",
    name: "Auditorium",
    shortCode: "AUDI",
    category: "Student Facilities",
    description: "Air-conditioned 1,200 capacity multipurpose auditorium for convocations, seminars, and student cultural events.",
    building: "Central Cultural Complex",
    floor: "Ground Floor",
    latitude: 16.8301,
    longitude: 82.2338,
    x: 230,
    y: 280,
    nearbyLocations: ["Library", "Administrative Block", "Placement Cell"],
    aliases: ["auditorium", "audi", "seminar hall", "cultural hall", "kalam audi", "kalam auditorium", "main audi"],
    isSampleData: true,
    timings: "Opening: 9:00 AM | Closing: 5:30 PM (Subject to scheduled events)"
  },
  {
    id: "placement-cell",
    name: "Training & Placement Cell",
    shortCode: "T&P",
    category: "Student Facilities",
    description: "Corporate recruitment suites, group discussion conference rooms, and career training cabins.",
    building: "Sir CV Raman Block (Annex)",
    floor: "2nd Floor",
    latitude: 16.8300,
    longitude: 82.2343,
    x: 290,
    y: 350,
    nearbyLocations: ["Administrative Block", "Library", "Auditorium"],
    aliases: ["placement", "placement cell", "tp cell", "t&p", "training and placement", "campus interview", "interview room"],
    isSampleData: true,
    timings: "Opening: 9:00 AM | Closing: 5:30 PM"
  },
  {
    id: "canteen",
    name: "Canteen",
    shortCode: "FOOD",
    category: "Food/Canteen",
    description: "Hygienic campus cafeteria serving South Indian breakfast, lunch meals, evening snacks, tea, and fresh refreshments.",
    building: "Food Court & Student Amenities Centre",
    floor: "Ground Floor",
    latitude: 16.8309,
    longitude: 82.2378,
    x: 770,
    y: 330,
    nearbyLocations: ["CAI Department", "Sports Ground", "Boys Hostel"],
    aliases: ["canteen", "cafeteria", "mess", "food court", "cafe", "coffee", "lunch", "snacks", "nescafe", "food"],
    isSampleData: true,
    timings: "Opening: 7:30 AM | Closing: 7:30 PM"
  },
  {
    id: "sports-ground",
    name: "Sports Ground",
    shortCode: "SPORT",
    category: "Sports",
    description: "Outdoor sports field for cricket, football, basketball court, and indoor sports equipment store.",
    building: "Physical Education Complex",
    floor: "Outdoor Ground",
    latitude: 16.8322,
    longitude: 82.2386,
    x: 880,
    y: 220,
    nearbyLocations: ["Canteen", "Boys Hostel"],
    aliases: ["sports", "ground", "sports ground", "cricket ground", "football", "basketball", "volleyball", "gym"],
    isSampleData: true,
    timings: "Opening: 6:00 AM (Morning) & 4:30 PM (Evening) | Closing: 8:30 AM & 7:00 PM"
  },
  {
    id: "boys-hostel",
    name: "Boys Hostel",
    shortCode: "B-HOST",
    category: "Hostel",
    description: "On-campus residential quarters for male students with study rooms, Wi-Fi, and dining mess.",
    building: "Vivekananda Hostel Block",
    floor: "G + 4 Floors",
    latitude: 16.8327,
    longitude: 82.2374,
    x: 840,
    y: 120,
    nearbyLocations: ["Canteen", "Sports Ground"],
    aliases: ["boys hostel", "hostel", "boys residence", "mens hostel"],
    isSampleData: true,
    timings: "Opening: 6:00 AM | Closing: 8:30 PM (Curfew: 8:30 PM)"
  },
  {
    id: "girls-hostel",
    name: "Girls Hostel",
    shortCode: "G-HOST",
    category: "Hostel",
    description: "Secure residential complex for female students with 24/7 security guard post and dedicated dining hall.",
    building: "Sarojini Naidu Hostel Block",
    floor: "G + 3 Floors",
    latitude: 16.8288,
    longitude: 82.2365,
    x: 480,
    y: 530,
    nearbyLocations: ["Main Gate", "Administrative Block"],
    aliases: ["girls hostel", "ladies hostel", "womens hostel", "hostel girls"],
    isSampleData: true,
    timings: "Opening: 6:00 AM | Closing: 7:00 PM (Curfew: 7:00 PM)"
  },
  {
    id: "medical-center",
    name: "Health Centre",
    shortCode: "MED",
    category: "Other",
    description: "Emergency first-aid medical center with nursing staff, consultation bed, and basic pharmacopeia.",
    building: "CV Raman Block West Wing",
    floor: "Ground Floor",
    latitude: 16.8295,
    longitude: 82.2342,
    x: 210,
    y: 470,
    nearbyLocations: ["Administrative Block", "Main Gate"],
    aliases: ["medical", "clinic", "dispensary", "hospital", "doctor", "health center", "health centre", "first aid"],
    isSampleData: true,
    timings: "Opening: 9:00 AM | Closing: 6:00 PM (Emergency on-call 24/7)"
  }
];

/**
 * Campus graph connections between prototype locations.
 * Represents walkable pathways for BFS/DFS algorithm.
 */
export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: "c1",
    fromLocation: "main-gate",
    toLocation: "parking",
    distance: 70,
    estimatedTime: 1,
    pathDescription: "Take the immediate right lane towards shaded student parking bays."
  },
  {
    id: "c2",
    fromLocation: "main-gate",
    toLocation: "medical-center",
    distance: 95,
    estimatedTime: 1.5,
    pathDescription: "Walk along the western pedestrian path toward the Health Centre."
  },
  {
    id: "c3",
    fromLocation: "main-gate",
    toLocation: "admin-block",
    distance: 140,
    estimatedTime: 2,
    pathDescription: "Walk directly north along Central Boulevard toward Administrative Block."
  },
  {
    id: "c4",
    fromLocation: "main-gate",
    toLocation: "girls-hostel",
    distance: 210,
    estimatedTime: 3,
    pathDescription: "Walk along the southern avenue eastward to Girls Hostel entrance."
  },
  {
    id: "c5",
    fromLocation: "admin-block",
    toLocation: "placement-cell",
    distance: 85,
    estimatedTime: 1,
    pathDescription: "Proceed up the stairs to 2nd Floor annex of CV Raman Block."
  },
  {
    id: "c6",
    fromLocation: "admin-block",
    toLocation: "auditorium",
    distance: 130,
    estimatedTime: 2,
    pathDescription: "Walk northwest past the fountain court toward Auditorium portico."
  },
  {
    id: "c7",
    fromLocation: "admin-block",
    toLocation: "library",
    distance: 120,
    estimatedTime: 1.8,
    pathDescription: "Proceed north past central circle; Library entrance faces directly ahead."
  },
  {
    id: "c8",
    fromLocation: "admin-block",
    toLocation: "lecture-hall",
    distance: 100,
    estimatedTime: 1.5,
    pathDescription: "Walk northeast across the lawn toward Visvesvaraya Lecture Hall Complex."
  },
  {
    id: "c9",
    fromLocation: "library",
    toLocation: "lecture-hall",
    distance: 85,
    estimatedTime: 1.2,
    pathDescription: "Walk east along the paved corridor connecting Library and Lecture Hall Complex."
  },
  {
    id: "c10",
    fromLocation: "library",
    toLocation: "cse-dept",
    distance: 110,
    estimatedTime: 1.5,
    pathDescription: "Walk northeast across the courtyard into Turing Academic Block."
  },
  {
    id: "c11",
    fromLocation: "library",
    toLocation: "cse-lab",
    distance: 95,
    estimatedTime: 1.2,
    pathDescription: "Proceed north into Ground Floor wing of Turing Block to reach CSE Lab."
  },
  {
    id: "c12",
    fromLocation: "library",
    toLocation: "auditorium",
    distance: 140,
    estimatedTime: 2,
    pathDescription: "Walk west across the central lawn toward Auditorium lobby."
  },
  {
    id: "c13",
    fromLocation: "cse-lab",
    toLocation: "cse-dept",
    distance: 50,
    estimatedTime: 0.8,
    pathDescription: "Take central stairs up one flight to 1st Floor CSE Department."
  },
  {
    id: "c14",
    fromLocation: "cse-dept",
    toLocation: "cai-dept",
    distance: 80,
    estimatedTime: 1,
    pathDescription: "Ascend to 3rd Floor via central staircase to Ada Lovelace Wing."
  },
  {
    id: "c15",
    fromLocation: "cai-dept",
    toLocation: "ai-lab",
    distance: 40,
    estimatedTime: 0.5,
    pathDescription: "Walk down 3rd floor hallway to Room 304 (AI & IoT Lab)."
  },
  {
    id: "c16",
    fromLocation: "cse-dept",
    toLocation: "canteen",
    distance: 180,
    estimatedTime: 2.2,
    pathDescription: "Walk southeast along main avenue towards Canteen & Food Court."
  },
  {
    id: "c17",
    fromLocation: "lecture-hall",
    toLocation: "canteen",
    distance: 170,
    estimatedTime: 2,
    pathDescription: "Follow walkway east past academic quadrangle toward Canteen."
  },
  {
    id: "c18",
    fromLocation: "canteen",
    toLocation: "sports-ground",
    distance: 140,
    estimatedTime: 2,
    pathDescription: "Walk northeast past pavilion to main sports ground."
  },
  {
    id: "c19",
    fromLocation: "canteen",
    toLocation: "boys-hostel",
    distance: 160,
    estimatedTime: 2.2,
    pathDescription: "Follow northern residential path toward Boys Hostel block."
  },
  {
    id: "c20",
    fromLocation: "sports-ground",
    toLocation: "boys-hostel",
    distance: 110,
    estimatedTime: 1.5,
    pathDescription: "Walk westward from sports ground to Boys Hostel gate."
  }
];

/**
 * Universal lookup helper across all locations in the dataset.
 * Supports exact id, shortCode, name, and alias matching.
 */
export function findLocationByIdOrAlias(query: string, locations = INITIAL_LOCATIONS): Location | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase();

  // 1. Exact ID
  const byId = locations.find(l => l.id.toLowerCase() === clean);
  if (byId) return byId;

  // 2. ShortCode
  const byCode = locations.find(l => l.shortCode.toLowerCase() === clean);
  if (byCode) return byCode;

  // 3. Exact Name
  const byName = locations.find(l => l.name.toLowerCase() === clean);
  if (byName) return byName;

  // 4. Exact Alias match
  for (const loc of locations) {
    if (loc.aliases.some(a => a.toLowerCase() === clean)) {
      return loc;
    }
  }

  // 5. Query contains location name or alias
  // Prioritize longer alias/name matches to avoid false partials (e.g. "cse lab" over "cse")
  let bestMatch: Location | undefined;
  let longestMatchLength = 0;

  for (const loc of locations) {
    const nameLower = loc.name.toLowerCase();
    if (clean.includes(nameLower) && nameLower.length > longestMatchLength) {
      bestMatch = loc;
      longestMatchLength = nameLower.length;
    }

    for (const alias of loc.aliases) {
      const aliasLower = alias.toLowerCase();
      if (clean.includes(aliasLower) && aliasLower.length > longestMatchLength) {
        bestMatch = loc;
        longestMatchLength = aliasLower.length;
      }
    }
  }

  if (bestMatch) return bestMatch;

  // 6. Substring in name
  const bySub = locations.find(l => l.name.toLowerCase().includes(clean));
  if (bySub) return bySub;

  return undefined;
}
