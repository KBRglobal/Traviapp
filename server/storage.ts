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
  rssFeeds,
  affiliateLinks,
  mediaFiles,
  internalLinks,
  topicBank,
  keywordRepository,
  contentVersions,
  translations,
  contentFingerprints,
  type User,
  type InsertUser,
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
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getContents(filters?: { type?: string; status?: string; search?: string }): Promise<Content[]>;
  getContent(id: string): Promise<ContentWithRelations | undefined>;
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
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
    }

    result.affiliateLinks = await db.select().from(affiliateLinks).where(eq(affiliateLinks.contentId, id));
    result.translations = await db.select().from(translations).where(eq(translations.contentId, id));

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
}

export const storage = new DatabaseStorage();
