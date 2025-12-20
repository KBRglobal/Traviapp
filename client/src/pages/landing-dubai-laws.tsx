import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Scale, AlertTriangle, Car, Camera, Wine, Pill, Heart, Moon,
  ChevronRight, Shield, Gavel, FileWarning, Ban, Phone, Users,
  MapPin, Clock, CheckCircle2, XCircle, Info, Zap, DollarSign,
  Smartphone, Eye, Lock, Plane, Building2, BadgeAlert, Cigarette,
  Volume2, HandMetal, Waves, Shirt, Calendar, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// Hero stats
const heroStats = [
  { icon: Gavel, value: "420K+", label: "Fines Q1 2023" },
  { icon: DollarSign, value: "AED 50K", label: "Max Traffic Fine" },
  { icon: Ban, value: "0.00%", label: "BAC Limit" },
  { icon: AlertTriangle, value: "4 Years", label: "Drug Min Sentence" },
];

// Traffic fines data
const speedingFines = [
  { over: "Under 20 km/h", fine: "AED 300-600", points: "0", impound: "No", suspension: "No" },
  { over: "20-30 km/h", fine: "AED 600-700", points: "3-6", impound: "No", suspension: "No" },
  { over: "30-40 km/h", fine: "AED 700-1,000", points: "6", impound: "No", suspension: "No" },
  { over: "40-50 km/h", fine: "AED 1,500", points: "12", impound: "15 days", suspension: "3 months" },
  { over: "50-60 km/h", fine: "AED 2,000", points: "23", impound: "30 days", suspension: "6 months" },
  { over: "60+ km/h", fine: "AED 3,000", points: "23", impound: "60 days", suspension: "1 year" },
  { over: "80+ km/h", fine: "CONFISCATION", points: "23", impound: "Forever", suspension: "Permanent" },
];

const dangerousDrivingFines = [
  { offense: "Drifting / Street Racing", fine: "AED 50,000+", points: "23", prison: "Yes", impound: "60 days" },
  { offense: "Reckless Driving (Death)", fine: "AED 100,000", points: "23", prison: "Mandatory", impound: "Confiscation" },
  { offense: "Running Red Light", fine: "AED 1,000", points: "12", prison: "No", impound: "30 days possible" },
  { offense: "Drunk Driving", fine: "AED 50,000", points: "23", prison: "3+ months", impound: "60 days" },
  { offense: "Using Phone", fine: "AED 800", points: "4", prison: "No", impound: "No" },
  { offense: "No Seatbelt", fine: "AED 400", points: "4", prison: "No", impound: "No" },
  { offense: "Tailgating", fine: "AED 400", points: "4", prison: "No", impound: "No" },
  { offense: "Driving on Shoulder", fine: "AED 1,000", points: "6", prison: "No", impound: "No" },
];

// Public behavior laws
const publicBehaviorLaws = [
  {
    title: "Displays of Affection (PDA)",
    icon: Heart,
    severity: "high",
    items: [
      { action: "Kissing in public", consequence: "AED 1,000 fine or detention" },
      { action: "Holding hands (unmarried)", consequence: "Technically illegal, varies by location" },
      { action: "Hugging (unmarried couples)", consequence: "Can trigger complaints" },
      { action: "Sexual behavior in public", consequence: "Imprisonment" },
    ]
  },
  {
    title: "Swearing & Gestures",
    icon: HandMetal,
    severity: "critical",
    items: [
      { action: "Swearing in public", consequence: "AED 10,000-50,000 + possible prison" },
      { action: "Middle finger gesture", consequence: "AED 10,000-50,000 fine" },
      { action: "Verbal insults", consequence: "Imprisonment possible" },
      { action: "Public arguments", consequence: "Police intervention + fines" },
    ]
  },
  {
    title: "Public Intoxication",
    icon: Wine,
    severity: "critical",
    items: [
      { action: "Drunk in public", consequence: "Arrest + AED 2,000+ fine" },
      { action: "Vomiting from alcohol", consequence: "Arrest" },
      { action: "Causing disturbances drunk", consequence: "Prison + deportation" },
      { action: "Drinking outside licensed venues", consequence: "Arrest" },
    ]
  },
  {
    title: "Dancing & Music",
    icon: Volume2,
    severity: "medium",
    items: [
      { action: "Public dancing (outside clubs)", consequence: "Violates decency laws" },
      { action: "Loud music after 11pm", consequence: "AED 500-1,000 fine" },
      { action: "Dancing in malls/streets", consequence: "Police attention" },
      { action: "Indecent TikTok videos", consequence: "Arrest possible" },
    ]
  },
];

