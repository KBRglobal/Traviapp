import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Save,
  Eye,
  Send,
  ArrowLeft,
  GripVertical,
  Trash2,
  Image,
  Type,
  HelpCircle,
  MousePointer,
  LayoutGrid,
  Star,
  Lightbulb,
  Monitor,
  Smartphone,
  X,
  Sparkles,
  Loader2,
  Zap,
  Copy,
  ChevronUp,
  ChevronDown,
  Upload,
  Settings,
  FileText,
  PanelLeft,
  ImagePlus,
  History,
  RotateCcw,
  Check,
} from "lucide-react";
import type {
  ContentWithRelations,
  ContentBlock,
  ContentVersion,
  QuickInfoItem,
  HighlightItem,
  TicketInfoItem,
  EssentialInfoItem,
  RelatedItem
} from "@shared/schema";
import { SeoScore } from "@/components/seo-score";
import { SchemaPreview } from "@/components/schema-preview";
import { AttractionSeoEditor } from "@/components/attraction-seo-editor";
import { HotelSeoEditor } from "@/components/hotel-seo-editor";
import { DiningSeoEditor } from "@/components/dining-seo-editor";
import { DistrictSeoEditor } from "@/components/district-seo-editor";

type ContentType = "attraction" | "hotel" | "article" | "dining" | "district";
// TEMPORARILY DISABLED: "transport" | "event" | "itinerary" - Will be enabled later

interface BlockTypeConfig {
  type: ContentBlock["type"];
  label: string;
  icon: typeof Image;
  description: string;
}

const blockTypes: BlockTypeConfig[] = [
  { type: "hero", label: "Hero", icon: Image, description: "Full-width hero image" },
  { type: "text", label: "Text", icon: Type, description: "Text paragraph" },
  { type: "image", label: "Image", icon: Image, description: "Single image" },
  { type: "gallery", label: "Gallery", icon: LayoutGrid, description: "Image gallery" },
  { type: "faq", label: "FAQ", icon: HelpCircle, description: "Question & answer" },
  { type: "cta", label: "CTA", icon: MousePointer, description: "Call to action button" },
  { type: "info_grid", label: "Info Grid", icon: LayoutGrid, description: "Information grid" },
  { type: "highlights", label: "Highlights", icon: Star, description: "Key highlights" },
  { type: "tips", label: "Tips", icon: Lightbulb, description: "Travel tips" },
];

