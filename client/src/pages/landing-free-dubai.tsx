import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, MapPin, Camera, Sparkles, Sun, Bird, Clock, 
  ChevronRight, Star, Download, ArrowRight, 
  TreePalm, Building2, Music, Heart, ThumbsUp, ThumbsDown,
  Users, Wallet, Trophy, CheckCircle2, Play, Bike,
  Ship, Train, X, FileText, Gift, Lock, ChevronLeft,
  Smartphone, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// Selected preview attractions (teaser - not all)
const previewBeaches = [
  {
    name: "JBR Beach",
    subtitle: "Dubai's Crown Jewel",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    features: ["Blue Flag Certified", "Free Showers", "24/7 Lifeguards"],
    savings: "AED 150-500",
  },
  {
    name: "Kite Beach",
    subtitle: "The Active Paradise",
    image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=800",
    features: ["14km Running Track", "Beach Volleyball", "Burj Al Arab Views"],
    savings: "AED 200+",
  },
];

const previewAttractions = [
  { name: "Dubai Fountain", icon: Music, desc: "World's largest fountain - 140m jets", savings: "AED 149-379" },
  { name: "Dubai Marina Walk", icon: Building2, desc: "7km promenade with 200+ skyscrapers", savings: "AED 200+" },
  { name: "Palm Boardwalk", icon: TreePalm, desc: "11km around Palm Jumeirah", savings: "AED 1,295" },
  { name: "Heritage Village", icon: MapPin, desc: "Traditional Emirati village", savings: "Free" },
];

const lockedCategories = [
  { title: "All 7 Beaches", count: "7 beaches", icon: Waves },
  { title: "Skyline Views", count: "15+ spots", icon: Building2 },
  { title: "Heritage & Culture", count: "12 sites", icon: MapPin },
  { title: "Parks & Nature", count: "10 parks", icon: TreePalm },
  { title: "Sports & Activities", count: "8 activities", icon: Bike },
  { title: "Art & Entertainment", count: "10 galleries", icon: Camera },
];

// Hero stats
const heroStats = [
  { icon: Wallet, value: "AED 2,500+", label: "Save Per Week" },
  { icon: Waves, value: "7", label: "Free Beaches" },
  { icon: Sparkles, value: "70+", label: "Free Activities" },
  { icon: Camera, value: "50+", label: "Photo Spots" },
];

// Itinerary preview
const dayOnePreview = [
  { time: "6:30 AM", activity: "Sunrise at Kite Beach", icon: Sun },
  { time: "10:00 AM", activity: "Heritage Walk Al Fahidi", icon: MapPin },
  { time: "6:00 PM", activity: "Dubai Fountain Show", icon: Music },
];

// Questionnaire questions data
const question1Options = [
  "I'm looking for an experience",
  "I'm looking for comfort", 
  "I'm looking for value",
  "I'm looking for simplicity",
  "I'm looking for luxury"
];

const question2Options = [
  "Choose quickly",
  "Compare a lot",
  "Get confused",
  "Delay the decision",
  "Let others decide"
];

const question3Options = [
  "Local, non-touristy places",
  "Famous iconic things",
  "Food and culinary",
  "Shopping",
  "Nature and walking",
  "Culture and art"
];

const question4Options = [
  "An organized list",
  "By area",
  "By style",
  "By \"most popular\"",
  "I prefer to discover on my own"
];

const question6Options = [
  "People I know",
  "Lots of reviews",
  "Official sources",
  "Content creators",
  "Gut feeling"
];

const question7Options = [
  "Plan ahead",
  "Mix planning and flow",
  "Go with the flow completely",
  "Changes based on mood"
];

const question8Options = [
  "Emotion",
  "Comfort",
  "Efficiency",
  "Uniqueness",
  "Quiet"
];

const swipeCards = [
  { id: 1, text: "\"Top 10\" lists" },
  { id: 2, text: "Secret recommendations" },
  { id: 3, text: "Crowded places" },
  { id: 4, text: "Quiet places" },
  { id: 5, text: "Budget experiences" },
  { id: 6, text: "Premium experiences" },
];

const question10Options = [
  "Crowds",
  "Lack of authenticity",
  "Wasting time",
  "Prices",
  "Too many options",
  "Almost nothing"
];

const question11Options = [
  "Love them a lot",
  "Sometimes",
  "Indifferent",
  "Prefer to choose myself"
];

