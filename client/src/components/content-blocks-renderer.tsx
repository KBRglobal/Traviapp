import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";
import { Star, Lightbulb, Check, Info, ExternalLink } from "lucide-react";
import type { ContentBlock } from "@shared/schema";

interface HeroBlockData {
  title?: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface TextBlockData {
  heading?: string;
  content?: string;
}

interface ImageBlockData {
  url?: string;
  alt?: string;
  caption?: string;
}

interface GalleryBlockData {
  images?: { url: string; alt?: string }[];
}

interface FaqBlockData {
  questions?: { question: string; answer: string }[];
  // Editor format: single Q&A
  question?: string;
  answer?: string;
}

interface CtaBlockData {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface InfoGridBlockData {
  items?: { icon?: string; title: string; value: string }[];
}

interface HighlightsBlockData {
  title?: string;
  items?: string[];
  content?: string; // Editor format: newline-separated string
}

interface RoomCardsBlockData {
  rooms?: {
    image?: string;
    title: string;
    features?: string[];
    price?: string;
    ctaText?: string;
    ctaLink?: string;
  }[];
}

interface TipsBlockData {
  title?: string;
  tips?: string[];
  items?: string[]; // Editor uses 'items' instead of 'tips'
  content?: string; // RSS format: newline-separated string
}

function HeroBlock({ data }: { data: HeroBlockData }) {
  if (!data.image && !data.title) return null;
  
  return (
    <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-8">
      {data.image && (
        <img
          src={data.image}
          alt={data.title || "Hero image"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {(data.title || data.subtitle) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
          {data.title && (
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white mb-2">
              {data.title}
            </h2>
          )}
          {data.subtitle && (
            <p className="text-white/90 text-lg max-w-2xl">{data.subtitle}</p>
          )}
          {data.ctaText && data.ctaLink && (
            <div className="mt-4">
              <Link href={data.ctaLink}>
                <Button className="bg-primary hover:bg-primary/90" data-testid="button-hero-cta">
                  {data.ctaText}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TextBlock({ data }: { data: TextBlockData }) {
  if (!data.content) return null;
  
  return (
    <Card className="p-6" data-testid="block-text">
      {data.heading && (
        <h2 className="font-heading text-xl font-semibold mb-4">{data.heading}</h2>
      )}
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </Card>
  );
}

function ImageBlock({ data }: { data: ImageBlockData }) {
  if (!data.url) return null;
  
  return (
    <figure className="rounded-xl overflow-hidden" data-testid="block-image">
      <img
        src={data.url}
        alt={data.alt || "Content image"}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
      {data.caption && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}

function GalleryBlock({ data }: { data: GalleryBlockData }) {
  if (!data.images?.length) return null;
  
  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      role="list"
      aria-label="Image gallery"
      data-testid="block-gallery"
    >
      {data.images.map((image, index) => (
        <div 
          key={index}
          className="aspect-square rounded-xl overflow-hidden"
          role="listitem"
        >
          <img
            src={image.url}
            alt={image.alt || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

function FaqBlock({ data }: { data: FaqBlockData }) {
  // Support both formats: array of Q&As (questions) or single Q&A (question/answer)
  if (data.questions?.length) {
    // Original format: array of questions
    return (
      <Card className="p-6" data-testid="block-faq">
        <h2 className="font-heading text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {data.questions.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    );
  }
  
  // Editor format: single Q&A block
  if (data.question && data.answer) {
    return (
      <Card className="p-4" data-testid="block-faq">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-single">
            <AccordionTrigger className="text-left font-medium">
              {data.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {data.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    );
  }
  
  return null;
}

function CtaBlock({ data }: { data: CtaBlockData }) {
  if (!data.title && !data.buttonText) return null;
  
  return (
    <Card 
      className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20"
      data-testid="block-cta"
    >
      <div className="text-center max-w-2xl mx-auto">
        {data.title && (
          <h2 className="font-heading text-2xl font-bold mb-3">{data.title}</h2>
        )}
        {data.description && (
          <p className="text-muted-foreground mb-6">{data.description}</p>
        )}
        {data.buttonText && (
          <Link href={data.buttonLink || "#"}>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-cta-action">
              {data.buttonText}
              <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}

function InfoGridBlock({ data }: { data: InfoGridBlockData }) {
  if (!data.items?.length) return null;
  
  return (
    <Card className="p-6" data-testid="block-info-grid">
      <h2 className="font-heading text-xl font-semibold mb-4">Essential Information</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{item.title}</div>
              <div className="font-medium">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HighlightsBlock({ data }: { data: HighlightsBlockData }) {
  // Support both formats: array (items) or newline-separated string (content)
  const items = data.items?.length 
    ? data.items 
    : data.content 
      ? data.content.split('\n').filter(item => item.trim())
      : [];
  
  if (!items.length) return null;
  
  return (
    <Card className="p-6" data-testid="block-highlights">
      {data.title && (
        <h2 className="font-heading text-xl font-semibold mb-4">{data.title}</h2>
      )}
      <ul className="space-y-3" role="list">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3" role="listitem">
            <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RoomCardsBlock({ data }: { data: RoomCardsBlockData }) {
  if (!data.rooms?.length) return null;
  
  return (
    <div className="space-y-4" data-testid="block-room-cards">
      <h2 className="font-heading text-xl font-semibold">Room Types</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {data.rooms.map((room, index) => (
          <Card key={index} className="overflow-hidden">
            {room.image && (
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-heading font-semibold text-lg mb-2">{room.title}</h3>
              {room.features && room.features.length > 0 && (
                <ul className="space-y-1 mb-4" role="list">
                  {room.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground" role="listitem">
                      <Check className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between gap-4">
                {room.price && (
                  <div>
                    <span className="text-sm text-muted-foreground">From</span>
                    <div className="font-bold text-lg">{room.price}</div>
                  </div>
                )}
                {room.ctaText && (
                  <Link href={room.ctaLink || "#"}>
                    <Button size="sm" data-testid={`button-room-cta-${index}`}>
                      {room.ctaText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TipsBlock({ data }: { data: TipsBlockData }) {
  // Support all formats: tips array, items array (editor), or newline string (RSS)
  const tips = data.tips?.length 
    ? data.tips 
    : data.items?.length
      ? data.items
      : data.content 
        ? data.content.split('\n').filter(tip => tip.trim())
        : [];
  
  if (!tips.length) return null;
  
  return (
    <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800" data-testid="block-tips">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-lg font-semibold mb-3">
            {data.title || "Pro Tips"}
          </h2>
          <ul className="space-y-2" role="list">
            {tips.map((tip, index) => (
              <li key={index} className="text-muted-foreground text-sm" role="listitem">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

interface ContentBlocksRendererProps {
  blocks: ContentBlock[];
}

export function ContentBlocksRenderer({ blocks }: ContentBlocksRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-8" data-testid="content-blocks">
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case "hero":
            return <HeroBlock key={block.id} data={block.data as HeroBlockData} />;
          case "text":
            return <TextBlock key={block.id} data={block.data as TextBlockData} />;
          case "image":
            return <ImageBlock key={block.id} data={block.data as ImageBlockData} />;
          case "gallery":
            return <GalleryBlock key={block.id} data={block.data as GalleryBlockData} />;
          case "faq":
            return <FaqBlock key={block.id} data={block.data as FaqBlockData} />;
          case "cta":
            return <CtaBlock key={block.id} data={block.data as CtaBlockData} />;
          case "info_grid":
            return <InfoGridBlock key={block.id} data={block.data as InfoGridBlockData} />;
          case "highlights":
            return <HighlightsBlock key={block.id} data={block.data as HighlightsBlockData} />;
          case "room_cards":
            return <RoomCardsBlock key={block.id} data={block.data as RoomCardsBlockData} />;
          case "tips":
            return <TipsBlock key={block.id} data={block.data as TipsBlockData} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
