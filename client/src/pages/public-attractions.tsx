import { Link } from "wouter";
import {
  Search, MapPin, Star, Users, Sparkles, Moon, Heart,
  Gem, Compass, Mountain, Building2, Ship, Plane,
  Camera, TreePine, Waves, ChevronRight, ArrowRight,
  Clock, Sun, Zap, Eye, Ticket, Utensils, ShoppingBag,
  Palmtree, Fish, Bike, Wind, Umbrella, Music, Theater,
  Globe, Car, Landmark, ChefHat
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/LocaleRouter";

interface Attraction {
  id: number;
  name: string;
  category: string;
  description: string;
  location: string;
}

interface CategoryData {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  image: string;
  description: string;
  attractions: Attraction[];
}

const CATEGORIES_DATA: CategoryData[] = [
  {
    id: "observation-landmarks",
    name: "Observation Decks & Landmarks",
    count: 12,
    icon: Eye,
    gradient: "from-[#FF9327] to-[#FFD112]",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    description: "Experience Dubai from breathtaking heights with world-record observation decks",
    attractions: [
      { id: 1, name: "Burj Khalifa At The Top (Levels 124-125)", category: "Observation Deck", description: "World's tallest building at 828m; 360-degree views from 456m with floor-to-ceiling glass walls, outdoor terrace, and VR experiences", location: "Downtown Dubai" },
      { id: 2, name: "Burj Khalifa At The Top SKY (Level 148)", category: "Premium Observation", description: "World's highest observation deck at 555m with VIP guided tours, SKY lounge, Arabic refreshments", location: "Downtown Dubai" },
      { id: 3, name: "The Lounge (Levels 152-154)", category: "Ultra-Premium Lounge", description: "World's highest lounge at 585m with gourmet refreshments, live entertainment, exclusive terrace", location: "Burj Khalifa" },
      { id: 4, name: "Dubai Frame", category: "Observation Deck/Museum", description: "150m golden picture frame; Old Dubai Gallery, 93m glass-floor Sky Deck, Future Dubai exhibits", location: "Zabeel Park" },
      { id: 5, name: "The View at The Palm", category: "Observation Deck", description: "Level 52 panoramic views (240m) of Palm Jumeirah; interactive exhibition about Palm's construction", location: "Palm Tower, Palm Jumeirah" },
      { id: 6, name: "Sky Views Observatory", category: "Adventure Observation", description: "219.5m views; features Glass Slide, Edge Walk (hands-free ledge walking), glass-bottom experiences", location: "Address Sky View Hotel" },
      { id: 7, name: "Ain Dubai", category: "Observation Wheel", description: "World's tallest observation wheel (250m); 38-minute rotation with air-conditioned cabins, SkyBar options", location: "Bluewaters Island" },
      { id: 8, name: "Dubai Fountain", category: "Landmark", description: "World's largest choreographed fountain with 22,000 gallons of water dancing to music against Burj Khalifa backdrop", location: "Downtown Dubai" },
      { id: 9, name: "Burj Al Arab", category: "Landmark", description: "Iconic 321m sail-shaped luxury hotel; Inside Burj Al Arab tours available", location: "Jumeirah Beach" },
      { id: 10, name: "Expo City Dubai", category: "Exhibition Complex", description: "Former Expo 2020 site with interactive pavilions, smart technology exhibits, Terra sustainability center", location: "Expo City" },
      { id: 11, name: "The Dubai Balloon", category: "Aerial Attraction", description: "Tethered helium balloon rising 300m for panoramic views of Palm, Burj Al Arab, and skyline", location: "Atlantis, Palm Jumeirah" },
      { id: 12, name: "Museum of the Future", category: "Landmark/Museum", description: "Torus-shaped architectural marvel exploring AI, space, sustainability; Arabic calligraphy exterior", location: "Sheikh Zayed Road" },
    ]
  },
  {
    id: "theme-parks",
    name: "Theme Parks",
    count: 15,
    icon: Star,
    gradient: "from-[#F94498] to-[#FDA9E5]",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&h=600&fit=crop",
    description: "World-class indoor and outdoor entertainment for all ages",
    attractions: [
      { id: 13, name: "IMG Worlds of Adventure", category: "Indoor Theme Park", description: "World's largest indoor park (1.5M sq ft); Marvel, Cartoon Network, Lost Valley dinosaur zones; 27+ rides", location: "City of Arabia" },
      { id: 14, name: "Motiongate Dubai", category: "Theme Park", description: "Hollywood-themed park; DreamWorks, Columbia Pictures, Lionsgate zones; 33 rides including John Wick 4D coaster", location: "Dubai Parks and Resorts" },
      { id: 15, name: "Legoland Dubai", category: "Family Theme Park", description: "40 rides for ages 2-12; 60 million LEGO bricks; Miniland with landmark replicas", location: "Dubai Parks and Resorts" },
      { id: 16, name: "Real Madrid World", category: "Sports Theme Park", description: "World's first football-themed park (opened 2024); Hala Madrid wooden coaster, 460ft Stars Flyer swing", location: "Dubai Parks and Resorts" },
      { id: 17, name: "Global Village", category: "Cultural Festival Park", description: "90+ country pavilions, 170+ carnival rides, Ripley's museum, cultural performances; seasonal Oct-May", location: "Sheikh Mohammed Bin Zayed Road" },
      { id: 18, name: "Ski Dubai", category: "Indoor Ski Resort", description: "Middle East's first ski resort; 22,500 sqm snow area, 5 slopes, penguin encounters, Snow Bullet zipline", location: "Mall of the Emirates" },
      { id: 19, name: "AYA Universe", category: "Immersive Digital Park", description: "40,000 sq ft immersive space with 12 cosmic zones including Celestia and Harmonia light installations", location: "WAFI City Mall" },
      { id: 20, name: "KidZania Dubai", category: "Edutainment", description: "7,000 sq ft mini city where kids role-play 70+ professions and earn 'KidZos' currency", location: "Dubai Mall" },
      { id: 21, name: "VR Park Dubai", category: "Virtual Reality Park", description: "Middle East's first VR park; Burj Drop simulator, Dune Bash, 30+ AR/VR experiences", location: "Dubai Mall" },
      { id: 22, name: "Dubai Garden Glow", category: "Light Theme Park", description: "Recyclable light installations across 5 themed zones; dinosaur park, art displays", location: "Zabeel Park" },
      { id: 23, name: "Aventura Parks", category: "Adventure Park", description: "Dubai's largest zipline park; 80+ challenges, 24 ziplines, 5 circuits in natural Ghaf forest", location: "Mushrif Park" },
      { id: 24, name: "The Storm Coaster", category: "Extreme Attraction", description: "Guinness World Record fastest vertical-launch coaster; 670m track integrated into mall", location: "Dubai Hills Mall" },
      { id: 25, name: "House of Hype", category: "Immersive Park", description: "18 themed worlds, 50+ interactive games, live performances", location: "Dubai" },
      { id: 26, name: "Riverland Dubai", category: "Entertainment District", description: "Free-entry themed district with French Village, Boardwalk, India Gate zones; dining and entertainment", location: "Dubai Parks and Resorts" },
      { id: 27, name: "Zombie Apocalypse Park", category: "Themed Experience", description: "Immersive zombie-themed entertainment experience", location: "Dubai" },
    ]
  },
  {
    id: "water-parks",
    name: "Water Parks",
    count: 5,
    icon: Waves,
    gradient: "from-[#01BEFF] to-[#6443F4]",
    image: "https://images.unsplash.com/photo-1582654454409-778f6619e0e2?w=800&h=600&fit=crop",
    description: "Year-round aquatic thrills at world-class water parks",
    attractions: [
      { id: 28, name: "Aquaventure Waterpark", category: "Water Park", description: "World's largest waterpark; 105+ slides including Poseidon's Revenge, Aquaconda; 2.3km lazy river; dolphin encounters", location: "Atlantis, Palm Jumeirah" },
      { id: 29, name: "Wild Wadi Water Park", category: "Water Park", description: "30+ rides; Jumeirah Sceirah (80 km/h free-fall), Middle East's largest wave pool, Burj Al Arab views", location: "Jumeirah Beach" },
      { id: 30, name: "Legoland Water Park", category: "Family Water Park", description: "LEGO-themed for ages 2-12; Joker Soaker, Build-A-Raft River, DUPLO splash zones", location: "Dubai Parks and Resorts" },
      { id: 31, name: "Laguna Waterpark", category: "Beachfront Water Park", description: "WaveOz 180 FlowRider (one of 5 worldwide), AquaLaunch loop, direct beach access", location: "La Mer" },
      { id: 32, name: "Jungle Bay", category: "Water Attraction", description: "New waterpark addition to Dubai's attractions portfolio", location: "Dubai" },
    ]
  },
  {
    id: "museums-cultural",
    name: "Museums & Cultural Attractions",
    count: 25,
    icon: Building2,
    gradient: "from-[#6443F4] to-[#9077EF]",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop",
    description: "Discover Dubai's rich heritage and cutting-edge digital art experiences",
    attractions: [
      { id: 33, name: "Museum of the Future", category: "Innovation Museum", description: "Explores AI, space, sustainability through immersive exhibitions; LEED Platinum certified", location: "Sheikh Zayed Road" },
      { id: 34, name: "Madame Tussauds Dubai", category: "Wax Museum", description: "60+ celebrity figures across 7 zones; first Middle East location", location: "Bluewaters Island" },
      { id: 35, name: "Museum of Illusions", category: "Interactive Museum", description: "Optical illusions, gravity-defying rooms, mind puzzles", location: "Al Fahidi" },
      { id: 36, name: "Museum of Candy", category: "Specialty Museum", description: "15+ rooms across 8 zones celebrating global candy culture", location: "Dubai" },
      { id: 37, name: "ARTE Museum Dubai", category: "Digital Art", description: "Immersive projections with signature fragrances and soundscapes", location: "Dubai Mall" },
      { id: 38, name: "OliOli Children's Museum", category: "Interactive Museum", description: "8 galleries, 40+ exhibits; Toshi's Net climbing structure, STEAM-focused play", location: "Al Quoz" },
      { id: 39, name: "Infinity des Lumières", category: "Digital Art", description: "Immersive digital art exhibitions with floor-to-ceiling projections", location: "Dubai Mall" },
      { id: 40, name: "Dubai Museum (Al Fahidi Fort)", category: "Heritage Museum", description: "Dubai's oldest building (1787); life-sized dioramas of traditional life", location: "Bur Dubai" },
      { id: 41, name: "Etihad Museum", category: "National History", description: "Interactive exhibits about UAE federation founding in 1971", location: "Jumeirah" },
      { id: 42, name: "Al Shindagha Museum", category: "Heritage Museum", description: "UAE's largest heritage museum; 80 historic houses, 22 pavilions, Perfume House", location: "Al Shindagha" },
      { id: 43, name: "Saruq Al-Hadid Archaeological Museum", category: "Archaeology", description: "12,000+ artifacts from 3,000-year-old Iron Age site; interactive artifact laboratory", location: "Shindagha District" },
      { id: 44, name: "3D World Selfie Museum", category: "Interactive Art", description: "World's largest 3D selfie museum; 175+ trick-art paintings", location: "Al Quoz" },
      { id: 45, name: "Dubai Coffee Museum", category: "Specialty Museum", description: "Middle East's largest; antique items, brewing demonstrations, tastings; free entry", location: "Al Fahidi" },
      { id: 46, name: "Coin Museum", category: "Specialty Museum", description: "470+ rare coins from Middle Eastern history; free entry", location: "Al Fahidi" },
      { id: 47, name: "Women's Museum (Bait Al Banat)", category: "Cultural Museum", description: "Celebrates contributions of Emirati women through history", location: "Deira" },
      { id: 48, name: "Theatre of Digital Art (TODA)", category: "Digital Art", description: "360-degree immersive art, laser shows, wellness sessions; reopened 2025", location: "Souk Madinat Jumeirah" },
      { id: 49, name: "Naif Museum", category: "History Museum", description: "Dubai security history in former police station; free entry", location: "Deira" },
      { id: 50, name: "Sheikh Saeed Al Maktoum House", category: "Heritage Museum", description: "1896 royal residence with coins, stamps, historical photographs", location: "Al Shindagha" },
      { id: 51, name: "Pearl Museum", category: "Specialty Museum", description: "Natural pearl collection showcasing Dubai's diving heritage", location: "Emirates NBD HQ" },
      { id: 52, name: "Crossroad of Civilizations Museum", category: "History Museum", description: "Private collection of artifacts from various civilizations", location: "Near Al Fahidi" },
      { id: 53, name: "Mohammed Bin Rashid Library", category: "Cultural Landmark", description: "Major new cultural institution", location: "Dubai" },
      { id: 54, name: "Dubai Banksy Exhibition", category: "Art Exhibition", description: "Exhibition featuring Banksy artwork", location: "Dubai" },
      { id: 55, name: "Heritage Village", category: "Living Museum", description: "Reconstructed Bedouin settlement with craft demonstrations, pearl diving exhibits", location: "Al Shindagha" },
      { id: 56, name: "Hatta Heritage Village", category: "Mountain Heritage", description: "Restored historic village with stone buildings, falaj systems, watchtowers", location: "Hatta" },
      { id: 57, name: "Alserkal Avenue", category: "Arts District", description: "25+ galleries, 60+ creative venues; Cinema Akil arthouse theater", location: "Al Quoz" },
    ]
  },
  {
    id: "zoos-aquariums",
    name: "Zoos, Aquariums & Wildlife",
    count: 8,
    icon: Fish,
    gradient: "from-[#02A65C] to-[#59ED63]",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    description: "Meet marine life and exotic animals from around the world",
    attractions: [
      { id: 58, name: "Dubai Aquarium & Underwater Zoo", category: "Aquarium", description: "10 million liters; 33,000+ animals, 140+ species; 48m tunnel, King Croc (750kg)", location: "Dubai Mall" },
      { id: 59, name: "The Lost Chambers Aquarium", category: "Themed Aquarium", description: "Atlantis-themed; 65,000+ animals, 21 exhibits, mermaid performances, shark programs", location: "Atlantis, Palm Jumeirah" },
      { id: 60, name: "Dubai Dolphinarium", category: "Marine Entertainment", description: "Middle East's first indoor dolphinarium; dolphin/seal shows, swim programs, 5D cinema", location: "Creek Park" },
      { id: 61, name: "Dolphin Bay", category: "Dolphin Interaction", description: "Indo-Pacific bottlenose dolphins; Dolphin Swim, Encounter, Kayak, Paddle programs", location: "Atlantis" },
      { id: 62, name: "Sea Lion Point", category: "Marine Encounter", description: "South African fur seal interactions with educational programs", location: "Atlantis" },
      { id: 63, name: "The Green Planet", category: "Indoor Rainforest", description: "Middle East's first bio-dome; 3,000+ plants and animals including sloths, anacondas", location: "City Walk" },
      { id: 64, name: "Dubai Safari Park", category: "Wildlife Park", description: "1,200+ hectare park with exotic animals in natural habitats; interactive shows", location: "Al Warqa" },
      { id: 65, name: "Dubai Crocodile Park", category: "Wildlife Park", description: "250+ Nile crocodiles; feeding sessions, educational tours, African lake aquarium", location: "Near Mushrif Park" },
    ]
  },
  {
    id: "parks-gardens",
    name: "Parks & Gardens",
    count: 4,
    icon: TreePine,
    gradient: "from-[#02A65C] to-[#01BEFF]",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop",
    description: "Stunning floral displays and natural escapes in the desert",
    attractions: [
      { id: 66, name: "Dubai Miracle Garden", category: "Flower Garden", description: "World's largest natural flower garden; 50M+ flowers, Emirates A380 floral structure; Nov-May only", location: "Al Barsha South" },
      { id: 67, name: "Dubai Butterfly Garden", category: "Nature Attraction", description: "15,000 butterflies from 50 species across 10 domes; butterfly museum", location: "Dubai Miracle Garden complex" },
      { id: 68, name: "Zabeel Park", category: "Urban Park", description: "47.5-hectare park hosting Dubai Frame, Garden Glow, jogging tracks, playgrounds", location: "Zabeel" },
      { id: 69, name: "Al Qudra Lakes", category: "Nature Reserve", description: "Man-made desert lakes popular for cycling, birdwatching, camping", location: "Al Marmoom" },
    ]
  },
  {
    id: "desert-adventures",
    name: "Desert Adventures",
    count: 12,
    icon: Sun,
    gradient: "from-[#FF9327] to-[#F2CCA6]",
    image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&h=600&fit=crop",
    description: "Thrilling dune experiences and authentic Bedouin culture",
    attractions: [
      { id: 70, name: "Evening Desert Safari", category: "Safari", description: "Most popular; 6-7 hours with dune bashing, BBQ dinner, belly dancing, fire shows, camel rides", location: "Lahbab Desert" },
      { id: 71, name: "Morning Desert Safari", category: "Safari", description: "3-4 hour adventure; cooler temperatures, sunrise views, optional quad biking", location: "Dubai Desert" },
      { id: 72, name: "Overnight Desert Safari", category: "Safari", description: "Full immersion with tent accommodation, stargazing, sunrise camel ride", location: "Al Khayma Camp" },
      { id: 73, name: "Dune Bashing", category: "Adventure", description: "30-45 minute 4x4 roller-coaster ride across red sand dunes", location: "Lahbab Red Dunes" },
      { id: 74, name: "Camel Riding", category: "Traditional Experience", description: "Short camp rides or longer sunset/sunrise treks through dunes", location: "Desert Safari Camps" },
      { id: 75, name: "Quad Biking/ATV Tours", category: "Adventure", description: "Self-drive ATV adventures (30-60 min) across desert terrain", location: "Lahbab Desert" },
      { id: 76, name: "Dune Buggy Safari", category: "Adventure", description: "2-4 seater buggies (3,000cc) through challenging terrain with convoy guides", location: "Dubai Desert" },
      { id: 77, name: "Sandboarding", category: "Adventure", description: "Surf down steep dunes; included in most safari packages", location: "Desert areas" },
      { id: 78, name: "Hot Air Balloon Rides", category: "Aerial", description: "Sunrise flights 3,000-4,000 ft; falcon shows, breakfast at Bedouin camp", location: "Dubai Desert Conservation Reserve" },
      { id: 79, name: "Bedouin Camp Experience", category: "Cultural", description: "Arabic hospitality, henna, shisha, falconry, live entertainment, BBQ dinner", location: "Desert Safari Camps" },
      { id: 80, name: "Heritage Desert Safari", category: "Premium Safari", description: "Vintage Land Rover, wildlife spotting, 5-star breakfast at Al Maha Resort", location: "Dubai Desert Conservation Reserve" },
      { id: 81, name: "Private Night Safari with Astronomy", category: "Premium Safari", description: "Nocturnal eco-walk, owl encounters, 3-course dinner, telescope stargazing", location: "Dubai Desert Conservation Reserve" },
    ]
  },
  {
    id: "cruises-boats",
    name: "Cruises & Boat Experiences",
    count: 12,
    icon: Ship,
    gradient: "from-[#01BEFF] to-[#9077EF]",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
    description: "Scenic water journeys from traditional dhows to luxury yachts",
    attractions: [
      { id: 82, name: "Dubai Marina Dhow Cruise", category: "Dinner Cruise", description: "2-hour cruise past Marina skyscrapers; buffet, Tanoura entertainment, Ain Dubai views", location: "Dubai Marina" },
      { id: 83, name: "Dubai Creek Dhow Cruise", category: "Heritage Cruise", description: "Traditional cruise through historic port past souks, Heritage Village", location: "Dubai Creek" },
      { id: 84, name: "Dubai Canal Cruise", category: "Sightseeing", description: "Modern boat/abra cruise with Burj Khalifa, waterfall, IMAGINE show views", location: "Dubai Canal" },
      { id: 85, name: "Alexandra Dhow Cruise", category: "VIP Cruise", description: "Premium dhow experience with dinner and entertainment", location: "Dubai Marina" },
      { id: 86, name: "Lotus Mega Yacht Cruise", category: "Luxury Cruise", description: "5-deck yacht with pool, jacuzzi, live DJ, cinema, 5-star buffet", location: "Dubai Marina" },
      { id: 87, name: "Yacht Charter", category: "Private Experience", description: "33ft-100ft vessels; sunset cruises, dinner cruises, corporate events", location: "Dubai Marina Yacht Club" },
      { id: 88, name: "The Yellow Boats", category: "Speed Boat Tour", description: "Award-winning guided speedboat tours; 45-99 minute options past landmarks", location: "Dubai Marina Walk" },
      { id: 89, name: "Speedboat Tours", category: "Adventure", description: "90-minute high-speed RIB tours along Dubai coastline", location: "Dubai Marina" },
      { id: 90, name: "Dubai Ferry", category: "Public Transport", description: "Air-conditioned ferries (98 passengers) across 6 routes; AED 1-75", location: "Multiple marine stations" },
      { id: 91, name: "Abra Rides", category: "Heritage Transport", description: "Traditional wooden boats crossing Dubai Creek; AED 1-2; 150+ abras operate daily", location: "Deira/Bur Dubai stations" },
      { id: 92, name: "Glass Houseboat Cruise", category: "Specialty Cruise", description: "Sunset/dinner on glass-bottomed houseboat with buffet", location: "Dubai" },
      { id: 93, name: "Palm Jumeirah Boat Tours", category: "Scenic Tour", description: "Tours around iconic palm viewing luxury villas, Atlantis", location: "Palm Jumeirah" },
    ]
  },
  {
    id: "aerial-extreme",
    name: "Aerial Adventures & Extreme Sports",
    count: 14,
    icon: Wind,
    gradient: "from-[#F94498] to-[#6443F4]",
    image: "https://images.unsplash.com/photo-1503891617560-5b8c2e28cbf6?w=800&h=600&fit=crop",
    description: "Heart-pumping experiences from skydiving to ziplines",
    attractions: [
      { id: 94, name: "Skydive Dubai - Palm Dropzone", category: "Extreme Sport", description: "Tandem skydive from 13,000 ft over Palm Jumeirah; 60 seconds freefall at 120mph", location: "Palm Jumeirah" },
      { id: 95, name: "Skydive Dubai - Desert Campus", category: "Extreme Sport", description: "Tandem skydiving over Arabian desert with mountain views", location: "Margham Desert" },
      { id: 96, name: "iFLY Dubai", category: "Indoor Skydiving", description: "Dual vertical wind tunnels (200km/h); safe freefall experience for all ages", location: "Mirdif City Centre" },
      { id: 97, name: "XLine Dubai Marina", category: "Zipline", description: "World's longest urban zipline (1km) at 170m height, 80km/h Superman pose", location: "Dubai Marina Mall" },
      { id: 98, name: "Helicopter Tours", category: "Aerial Sightseeing", description: "12-40 minute flights; Burj Khalifa, Palm, World Islands views; from AED 710", location: "Atlantis Helipad" },
      { id: 99, name: "Seaplane Tours", category: "Aerial Sightseeing", description: "Cessna seaplanes; 20-45 min; unique water takeoff/landing", location: "Mina Rashid" },
      { id: 100, name: "Gyrocopter Flights", category: "Aerial", description: "20-minute flights around major landmarks", location: "Skydive Dubai" },
      { id: 101, name: "Sky Views Edge Walk", category: "Extreme", description: "UAE's first hands-free ledge walking experience at 219m", location: "Address Sky View" },
      { id: 102, name: "Sky Views Glass Slide", category: "Extreme", description: "First transparent slide in Middle East at 219m", location: "Address Sky View" },
      { id: 103, name: "XDubai Slingshot", category: "Extreme", description: "Vertical launch at 100km/h with freefall", location: "Kite Beach" },
      { id: 104, name: "Gravity Zone Bungee", category: "Extreme", description: "50-meter bungee jump with panoramic Dubai views", location: "Dubai" },
      { id: 105, name: "Deep Dive Dubai", category: "Extreme", description: "World's deepest pool (60m) with sunken city to explore", location: "Nad Al Sheba" },
      { id: 106, name: "Jais Flight", category: "Zipline", description: "World's longest zipline (2.83km) at 150kph", location: "Jebel Jais, RAK" },
      { id: 107, name: "Jebel Jais Sky Tour", category: "Zipline", description: "6 ziplines across 5km of mountain terrain", location: "Jebel Jais, RAK" },
    ]
  },
  {
    id: "water-sports",
    name: "Water Sports & Activities",
    count: 15,
    icon: Umbrella,
    gradient: "from-[#01BEFF] to-[#02A65C]",
    image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&h=600&fit=crop",
    description: "Every water activity imaginable along Dubai's stunning coastline",
    attractions: [
      { id: 108, name: "Jet Skiing", category: "Water Sport", description: "Speed across Arabian Gulf with skyline backdrop; 30-60 min tours", location: "JBR/Marina/Palm" },
      { id: 109, name: "Flyboarding", category: "Water Sport", description: "Hover 9-15m above water on jet propulsion; Burj Al Arab backdrop", location: "Palm Jumeirah/JBR" },
      { id: 110, name: "Parasailing", category: "Water Sport", description: "Aerial views of coastline towed by speedboat; ~AED 350-400", location: "JBR Beach" },
      { id: 111, name: "Wakeboarding", category: "Water Sport", description: "High-energy sport with Dubai skyline backdrop", location: "Dubai Marina" },
      { id: 112, name: "Kite Surfing", category: "Water Sport", description: "Wind-powered watersport; lessons available at Kite Beach", location: "Kite Beach" },
      { id: 113, name: "Kayaking", category: "Water Sport", description: "Coastal/mangrove kayaking; Dolphin Kayak at Atlantis", location: "Multiple locations" },
      { id: 114, name: "Paddleboarding (SUP)", category: "Water Sport", description: "Beach rentals; Dolphin Paddle at Atlantis", location: "Kite Beach/JBR/Atlantis" },
      { id: 115, name: "Banana Boat Rides", category: "Family Activity", description: "Inflatable tube rides pulled by speedboat", location: "JBR/Marina beaches" },
      { id: 116, name: "Flyfish Rides", category: "Adventure", description: "Inflatable lifted by speedboat; 2 riders; ~AED 200", location: "JBR Beach" },
      { id: 117, name: "Scuba Diving", category: "Underwater", description: "Dubai Aquarium shark diving, open water sites; PADI certification available", location: "Multiple locations" },
      { id: 118, name: "Snorkeling Tours", category: "Underwater", description: "Cage snorkeling at aquariums; open water tours around reefs", location: "Dubai Aquarium/Atlantis" },
      { id: 119, name: "Shark Encounters", category: "Underwater", description: "Shark diving (certified) or cage snorkeling at Dubai Aquarium/Atlantis", location: "Dubai Mall/Atlantis" },
      { id: 120, name: "Deep Sea Fishing", category: "Fishing", description: "4-8 hour charters; kingfish, barracuda, grouper; BBQ catch option", location: "Dubai Marina" },
      { id: 121, name: "Seabreacher", category: "Adventure", description: "Shark/dolphin-shaped watercraft diving 3m deep, jumping 5m high at 60mph", location: "Jumeirah" },
      { id: 122, name: "JBR Beach", category: "Beach", description: "Dubai's most popular; 3km white sand, The Walk promenade, water sports", location: "JBR" },
    ]
  },
  {
    id: "entertainment-shows",
    name: "Entertainment & Shows",
    count: 10,
    icon: Theater,
    gradient: "from-[#6443F4] to-[#F94498]",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop",
    description: "World-class performances and entertainment venues",
    attractions: [
      { id: 123, name: "La Perle by Dragone", category: "Live Show", description: "90-min aqua show; 65 artists, 2.7M liters water, 25m dives; AED 220-710", location: "Al Habtoor City" },
      { id: 124, name: "Dubai Opera", category: "Performing Arts", description: "2,000-seat dhow-shaped venue; opera, ballet, concerts, musicals", location: "Downtown Dubai" },
      { id: 125, name: "Dubai Ice Rink", category: "Sports/Entertainment", description: "Olympic-sized rink; public sessions, disco nights, skating academy", location: "Dubai Mall" },
      { id: 126, name: "Roxy Cinemas", category: "Cinema", description: "Premium boutique experience; dine-in, three seating classes", location: "Multiple locations" },
      { id: 127, name: "Reel Cinemas", category: "Cinema", description: "22 THX-certified screens with reclining chairs", location: "Dubai Mall" },
      { id: 128, name: "Coca-Cola Arena", category: "Concert Venue", description: "Premier 17,000-capacity indoor venue for concerts and events", location: "City Walk" },
      { id: 129, name: "Escape Hunt/Entermission", category: "Escape Rooms", description: "Themed puzzle rooms including VR escape experiences", location: "Multiple locations" },
      { id: 130, name: "Magic Planet", category: "Family Entertainment", description: "Indoor arcade, rides, simulators across multiple malls", location: "Mall of the Emirates" },
      { id: 131, name: "Bounce Dubai", category: "Trampoline Park", description: "100+ trampolines; X-Park obstacle course, slam dunks, zipline", location: "Al Quoz/Festival City" },
      { id: 132, name: "The Arcade by Hub Zero", category: "Gaming", description: "VR zones, laser tag, arcade games, climbing walls", location: "Al Khawaneej Walk" },
    ]
  },
  {
    id: "shopping",
    name: "Shopping Destinations",
    count: 11,
    icon: ShoppingBag,
    gradient: "from-[#FF9327] to-[#F94498]",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
    description: "From mega malls to traditional souks - a shopper's paradise",
    attractions: [
      { id: 133, name: "Dubai Mall", category: "Mega Mall", description: "World's largest mall; 1,200+ stores, aquarium, ice rink, KidZania, Fashion Avenue", location: "Downtown Dubai" },
      { id: 134, name: "Mall of the Emirates", category: "Mega Mall", description: "630+ outlets, Ski Dubai, Magic Planet, VOX Cinemas, Harvey Nichols", location: "Al Barsha" },
      { id: 135, name: "Ibn Battuta Mall", category: "Themed Mall", description: "World's largest themed mall; 6 courts (China, India, Persia, Egypt, Tunisia, Andalusia)", location: "Jebel Ali" },
      { id: 136, name: "Dubai Festival City Mall", category: "Waterfront Mall", description: "IMAGINE multimedia show, The Messi Experience football attraction", location: "Festival City" },
      { id: 137, name: "Wafi Mall", category: "Themed Mall", description: "Egyptian-themed with pyramids and sphinxes; Khan Murjan Souk underground", location: "Oud Metha" },
      { id: 138, name: "Dragon Mart", category: "Wholesale", description: "World's largest Chinese trading hub outside China; 3,000+ shops", location: "International City" },
      { id: 139, name: "Gold Souk", category: "Traditional Market", description: "Historic market with 10+ tonnes of gold; established 1900s", location: "Deira" },
      { id: 140, name: "Spice Souk", category: "Traditional Market", description: "Aromatic herbs, spices, frankincense, saffron, bakhoor", location: "Deira" },
      { id: 141, name: "Perfume Souk", category: "Traditional Market", description: "Arabic perfumes, attar oils, oud, decorative bottles", location: "Deira" },
      { id: 142, name: "Textile Souk", category: "Traditional Market", description: "Silk, cotton, embroidered fabrics, custom tailoring; Hindi Lane", location: "Bur Dubai" },
      { id: 143, name: "Souk Madinat Jumeirah", category: "Modern Souk", description: "Heritage-inspired with canals, craft shops, Burj Al Arab views", location: "Madinat Jumeirah" },
    ]
  },
  {
    id: "dining-experiences",
    name: "Dining Experiences",
    count: 8,
    icon: ChefHat,
    gradient: "from-[#F94498] to-[#FFD112]",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    description: "Extraordinary culinary experiences from sky-high to underwater",
    attractions: [
      { id: 144, name: "Dinner in the Sky", category: "Sky Dining", description: "Table suspended 50m by crane; Forbes '10 Most Unusual Restaurants'", location: "Dubai Marina" },
      { id: 145, name: "Ossiano", category: "Underwater Dining", description: "Michelin-starred; floor-to-ceiling aquarium with 65,000 marine animals", location: "Atlantis The Palm" },
      { id: 146, name: "Al Mahara", category: "Underwater Dining", description: "Burj Al Arab's underwater restaurant with central aquarium", location: "Burj Al Arab" },
      { id: 147, name: "At.mosphere", category: "Sky Dining", description: "World's highest restaurant; 122nd floor Burj Khalifa", location: "Burj Khalifa" },
      { id: 148, name: "Sonara Camp", category: "Desert Dining", description: "Luxury eco-camp; gourmet fusion dining, entertainment, stargazing", location: "Dubai Desert Conservation Reserve" },
      { id: 149, name: "Al Hadheerah", category: "Desert Dining", description: "Arabian Nights experience at Bab Al Shams; 10 cooking stations, Lamb Ouzi", location: "Bab Al Shams Resort" },
      { id: 150, name: "Emirati Hospitality Experience", category: "Cultural Dining", description: "Traditional Emirati dining with cultural immersion", location: "Various locations" },
      { id: 151, name: "Sheikh Mohammed Centre Meals", category: "Cultural Dining", description: "Heritage breakfast, lunch, tea in majlis settings with Q&A", location: "Al Fahidi" },
    ]
  },
  {
    id: "day-trips",
    name: "Day Trips from Dubai",
    count: 15,
    icon: Car,
    gradient: "from-[#02A65C] to-[#6443F4]",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop",
    description: "Explore Abu Dhabi's mega-attractions and the Hajar Mountains",
    attractions: [
      { id: 152, name: "Abu Dhabi City Tour", category: "Cultural", description: "Corniche, Emirates Palace, Qasr Al Watan Presidential Palace", location: "Abu Dhabi" },
      { id: 153, name: "Sheikh Zayed Grand Mosque", category: "Religious", description: "UAE's largest mosque; stunning white marble, Islamic art; 40,000 capacity", location: "Abu Dhabi" },
      { id: 154, name: "Louvre Abu Dhabi", category: "Art Museum", description: "First Louvre outside France; works by Renoir, Monet, Van Gogh", location: "Saadiyat Island" },
      { id: 155, name: "Ferrari World Abu Dhabi", category: "Theme Park", description: "World's fastest coaster (Formula Rossa 240km/h); 37+ rides", location: "Yas Island" },
      { id: 156, name: "Yas Waterworld", category: "Water Park", description: "43 rides, 5 world-first attractions, Wave Pool, Dawama", location: "Yas Island" },
      { id: 157, name: "Warner Bros World Abu Dhabi", category: "Theme Park", description: "29 rides across 6 lands; Batman, Superman, Looney Tunes", location: "Yas Island" },
      { id: 158, name: "SeaWorld Abu Dhabi", category: "Marine Park", description: "Newest addition to Yas Island's attractions", location: "Yas Island" },
      { id: 159, name: "Yas Marina Circuit", category: "Motorsport", description: "F1 Abu Dhabi Grand Prix venue; driving experiences available", location: "Yas Island" },
      { id: 160, name: "Emirates Park Zoo", category: "Wildlife", description: "500+ animals including white lions, Siberian bears", location: "Abu Dhabi" },
      { id: 161, name: "Hatta Mountain Safari", category: "Nature", description: "Hajar Mountains excursion; Hatta Dam, kayaking, mountain biking", location: "Hatta" },
      { id: 162, name: "East Coast Trip", category: "Beach", description: "Fujairah beaches, Khor Fakkan, snorkeling, Bidiyah Mosque", location: "Fujairah/Khor Fakkan" },
      { id: 163, name: "Sharjah Heritage Tour", category: "Cultural", description: "Museum of Islamic Civilization, Blue Souk, Heritage Area", location: "Sharjah" },
      { id: 164, name: "Musandam Fjords (Oman)", category: "Nature", description: "Dhow cruise through dramatic fjords; dolphin watching, snorkeling", location: "Musandam, Oman" },
      { id: 165, name: "Al Ain Garden City", category: "Cultural/Nature", description: "UNESCO sites, Al Ain Oasis, Jebel Hafeet, Al Ain Zoo", location: "Al Ain" },
      { id: 166, name: "RAK Adventure Day", category: "Adventure", description: "Jais Flight zipline, Bear Grylls Explorers Camp, Via Ferrata", location: "Ras Al Khaimah" },
    ]
  },
];

const STATS = [
  { value: "184+", label: "Attractions" },
  { value: "15", label: "Categories" },
  { value: "World's Best", label: "Theme Parks" },
  { value: "Free Entry", label: "Options Available" },
];

const FEATURED_ATTRACTIONS = [
  {
    name: "Burj Khalifa",
    tagline: "World's Tallest Building at 828m",
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=1000&fit=crop",
    tags: ["Iconic", "Must See"],
    label: "Editor's Pick"
  },
  {
    name: "Dubai Fountain",
    tagline: "World's Largest Choreographed Fountain Show",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop",
    tags: ["Free", "Night"],
    label: "Most Loved"
  },
  {
    name: "Desert Safari",
    tagline: "Dune Bashing, Dinner & Bedouin Culture",
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&h=600&fit=crop",
    tags: ["Adventure", "Sunset"],
    label: "First Time Dubai"
  },
  {
    name: "Atlantis Aquaventure",
    tagline: "World's Largest Waterpark with 105+ Slides",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&h=600&fit=crop",
    tags: ["Family", "Thrill"],
    label: null
  },
  {
    name: "Museum of the Future",
    tagline: "Award-Winning Architectural Marvel",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop",
    tags: ["Innovation", "Culture"],
    label: null
  },
  {
    name: "Ain Dubai",
    tagline: "World's Tallest Observation Wheel at 250m",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    tags: ["Views", "Romantic"],
    label: null
  },
];

function CategoryCard({ category }: { category: CategoryData }) {
  const Icon = category.icon;
  
  return (
    <div 
      className="group relative overflow-hidden rounded-xl cursor-default"
      data-testid={`card-category-${category.id}`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h3 className="font-bold text-white text-sm md:text-base mb-1">{category.name}</h3>
        <p className="text-white/80 text-xs md:text-sm">{category.count} attractions</p>
      </div>
    </div>
  );
}

function AttractionCard({ attraction, categoryGradient }: { attraction: Attraction; categoryGradient: string }) {
  return (
    <Card 
      className="group overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300"
      data-testid={`card-attraction-${attraction.id}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryGradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-sm">{attraction.id}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm md:text-base line-clamp-2 mb-1">{attraction.name}</h4>
            <Badge variant="outline" className="text-xs">{attraction.category}</Badge>
          </div>
        </div>
        
        <p className="text-muted-foreground text-xs md:text-sm line-clamp-3 mb-3">
          {attraction.description}
        </p>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{attraction.location}</span>
        </div>
      </div>
    </Card>
  );
}

function FeaturedCard({ 
  attraction, 
  featured = false 
}: { 
  attraction: typeof FEATURED_ATTRACTIONS[0]; 
  featured?: boolean;
}) {
  return (
    <Card 
      className={`group overflow-visible border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-default relative ${
        featured ? 'col-span-1 md:col-span-2 row-span-2' : ''
      }`}
      data-testid={`card-featured-${attraction.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`overflow-hidden rounded-lg ${featured ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <img 
          src={attraction.image} 
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg" />
        
        {attraction.label && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-[#F94498] text-white border-0">
              {attraction.label}
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {attraction.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <h3 className={`font-bold text-white mb-1 ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
            {attraction.name}
          </h3>
          
          <p className="text-white/80 text-xs md:text-sm line-clamp-2">
            {attraction.tagline}
          </p>
        </div>
      </div>
    </Card>
  );
}

function CategorySection({ category }: { category: CategoryData }) {
  const Icon = category.icon;
  const [showAll, setShowAll] = useState(false);
  const displayedAttractions = showAll ? category.attractions : category.attractions.slice(0, 8);
  
  return (
    <section className="py-12 md:py-16" id={category.id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4 mb-8">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
              <Badge variant="secondary" className="text-xs">{category.count} attractions</Badge>
            </div>
            <p className="text-muted-foreground text-sm md:text-base">{category.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedAttractions.map((attraction) => (
            <AttractionCard 
              key={attraction.id} 
              attraction={attraction} 
              categoryGradient={category.gradient}
            />
          ))}
        </div>
        
        {category.attractions.length > 8 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 text-[#6443F4] hover:text-[#573CD0] font-medium transition-colors"
              data-testid={`button-show-${showAll ? 'less' : 'more'}-${category.id}`}
            >
              {showAll ? 'Show Less' : `Show All ${category.count} Attractions`}
              <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function PublicAttractions() {
  const { t, isRTL } = useLocale();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useDocumentMeta({
    title: "184+ Dubai Attractions 2025 - Complete Tourist Guide | Travi",
    description: "Discover all 184+ Dubai tourist attractions across 15 categories. From Burj Khalifa to desert safaris, theme parks to traditional souks - your complete Dubai guide.",
    ogTitle: "Complete Dubai Attractions Catalog 2025 | Travi",
    ogDescription: "Explore 184+ attractions: Theme parks, observation decks, desert adventures, museums, water sports & more.",
    ogType: "website",
  });

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className={`bg-background min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicNav variant="transparent" />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
            alt="Dubai skyline with Burj Khalifa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6443F4]/20 to-[#F94498]/20" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm mb-6 text-sm px-4 py-1.5">
            Complete 2025 Catalog
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Discover <span className="bg-gradient-to-r from-[#FF9327] to-[#F94498] bg-clip-text text-transparent">184+</span> Dubai Attractions
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            From the world's tallest building to ancient souks, thrilling desert safaris to underwater restaurants. 
            Your complete guide to everything Dubai has to offer.
          </p>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center px-4 py-2">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => scrollToCategory('observation-landmarks')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6443F4] to-[#9077EF] text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all"
              data-testid="button-explore-catalog"
            >
              Explore Full Catalog
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
        </div>
      </section>

      <main className="flex-1">
        {/* Category Quick Navigation */}
        <section className="py-8 bg-muted/30 sticky top-20 z-40 backdrop-blur-md border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES_DATA.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                      activeCategory === category.id
                        ? 'bg-[#6443F4] text-white'
                        : 'bg-background border border-border hover:border-[#6443F4]/50 hover:text-[#6443F4]'
                    }`}
                    data-testid={`button-nav-${category.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                    <Badge variant="secondary" className={`text-xs ${activeCategory === category.id ? 'bg-white/20 text-white' : ''}`}>
                      {category.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Attractions */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge className="bg-[#F94498]/10 text-[#F94498] border-[#F94498]/20 mb-4">
                Top Picks
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-3">Featured Attractions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hand-picked must-visit experiences that define Dubai's extraordinary appeal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <FeaturedCard attraction={FEATURED_ATTRACTIONS[0]} featured />
              <div className="grid grid-cols-1 gap-4 md:gap-6 md:col-span-1 lg:col-span-2">
                {FEATURED_ATTRACTIONS.slice(1, 4).map((exp) => (
                  <FeaturedCard key={exp.name} attraction={exp} />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
              {FEATURED_ATTRACTIONS.slice(4, 6).map((exp) => (
                <FeaturedCard key={exp.name} attraction={exp} />
              ))}
            </div>
          </div>
        </section>

        {/* Category Grid Overview */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Browse by Category</h2>
              <p className="text-muted-foreground">15 categories covering every type of Dubai experience</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CATEGORIES_DATA.map((category) => (
                <div 
                  key={category.id} 
                  onClick={() => scrollToCategory(category.id)}
                  className="cursor-pointer"
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Category Sections */}
        {CATEGORIES_DATA.map((category, index) => (
          <div key={category.id} className={index % 2 === 0 ? '' : 'bg-muted/20'}>
            <CategorySection category={category} />
          </div>
        ))}

        {/* Bottom CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-[#6443F4] to-[#F94498]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Ready to Explore Dubai?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              With 184+ attractions across 15 categories, Dubai offers something for everyone. 
              Start planning your perfect Dubai adventure today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/hotels">
                <button className="inline-flex items-center gap-2 bg-white text-[#6443F4] px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-all">
                  Find Hotels
                  <Building2 className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/districts">
                <button className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-all">
                  Explore Districts
                  <MapPin className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