export default function LandingFreeDubai() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0); // 0 = intro
  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    q3: [] as string[],
    q4: "",
    q5: 3,
    q6: [] as string[],
    q7: "",
    q8: "",
    q9: {} as Record<number, "like" | "dislike">,
    q10: [] as string[],
    q11: "",
    q12: "",
    email: "",
    agreeTerms: false,
    agreeMarketing: false,
  });
  const [currentSwipeCard, setCurrentSwipeCard] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const beachesRef = useRef<HTMLDivElement>(null);
  const attractionsRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "70+ Free Things to Do in Dubai 2025 - Complete Guide | Save AED 2,500+ Every Week",
    description: "Dubai on AED 0: 7 free beaches, 500 flamingos, AED 1 abra rides, 11km Palm boardwalk, nightly fountain shows. Complete guide to 70+ free Dubai experiences.",
    ogType: "article"
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const totalQuestions = 14; // intro + 12 questions + email/finish

  const handleMultiSelect = (key: "q3" | "q6" | "q10", value: string, max: number) => {
    setFormData(prev => {
      const current = prev[key];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      } else if (current.length < max) {
        return { ...prev, [key]: [...current, value] };
      }
      return prev;
    });
  };

  const handleSwipe = (like: boolean) => {
    const cardId = swipeCards[currentSwipeCard].id;
    setFormData(prev => ({
      ...prev,
      q9: { ...prev.q9, [cardId]: like ? "like" : "dislike" }
    }));
    
    if (currentSwipeCard < swipeCards.length - 1) {
      setCurrentSwipeCard(prev => prev + 1);
    } else {
      // All cards swiped, move to next question
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (formData.agreeTerms && formData.email) {
      setFormSubmitted(true);
      console.log("Form submitted:", formData);
    }
  };

  const canProceed = () => {
    switch(currentQuestion) {
      case 0: return true; // Intro
      case 1: return !!formData.q1;
      case 2: return !!formData.q2;
      case 3: return formData.q3.length > 0 && formData.q3.length <= 2;
      case 4: return !!formData.q4;
      case 5: return true; // Slider always has value
      case 6: return formData.q6.length > 0 && formData.q6.length <= 2;
      case 7: return !!formData.q7;
      case 8: return !!formData.q8;
      case 9: return Object.keys(formData.q9).length === swipeCards.length;
      case 10: return formData.q10.length > 0 && formData.q10.length <= 2;
      case 11: return !!formData.q11;
      case 12: return !!formData.q12;
      case 13: return !!formData.email && formData.agreeTerms && formData.agreeMarketing;
      default: return true;
    }
  };

  const renderQuestion = () => {
    switch(currentQuestion) {
      case 0: // Intro
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Before downloading, we'd love to ask a few quick questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              No right or wrong answers - this takes less than a minute.
            </p>
            <Button
              onClick={() => setCurrentQuestion(1)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-6 text-lg rounded-full"
            >
              Let's Start
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        );

      case 1: // Q1 - Looking for
        return (
          <motion.div key="q1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 1 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">What describes you best?</h3>
            <div className="space-y-2">
              {question1Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q1 === option ? "default" : "outline"}
                  className={`w-full justify-start text-left py-4 h-auto ${formData.q1 === option ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => setFormData({ ...formData, q1: option })}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 2: // Q2 - Many options
        return (
          <motion.div key="q2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 2 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">When there are many options, you usually:</h3>
            <div className="space-y-2">
              {question2Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q2 === option ? "default" : "outline"}
                  className={`w-full justify-start text-left py-4 h-auto ${formData.q2 === option ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => setFormData({ ...formData, q2: option })}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 3: // Q3 - Multi select (up to 2)
        return (
          <motion.div key="q3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 3 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">What attracts you most in general?</h3>
            <p className="text-sm text-slate-500">Select up to 2</p>
            <div className="grid grid-cols-2 gap-2">
              {question3Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q3.includes(option) ? "default" : "outline"}
                  className={`justify-start text-left py-3 h-auto text-sm ${formData.q3.includes(option) ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => handleMultiSelect("q3", option, 2)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 4: // Q4 - Recommendations
        return (
          <motion.div key="q4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 4 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">How do you prefer to receive recommendations?</h3>
            <div className="space-y-2">
              {question4Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q4 === option ? "default" : "outline"}
                  className={`w-full justify-start text-left py-4 h-auto ${formData.q4 === option ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => setFormData({ ...formData, q4: option })}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 5: // Q5 - Slider
        return (
          <motion.div key="q5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 5 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">How important is it to find free things?</h3>
            <div className="px-4 py-8">
              <Slider
                value={[formData.q5]}
                onValueChange={(v) => setFormData({ ...formData, q5: v[0] })}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-4 text-sm text-slate-500">
                <span>Not important</span>
                <span className="text-2xl font-bold text-emerald-500">{formData.q5}</span>
                <span>Very important</span>
              </div>
            </div>
          </motion.div>
        );

      case 6: // Q6 - Trust multi select
        return (
          <motion.div key="q6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 6 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">What makes you trust a recommendation?</h3>
            <p className="text-sm text-slate-500">Select up to 2</p>
            <div className="grid grid-cols-2 gap-2">
              {question6Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q6.includes(option) ? "default" : "outline"}
                  className={`justify-start text-left py-3 h-auto text-sm ${formData.q6.includes(option) ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => handleMultiSelect("q6", option, 2)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 7: // Q7 - Planning style
        return (
          <motion.div key="q7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 7 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">How do you usually manage your trips?</h3>
            <div className="space-y-2">
              {question7Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q7 === option ? "default" : "outline"}
                  className={`w-full justify-start text-left py-4 h-auto ${formData.q7 === option ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => setFormData({ ...formData, q7: option })}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 8: // Q8 - Experience priority
        return (
          <motion.div key="q8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 8 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">What matters most to you in an experience?</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {question8Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q8 === option ? "default" : "outline"}
                  className={`py-6 h-auto text-center ${formData.q8 === option ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => setFormData({ ...formData, q8: option })}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 9: // Q9 - Swipe cards
        return (
          <motion.div key="q9" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 9 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">Like or Dislike?</h3>
            <p className="text-sm text-slate-500 text-center">Card {currentSwipeCard + 1} of {swipeCards.length}</p>
            
            <div className="relative h-48 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSwipeCard}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-8 text-center shadow-xl w-full max-w-xs"
                >
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">
                    {swipeCards[currentSwipeCard].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-8">
              <Button
                size="lg"
                variant="outline"
                className="w-20 h-20 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-500"
                onClick={() => handleSwipe(false)}
              >
                <ThumbsDown className="w-8 h-8 text-red-500" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-20 h-20 rounded-full border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-500"
                onClick={() => handleSwipe(true)}
              >
                <ThumbsUp className="w-8 h-8 text-emerald-500" />
              </Button>
            </div>
          </motion.div>
        );

      case 10: // Q10 - Annoying multi select
        return (
          <motion.div key="q10" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 10 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">What annoys you the most?</h3>
            <p className="text-sm text-slate-500">Select up to 2</p>
            <div className="grid grid-cols-2 gap-2">
              {question10Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q10.includes(option) ? "default" : "outline"}
                  className={`justify-start text-left py-3 h-auto text-sm ${formData.q10.includes(option) ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => handleMultiSelect("q10", option, 2)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 11: // Q11 - Personalized
        return (
          <motion.div key="q11" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Question 11 of 12</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">How much do you like personalized recommendations?</h3>
            <div className="space-y-2">
              {question11Options.map(option => (
                <Button
                  key={option}
                  variant={formData.q11 === option ? "default" : "outline"}
                  className={`w-full justify-start text-left py-4 h-auto ${formData.q11 === option ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => setFormData({ ...formData, q11: option })}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 12: // Q12 - Final intuitive
        return (
          <motion.div key="q12" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Last Question!</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">Which one are you more?</h3>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant={formData.q12 === "expect" ? "default" : "outline"}
                className={`py-8 h-auto text-lg ${formData.q12 === "expect" ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white" : ""}`}
                onClick={() => setFormData({ ...formData, q12: "expect" })}
              >
                I like to know what to expect
              </Button>
              <Button
                variant={formData.q12 === "surprise" ? "default" : "outline"}
                className={`py-8 h-auto text-lg ${formData.q12 === "surprise" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : ""}`}
                onClick={() => setFormData({ ...formData, q12: "surprise" })}
              >
                I like to be surprised
              </Button>
            </div>
          </motion.div>
        );

      case 13: // Email + Agreements
        return (
          <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">We're launching an app soon!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Turn yourself into your own travel agent with AI learning. Plan trips yourself, get up to 100% cashback from agent commissions, and earn from choices you're already making.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-base">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="mt-1 h-12 text-base"
                />
                <p className="text-xs text-slate-500 mt-1">We'll only use this for app launch updates</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked === true })}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                    I agree to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-600 hover:underline">Data Usage Policy</Link>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeMarketing: checked === true })}
                    className="mt-1"
                  />
                  <label htmlFor="marketing" className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                    I agree to receive email updates about the app launch and service
                    <span className="text-red-500 ml-1">*</span>
                    <br />
                    <span className="text-xs text-slate-400">(You can unsubscribe anytime)</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-cyan-600 transition-colors" data-testid="link-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">Free Things to Do</span>
          </div>

          <div className="text-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 px-6 py-2.5 text-base mb-8">
                <Trophy className="w-5 h-5 mr-2" />
                2025 Ultimate Free Dubai Guide
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Dubai Costs{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500">
                AED 0
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto"
            >
              Complete a quick survey and get instant access to our <strong className="text-emerald-600">complete 70+ locations guide</strong> with maps, tips, and metro routes.
            </motion.p>

            {/* CTA to Questionnaire */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-10 max-w-xl mx-auto"
            >
              <div className="flex items-center gap-3 justify-center mb-3">
                <Gift className="w-6 h-6 text-emerald-500" />
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  Get the Complete Free PDF Guide
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                Answer a quick 1-minute survey and download the full guide with all 70+ free locations.
              </p>
              <Button 
                size="lg"
                onClick={() => setShowQuestionnaire(true)}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-6 text-lg rounded-full shadow-xl shadow-cyan-500/25 w-full sm:w-auto"
                data-testid="button-start-survey"
              >
                <FileText className="w-5 h-5 mr-2" />
                Start Survey & Get Free Guide
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto"
            >
              {heroStats.map((stat, index) => (
                <div key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/50 dark:border-slate-700/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow mx-auto mb-2">
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

      {/* Preview Beaches Section */}
      <section ref={beachesRef} className="py-16" data-testid="section-beaches">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-0 mb-4">
              <Waves className="w-4 h-4 mr-2" />
              Preview: 2 of 7 Beaches
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              The FREE Beaches of Dubai
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Here's a taste. Complete the survey to unlock all 7 beaches with detailed tips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {previewBeaches.map((beach, index) => (
              <motion.div
                key={beach.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-0 shadow-xl">
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img src={beach.image} alt={beach.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-xl font-bold text-white mb-0.5">{beach.name}</h3>
                      <p className="text-cyan-200 text-sm">{beach.subtitle}</p>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-emerald-500/90 text-white border-0 text-xs">FREE</Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {beach.features.map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                      <Wallet className="w-4 h-4" />
                      Save {beach.savings}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Locked Content Teaser */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">5 more beaches waiting for you</p>
                <p className="text-xs text-slate-500">Including secret Black Palace Beach</p>
              </div>
            </div>
            <Button onClick={() => setShowQuestionnaire(true)} size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full w-full sm:w-auto">
              Unlock Full Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Flamingo Highlight */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500" data-testid="section-flamingos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white order-2 md:order-1">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <Bird className="w-4 h-4 mr-2" />
                Dubai's Hidden Gem
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                500 Flamingos at Sunset
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                At Ras Al Khor Wildlife Sanctuary, watch over 500 Greater Flamingos in their 
                natural habitat—completely free.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Free Entry", "Free Binoculars", "Free Parking", "170+ Bird Species"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowQuestionnaire(true)} className="bg-white text-rose-600 hover:bg-white/90 px-6 py-5 rounded-full shadow-xl w-full sm:w-auto">
                <Download className="w-5 h-5 mr-2" />
                Get Full Location Guide
              </Button>
            </div>
            <div className="relative order-1 md:order-2">
              <img src="https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=800" alt="Flamingos" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-rose-500">500+</div>
                <div className="text-xs text-slate-500">Flamingos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dubai Fountain */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" data-testid="section-fountain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800" alt="Dubai Fountain" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-indigo-500">22K</div>
                <div className="text-xs text-slate-500">Gallons/Show</div>
              </div>
            </div>
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <Music className="w-4 h-4 mr-2" />
                World's Largest
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                The Dubai Fountain
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                22,000 gallons of water shooting 140 meters high. Shows every 30 minutes from 6pm-11pm.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["140m Jets", "Every 30 min", "6pm-11pm", "Free Views"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowQuestionnaire(true)} className="bg-white text-indigo-600 hover:bg-white/90 px-6 py-5 rounded-full shadow-xl w-full sm:w-auto">
                <MapPin className="w-5 h-5 mr-2" />
                Get Best Viewing Spots
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Abra Ride */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" data-testid="section-abra">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white order-2 md:order-1">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <Ship className="w-4 h-4 mr-2" />
                World's Cheapest
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                AED 1 Abra Ride
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                Cross Dubai Creek on a traditional wooden abra boat for just AED 1. Dubai's oldest transport.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Only AED 1", "5am-Midnight", "No Booking", "Authentic"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowQuestionnaire(true)} className="bg-white text-amber-600 hover:bg-white/90 px-6 py-5 rounded-full shadow-xl w-full sm:w-auto">
                <Download className="w-5 h-5 mr-2" />
                Get Creek Tour Map
              </Button>
            </div>
            <div className="relative order-1 md:order-2">
              <img src="https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=800" alt="Abra Boat" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-amber-500">AED 1</div>
                <div className="text-xs text-slate-500">Per Ride</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Attractions */}
      <section ref={attractionsRef} className="py-16 bg-slate-50 dark:bg-slate-800/50" data-testid="section-attractions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Preview: 4 of 70+ Activities
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Free Skyline Experiences
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {previewAttractions.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{item.desc}</p>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">
                      Save {item.savings}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Locked Categories */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 text-center flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Full Guide Categories
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {lockedCategories.map((cat) => (
                <div key={cat.title} className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg opacity-60">
                  <cat.icon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <div className="font-medium text-slate-600 dark:text-slate-300 text-xs">{cat.title}</div>
                  <div className="text-xs text-slate-400">{cat.count}</div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button onClick={() => setShowQuestionnaire(true)} size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full">
                <FileText className="w-4 h-4 mr-2" />
                Complete Survey to Unlock
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
            </div>
            
            <CardContent className="relative p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Get Your Complete Free Guide
              </h2>
              <p className="text-base text-slate-300 max-w-lg mx-auto mb-6">
                Complete a quick 1-minute survey and instantly download the full PDF with all 70+ locations and maps.
              </p>
              
              <Button 
                size="lg"
                onClick={() => setShowQuestionnaire(true)}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-6 text-lg rounded-full shadow-xl shadow-cyan-500/25 w-full sm:w-auto"
                data-testid="button-final-cta"
              >
                <Gift className="w-5 h-5 mr-2" />
                Start Survey & Get Free Guide
              </Button>
              
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  70+ Locations
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Printable Maps
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Instant Download
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Questionnaire Dialog - Mobile Optimized */}
      <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
          {formSubmitted ? (
            <div className="text-center py-10 px-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your Guide is Ready!</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Thank you for completing the survey.</p>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-6 text-lg rounded-full w-full">
                <Download className="w-5 h-5 mr-2" />
                Download PDF Guide
              </Button>
              <p className="text-sm text-slate-500 mt-4">We've also sent a copy to {formData.email}</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-slate-900 border-b px-4 py-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  {currentQuestion > 0 && currentQuestion !== 9 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentQuestion(prev => prev - 1)}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  )}
                  {currentQuestion > 0 && (
                    <span className="text-sm text-slate-500">{currentQuestion} / 13</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuestionnaire(false)}
                  className="h-8 w-8"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Progress bar */}
              {currentQuestion > 0 && (
                <div className="h-1 bg-slate-200 dark:bg-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 p-5">
                <AnimatePresence mode="wait">
                  {renderQuestion()}
                </AnimatePresence>
              </div>

              {/* Footer with Next button */}
              {currentQuestion > 0 && currentQuestion !== 9 && (
                <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t p-4">
                  <Button
                    onClick={() => {
                      if (currentQuestion === 13) {
                        handleSubmit();
                      } else {
                        setCurrentQuestion(prev => prev + 1);
                      }
                    }}
                    disabled={!canProceed()}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-6 rounded-full text-lg"
                  >
                    {currentQuestion === 13 ? (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Download Guide
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PublicFooter />
    </div>
  );
}
