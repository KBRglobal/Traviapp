import { PageContainer } from "@/components/public-layout";
import { SEOHead } from "@/components/seo-head";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import mascotImg from "@assets/Mascot_for_Light_Background_1765497703861.png";
import { MapPin, Heart, Globe, Users, Compass, Star } from "lucide-react";

export default function PublicAbout() {
  const { t } = useLocale();

  const values = [
    {
      icon: Heart,
      title: "Passion for Dubai",
      description: "We're passionate about sharing the magic of Dubai with travelers from around the world."
    },
    {
      icon: Globe,
      title: "Local Expertise",
      description: "Our team includes Dubai residents who know every hidden gem and local secret."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We build connections between travelers and the vibrant Dubai community."
    },
    {
      icon: Compass,
      title: "Authentic Experiences",
      description: "We focus on authentic, memorable experiences beyond the typical tourist trail."
    }
  ];

  return (
    <PageContainer>
      <SEOHead
        title="About Travi | Your Dubai Travel Guide"
        description="Learn about Travi - your friendly guide to Dubai's wonders. Discover our mission to help travelers explore the magic of this extraordinary city."
        keywords={["about travi", "dubai travel guide", "dubai tourism", "travel platform"]}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-travi-purple/10 via-background to-travi-pink/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t('about.title') || "About Travi"}
              </h1>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {t('about.subtitle') || "Your friendly guide to Dubai's wonders. From iconic landmarks to hidden gems, we help you discover the magic of this extraordinary city."}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Travi was created with a simple mission: to make exploring Dubai accessible, enjoyable, and unforgettable for every traveler. Whether you're planning your first visit or you're a seasoned Dubai enthusiast, we're here to help you make the most of your journey.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img 
                src={mascotImg} 
                alt="Travi mascot" 
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('about.missionTitle') || "Our Mission"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We believe that every traveler deserves access to the best information, tips, and insights about Dubai. Our mission is to be your trusted companion, providing comprehensive guides, honest recommendations, and up-to-date information to help you create lasting memories in this remarkable city.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={index} 
                  className="text-center p-6 rounded-lg bg-background border border-border"
                  data-testid={`value-card-${index}`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-travi-purple/10 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-travi-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Dubai Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-travi-orange" />
                <span className="text-sm font-medium text-travi-orange uppercase tracking-wide">
                  Why Dubai
                </span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                A City Like No Other
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Dubai is a city of superlatives - home to the world's tallest building, largest shopping mall, and most luxurious hotels. But beyond the glitz and glamour lies a rich cultural heritage, diverse cuisine scene, and warm hospitality that makes visitors feel right at home.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From the historic Al Fahidi district to the futuristic Dubai Frame, from traditional souks to modern beach clubs, Dubai offers experiences for every type of traveler. And we're here to help you discover them all.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "15M+", label: "Annual Visitors" },
                  { stat: "200+", label: "Nationalities" },
                  { stat: "1000+", label: "Restaurants" },
                  { stat: "365", label: "Days of Sunshine" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg bg-gradient-to-br from-travi-purple/5 to-travi-pink/5 border border-border text-center"
                  >
                    <div className="text-3xl font-bold text-travi-purple mb-1">
                      {item.stat}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-travi-purple to-travi-pink">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Star className="w-12 h-12 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Dubai Adventure
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Ready to explore? Browse our guides, discover attractions, and plan your perfect Dubai trip with Travi.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}
