import { eq, desc, sql, and, ilike } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  contents,
  attractions,
  hotels,
  articles,
  events,
  itineraries,
  districts,
  rssFeeds,
  affiliateLinks,
  mediaFiles,
  internalLinks,
  topicBank,
  keywordRepository,
  contentVersions,
  translations,
  contentFingerprints,
  contentViews,
  auditLogs,
  type User,
  type InsertUser,
  type UpsertUser,
  type Content,
  type InsertContent,
  type Attraction,
  type InsertAttraction,
  type Hotel,
  type InsertHotel,
  type Article,
  type InsertArticle,
  type Event,
  type InsertEvent,
  type Itinerary,
  type InsertItinerary,
  type District,
  type RssFeed,
  type InsertRssFeed,
  type AffiliateLink,
  type InsertAffiliateLink,
  type MediaFile,
  type InsertMediaFile,
  type InternalLink,
  type InsertInternalLink,
  type ContentWithRelations,
  type TopicBank,
  type InsertTopicBank,
  type KeywordRepository,
  type InsertKeywordRepository,
  type ContentVersion,
  type InsertContentVersion,
  type Translation,
  type InsertTranslation,
  type ContentFingerprint,
  type InsertContentFingerprint,
  type HomepagePromotion,
  type InsertHomepagePromotion,
  type HomepageSection,
  type ContentView,
  type InsertContentView,
  type AuditLog,
  type InsertAuditLog,
  homepagePromotions,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  createUserWithPassword(userData: { username: string; passwordHash: string; firstName?: string; lastName?: string; email?: string; role?: "admin" | "editor" | "author" | "contributor" | "viewer"; isActive?: boolean }): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  upsertUser(user: UpsertUser): Promise<User>;

  getContents(filters?: { type?: string; status?: string; search?: string }): Promise<Content[]>;
  getContentsWithRelations(filters?: { type?: string; status?: string; search?: string }): Promise<ContentWithRelations[]>;
  getContent(id: string): Promise<ContentWithRelations | undefined>;
  getContentBySlug(slug: string): Promise<ContentWithRelations | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: string, content: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: string): Promise<boolean>;

  getAttraction(contentId: string): Promise<Attraction | undefined>;
  createAttraction(attraction: InsertAttraction): Promise<Attraction>;
  updateAttraction(contentId: string, attraction: Partial<InsertAttraction>): Promise<Attraction | undefined>;

  getHotel(contentId: string): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(contentId: string, hotel: Partial<InsertHotel>): Promise<Hotel | undefined>;

  getArticle(contentId: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(contentId: string, article: Partial<InsertArticle>): Promise<Article | undefined>;

  getEvent(contentId: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(contentId: string, event: Partial<InsertEvent>): Promise<Event | undefined>;

  getItinerary(contentId: string): Promise<Itinerary | undefined>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  updateItinerary(contentId: string, itinerary: Partial<InsertItinerary>): Promise<Itinerary | undefined>;

  getRssFeeds(): Promise<RssFeed[]>;
  getRssFeed(id: string): Promise<RssFeed | undefined>;
  createRssFeed(feed: InsertRssFeed): Promise<RssFeed>;
  updateRssFeed(id: string, feed: Partial<InsertRssFeed>): Promise<RssFeed | undefined>;
  deleteRssFeed(id: string): Promise<boolean>;

  getAffiliateLinks(contentId?: string): Promise<AffiliateLink[]>;
  getAffiliateLink(id: string): Promise<AffiliateLink | undefined>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateAffiliateLink(id: string, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined>;
  deleteAffiliateLink(id: string): Promise<boolean>;

  getMediaFiles(): Promise<MediaFile[]>;
  getMediaFile(id: string): Promise<MediaFile | undefined>;
  createMediaFile(file: InsertMediaFile): Promise<MediaFile>;
  updateMediaFile(id: string, file: Partial<InsertMediaFile>): Promise<MediaFile | undefined>;
  deleteMediaFile(id: string): Promise<boolean>;

  getInternalLinks(contentId?: string): Promise<InternalLink[]>;
  createInternalLink(link: InsertInternalLink): Promise<InternalLink>;
  deleteInternalLink(id: string): Promise<boolean>;

  getStats(): Promise<{
    totalContent: number;
    published: number;
    drafts: number;
    inReview: number;
    attractions: number;
    hotels: number;
    articles: number;
    events: number;
    itineraries: number;
  }>;

  getTopicBankItems(filters?: { category?: string; isActive?: boolean }): Promise<TopicBank[]>;
  getTopicBankItem(id: string): Promise<TopicBank | undefined>;
  createTopicBankItem(item: InsertTopicBank): Promise<TopicBank>;
  updateTopicBankItem(id: string, data: Partial<InsertTopicBank>): Promise<TopicBank | undefined>;
  deleteTopicBankItem(id: string): Promise<boolean>;
  incrementTopicUsage(id: string): Promise<TopicBank | undefined>;

  getKeywords(filters?: { type?: string; category?: string; isActive?: boolean }): Promise<KeywordRepository[]>;
  getKeyword(id: string): Promise<KeywordRepository | undefined>;
  createKeyword(item: InsertKeywordRepository): Promise<KeywordRepository>;
  updateKeyword(id: string, data: Partial<InsertKeywordRepository>): Promise<KeywordRepository | undefined>;
  deleteKeyword(id: string): Promise<boolean>;
  incrementKeywordUsage(id: string): Promise<KeywordRepository | undefined>;

  getContentVersions(contentId: string): Promise<ContentVersion[]>;
  getContentVersion(id: string): Promise<ContentVersion | undefined>;
  createContentVersion(version: InsertContentVersion): Promise<ContentVersion>;
  getLatestVersionNumber(contentId: string): Promise<number>;

  getTranslationsByContentId(contentId: string): Promise<Translation[]>;
  getTranslation(id: string): Promise<Translation | undefined>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  updateTranslation(id: string, data: Partial<InsertTranslation>): Promise<Translation | undefined>;
  deleteTranslation(id: string): Promise<boolean>;

  getContentFingerprintByHash(fingerprint: string): Promise<ContentFingerprint | undefined>;
  getContentFingerprintsByFeedId(rssFeedId: string): Promise<ContentFingerprint[]>;
  createContentFingerprint(fingerprint: InsertContentFingerprint): Promise<ContentFingerprint>;
  checkDuplicateFingerprints(fingerprints: string[]): Promise<ContentFingerprint[]>;

  getScheduledContentToPublish(): Promise<Content[]>;
  publishScheduledContent(id: string): Promise<Content | undefined>;

  getHomepagePromotionsBySection(section: HomepageSection): Promise<HomepagePromotion[]>;
  getHomepagePromotion(id: string): Promise<HomepagePromotion | undefined>;
  createHomepagePromotion(promotion: InsertHomepagePromotion): Promise<HomepagePromotion>;
  updateHomepagePromotion(id: string, data: Partial<InsertHomepagePromotion>): Promise<HomepagePromotion | undefined>;
  deleteHomepagePromotion(id: string): Promise<boolean>;
  reorderHomepagePromotions(section: HomepageSection, orderedIds: string[]): Promise<boolean>;

  // Analytics
  getAnalyticsOverview(): Promise<{
    totalViews: number;
    viewsToday: number;
    viewsThisWeek: number;
    viewsThisMonth: number;
  }>;
  getViewsOverTime(days: number): Promise<{ date: string; views: number }[]>;
  getTopContent(limit: number): Promise<{ id: string; title: string; type: string; viewCount: number }[]>;
  getViewsByContentType(): Promise<{ type: string; views: number }[]>;
  recordContentView(contentId: string, data?: { userAgent?: string; referrer?: string; sessionId?: string }): Promise<void>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: { 
    userId?: string; 
    entityType?: string; 
    entityId?: string; 
    actionType?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]>;
  getAuditLogCount(filters?: { 
    userId?: string; 
    entityType?: string; 
    entityId?: string; 
    actionType?: string;
  }): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(sql`LOWER(${users.email}) = LOWER(${email})`);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(sql`LOWER(${users.username}) = LOWER(${username})`);
    return user;
  }

  async createUserWithPassword(userData: { username: string; passwordHash: string; firstName?: string; lastName?: string; email?: string; role?: "admin" | "editor" | "author" | "contributor" | "viewer"; isActive?: boolean }): Promise<User> {
    const [user] = await db.insert(users).values({
      username: userData.username,
      passwordHash: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role || "editor",
      isActive: userData.isActive !== false,
    }).returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getContents(filters?: { type?: string; status?: string; search?: string }): Promise<Content[]> {
    let query = db.select().from(contents);
    
    const conditions = [];
    if (filters?.type) {
      conditions.push(eq(contents.type, filters.type as any));
    }
    if (filters?.status) {
      conditions.push(eq(contents.status, filters.status as any));
    }
    if (filters?.search) {
      conditions.push(ilike(contents.title, `%${filters.search}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(contents.createdAt));
  }

  async getContentsWithRelations(filters?: { type?: string; status?: string; search?: string }): Promise<ContentWithRelations[]> {
    const baseContents = await this.getContents(filters);
    
    const results: ContentWithRelations[] = [];
    
    for (const content of baseContents) {
      const result: ContentWithRelations = { ...content };
      
      if (content.type === "attraction") {
        const [attraction] = await db.select().from(attractions).where(eq(attractions.contentId, content.id));
        result.attraction = attraction;
      } else if (content.type === "hotel") {
        const [hotel] = await db.select().from(hotels).where(eq(hotels.contentId, content.id));
        result.hotel = hotel;
      } else if (content.type === "article") {
        const [article] = await db.select().from(articles).where(eq(articles.contentId, content.id));
        result.article = article;
      } else if (content.type === "event") {
        const [event] = await db.select().from(events).where(eq(events.contentId, content.id));
        result.event = event;
      } else if (content.type === "itinerary") {
        const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.contentId, content.id));
        result.itinerary = itinerary;
      } else if (content.type === "district") {
        const [district] = await db.select().from(districts).where(eq(districts.contentId, content.id));
        result.district = district;
      }

      // Fetch author if authorId exists
      if (content.authorId) {
        const [author] = await db.select().from(users).where(eq(users.id, content.authorId));
        result.author = author;
      }
      
      results.push(result);
    }
    
    return results;
  }

  async getContent(id: string): Promise<ContentWithRelations | undefined> {
    const [content] = await db.select().from(contents).where(eq(contents.id, id));
    if (!content) return undefined;

    const result: ContentWithRelations = { ...content };

    if (content.type === "attraction") {
      const [attraction] = await db.select().from(attractions).where(eq(attractions.contentId, id));
      result.attraction = attraction;
    } else if (content.type === "hotel") {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.contentId, id));
      result.hotel = hotel;
    } else if (content.type === "article") {
      const [article] = await db.select().from(articles).where(eq(articles.contentId, id));
      result.article = article;
    } else if (content.type === "event") {
      const [event] = await db.select().from(events).where(eq(events.contentId, id));
      result.event = event;
    } else if (content.type === "itinerary") {
      const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.contentId, id));
      result.itinerary = itinerary;
    } else if (content.type === "district") {
      const [district] = await db.select().from(districts).where(eq(districts.contentId, id));
      result.district = district;
    }

    result.affiliateLinks = await db.select().from(affiliateLinks).where(eq(affiliateLinks.contentId, id));
    result.translations = await db.select().from(translations).where(eq(translations.contentId, id));

    // Fetch author if authorId exists
    if (content.authorId) {
      const [author] = await db.select().from(users).where(eq(users.id, content.authorId));
      result.author = author;
    }

    return result;
  }

  async getContentBySlug(slug: string): Promise<ContentWithRelations | undefined> {
    const [content] = await db.select().from(contents).where(eq(contents.slug, slug));
    if (!content) return undefined;

    const result: ContentWithRelations = { ...content };

    if (content.type === "attraction") {
      const [attraction] = await db.select().from(attractions).where(eq(attractions.contentId, content.id));
      result.attraction = attraction;
    } else if (content.type === "hotel") {
      const [hotel] = await db.select().from(hotels).where(eq(hotels.contentId, content.id));
      result.hotel = hotel;
    } else if (content.type === "article") {
      const [article] = await db.select().from(articles).where(eq(articles.contentId, content.id));
      result.article = article;
    } else if (content.type === "event") {
      const [event] = await db.select().from(events).where(eq(events.contentId, content.id));
      result.event = event;
    } else if (content.type === "itinerary") {
      const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.contentId, content.id));
      result.itinerary = itinerary;
    } else if (content.type === "district") {
      const [district] = await db.select().from(districts).where(eq(districts.contentId, content.id));
      result.district = district;
    }

    result.affiliateLinks = await db.select().from(affiliateLinks).where(eq(affiliateLinks.contentId, content.id));
    result.translations = await db.select().from(translations).where(eq(translations.contentId, content.id));

    // Fetch author if authorId exists
    if (content.authorId) {
      const [author] = await db.select().from(users).where(eq(users.id, content.authorId));
      result.author = author;
    }

    return result;
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [content] = await db.insert(contents).values(insertContent).returning();
    return content;
  }

  async updateContent(id: string, updateData: Partial<InsertContent>): Promise<Content | undefined> {
    const [content] = await db
      .update(contents)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(contents.id, id))
      .returning();
    return content;
  }

  async deleteContent(id: string): Promise<boolean> {
    const result = await db.delete(contents).where(eq(contents.id, id));
    return true;
  }

  async getAttraction(contentId: string): Promise<Attraction | undefined> {
    const [attraction] = await db.select().from(attractions).where(eq(attractions.contentId, contentId));
    return attraction;
  }

  async createAttraction(insertAttraction: InsertAttraction): Promise<Attraction> {
    const [attraction] = await db.insert(attractions).values(insertAttraction).returning();
    return attraction;
  }

  async updateAttraction(contentId: string, updateData: Partial<InsertAttraction>): Promise<Attraction | undefined> {
    const [attraction] = await db
      .update(attractions)
      .set(updateData)
      .where(eq(attractions.contentId, contentId))
      .returning();
    return attraction;
  }

  async getHotel(contentId: string): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.contentId, contentId));
    return hotel;
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const [hotel] = await db.insert(hotels).values(insertHotel).returning();
    return hotel;
  }

  async updateHotel(contentId: string, updateData: Partial<InsertHotel>): Promise<Hotel | undefined> {
    const [hotel] = await db
      .update(hotels)
      .set(updateData)
      .where(eq(hotels.contentId, contentId))
      .returning();
    return hotel;
  }

  async getArticle(contentId: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.contentId, contentId));
    return article;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  async updateArticle(contentId: string, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.contentId, contentId))
      .returning();
    return article;
  }

  async getEvent(contentId: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.contentId, contentId));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async updateEvent(contentId: string, updateData: Partial<InsertEvent>): Promise<Event | undefined> {
    const [event] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.contentId, contentId))
      .returning();
    return event;
  }

  async getItinerary(contentId: string): Promise<Itinerary | undefined> {
    const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.contentId, contentId));
    return itinerary;
  }

  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const [itinerary] = await db.insert(itineraries).values(insertItinerary).returning();
    return itinerary;
  }

  async updateItinerary(contentId: string, updateData: Partial<InsertItinerary>): Promise<Itinerary | undefined> {
    const [itinerary] = await db
      .update(itineraries)
      .set(updateData)
      .where(eq(itineraries.contentId, contentId))
      .returning();
    return itinerary;
  }

  async getRssFeeds(): Promise<RssFeed[]> {
    return await db.select().from(rssFeeds).orderBy(desc(rssFeeds.createdAt));
  }

  async getRssFeed(id: string): Promise<RssFeed | undefined> {
    const [feed] = await db.select().from(rssFeeds).where(eq(rssFeeds.id, id));
    return feed;
  }

  async createRssFeed(insertFeed: InsertRssFeed): Promise<RssFeed> {
    const [feed] = await db.insert(rssFeeds).values(insertFeed).returning();
    return feed;
  }

  async updateRssFeed(id: string, updateData: Partial<InsertRssFeed>): Promise<RssFeed | undefined> {
    const [feed] = await db
      .update(rssFeeds)
      .set(updateData)
      .where(eq(rssFeeds.id, id))
      .returning();
    return feed;
  }

  async deleteRssFeed(id: string): Promise<boolean> {
    await db.delete(rssFeeds).where(eq(rssFeeds.id, id));
    return true;
  }

  async getAffiliateLinks(contentId?: string): Promise<AffiliateLink[]> {
    if (contentId) {
      return await db.select().from(affiliateLinks).where(eq(affiliateLinks.contentId, contentId));
    }
    return await db.select().from(affiliateLinks).orderBy(desc(affiliateLinks.createdAt));
  }

  async getAffiliateLink(id: string): Promise<AffiliateLink | undefined> {
    const [link] = await db.select().from(affiliateLinks).where(eq(affiliateLinks.id, id));
    return link;
  }

  async createAffiliateLink(insertLink: InsertAffiliateLink): Promise<AffiliateLink> {
    const [link] = await db.insert(affiliateLinks).values(insertLink).returning();
    return link;
  }

  async updateAffiliateLink(id: string, updateData: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined> {
    const [link] = await db
      .update(affiliateLinks)
      .set(updateData)
      .where(eq(affiliateLinks.id, id))
      .returning();
    return link;
  }

  async deleteAffiliateLink(id: string): Promise<boolean> {
    await db.delete(affiliateLinks).where(eq(affiliateLinks.id, id));
    return true;
  }

  async getMediaFiles(): Promise<MediaFile[]> {
    return await db.select().from(mediaFiles).orderBy(desc(mediaFiles.createdAt));
  }

  async getMediaFile(id: string): Promise<MediaFile | undefined> {
    const [file] = await db.select().from(mediaFiles).where(eq(mediaFiles.id, id));
    return file;
  }

  async createMediaFile(insertFile: InsertMediaFile): Promise<MediaFile> {
    const [file] = await db.insert(mediaFiles).values(insertFile).returning();
    return file;
  }

  async updateMediaFile(id: string, updateData: Partial<InsertMediaFile>): Promise<MediaFile | undefined> {
    const [file] = await db
      .update(mediaFiles)
      .set(updateData)
      .where(eq(mediaFiles.id, id))
      .returning();
    return file;
  }

  async deleteMediaFile(id: string): Promise<boolean> {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
    return true;
  }

  async getInternalLinks(contentId?: string): Promise<InternalLink[]> {
    if (contentId) {
      return await db.select().from(internalLinks).where(eq(internalLinks.sourceContentId, contentId));
    }
    return await db.select().from(internalLinks);
  }

  async createInternalLink(insertLink: InsertInternalLink): Promise<InternalLink> {
    const [link] = await db.insert(internalLinks).values(insertLink).returning();
    return link;
  }

  async deleteInternalLink(id: string): Promise<boolean> {
    await db.delete(internalLinks).where(eq(internalLinks.id, id));
    return true;
  }

  async getStats(): Promise<{
    totalContent: number;
    published: number;
    drafts: number;
    inReview: number;
    attractions: number;
    hotels: number;
    articles: number;
    events: number;
    itineraries: number;
  }> {
    const allContent = await db.select().from(contents);
    
    return {
      totalContent: allContent.length,
      published: allContent.filter(c => c.status === "published").length,
      drafts: allContent.filter(c => c.status === "draft").length,
      inReview: allContent.filter(c => c.status === "in_review").length,
      attractions: allContent.filter(c => c.type === "attraction").length,
      hotels: allContent.filter(c => c.type === "hotel").length,
      articles: allContent.filter(c => c.type === "article").length,
      events: allContent.filter(c => c.type === "event").length,
      itineraries: allContent.filter(c => c.type === "itinerary").length,
    };
  }

  async getTopicBankItems(filters?: { category?: string; isActive?: boolean }): Promise<TopicBank[]> {
    let query = db.select().from(topicBank);
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(topicBank.category, filters.category as any));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(topicBank.isActive, filters.isActive));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    return await query.orderBy(desc(topicBank.priority), desc(topicBank.createdAt));
  }

  async getTopicBankItem(id: string): Promise<TopicBank | undefined> {
    const [item] = await db.select().from(topicBank).where(eq(topicBank.id, id));
    return item;
  }

  async createTopicBankItem(insertItem: InsertTopicBank): Promise<TopicBank> {
    const [item] = await db.insert(topicBank).values(insertItem).returning();
    return item;
  }

  async updateTopicBankItem(id: string, updateData: Partial<InsertTopicBank>): Promise<TopicBank | undefined> {
    const [item] = await db.update(topicBank).set(updateData).where(eq(topicBank.id, id)).returning();
    return item;
  }

  async deleteTopicBankItem(id: string): Promise<boolean> {
    await db.delete(topicBank).where(eq(topicBank.id, id));
    return true;
  }

  async incrementTopicUsage(id: string): Promise<TopicBank | undefined> {
    const [item] = await db
      .update(topicBank)
      .set({ 
        timesUsed: sql`${topicBank.timesUsed} + 1`,
        lastUsed: new Date()
      })
      .where(eq(topicBank.id, id))
      .returning();
    return item;
  }

  async getKeywords(filters?: { type?: string; category?: string; isActive?: boolean }): Promise<KeywordRepository[]> {
    let query = db.select().from(keywordRepository);
    const conditions = [];
    if (filters?.type) {
      conditions.push(eq(keywordRepository.type, filters.type));
    }
    if (filters?.category) {
      conditions.push(eq(keywordRepository.category, filters.category));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(keywordRepository.isActive, filters.isActive));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    return await query.orderBy(desc(keywordRepository.priority), desc(keywordRepository.createdAt));
  }

  async getKeyword(id: string): Promise<KeywordRepository | undefined> {
    const [item] = await db.select().from(keywordRepository).where(eq(keywordRepository.id, id));
    return item;
  }

  async createKeyword(insertItem: InsertKeywordRepository): Promise<KeywordRepository> {
    const [item] = await db.insert(keywordRepository).values(insertItem).returning();
    return item;
  }

  async updateKeyword(id: string, updateData: Partial<InsertKeywordRepository>): Promise<KeywordRepository | undefined> {
    const [item] = await db
      .update(keywordRepository)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(keywordRepository.id, id))
      .returning();
    return item;
  }

  async deleteKeyword(id: string): Promise<boolean> {
    await db.delete(keywordRepository).where(eq(keywordRepository.id, id));
    return true;
  }

  async incrementKeywordUsage(id: string): Promise<KeywordRepository | undefined> {
    const [item] = await db
      .update(keywordRepository)
      .set({ 
        usageCount: sql`${keywordRepository.usageCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(keywordRepository.id, id))
      .returning();
    return item;
  }

  async getContentVersions(contentId: string): Promise<ContentVersion[]> {
    return await db
      .select()
      .from(contentVersions)
      .where(eq(contentVersions.contentId, contentId))
      .orderBy(desc(contentVersions.versionNumber));
  }

  async getContentVersion(id: string): Promise<ContentVersion | undefined> {
    const [version] = await db.select().from(contentVersions).where(eq(contentVersions.id, id));
    return version;
  }

  async createContentVersion(insertVersion: InsertContentVersion): Promise<ContentVersion> {
    const [version] = await db.insert(contentVersions).values(insertVersion).returning();
    return version;
  }

  async getLatestVersionNumber(contentId: string): Promise<number> {
    const [result] = await db
      .select({ maxVersion: sql<number>`COALESCE(MAX(${contentVersions.versionNumber}), 0)` })
      .from(contentVersions)
      .where(eq(contentVersions.contentId, contentId));
    return result?.maxVersion ?? 0;
  }

  async getTranslationsByContentId(contentId: string): Promise<Translation[]> {
    return await db.select().from(translations).where(eq(translations.contentId, contentId));
  }

  async getTranslation(id: string): Promise<Translation | undefined> {
    const [translation] = await db.select().from(translations).where(eq(translations.id, id));
    return translation;
  }

  async createTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const [translation] = await db.insert(translations).values(insertTranslation).returning();
    return translation;
  }

  async updateTranslation(id: string, updateData: Partial<InsertTranslation>): Promise<Translation | undefined> {
    const [translation] = await db
      .update(translations)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(translations.id, id))
      .returning();
    return translation;
  }

  async deleteTranslation(id: string): Promise<boolean> {
    await db.delete(translations).where(eq(translations.id, id));
    return true;
  }

  async getContentFingerprintByHash(fingerprint: string): Promise<ContentFingerprint | undefined> {
    const [result] = await db.select().from(contentFingerprints).where(eq(contentFingerprints.fingerprint, fingerprint));
    return result;
  }

  async getContentFingerprintsByFeedId(rssFeedId: string): Promise<ContentFingerprint[]> {
    return await db.select().from(contentFingerprints).where(eq(contentFingerprints.rssFeedId, rssFeedId));
  }

  async createContentFingerprint(insertFingerprint: InsertContentFingerprint): Promise<ContentFingerprint> {
    const [fingerprint] = await db.insert(contentFingerprints).values(insertFingerprint).returning();
    return fingerprint;
  }

  async checkDuplicateFingerprints(fingerprints: string[]): Promise<ContentFingerprint[]> {
    if (fingerprints.length === 0) return [];
    const results = await db
      .select()
      .from(contentFingerprints)
      .where(sql`${contentFingerprints.fingerprint} = ANY(${fingerprints})`);
    return results;
  }

  async getScheduledContentToPublish(): Promise<Content[]> {
    const now = new Date();
    return await db
      .select()
      .from(contents)
      .where(
        and(
          eq(contents.status, "scheduled"),
          sql`${contents.scheduledAt} <= ${now}`
        )
      );
  }

  async publishScheduledContent(id: string): Promise<Content | undefined> {
    const [content] = await db
      .update(contents)
      .set({
        status: "published",
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contents.id, id))
      .returning();
    return content;
  }

  async getHomepagePromotionsBySection(section: HomepageSection): Promise<HomepagePromotion[]> {
    return await db
      .select()
      .from(homepagePromotions)
      .where(eq(homepagePromotions.section, section))
      .orderBy(homepagePromotions.position);
  }

  async getHomepagePromotion(id: string): Promise<HomepagePromotion | undefined> {
    const [promotion] = await db.select().from(homepagePromotions).where(eq(homepagePromotions.id, id));
    return promotion;
  }

  async createHomepagePromotion(insertPromotion: InsertHomepagePromotion): Promise<HomepagePromotion> {
    const [promotion] = await db.insert(homepagePromotions).values(insertPromotion).returning();
    return promotion;
  }

  async updateHomepagePromotion(id: string, updateData: Partial<InsertHomepagePromotion>): Promise<HomepagePromotion | undefined> {
    const [promotion] = await db
      .update(homepagePromotions)
      .set(updateData)
      .where(eq(homepagePromotions.id, id))
      .returning();
    return promotion;
  }

  async deleteHomepagePromotion(id: string): Promise<boolean> {
    await db.delete(homepagePromotions).where(eq(homepagePromotions.id, id));
    return true;
  }

  async reorderHomepagePromotions(section: HomepageSection, orderedIds: string[]): Promise<boolean> {
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(homepagePromotions)
        .set({ position: i })
        .where(and(eq(homepagePromotions.id, orderedIds[i]), eq(homepagePromotions.section, section)));
    }
    return true;
  }

  async getAnalyticsOverview(): Promise<{
    totalViews: number;
    viewsToday: number;
    viewsThisWeek: number;
    viewsThisMonth: number;
  }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(startOfToday);
    startOfMonth.setDate(startOfMonth.getDate() - 30);

    const [totalResult] = await db
      .select({ count: sql<number>`COALESCE(SUM(${contents.viewCount}), 0)::int` })
      .from(contents);

    const [todayResult] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(contentViews)
      .where(sql`${contentViews.viewedAt} >= ${startOfToday}`);

    const [weekResult] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(contentViews)
      .where(sql`${contentViews.viewedAt} >= ${startOfWeek}`);

    const [monthResult] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(contentViews)
      .where(sql`${contentViews.viewedAt} >= ${startOfMonth}`);

    return {
      totalViews: totalResult?.count || 0,
      viewsToday: todayResult?.count || 0,
      viewsThisWeek: weekResult?.count || 0,
      viewsThisMonth: monthResult?.count || 0,
    };
  }

  async getViewsOverTime(days: number): Promise<{ date: string; views: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await db
      .select({
        date: sql<string>`DATE(${contentViews.viewedAt})::text`,
        views: sql<number>`COUNT(*)::int`,
      })
      .from(contentViews)
      .where(sql`${contentViews.viewedAt} >= ${startDate}`)
      .groupBy(sql`DATE(${contentViews.viewedAt})`)
      .orderBy(sql`DATE(${contentViews.viewedAt})`);

    // Fill in missing dates with 0 views
    const dateMap = new Map(results.map(r => [r.date, r.views]));
    const filledResults: { date: string; views: number }[] = [];
    
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      filledResults.push({
        date: dateStr,
        views: dateMap.get(dateStr) || 0,
      });
    }

    return filledResults;
  }

  async getTopContent(limit: number): Promise<{ id: string; title: string; type: string; viewCount: number }[]> {
    const results = await db
      .select({
        id: contents.id,
        title: contents.title,
        type: contents.type,
        viewCount: contents.viewCount,
      })
      .from(contents)
      .orderBy(desc(contents.viewCount))
      .limit(limit);

    return results.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      viewCount: r.viewCount || 0,
    }));
  }

  async getViewsByContentType(): Promise<{ type: string; views: number }[]> {
    const results = await db
      .select({
        type: contents.type,
        views: sql<number>`COALESCE(SUM(${contents.viewCount}), 0)::int`,
      })
      .from(contents)
      .groupBy(contents.type);

    return results.map(r => ({
      type: r.type,
      views: r.views || 0,
    }));
  }

  async recordContentView(contentId: string, data?: { userAgent?: string; referrer?: string; sessionId?: string }): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.insert(contentViews).values({
        contentId,
        userAgent: data?.userAgent,
        referrer: data?.referrer,
        sessionId: data?.sessionId,
      });

      await tx
        .update(contents)
        .set({ viewCount: sql`COALESCE(${contents.viewCount}, 0) + 1` })
        .where(eq(contents.id, contentId));
    });
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [auditLog] = await db.insert(auditLogs).values(log).returning();
    return auditLog;
  }

  async getAuditLogs(filters?: { 
    userId?: string; 
    entityType?: string; 
    entityId?: string; 
    actionType?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const conditions = [];
    if (filters?.userId) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }
    if (filters?.entityType) {
      conditions.push(eq(auditLogs.entityType, filters.entityType as any));
    }
    if (filters?.entityId) {
      conditions.push(eq(auditLogs.entityId, filters.entityId));
    }
    if (filters?.actionType) {
      conditions.push(eq(auditLogs.actionType, filters.actionType as any));
    }

    const query = db.select().from(auditLogs);
    
    if (conditions.length > 0) {
      return await query
        .where(and(...conditions))
        .orderBy(desc(auditLogs.timestamp))
        .limit(filters?.limit || 100)
        .offset(filters?.offset || 0);
    }
    
    return await query
      .orderBy(desc(auditLogs.timestamp))
      .limit(filters?.limit || 100)
      .offset(filters?.offset || 0);
  }

  async getAuditLogCount(filters?: { 
    userId?: string; 
    entityType?: string; 
    entityId?: string; 
    actionType?: string;
  }): Promise<number> {
    const conditions = [];
    if (filters?.userId) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }
    if (filters?.entityType) {
      conditions.push(eq(auditLogs.entityType, filters.entityType as any));
    }
    if (filters?.entityId) {
      conditions.push(eq(auditLogs.entityId, filters.entityId));
    }
    if (filters?.actionType) {
      conditions.push(eq(auditLogs.actionType, filters.actionType as any));
    }

    if (conditions.length > 0) {
      const result = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(auditLogs)
        .where(and(...conditions));
      return result[0]?.count || 0;
    }
    
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(auditLogs);
    return result[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();
