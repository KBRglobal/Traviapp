import { Search, Building2, Mountain, Landmark, BookOpen, Utensils, Bus, Lightbulb, Compass, ArrowRight, Sparkles, Menu } from "lucide-react";
import { useState } from "react";

const imgImage = "https://www.figma.com/api/mcp/asset/405fd11a-0d66-485a-8bfc-0a87dcf39696";
const imgImage1 = "https://www.figma.com/api/mcp/asset/81e2d17b-d2cd-4ff3-9786-ee654b04037a";
const imgImage2 = "https://www.figma.com/api/mcp/asset/75aff459-1155-4526-9e9c-d5370cc7d7c9";
const imgImage3 = "https://www.figma.com/api/mcp/asset/6cda54bf-0c87-423d-b9ac-7bc9d088bbd1";
const imgGroup1000007941 = "https://www.figma.com/api/mcp/asset/9591896e-0d82-4ec4-b0be-7fa80b7ddc89";
const imgGroup47 = "https://www.figma.com/api/mcp/asset/3f9a6114-31fb-4ef6-93de-681f21bf4b3b";
const imgGroup48 = "https://www.figma.com/api/mcp/asset/eb2c53d1-f6df-4038-8e21-ee0637ce9137";
const imgGroup33 = "https://www.figma.com/api/mcp/asset/9f5220f9-18b3-4413-a5c9-173fed9f42f7";
const imgGroup34 = "https://www.figma.com/api/mcp/asset/662ea7a5-8efe-434f-98b9-8a3ceacb961b";
const imgBigDataAnalytics1 = "https://www.figma.com/api/mcp/asset/2f1a79c1-a91e-4b59-9a91-247961099723";
const imgCyborg1 = "https://www.figma.com/api/mcp/asset/6646c10d-3d0d-4973-bd99-54abe2d37af1";
const imgGrowthAudience1 = "https://www.figma.com/api/mcp/asset/de082f84-a0cf-4183-b601-343cb16e8255";

const exploreCategories = [
  { icon: Building2, title: "Dubai Hotels", subtitle: "Find your perfect stay" },
  { icon: Mountain, title: "Dubai Attractions", subtitle: "Must-see sights" },
  { icon: Landmark, title: "Dubai Areas & Districts", subtitle: "Explore neighborhoods" },
  { icon: BookOpen, title: "Dubai Travel Guides", subtitle: "In-depth handbooks" },
  { icon: Utensils, title: "Culture & Food in Dubai", subtitle: "Savor local experiences" },
  { icon: Bus, title: "Transportation in Dubai", subtitle: "Getting around made easy" },
  { icon: Lightbulb, title: "Dubai Travel Tips & Safety", subtitle: "Smart advice for journeys" },
  { icon: Compass, title: "Comparisons", subtitle: "Side-by-side analysis" },
];

const todayCards = [
  {
    image: imgImage,
    title: "Climbing the Heights: Burj Khalifa's Latest Innovations",
    description: "Explore the architectural marvels and new visitor experiences at the world's tallest building.",
    bgColor: "bg-[#f0edfe]",
  },
  {
    image: imgImage1,
    title: "Desert Safaris: Thrills and Tranquility in Dubai's Sands",
    description: "From dune bashing to traditional Bedouin camps, find your perfect desert escapade.",
    bgColor: "bg-[#fff5ea]",
  },
  {
    image: imgImage2,
    title: "A Culinary Journey: Discovering Dubai's Diverse",
    description: "Taste the best of local and international cuisine with our curated guide to Dubai's food scene.",
    bgColor: "bg-[#e6f9ff]",
  },
  {
    image: imgImage3,
    title: "Palm Jumeirah: An Island Paradise Unveiled",
    description: "Dive into the opulent hotels, beaches, and entertainment on Dubai's man-made island.",
    bgColor: "bg-[#e6f7ef]",
  },
];

const knowledgeItems = [
  {
    icon: imgBigDataAnalytics1,
    iconBg: "bg-[#ffedf5]",
    title: "Most Searched Dubai Hotels",
    description: "Aggregating vast datasets from diverse global sources, ensuring comprehensive and real-time coverage.",
  },
  {
    icon: imgCyborg1,
    iconBg: "bg-[#fff5ea]",
    title: "Most Asked Questions About Dubai",
    description: "Advanced machine learning models process and analyze data, generating highly accurate future predictions.",
  },
  {
    icon: imgGrowthAudience1,
    iconBg: "bg-[#e6f9ff]",
    title: "Most Searched Dubai Attractions",
    description: "Translating complex data into clear, actionable recommendations for strategic planning and operational excellence.",
  },
];