// Photography laws
const photographyLaws = [
  {
    category: "Strictly Prohibited",
    icon: Ban,
    color: "from-red-500 to-rose-600",
    locations: [
      "Government buildings",
      "Embassies & consulates",
      "Military installations",
      "Police stations",
      "Airport security areas",
      "Seaports",
      "Royal palaces",
      "Oil infrastructure",
    ]
  },
  {
    category: "Requires Permission",
    icon: Info,
    color: "from-amber-500 to-orange-500",
    locations: [
      "Mosque interiors",
      "People in traditional dress",
      "Women and children",
      "Private property",
      "Inside malls (staff may object)",
      "People praying",
    ]
  },
  {
    category: "Generally Allowed",
    icon: CheckCircle2,
    color: "from-emerald-500 to-green-500",
    locations: [
      "Tourist landmarks (exterior)",
      "Public beaches",
      "Parks and gardens",
      "Downtown Dubai skyline",
      "Dubai Marina",
      "Your own group/family",
    ]
  },
];

// Social media offenses
const socialMediaOffenses = [
  { action: "Criticizing UAE government", fine: "AED 250,000-500,000", prison: "Yes" },
  { action: "Criticizing royal family", fine: "AED 500,000+", prison: "Yes" },
  { action: "Posting 'fake news'", fine: "AED 500,000", prison: "Yes" },
  { action: "Defaming individuals online", fine: "AED 500,000", prison: "Yes" },
  { action: "Sharing photos without consent", fine: "AED 500,000", prison: "6 months" },
  { action: "Posting indecent content", fine: "AED 250,000", prison: "Yes" },
  { action: "Using VPN for blocked content", fine: "AED 500,000-2,000,000", prison: "Possible" },
];

// Drug and medication laws
const restrictedMedications = [
  { category: "Painkillers", meds: ["Codeine", "Tramadol", "Morphine", "Oxycodone"] },
  { category: "ADHD Medications", meds: ["Adderall", "Ritalin", "Concerta"] },
  { category: "Anxiety/Sleep Aids", meds: ["Xanax", "Valium", "Ambien", "Temazepam"] },
  { category: "Antidepressants", meds: ["Some SSRIs", "Prozac (sometimes flagged)"] },
];

// Alcohol laws
const alcoholRules = {
  legal: [
    "Hotels and licensed bars",
    "Licensed restaurants",
    "Private residences",
    "Designated venues with license",
  ],
  illegal: [
    "Public beaches",
    "Parks and streets",
    "Car parks",
    "Unlicensed restaurants",
    "Public transport",
    "Desert gatherings (police patrol)",
  ]
};

// Ramadan rules
const ramadanRules = [
  { rule: "Public eating during daylight", status: "Relaxed since 2021 but culturally insensitive" },
  { rule: "Smoking in public", status: "Still illegal during Ramadan daylight" },
  { rule: "Loud music", status: "Banned in most venues (except hotels)" },
  { rule: "Nightclubs", status: "Closed or reduced hours" },
  { rule: "Dress code", status: "Stricter enforcement (shoulders/knees covered)" },
  { rule: "Public affection", status: "Stricter enforcement" },
];

// Famous cases
const famousCases = [
  {
    year: "2018",
    nationality: "British",
    offense: "Called Emirati man 'fucking idiot' in taxi dispute",
    consequence: "3 months imprisonment"
  },
  {
    year: "2019",
    nationality: "British",
    offense: "Called ex-husband's wife 'horse' on Facebook",
    consequence: "Faced imprisonment (dropped after outcry)"
  },
  {
    year: "2008",
    nationality: "British",
    offense: "0.003g cannabis stuck to shoe sole",
    consequence: "4 years imprisonment"
  },
  {
    year: "2018",
    nationality: "Swiss",
    offense: "Poppy seed bread residue in system",
    consequence: "Detained"
  },
  {
    year: "2019",
    nationality: "Dubai resident",
    offense: "CBD oil (legal medical cannabis abroad)",
    consequence: "Deported"
  },
];