const defaultTemplateBlocks: ContentBlock[] = [
  { id: "hero-default", type: "hero", data: { image: "", alt: "", title: "" }, order: 0 },
  { id: "intro-default", type: "text", data: { content: "" }, order: 1 },
  { id: "highlights-default", type: "highlights", data: { items: [] }, order: 2 },
  { id: "tips-default", type: "tips", data: { items: [] }, order: 3 },
  { id: "faq-default", type: "faq", data: { question: "", answer: "" }, order: 4 },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export default function ContentEditor() {
  const [, attractionMatch] = useRoute("/admin/attractions/:id");
  const [, hotelMatch] = useRoute("/admin/hotels/:id");
  const [, articleMatch] = useRoute("/admin/articles/:id");
  const [, attractionNewMatch] = useRoute("/admin/attractions/new");
  const [, hotelNewMatch] = useRoute("/admin/hotels/new");
  const [, articleNewMatch] = useRoute("/admin/articles/new");
  const [, diningMatch] = useRoute("/admin/dining/:id");
  const [, diningNewMatch] = useRoute("/admin/dining/new");
  const [, districtMatch] = useRoute("/admin/districts/:id");
  const [, districtNewMatch] = useRoute("/admin/districts/new");
  const [, transportMatch] = useRoute("/admin/transport/:id");
  const [, transportNewMatch] = useRoute("/admin/transport/new");
  const [, eventMatch] = useRoute("/admin/events/:id");
  const [, eventNewMatch] = useRoute("/admin/events/new");
  const [, itineraryMatch] = useRoute("/admin/itineraries/:id");
  const [, itineraryNewMatch] = useRoute("/admin/itineraries/new");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { canPublish } = usePermissions();

  const isNew = !!(attractionNewMatch || hotelNewMatch || articleNewMatch || diningNewMatch || districtNewMatch || transportNewMatch || eventNewMatch || itineraryNewMatch);
  const contentId = isNew ? undefined : (attractionMatch?.id || hotelMatch?.id || articleMatch?.id || diningMatch?.id || districtMatch?.id || transportMatch?.id || eventMatch?.id || itineraryMatch?.id);

  const getContentType = (): ContentType => {
    if (attractionMatch || attractionNewMatch) return "attraction";
    if (hotelMatch || hotelNewMatch) return "hotel";
    if (diningMatch || diningNewMatch) return "dining";
    if (districtMatch || districtNewMatch) return "district";
    // TEMPORARILY DISABLED: transport, event, and itinerary will be enabled later
    // if (transportMatch || transportNewMatch) return "transport";
    // if (eventMatch || eventNewMatch) return "event";
    // if (itineraryMatch || itineraryNewMatch) return "itinerary";
    return "article";
  };
  const contentType: ContentType = getContentType();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroImageAlt, setHeroImageAlt] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [status, setStatus] = useState<string>("draft");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | null>(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [imageGenerationDialog, setImageGenerationDialog] = useState<{ open: boolean; blockId: string | null; images: Array<{ url: string; alt: string }> }>({
    open: false,
    blockId: null,
    images: [],
  });
  const [aiGenerateDialogOpen, setAiGenerateDialogOpen] = useState(false);
  const [aiGenerateInput, setAiGenerateInput] = useState("");
  const [imageGeneratingBlock, setImageGeneratingBlock] = useState<string | null>(null);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string | null>(null);

  // Attraction-specific SEO data
  const [attractionSeoData, setAttractionSeoData] = useState({
    introText: "",
    expandedIntroText: "",
    quickInfoBar: [] as QuickInfoItem[],
    highlights: [] as HighlightItem[],
    ticketInfo: [] as TicketInfoItem[],
    essentialInfo: [] as EssentialInfoItem[],
    visitorTips: [] as string[],
    relatedAttractions: [] as RelatedItem[],
    trustSignals: [] as string[],
    primaryCta: "",
    location: "",
    priceFrom: "",
    duration: "",
  });

  // Hotel-specific SEO data
  const [hotelSeoData, setHotelSeoData] = useState({
    location: "",
    starRating: "",
    numberOfRooms: "",
    amenities: [] as string[],
    targetAudience: [] as string[],
    primaryCta: "",
    quickInfoBar: [] as QuickInfoItem[],
    highlights: [] as HighlightItem[],
    roomTypes: [] as any[],
    essentialInfo: [] as EssentialInfoItem[],
    diningPreview: [] as any[],
    activities: [] as string[],
    travelerTips: [] as string[],
    faq: [] as any[],
    locationNearby: [] as any[],
    relatedHotels: [] as RelatedItem[],
    photoGallery: [] as any[],
    trustSignals: [] as string[],
  });

  // Dining-specific SEO data
  const [diningSeoData, setDiningSeoData] = useState({
    location: "",
    cuisineType: "",
    priceRange: "",
    targetAudience: [] as string[],
    primaryCta: "",
    quickInfoBar: [] as QuickInfoItem[],
    highlights: [] as HighlightItem[],
    menuHighlights: [] as any[],
    essentialInfo: [] as EssentialInfoItem[],
    diningTips: [] as string[],
    faq: [] as any[],
    relatedDining: [] as RelatedItem[],
    photoGallery: [] as any[],
    trustSignals: [] as string[],
  });

  // District-specific SEO data
  const [districtSeoData, setDistrictSeoData] = useState({
    location: "",
    neighborhood: "",
    subcategory: "",
    targetAudience: [] as string[],
    primaryCta: "",
    introText: "",
    expandedIntroText: "",
    quickInfoBar: [] as QuickInfoItem[],
    highlights: [] as HighlightItem[],
    thingsToDo: [] as any[],
    attractionsGrid: [] as any[],
    diningHighlights: [] as any[],
    essentialInfo: [] as EssentialInfoItem[],
    localTips: [] as string[],
    faq: [] as any[],
    relatedDistricts: [] as RelatedItem[],
    photoGallery: [] as any[],
    trustSignals: [] as string[],
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const hasChangedRef = useRef(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const { data: content, isLoading } = useQuery<ContentWithRelations>({
    queryKey: [`/api/contents/${contentId}`],
    enabled: !!contentId,
  });

  useEffect(() => {
    if (content) {
      setTitle(content.title || "");
      setSlug(content.slug || "");
      setMetaTitle(content.metaTitle || "");
      setMetaDescription(content.metaDescription || "");
      setPrimaryKeyword(content.primaryKeyword || "");
      setHeroImage(content.heroImage || "");
      setHeroImageAlt(content.heroImageAlt || "");
      setStatus(content.status || "draft");

      // Load attraction-specific SEO data if it exists
      if (content.attraction) {
        setAttractionSeoData({
          introText: content.attraction.introText || "",
          expandedIntroText: content.attraction.expandedIntroText || "",
          quickInfoBar: content.attraction.quickInfoBar || [],
          highlights: content.attraction.highlights || [],
          ticketInfo: content.attraction.ticketInfo || [],
          essentialInfo: content.attraction.essentialInfo || [],
          visitorTips: content.attraction.visitorTips || [],
          relatedAttractions: content.attraction.relatedAttractions || [],
          trustSignals: content.attraction.trustSignals || [],
          primaryCta: content.attraction.primaryCta || "",
          location: content.attraction.location || "",
          priceFrom: content.attraction.priceFrom || "",
          duration: content.attraction.duration || "",
        });
      }

      // Load hotel-specific SEO data if it exists
      if (content.hotel) {
        setHotelSeoData({
          location: content.hotel.location || "",
          starRating: content.hotel.starRating?.toString() || "",
          numberOfRooms: content.hotel.numberOfRooms?.toString() || "",
          amenities: content.hotel.amenities || [],
          targetAudience: content.hotel.targetAudience || [],
          primaryCta: content.hotel.primaryCta || "",
          quickInfoBar: content.hotel.quickInfoBar || [],
          highlights: content.hotel.highlights || [],
          roomTypes: content.hotel.roomTypes || [],
          essentialInfo: content.hotel.essentialInfo || [],
          diningPreview: content.hotel.diningPreview || [],
          activities: content.hotel.activities || [],
          travelerTips: content.hotel.travelerTips || [],
          faq: content.hotel.faq || [],
          locationNearby: content.hotel.locationNearby || [],
          relatedHotels: content.hotel.relatedHotels || [],
          photoGallery: content.hotel.photoGallery || [],
          trustSignals: content.hotel.trustSignals || [],
        });
      }

      // Load dining-specific SEO data if it exists
      if (content.dining) {
        setDiningSeoData({
          location: content.dining.location || "",
          cuisineType: content.dining.cuisineType || "",
          priceRange: content.dining.priceRange || "",
          targetAudience: content.dining.targetAudience || [],
          primaryCta: content.dining.primaryCta || "",
          quickInfoBar: content.dining.quickInfoBar || [],
          highlights: content.dining.highlights || [],
          menuHighlights: content.dining.menuHighlights || [],
          essentialInfo: content.dining.essentialInfo || [],
          diningTips: content.dining.diningTips || [],
          faq: content.dining.faq || [],
          relatedDining: content.dining.relatedDining || [],
          photoGallery: content.dining.photoGallery || [],
          trustSignals: content.dining.trustSignals || [],
        });
      }

      // Load district-specific SEO data if it exists
      if (content.district) {
        setDistrictSeoData({
          location: content.district.location || "",
          neighborhood: content.district.neighborhood || "",
          subcategory: content.district.subcategory || "",
          targetAudience: content.district.targetAudience || [],
          primaryCta: content.district.primaryCta || "",
          introText: content.district.introText || "",
          expandedIntroText: content.district.expandedIntroText || "",
          quickInfoBar: content.district.quickInfoBar || [],
          highlights: content.district.highlights || [],
          thingsToDo: content.district.thingsToDo || [],
          attractionsGrid: content.district.attractionsGrid || [],
          diningHighlights: content.district.diningHighlights || [],
          essentialInfo: content.district.essentialInfo || [],
          localTips: content.district.localTips || [],
          faq: content.district.faq || [],
          relatedDistricts: content.district.relatedDistricts || [],
          photoGallery: content.district.photoGallery || [],
          trustSignals: content.district.trustSignals || [],
        });
      }

      // Check if blocks are empty but extension data exists - auto-generate blocks
      const existingBlocks = content.blocks || [];
      if (existingBlocks.length === 0) {
        const generatedBlocks = generateBlocksFromExtensionData(content);
        if (generatedBlocks.length > 0) {
          setBlocks(generatedBlocks);
        } else {
          setBlocks([]);
        }
      } else {
        setBlocks(existingBlocks);
      }
    } else if (isNew && blocks.length === 0) {
      setBlocks(defaultTemplateBlocks.map(b => ({ ...b, id: generateId() })));
    }
  }, [content, isNew]);

  // Autosave effect - debounce changes and auto-save after 30 seconds of inactivity
  useEffect(() => {
    // Skip on initial load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    // Only autosave for existing draft content
    if (!contentId || status !== "draft") {
      return;
    }

    // Mark as changed
    hasChangedRef.current = true;

    // Clear existing timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Set new timer for 30 seconds
    autosaveTimerRef.current = setTimeout(() => {
      if (hasChangedRef.current && status === "draft" && !saveMutation.isPending && !autosaveMutation.isPending) {
        setAutosaveStatus("saving");
        const currentWordCount = blocks.reduce((count, block) => {
          if (block.type === "text" && typeof block.data?.content === "string") {
            return count + block.data.content.split(/\s+/).filter(Boolean).length;
          }
          return count;
        }, 0);

        const autosaveData: Record<string, unknown> = {
          title,
          slug: slug || generateSlug(title),
          metaTitle,
          metaDescription,
          primaryKeyword,
          heroImage,
          heroImageAlt,
          blocks,
          wordCount: currentWordCount,
          status,
        };

        // Include attraction-specific SEO data if this is an attraction
        if (contentType === "attraction") {
          autosaveData.attractionData = attractionSeoData;
        }

        autosaveMutation.mutate(autosaveData);
      }
    }, 30000);

    // Cleanup on unmount or before next effect
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [title, slug, metaTitle, metaDescription, primaryKeyword, heroImage, heroImageAlt, blocks, status, contentId, contentType, attractionSeoData]);

  // Generate blocks from attraction/hotel/article extension data
  // Blocks use simple string content (one item per line) for tips, highlights, info_grid
  function generateBlocksFromExtensionData(content: ContentWithRelations): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    let order = 0;

    // Add hero block if heroImage exists
    if (content.heroImage) {
      blocks.push({
        id: generateId(),
        type: "hero",
        data: { image: content.heroImage, alt: content.heroImageAlt || content.title, title: content.title },
        order: order++,
      });
    }

    // Add intro text block if metaDescription exists
    if (content.metaDescription) {
      blocks.push({
        id: generateId(),
        type: "text",
        data: { content: content.metaDescription },
        order: order++,
      });
    }

    // Handle attraction-specific data
    if (content.attraction) {
      const attraction = content.attraction;
      
      // Add expanded intro if available
      if (attraction.expandedIntroText) {
        blocks.push({
          id: generateId(),
          type: "text",
          data: { content: attraction.expandedIntroText },
          order: order++,
        });
      }

      // Add highlights block - convert HighlightItem[] to string content (one per line)
      if (attraction.highlights && attraction.highlights.length > 0) {
        const highlightsContent = attraction.highlights
          .map(h => `${h.title}: ${h.description}`)
          .join("\n");
        blocks.push({
          id: generateId(),
          type: "highlights",
          data: { content: highlightsContent },
          order: order++,
        });
      }

      // Add gallery if available - convert to images array with url/alt
      if (attraction.gallery && attraction.gallery.length > 0) {
        blocks.push({
          id: generateId(),
          type: "gallery",
          data: { images: attraction.gallery.map(g => ({ url: g.image, alt: g.alt })) },
          order: order++,
        });
      }

      // Add visitor tips - convert string[] to string content (one per line)
      if (attraction.visitorTips && attraction.visitorTips.length > 0) {
        blocks.push({
          id: generateId(),
          type: "tips",
          data: { content: attraction.visitorTips.join("\n") },
          order: order++,
        });
      }

      // Add insider tips as additional tips block
      if (attraction.insiderTips && attraction.insiderTips.length > 0) {
        blocks.push({
          id: generateId(),
          type: "tips",
          data: { content: attraction.insiderTips.join("\n") },
          order: order++,
        });
      }

      // Add FAQ blocks
      if (attraction.faq && attraction.faq.length > 0) {
        attraction.faq.forEach((faqItem) => {
          blocks.push({
            id: generateId(),
            type: "faq",
            data: { question: faqItem.question, answer: faqItem.answer },
            order: order++,
          });
        });
      }

      // Add CTA if primaryCta exists
      if (attraction.primaryCta) {
        blocks.push({
          id: generateId(),
          type: "cta",
          data: { text: attraction.primaryCta, url: "" },
          order: order++,
        });
      }
    }

    // Handle hotel-specific data
    if (content.hotel) {
      const hotel = content.hotel;

      // Add highlights block - convert HighlightItem[] to string content
      if (hotel.highlights && hotel.highlights.length > 0) {
        const highlightsContent = hotel.highlights
          .map(h => `${h.title}: ${h.description}`)
          .join("\n");
        blocks.push({
          id: generateId(),
          type: "highlights",
          data: { content: highlightsContent },
          order: order++,
        });
      }

      // Add amenities as info grid - convert string[] to string content (one per line)
      if (hotel.amenities && hotel.amenities.length > 0) {
        blocks.push({
          id: generateId(),
          type: "info_grid",
          data: { content: hotel.amenities.join("\n") },
          order: order++,
        });
      }

      // Add photo gallery - convert to images array with url/alt
      if (hotel.photoGallery && hotel.photoGallery.length > 0) {
        blocks.push({
          id: generateId(),
          type: "gallery",
          data: { images: hotel.photoGallery.map(g => ({ url: g.image, alt: g.alt })) },
          order: order++,
        });
      }

      // Add traveler tips - convert string[] to string content
      if (hotel.travelerTips && hotel.travelerTips.length > 0) {
        blocks.push({
          id: generateId(),
          type: "tips",
          data: { content: hotel.travelerTips.join("\n") },
          order: order++,
        });
      }

      // Add FAQ blocks
      if (hotel.faq && hotel.faq.length > 0) {
        hotel.faq.forEach((faqItem) => {
          blocks.push({
            id: generateId(),
            type: "faq",
            data: { question: faqItem.question, answer: faqItem.answer },
            order: order++,
          });
        });
      }

      // Add CTA if primaryCta exists
      if (hotel.primaryCta) {
        blocks.push({
          id: generateId(),
          type: "cta",
          data: { text: hotel.primaryCta, url: "" },
          order: order++,
        });
      }
    }

    // Handle article-specific data
    if (content.article) {
      const article = content.article;

      // Add quick facts as text block
      if (article.quickFacts && article.quickFacts.length > 0) {
        blocks.push({
          id: generateId(),
          type: "text",
          data: { content: article.quickFacts.map(f => `- ${f}`).join("\n") },
          order: order++,
        });
      }

      // Add pro tips - convert string[] to string content
      if (article.proTips && article.proTips.length > 0) {
        blocks.push({
          id: generateId(),
          type: "tips",
          data: { content: article.proTips.join("\n") },
          order: order++,
        });
      }

      // Add warnings as tips
      if (article.warnings && article.warnings.length > 0) {
        blocks.push({
          id: generateId(),
          type: "tips",
          data: { content: article.warnings.join("\n") },
          order: order++,
        });
      }

      // Add FAQ blocks
      if (article.faq && article.faq.length > 0) {
        article.faq.forEach((faqItem) => {
          blocks.push({
            id: generateId(),
            type: "faq",
            data: { question: faqItem.question, answer: faqItem.answer },
            order: order++,
          });
        });
      }
    }

    return blocks;
  }

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (contentId) {
        const res = await apiRequest("PATCH", `/api/contents/${contentId}`, data);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/contents", { ...data, type: contentType });
        return res.json();
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      queryClient.invalidateQueries({ queryKey: [`/api/contents?type=${contentType}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Saved", description: "Your content has been saved." });
      hasChangedRef.current = false;
      if (isNew && result?.id) {
        navigate(`/admin/${contentType}s/${result.id}`);
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save content.", variant: "destructive" });
    },
  });

  const autosaveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (!contentId) return null;
      const res = await apiRequest("PATCH", `/api/contents/${contentId}`, data);
      return res.json();
    },
    onSuccess: () => {
      hasChangedRef.current = false;
      setAutosaveStatus("saved");
      const now = new Date();
      setLastAutosaveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      queryClient.invalidateQueries({ queryKey: [`/api/contents/${contentId}`] });
      setTimeout(() => setAutosaveStatus("idle"), 3000);
    },
    onError: () => {
      setAutosaveStatus("idle");
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (contentId) {
        const res = await apiRequest("PATCH", `/api/contents/${contentId}`, data);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/contents", { ...data, type: contentType });
        return res.json();
      }
    },
    onSuccess: (result) => {
      setStatus("published");
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      queryClient.invalidateQueries({ queryKey: [`/api/contents?type=${contentType}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Published", description: "Your content is now live." });
      if (isNew && result?.id) {
        navigate(`/admin/${contentType}s/${result.id}`);
      }
    },
    onError: () => {
      toast({ title: "Publish Failed", description: "Failed to publish content.", variant: "destructive" });
    },
  });

  const aiImageMutation = useMutation({
    mutationFn: async (data: { blockId: string; blockType: "hero" | "image" }) => {
      const isHero = data.blockType === "hero";
      const res = await apiRequest("POST", "/api/ai/generate-images", {
        contentType,
        title: title || "Dubai Travel",
        description: primaryKeyword || metaDescription,
        generateHero: isHero,
        generateContentImages: !isHero,
        contentImageCount: isHero ? 0 : 3,
      });
      return res.json();
    },
    onSuccess: (result, variables) => {
      const images = result.images as Array<{ url: string; alt: string; type: string }> | undefined;
      if (images && images.length > 0) {
        setImageGenerationDialog({
          open: true,
          blockId: variables.blockId,
          images: images.map(img => ({ url: img.url, alt: img.alt || `${title} image` })),
        });
      } else {
        toast({ title: "No Images", description: "AI could not generate images.", variant: "destructive" });
      }
      setImageGeneratingBlock(null);
    },
    onError: () => {
      toast({ title: "Generation Failed", description: "Failed to generate images.", variant: "destructive" });
      setImageGeneratingBlock(null);
    },
  });

  const aiGenerateMutation = useMutation({
    mutationFn: async (input: string) => {
      const endpoint =
        contentType === "hotel" ? "/api/ai/generate-hotel" :
        contentType === "attraction" ? "/api/ai/generate-attraction" :
        contentType === "dining" ? "/api/ai/generate-dining" :
        contentType === "district" ? "/api/ai/generate-district" :
        // TEMPORARILY DISABLED: transport, event, and itinerary will be enabled later
        // contentType === "transport" ? "/api/ai/generate-transport" :
        // contentType === "event" ? "/api/ai/generate-event" :
        // contentType === "itinerary" ? "/api/ai/generate-itinerary" :
        "/api/ai/generate-article";

      const body = contentType === "article" ? { topic: input } : { name: input };
      // Note: When itinerary is re-enabled, use: contentType === "itinerary" ? { duration: input } : { name: input }

      const res = await apiRequest("POST", endpoint, body);
      return res.json();
    },
    onSuccess: (result) => {
      if (result.content) {
        setTitle(result.content.title || "");
        setSlug(result.content.slug || "");
        setMetaTitle(result.content.metaTitle || "");
        setMetaDescription(result.content.metaDescription || "");
        setPrimaryKeyword(result.content.primaryKeyword || "");
        if (result.content.heroImage) setHeroImage(result.content.heroImage);
        setHeroImageAlt(result.content.heroImageAlt || "");
        setBlocks(Array.isArray(result.content.blocks) ? result.content.blocks : []);
      }
      setAiGenerateDialogOpen(false);
      setAiGenerateInput("");
      toast({ title: "Generated", description: "AI content generated. Review and edit as needed." });
    },
    onError: (error: Error) => {
      toast({ title: "Generation Failed", description: error.message || "Failed to generate content.", variant: "destructive" });
    },
  });

  const { data: versions = [], isLoading: isLoadingVersions } = useQuery<ContentVersion[]>({
    queryKey: ['/api/contents', contentId, 'versions'],
    enabled: !!contentId && versionHistoryOpen,
  });

  const restoreMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const res = await apiRequest("POST", `/api/contents/${contentId}/versions/${versionId}/restore`);
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [`/api/contents/${contentId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/contents', contentId, 'versions'] });
      setVersionHistoryOpen(false);
      setSelectedVersion(null);
      if (result) {
        setTitle(result.title || "");
        setSlug(result.slug || "");
        setMetaTitle(result.metaTitle || "");
        setMetaDescription(result.metaDescription || "");
        setPrimaryKeyword(result.primaryKeyword || "");
        setHeroImage(result.heroImage || "");
        setHeroImageAlt(result.heroImageAlt || "");
        setBlocks(result.blocks || []);
        setStatus(result.status || "draft");
      }
      toast({ title: "Restored", description: "Content restored from previous version." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to restore version.", variant: "destructive" });
    },
  });

  const wordCount = blocks.reduce((count, block) => {
    if (block.type === "text" && typeof block.data?.content === "string") {
      return count + block.data.content.split(/\s+/).filter(Boolean).length;
    }
    return count;
  }, 0);

  const seoContentText = useMemo(() => {
    return blocks.map(b => {
      if (b.type === "text") return (b.data?.content as string) || "";
      if (b.type === "faq") return `${(b.data?.question as string) || ""} ${(b.data?.answer as string) || ""}`;
      if (b.type === "hero") return (b.data?.title as string) || "";
      if (b.type === "cta") return (b.data?.text as string) || "";
      if (b.type === "highlights" || b.type === "tips" || b.type === "info_grid") {
        if (typeof b.data?.content === "string") return b.data.content;
        if (Array.isArray(b.data?.items)) {
          return (b.data.items as Array<string | { title?: string; description?: string; text?: string }>)
            .map(item => {
              if (typeof item === "string") return item;
              return `${item.title || ""} ${item.description || ""} ${item.text || ""}`;
            }).join(" ");
        }
        return "";
      }
      return "";
    }).join(" ");
  }, [blocks]);

  const seoHeadings = useMemo(() => {
    const headings: { level: number; text: string }[] = [];
    if (title) headings.push({ level: 1, text: title });
    blocks.forEach(b => {
      if (b.type === "text" && b.data?.heading) {
        headings.push({ level: 2, text: (b.data.heading as string) || "" });
      }
    });
    return headings;
  }, [blocks, title]);

  const seoImages = useMemo(() => {
    const images: { url: string; alt: string }[] = [];
    if (heroImage) {
      images.push({ url: heroImage, alt: heroImageAlt || "" });
    }
    blocks.forEach(b => {
      if (b.type === "hero" && b.data?.image) {
        images.push({ url: (b.data.image as string) || "", alt: (b.data.alt as string) || "" });
      }
      if (b.type === "image" && b.data?.image) {
        images.push({ url: (b.data.image as string) || "", alt: (b.data.alt as string) || "" });
      }
      if (b.type === "gallery" && Array.isArray(b.data?.images)) {
        (b.data.images as Array<{ url: string; alt: string }>).forEach(img => {
          images.push({ url: img.url || "", alt: img.alt || "" });
        });
      }
    });
    return images;
  }, [blocks, heroImage, heroImageAlt]);

  const handleSave = () => {
    const saveData: Record<string, unknown> = {
      title,
      slug: slug || generateSlug(title),
      metaTitle,
      metaDescription,
      primaryKeyword,
      heroImage,
      heroImageAlt,
      blocks,
      wordCount,
      status,
    };

    // Include content-type-specific SEO data
    if (contentType === "attraction") {
      saveData.attractionData = attractionSeoData;
    } else if (contentType === "hotel") {
      saveData.hotelData = hotelSeoData;
    } else if (contentType === "dining") {
      saveData.diningData = diningSeoData;
    } else if (contentType === "district") {
      saveData.districtData = districtSeoData;
    }

    saveMutation.mutate(saveData);
  };

  const handlePublish = () => {
    const publishData: Record<string, unknown> = {
      title,
      slug: slug || generateSlug(title),
      metaTitle,
      metaDescription,
      primaryKeyword,
      heroImage,
      heroImageAlt,
      blocks,
      wordCount,
      status: "published",
      publishedAt: new Date().toISOString(),
    };

    // Include content-type-specific SEO data
    if (contentType === "attraction") {
      publishData.attractionData = attractionSeoData;
    } else if (contentType === "hotel") {
      publishData.hotelData = hotelSeoData;
    } else if (contentType === "dining") {
      publishData.diningData = diningSeoData;
    } else if (contentType === "district") {
      publishData.districtData = districtSeoData;
    }

    publishMutation.mutate(publishData);
  };

  const getDefaultBlockData = (type: ContentBlock["type"]): Record<string, unknown> => {
    switch (type) {
      case "hero":
        return { image: "", alt: "", title: "" };
      case "text":
        return { content: "" };
      case "image":
        return { image: "", alt: "", caption: "" };
      case "gallery":
        return { images: [] };
      case "faq":
        return { question: "", answer: "" };
      case "cta":
        return { text: "Learn More", url: "" };
      case "info_grid":
        return { content: "" };
      case "highlights":
        return { content: "" };
      case "tips":
        return { content: "" };
      default:
        return {};
    }
  };

  const addBlock = (type: ContentBlock["type"], insertAfterIndex?: number) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      data: getDefaultBlockData(type),
      order: blocks.length,
    };
    if (insertAfterIndex !== undefined) {
      const newBlocks = [...blocks];
      newBlocks.splice(insertAfterIndex + 1, 0, newBlock);
      setBlocks(newBlocks.map((b, i) => ({ ...b, order: i })));
    } else {
      setBlocks([...blocks, newBlock]);
    }
    setSelectedBlockId(newBlock.id ?? null);
  };

  const updateBlock = (id: string, data: Record<string, unknown>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const duplicateBlock = (id: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === id);
    if (blockIndex !== -1) {
      const block = blocks[blockIndex];
      const newBlock: ContentBlock = {
        ...block,
        id: generateId(),
        order: blockIndex + 1,
      };
      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, newBlock);
      setBlocks(newBlocks.map((b, i) => ({ ...b, order: i })));
      setSelectedBlockId(newBlock.id ?? null);
    }
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < blocks.length) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks.map((b, i) => ({ ...b, order: i })));
    }
  };

  const handleGenerateImage = (blockId: string, blockType: "hero" | "image") => {
    if (!title.trim()) {
      toast({ title: "Title Required", description: "Please enter a title before generating images.", variant: "destructive" });
      return;
    }
    setImageGeneratingBlock(blockId);
    aiImageMutation.mutate({ blockId, blockType });
  };

  const selectGeneratedImage = (url: string, alt: string) => {
    if (imageGenerationDialog.blockId) {
      updateBlock(imageGenerationDialog.blockId, { image: url, alt });
      toast({ title: "Image Selected", description: "Image added to block." });
    }
    setImageGenerationDialog({ open: false, blockId: null, images: [] });
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedBlockId(null);
    }
  };

  if (contentId && isLoading) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-between gap-4 p-3 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setPreviewMode(null)} data-testid="button-close-preview">
              <X className="h-4 w-4" />
            </Button>
            <span className="font-medium">Preview: {title || "Untitled"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={previewMode === "desktop" ? "default" : "outline"} size="sm" onClick={() => setPreviewMode("desktop")} data-testid="button-preview-desktop">
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
            <Button variant={previewMode === "mobile" ? "default" : "outline"} size="sm" onClick={() => setPreviewMode("mobile")} data-testid="button-preview-mobile">
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
          </div>
        </div>
        <div className="flex justify-center p-8 bg-muted min-h-[calc(100vh-65px)] overflow-auto">
          <div className={`bg-background rounded-lg shadow-lg overflow-auto ${previewMode === "mobile" ? "w-[375px]" : "w-full max-w-4xl"}`}>
            <div className="space-y-0">
              {blocks.map((block) => (
                <PreviewBlock key={block.id} block={block} title={title} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/${contentType}s`)} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)} data-testid="button-toggle-panel">
            <PanelLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <StatusBadge status={status as "draft" | "in_review" | "approved" | "scheduled" | "published"} />
            <span className="text-sm text-muted-foreground">{wordCount} words</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAiGenerateDialogOpen(true)} data-testid="button-generate-ai">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Generate
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPreviewMode("desktop")} data-testid="button-preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {contentId && (
            <Button variant="outline" size="sm" onClick={() => setVersionHistoryOpen(true)} data-testid="button-history">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save-draft">
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
          {autosaveStatus === "saving" && (
            <span className="text-xs text-muted-foreground flex items-center gap-1" data-testid="autosave-saving">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          )}
          {autosaveStatus === "saved" && lastAutosaveTime && (
            <span className="text-xs text-muted-foreground flex items-center gap-1" data-testid="autosave-saved">
              <Check className="h-3 w-3 text-green-500" />
              Autosaved at {lastAutosaveTime}
            </span>
          )}
          {canPublish && (
            <Button size="sm" onClick={handlePublish} disabled={publishMutation.isPending} data-testid="button-publish">
              {publishMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Block Library */}
        {!leftPanelCollapsed && (
          <div className="w-64 border-r bg-muted/30 shrink-0 flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-medium text-sm">Blocks</h3>
              <p className="text-xs text-muted-foreground mt-1">Click to add to page</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 grid grid-cols-2 gap-2">
                {blockTypes.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    className="flex flex-col items-center gap-2 p-3 rounded-md border bg-background hover-elevate cursor-pointer transition-all"
                    data-testid={`block-add-${bt.type}`}
                  >
                    <bt.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-medium">{bt.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Center - Canvas */}
        <div className="flex-1 overflow-auto bg-muted/50" ref={canvasRef} onClick={handleCanvasClick}>
          <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Canvas blocks */}
            <div className="space-y-4">
              {blocks.map((block, index) => {
                const blockId = block.id ?? `block-${index}`;
                return (
                <CanvasBlock
                  key={blockId}
                  block={block}
                  isSelected={selectedBlockId === blockId}
                  onSelect={() => setSelectedBlockId(blockId)}
                  onUpdate={(data) => updateBlock(blockId, data)}
                  onDelete={() => removeBlock(blockId)}
                  onDuplicate={() => duplicateBlock(blockId)}
                  onMoveUp={() => moveBlock(blockId, "up")}
                  onMoveDown={() => moveBlock(blockId, "down")}
                  canMoveUp={index > 0}
                  canMoveDown={index < blocks.length - 1}
                  title={title}
                  onTitleChange={setTitle}
                  onGenerateImage={() => handleGenerateImage(blockId, block.type === "hero" ? "hero" : "image")}
                  isGeneratingImage={imageGeneratingBlock === blockId}
                />
              );})}

              {blocks.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Start building your page</p>
                  <p className="text-sm mt-1">Select a block from the left panel to add content</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div className="w-80 border-l bg-background shrink-0 flex flex-col">
          <div className="p-3 border-b">
            <h3 className="font-medium text-sm flex items-center gap-2">
              {selectedBlock ? (
                <>
                  <FileText className="h-4 w-4" />
                  Block Settings
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4" />
                  Page Settings
                </>
              )}
            </h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              {selectedBlock ? (
                <BlockSettingsPanel
                  block={selectedBlock}
                  onUpdate={(data) => updateBlock(selectedBlock.id ?? '', data)}
                  onGenerateImage={() => handleGenerateImage(selectedBlock.id ?? '', selectedBlock.type === "hero" ? "hero" : "image")}
                  isGeneratingImage={imageGeneratingBlock === selectedBlock.id}
                />
              ) : (contentType === "attraction" || contentType === "hotel" || contentType === "dining" || contentType === "district") ? (
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="seo">SEO Sections</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-6 mt-4">
                    <PageSettingsPanel
                      title={title}
                      onTitleChange={setTitle}
                      slug={slug}
                      onSlugChange={setSlug}
                      status={status}
                      onStatusChange={setStatus}
                      metaTitle={metaTitle}
                      onMetaTitleChange={setMetaTitle}
                      metaDescription={metaDescription}
                      onMetaDescriptionChange={setMetaDescription}
                      primaryKeyword={primaryKeyword}
                      onPrimaryKeywordChange={setPrimaryKeyword}
                      contentId={contentId}
                    />
                    <Separator />
                    <SeoScore
                      title={title}
                      metaTitle={metaTitle}
                      metaDescription={metaDescription}
                      primaryKeyword={primaryKeyword}
                      content={seoContentText}
                      headings={seoHeadings}
                      images={seoImages}
                    />
                  </TabsContent>
                  <TabsContent value="seo" className="mt-4">
                    {contentType === "attraction" && (
                      <AttractionSeoEditor
                        data={attractionSeoData}
                        onChange={setAttractionSeoData}
                      />
                    )}
                    {contentType === "hotel" && (
                      <HotelSeoEditor
                        data={hotelSeoData}
                        onChange={setHotelSeoData}
                      />
                    )}
                    {contentType === "dining" && (
                      <DiningSeoEditor
                        data={diningSeoData}
                        onChange={setDiningSeoData}
                      />
                    )}
                    {contentType === "district" && (
                      <DistrictSeoEditor
                        data={districtSeoData}
                        onChange={setDistrictSeoData}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-6">
                  <PageSettingsPanel
                    title={title}
                    onTitleChange={setTitle}
                    slug={slug}
                    onSlugChange={setSlug}
                    status={status}
                    onStatusChange={setStatus}
                    metaTitle={metaTitle}
                    onMetaTitleChange={setMetaTitle}
                    metaDescription={metaDescription}
                    onMetaDescriptionChange={setMetaDescription}
                    primaryKeyword={primaryKeyword}
                    onPrimaryKeywordChange={setPrimaryKeyword}
                    contentId={contentId}
                  />
                  <Separator />
                  <SeoScore
                    title={title}
                    metaTitle={metaTitle}
                    metaDescription={metaDescription}
                    primaryKeyword={primaryKeyword}
                    content={seoContentText}
                    headings={seoHeadings}
                    images={seoImages}
                  />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Image Generation Dialog */}
      <Dialog open={imageGenerationDialog.open} onOpenChange={(open) => !open && setImageGenerationDialog({ open: false, blockId: null, images: [] })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select an Image</DialogTitle>
            <DialogDescription>Choose one of the AI-generated images for this block</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {imageGenerationDialog.images.map((img, i) => (
              <button
                key={i}
                onClick={() => selectGeneratedImage(img.url, img.alt)}
                className="aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
                data-testid={`select-generated-image-${i}`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageGenerationDialog({ open: false, blockId: null, images: [] })}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Generate Dialog */}
      <Dialog open={aiGenerateDialogOpen} onOpenChange={setAiGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate with AI</DialogTitle>
            <DialogDescription>
              {contentType === "article" ? "Enter a topic for your article" : `Enter the ${contentType} name`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={aiGenerateInput}
              onChange={(e) => setAiGenerateInput(e.target.value)}
              placeholder={contentType === "article" ? "e.g., Best Dubai beaches for families" : contentType === "hotel" ? "e.g., Atlantis The Palm" : "e.g., Burj Khalifa"}
              disabled={aiGenerateMutation.isPending}
              data-testid="input-ai-generate"
            />
            {aiGenerateMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating content... This may take 15-30 seconds.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiGenerateDialogOpen(false)} disabled={aiGenerateMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={() => aiGenerateMutation.mutate(aiGenerateInput)} disabled={aiGenerateMutation.isPending || !aiGenerateInput.trim()} data-testid="button-confirm-ai-generate">
              {aiGenerateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={versionHistoryOpen} onOpenChange={(open) => { setVersionHistoryOpen(open); if (!open) setSelectedVersion(null); }}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>View and restore previous versions of this content</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 min-h-[400px]">
            {/* Version List */}
            <div className="w-1/3 border-r pr-4">
              <ScrollArea className="h-[400px]">
                {isLoadingVersions ? (
                  <div className="flex items-center justify-center py-8" data-testid="loading-versions">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : versions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4" data-testid="empty-versions">No versions saved yet. Versions are created when you save changes.</p>
                ) : (
                  <div className="space-y-2">
                    {versions.map((version) => (
                      <button
                        key={version.id}
                        onClick={() => setSelectedVersion(version)}
                        className={`w-full text-left p-3 rounded-md border transition-colors ${
                          selectedVersion?.id === version.id ? "border-primary bg-primary/5" : "hover-elevate"
                        }`}
                        data-testid={`version-item-${version.versionNumber}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm">Version {version.versionNumber}</span>
                          <Badge variant="secondary" className="text-xs">
                            {version.createdAt ? new Date(version.createdAt).toLocaleDateString() : ""}
                          </Badge>
                        </div>
                        {version.changeNote && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{version.changeNote}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {/* Version Details */}
            <div className="flex-1 pl-4">
              {selectedVersion ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Version {selectedVersion.versionNumber} Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{selectedVersion.createdAt ? new Date(selectedVersion.createdAt).toLocaleString() : "Unknown"}</span>
                      </div>
                      {selectedVersion.changeNote && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Note:</span>
                          <span>{selectedVersion.changeNote}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Title</h4>
                    <p className="text-sm bg-muted p-2 rounded">{selectedVersion.title}</p>
                  </div>
                  
                  {selectedVersion.metaDescription && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Meta Description</h4>
                      <p className="text-sm bg-muted p-2 rounded">{selectedVersion.metaDescription}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Content Blocks</h4>
                    <p className="text-sm text-muted-foreground">
                      {Array.isArray(selectedVersion.blocks) ? selectedVersion.blocks.length : 0} blocks
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => restoreMutation.mutate(selectedVersion.id)} 
                    disabled={restoreMutation.isPending}
                    className="w-full"
                    data-testid="button-restore-version"
                  >
                    {restoreMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Restore This Version
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-sm">Select a version to view details</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Canvas Block Component - Visual representation on the canvas
function CanvasBlock({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  title,
  onTitleChange,
  onGenerateImage,
  isGeneratingImage,
}: {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (data: Record<string, unknown>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  title: string;
  onTitleChange: (title: string) => void;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
}) {
  const blockConfig = blockTypes.find((bt) => bt.type === block.type);

  return (
    <div
      className={`group relative rounded-lg transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-primary shadow-lg" : "hover:ring-1 hover:ring-border"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      data-testid={`canvas-block-${block.id}`}
    >
      {/* Block label */}
      <div className={`absolute -top-3 left-3 z-10 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <Badge variant="secondary" className="text-xs">
          {blockConfig?.label || block.type}
        </Badge>
      </div>

      {/* Block controls */}
      <div className={`absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={!canMoveUp} data-testid={`move-up-${block.id}`}>
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={!canMoveDown} data-testid={`move-down-${block.id}`}>
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDuplicate(); }} data-testid={`duplicate-${block.id}`}>
          <Copy className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }} data-testid={`delete-${block.id}`}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Block content */}
      <div className="bg-background rounded-lg overflow-hidden">
        {block.type === "hero" && (
          <HeroBlockCanvas
            block={block}
            title={title}
            onTitleChange={onTitleChange}
            onUpdate={onUpdate}
            onGenerateImage={onGenerateImage}
            isGeneratingImage={isGeneratingImage}
            isSelected={isSelected}
          />
        )}
        {block.type === "text" && (
          <TextBlockCanvas block={block} onUpdate={onUpdate} isSelected={isSelected} />
        )}
        {block.type === "image" && (
          <ImageBlockCanvas block={block} onUpdate={onUpdate} onGenerateImage={onGenerateImage} isGeneratingImage={isGeneratingImage} isSelected={isSelected} />
        )}
        {block.type === "faq" && (
          <FAQBlockCanvas block={block} onUpdate={onUpdate} isSelected={isSelected} />
        )}
        {block.type === "cta" && (
          <CTABlockCanvas block={block} onUpdate={onUpdate} isSelected={isSelected} />
        )}
        {block.type === "highlights" && (
          <HighlightsBlockCanvas block={block} onUpdate={onUpdate} isSelected={isSelected} />
        )}
        {block.type === "tips" && (
          <TipsBlockCanvas block={block} onUpdate={onUpdate} isSelected={isSelected} />
        )}
        {block.type === "info_grid" && (
          <InfoGridBlockCanvas block={block} onUpdate={onUpdate} isSelected={isSelected} />
        )}
        {block.type === "gallery" && (
          <GalleryBlockCanvas block={block} onUpdate={onUpdate} isSelected={isSelected} />
        )}
      </div>
    </div>
  );
}

// Hero Block Canvas
function HeroBlockCanvas({
  block,
  title,
  onTitleChange,
  onUpdate,
  onGenerateImage,
  isGeneratingImage,
  isSelected,
}: {
  block: ContentBlock;
  title: string;
  onTitleChange: (title: string) => void;
  onUpdate: (data: Record<string, unknown>) => void;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
  isSelected: boolean;
}) {
  const hasImage = !!block.data?.image;

  return (
    <div className="relative aspect-[21/9] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
      {hasImage ? (
        <img src={String(block.data.image)} alt={String(block.data?.alt || "")} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <ImagePlus className="h-12 w-12 text-muted-foreground/50" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }} data-testid={`hero-upload-${block.id}`}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onGenerateImage(); }} disabled={isGeneratingImage} data-testid={`hero-generate-${block.id}`}>
              {isGeneratingImage ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate
            </Button>
          </div>
        </div>
      )}
      {/* Dark overlay for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      {/* Inline editable title */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="Enter page title..."
          className="w-full bg-transparent border-none outline-none text-white text-3xl font-bold placeholder:text-white/50 focus:ring-0"
          data-testid="input-title"
        />
      </div>
    </div>
  );
}

// Text Block Canvas
function TextBlockCanvas({
  block,
  onUpdate,
  isSelected,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  isSelected: boolean;
}) {
  const content = String(block.data?.content || "");

  return (
    <div className="p-6">
      <textarea
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="Start typing your content here..."
        className="w-full min-h-[120px] bg-transparent border-none outline-none resize-none text-base leading-relaxed placeholder:text-muted-foreground/50 focus:ring-0"
        data-testid={`textarea-${block.id}`}
      />
    </div>
  );
}

// Image Block Canvas
function ImageBlockCanvas({
  block,
  onUpdate,
  onGenerateImage,
  isGeneratingImage,
  isSelected,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
  isSelected: boolean;
}) {
  const hasImage = !!block.data?.image;

  return (
    <div className="p-4">
      {hasImage ? (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img src={String(block.data.image)} alt={String(block.data?.alt || "")} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-video rounded-lg bg-muted flex flex-col items-center justify-center gap-4">
          <ImagePlus className="h-10 w-10 text-muted-foreground/50" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()} data-testid={`image-upload-${block.id}`}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onGenerateImage(); }} disabled={isGeneratingImage} data-testid={`image-generate-${block.id}`}>
              {isGeneratingImage ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// FAQ Block Canvas
function FAQBlockCanvas({
  block,
  onUpdate,
  isSelected,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  isSelected: boolean;
}) {
  return (
    <div className="p-6 space-y-3">
      <input
        type="text"
        value={String(block.data?.question || "")}
        onChange={(e) => onUpdate({ question: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="Enter your question..."
        className="w-full bg-transparent border-none outline-none text-lg font-semibold placeholder:text-muted-foreground/50 focus:ring-0"
        data-testid={`faq-question-${block.id}`}
      />
      <textarea
        value={String(block.data?.answer || "")}
        onChange={(e) => onUpdate({ answer: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="Enter your answer..."
        className="w-full min-h-[80px] bg-transparent border-none outline-none resize-none text-muted-foreground placeholder:text-muted-foreground/50 focus:ring-0"
        data-testid={`faq-answer-${block.id}`}
      />
    </div>
  );
}

// CTA Block Canvas
function CTABlockCanvas({
  block,
  onUpdate,
  isSelected,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  isSelected: boolean;
}) {
  return (
    <div className="p-6 flex flex-col items-center gap-4 bg-primary/5">
      <input
        type="text"
        value={String(block.data?.text || "")}
        onChange={(e) => onUpdate({ text: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="Button text..."
        className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-center border-none outline-none focus:ring-2 focus:ring-primary/50"
        data-testid={`cta-text-${block.id}`}
      />
      <input
        type="text"
        value={String(block.data?.url || "")}
        onChange={(e) => onUpdate({ url: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="https://..."
        className="text-sm text-muted-foreground bg-transparent border-none outline-none text-center placeholder:text-muted-foreground/50 focus:ring-0"
        data-testid={`cta-url-${block.id}`}
      />
    </div>
  );
}

// Highlights Block Canvas
function HighlightsBlockCanvas({
  block,
  onUpdate,
  isSelected,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  isSelected: boolean;
}) {
  const content = String(block.data?.content || "");

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-5 w-5 text-primary" />
        <span className="font-semibold">Highlights</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="Enter highlights (one per line)..."
        className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 focus:ring-0"
        data-testid={`highlights-content-${block.id}`}
      />
    </div>
  );
}

// Tips Block Canvas
function TipsBlockCanvas({
  block,
  onUpdate,
  isSelected,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  isSelected: boolean;
}) {
  const content = String(block.data?.content || "");

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <span className="font-semibold">Tips</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="Enter tips (one per line)..."
        className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 focus:ring-0"
        data-testid={`tips-content-${block.id}`}
      />
    </div>
  );
}

// Info Grid Block Canvas
function InfoGridBlockCanvas({
  block,
  onUpdate,
  isSelected,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  isSelected: boolean;
}) {
  const content = String(block.data?.content || "");

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <LayoutGrid className="h-5 w-5 text-muted-foreground" />
        <span className="font-semibold">Info Grid</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        placeholder="Enter info items (one per line)..."
        className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 focus:ring-0"
        data-testid={`info-grid-content-${block.id}`}
      />
    </div>
  );
}

// Gallery Block Canvas
function GalleryBlockCanvas({
  block,
  onUpdate,
  isSelected,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  isSelected: boolean;
}) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <LayoutGrid className="h-5 w-5 text-muted-foreground" />
        <span className="font-semibold">Gallery</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square rounded-md bg-muted flex items-center justify-center">
            <ImagePlus className="h-6 w-6 text-muted-foreground/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Preview Block Component
function PreviewBlock({ block, title }: { block: ContentBlock; title: string }) {
  if (block.type === "hero") {
    const hasImage = !!block.data?.image;
    return (
      <div className="relative aspect-[21/9] bg-gradient-to-br from-muted to-muted/50">
        {hasImage && <img src={String(block.data.image)} alt={String(block.data?.alt || "")} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl font-bold text-white">{title || "Untitled"}</h1>
        </div>
      </div>
    );
  }

  if (block.type === "text") {
    return (
      <div className="p-8">
        <p className="text-lg leading-relaxed">{String(block.data?.content || "")}</p>
      </div>
    );
  }

  if (block.type === "image" && block.data?.image) {
    return (
      <div className="p-8">
        <img src={String(block.data.image)} alt={String(block.data?.alt || "")} className="w-full rounded-lg" />
      </div>
    );
  }

  if (block.type === "faq") {
    return (
      <div className="p-8 space-y-2">
        <h3 className="text-xl font-semibold">{String(block.data?.question || "Question")}</h3>
        <p className="text-muted-foreground">{String(block.data?.answer || "Answer")}</p>
      </div>
    );
  }

  if (block.type === "cta") {
    return (
      <div className="p-8 text-center">
        <Button size="lg">{String(block.data?.text || "Click here")}</Button>
      </div>
    );
  }

  return null;
}

// Block Settings Panel
function BlockSettingsPanel({
  block,
  onUpdate,
  onGenerateImage,
  isGeneratingImage,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
}) {
  if (block.type === "hero" || block.type === "image") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={String(block.data?.image || "")}
            onChange={(e) => onUpdate({ image: e.target.value })}
            placeholder="https://..."
            data-testid={`settings-image-url-${block.id}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Alt Text</Label>
          <Input
            value={String(block.data?.alt || "")}
            onChange={(e) => onUpdate({ alt: e.target.value })}
            placeholder="Describe the image..."
            data-testid={`settings-image-alt-${block.id}`}
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>AI Image Generation</Label>
          <Button variant="outline" className="w-full" onClick={onGenerateImage} disabled={isGeneratingImage} data-testid={`settings-generate-image-${block.id}`}>
            {isGeneratingImage ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate with AI
          </Button>
        </div>
      </div>
    );
  }

  if (block.type === "cta") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={String(block.data?.text || "")}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Click here"
            data-testid={`settings-cta-text-${block.id}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Button URL</Label>
          <Input
            value={String(block.data?.url || "")}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="https://..."
            data-testid={`settings-cta-url-${block.id}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      <p>Edit this block directly on the canvas.</p>
    </div>
  );
}

// Page Settings Panel
function PageSettingsPanel({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  status,
  onStatusChange,
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  primaryKeyword,
  onPrimaryKeywordChange,
  contentId,
}: {
  title: string;
  onTitleChange: (v: string) => void;
  slug: string;
  onSlugChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  metaTitle: string;
  onMetaTitleChange: (v: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (v: string) => void;
  primaryKeyword: string;
  onPrimaryKeywordChange: (v: string) => void;
  contentId?: string;
}) {
  return (
    <div className="space-y-6">
      {/* Basic */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Basic</h4>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => {
              onTitleChange(e.target.value);
              if (!slug || slug === generateSlug(title)) {
                onSlugChange(generateSlug(e.target.value));
              }
            }}
            placeholder="Page title..."
            data-testid="settings-title"
          />
        </div>
        <div className="space-y-2">
          <Label>URL Slug</Label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">/</span>
            <Input
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="url-slug"
              className="font-mono text-sm"
              data-testid="settings-slug"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger data-testid="settings-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* SEO */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">SEO</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Meta Title</Label>
            <span className={`text-xs ${metaTitle.length > 60 ? "text-destructive" : "text-muted-foreground"}`}>
              {metaTitle.length}/60
            </span>
          </div>
          <Input
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder="SEO title..."
            data-testid="settings-meta-title"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Meta Description</Label>
            <span className={`text-xs ${metaDescription.length > 155 ? "text-destructive" : "text-muted-foreground"}`}>
              {metaDescription.length}/155
            </span>
          </div>
          <Textarea
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="SEO description..."
            className="min-h-[80px]"
            data-testid="settings-meta-description"
          />
        </div>
        <div className="space-y-2">
          <Label>Primary Keyword</Label>
          <Input
            value={primaryKeyword}
            onChange={(e) => onPrimaryKeywordChange(e.target.value)}
            placeholder="Main keyword..."
            data-testid="settings-primary-keyword"
          />
        </div>
      </div>

      <Separator />

      {/* Search Preview */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Search Preview</h4>
        <div className="p-3 rounded-lg bg-muted space-y-1">
          <div className="text-blue-600 dark:text-blue-400 truncate">
            {metaTitle || title || "Page Title"}
          </div>
          <div className="text-green-700 dark:text-green-500 text-sm font-mono truncate">
            example.com/{slug || "page-url"}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {metaDescription || "Meta description will appear here..."}
          </div>
        </div>
      </div>

      {contentId && (
        <>
          <Separator />
          <SchemaPreview contentId={contentId} />
        </>
      )}
    </div>
  );
}
