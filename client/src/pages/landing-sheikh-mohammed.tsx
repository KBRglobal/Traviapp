import { useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ChevronRight, Crown, Building2, Globe, 
  Heart, GraduationCap, Users, Rocket, BookOpen, HandHeart,
  TrendingUp, MapPin, Home, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

const heroStats = [
  { icon: Users, value: "17M+", label: "Annual Tourists" },
  { icon: Globe, value: "200+", label: "Nationalities" },
  { icon: Building2, value: "#4", label: "Most Visited City" },
  { icon: TrendingUp, value: "828m", label: "Burj Khalifa" },
];

const architecturalAchievements = [
  { title: "Burj Khalifa", desc: "World's tallest building at 828 meters. Revitalized Downtown Dubai into AED 70 billion district.", stats: "4-5M annual visitors" },
  { title: "Palm Jumeirah", desc: "World's largest man-made island visible from space. 94 million cubic meters of sand.", stats: "Doubled Dubai coastline" },
  { title: "Dubai Metro", desc: "World's longest fully automated metro network spanning 75 kilometers.", stats: "200M+ annual riders" },
  { title: "Dubai International Airport", desc: "World's busiest international airport. Direct flights to 85% of world's population.", stats: "88M+ passengers annually" },
  { title: "Dubai Marina", desc: "World's largest man-made marina with 200+ skyscrapers.", stats: "7km promenade" },
  { title: "Ain Dubai", desc: "World's tallest observation wheel at 250 meters on Bluewaters Island.", stats: "48 capsules" },
];

const economicMilestones = [
  { title: "DMCC", desc: "Dubai Multi Commodities Centre", detail: "World's #1 Free Zone for 7 consecutive years" },
  { title: "JAFZA", desc: "Jebel Ali Free Zone", detail: "Middle East's largest free zone" },
  { title: "Dubai Internet City", desc: "Tech Hub", detail: "Hosts Microsoft, Google, Oracle, IBM" },
  { title: "DIFC", desc: "Financial Centre", detail: "4th global financial hub" },
  { title: "Dubai Healthcare City", desc: "Medical Free Zone", detail: "Largest medical free zone globally" },
  { title: "Dubai Media City", desc: "Media Hub", detail: "Regional HQ for CNN, BBC, MBC" },
];

const humanitarianImpact = [
  { icon: GraduationCap, title: "Dubai Cares", value: "21M+", detail: "Children provided education access in 60+ countries" },
  { icon: Heart, title: "Healthcare", value: "114M", detail: "Beneficiaries through medical programs" },
  { icon: BookOpen, title: "Arab Reading Challenge", value: "21M+", detail: "Students participating across 49 countries" },
  { icon: HandHeart, title: "1 Billion Meals", value: "50", detail: "Countries receiving food aid annually" },
];

const visionaryQuotes = [
  { quote: "The leader is the one who serves his people, not the one who is served by them.", context: "On leadership philosophy" },
  { quote: "We will not wait for things to happen. We will make them happen.", context: "On Palm Jumeirah" },
  { quote: "In the race to the future, second place means nothing. Dubai will be first.", context: "On Smart Dubai initiative" },
  { quote: "The UAE is a home for everyone, built on tolerance, compassion, and coexistence.", context: "On multiculturalism" },
];

const spaceAchievements = [
  { title: "Hope Mars Mission", date: "Feb 9, 2021", detail: "UAE became 5th nation to reach Mars" },
  { title: "Hazzaa AlMansoori", date: "2019", detail: "First Emirati astronaut in space" },
  { title: "Sultan AlNeyadi", date: "2023", detail: "Longest Arab space mission (6 months)" },
  { title: "Mars 2117", date: "Vision", detail: "Building a city on Mars within 100 years" },
];

const toleranceInitiatives = [
  { title: "Ministry of Tolerance", year: "2016", detail: "World's first dedicated tolerance ministry" },
  { title: "Year of Tolerance", year: "2019", detail: "National initiative celebrating diversity" },
  { title: "Abrahamic Family House", year: "2023", detail: "Mosque, church, synagogue sharing one foundation" },
  { title: "UAE Tolerance Law", year: "2019", detail: "Criminalizing religious/ethnic discrimination" },
];

export default function LandingSheikhMohammed() {
  const achievementsRef = useRef<HTMLDivElement>(null);
  const humanitarianRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "Sheikh Mohammed bin Rashid Al Maktoum - Dubai's Visionary Leader | Travi",
    description: "Complete tribute to Sheikh Mohammed bin Rashid Al Maktoum, Vice President of UAE, Prime Minister, and Ruler of Dubai. His vision transformed a desert into the world's most innovative city.",
    ogType: "article"
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-purple-400/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-amber-600 transition-colors" data-testid="link-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/dubai" className="hover:text-amber-600 transition-colors" data-testid="link-dubai">Dubai</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">Sheikh Mohammed bin Rashid</span>
          </div>

          <div className="text-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-6 py-2.5 text-base mb-8">
                <Crown className="w-5 h-5 mr-2" />
                Ruler of Dubai Since 2006
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Sheikh Mohammed{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500">
                bin Rashid
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-4 max-w-3xl mx-auto"
            >
              Vice President and Prime Minister of the United Arab Emirates
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-base md:text-lg text-slate-500 dark:text-slate-500 mb-10 max-w-2xl mx-auto italic"
            >
              The visionary who transformed a modest trading port into a global metropolis
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10"
            >
              {heroStats.map((stat, index) => (
                <div key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/50 dark:border-slate-700/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow mx-auto mb-2">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-16 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 dark:from-amber-500/5 dark:via-yellow-500/5 dark:to-orange-500/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.blockquote 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 italic"
          >
            "The tower represents more than just steel and concrete. It represents the ability of human beings to dream, to achieve, and to reach beyond limitations."
          </motion.blockquote>
          <p className="mt-4 text-slate-500">On the Burj Khalifa, 2004</p>
        </div>
      </section>

      {/* Architectural Vision */}
      <section ref={achievementsRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
              <Building2 className="w-4 h-4 mr-1" />
              Building the Impossible
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Architectural Vision
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Under Sheikh Mohammed's leadership, Dubai has become home to the world's most iconic structures
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {architecturalAchievements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.desc}</p>
                    <Badge variant="secondary" className="text-xs">
                      {item.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Economic Transformation */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 mb-4">
              <TrendingUp className="w-4 h-4 mr-1" />
              Economic Powerhouse
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              From Desert to Financial Capital
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Dubai hosts 200,000+ registered companies and attracts AED 38 billion+ in FDI annually
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {economicMilestones.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{item.desc}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Space Exploration */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mb-4">
              <Rocket className="w-4 h-4 mr-1" />
              Space Exploration
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Reaching for the Stars
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              UAE became the 5th nation to reach Mars under Sheikh Mohammed's vision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spaceAchievements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-700"
              >
                <div className="text-xs text-indigo-500 font-medium mb-2">{item.date}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.detail}</p>
              </motion.div>
            ))}
          </div>

          <motion.blockquote 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="mt-12 text-center text-lg md:text-xl text-slate-700 dark:text-slate-300 italic max-w-3xl mx-auto"
          >
            "To the people of the UAE, the Arab and Islamic worlds: We have delivered our message to space. This mission is a message of hope for millions of young Arabs."
            <span className="block mt-2 text-sm text-slate-500 not-italic">On Mars Mission arrival, February 9, 2021</span>
          </motion.blockquote>
        </div>
      </section>

      {/* Humanitarian Impact */}
      <section ref={humanitarianRef} className="py-20 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 mb-4">
              <Heart className="w-4 h-4 mr-1" />
              Humanitarian Leadership
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Giving Back to the World
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              AED 6.8 billion annually distributed through humanitarian programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {humanitarianImpact.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{item.value}</div>
                <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.detail}</p>
              </motion.div>
            ))}
          </div>

          <motion.p 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="mt-12 text-center text-lg text-slate-700 dark:text-slate-300 italic"
          >
            "Giving is not measured by what we possess, but by what we give from our hearts."
          </motion.p>
        </div>
      </section>

      {/* Tolerance & Coexistence */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 mb-4">
              <Globe className="w-4 h-4 mr-1" />
              Beacon of Tolerance
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              A Home for Everyone
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              200+ nationalities living peacefully under one vision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {toleranceInitiatives.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="text-xs text-cyan-500 font-medium mb-2">{item.year}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visionary Quotes */}
      <section className="py-20 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Words of Wisdom
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {visionaryQuotes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 p-6 rounded-xl border border-slate-700"
              >
                <blockquote className="text-lg text-white italic mb-3">"{item.quote}"</blockquote>
                <p className="text-sm text-amber-400">{item.context}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dubai 2040 Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-4">
              <Target className="w-4 h-4 mr-1" />
              Dubai 2040
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Urban Master Plan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              "We aspire to make Dubai the world's best city to live in, work in and visit. The comprehensive plan we approved for the city embodies our vision for a sustainable, pioneering, and prosperous future for generations to come."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-amber-500 mb-2">60%</div>
              <p className="text-slate-600 dark:text-slate-400">Nature reserves and recreation</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-amber-500 mb-2">400%</div>
              <p className="text-slate-600 dark:text-slate-400">Increase in public beaches</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-amber-500 mb-2">5.8M</div>
              <p className="text-slate-600 dark:text-slate-400">Population by 2040</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Experience the Vision
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Discover the Dubai that Sheikh Mohammed built. From iconic landmarks to world-class hospitality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/attractions">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90" data-testid="button-explore-attractions">
                <MapPin className="w-5 h-5 mr-2" />
                Explore Attractions
              </Button>
            </Link>
            <Link href="/hotels">
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10" data-testid="button-find-hotels">
                <Home className="w-5 h-5 mr-2" />
                Find Hotels
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
