import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const contentTypeEnum = pgEnum("content_type", ["attraction", "hotel", "article", "dining", "district", "transport", "event", "itinerary"]);
export const contentStatusEnum = pgEnum("content_status", ["draft", "in_review", "approved", "scheduled", "published"]);
export const articleCategoryEnum = pgEnum("article_category", ["attractions", "hotels", "food", "transport", "events", "tips", "news", "shopping"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "author", "contributor", "viewer"]);
export const viralPotentialEnum = pgEnum("viral_potential", ["1", "2", "3", "4", "5"]);
export const topicTypeEnum = pgEnum("topic_type", ["trending", "evergreen", "seasonal"]);
export const topicFormatEnum = pgEnum("topic_format", ["video_tour", "photo_gallery", "pov_video", "cost_breakdown", "lifestyle_vlog", "documentary", "explainer", "comparison", "walking_tour", "food_tour", "interview", "tutorial", "asmr", "drone_footage", "night_photography", "infographic", "reaction_video", "challenge", "list_video", "guide", "review"]);
export const topicCategoryEnum = pgEnum("topic_category", ["luxury_lifestyle", "food_dining", "bizarre_unique", "experiences_activities", "money_cost", "expat_living", "dark_side", "myth_busting", "comparisons", "records_superlatives", "future_development", "seasonal_events", "practical_tips"]);

// Role-based permissions
export const ROLE_PERMISSIONS = {
  admin: {
    canCreate: true,
    canEdit: true,
    canEditOwn: true,
    canDelete: true,
    canPublish: true,
    canSubmitForReview: true,
    canManageUsers: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canViewAuditLogs: true,
    canAccessMediaLibrary: true,
    canAccessAffiliates: true,
    canViewAll: true,
  },
  editor: {
    canCreate: true,
    canEdit: true,
    canEditOwn: true,
    canDelete: false,
    canPublish: true,
    canSubmitForReview: true,
    canManageUsers: false,
    canManageSettings: false,
    canViewAnalytics: true,
    canViewAuditLogs: false,
    canAccessMediaLibrary: true,
    canAccessAffiliates: true,
    canViewAll: true,
  },
  author: {
    canCreate: true,
    canEdit: false,
    canEditOwn: true,
    canDelete: false,
    canPublish: false,
    canSubmitForReview: true,
    canManageUsers: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canViewAuditLogs: false,
    canAccessMediaLibrary: false,
    canAccessAffiliates: false,
    canViewAll: false,
  },
  contributor: {
    canCreate: true,
    canEdit: false,
    canEditOwn: true,
    canDelete: false,
    canPublish: false,
    canSubmitForReview: true,
    canManageUsers: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canViewAuditLogs: false,
    canAccessMediaLibrary: false,
    canAccessAffiliates: false,
    canViewAll: false,
  },
  viewer: {
    canCreate: false,
    canEdit: false,
    canEditOwn: false,
    canDelete: false,
    canPublish: false,
    canSubmitForReview: false,
    canManageUsers: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canViewAuditLogs: false,
    canAccessMediaLibrary: false,
    canAccessAffiliates: false,
    canViewAll: true,
  },
} as const;

export type UserRole = "admin" | "editor" | "author" | "contributor" | "viewer";
export type RolePermissions = typeof ROLE_PERMISSIONS[UserRole];

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// OTP codes table for passwordless email login
export const otpCodes = pgTable("otp_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  used: boolean("used").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOtpCodeSchema = createInsertSchema(otpCodes).omit({
  id: true,
  createdAt: true,
});

export type InsertOtpCode = z.infer<typeof insertOtpCodeSchema>;
export type OtpCode = typeof otpCodes.$inferSelect;

// Users table - with username/password auth and role-based permissions
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique(),
  passwordHash: varchar("password_hash"),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default("editor"),
  isActive: boolean("is_active").notNull().default(true),
  totpSecret: varchar("totp_secret"),
  totpEnabled: boolean("totp_enabled").notNull().default(false),
  totpRecoveryCodes: jsonb("totp_recovery_codes").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// UpsertUser type for Replit Auth