export default function LandingDubaiLaws() {
  // Refs for scrolling
  const trafficRef = useRef<HTMLDivElement>(null);
  const behaviorRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const alcoholRef = useRef<HTMLDivElement>(null);
  const drugsRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "Dubai Laws for Tourists 2026 - Complete Traffic Fines & Legal Rules Guide",
    description: "Critical Dubai laws every tourist must know. Traffic fines (AED 400-50,000), drug laws, public behavior, alcohol rules, photography restrictions. One mistake can mean prison or deportation.",
    ogType: "article"
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <PublicNav />

      {/* Hero Section - Dark & Serious */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors" data-testid="link-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/districts" className="hover:text-white transition-colors">Dubai</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Laws & Fines Guide</span>
          </div>

          {/* Main Hero */}
          <div className="text-center max-w-5xl mx-auto">
            {/* Warning Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-red-500 to-amber-500 text-white border-0 px-6 py-2.5 text-base mb-8">
                <AlertTriangle className="w-5 h-5 mr-2" />
                CRITICAL READING - Updated December 2026
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight"
            >
              Dubai Laws &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-yellow-500">
                Traffic Fines
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl sm:text-3xl text-slate-300 mb-8"
            >
              The Complete Guide Every Tourist Must Read
            </motion.p>

            {/* Critical Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 mb-12 max-w-4xl mx-auto"
            >
              <p className="text-lg md:text-xl text-red-100 leading-relaxed">
                <strong className="text-red-400">WARNING:</strong> Dubai operates under a unique hybrid legal system combining 
                <strong className="text-amber-400"> Sharia law</strong> with civil codes. Behaviors considered normal in Western countries 
                can trigger <strong className="text-red-400">immediate detention, heavy fines (AED 1,000-500,000), deportation, and permanent entry bans</strong>. 
                "I didn't know" offers <strong className="text-white">zero legal protection</strong>.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
            >
              {heroStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg mx-auto mb-3">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-amber-500 text-white px-10 py-7 text-lg rounded-full shadow-xl"
                onClick={() => scrollToSection(trafficRef)}
                data-testid="button-traffic-fines"
              >
                <Car className="w-5 h-5 mr-2" />
                Traffic Fines
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full"
                onClick={() => scrollToSection(behaviorRef)}
                data-testid="button-behavior-laws"
              >
                <Users className="w-5 h-5 mr-2" />
                Behavior Laws
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-slate-800/50 sticky top-16 z-30 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="ghost" onClick={() => scrollToSection(trafficRef)} className="text-slate-300 hover:text-white rounded-full">
              <Car className="w-4 h-4 mr-2" />Traffic
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection(behaviorRef)} className="text-slate-300 hover:text-white rounded-full">
              <Users className="w-4 h-4 mr-2" />Behavior
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection(photoRef)} className="text-slate-300 hover:text-white rounded-full">
              <Camera className="w-4 h-4 mr-2" />Photography
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection(alcoholRef)} className="text-slate-300 hover:text-white rounded-full">
              <Wine className="w-4 h-4 mr-2" />Alcohol
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection(drugsRef)} className="text-slate-300 hover:text-white rounded-full">
              <Pill className="w-4 h-4 mr-2" />Drugs & Meds
            </Button>
          </div>
        </div>
      </section>

      {/* Traffic Fines Section */}
      <section ref={trafficRef} className="py-24 bg-slate-900" data-testid="section-traffic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-6 px-6 py-2">
              <Car className="w-5 h-5 mr-2" />
              1,000+ Speed Cameras
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Traffic Fines & Violations
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Dubai has one of the world's most heavily monitored road networks. Fines are issued automatically 
              and <span className="text-red-400 font-semibold">must be paid before leaving the country</span>.
            </p>
          </div>

          {/* Speeding Fines Table */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500" />
              Speeding Fines
            </h3>
            <Card className="border-0 bg-slate-800/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Speed Over Limit</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Fine</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Black Points</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Impound</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">License</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {speedingFines.map((fine, index) => (
                      <tr key={index} className={fine.over === "80+ km/h" ? "bg-red-500/20" : "hover:bg-slate-700/30"}>
                        <td className="px-6 py-4 text-white font-medium">{fine.over}</td>
                        <td className={`px-6 py-4 font-bold ${fine.fine === "CONFISCATION" ? "text-red-400" : "text-amber-400"}`}>{fine.fine}</td>
                        <td className="px-6 py-4 text-slate-300">{fine.points}</td>
                        <td className="px-6 py-4 text-slate-300">{fine.impound}</td>
                        <td className="px-6 py-4 text-slate-300">{fine.suspension}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Dangerous Driving */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Dangerous Driving Violations
            </h3>
            <Card className="border-0 bg-slate-800/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Offense</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Fine</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Prison</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Impound</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {dangerousDrivingFines.map((fine, index) => (
                      <tr key={index} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 text-white font-medium">{fine.offense}</td>
                        <td className="px-6 py-4 font-bold text-red-400">{fine.fine}</td>
                        <td className="px-6 py-4 text-slate-300">{fine.points}</td>
                        <td className={`px-6 py-4 ${fine.prison !== "No" ? "text-red-400 font-semibold" : "text-slate-300"}`}>{fine.prison}</td>
                        <td className="px-6 py-4 text-slate-300">{fine.impound}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Drunk Driving Highlight */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2">
                  <Ban className="w-5 h-5 mr-2" />
                  World's Strictest
                </Badge>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Zero Tolerance: 0.00% BAC
                </h3>
                <p className="text-xl text-white/90 mb-6">
                  Dubai has the strictest drunk driving laws in the world. <strong>ANY detectable alcohol = arrest</strong>. 
                  Even one beer consumed 4 hours prior can result in prosecution.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>First offense: AED 50,000 + 3 months minimum prison</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>Vehicle impounded 60 days (AED 50,000+ to retrieve)</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>Criminal record + possible deportation</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center">
                <div className="text-8xl font-bold mb-4">0.00%</div>
                <div className="text-xl text-white/80">Legal Blood Alcohol Limit</div>
                <div className="mt-6 text-sm text-white/60">
                  Police conduct random breath tests at checkpoints and accident scenes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Behavior Section */}
      <section ref={behaviorRef} className="py-24 bg-slate-800/50" data-testid="section-behavior">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6 px-6 py-2">
              <Users className="w-5 h-5 mr-2" />
              Strictly Enforced
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Public Behavior Regulations
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Behaviors that are completely normal in Western countries can lead to arrest, fines, 
              and deportation in Dubai. Ignorance is not a defense.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {publicBehaviorLaws.map((law, index) => (
              <motion.div
                key={law.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full border-0 ${law.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : law.severity === 'high' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-700/50'}`}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl ${law.severity === 'critical' ? 'bg-red-500' : law.severity === 'high' ? 'bg-amber-500' : 'bg-slate-600'} flex items-center justify-center`}>
                        <law.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{law.title}</CardTitle>
                        <Badge className={`mt-1 ${law.severity === 'critical' ? 'bg-red-500/20 text-red-400' : law.severity === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600 text-slate-300'} border-0`}>
                          {law.severity === 'critical' ? 'Critical' : law.severity === 'high' ? 'High Risk' : 'Medium Risk'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {law.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-white font-medium">{item.action}</div>
                            <div className="text-sm text-red-400">{item.consequence}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photography & Social Media Section */}
      <section ref={photoRef} className="py-24 bg-slate-900" data-testid="section-photo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-6 px-6 py-2">
              <Camera className="w-5 h-5 mr-2" />
              AED 500,000 Max Fine
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Photography & Social Media
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Photographing people without consent can result in <span className="text-red-400 font-semibold">AED 500,000 fine + 6 months imprisonment</span>. 
              Social media posts are monitored.
            </p>
          </div>

          {/* Photography Zones */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {photographyLaws.map((zone, index) => (
              <motion.div
                key={zone.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 bg-slate-800/50">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${zone.color} flex items-center justify-center mb-4`}>
                      <zone.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{zone.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {zone.locations.map((loc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-300">
                          <zone.icon className="w-4 h-4 shrink-0" />
                          <span>{loc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Social Media Crimes */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <Smartphone className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Social Media Criminal Offenses</h3>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                What you post online is monitored. These posts can lead to imprisonment.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialMediaOffenses.map((offense, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-xl rounded-xl p-4">
                  <div className="font-semibold mb-2">{offense.action}</div>
                  <div className="text-sm text-white/80">
                    <span className="text-amber-300 font-bold">{offense.fine}</span>
                    {offense.prison !== "No" && <span className="text-red-300"> + Prison</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alcohol Section */}
      <section ref={alcoholRef} className="py-24 bg-slate-800/50" data-testid="section-alcohol">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6 px-6 py-2">
              <Wine className="w-5 h-5 mr-2" />
              Minimum Age 21
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Alcohol Laws
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Alcohol is legal in Dubai but <span className="text-amber-400 font-semibold">strictly regulated</span>. 
              Drinking in the wrong place leads to arrest.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Legal */}
            <Card className="border-0 bg-emerald-500/10 border-emerald-500/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">Where It's Legal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alcoholRules.legal.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Illegal */}
            <Card className="border-0 bg-red-500/10 border-red-500/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center">
                    <XCircle className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">Where It's Illegal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alcoholRules.illegal.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Drugs & Medication Section */}
      <section ref={drugsRef} className="py-24 bg-slate-900" data-testid="section-drugs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-6 px-6 py-2">
              <Pill className="w-5 h-5 mr-2" />
              Zero Tolerance
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Drugs & Medication Laws
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              UAE has the <span className="text-red-400 font-semibold">world's strictest drug laws</span>. 
              Any detectable amount = 4-year minimum prison. Trafficking = death penalty.
            </p>
          </div>

          {/* Critical Drug Warning */}
          <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-8 md:p-12 text-white mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-center">Critical Drug Facts</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">4 Years</div>
                <div className="text-sm text-white/80">Minimum prison for ANY amount</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">Death</div>
                <div className="text-sm text-white/80">Penalty for trafficking</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">0.003g</div>
                <div className="text-sm text-white/80">Cannabis = 4 year sentence (real case)</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">Blood Test</div>
                <div className="text-sm text-white/80">Traces from abroad = arrest</div>
              </div>
            </div>
          </div>

          {/* Restricted Medications */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FileWarning className="w-6 h-6 text-amber-500" />
              Restricted Medications (Require MoHAP Approval)
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {restrictedMedications.map((cat, index) => (
                <Card key={index} className="border-0 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-amber-400 text-lg">{cat.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {cat.meds.map((med, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-300">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="text-sm">{med}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Famous Cases */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Scale className="w-6 h-6 text-red-500" />
              Real Cases - This Happens to Tourists
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {famousCases.map((caseItem, index) => (
                <Card key={index} className="border-0 bg-red-500/10 border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-slate-700 text-slate-300 border-0">{caseItem.year}</Badge>
                      <Badge className="bg-amber-500/20 text-amber-400 border-0">{caseItem.nationality}</Badge>
                    </div>
                    <p className="text-slate-300 mb-3">{caseItem.offense}</p>
                    <div className="text-red-400 font-semibold">{caseItem.consequence}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ramadan Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600" data-testid="section-ramadan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2">
                <Moon className="w-5 h-5 mr-2" />
                Holy Month Rules
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ramadan Observance
              </h2>
              <p className="text-xl text-white/90 mb-8">
                During Ramadan (March-April), additional restrictions apply. 
                While rules have relaxed since 2021, cultural sensitivity remains essential.
              </p>
              <div className="space-y-3">
                {ramadanRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/20 backdrop-blur-xl rounded-xl px-4 py-3">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{rule.rule}</div>
                      <div className="text-sm text-white/70">{rule.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center text-white">
              <Calendar className="w-20 h-20 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">2026 Ramadan Dates</h3>
              <div className="text-5xl font-bold mb-2">Feb 28 - Mar 29</div>
              <p className="text-white/70">(Approximate - dates confirmed annually)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Warning CTA */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <AlertTriangle className="w-20 h-20 text-amber-500 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Knowledge is Your Protection
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto">
            Dubai is an incredible destination, but its legal system is fundamentally different from Western countries. 
            Understanding these laws ensures a safe, enjoyable visit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-7 text-lg rounded-full shadow-xl"
              onClick={() => scrollToSection(trafficRef)}
            >
              <Car className="w-5 h-5 mr-2" />
              Review Traffic Laws
            </Button>
            <Link href="/dubai/free-things-to-do">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full"
              >
                <Waves className="w-5 h-5 mr-2" />
                Free Things to Do
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