export default function PublicHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-[1408px] border border-[rgba(87,60,208,0.1)] rounded-full px-4 sm:px-8 py-2 sm:py-3 bg-white/80 backdrop-blur-md flex items-center justify-between gap-2" data-testid="nav-header">
        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 text-[#582898]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8 text-[#582898] font-medium">
          <a href="#" className="hover:opacity-80" data-testid="link-hotels">Hotels</a>
          <a href="#" className="hover:opacity-80" data-testid="link-experiences">Experiences</a>
          <a href="#" className="hover:opacity-80" data-testid="link-news">News</a>
        </div>

        {/* Logo - centered on mobile, left-aligned on desktop */}
        <div className="flex items-center gap-1 sm:gap-2">
          <img src={imgGroup48} alt="Travi Logo Icon" className="h-8 sm:h-12 w-auto" />
          <img src={imgGroup33} alt="Travi Logo Text" className="h-6 sm:h-10 w-auto hidden sm:block" />
        </div>

        {/* CTA button */}
        <button className="bg-[#fdcd0a] rounded-full flex items-center gap-1 sm:gap-3 pl-2 sm:pl-4 pr-0.5 sm:pr-1 py-0.5 sm:py-1 hover:opacity-90 transition" data-testid="button-travi-app">
          <span className="text-[#573cd0] font-medium text-xs sm:text-sm whitespace-nowrap">Travi app</span>
          <div className="bg-[#573cd0] rounded-full p-1.5 sm:p-2.5 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-[rgba(87,60,208,0.1)] p-4 lg:hidden">
          <div className="flex flex-col gap-3 text-[#582898] font-medium">
            <a href="#" className="py-2 px-4 hover:bg-[#f0edfe] rounded-lg" data-testid="link-hotels-mobile">Hotels</a>
            <a href="#" className="py-2 px-4 hover:bg-[#f0edfe] rounded-lg" data-testid="link-experiences-mobile">Experiences</a>
            <a href="#" className="py-2 px-4 hover:bg-[#f0edfe] rounded-lg" data-testid="link-news-mobile">News</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-[#6443f4] pt-20 sm:pt-24 pb-32 sm:pb-40 lg:pb-48 min-h-[500px] sm:min-h-[600px] lg:min-h-[785px] overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-52 bg-[#775bf1]" />
        <img src={imgGroup1000007941} alt="" className="absolute bottom-0 left-0 w-full min-w-[1200px] pointer-events-none opacity-80" />
        <img src={imgGroup47} alt="Dubai Character" className="absolute bottom-0 left-0 w-48 sm:w-72 lg:w-[483px] pointer-events-none hidden sm:block" />
        
        <div className="relative z-10 flex flex-col items-center pt-8 sm:pt-16 lg:pt-20 text-white px-4">
          <div className="bg-white/10 border border-white rounded-full px-3 py-2 flex items-center gap-2 mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Dubai Travel Experience</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[120px] xl:text-[150px] font-semibold text-center leading-[0.9] sm:leading-[0.86] tracking-[-2px] sm:tracking-[-4px] lg:tracking-[-9px] max-w-5xl" style={{ fontFamily: "'Chillax', sans-serif" }}>
            Discover Dubai by experience
          </h1>
        </div>

        {/* Search Bar - responsive positioning */}
        <div className="relative z-20 mt-8 sm:mt-12 lg:mt-16 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-[12px_15.6px_42px_0px_rgba(0,0,0,0.09)] backdrop-blur-md border-2 border-black/10 h-14 sm:h-16 lg:h-[72px] flex items-center px-4 sm:px-6 gap-3 sm:gap-4">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-black/50 shrink-0" />
            <input
              type="text"
              placeholder="Search experiences..."
              className="flex-1 text-base sm:text-xl lg:text-2xl text-black placeholder:text-black/50 bg-transparent outline-none min-w-0"
              data-testid="input-search"
            />
            <button className="bg-[#f8a900] rounded-md w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center hover:opacity-90 transition shrink-0" data-testid="button-search">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Today in Dubai Section */}
      <section className="bg-white rounded-[20px] mx-2 sm:mx-4 -mt-8 sm:-mt-12 relative z-10 px-4 sm:px-8 lg:px-14 py-10 sm:py-16 lg:py-20" data-testid="section-today">
        <div className="mb-6 sm:mb-10">
          <span className="inline-block bg-[rgba(100,67,244,0.1)] text-[#6443f4] px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 sm:mb-4">
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#171a1f]" style={{ fontFamily: "'Chillax', sans-serif" }}>
            Today in Dubai
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayCards.map((card, index) => (
            <article
              key={index}
              className={`${card.bgColor} border-2 border-[#24103e] rounded-[21px] shadow-[0px_4px_0px_0px_#24103e] p-4 sm:p-6 flex flex-col items-center gap-6 sm:gap-10 hover:-translate-y-1 transition-transform cursor-pointer`}
              data-testid={`card-today-${index}`}
            >
              <div className="w-full max-w-[264px] h-[140px] sm:h-[160px] overflow-hidden rounded-lg">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-normal text-[#171a1f] leading-snug sm:leading-[25px] mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  {card.title}
                </h3>
                <p className="text-sm text-[#565d6d] leading-5">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Explore Section */}
      <section className="bg-[#6443f4] rounded-[20px] mx-2 sm:mx-4 mt-4 px-4 sm:px-8 lg:px-16 py-10 sm:py-16 relative overflow-hidden" data-testid="section-explore">
        <div className="relative z-10">
          <div className="flex justify-center mb-8 sm:mb-16">
            <span className="inline-block bg-[rgba(100,67,244,0.1)] text-[#e2d9fc] px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wide">
              Explore
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-[1280px] mx-auto">
            {exploreCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={index}
                  className="bg-transparent border border-white rounded-2xl h-[140px] sm:h-[160px] lg:h-[180px] flex flex-col items-center justify-center px-3 sm:px-4 hover:bg-white/10 transition-colors cursor-pointer"
                  data-testid={`card-explore-${index}`}
                >
                  <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-3 sm:mb-4" strokeWidth={1.5} />
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white text-center" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 text-center mt-1 hidden sm:block">
                    {category.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Knowledge Hub Section */}
      <section className="bg-white rounded-[20px] mx-2 sm:mx-4 mt-4 px-4 sm:px-8 lg:px-14 py-10 sm:py-16 lg:py-20 flex flex-col lg:flex-row gap-8 lg:gap-16" data-testid="section-knowledge">
        <div className="lg:w-[491px] lg:shrink-0">
          <span className="inline-block bg-[#e2d9fc] text-[#6443f4] px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 sm:mb-4">
            Insights
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[56px] leading-tight lg:leading-none" style={{ fontFamily: "'Chillax', sans-serif" }}>
            <span className="text-[#665878]">Dive in into</span>
            <br />
            <span className="text-[#6443f4]">the Knowledge hub</span>
          </h2>
        </div>

        <div className="flex-1 flex flex-col gap-4 sm:gap-5">
          {knowledgeItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-5" data-testid={`card-knowledge-${index}`}>
              <div className="text-[#6443f4] font-semibold text-base sm:text-lg w-8 sm:w-12 shrink-0">
                0{index + 1}
              </div>
              <div className="flex-1 bg-white border-2 border-[#24103e] rounded-[20px] shadow-[0px_4px_0px_0px_#24103e] p-4 sm:p-6 flex items-center gap-4 sm:gap-5 hover:-translate-y-0.5 transition-transform cursor-pointer">
                <div className={`${item.iconBg} rounded-[14px] w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shrink-0`}>
                  <img src={item.icon} alt="" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-semibold text-[#171a1f] mb-1 sm:mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#5b4c6e] leading-snug sm:leading-[1.2] line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dubai Pilot Project Section */}
      <section className="mx-2 sm:mx-4 mt-4 mb-8 py-10 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-4 sm:px-8" data-testid="section-pilot">
        <div className="w-full max-w-md lg:max-w-none lg:w-[633px] lg:shrink-0">
          <img src={imgGroup34} alt="Travi Mascot" className="w-full h-auto" />
        </div>
        <div className="flex-1 max-w-[488px] text-center lg:text-left">
          <p className="text-xl sm:text-2xl lg:text-[28px] text-[#6443f4] font-semibold leading-tight lg:leading-[0.9] mb-3 sm:mb-4" style={{ fontFamily: "'Chillax', sans-serif" }}>
            Dubai Pilot Project
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[56px] text-black font-semibold leading-tight lg:leading-[0.9] mb-6 sm:mb-8" style={{ fontFamily: "'Chillax', sans-serif" }}>
            Enhancing Tourism Strategy
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-black font-medium leading-relaxed lg:leading-none mx-auto lg:mx-0 max-w-[330px]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            TRAVI Insights partnered with Dubai Tourism Authority to optimize their seasonal marketing campaigns and infrastructure planning.
          </p>
        </div>
      </section>
    </div>
  );
}