export type UpsertUser = typeof users.$inferInsert;

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
  seoScore: integer("seo_score"),
  wordCount: integer("word_count").default(0),
  viewCount: integer("view_count").default(0),
  authorId: varchar("author_id").references(() => users.id),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_contents_status").on(table.status),
  index("IDX_contents_type").on(table.type),
  index("IDX_contents_type_status").on(table.type, table.status),
  index("IDX_contents_author").on(table.authorId),
  index("IDX_contents_published_at").on(table.publishedAt),
]);

// Attractions specific data
export const attractions = pgTable("attractions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  location: text("location"),
  category: text("category"),
  priceFrom: text("price_from"),
  duration: text("duration"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  primaryCta: text("primary_cta"),
  introText: text("intro_text"),
  expandedIntroText: text("expanded_intro_text"),
  quickInfoBar: jsonb("quick_info_bar").$type<QuickInfoItem[]>().default([]),
  highlights: jsonb("highlights").$type<HighlightItem[]>().default([]),
  ticketInfo: jsonb("ticket_info").$type<TicketInfoItem[]>().default([]),
  essentialInfo: jsonb("essential_info").$type<EssentialInfoItem[]>().default([]),
  visitorTips: jsonb("visitor_tips").$type<string[]>().default([]),
  gallery: jsonb("gallery").$type<GalleryImage[]>().default([]),
  experienceSteps: jsonb("experience_steps").$type<ExperienceItem[]>().default([]),
  insiderTips: jsonb("insider_tips").$type<string[]>().default([]),
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
  subcategory: text("subcategory"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  primaryCta: text("primary_cta"),
  introText: text("intro_text"),
  expandedIntroText: text("expanded_intro_text"),
  quickInfoBar: jsonb("quick_info_bar").$type<QuickInfoItem[]>().default([]),
  highlights: jsonb("highlights").$type<HighlightItem[]>().default([]),
  thingsToDo: jsonb("things_to_do").$type<ThingsToDoItem[]>().default([]),
  attractionsGrid: jsonb("attractions_grid").$type<DistrictAttractionItem[]>().default([]),
  diningHighlights: jsonb("dining_highlights").$type<DiningHighlightItem[]>().default([]),
  realEstateInfo: jsonb("real_estate_info").$type<RealEstateInfoItem>(),
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

// Events specific data
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  eventDate: timestamp("event_date"),
  endDate: timestamp("end_date"),
  venue: text("venue"),
  venueAddress: text("venue_address"),
  ticketUrl: text("ticket_url"),
  ticketPrice: text("ticket_price"),
  isFeatured: boolean("is_featured").default(false),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: text("recurrence_pattern"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  organizer: text("organizer"),
  contactEmail: text("contact_email"),
  faq: jsonb("faq").$type<FaqItem[]>().default([]),
});

// Itineraries/Packages specific data
export const itineraries = pgTable("itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  duration: text("duration"),
  totalPrice: text("total_price"),
  difficultyLevel: text("difficulty_level"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  includedItems: jsonb("included_items").$type<string[]>().default([]),
  excludedItems: jsonb("excluded_items").$type<string[]>().default([]),
  dayPlan: jsonb("day_plan").$type<ItineraryDay[]>().default([]),
  primaryCta: text("primary_cta"),
  faq: jsonb("faq").$type<FaqItem[]>().default([]),
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
  headlineAngle: text("headline_angle"), // The hook/headline for viral content
  category: articleCategoryEnum("category"),
  mainCategory: topicCategoryEnum("main_category"), // Main topic category (luxury, food, etc.)
  viralPotential: viralPotentialEnum("viral_potential").default("3"), // 1-5 stars
  format: topicFormatEnum("format"), // video_tour, photo_gallery, etc.
  topicType: topicTypeEnum("topic_type").default("evergreen"), // trending, evergreen, seasonal
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

// Content Versions table - for tracking content history
export const contentVersions = pgTable("content_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  title: text("title").notNull(),
  slug: text("slug"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  primaryKeyword: text("primary_keyword"),
  heroImage: text("hero_image"),
  heroImageAlt: text("hero_image_alt"),
  blocks: jsonb("blocks").$type<ContentBlock[]>().default([]),
  changedBy: varchar("changed_by"),
  changeNote: text("change_note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Supported locales enum - Dubai/UAE focused languages (17 languages)
export const localeEnum = pgEnum("locale", [
  // 🔴 TIER 1 - Core Markets (Must Have)
  "en",  // English - primary business language
  "ar",  // Arabic - official language, 20% untapped potential
  "hi",  // Hindi - 38% of population (Indians)

  // 🟡 TIER 2 - High ROI Markets
  "zh",  // Chinese Simplified - growing investors
  "ru",  // Russian - wealthy investors
  "ur",  // Urdu - Pakistanis (12% of population)
  "fr",  // French - tourists & investors

  // 🟢 TIER 3 - Growing Markets
  "de",  // German - European tourists
  "fa",  // Farsi/Persian - Iranian business community
  "bn",  // Bengali - large expat community
  "fil", // Filipino - large expat community

  // ⚪ TIER 4 - Niche Markets
  "es",  // Spanish
  "tr",  // Turkish
  "it",  // Italian
  "ja",  // Japanese - luxury market
  "ko",  // Korean - growing tourism
  "he",  // Hebrew - Israeli investors
]);

export const translationStatusEnum = pgEnum("translation_status", ["pending", "in_progress", "completed", "needs_review"]);

// Content Fingerprints table - for RSS deduplication
export const contentFingerprints = pgTable("content_fingerprints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").references(() => contents.id, { onDelete: "cascade" }),
  fingerprint: text("fingerprint").notNull().unique(),
  sourceUrl: text("source_url"),
  sourceTitle: text("source_title"),
  rssFeedId: varchar("rss_feed_id").references(() => rssFeeds.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Translations table - for multi-language content
export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  locale: localeEnum("locale").notNull(),
  status: translationStatusEnum("status").notNull().default("pending"),
  title: text("title"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  blocks: jsonb("blocks").$type<ContentBlock[]>().default([]),
  translatedBy: varchar("translated_by"),
  reviewedBy: varchar("reviewed_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("IDX_translations_content_locale").on(table.contentId, table.locale),
  index("IDX_translations_locale").on(table.locale),
  index("IDX_translations_status").on(table.status),
]);

// Homepage Promotions table - for curating homepage sections
export const homepageSectionEnum = pgEnum("homepage_section", ["featured", "attractions", "hotels", "articles", "trending"]);

export const homepagePromotions = pgTable("homepage_promotions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: homepageSectionEnum("section").notNull(),
  contentId: varchar("content_id").references(() => contents.id, { onDelete: "cascade" }),
  position: integer("position").default(0),
  isActive: boolean("is_active").default(true),
  customTitle: text("custom_title"),
  customImage: text("custom_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Views table - for analytics tracking
export const contentViews = pgTable("content_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").defaultNow(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  sessionId: varchar("session_id"),
  country: varchar("country"),
  city: varchar("city"),
});

// Audit action type enum
export const auditActionTypeEnum = pgEnum("audit_action_type", [
  "create", "update", "delete", "publish", "unpublish",
  "submit_for_review", "approve", "reject", "login", "logout",
  "user_create", "user_update", "user_delete", "role_change",
  "settings_change", "media_upload", "media_delete", "restore"
]);

// Audit entity type enum
export const auditEntityTypeEnum = pgEnum("audit_entity_type", [
  "content", "user", "media", "settings", "rss_feed",
  "affiliate_link", "translation", "session", "tag", "cluster",
  "campaign", "newsletter_subscriber"
]);

// Audit Logs table - immutable append-only logging
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  userName: text("user_name"),
  userRole: text("user_role"),
  actionType: auditActionTypeEnum("action_type").notNull(),
  entityType: auditEntityTypeEnum("entity_type").notNull(),
  entityId: varchar("entity_id"),
  description: text("description").notNull(),
  beforeState: jsonb("before_state").$type<Record<string, unknown>>(),
  afterState: jsonb("after_state").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
}, (table) => [
  index("IDX_audit_logs_timestamp").on(table.timestamp),
  index("IDX_audit_logs_user_id").on(table.userId),
  index("IDX_audit_logs_entity").on(table.entityType, table.entityId),
]);

// Audit log insert schema and types
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// Subscriber status enum for newsletter
export const subscriberStatusEnum = pgEnum("subscriber_status", [
  "pending_confirmation",
  "subscribed", 
  "unsubscribed",
  "bounced",
  "complained"
]);

// Consent log entry type
export interface ConsentLogEntry {
  action: "subscribe" | "confirm" | "unsubscribe" | "resubscribe";
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  source?: string;
}

// Newsletter Subscribers table - for coming soon page signups
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  source: varchar("source").default("coming_soon"),
  status: subscriberStatusEnum("status").notNull().default("pending_confirmation"),
  ipAddress: varchar("ip_address"),
  confirmToken: varchar("confirm_token"),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  consentLog: jsonb("consent_log").$type<ConsentLogEntry[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
  confirmedAt: true,
  unsubscribedAt: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type SubscriberStatus = "pending_confirmation" | "subscribed" | "unsubscribed" | "bounced" | "complained";

// Lead status enum for property inquiries
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "negotiating",
  "won",
  "lost"
]);

// Property Leads table - for off-plan property inquiries
export const propertyLeads = pgTable("property_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  name: varchar("name").notNull(),
  phone: varchar("phone"),
  propertyType: varchar("property_type"),
  budget: varchar("budget"),
  paymentMethod: varchar("payment_method"),
  preferredAreas: text("preferred_areas").array(),
  timeline: varchar("timeline"),
  message: text("message"),
  source: varchar("source").default("off-plan-form"),
  status: leadStatusEnum("status").notNull().default("new"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  consentGiven: boolean("consent_given").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  notes: text("notes"),
});

export const insertPropertyLeadSchema = createInsertSchema(propertyLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPropertyLead = z.infer<typeof insertPropertyLeadSchema>;
export type PropertyLead = typeof propertyLeads.$inferSelect;

// Campaign status enum
export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "scheduled",
  "sending",
  "sent",
  "failed"
]);

// Email event type enum
export const emailEventTypeEnum = pgEnum("email_event_type", [
  "sent",
  "delivered",
  "opened",
  "clicked",
  "bounced",
  "complained",
  "unsubscribed"
]);

// Newsletter Campaigns table
export const newsletterCampaigns = pgTable("newsletter_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  subject: varchar("subject").notNull(),
  previewText: varchar("preview_text"),
  htmlContent: text("html_content").notNull(),
  status: campaignStatusEnum("status").notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
  totalRecipients: integer("total_recipients").default(0),
  totalSent: integer("total_sent").default(0),
  totalOpened: integer("total_opened").default(0),
  totalClicked: integer("total_clicked").default(0),
  totalBounced: integer("total_bounced").default(0),
  totalUnsubscribed: integer("total_unsubscribed").default(0),
});

export const insertCampaignSchema = createInsertSchema(newsletterCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sentAt: true,
  totalRecipients: true,
  totalSent: true,
  totalOpened: true,
  totalClicked: true,
  totalBounced: true,
  totalUnsubscribed: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type NewsletterCampaign = typeof newsletterCampaigns.$inferSelect;
export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "failed";

// Campaign Events table (for tracking opens, clicks, bounces, etc.)
export const campaignEvents = pgTable("campaign_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull().references(() => newsletterCampaigns.id, { onDelete: "cascade" }),
  subscriberId: varchar("subscriber_id").references(() => newsletterSubscribers.id, { onDelete: "set null" }),
  eventType: emailEventTypeEnum("event_type").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCampaignEventSchema = createInsertSchema(campaignEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertCampaignEvent = z.infer<typeof insertCampaignEventSchema>;
export type CampaignEvent = typeof campaignEvents.$inferSelect;
export type EmailEventType = "sent" | "delivered" | "opened" | "clicked" | "bounced" | "complained" | "unsubscribed";

// Relations
export const contentsRelations = relations(contents, ({ one, many }) => ({
  author: one(users, {
    fields: [contents.authorId],
    references: [users.id],
  }),
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
  event: one(events, {
    fields: [contents.id],
    references: [events.contentId],
  }),
  itinerary: one(itineraries, {
    fields: [contents.id],
    references: [itineraries.contentId],
  }),
  affiliateLinks: many(affiliateLinks),
  sourceInternalLinks: many(internalLinks, { relationName: "sourceLinks" }),
  targetInternalLinks: many(internalLinks, { relationName: "targetLinks" }),
  views: many(contentViews),
}));

export const contentViewsRelations = relations(contentViews, ({ one }) => ({
  content: one(contents, {
    fields: [contentViews.contentId],
    references: [contents.id],
  }),
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
  id?: string;
  type: string;
  data: Record<string, unknown>;
  order?: number;
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
  label?: string;
  value?: string;
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

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: { time: string; activity: string; location?: string }[];
}

export interface ExperienceItem {
  icon: string;
  title: string;
  description: string;
}

export interface DistrictAttractionItem {
  name: string;
  description: string;
  image?: string;
  type: string;
  isNew?: boolean;
}

export interface DiningHighlightItem {
  name: string;
  cuisine: string;
  description: string;
  image?: string;
  priceRange?: string;
}

export interface RealEstateInfoItem {
  overview: string;
  priceRange?: string;
  highlights: string[];
  targetBuyers?: string[];
}

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertItinerarySchema = createInsertSchema(itineraries).omit({
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
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;
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

export const insertContentVersionSchema = createInsertSchema(contentVersions).omit({
  id: true,
  createdAt: true,
});
export type InsertContentVersion = z.infer<typeof insertContentVersionSchema>;
export type ContentVersion = typeof contentVersions.$inferSelect;

export const insertContentFingerprintSchema = createInsertSchema(contentFingerprints).omit({
  id: true,
  createdAt: true,
});
export type InsertContentFingerprint = z.infer<typeof insertContentFingerprintSchema>;
export type ContentFingerprint = typeof contentFingerprints.$inferSelect;

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;

export const insertHomepagePromotionSchema = createInsertSchema(homepagePromotions).omit({
  id: true,
  createdAt: true,
});
export type InsertHomepagePromotion = z.infer<typeof insertHomepagePromotionSchema>;
export type HomepagePromotion = typeof homepagePromotions.$inferSelect;
export type HomepageSection = "featured" | "attractions" | "hotels" | "articles" | "trending";

export const insertContentViewSchema = createInsertSchema(contentViews).omit({
  id: true,
  viewedAt: true,
});
export type InsertContentView = z.infer<typeof insertContentViewSchema>;
export type ContentView = typeof contentViews.$inferSelect;

// Dubai/UAE focused languages (17 languages)
export type Locale =
  | "en" | "ar" | "hi"                    // Tier 1 - Core
  | "zh" | "ru" | "ur" | "fr"             // Tier 2 - High ROI
  | "de" | "fa" | "bn" | "fil"            // Tier 3 - Growing
  | "es" | "tr" | "it" | "ja" | "ko" | "he";  // Tier 4 - Niche

export type TranslationStatus = "pending" | "in_progress" | "completed" | "needs_review";

// RTL languages (right-to-left)
export const RTL_LOCALES: Locale[] = ["ar", "fa", "ur", "he"];

// 17 Supported Languages for Dubai/UAE Market
export const SUPPORTED_LOCALES: { code: Locale; name: string; nativeName: string; region: string; tier: number }[] = [
  // 🔴 TIER 1 - Core Markets (Must Have)
  { code: "en", name: "English", nativeName: "English", region: "Global", tier: 1 },
  { code: "ar", name: "Arabic", nativeName: "العربية", region: "Middle East", tier: 1 },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "South Asia", tier: 1 },

  // 🟡 TIER 2 - High ROI Markets
  { code: "zh", name: "Chinese", nativeName: "简体中文", region: "East Asia", tier: 2 },
  { code: "ru", name: "Russian", nativeName: "Русский", region: "CIS", tier: 2 },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "South Asia", tier: 2 },
  { code: "fr", name: "French", nativeName: "Français", region: "Europe", tier: 2 },

  // 🟢 TIER 3 - Growing Markets
  { code: "de", name: "German", nativeName: "Deutsch", region: "Europe", tier: 3 },
  { code: "fa", name: "Persian", nativeName: "فارسی", region: "Middle East", tier: 3 },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "South Asia", tier: 3 },
  { code: "fil", name: "Filipino", nativeName: "Filipino", region: "Southeast Asia", tier: 3 },

  // ⚪ TIER 4 - Niche Markets
  { code: "es", name: "Spanish", nativeName: "Español", region: "Americas", tier: 4 },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", region: "Middle East", tier: 4 },
  { code: "it", name: "Italian", nativeName: "Italiano", region: "Europe", tier: 4 },
  { code: "ja", name: "Japanese", nativeName: "日本語", region: "East Asia", tier: 4 },
  { code: "ko", name: "Korean", nativeName: "한국어", region: "East Asia", tier: 4 },
  { code: "he", name: "Hebrew", nativeName: "עברית", region: "Middle East", tier: 4 },
];

// Content Tags table - for smart tagging system
export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: varchar("color"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  usageCount: true,
  createdAt: true,
});
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// Content-Tag junction table
export const contentTags = pgTable("content_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  tagId: varchar("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_content_tags_content").on(table.contentId),
  index("IDX_content_tags_tag").on(table.tagId),
]);

export const insertContentTagSchema = createInsertSchema(contentTags).omit({
  id: true,
  createdAt: true,
});
export type InsertContentTag = z.infer<typeof insertContentTagSchema>;
export type ContentTag = typeof contentTags.$inferSelect;

// Content Clusters table - for pillar page structure
export const contentClusters = pgTable("content_clusters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  pillarContentId: varchar("pillar_content_id").references(() => contents.id, { onDelete: "set null" }),
  primaryKeyword: text("primary_keyword"),
  color: varchar("color"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContentClusterSchema = createInsertSchema(contentClusters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertContentCluster = z.infer<typeof insertContentClusterSchema>;
export type ContentCluster = typeof contentClusters.$inferSelect;

// Cluster Members - linking content to clusters
export const clusterMembers = pgTable("cluster_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clusterId: varchar("cluster_id").notNull().references(() => contentClusters.id, { onDelete: "cascade" }),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  position: integer("position").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_cluster_members_cluster").on(table.clusterId),
  index("IDX_cluster_members_content").on(table.contentId),
]);

export const insertClusterMemberSchema = createInsertSchema(clusterMembers).omit({
  id: true,
  createdAt: true,
});
export type InsertClusterMember = z.infer<typeof insertClusterMemberSchema>;
export type ClusterMember = typeof clusterMembers.$inferSelect;

// Content Templates table - for reusable content structures
export const contentTemplates = pgTable("content_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  contentType: contentTypeEnum("content_type").notNull(),
  blocks: jsonb("blocks").$type<ContentBlock[]>().default([]),
  extensionDefaults: jsonb("extension_defaults").$type<Record<string, unknown>>(),
  seoDefaults: jsonb("seo_defaults").$type<Record<string, unknown>>(),
  isPublic: boolean("is_public").default(false),
  usageCount: integer("usage_count").default(0),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContentTemplateSchema = createInsertSchema(contentTemplates).omit({
  id: true,
  usageCount: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertContentTemplate = z.infer<typeof insertContentTemplateSchema>;
export type ContentTemplate = typeof contentTemplates.$inferSelect;

// Site Settings table - for global configuration
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  value: jsonb("value").$type<unknown>(),
  category: varchar("category").notNull(),
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// SEO Analysis Results table - cached analysis for content
export const seoAnalysisResults = pgTable("seo_analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  overallScore: integer("overall_score").notNull(),
  titleScore: integer("title_score"),
  metaDescriptionScore: integer("meta_description_score"),
  keywordScore: integer("keyword_score"),
  contentScore: integer("content_score"),
  readabilityScore: integer("readability_score"),
  technicalScore: integer("technical_score"),
  issues: jsonb("issues").$type<SeoIssue[]>().default([]),
  suggestions: jsonb("suggestions").$type<SeoSuggestion[]>().default([]),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
}, (table) => [
  index("IDX_seo_analysis_content").on(table.contentId),
]);

// SEO Issue and Suggestion types
export interface SeoIssue {
  type: "error" | "warning" | "info";
  category: string;
  message: string;
  field?: string;
  impact: "high" | "medium" | "low";
}

export interface SeoSuggestion {
  category: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
  estimatedImpact?: string;
}

export const insertSeoAnalysisResultSchema = createInsertSchema(seoAnalysisResults).omit({
  id: true,
  analyzedAt: true,
});
export type InsertSeoAnalysisResult = z.infer<typeof insertSeoAnalysisResultSchema>;
export type SeoAnalysisResult = typeof seoAnalysisResults.$inferSelect;

// Full content types with relations
export type ContentWithRelations = Content & {
  author?: User;
  attraction?: Attraction;
  hotel?: Hotel;
  article?: Article;
  dining?: Dining;
  district?: District;
  transport?: Transport;
  event?: Event;
  itinerary?: Itinerary;
  affiliateLinks?: (AffiliateLink & { label?: string; price?: string })[];
  translations?: Translation[];
  views?: ContentView[];
  tags?: Tag[];
  cluster?: ContentCluster;
  versions?: ContentVersion[];
  seoAnalysis?: SeoAnalysisResult;
};

// ============================================================================
// ENTERPRISE FEATURES - Teams, Workflows, Notifications, etc.
// ============================================================================

// Teams / Departments
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: varchar("parent_id").references((): any => teams.id),
  color: varchar("color", { length: 7 }), // hex color
  icon: varchar("icon", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_teams_parent").on(table.parentId),
  index("IDX_teams_slug").on(table.slug),
]);

export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).default("member"), // lead, member
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => [
  uniqueIndex("IDX_team_members_unique").on(table.teamId, table.userId),
  index("IDX_team_members_user").on(table.userId),
]);

export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true, joinedAt: true });
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;

// Content Workflows
export const workflowStatusEnum = pgEnum("workflow_status", ["pending", "in_progress", "approved", "rejected", "cancelled"]);

export const workflowTemplates = pgTable("workflow_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  contentTypes: jsonb("content_types").$type<string[]>().default([]), // which content types use this workflow
  steps: jsonb("steps").$type<WorkflowStep[]>().default([]),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export interface WorkflowStep {
  order: number;
  name: string;
  description?: string;
  approverType: "user" | "role" | "team";
  approverId?: string; // user id, role name, or team id
  autoApproveAfter?: number; // hours
  notifyOnPending: boolean;
}

export const workflowInstances = pgTable("workflow_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").references(() => workflowTemplates.id),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  status: workflowStatusEnum("status").default("pending"),
  currentStep: integer("current_step").default(0),
  submittedBy: varchar("submitted_by").references(() => users.id),
  submittedAt: timestamp("submitted_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
}, (table) => [
  index("IDX_workflow_instances_content").on(table.contentId),
  index("IDX_workflow_instances_status").on(table.status),
]);

export const workflowApprovals = pgTable("workflow_approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  instanceId: varchar("instance_id").notNull().references(() => workflowInstances.id, { onDelete: "cascade" }),
  stepNumber: integer("step_number").notNull(),
  approverId: varchar("approver_id").references(() => users.id),
  status: workflowStatusEnum("status").default("pending"),
  comment: text("comment"),
  decidedAt: timestamp("decided_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_workflow_approvals_instance").on(table.instanceId),
  index("IDX_workflow_approvals_approver").on(table.approverId),
]);

export const insertWorkflowTemplateSchema = createInsertSchema(workflowTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWorkflowInstanceSchema = createInsertSchema(workflowInstances).omit({ id: true, submittedAt: true });
export type InsertWorkflowTemplate = z.infer<typeof insertWorkflowTemplateSchema>;
export type InsertWorkflowInstance = z.infer<typeof insertWorkflowInstanceSchema>;
export type WorkflowTemplate = typeof workflowTemplates.$inferSelect;
export type WorkflowInstance = typeof workflowInstances.$inferSelect;
export type WorkflowApproval = typeof workflowApprovals.$inferSelect;

// Activity Feed
export const activityTypeEnum = pgEnum("activity_type", [
  "content_created", "content_updated", "content_published", "content_deleted",
  "comment_added", "workflow_submitted", "workflow_approved", "workflow_rejected",
  "user_joined", "user_updated", "team_created", "translation_completed",
  "media_uploaded", "settings_changed", "login", "logout"
]);

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: activityTypeEnum("type").notNull(),
  actorId: varchar("actor_id").references(() => users.id),
  targetType: varchar("target_type", { length: 50 }), // content, user, team, etc.
  targetId: varchar("target_id"),
  targetTitle: text("target_title"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  teamId: varchar("team_id").references(() => teams.id), // for team-scoped activities
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_activities_actor").on(table.actorId),
  index("IDX_activities_target").on(table.targetType, table.targetId),
  index("IDX_activities_team").on(table.teamId),
  index("IDX_activities_created").on(table.createdAt),
]);

export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Content Locking
export const contentLocks = pgTable("content_locks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lockedAt: timestamp("locked_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true),
}, (table) => [
  uniqueIndex("IDX_content_locks_active").on(table.contentId).where(sql`is_active = true`),
  index("IDX_content_locks_user").on(table.userId),
  index("IDX_content_locks_expires").on(table.expiresAt),
]);

export const insertContentLockSchema = createInsertSchema(contentLocks).omit({ id: true, lockedAt: true });
export type InsertContentLock = z.infer<typeof insertContentLockSchema>;
export type ContentLock = typeof contentLocks.$inferSelect;

// Notifications
export const notificationTypeEnum = pgEnum("notification_type", [
  "info", "success", "warning", "error",
  "workflow_pending", "workflow_approved", "workflow_rejected",
  "comment_mention", "comment_reply", "content_assigned",
  "system"
]);

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").default("info"),
  title: text("title").notNull(),
  message: text("message"),
  link: text("link"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_notifications_user").on(table.userId),
  index("IDX_notifications_unread").on(table.userId, table.isRead),
  index("IDX_notifications_created").on(table.createdAt),
]);

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Webhooks
export const webhookEventEnum = pgEnum("webhook_event", [
  "content.created", "content.updated", "content.published", "content.deleted",
  "user.created", "user.updated", "translation.completed",
  "workflow.submitted", "workflow.approved", "workflow.rejected",
  "comment.created", "media.uploaded"
]);

