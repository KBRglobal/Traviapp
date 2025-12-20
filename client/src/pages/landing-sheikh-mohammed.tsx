import { useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ChevronRight, Crown, Building2, Globe, 
  Heart, GraduationCap, Users, Rocket, BookOpen, HandHeart,
  TrendingUp, MapPin, Home, Target, Shield, Feather, 
  Calendar, Medal, Star, Quote, Sword, Building, Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// Stock images
import heroSkylineImg from "@assets/stock_images/dubai_skyline_sunset_ad19a517.jpg";
import skylineImg2 from "@assets/stock_images/dubai_skyline_sunset_e92f9b46.jpg";
import horseImg from "@assets/stock_images/arabian_horse_racing_9d9007ed.jpg";
import uaeFlagImg from "@assets/stock_images/uae_flag_waving_patr_318b83c1.jpg";

// UAE Royal Colors Theme
const uaeColors = {
  green: "#009639",
  white: "#FFFFFF",
  black: "#000000",
  red: "#CE1126",
  gold: "#C9A227",
};

const biographyTimeline = [
  { year: "1949", event: "Born in Al Shindagha, Dubai", detail: "Third son of Sheikh Rashid bin Saeed Al Maktoum" },
  { year: "1955", event: "Began formal education", detail: "Al Ahmedia School, later Al Shaab School" },
  { year: "1966", event: "Studies in England", detail: "Bell School of Languages, Cambridge University" },
  { year: "1968", event: "Head of Dubai Police", detail: "Appointed at age 19, first major public role" },
  { year: "1971", event: "First UAE Minister of Defence", detail: "When UAE was formed on December 2, 1971" },
  { year: "1995", event: "Crown Prince of Dubai", detail: "Designated heir to the Emirate" },
  { year: "2006", event: "Ruler of Dubai", detail: "Vice President and Prime Minister of UAE" },
];

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
  { title: "Emirates Airline", desc: "Founded 1985", detail: "World's largest international airline" },
  { title: "DP World", desc: "Global Ports", detail: "Top 5 port operator worldwide" },
  { title: "DMCC", desc: "Free Zone", detail: "#1 Free Zone for 7 consecutive years" },
  { title: "Jumeirah Group", desc: "Luxury Hotels", detail: "Iconic Burj Al Arab & global properties" },
  { title: "DIFC", desc: "Financial Centre", detail: "4th global financial hub" },
  { title: "Dubai Internet City", desc: "Tech Hub", detail: "Microsoft, Google, Oracle, IBM" },
];

const humanitarianImpact = [
  { icon: GraduationCap, title: "Dubai Cares", value: "21M+", detail: "Children provided education access in 60+ countries" },
  { icon: Heart, title: "Healthcare", value: "114M", detail: "Beneficiaries through medical programs" },
  { icon: BookOpen, title: "Arab Reading Challenge", value: "21M+", detail: "Students participating across 49 countries" },
  { icon: HandHeart, title: "1 Billion Meals", value: "50", detail: "Countries receiving food aid annually" },
];

const poetryVerses = [
  { arabic: "نحن قوم لا تتوسط بنا الهمم", translation: "We are a people whose ambitions know no middle ground", context: "On determination" },
  { arabic: "العين إلي ما شافت ما تدمع", translation: "The eye that has not seen will not weep", context: "On experience" },
  { arabic: "من جد وجد ومن زرع حصد", translation: "He who strives shall find, he who plants shall harvest", context: "On effort" },
];

