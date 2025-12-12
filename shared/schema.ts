import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const contentTypeEnum = pgEnum("content_type", ["attraction", "hotel", "article", "dining", "district", "transport"]);
export const contentStatusEnum = pgEnum("content_status", ["draft", "in_review", "approved", "scheduled", "published"]);
export const articleCategoryEnum = pgEnum("article_category", ["attractions", "hotels", "food", "transport", "events", "tips", "news", "shopping"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("editor"),
});

// Content table - base table for all content types
export const contents = pgTable("contents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: contentTypeEnum("type").notNull(),
  status: contentStatusEnum("status").notNull().default("draft"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  primaryKeyword: text("primary_keyword"),
  secondaryKeywords: jsonb("secondary_keywords").$type<string[]>().default([]),
  lsiKeywords: jsonb("lsi_keywords").$type<string[]>().default([]),
  heroImage: text("hero_image"),
  heroImageAlt: text("hero_image_alt"),
  blocks: jsonb("blocks").$type<ContentBlock[]>().default([]),
  seoSchema: jsonb("seo_schema").$type<Record<string, unknown>>(),
  wordCount: integer("word_count").default(0),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attractions specific data
export const attractions = pgTable("attractions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  location: text("location"),
  duration: text("duration"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  primaryCta: text("primary_cta"),
  quickInfoBar: jsonb("quick_info_bar").$type<QuickInfoItem[]>().default([]),
  highlights: jsonb("highlights").$type<HighlightItem[]>().default([]),
  ticketInfo: jsonb("ticket_info").$type<TicketInfoItem[]>().default([]),
  essentialInfo: jsonb("essential_info").$type<EssentialInfoItem[]>().default([]),
  visitorTips: jsonb("visitor_tips").$type<string[]>().default([]),
  faq: jsonb("faq").$type<FaqItem[]>().default([]),
  relatedAttractions: jsonb("related_attractions").$type<RelatedItem[]>().default([]),
  trustSignals: jsonb("trust_signals").$type<string[]>().default([]),
});

// Hotels specific data
export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  location: text("location"),
  starRating: integer("star_rating"),
  numberOfRooms: integer("number_of_rooms"),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  primaryCta: text("primary_cta"),
  quickInfoBar: jsonb("quick_info_bar").$type<QuickInfoItem[]>().default([]),
  highlights: jsonb("highlights").$type<HighlightItem[]>().default([]),
  roomTypes: jsonb("room_types").$type<RoomTypeItem[]>().default([]),
  essentialInfo: jsonb("essential_info").$type<EssentialInfoItem[]>().default([]),
  diningPreview: jsonb("dining_preview").$type<DiningItem[]>().default([]),
  activities: jsonb("activities").$type<string[]>().default([]),
  travelerTips: jsonb("traveler_tips").$type<string[]>().default([]),
  faq: jsonb("faq").$type<FaqItem[]>().default([]),
  locationNearby: jsonb("location_nearby").$type<NearbyItem[]>().default([]),
  relatedHotels: jsonb("related_hotels").$type<RelatedItem[]>().default([]),
  photoGallery: jsonb("photo_gallery").$type<GalleryImage[]>().default([]),
  trustSignals: jsonb("trust_signals").$type<string[]>().default([]),
});

// Articles specific data
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  category: articleCategoryEnum("category"),
  urgencyLevel: text("urgency_level"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  personality: text("personality"),
  tone: text("tone"),
  sourceRssFeedId: varchar("source_rss_feed_id"),
  sourceUrl: text("source_url"),
  quickFacts: jsonb("quick_facts").$type<string[]>().default([]),
  proTips: jsonb("pro_tips").$type<string[]>().default([]),
  warnings: jsonb("warnings").$type<string[]>().default([]),
  faq: jsonb("faq").$type<FaqItem[]>().default([]),
});

// Dining specific data
export const dining = pgTable("dining", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  location: text("location"),
  cuisineType: text("cuisine_type"),
  priceRange: text("price_range"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  primaryCta: text("primary_cta"),
  quickInfoBar: jsonb("quick_info_bar").$type<QuickInfoItem[]>().default([]),
  highlights: jsonb("highlights").$type<HighlightItem[]>().default([]),
  menuHighlights: jsonb("menu_highlights").$type<MenuHighlightItem[]>().default([]),
  essentialInfo: jsonb("essential_info").$type<EssentialInfoItem[]>().default([]),
  diningTips: jsonb("dining_tips").$type<string[]>().default([]),
  faq: jsonb("faq").$type<FaqItem[]>().default([]),
  relatedDining: jsonb("related_dining").$type<RelatedItem[]>().default([]),
  photoGallery: jsonb("photo_gallery").$type<GalleryImage[]>().default([]),
  trustSignals: jsonb("trust_signals").$type<string[]>().default([]),
});

