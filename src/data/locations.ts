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

  // ── SOUTH PHILADELPHIA (EXPANDED) ─────────────────────────────────────────
  {
    id: "jefferson-square",
    name: "Jefferson Square Park",
    type: "park",
    coordinates: [39.9302, -75.1435],
    description:
      "A classic South Philly neighborhood square at 7th & Tasker with shade trees, benches, and a cheerful community atmosphere.",
    tags: ["Neighborhood Square", "Shade Trees", "Benches", "South Philly"],
    canopyEstimate: 50,
    neighborhood: "South Philadelphia",
    address: "7th & Tasker St",
  },
  {
    id: "tasker-morris-park",
    name: "Tasker Morris Park",
    type: "pocket-park",
    coordinates: [39.9204, -75.1686],
    description:
      "A small neighborhood pocket park in deep South Philly with benches, a compact play area, and mature street trees for dappled shade.",
    tags: ["Pocket Park", "Small Play Area", "Dappled Shade", "Community Space"],
    canopyEstimate: 48,
    neighborhood: "South Philadelphia",
  },
  {
    id: "seger-park",
    name: "Seger Park",
    type: "park",
    coordinates: [39.9369, -75.1576],
    description:
      "Active neighborhood park at 10th & Fitzwater with basketball courts, a playground, and shade trees. Very popular with local kids after school.",
    tags: ["Basketball", "Playground", "Shade Trees", "Active Park", "After School"],
    canopyEstimate: 45,
    neighborhood: "South Philadelphia",
    address: "10th & Fitzwater St",
  },
  {
    id: "capitolo-playground",
    name: "Capitolo Playground",
    type: "playground",
    coordinates: [39.9163, -75.1712],
    description:
      "Well-equipped community playground in deep South Philly with climbing structures, slides, and shade trees. A beloved neighborhood staple.",
    tags: ["Climbing Structures", "Slides", "South Philly", "Shade Trees", "Community Staple"],
    canopyEstimate: 52,
    neighborhood: "South Philadelphia",
    address: "Patterson & 9th St",
  },
  {
    id: "moyamensing-park",
    name: "Moyamensing Park",
    type: "park",
    coordinates: [39.9133, -75.1636],
    description:
      "Spacious park in the Moyamensing neighborhood with open lawns, mature trees, and a classic South Philly community atmosphere.",
    tags: ["Open Lawn", "Mature Trees", "South Philly", "Community Space"],
    canopyEstimate: 55,
    neighborhood: "South Philadelphia",
  },
  {
    id: "whitman-park",
    name: "Whitman Park",
    type: "park",
    coordinates: [39.9092, -75.1517],
    description:
      "Large South Philly park near Packer Park with sports fields, open green space, and shade trees along the perimeter.",
    tags: ["Sports Fields", "Open Green", "Packer Park Area", "Shade Trees"],
    canopyEstimate: 42,
    neighborhood: "South Philadelphia",
  },
  {
    id: "reed-street-playground",
    name: "Reed Street Playground",
    type: "playground",
    coordinates: [39.9088, -75.1733],
    description:
      "Community playground in deep South Philly near the sports complex with updated equipment and shade trees along the fence.",
    tags: ["Playground", "South Philly", "Sports Complex Area", "Updated Equipment"],
    canopyEstimate: 38,
    neighborhood: "South Philadelphia",
  },
  {
    id: "newbold-pocket-park",
    name: "Newbold Pocket Park",
    type: "pocket-park",
    coordinates: [39.9248, -75.1745],
    description:
      "A small community greenspace in Newbold with benches and community plantings — a welcoming block-level gathering point.",
    tags: ["Community Greenspace", "Benches", "Newbold", "Block Park"],
    canopyEstimate: 40,
    neighborhood: "South Philadelphia",
  },
  {
    id: "ellsworth-community-park",
    name: "Ellsworth Community Park",
    type: "pocket-park",
    coordinates: [39.9378, -75.1605],
    description:
      "Small community park on the Graduate Hospital / South Philly border with shade trees and a compact play area.",
    tags: ["Community Park", "Shade Trees", "Compact Play Area", "South Philly"],
    canopyEstimate: 45,
    neighborhood: "Graduate Hospital / South Philadelphia",
  },
  {
    id: "weccacoe-playground",
    name: "Weccacoe Playground",
    type: "playground",
    coordinates: [39.9397, -75.1434],
    description:
      "Well-maintained playground near Queen Village with great equipment, shade trees, and a small spray area. Very popular with young families.",
    tags: ["Queen Village", "Great Equipment", "Shade Trees", "Spray Area", "Families"],
    canopyEstimate: 52,
    neighborhood: "Queen Village",
    address: "Prime & Weccacoe St",
  },

  // ── CENTER CITY / FITLER SQUARE / PARKWAY (EXPANDED) ─────────────────────
  {
    id: "fitler-square",
    name: "Fitler Square",
    type: "park",
    coordinates: [39.9481, -75.1784],
    description:
      "A gorgeous small square known for its beautiful gardens, mature shade trees, and a peaceful fountain. One of the most family-friendly spots in Center City.",
    tags: ["Fountain", "Beautiful Gardens", "Shade Trees", "Family Friendly", "Fitler Square"],
    canopyEstimate: 68,
    neighborhood: "Fitler Square",
    address: "23rd & Pine St",
  },
  {
    id: "schuylkill-river-park",
    name: "Schuylkill River Park",
    type: "park",
    coordinates: [39.9453, -75.1834],
    description:
      "Linear riverside park along the Schuylkill with a dog run, basketball courts, a playground, and great tree coverage along the path.",
    tags: ["Riverside", "Dog Run", "Basketball", "Playground", "Schuylkill Trail"],
    canopyEstimate: 58,
    neighborhood: "Fitler Square / Graduate Hospital",
    address: "25th St & Schuylkill River",
  },
  {
    id: "sister-cities-park",
    name: "Sister Cities Park",
    type: "splash-pad",
    coordinates: [39.9587, -75.1625],
    description:
      "Beautifully designed park on the Benjamin Franklin Parkway with an interactive splash fountain, shaded seating, and a café. A family favorite on the Parkway.",
    tags: ["Splash Fountain", "Parkway", "Shaded Seating", "Café", "Family Favorite"],
    canopyEstimate: 38,
    neighborhood: "Center City / Fairmount",
    address: "18th St & Benjamin Franklin Pkwy",
  },
  {
    id: "logan-square-splash",
    name: "Logan Square Swann Fountain",
    type: "splash-pad",
    coordinates: [39.9575, -75.1676],
    description:
      "The iconic Swann Memorial Fountain at Logan Square doubles as a beloved summertime splash zone. Kids play in the water jets around the main sculpture.",
    tags: ["Iconic Fountain", "Summer Splash", "Parkway", "Historic", "Water Jets"],
    canopyEstimate: 28,
    neighborhood: "Logan Square",
    address: "19th St & Benjamin Franklin Pkwy",
  },
  {
    id: "taney-street-playground",
    name: "Taney Street Playground",
    type: "playground",
    coordinates: [39.9404, -75.1768],
    description:
      "Neighborhood playground in Graduate Hospital with modern equipment, shade structures, and a small open lawn. A quiet gem.",
    tags: ["Modern Equipment", "Shade Structures", "Graduate Hospital", "Safe Play"],
    canopyEstimate: 45,
    neighborhood: "Graduate Hospital",
  },
  {
    id: "penn-landing-park",
    name: "Penn's Landing Greenway",
    type: "park",
    coordinates: [39.9477, -75.1415],
    description:
      "Green promenade at Penn's Landing along the Delaware River with waterfront views, seasonal events, and some shaded seating areas.",
    tags: ["Waterfront", "Promenade", "Delaware River", "Seasonal Events", "Old City"],
    canopyEstimate: 22,
    neighborhood: "Old City / Penn's Landing",
    address: "Columbus Blvd & Walnut St",
  },

  // ── NORTH PHILADELPHIA ────────────────────────────────────────────────────
  {
    id: "hunting-park",
    name: "Hunting Park",
    type: "park",
    coordinates: [40.0033, -75.1558],
    description:
      "One of North Philadelphia's largest and most beloved parks with a carousel, a spray ground, playing fields, and generous shade trees. A real community anchor.",
    tags: ["Carousel", "Spray Ground", "Playing Fields", "Shade Trees", "North Philly", "Community Anchor"],
    canopyEstimate: 65,
    neighborhood: "Hunting Park",
    address: "N 9th & Hunting Park Ave",
  },
  {
    id: "hunting-park-splash",
    name: "Hunting Park Spray Ground",
    type: "splash-pad",
    coordinates: [40.0036, -75.1553],
    description:
      "Seasonal spray ground inside Hunting Park, a beloved cooling spot for North Philly kids all summer long.",
    tags: ["Spray Ground", "Summer Cool-off", "North Philly", "Kids Favorite"],
    canopyEstimate: 20,
    neighborhood: "Hunting Park",
  },
  {
    id: "strawberry-mansion-meadow",
    name: "Strawberry Mansion Meadow",
    type: "open-field",
    coordinates: [39.9842, -75.1905],
    description:
      "A sweeping open meadow in Fairmount Park near Strawberry Mansion with spectacular views, kite-flying space, and shaded grove areas nearby.",
    tags: ["Open Meadow", "Kite Flying", "Shaded Grove", "Fairmount Park", "Scenic Views"],
    canopyEstimate: 35,
    neighborhood: "Strawberry Mansion",
  },
  {
    id: "brewerytown-playground",
    name: "Brewerytown Community Playground",
    type: "playground",
    coordinates: [39.9748, -75.1757],
    description:
      "Community playground near the Art Museum District with updated equipment, shade trees, and a fenced play area.",
    tags: ["Community Playground", "Shade Trees", "Fenced", "Brewerytown", "Art Museum Area"],
    canopyEstimate: 50,
    neighborhood: "Brewerytown",
  },
  {
    id: "gratz-park",
    name: "Gratz Park",
    type: "park",
    coordinates: [40.0067, -75.1512],
    description:
      "Neighborhood park in Nicetown-Tioga with a basketball court, play equipment, and mature street trees. A local gathering spot.",
    tags: ["Basketball", "Play Equipment", "Nicetown", "Community Park"],
    canopyEstimate: 48,
    neighborhood: "Nicetown-Tioga",
  },
  {
    id: "glenwood-green",
    name: "Glenwood Green Acres",
    type: "park",
    coordinates: [39.9952, -75.1585],
    description:
      "A reclaimed railroad bed turned greenway in North Philly with native plantings, shade trees, and a community garden. An innovative urban green space.",
    tags: ["Reclaimed Rail", "Community Greenway", "Native Plants", "Community Garden", "Innovative"],
    canopyEstimate: 45,
    neighborhood: "North Philadelphia",
  },
  {
    id: "tioga-playground",
    name: "Tioga Playground",
    type: "playground",
    coordinates: [40.0115, -75.1648],
    description:
      "Large community playground in the Tioga neighborhood with basketball courts, spray features, and ample shade trees.",
    tags: ["Basketball", "Spray Features", "Shade Trees", "Tioga", "Large Playground"],
    canopyEstimate: 55,
    neighborhood: "Tioga",
  },
  {
    id: "temple-green",
    name: "Temple University Green Space",
    type: "park",
    coordinates: [39.9807, -75.1515],
    description:
      "Open green spaces around Temple's main campus including shaded seating areas and courtyards accessible to the community.",
    tags: ["University", "Shaded Seating", "Courtyards", "Public Access", "North Philly"],
    canopyEstimate: 38,
    neighborhood: "North Philadelphia / Temple",
  },

  // ── NORTHEAST PHILADELPHIA ────────────────────────────────────────────────
  {
    id: "juniata-park",
    name: "Juniata Park",
    type: "park",
    coordinates: [40.0051, -75.1012],
    description:
      "A large Northeast Philly park with baseball diamonds, picnic areas, a recreation center, and mature shade trees. A destination for families across the area.",
    tags: ["Baseball Diamonds", "Picnic Areas", "Rec Center", "Mature Trees", "Northeast Philly"],
    canopyEstimate: 60,
    neighborhood: "Juniata Park",
    address: "M & Cayuga St",
  },
  {
    id: "burholme-park",
    name: "Burholme Park",
    type: "park",
    coordinates: [40.0722, -75.1142],
    description:
      "A scenic wooded park in the Oxford Circle area with tall trees, a creek, and picnic facilities. One of the Northeast's best shaded parks.",
    tags: ["Wooded", "Creek", "Picnic Facilities", "Oxford Circle", "Great Shade"],
    canopyEstimate: 75,
    neighborhood: "Burholme / Oxford Circle",
    address: "Central Ave & Cottman Ave",
  },
  {
    id: "tacony-creek-park",
    name: "Tacony Creek Park",
    type: "park",
    coordinates: [40.0523, -75.0964],
    description:
      "A long linear park following Tacony Creek through Northeast Philly with wooded trails, creek access, and excellent natural shade. Great for nature walks.",
    tags: ["Creek Trail", "Wooded", "Nature Walk", "Linear Park", "Northeast"],
    canopyEstimate: 82,
    neighborhood: "Northeast Philadelphia",
    address: "Adams Ave Trail",
  },
  {
    id: "wissinoming-park",
    name: "Wissinoming Park",
    type: "park",
    coordinates: [40.0243, -75.0728],
    description:
      "Neighborhood park in Wissinoming with a lake, picnic pavilions, sports courts, and a playground. Popular with families across the area.",
    tags: ["Lake", "Picnic Pavilions", "Sports Courts", "Playground", "Wissinoming"],
    canopyEstimate: 58,
    neighborhood: "Wissinoming",
    address: "Frankford Ave & Rhawn St",
  },
  {
    id: "lardners-point",
    name: "Lardner's Point Park",
    type: "park",
    coordinates: [40.0382, -75.0611],
    description:
      "Expansive park in Mayfair/Holmesburg along Pennypack Creek with playing fields, picnic areas, and wooded creek paths.",
    tags: ["Pennypack Creek", "Playing Fields", "Picnic Areas", "Wooded Creek", "Mayfair"],
    canopyEstimate: 62,
    neighborhood: "Mayfair / Holmesburg",
  },
  {
    id: "frankford-rec",
    name: "Frankford Recreation Center",
    type: "rec-center",
    coordinates: [40.0219, -75.0913],
    description:
      "Community rec center in Frankford with basketball courts, playground equipment, and a summer spray ground. Active year-round.",
    tags: ["Basketball", "Spray Ground", "Playground", "Community Center", "Frankford"],
    canopyEstimate: 42,
    neighborhood: "Frankford",
    address: "Oxford Ave & Paul St",
  },
  {
    id: "rhawnhurst-playground",
    name: "Rhawnhurst Playground",
    type: "playground",
    coordinates: [40.0627, -75.0788],
    description:
      "Well-maintained playground in Rhawnhurst with climbing equipment, swings, and shade trees. Great for families in the Northeast.",
    tags: ["Climbing Equipment", "Swings", "Shade Trees", "Rhawnhurst", "Northeast"],
    canopyEstimate: 50,
    neighborhood: "Rhawnhurst",
  },
  {
    id: "fox-chase-rec",
    name: "Fox Chase Recreation Center",
    type: "rec-center",
    coordinates: [40.0872, -75.0843],
    description:
      "Recreation center in Fox Chase with outdoor basketball, tennis courts, and a playground. The park adjacent has excellent shade from mature trees.",
    tags: ["Basketball", "Tennis", "Playground", "Nature Adjacent", "Fox Chase"],
    canopyEstimate: 58,
    neighborhood: "Fox Chase",
  },
  {
    id: "mayfair-playground",
    name: "Mayfair Playground",
    type: "playground",
    coordinates: [40.0521, -75.0668],
    description:
      "Active neighborhood playground in Mayfair with spray features, climbing structures, and a basketball court with surrounding shade trees.",
    tags: ["Spray Features", "Basketball", "Climbing Structures", "Mayfair", "Active"],
    canopyEstimate: 45,
    neighborhood: "Mayfair",
  },
  {
    id: "holmesburg-park",
    name: "Holmesburg Park",
    type: "park",
    coordinates: [40.0580, -75.0520],
    description:
      "Park in the Holmesburg neighborhood with open fields, a playground, recreation facilities, and shade trees perfect for summer picnics.",
    tags: ["Open Fields", "Playground", "Picnic Spot", "Holmesburg", "Summer"],
    canopyEstimate: 52,
    neighborhood: "Holmesburg",
  },
  {
    id: "tacony-palmetto",
    name: "Tacony-Palmetto Park",
    type: "park",
    coordinates: [40.0173, -75.0706],
    description:
      "Neighborhood park in Tacony with a playground, basketball court, and shade trees. An active community park in the heart of Tacony.",
    tags: ["Playground", "Basketball", "Shade Trees", "Tacony", "Active"],
    canopyEstimate: 52,
    neighborhood: "Tacony",
  },
  {
    id: "rising-sun-courts",
    name: "Rising Sun Multi-Sport Courts",
    type: "multi-sport-court",
    coordinates: [40.0290, -75.1259],
    description:
      "Outdoor multi-sport courts in the Rising Sun / Lawncrest area with basketball hoops and an open paved surface. Busy with youth sports.",
    tags: ["Multi-Sport", "Basketball", "Youth Sports", "Rising Sun", "Northeast"],
    canopyEstimate: 12,
    neighborhood: "Lawncrest / Rising Sun",
  },
  {
    id: "harrowgate-park",
    name: "Harrowgate Park",
    type: "park",
    coordinates: [39.9990, -75.1120],
    description:
      "Classic Northeast-edge neighborhood park at Kensington with an active sports field, playground, basketball court, and mature shade trees.",
    tags: ["Sports Field", "Playground", "Basketball", "Mature Trees", "Harrowgate"],
    canopyEstimate: 55,
    neighborhood: "Harrowgate / Kensington",
  },
  {
    id: "mather-playground",
    name: "Mather Playground",
    type: "playground",
    coordinates: [40.0472, -75.1422],
    description:
      "Community playground in the Lawncrest neighborhood with play equipment, a basketball area, and shade trees. A hub for local families.",
    tags: ["Play Equipment", "Basketball", "Shade Trees", "Lawncrest", "Family Hub"],
    canopyEstimate: 50,
    neighborhood: "Lawncrest",
  },

  // ── WEST PHILADELPHIA (EXPANDED) ─────────────────────────────────────────
  {
    id: "cedar-park",
    name: "Cedar Park",
    type: "park",
    coordinates: [39.9479, -75.2279],
    description:
      "A beautiful West Philly neighborhood park at 50th & Baltimore with mature shade trees, open lawn, and frequent community events. A go-to for Cedar Park families.",
    tags: ["Mature Shade Trees", "Open Lawn", "Community Events", "West Philly", "Baltimore Ave"],
    canopyEstimate: 70,
    neighborhood: "Cedar Park",
    address: "50th & Baltimore Ave",
  },
  {
    id: "spruce-hill-park",
    name: "Spruce Hill Park",
    type: "park",
    coordinates: [39.9527, -75.2190],
    description:
      "Serene neighborhood park in the heart of Spruce Hill with tall shade trees, benches, and a quiet atmosphere perfect for kids to play.",
    tags: ["Tall Shade Trees", "Serene", "Benches", "Spruce Hill", "West Philly"],
    canopyEstimate: 72,
    neighborhood: "Spruce Hill",
  },
  {
    id: "saunders-park",
    name: "Saunders Park",
    type: "park",
    coordinates: [39.9583, -75.2333],
    description:
      "West Philly park near 57th street with a basketball court, playground, and community garden. Well shaded with mature trees.",
    tags: ["Basketball", "Playground", "Community Garden", "Mature Trees", "West Philly"],
    canopyEstimate: 60,
    neighborhood: "West Philadelphia",
    address: "57th & Locust St",
  },
  {
    id: "haddington-rec",
    name: "Haddington Recreation Center",
    type: "rec-center",
    coordinates: [39.9651, -75.2451],
    description:
      "Community rec center in Haddington with outdoor basketball courts, a baseball field, and playground areas. A busy after-school hub.",
    tags: ["Basketball", "Baseball Field", "Playground", "Community Center", "Haddington"],
    canopyEstimate: 48,
    neighborhood: "Haddington",
    address: "64th & Haverford Ave",
  },
  {
    id: "overbrook-basketball",
    name: "Overbrook Basketball Courts",
    type: "basketball-court",
    coordinates: [39.9703, -75.2531],
    description:
      "Outdoor basketball courts in Overbrook with evening shade from adjacent row houses. A popular spot for pickup games.",
    tags: ["Basketball", "Outdoor Courts", "Overbrook", "Evening Shade", "Pickup Games"],
    canopyEstimate: 15,
    neighborhood: "Overbrook",
  },
  {
    id: "clark-park-tennis",
    name: "Clark Park Tennis Courts",
    type: "tennis-court",
    coordinates: [39.9444, -75.2105],
    description:
      "Public tennis courts at Clark Park shaded by the park's magnificent mature trees. Some of the best-shaded public courts in West Philly.",
    tags: ["Tennis", "Shaded Courts", "Clark Park", "West Philly", "Public"],
    canopyEstimate: 60,
    neighborhood: "West Philadelphia",
  },

  // ── NORTHWEST PHILADELPHIA (EXPANDED) ────────────────────────────────────
  {
    id: "cresheim-valley",
    name: "Cresheim Valley Trail",
    type: "park",
    coordinates: [40.0769, -75.2095],
    description:
      "A secluded wooded valley trail near Chestnut Hill with a dense tree canopy, creek sounds, and spectacular shade all day. A nature lover's paradise.",
    tags: ["Wooded Valley", "Trail", "Creek", "Dense Canopy", "Secluded", "Chestnut Hill"],
    canopyEstimate: 93,
    neighborhood: "Chestnut Hill / Mt. Airy",
  },
  {
    id: "mt-airy-playground",
    name: "Mt. Airy Playground",
    type: "playground",
    coordinates: [40.0648, -75.1982],
    description:
      "Community playground in Mt. Airy with shade trees, climbing structures, and a friendly neighborhood atmosphere.",
    tags: ["Shade Trees", "Climbing Structures", "Mt. Airy", "Community Vibe"],
    canopyEstimate: 65,
    neighborhood: "Mt. Airy",
  },
  {
    id: "mt-airy-athletic",
    name: "Mt. Airy Athletic Fields",
    type: "open-field",
    coordinates: [40.0697, -75.1922],
    description:
      "Open athletic fields in Mt. Airy adjacent to wooded areas. Great for pickup soccer and kite-flying with trees nearby for shade breaks.",
    tags: ["Athletic Fields", "Soccer", "Kite Flying", "Wooded Adjacent", "Mt. Airy"],
    canopyEstimate: 25,
    neighborhood: "Mt. Airy",
  },
  {
    id: "pelham-road-park",
    name: "Pelham Road Park",
    type: "park",
    coordinates: [40.0753, -75.1976],
    description:
      "Small wooded park in Chestnut Hill with mature oaks and naturalistic play areas. Very shaded and peaceful — a neighborhood treasure.",
    tags: ["Wooded", "Mature Oaks", "Naturalistic Play", "Chestnut Hill", "Peaceful"],
    canopyEstimate: 80,
    neighborhood: "Chestnut Hill",
  },
  {
    id: "lovett-memorial-park",
    name: "Lovett Memorial Library Park",
    type: "pocket-park",
    coordinates: [40.0338, -75.2375],
    description:
      "A small, charming pocket park adjacent to Lovett Memorial Library in Germantown with mature trees and quiet seating. A hidden gem.",
    tags: ["Library Adjacent", "Mature Trees", "Hidden Gem", "Quiet", "Germantown"],
    canopyEstimate: 68,
    neighborhood: "Germantown",
  },
  {
    id: "roxborough-playground",
    name: "Roxborough Playground",
    type: "playground",
    coordinates: [40.0430, -75.2244],
    description:
      "Active community playground in Roxborough with well-maintained equipment, a basketball half-court, and shade trees near Wissahickon.",
    tags: ["Well-Maintained", "Basketball Half-Court", "Shade Trees", "Roxborough"],
    canopyEstimate: 58,
    neighborhood: "Roxborough",
  },
  {
    id: "shawmont-valley",
    name: "Shawmont Valley Park",
    type: "park",
    coordinates: [40.0543, -75.2282],
    description:
      "A quiet, wooded valley park in upper Roxborough along the Schuylkill. Dense tree canopy and nature trails. Exceptional shade all day.",
    tags: ["Wooded Valley", "Schuylkill Adjacent", "Nature Trails", "Dense Canopy", "Quiet"],
    canopyEstimate: 87,
    neighborhood: "Roxborough / Shawmont",
  },

  // ── FISHTOWN / PORT RICHMOND / BRIDESBURG ────────────────────────────────
  {
    id: "shackamaxon-park",
    name: "Shackamaxon Street Park",
    type: "pocket-park",
    coordinates: [39.9758, -75.1353],
    description:
      "A small Fishtown pocket park on Shackamaxon Street with benches and shade trees. A quick shady stop in the neighborhood.",
    tags: ["Pocket Park", "Fishtown", "Quick Stop", "Shade Benches"],
    canopyEstimate: 38,
    neighborhood: "Fishtown",
  },
  {
    id: "fishtown-oval",
    name: "Fishtown Community Oval",
    type: "open-field",
    coordinates: [39.9665, -75.1383],
    description:
      "Open community space on the Northern Liberties / Fishtown border used for pop-up events, informal play, and community gatherings.",
    tags: ["Community Space", "Pop-up Events", "Informal Play", "Fishtown", "Northern Liberties"],
    canopyEstimate: 18,
    neighborhood: "Fishtown / Northern Liberties",
  },
  {
    id: "gaul-street-park",
    name: "Gaul Street Mini Park",
    type: "pocket-park",
    coordinates: [39.9759, -75.1294],
    description:
      "A tiny but charming Fishtown mini park on Gaul Street with young trees and benches. Part of the neighborhood's growing green infrastructure.",
    tags: ["Mini Park", "Young Trees", "Fishtown", "Community Green"],
    canopyEstimate: 32,
    neighborhood: "Fishtown",
  },
  {
    id: "east-girard-basketball",
    name: "East Girard Basketball Courts",
    type: "basketball-court",
    coordinates: [39.9741, -75.1228],
    description:
      "Outdoor basketball courts near East Girard in Port Richmond. Open urban court — great for evening games when the sun is lower.",
    tags: ["Basketball", "Outdoor", "Port Richmond", "Evening Games"],
    canopyEstimate: 10,
    neighborhood: "Port Richmond",
  },
  {
    id: "port-richmond-park",
    name: "Port Richmond Park",
    type: "park",
    coordinates: [39.9820, -75.1176],
    description:
      "Community park in Port Richmond with a playground, basketball court, and shade trees along the perimeter. Beloved neighborhood green space.",
    tags: ["Playground", "Basketball", "Shade Trees", "Port Richmond", "Community"],
    canopyEstimate: 50,
    neighborhood: "Port Richmond",
  },
  {
    id: "bridesburg-rec",
    name: "Bridesburg Recreation Center",
    type: "rec-center",
    coordinates: [39.9989, -75.0820],
    description:
      "Recreation center in Bridesburg with outdoor courts, fields, and a playground. Serves the Bridesburg community with active programming year-round.",
    tags: ["Outdoor Courts", "Fields", "Playground", "Bridesburg", "Community"],
    canopyEstimate: 40,
    neighborhood: "Bridesburg",
    address: "Salmon St & Bridge St",
  },

  // ── KENSINGTON / NORTH PHILLY EXTRA ──────────────────────────────────────
  {
    id: "cambria-playground",
    name: "Cambria Playground",
    type: "playground",
    coordinates: [39.9880, -75.1325],
    description:
      "Community playground in Kensington with fenced equipment, shade trees, and an active rec program. A safe neighborhood play space.",
    tags: ["Fenced", "Shade Trees", "Rec Program", "Kensington", "Safe"],
    canopyEstimate: 45,
    neighborhood: "Kensington",
  },
  {
    id: "emerald-street-park",
    name: "Emerald Street Urban Farm & Park",
    type: "pocket-park",
    coordinates: [39.9704, -75.1437],
    description:
      "A community-managed urban farm and pocket park in Kensington / Northern Liberties with shade pergolas, community garden, and kids play areas.",
    tags: ["Urban Farm", "Community Garden", "Shade Pergola", "Kensington", "Kids Area"],
    canopyEstimate: 42,
    neighborhood: "Kensington / Northern Liberties",
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
