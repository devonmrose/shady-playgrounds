import type { Location, LocationType } from '../types';
import { computeShadeScore } from '../utils/shadeCalculator';
import { generateSunProfile } from '../utils/sunProfileGenerator';

interface RawLocation {
  id: string;
  name: string;
  type: LocationType;
  coordinates: [number, number];
  description: string;
  tags: string[];
  canopyEstimate: number;
  neighborhood: string;
  address?: string;
}

const rawLocations: RawLocation[] = [
  // ── WEST PHILADELPHIA ──────────────────────────────────────────────────────
  {
    id: "clark-park",
    name: "Clark Park",
    type: "park",
    coordinates: [39.9448, -75.2108],
    description:
      "A beloved West Philly gem with a massive canopy of mature oaks and sycamores, a community garden, open lawn, and a summer farmers market. One of the shadiest large parks in the city.",
    tags: ["Large Trees", "Community Garden", "Open Lawn", "Dog Friendly", "Great for Toddlers", "Farmers Market"],
    canopyEstimate: 78,
    neighborhood: "West Philadelphia",
    address: "43rd & Chester Ave",
  },
  {
    id: "kingsessing-rec",
    name: "Kingsessing Recreation Center",
    type: "rec-center",
    coordinates: [39.9334, -75.2215],
    description:
      "Community rec center with outdoor basketball courts, a fenced playground, and grassy areas shaded by mature trees. Great all-around neighborhood spot.",
    tags: ["Basketball Courts", "Playground", "Shade Trees", "Community Center", "Fenced"],
    canopyEstimate: 55,
    neighborhood: "West Philadelphia",
    address: "5840 Kingsessing Ave",
  },
  {
    id: "malcolm-x-park",
    name: "Malcolm X Park",
    type: "park",
    coordinates: [39.9532, -75.2244],
    description:
      "A grand historic park featuring a beautiful fountain, sweeping lawns, and mature trees that provide excellent afternoon shade. Popular with families and community gatherings.",
    tags: ["Fountain", "Historic", "Large Trees", "Afternoon Shade", "Community Hub"],
    canopyEstimate: 68,
    neighborhood: "West Philadelphia",
    address: "5100 Pine St",
  },
  {
    id: "cobbs-creek-park",
    name: "Cobbs Creek Park",
    type: "park",
    coordinates: [39.9425, -75.2425],
    description:
      "A vast natural park along Cobbs Creek with dense old-growth woodland, nature trails, and naturalistic play areas. Outstanding canopy coverage — one of the best shaded parks in Philly.",
    tags: ["Dense Woods", "Creek", "Nature Trails", "Great Canopy", "Wildlife", "Old-Growth"],
    canopyEstimate: 91,
    neighborhood: "West Philadelphia",
    address: "Cobbs Creek Pkwy",
  },
  {
    id: "mlk-skate-area",
    name: "MLK Drive Skate Zone",
    type: "skate-park",
    coordinates: [39.9555, -75.2148],
    description:
      "Popular skating and active recreation zone along MLK Drive. Open concrete with perimeter tree shade from adjacent Fairmount Park. Best in early morning.",
    tags: ["Skating", "Active Recreation", "Tree Shade Nearby", "Fairmount Park Edge"],
    canopyEstimate: 18,
    neighborhood: "West Philadelphia / Fairmount",
  },
  {
    id: "cobbs-creek-soccer",
    name: "Cobbs Creek Soccer Fields",
    type: "soccer-field",
    coordinates: [39.9388, -75.2457],
    description:
      "Open grass soccer fields at Cobbs Creek Park. The fields themselves are sunny but surrounded by a wooded perimeter with excellent shade for spectators.",
    tags: ["Soccer Field", "Open Field", "Wooded Perimeter", "Weekend Games", "Community Sports"],
    canopyEstimate: 10,
    neighborhood: "West Philadelphia",
    address: "Cobbs Creek Pkwy & Chester Ave",
  },

  // ── SOUTH PHILADELPHIA ─────────────────────────────────────────────────────
  {
    id: "fdr-park",
    name: "FDR Park",
    type: "park",
    coordinates: [39.8983, -75.1891],
    description:
      "South Philly's largest park, with lakes, meandering paths, sports facilities, and beautiful mature tree groves. The wooded areas offer excellent summer shade.",
    tags: ["Lake", "Walking Paths", "Large Park", "Sports Fields", "Picnic Areas", "Mature Trees"],
    canopyEstimate: 58,
    neighborhood: "South Philadelphia",
    address: "1500 Pattison Ave",
  },
  {
    id: "fdr-splash-pad",
    name: "FDR Splash Pad",
    type: "splash-pad",
    coordinates: [39.8993, -75.1878],
    description:
      "Popular splash pad at FDR Park with water jets and interactive sprinklers. Shade structures nearby and mature trees at the perimeter. A summer must-visit!",
    tags: ["Splash Pad", "Water Play", "Kids Favorite", "Summer Fun", "Shade Structure"],
    canopyEstimate: 22,
    neighborhood: "South Philadelphia",
  },
  {
    id: "mifflin-square",
    name: "Mifflin Square Park",
    type: "park",
    coordinates: [39.9195, -75.1727],
    description:
      "A classic South Philly square with a central fountain, mature shade trees, and well-kept benches. A peaceful neighborhood gathering spot for families.",
    tags: ["Fountain", "Mature Trees", "Neighborhood Square", "Benches", "Peaceful"],
    canopyEstimate: 62,
    neighborhood: "South Philadelphia",
  },
  {
    id: "marconi-plaza",
    name: "Marconi Plaza",
    type: "park",
    coordinates: [39.9182, -75.1813],
    description:
      "Spacious historic plaza in South Philadelphia with tall shade trees, open lawns, and shaded walkways. Popular for weekend family outings.",
    tags: ["Historic", "Tall Trees", "Open Lawn", "Shaded Walkways", "Weekend Spot"],
    canopyEstimate: 55,
    neighborhood: "South Philadelphia",
    address: "Broad St & Oregon Ave",
  },
  {
    id: "passyunk-square",
    name: "Passyunk Square",
    type: "park",
    coordinates: [39.9265, -75.1617],
    description:
      "A charming triangular park at the heart of East Passyunk with a central fountain, community plantings, and shade trees. A gem in the middle of a lively neighborhood.",
    tags: ["Fountain", "Triangle Park", "Community Plantings", "Neighborhood Gem", "East Passyunk"],
    canopyEstimate: 50,
    neighborhood: "South Philadelphia",
  },
  {
    id: "hawthorne-park",
    name: "Hawthorne Park",
    type: "pocket-park",
    coordinates: [39.9351, -75.1655],
    description:
      "A lively pocket park in Graduate Hospital with playground equipment, shade trees, and a colorful community mural. Perfect for a neighborhood break.",
    tags: ["Playground", "Community Mural", "Pocket Park", "Graduate Hospital", "Great for Kids"],
    canopyEstimate: 53,
    neighborhood: "Graduate Hospital",
  },
  {
    id: "wharton-square",
    name: "Wharton Square",
    type: "pocket-park",
    coordinates: [39.9263, -75.1651],
    description:
      "A quiet neighborhood square in South Philly with benches, mature trees, and a small play area for young children. An underrated shady spot.",
    tags: ["Quiet", "Benches", "Small Play Area", "Neighborhood Square", "Mature Trees"],
    canopyEstimate: 52,
    neighborhood: "South Philadelphia",
  },

  // ── CENTER CITY ────────────────────────────────────────────────────────────
  {
    id: "rittenhouse-square",
    name: "Rittenhouse Square",
    type: "park",
    coordinates: [39.9496, -75.1714],
    description:
      "Philadelphia's most prestigious park square with beautifully maintained gardens, mature shade trees, a reflecting pool, and a vibrant atmosphere. Always buzzing with families.",
    tags: ["Prestigious", "Reflecting Pool", "Garden", "Shade Trees", "Great for Families", "Center City"],
    canopyEstimate: 57,
    neighborhood: "Center City",
    address: "18th & Walnut St",
  },
  {
    id: "washington-square",
    name: "Washington Square",
    type: "park",
    coordinates: [39.9463, -75.1492],
    description:
      "A serene historic square in Old City shaded by magnificent London Plane trees. One of the city's best-shaded parks with a historic tomb and plenty of benches.",
    tags: ["Historic", "London Plane Trees", "Great Shade", "Old City", "Serene"],
    canopyEstimate: 72,
    neighborhood: "Old City",
    address: "6th & Walnut St",
  },
  {
    id: "franklin-square",
    name: "Franklin Square",
    type: "park",
    coordinates: [39.9554, -75.1476],
    description:
      "One of Penn's five original squares, now a destination park with a carousel, mini-golf, a fountain play area, and food vendors. A full family day out!",
    tags: ["Carousel", "Mini Golf", "Fountain Play", "Family Destination", "Historic", "Food Vendors"],
    canopyEstimate: 44,
    neighborhood: "Old City",
    address: "200 N 6th St",
  },
  {
    id: "franklin-splash",
    name: "Franklin Square Fountain",
    type: "splash-pad",
    coordinates: [39.9556, -75.1469],
    description:
      "Interactive fountain at Franklin Square where kids run through jet streams and cool off on hot days. The central feature of the park.",
    tags: ["Fountain Play", "Water Jets", "Summer Cool-off", "Old City", "Family Fun"],
    canopyEstimate: 28,
    neighborhood: "Old City",
  },

  // ── FISHTOWN ───────────────────────────────────────────────────────────────
  {
    id: "penn-treaty-park",
    name: "Penn Treaty Park",
    type: "park",
    coordinates: [39.9740, -75.1239],
    description:
      "A peaceful historic riverside park in Fishtown along the Delaware River with mature trees, open lawns, and stunning water views. Great for picnics.",
    tags: ["Riverfront", "Historic", "Water Views", "Open Lawn", "Mature Trees", "Picnic"],
    canopyEstimate: 57,
    neighborhood: "Fishtown",
    address: "N Beach & Columbia Ave",
  },
  {
    id: "mauer-playground",
    name: "Mauer Playground",
    type: "playground",
    coordinates: [39.9720, -75.1307],
    description:
      "A well-loved Fishtown neighborhood playground with modern equipment, shade structures, and rubber safety surfacing. Excellent for toddlers and young kids.",
    tags: ["Modern Equipment", "Shade Structures", "Safe Surfacing", "Great for Toddlers", "Fenced"],
    canopyEstimate: 42,
    neighborhood: "Fishtown",
    address: "Memphis & Sergeant St",
  },
  {
    id: "canal-st-courts",
    name: "Canal Street Sport Courts",
    type: "multi-sport-court",
    coordinates: [39.9738, -75.1284],
    description:
      "Multi-use courts in Fishtown with basketball hoops and tennis lines. Urban location with minimal overhead shade — bring a hat.",
    tags: ["Multi-Sport", "Basketball", "Tennis", "Urban Court", "Port Richmond"],
    canopyEstimate: 10,
    neighborhood: "Fishtown / Port Richmond",
  },

  // ── NORTHERN LIBERTIES ─────────────────────────────────────────────────────
  {
    id: "liberty-lands",
    name: "Liberty Lands Park",
    type: "park",
    coordinates: [39.9653, -75.1419],
    description:
      "A community-built park in Northern Liberties with a playground, community garden, and lovely mature shade trees. A beloved gathering spot for the neighborhood.",
    tags: ["Community Built", "Playground", "Community Garden", "Northern Liberties Gem", "Mature Trees"],
    canopyEstimate: 62,
    neighborhood: "Northern Liberties",
    address: "913 N 3rd St",
  },
  {
    id: "orianna-hill",
    name: "Orianna Hill Park",
    type: "park",
    coordinates: [39.9615, -75.1416],
    description:
      "An elevated neighborhood park with great city skyline views, native plantings, and a natural play area. Popular with Northern Liberties families and dog walkers.",
    tags: ["City Views", "Native Plants", "Natural Play", "Northern Liberties", "Dog Friendly"],
    canopyEstimate: 32,
    neighborhood: "Northern Liberties",
  },
  {
    id: "schmidts-commons",
    name: "Schmidt's Commons",
    type: "park",
    coordinates: [39.9617, -75.1428],
    description:
      "Urban park at the former Schmidt's Brewery site with community events, play structures, a dog run, and year-round programming.",
    tags: ["Urban Park", "Community Events", "Play Structures", "Dog Run", "Historic Brewery"],
    canopyEstimate: 28,
    neighborhood: "Northern Liberties",
  },

  // ── KENSINGTON ─────────────────────────────────────────────────────────────
  {
    id: "norris-square",
    name: "Norris Square Park",
    type: "park",
    coordinates: [39.9793, -75.1361],
    description:
      "A beautiful community park in Kensington with a stunning community garden, shade trees, and vibrant cultural murals. Heart of the Puerto Rican community.",
    tags: ["Community Garden", "Cultural Murals", "Shade Trees", "Community Hub", "Kensington"],
    canopyEstimate: 58,
    neighborhood: "Kensington",
    address: "N American & Susquehanna",
  },
  {
    id: "mcpherson-square",
    name: "McPherson Square",
    type: "park",
    coordinates: [39.9933, -75.1368],
    description:
      "Neighborhood park in Kensington with a library branch, shaded benches, and mature trees. A calm community gathering point.",
    tags: ["Library Branch", "Mature Trees", "Benches", "Community Space", "Kensington"],
    canopyEstimate: 50,
    neighborhood: "Kensington",
    address: "Indiana Ave & Kensington Ave",
  },

  // ── FAIRMOUNT / SPRING GARDEN ──────────────────────────────────────────────
  {
    id: "smith-memorial-playground",
    name: "Smith Memorial Playground",
    type: "playground",
    coordinates: [39.9738, -75.2091],
    description:
      "A legendary Philadelphia playground with the iconic giant wooden slide, modern play structures, a dedicated toddler area, and dense tree cover. An absolute must-visit.",
    tags: ["Giant Wooden Slide", "Historic", "Toddler Area", "Dense Trees", "Beloved Classic", "Full Shade"],
    canopyEstimate: 82,
    neighborhood: "Fairmount / Strawberry Mansion",
    address: "3500 Reservoir Dr",
  },
  {
    id: "lemon-hill",
    name: "Lemon Hill Meadow",
    type: "open-field",
    coordinates: [39.9721, -75.1904],
    description:
      "Rolling meadow in Fairmount Park with beautiful city views, tree groves along the edges, and open grassy areas perfect for kite-flying and picnics.",
    tags: ["Meadow", "Rolling Hills", "Picnic Spot", "Open Field", "Scenic", "Fairmount Park"],
    canopyEstimate: 32,
    neighborhood: "Fairmount",
  },
  {
    id: "kelly-drive-playground",
    name: "Kelly Drive Playground",
    type: "playground",
    coordinates: [39.9756, -75.1981],
    description:
      "Playground along Kelly Drive near the Schuylkill River with mature oaks, river views nearby, and a convenient bike path for the family.",
    tags: ["Kelly Drive", "River Views", "Bike Path", "Mature Oaks", "Active Families"],
    canopyEstimate: 52,
    neighborhood: "Fairmount",
    address: "Kelly Dr near Poplar St",
  },
  {
    id: "fairmount-tennis",
    name: "Fairmount Park Tennis Courts",
    type: "tennis-court",
    coordinates: [39.9693, -75.1977],
    description:
      "Public clay and hard tennis courts in Fairmount Park. Mostly sunny at midday but tree shade at the court edges in the morning and afternoon.",
    tags: ["Tennis Courts", "Public", "Fairmount Park", "Morning Shade", "Clay Courts"],
    canopyEstimate: 22,
    neighborhood: "Fairmount",
    address: "Fairmount Park near Poplar Dr",
  },
  {
    id: "kellys-landing-basketball",
    name: "Kelly's Landing Basketball Courts",
    type: "basketball-court",
    coordinates: [39.9748, -75.2021],
    description:
      "Popular outdoor basketball courts near Kelly Drive. Open court with tree cover on the perimeter and a lively pickup game scene on weekends.",
    tags: ["Basketball", "Pickup Games", "Perimeter Trees", "Kelly Drive", "Active"],
    canopyEstimate: 15,
    neighborhood: "Fairmount",
  },

  // ── UNIVERSITY CITY ────────────────────────────────────────────────────────
  {
    id: "penn-park",
    name: "Penn Park",
    type: "park",
    coordinates: [39.9517, -75.1907],
    description:
      "A beautifully designed modern park on Penn's campus with sports fields, picnic areas, and seating under young trees. Open to the public.",
    tags: ["University", "Sports Fields", "Modern Park", "Well-maintained", "Open Lawn"],
    canopyEstimate: 28,
    neighborhood: "University City",
    address: "3050 Walnut St",
  },
  {
    id: "drexel-park",
    name: "Drexel Park",
    type: "park",
    coordinates: [39.9556, -75.1889],
    description:
      "Small urban park on the Drexel campus with seating, mature trees, and a small playground area accessible to the public during the day.",
    tags: ["Urban Park", "Mature Trees", "Playground", "University City", "Public Access"],
    canopyEstimate: 42,
    neighborhood: "University City",
  },

  // ── MANAYUNK / ROXBOROUGH ──────────────────────────────────────────────────
  {
    id: "pretzel-park",
    name: "Pretzel Park",
    type: "park",
    coordinates: [40.0243, -75.2284],
    description:
      "The beloved Manayunk neighborhood park named for its pretzel-shaped path, with a playground, great shade trees, and a community feel you can't beat.",
    tags: ["Historic", "Pretzel Path", "Playground", "Shade Trees", "Manayunk Gem"],
    canopyEstimate: 66,
    neighborhood: "Manayunk",
    address: "4200 Silverwood St",
  },
  {
    id: "gorgas-park",
    name: "Gorgas Park",
    type: "park",
    coordinates: [40.0337, -75.2340],
    description:
      "A beautiful Roxborough park with a large creek, exceptionally dense tree canopy, walking paths, and shaded picnic tables. One of the best-shaded parks in the city.",
    tags: ["Creek", "Dense Canopy", "Walking Paths", "Picnic Areas", "Roxborough", "Top-Rated Shade"],
    canopyEstimate: 83,
    neighborhood: "Roxborough",
    address: "400 Hermit Ln",
  },

  // ── GERMANTOWN ─────────────────────────────────────────────────────────────
  {
    id: "vernon-park",
    name: "Vernon Park",
    type: "park",
    coordinates: [40.0297, -75.1708],
    description:
      "Historic Germantown park anchoring the Germantown Ave corridor, featuring mature trees, a seasonal splash fountain, and community event space.",
    tags: ["Historic", "Splash Fountain", "Mature Trees", "Germantown Ave", "Community Events"],
    canopyEstimate: 67,
    neighborhood: "Germantown",
    address: "Germantown Ave & Chelten Ave",
  },
  {
    id: "stenton-park",
    name: "Stenton Park",
    type: "park",
    coordinates: [40.0548, -75.1758],
    description:
      "A large naturalistic park in Logan/Stenton with open meadows, wooded sections, and picnic areas. Adjacent to the historic Stenton estate.",
    tags: ["Historic Adjacent", "Open Meadow", "Wooded Areas", "Picnic Space", "North Philly"],
    canopyEstimate: 55,
    neighborhood: "Logan / Stenton",
  },

  // ── NORTHEAST PHILADELPHIA ─────────────────────────────────────────────────
  {
    id: "pennypack-park",
    name: "Pennypack Park",
    type: "park",
    coordinates: [40.0651, -75.0596],
    description:
      "A vast and magnificent natural park in Northeast Philly following Pennypack Creek through dense woodland. Exceptional shade and naturalistic trails perfect for adventurous families.",
    tags: ["Creek Trail", "Dense Woodland", "Nature Play", "Wildlife", "Northeast Philly", "Exceptional Shade"],
    canopyEstimate: 93,
    neighborhood: "Northeast Philadelphia",
    address: "Pennypack Creek Trail",
  },

  // ── NORTHWEST PHILADELPHIA ─────────────────────────────────────────────────
  {
    id: "wissahickon-valley",
    name: "Wissahickon Valley Park",
    type: "park",
    coordinates: [40.0582, -75.2157],
    description:
      "One of Philadelphia's crown jewels — a forested gorge along Wissahickon Creek with miles of shaded trails, a historic covered bridge, and endless nature play opportunities.",
    tags: ["Gorge", "Covered Bridge", "Trails", "Excellent Shade", "Creek Play", "Nature"],
    canopyEstimate: 96,
    neighborhood: "Northwest Philadelphia",
    address: "Valley Green Rd",
  },
  {
    id: "chestnut-hill-playground",
    name: "Chestnut Hill Playground",
    type: "playground",
    coordinates: [40.0742, -75.2097],
    description:
      "Charming neighborhood playground in Chestnut Hill with modern equipment under tall mature trees. A shaded, well-maintained spot loved by local families.",
    tags: ["Shaded Playground", "Modern Equipment", "Chestnut Hill", "Mature Trees", "Quiet"],
    canopyEstimate: 70,
    neighborhood: "Chestnut Hill",
  },

  // ── SOUTH PHILLY EXTRA ─────────────────────────────────────────────────────
  {
    id: "columbus-square",
    name: "Columbus Square",
    type: "park",
    coordinates: [39.9328, -75.1557],
    description:
      "A neighborhood park in Point Breeze with a playground, basketball court, and shade trees. A go-to spot for South Philly families.",
    tags: ["Playground", "Basketball", "South Philly", "Neighborhood Park", "Shade Trees"],
    canopyEstimate: 48,
    neighborhood: "Point Breeze",
    address: "12th & Wharton St",
  },
  {
    id: "dickinson-square",
    name: "Dickinson Square Park",
    type: "park",
    coordinates: [39.9226, -75.1632],
    description:
      "Lovely neighborhood park in South Philly with a splash pad, playground, shade trees, and an active community garden. A perennial family favorite.",
    tags: ["Splash Pad", "Playground", "Community Garden", "Shade Trees", "South Philly"],
    canopyEstimate: 54,
    neighborhood: "South Philadelphia",
    address: "Dickinson & Moyamensing",
  },
  {
    id: "dickinson-splash",
    name: "Dickinson Square Spray Ground",
    type: "splash-pad",
    coordinates: [39.9228, -75.1628],
    description:
      "The popular spray ground at Dickinson Square is a summer staple for South Philly kids. Some shade trees and a structure adjacent.",
    tags: ["Spray Ground", "Water Play", "Summer Staple", "South Philly", "Kids Favorite"],
    canopyEstimate: 25,
    neighborhood: "South Philadelphia",
  },
];

/** Build full Location objects with computed shade scores and sun profiles */
export const locations: Location[] = rawLocations.map((raw) => ({
  ...raw,
  shadeScore: computeShadeScore(raw.canopyEstimate),
  sunProfile: generateSunProfile(raw.canopyEstimate, raw.type),
}));

export function getLocationById(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}