// Districts specific data
export const districts = pgTable("districts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  location: text("location"),
  neighborhood: text("neighborhood"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  primaryCta: text("primary_cta"),
  quickInfoBar: jsonb("quick_info_bar").$type<QuickInfoItem[]>().default([]),
  highlights: jsonb("highlights").$type<HighlightItem[]>().default([]),
  thingsToDo: jsonb("things_to_do").$type<ThingsToDoItem[]>().default([]),
  essentialInfo: jsonb("essential_info").$type<EssentialInfoItem[]>().default([]),
  localTips: jsonb("local_tips").$type<string[]>().default([]),
  faq: jsonb("faq").$type<FaqItem[]>().default([]),
  relatedDistricts: jsonb("related_districts").$type<RelatedItem[]>().default([]),
  photoGallery: jsonb("photo_gallery").$type<GalleryImage[]>().default([]),
  trustSignals: jsonb("trust_signals").$type<string[]>().default([]),
});

// Transport specific data
export const transports = pgTable("transports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  transitMode: text("transit_mode"),
  routeInfo: text("route_info"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  primaryCta: text("primary_cta"),
  quickInfoBar: jsonb("quick_info_bar").$type<QuickInfoItem[]>().default([]),
  highlights: jsonb("highlights").$type<HighlightItem[]>().default([]),
  fareInfo: jsonb("fare_info").$type<FareInfoItem[]>().default([]),
  essentialInfo: jsonb("essential_info").$type<EssentialInfoItem[]>().default([]),
  travelTips: jsonb("travel_tips").$type<string[]>().default([]),
  faq: jsonb("faq").$type<FaqItem[]>().default([]),
  relatedTransport: jsonb("related_transport").$type<RelatedItem[]>().default([]),
  trustSignals: jsonb("trust_signals").$type<string[]>().default([]),
});

// RSS Feeds table
export const rssFeeds = pgTable("rss_feeds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: articleCategoryEnum("category"),
  isActive: boolean("is_active").default(true),
  lastFetchedAt: timestamp("last_fetched_at"),
  fetchIntervalMinutes: integer("fetch_interval_minutes").default(60),
  createdAt: timestamp("created_at").defaultNow(),
});

