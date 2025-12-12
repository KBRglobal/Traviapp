import { Link } from "wouter";
import { ArrowLeft, Calculator, Hotel, Utensils, Car, Ticket, Plus, Minus, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const hotelOptions = [
  { id: "budget", name: "Budget", pricePerNight: 150, desc: "3-star hotels, comfortable stays" },
  { id: "midrange", name: "Mid-Range", pricePerNight: 350, desc: "4-star hotels, great amenities" },
  { id: "luxury", name: "Luxury", pricePerNight: 800, desc: "5-star resorts, premium experience" },
  { id: "ultra", name: "Ultra Luxury", pricePerNight: 2000, desc: "World-class suites, exclusive service" },
];

const diningOptions = [
  { id: "budget", name: "Budget", pricePerDay: 50, desc: "Street food & casual dining" },
  { id: "moderate", name: "Moderate", pricePerDay: 120, desc: "Nice restaurants, varied cuisine" },
  { id: "premium", name: "Premium", pricePerDay: 250, desc: "Fine dining experiences" },
];

const transportOptions = [
  { id: "public", name: "Public Transport", pricePerDay: 15, desc: "Metro, bus, tram" },
  { id: "taxi", name: "Taxis/Rideshare", pricePerDay: 80, desc: "Uber, Careem, Dubai Taxi" },
  { id: "rental", name: "Car Rental", pricePerDay: 150, desc: "Freedom to explore" },
  { id: "chauffeur", name: "Private Driver", pricePerDay: 400, desc: "Luxury chauffeur service" },
];

const activities = [
  { id: "burj", name: "Burj Khalifa At The Top", price: 180 },
  { id: "safari", name: "Desert Safari", price: 80 },
  { id: "aquarium", name: "Dubai Aquarium", price: 60 },
  { id: "dhow", name: "Dhow Cruise Dinner", price: 90 },
  { id: "museum", name: "Museum of the Future", price: 150 },
  { id: "palm", name: "Palm Jumeirah Tour", price: 100 },
  { id: "gold", name: "Gold Souk Tour", price: 0 },
  { id: "miracle", name: "Miracle Garden", price: 55 },
];

const currencies: Record<string, { symbol: string; rate: number }> = {
  AED: { symbol: "د.إ", rate: 1 },
  USD: { symbol: "$", rate: 0.2723 },
  EUR: { symbol: "€", rate: 0.2519 },
  GBP: { symbol: "£", rate: 0.2165 },
  ILS: { symbol: "₪", rate: 1.0000 },
};

export default function PublicBudget() {
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [hotelType, setHotelType] = useState("midrange");
  const [diningType, setDiningType] = useState("moderate");
  const [transportType, setTransportType] = useState("taxi");
  const [selectedActivities, setSelectedActivities] = useState<string[]>(["burj", "safari"]);
  const [displayCurrency, setDisplayCurrency] = useState("AED");
  const [total, setTotal] = useState(0);

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    const hotel = hotelOptions.find(h => h.id === hotelType);
    const dining = diningOptions.find(d => d.id === diningType);
    const transport = transportOptions.find(t => t.id === transportType);
    
    const hotelCost = (hotel?.pricePerNight || 0) * days;
    const diningCost = (dining?.pricePerDay || 0) * days * travelers;
    const transportCost = (transport?.pricePerDay || 0) * days;
    const activitiesCost = selectedActivities.reduce((sum, actId) => {
      const activity = activities.find(a => a.id === actId);
      return sum + ((activity?.price || 0) * travelers);
    }, 0);

    setTotal(hotelCost + diningCost + transportCost + activitiesCost);
  }, [days, travelers, hotelType, diningType, transportType, selectedActivities]);

  const formatPrice = (aedAmount: number) => {
    const { symbol, rate } = currencies[displayCurrency];
    const converted = aedAmount * rate;
    return `${symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const hotel = hotelOptions.find(h => h.id === hotelType);
  const dining = diningOptions.find(d => d.id === diningType);
  const transport = transportOptions.find(t => t.id === transportType);

  return (
    <div className="bg-background min-h-screen">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors">Attractions</Link>
              <Link href="/tools/budget" className="text-primary font-medium">Budget</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors">Articles</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-[#7c3aed] via-[#8b5cf6] to-[#c4b5fd] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTAgMzBoNjAiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0zMCAwdjYwIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="absolute top-5 right-10 w-36 h-36 bg-[#ddd6fe] rounded-full blur-3xl opacity-25" />
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#4c1d95] rounded-full blur-3xl opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ddd6fe] to-[#8b5cf6] flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-[#4c1d95]" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">Dubai Trip Budget Calculator</h1>
              <p className="text-white/90">Plan your perfect Dubai vacation costs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">1</span>
                  Trip Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Number of Days: {days}</label>
                    <Slider
                      value={[days]}
                      onValueChange={(v) => setDays(v[0])}
                      min={1}
                      max={21}
                      step={1}
                      className="mt-2"
                      data-testid="slider-days"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 day</span>
                      <span>21 days</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">Travelers</label>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        data-testid="button-minus-travelers"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-2xl font-bold w-12 text-center">{travelers}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setTravelers(Math.min(10, travelers + 1))}
                        data-testid="button-plus-travelers"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">2</span>
                  <Hotel className="w-5 h-5" />
                  Accommodation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hotelOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setHotelType(option.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        hotelType === option.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`option-hotel-${option.id}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{option.name}</span>
                        <span className="text-sm font-semibold text-primary">{formatPrice(option.pricePerNight)}/night</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">3</span>
                  <Utensils className="w-5 h-5" />
                  Dining
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {diningOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setDiningType(option.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        diningType === option.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`option-dining-${option.id}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{option.name}</span>
                        <span className="text-sm font-semibold text-primary">{formatPrice(option.pricePerDay)}/day</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">4</span>
                  <Car className="w-5 h-5" />
                  Transportation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {transportOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setTransportType(option.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        transportType === option.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`option-transport-${option.id}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{option.name}</span>
                        <span className="text-sm font-semibold text-primary">{formatPrice(option.pricePerDay)}/day</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">5</span>
                  <Ticket className="w-5 h-5" />
                  Activities (per person)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      onClick={() => toggleActivity(activity.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedActivities.includes(activity.id)
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`option-activity-${activity.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <span className="font-medium block">{activity.name}</span>
                          <span className="text-sm text-primary font-semibold">
                            {activity.price === 0 ? "Free" : formatPrice(activity.price)}
                          </span>
                        </div>
                        {selectedActivities.includes(activity.id) && (
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Plus className="w-4 h-4 rotate-45" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="p-6 bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] text-white border-0 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold">Estimated Total</h3>
                  <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                    <SelectTrigger className="w-24 h-8 text-sm bg-white/20 border-white/30 text-white" data-testid="select-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(currencies).map((code) => (
                        <SelectItem key={code} value={code}>{code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-4xl font-bold mb-6" data-testid="text-total">
                  {formatPrice(total)}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-white/80">Accommodation ({days} nights)</span>
                    <span className="font-medium">{formatPrice((hotel?.pricePerNight || 0) * days)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-white/80">Dining ({days} days x {travelers})</span>
                    <span className="font-medium">{formatPrice((dining?.pricePerDay || 0) * days * travelers)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-white/80">Transport ({days} days)</span>
                    <span className="font-medium">{formatPrice((transport?.pricePerDay || 0) * days)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-white/80">Activities ({selectedActivities.length} selected)</span>
                    <span className="font-medium">
                      {formatPrice(selectedActivities.reduce((sum, actId) => {
                        const activity = activities.find(a => a.id === actId);
                        return sum + ((activity?.price || 0) * travelers);
                      }, 0))}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex justify-between text-xs text-white/70 mb-2">
                    <span>Per Person</span>
                    <span>{formatPrice(total / travelers)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Per Day</span>
                    <span>{formatPrice(total / days)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  <Link href="/tools/currency">
                    <Button className="w-full bg-white text-[#7c3aed] hover:bg-white/90" data-testid="link-currency">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Currency Converter
                    </Button>
                  </Link>
                  <Link href="/tools/events">
                    <Button variant="outline" className="w-full border-white/50 text-white hover:bg-white/10" data-testid="link-events">
                      Events Calendar
                    </Button>
                  </Link>
                  <Link href="/tools/plan">
                    <Button variant="outline" className="w-full border-white/50 text-white hover:bg-white/10" data-testid="link-plan">
                      Travel Planning
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> Prices are estimates based on average costs. Actual costs may vary based on season, availability, and specific choices.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo variant="primary" height={28} />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-foreground transition-colors">Attractions</Link>
              <Link href="/tools/budget" className="hover:text-foreground transition-colors">Budget</Link>
              <Link href="/articles" className="hover:text-foreground transition-colors">Articles</Link>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <span>2024 Travi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