const equestrianAchievements = [
  { title: "Godolphin Racing", year: "1994", detail: "One of the world's largest racing stables" },
  { title: "Dubai World Cup", year: "1996", detail: "World's richest horse race at $12 million" },
  { title: "Endurance Racing", year: "Multiple", detail: "Personal competitor in international endurance" },
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

      {/* Hero Section with Dubai Skyline */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroSkylineImg} 
            alt="Dubai Skyline at Golden Hour" 
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          {/* UAE Colors accent stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-2 flex">
            <div className="flex-1" style={{ backgroundColor: uaeColors.green }} />
            <div className="flex-1" style={{ backgroundColor: uaeColors.white }} />
            <div className="flex-1" style={{ backgroundColor: uaeColors.black }} />
            <div className="flex-1" style={{ backgroundColor: uaeColors.red }} />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-8">
            <Link href="/" className="hover:text-white transition-colors" data-testid="link-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/dubai" className="hover:text-white transition-colors" data-testid="link-dubai">Dubai</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Sheikh Mohammed bin Rashid</span>
          </div>

          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge 
                className="border-0 px-6 py-2.5 text-base mb-8 text-white"
                style={{ backgroundColor: uaeColors.gold }}
              >
                <Crown className="w-5 h-5 mr-2" />
                Ruler of Dubai Since 2006
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              His Highness{" "}
              <span style={{ color: uaeColors.gold }}>
                Sheikh Mohammed
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl opacity-90">
                bin Rashid Al Maktoum
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-4"
            >
              Vice President and Prime Minister of the United Arab Emirates
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-lg text-white/70 mb-10 max-w-2xl italic"
            >
              "The visionary who transformed a modest trading port into the world's most innovative metropolis"
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl"
            >
              {heroStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="backdrop-blur-md p-4 rounded-xl border border-white/20"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow mx-auto mb-2"
                    style={{ backgroundColor: uaeColors.gold }}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section 
        className="py-16"
        style={{ background: `linear-gradient(135deg, ${uaeColors.green}15, ${uaeColors.gold}10, ${uaeColors.red}05)` }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Quote className="w-12 h-12 mx-auto mb-6 opacity-30" style={{ color: uaeColors.gold }} />
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

      {/* Biography Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 border-0 text-white" style={{ backgroundColor: uaeColors.green }}>
              <Calendar className="w-4 h-4 mr-1" />
              Life Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              From Al Shindagha to World Leadership
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Born July 15, 1949, to Sheikh Rashid bin Saeed Al Maktoum and Sheikha Latifa bint Hamdan Al Nahyan
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 via-amber-500 to-red-500 hidden md:block" />
            
            <div className="space-y-8">
              {biographyTimeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row gap-4 md:gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div 
                      className="inline-block px-4 py-1 rounded-full text-white text-sm font-bold mb-2"
                      style={{ backgroundColor: uaeColors.gold }}
                    >
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.event}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{item.detail}</p>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border-4 border-white shadow-lg z-10 hidden md:block"
                    style={{ backgroundColor: uaeColors.gold }}
                  />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Military Service Section */}
      <section className="py-20 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={uaeFlagImg} alt="UAE Flag" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-slate-900/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 border-0 text-white" style={{ backgroundColor: uaeColors.red }}>
              <Shield className="w-4 h-4 mr-1" />
              Military Service
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Defender of the Nation
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              35 years as UAE's first Minister of Defence, establishing the Union Defense Force
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: uaeColors.red }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">1968</h3>
                <p className="text-slate-300">Head of Dubai Police & Public Security at age 19</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: uaeColors.green }}
                >
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">1971</h3>
                <p className="text-slate-300">First Minister of Defence upon UAE formation</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: uaeColors.gold }}
                >
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">1990</h3>
                <p className="text-slate-300">Led coalition efforts during Gulf War humanitarian operations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Poetry & Personal Interests */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Poetry Section */}
            <div>
              <Badge className="mb-4 border-0 text-white" style={{ backgroundColor: uaeColors.gold }}>
                <Feather className="w-4 h-4 mr-1" />
                Nabati Poet
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                The Poet Ruler
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Writing under pseudonyms "Nedawi" and "Saleet", His Highness is a celebrated Nabati poet, 
                preserving and elevating traditional Arabic poetry to new generations.
              </p>

              <div className="space-y-6">
                {poetryVerses.map((verse, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border-r-4"
                    style={{ borderRightColor: uaeColors.gold }}
                  >
                    <p className="text-lg font-arabic text-slate-800 dark:text-slate-200 mb-2" dir="rtl">
                      {verse.arabic}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{verse.translation}"</p>
                    <p className="text-sm text-amber-600 mt-2">{verse.context}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Equestrian Section */}
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <img 
                  src={horseImg} 
                  alt="Arabian Horse Racing" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="mb-2 border-0 text-white" style={{ backgroundColor: uaeColors.green }}>
                    Equestrian Legacy
                  </Badge>
                  <h3 className="text-2xl font-bold text-white">Passion for Horses</h3>
                </div>
              </div>

              <div className="space-y-4">
                {equestrianAchievements.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${uaeColors.green}20` }}
                    >
                      <Star className="w-6 h-6" style={{ color: uaeColors.green }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <Badge variant="secondary" className="text-xs">{item.year}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Vision */}
      <section ref={achievementsRef} className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 border-0 text-white" style={{ backgroundColor: '#6C5CE7' }}>
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
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #6C5CE7, #EC4899)' }}
                      >
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 border-0 text-white" style={{ backgroundColor: uaeColors.green }}>
                <TrendingUp className="w-4 h-4 mr-1" />
                Economic Powerhouse
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                From Desert to Financial Capital
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Dubai hosts 200,000+ registered companies and attracts AED 38 billion+ in FDI annually. 
                His Highness founded Emirates Airlines, DP World, and the Jumeirah Group, 
                transforming Dubai into a global business hub.
              </p>
              
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={skylineImg2} 
                  alt="Dubai Business District" 
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {economicMilestones.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mb-2">{item.desc}</p>
                  <p className="text-sm font-medium" style={{ color: uaeColors.green }}>{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Space Exploration */}
      <section className="py-20 bg-gradient-to-b from-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-indigo-500 border-0 text-white">
              <Rocket className="w-4 h-4 mr-1" />
              Space Exploration
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Reaching for the Stars
            </h2>
            <p className="text-indigo-200 max-w-2xl mx-auto">
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
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
              >
                <div className="text-xs text-indigo-300 font-medium mb-2">{item.date}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-indigo-200">{item.detail}</p>
              </motion.div>
            ))}
          </div>

          <motion.blockquote 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="mt-12 text-center text-lg md:text-xl text-indigo-100 italic max-w-3xl mx-auto"
          >
            "To the people of the UAE, the Arab and Islamic worlds: We have delivered our message to space. This mission is a message of hope for millions of young Arabs."
            <span className="block mt-2 text-sm text-indigo-300 not-italic">On Mars Mission arrival, February 9, 2021</span>
          </motion.blockquote>
        </div>
      </section>

      {/* Humanitarian Impact */}
      <section ref={humanitarianRef} className="py-20 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 border-0 text-white" style={{ backgroundColor: uaeColors.red }}>
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
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `linear-gradient(135deg, ${uaeColors.red}, #F97316)` }}
                >
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
            <Badge className="mb-4 border-0 text-white" style={{ backgroundColor: '#00BCD4' }}>
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
                <div className="text-xs font-medium mb-2" style={{ color: '#00BCD4' }}>{item.year}</div>
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
                <Quote className="w-8 h-8 mb-4 opacity-30" style={{ color: uaeColors.gold }} />
                <blockquote className="text-lg text-white italic mb-3">"{item.quote}"</blockquote>
                <p className="text-sm" style={{ color: uaeColors.gold }}>{item.context}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dubai 2040 Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 border-0 text-white" style={{ backgroundColor: uaeColors.gold }}>
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
              <div className="text-4xl font-bold mb-2" style={{ color: uaeColors.gold }}>60%</div>
              <p className="text-slate-600 dark:text-slate-400">Nature reserves and recreation</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold mb-2" style={{ color: uaeColors.gold }}>400%</div>
              <p className="text-slate-600 dark:text-slate-400">Increase in public beaches</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold mb-2" style={{ color: uaeColors.gold }}>5.8M</div>
              <p className="text-slate-600 dark:text-slate-400">Population by 2040</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA with UAE Colors */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${uaeColors.green}, ${uaeColors.gold})` }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Experience the Vision
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Discover the Dubai that Sheikh Mohammed built. From iconic landmarks to world-class hospitality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/attractions">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90" data-testid="button-explore-attractions">
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