// Affiliate Links table
export const affiliateLinks = pgTable("affiliate_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").references(() => contents.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  productId: text("product_id"),
  anchor: text("anchor").notNull(),
  url: text("url").notNull(),
  placement: text("placement"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Media Library table
export const mediaFiles = pgTable("media_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Internal Links table
export const internalLinks = pgTable("internal_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceContentId: varchar("source_content_id").references(() => contents.id, { onDelete: "cascade" }),
  targetContentId: varchar("target_content_id").references(() => contents.id, { onDelete: "cascade" }),
  anchorText: text("anchor_text"),
  isAutoSuggested: boolean("is_auto_suggested").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Topic Bank table - for auto-generating articles when RSS lacks content
export const topicBank = pgTable("topic_bank", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: articleCategoryEnum("category"),
  keywords: jsonb("keywords").$type<string[]>().default([]),
  outline: text("outline"),
  priority: integer("priority").default(0),
  lastUsed: timestamp("last_used"),
  timesUsed: integer("times_used").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Keyword Repository table - SEO Bible for the system
export const keywordRepository = pgTable("keyword_repository", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyword: text("keyword").notNull().unique(),
  type: text("type").notNull(),
  category: text("category"),
  searchVolume: text("search_volume"),
  competition: text("competition"),
  relatedKeywords: jsonb("related_keywords").$type<string[]>().default([]),
  usageCount: integer("usage_count").default(0),
  priority: integer("priority").default(0),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const contentsRelations = relations(contents, ({ one, many }) => ({
  attraction: one(attractions, {
    fields: [contents.id],
    references: [attractions.contentId],
  }),
  hotel: one(hotels, {
    fields: [contents.id],
    references: [hotels.contentId],
  }),
  article: one(articles, {
    fields: [contents.id],
    references: [articles.contentId],
  }),
  diningData: one(dining, {
    fields: [contents.id],
    references: [dining.contentId],
  }),
  district: one(districts, {
    fields: [contents.id],
    references: [districts.contentId],
  }),
  transport: one(transports, {
    fields: [contents.id],
    references: [transports.contentId],
  }),
  affiliateLinks: many(affiliateLinks),
  sourceInternalLinks: many(internalLinks, { relationName: "sourceLinks" }),
  targetInternalLinks: many(internalLinks, { relationName: "targetLinks" }),
}));

export const affiliateLinksRelations = relations(affiliateLinks, ({ one }) => ({
  content: one(contents, {
    fields: [affiliateLinks.contentId],
    references: [contents.id],
  }),
}));

export const internalLinksRelations = relations(internalLinks, ({ one }) => ({
  sourceContent: one(contents, {
    fields: [internalLinks.sourceContentId],
    references: [contents.id],
    relationName: "sourceLinks",
  }),
  targetContent: one(contents, {
    fields: [internalLinks.targetContentId],
    references: [contents.id],
    relationName: "targetLinks",
  }),
}));

// Types for JSONB fields
export interface ContentBlock {
  id: string;
  type: "hero" | "text" | "image" | "gallery" | "faq" | "cta" | "info_grid" | "highlights" | "room_cards" | "tips";
  data: Record<string, unknown>;
  order: number;
}

export interface QuickInfoItem {
  icon: string;
  label: string;
  value: string;
}

export interface HighlightItem {
  image: string;
  title: string;
  description: string;
}

export interface TicketInfoItem {
  type: string;
  description: string;
  price?: string;
  affiliateLinkId?: string;
}

export interface EssentialInfoItem {
  icon: string;
  label: string;
  value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedItem {
  name: string;
  price?: string;
  link: string;
  image?: string;
}

export interface RoomTypeItem {
  image: string;
  title: string;
  features: string[];
  price: string;
  ctaText?: string;
  affiliateLinkId?: string;
}

export interface DiningItem {
  name: string;
  cuisine: string;
  description: string;
}

export interface NearbyItem {
  name: string;
  distance: string;
  type: string;
}

export interface GalleryImage {
  image: string;
  alt: string;
}

export interface MenuHighlightItem {
  name: string;
  description: string;
  price?: string;
}

export interface ThingsToDoItem {
  name: string;
  description: string;
  type: string;
}

export interface FareInfoItem {
  type: string;
  price: string;
  description?: string;
}

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContentSchema = createInsertSchema(contents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttractionSchema = createInsertSchema(attractions).omit({
  id: true,
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export const insertDiningSchema = createInsertSchema(dining).omit({
  id: true,
});

export const insertDistrictSchema = createInsertSchema(districts).omit({
  id: true,
});

export const insertTransportSchema = createInsertSchema(transports).omit({
  id: true,
});

export const insertRssFeedSchema = createInsertSchema(rssFeeds).omit({
  id: true,
  createdAt: true,
  lastFetchedAt: true,
});

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).omit({
  id: true,
  createdAt: true,
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true,
});

export const insertInternalLinkSchema = createInsertSchema(internalLinks).omit({
  id: true,
  createdAt: true,
});

export const insertTopicBankSchema = createInsertSchema(topicBank).omit({
  id: true,
  createdAt: true,
  lastUsed: true,
  timesUsed: true,
});

export const insertKeywordRepositorySchema = createInsertSchema(keywordRepository).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;
export type InsertAttraction = z.infer<typeof insertAttractionSchema>;
export type Attraction = typeof attractions.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Hotel = typeof hotels.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertDining = z.infer<typeof insertDiningSchema>;
export type Dining = typeof dining.$inferSelect;
export type InsertDistrict = z.infer<typeof insertDistrictSchema>;
export type District = typeof districts.$inferSelect;
export type InsertTransport = z.infer<typeof insertTransportSchema>;
export type Transport = typeof transports.$inferSelect;
export type InsertRssFeed = z.infer<typeof insertRssFeedSchema>;
export type RssFeed = typeof rssFeeds.$inferSelect;
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertInternalLink = z.infer<typeof insertInternalLinkSchema>;
export type InternalLink = typeof internalLinks.$inferSelect;
export type InsertTopicBank = z.infer<typeof insertTopicBankSchema>;
export type TopicBank = typeof topicBank.$inferSelect;
export type InsertKeywordRepository = z.infer<typeof insertKeywordRepositorySchema>;
export type KeywordRepository = typeof keywordRepository.$inferSelect;

// Full content types with relations
export type ContentWithRelations = Content & {
  attraction?: Attraction;
  hotel?: Hotel;
  article?: Article;
  diningData?: Dining;
  district?: District;
  transport?: Transport;
  affiliateLinks?: AffiliateLink[];
};