export const webhooks = pgTable("webhooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  secret: text("secret"), // for signature verification
  events: jsonb("events").$type<string[]>().default([]),
  headers: jsonb("headers").$type<Record<string, string>>(),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_webhooks_active").on(table.isActive),
]);

export const webhookLogs = pgTable("webhook_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  webhookId: varchar("webhook_id").notNull().references(() => webhooks.id, { onDelete: "cascade" }),
  event: text("event").notNull(),
  payload: jsonb("payload"),
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  error: text("error"),
  duration: integer("duration"), // ms
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_webhook_logs_webhook").on(table.webhookId),
  index("IDX_webhook_logs_created").on(table.createdAt),
]);

export const insertWebhookSchema = createInsertSchema(webhooks).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type Webhook = typeof webhooks.$inferSelect;
export type WebhookLog = typeof webhookLogs.$inferSelect;

// Comments / Collaboration
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  parentId: varchar("parent_id").references((): any => comments.id, { onDelete: "cascade" }),
  authorId: varchar("author_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  mentions: jsonb("mentions").$type<string[]>().default([]), // user ids mentioned
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_comments_content").on(table.contentId),
  index("IDX_comments_parent").on(table.parentId),
  index("IDX_comments_author").on(table.authorId),
]);

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Scheduled Tasks
export const scheduledTasks = pgTable("scheduled_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type", { length: 50 }).notNull(), // publish, unpublish, translate, etc.
  targetType: varchar("target_type", { length: 50 }).notNull(),
  targetId: varchar("target_id").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, completed, failed, cancelled
  error: text("error"),
  createdBy: varchar("created_by").references(() => users.id),
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_scheduled_tasks_pending").on(table.scheduledFor).where(sql`status = 'pending'`),
  index("IDX_scheduled_tasks_target").on(table.targetType, table.targetId),
]);

export const insertScheduledTaskSchema = createInsertSchema(scheduledTasks).omit({ id: true, createdAt: true });
export type InsertScheduledTask = z.infer<typeof insertScheduledTaskSchema>;
export type ScheduledTask = typeof scheduledTasks.$inferSelect;

