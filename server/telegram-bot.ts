import TelegramBot from 'node-telegram-bot-api';
import { db } from './db';
import { contents, attractions, hotels, dining, affiliateLinks, telegramUserProfiles, telegramConversations, telegramUserFavorites, TELEGRAM_BADGES, TelegramUserProfile } from '@shared/schema';
import { eq, and, ilike, sql, desc, inArray } from 'drizzle-orm';

const token = process.env.TELEGRAM_BOT_TOKEN;
const perplexityApiKey = process.env.PERPLEXITY_API_KEY;

let bot: TelegramBot | null = null;

// In-memory cache for faster access (falls back to DB)
const userProfileCache: Map<number, TelegramUserProfile> = new Map();

// Get or create user profile from database
async function getOrCreateUserProfile(chatId: number, from?: TelegramBot.User): Promise<TelegramUserProfile> {
  const telegramId = chatId.toString();
  
  // Check cache first
  if (userProfileCache.has(chatId)) {
    const cached = userProfileCache.get(chatId)!;
    // Update last active in background
    db.update(telegramUserProfiles)
      .set({ 
        lastActiveAt: new Date(),
        totalInteractions: sql`total_interactions + 1`
      })
      .where(eq(telegramUserProfiles.telegramId, telegramId))
      .catch(err => console.error('[Telegram Bot] Error updating profile:', err));
    return cached;
  }
  
  try {
    let profile = await db.select().from(telegramUserProfiles)
      .where(eq(telegramUserProfiles.telegramId, telegramId))
      .limit(1).then(r => r[0]);
    
    if (!profile) {
      const [newProfile] = await db.insert(telegramUserProfiles).values({
        telegramId,
        telegramUsername: from?.username,
        firstName: from?.first_name,
        lastName: from?.last_name,
        language: 'en',
        badges: ['first_timer'],
        points: 5,
      }).returning();
      profile = newProfile;
      console.log(`[Telegram Bot] Created new profile for ${telegramId}`);
    } else {
      await db.update(telegramUserProfiles)
        .set({ 
          lastActiveAt: new Date(),
          totalInteractions: sql`total_interactions + 1`
        })
        .where(eq(telegramUserProfiles.telegramId, telegramId));
    }
    
    userProfileCache.set(chatId, profile);
    return profile;
  } catch (error) {
    console.error('[Telegram Bot] Error getting/creating profile:', error);
    // Return a default profile object if DB fails
    return {
      id: telegramId,
      telegramId,
      telegramUsername: from?.username || null,
      firstName: from?.first_name || null,
      lastName: from?.last_name || null,
      language: 'en',
      interests: [],
      favorites: [],
      tripDates: null,
      travelStyle: null,
      budget: null,
      notificationsEnabled: true,
      dailyDigestEnabled: false,
      isPremium: false,
      totalInteractions: 0,
      badges: [],
      points: 0,
      lastActiveAt: new Date(),
      createdAt: new Date(),
    };
  }
}

// Save conversation message to database
async function saveConversationMessage(profileId: string, role: string, content: string) {
  try {
    await db.insert(telegramConversations).values({
      telegramUserId: profileId,
      role,
      content,
    });
    
    // Keep only last 8 messages per user
    const messages = await db.select({ id: telegramConversations.id })
      .from(telegramConversations)
      .where(eq(telegramConversations.telegramUserId, profileId))
      .orderBy(desc(telegramConversations.createdAt));
    
    if (messages.length > 8) {
      const toDelete = messages.slice(8).map(m => m.id);
      await db.delete(telegramConversations)
        .where(inArray(telegramConversations.id, toDelete));
    }
  } catch (error) {
    console.error('[Telegram Bot] Error saving conversation:', error);
  }
}

// Get conversation history from database
async function getConversationHistory(profileId: string): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  try {
    const messages = await db.select({
      role: telegramConversations.role,
      content: telegramConversations.content,
    })
    .from(telegramConversations)
    .where(eq(telegramConversations.telegramUserId, profileId))
    .orderBy(telegramConversations.createdAt);
    
    return messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
  } catch (error) {
    console.error('[Telegram Bot] Error fetching conversation:', error);
    return [];
  }
}

// Update user language in database
async function updateUserLanguage(chatId: number, language: 'en' | 'he' | 'ar') {
  const telegramId = chatId.toString();
  try {
    await db.update(telegramUserProfiles)
      .set({ language })
      .where(eq(telegramUserProfiles.telegramId, telegramId));
    
    // Update cache
    const cached = userProfileCache.get(chatId);
    if (cached) {
      cached.language = language;
      userProfileCache.set(chatId, cached);
    }
  } catch (error) {
    console.error('[Telegram Bot] Error updating language:', error);
  }
}

const systemPrompts = {
  en: `You are Travi, a friendly and helpful AI travel assistant specializing in Dubai. You help tourists and visitors with:
- Hotel recommendations and bookings advice
- Tourist attractions and things to do
- Restaurant and dining recommendations  
- Transportation tips (metro, taxi, buses)
- Local customs and cultural advice
- Weather and best times to visit
- Shopping destinations
- Nightlife and entertainment
- Day trips and excursions
- Visa and travel requirements

Be warm, enthusiastic, and knowledgeable. Give concise but helpful answers. Use simple language.`,

  he: `אתה טראבי, עוזר נסיעות AI ידידותי ומועיל המתמחה בדובאי. אתה עוזר לתיירים ומבקרים עם:
- המלצות על מלונות וייעוץ להזמנות
- אטרקציות תיירותיות ודברים לעשות
- המלצות על מסעדות ואוכל
- טיפים לתחבורה (מטרו, מוניות, אוטובוסים)
- מנהגים מקומיים וייעוץ תרבותי
- מזג אוויר וזמנים הטובים ביותר לביקור
- יעדי קניות
- חיי לילה ובידור
- טיולי יום וסיורים
- דרישות ויזה ונסיעות

היה חם, נלהב ובעל ידע. תן תשובות תמציתיות אך מועילות. השתמש בשפה פשוטה.`,

  ar: `أنت ترافي، مساعد سفر ذكي ودود ومفيد متخصص في دبي. أنت تساعد السياح والزوار في:
- توصيات الفنادق ونصائح الحجز
- المعالم السياحية والأنشطة
- توصيات المطاعم والطعام
- نصائح المواصلات (المترو، التاكسي، الحافلات)
- العادات المحلية والنصائح الثقافية
- الطقس وأفضل أوقات الزيارة
- وجهات التسوق
- الحياة الليلية والترفيه
- الرحلات اليومية والجولات
- متطلبات التأشيرة والسفر

كن دافئاً ومتحمساً وذو معرفة. قدم إجابات موجزة ولكن مفيدة. استخدم لغة بسيطة.`
};

const welcomeMessages = {
  en: (name: string) => `Hi ${name}! I'm *Travi*, your AI travel assistant for Dubai.\n\nUse the menu below or just type your question!\n\nHow can I help you plan your Dubai adventure?`,
  he: (name: string) => `היי ${name}! אני *טראבי*, העוזר האישי שלך לטיולים בדובאי.\n\nהשתמש בתפריט למטה או פשוט כתוב את השאלה שלך!\n\nאיך אני יכול לעזור לך לתכנן את ההרפתקה שלך בדובאי?`,
  ar: (name: string) => `مرحباً ${name}! أنا *ترافي*، مساعدك الذكي للسفر في دبي.\n\nاستخدم القائمة أدناه أو اكتب سؤالك!\n\nكيف يمكنني مساعدتك في التخطيط لمغامرتك في دبي؟`
};

const languageChangedMessages = {
  en: 'Language changed to English! How can I help you?',
  he: 'השפה שונתה לעברית! איך אני יכול לעזור?',
  ar: 'تم تغيير اللغة إلى العربية! كيف يمكنني مساعدتك؟'
};

// Quick reply keyboard labels per language
const menuLabels = {
  en: {
    attractions: 'Attractions',
    hotels: 'Hotels',
    restaurants: 'Restaurants',
    weather: 'Weather',
    currency: 'Currency',
    help: 'Help'
  },
  he: {
    attractions: 'אטרקציות',
    hotels: 'מלונות',
    restaurants: 'מסעדות',
    weather: 'מזג אוויר',
    currency: 'המרת מטבע',
    help: 'עזרה'
  },
  ar: {
    attractions: 'المعالم السياحية',
    hotels: 'الفنادق',
    restaurants: 'المطاعم',
    weather: 'الطقس',
    currency: 'تحويل العملات',
    help: 'مساعدة'
  }
};

type LangCode = 'en' | 'he' | 'ar';

async function getUserLang(chatId: number): Promise<LangCode> {
  // Check cache first
  const cached = userProfileCache.get(chatId);
  if (cached) {
    return cached.language as LangCode;
  }
  
  try {
    const profile = await db.select({ language: telegramUserProfiles.language })
      .from(telegramUserProfiles)
      .where(eq(telegramUserProfiles.telegramId, chatId.toString()))
      .limit(1).then(r => r[0]);
    return (profile?.language as LangCode) || 'en';
  } catch (error) {
    console.error('[Telegram Bot] Error getting user lang:', error);
    return 'en';
  }
}

// Remove Perplexity citation numbers from response
function cleanCitations(text: string): string {
  let cleaned = text.replace(/\[\d+\]/g, '');
  cleaned = cleaned.replace(/([.!?،,:])\s*\d{1,2}(?=\s|$|\n)/g, '$1');
  cleaned = cleaned.replace(/\s+\d{1,2}(?=\s*$|\s*\n)/gm, '');
  return cleaned;
}

// Get reply keyboard with menu buttons
function getReplyKeyboard(lang: LangCode): TelegramBot.ReplyKeyboardMarkup {
  const labels = menuLabels[lang];
  return {
    keyboard: [
      [{ text: labels.attractions }, { text: labels.hotels }, { text: labels.restaurants }],
      [{ text: labels.weather }, { text: labels.currency }, { text: labels.help }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };
}

// Fetch attractions from CMS
async function getAttractionsFromCMS(limit: number = 5) {
  try {
    const results = await db.select({
      id: contents.id,
      title: contents.title,
      slug: contents.slug,
      heroImage: contents.heroImage,
      metaDescription: contents.metaDescription,
      location: attractions.location,
      priceFrom: attractions.priceFrom,
      duration: attractions.duration,
      primaryCta: attractions.primaryCta
    })
    .from(contents)
    .innerJoin(attractions, eq(contents.id, attractions.contentId))
    .where(eq(contents.status, 'published'))
    .limit(limit);
    
    return results;
  } catch (error) {
    console.error('[Telegram Bot] Error fetching attractions:', error);
    return [];
  }
}

// Fetch hotels from CMS
async function getHotelsFromCMS(limit: number = 5) {
  try {
    const results = await db.select({
      id: contents.id,
      title: contents.title,
      slug: contents.slug,
      heroImage: contents.heroImage,
      metaDescription: contents.metaDescription,
      location: hotels.location,
      starRating: hotels.starRating,
      primaryCta: hotels.primaryCta
    })
    .from(contents)
    .innerJoin(hotels, eq(contents.id, hotels.contentId))
    .where(eq(contents.status, 'published'))
    .limit(limit);
    
    return results;
  } catch (error) {
    console.error('[Telegram Bot] Error fetching hotels:', error);
    return [];
  }
}

// Fetch restaurants from CMS
async function getDiningFromCMS(limit: number = 5) {
  try {
    const results = await db.select({
      id: contents.id,
      title: contents.title,
      slug: contents.slug,
      heroImage: contents.heroImage,
      metaDescription: contents.metaDescription,
      location: dining.location,
      cuisineType: dining.cuisineType,
      priceRange: dining.priceRange,
      primaryCta: dining.primaryCta
    })
    .from(contents)
    .innerJoin(dining, eq(contents.id, dining.contentId))
    .where(eq(contents.status, 'published'))
    .limit(limit);
    
    return results;
  } catch (error) {
    console.error('[Telegram Bot] Error fetching dining:', error);
    return [];
  }
}

// Get affiliate links for content
async function getAffiliateLinksForContent(contentId: string) {
  try {
    const links = await db.select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.contentId, contentId));
    return links;
  } catch (error) {
    console.error('[Telegram Bot] Error fetching affiliate links:', error);
    return [];
  }
}

// Format attractions message
async function formatAttractionsMessage(lang: LangCode): Promise<{ text: string; items: any[] }> {
  const items = await getAttractionsFromCMS(5);
  
  if (items.length === 0) {
    const noDataMessages = {
      en: 'No attractions available at the moment. Ask me anything about Dubai attractions!',
      he: 'אין אטרקציות זמינות כרגע. שאל אותי כל שאלה על אטרקציות בדובאי!',
      ar: 'لا توجد معالم سياحية متاحة حالياً. اسألني أي سؤال عن معالم دبي!'
    };
    return { text: noDataMessages[lang], items: [] };
  }

  const headers = {
    en: '*Top Dubai Attractions:*\n\n',
    he: '*אטרקציות מובילות בדובאי:*\n\n',
    ar: '*أفضل معالم دبي السياحية:*\n\n'
  };

  let message = headers[lang];
  
  for (const item of items) {
    message += `*${item.title}*\n`;
    if (item.location) message += `${item.location}\n`;
    if (item.priceFrom) message += `${lang === 'he' ? 'מחיר: ' : lang === 'ar' ? 'السعر: ' : 'Price: '}${item.priceFrom}\n`;
    if (item.duration) message += `${lang === 'he' ? 'משך: ' : lang === 'ar' ? 'المدة: ' : 'Duration: '}${item.duration}\n`;
    message += `\n`;
  }

  const footers = {
    en: '_Ask me for more details about any attraction!_',
    he: '_שאל אותי לפרטים נוספים על כל אטרקציה!_',
    ar: '_اسألني للمزيد من التفاصيل عن أي معلم!_'
  };
  message += footers[lang];

  return { text: message, items };
}

// Format hotels message
async function formatHotelsMessage(lang: LangCode): Promise<{ text: string; items: any[] }> {
  const items = await getHotelsFromCMS(5);
  
  if (items.length === 0) {
    const noDataMessages = {
      en: 'No hotels available at the moment. Ask me anything about Dubai hotels!',
      he: 'אין מלונות זמינים כרגע. שאל אותי כל שאלה על מלונות בדובאי!',
      ar: 'لا توجد فنادق متاحة حالياً. اسألني أي سؤال عن فنادق دبي!'
    };
    return { text: noDataMessages[lang], items: [] };
  }

  const headers = {
    en: '*Top Dubai Hotels:*\n\n',
    he: '*מלונות מובילים בדובאי:*\n\n',
    ar: '*أفضل فنادق دبي:*\n\n'
  };

  let message = headers[lang];
  
  for (const item of items) {
    const stars = item.starRating ? '⭐'.repeat(item.starRating) : '';
    message += `*${item.title}* ${stars}\n`;
    if (item.location) message += `${item.location}\n`;
    message += `\n`;
  }

  const footers = {
    en: '_Ask me for more details about any hotel!_',
    he: '_שאל אותי לפרטים נוספים על כל מלון!_',
    ar: '_اسألني للمزيد من التفاصيل عن أي فندق!_'
  };
  message += footers[lang];

  return { text: message, items };
}

// Format restaurants message
async function formatDiningMessage(lang: LangCode): Promise<{ text: string; items: any[] }> {
  const items = await getDiningFromCMS(5);
  
  if (items.length === 0) {
    const noDataMessages = {
      en: 'No restaurants available at the moment. Ask me anything about Dubai dining!',
      he: 'אין מסעדות זמינות כרגע. שאל אותי כל שאלה על אוכל בדובאי!',
      ar: 'لا توجد مطاعم متاحة حالياً. اسألني أي سؤال عن المطاعم في دبي!'
    };
    return { text: noDataMessages[lang], items: [] };
  }

  const headers = {
    en: '*Top Dubai Restaurants:*\n\n',
    he: '*מסעדות מובילות בדובאי:*\n\n',
    ar: '*أفضل مطاعم دبي:*\n\n'
  };

  let message = headers[lang];
  
  for (const item of items) {
    message += `*${item.title}*\n`;
    if (item.cuisineType) message += `${lang === 'he' ? 'סוג מטבח: ' : lang === 'ar' ? 'نوع المطبخ: ' : 'Cuisine: '}${item.cuisineType}\n`;
    if (item.location) message += `${item.location}\n`;
    if (item.priceRange) message += `${lang === 'he' ? 'טווח מחירים: ' : lang === 'ar' ? 'نطاق السعر: ' : 'Price range: '}${item.priceRange}\n`;
    message += `\n`;
  }

  const footers = {
    en: '_Ask me for more details about any restaurant!_',
    he: '_שאל אותי לפרטים נוספים על כל מסעדה!_',
    ar: '_اسألني للمزيد من التفاصيل عن أي مطعم!_'
  };
  message += footers[lang];

  return { text: message, items };
}

// Get Dubai weather (using wttr.in free API)
async function getDubaiWeather(): Promise<{ temp: string; condition: string; humidity: string; wind: string }> {
  try {
    const response = await fetch('https://wttr.in/Dubai?format=j1');
    if (!response.ok) throw new Error('Weather API error');
    
    const data = await response.json();
    const current = data.current_condition[0];
    
    return {
      temp: current.temp_C,
      condition: current.weatherDesc[0].value,
      humidity: current.humidity,
      wind: current.windspeedKmph
    };
  } catch (error) {
    console.error('[Telegram Bot] Weather error:', error);
    return { temp: '30', condition: 'Sunny', humidity: '50', wind: '15' };
  }
}

// Format weather message
async function formatWeatherMessage(lang: LangCode): Promise<string> {
  const weather = await getDubaiWeather();
  
  const messages = {
    en: `*Dubai Weather Now:*\n\nTemperature: ${weather.temp}°C\nCondition: ${weather.condition}\nHumidity: ${weather.humidity}%\nWind: ${weather.wind} km/h\n\n_Best time to visit Dubai is November to March when temperatures are pleasant!_`,
    he: `*מזג האוויר בדובאי עכשיו:*\n\nטמפרטורה: ${weather.temp}°C\nמצב: ${weather.condition}\nלחות: ${weather.humidity}%\nרוח: ${weather.wind} קמ"ש\n\n_הזמן הטוב ביותר לבקר בדובאי הוא נובמבר עד מרץ כשהטמפרטורות נעימות!_`,
    ar: `*طقس دبي الآن:*\n\nدرجة الحرارة: ${weather.temp}°C\nالحالة: ${weather.condition}\nالرطوبة: ${weather.humidity}%\nالرياح: ${weather.wind} كم/س\n\n_أفضل وقت لزيارة دبي هو من نوفمبر إلى مارس عندما تكون درجات الحرارة معتدلة!_`
  };
  
  return messages[lang];
}

// Currency conversion rates (AED base)
const currencyRates: Record<string, number> = {
  USD: 0.272,
  EUR: 0.251,
  GBP: 0.215,
  ILS: 1.00,
  INR: 22.73,
  RUB: 26.45
};

// Format currency message
function formatCurrencyMessage(lang: LangCode): string {
  const messages = {
    en: `*AED Currency Converter:*\n\n100 AED =\n• $${(100 * currencyRates.USD).toFixed(2)} USD\n• €${(100 * currencyRates.EUR).toFixed(2)} EUR\n• £${(100 * currencyRates.GBP).toFixed(2)} GBP\n• ₪${(100 * currencyRates.ILS).toFixed(2)} ILS\n• ₹${(100 * currencyRates.INR).toFixed(2)} INR\n\n_Send "convert 500 AED" for custom amounts!_`,
    he: `*המרת מטבע דירהם:*\n\n100 AED =\n• $${(100 * currencyRates.USD).toFixed(2)} דולר\n• €${(100 * currencyRates.EUR).toFixed(2)} יורו\n• £${(100 * currencyRates.GBP).toFixed(2)} לירה\n• ₪${(100 * currencyRates.ILS).toFixed(2)} שקל\n• ₹${(100 * currencyRates.INR).toFixed(2)} רופי\n\n_שלח "המר 500" לסכומים מותאמים!_`,
    ar: `*تحويل العملات من الدرهم:*\n\n100 AED =\n• $${(100 * currencyRates.USD).toFixed(2)} دولار\n• €${(100 * currencyRates.EUR).toFixed(2)} يورو\n• £${(100 * currencyRates.GBP).toFixed(2)} جنيه\n• ₪${(100 * currencyRates.ILS).toFixed(2)} شيكل\n• ₹${(100 * currencyRates.INR).toFixed(2)} روبية\n\n_أرسل "تحويل 500" للمبالغ المخصصة!_`
  };
  
  return messages[lang];
}

// Handle custom currency conversion
function handleCurrencyConversion(text: string, lang: LangCode): string | null {
  const match = text.match(/(?:convert|המר|تحويل)?\s*(\d+)\s*(?:aed|درهم)?/i);
  if (!match) return null;
  
  const amount = parseInt(match[1]);
  if (isNaN(amount) || amount <= 0) return null;
  
  const result = {
    en: `*${amount} AED =*\n• $${(amount * currencyRates.USD).toFixed(2)} USD\n• €${(amount * currencyRates.EUR).toFixed(2)} EUR\n• £${(amount * currencyRates.GBP).toFixed(2)} GBP\n• ₪${(amount * currencyRates.ILS).toFixed(2)} ILS\n• ₹${(amount * currencyRates.INR).toFixed(2)} INR`,
    he: `*${amount} דירהם =*\n• $${(amount * currencyRates.USD).toFixed(2)} דולר\n• €${(amount * currencyRates.EUR).toFixed(2)} יורו\n• £${(amount * currencyRates.GBP).toFixed(2)} לירה\n• ₪${(amount * currencyRates.ILS).toFixed(2)} שקל\n• ₹${(amount * currencyRates.INR).toFixed(2)} רופי`,
    ar: `*${amount} درهم =*\n• $${(amount * currencyRates.USD).toFixed(2)} دولار\n• €${(amount * currencyRates.EUR).toFixed(2)} يورو\n• £${(amount * currencyRates.GBP).toFixed(2)} جنيه\n• ₪${(amount * currencyRates.ILS).toFixed(2)} شيكل\n• ₹${(amount * currencyRates.INR).toFixed(2)} روبية`
  };
  
  return result[lang];
}

// Handle location sharing - find nearby places
async function handleLocationMessage(chatId: number, latitude: number, longitude: number) {
  const lang = await getUserLang(chatId);
  
  // For now, respond with general Dubai location tips
  // In a full implementation, you'd calculate distances to attractions
  const messages = {
    en: `*Location received!*\n\nI see you're in Dubai. Here are some tips:\n\n• Use the Dubai Metro for easy transport\n• Download RTA Dubai app for navigation\n• Most attractions are within 30 min drive\n\nAsk me "What's nearby?" for recommendations!`,
    he: `*קיבלתי את המיקום!*\n\nאני רואה שאתה בדובאי. הנה כמה טיפים:\n\n• השתמש במטרו של דובאי לתחבורה קלה\n• הורד את אפליקציית RTA Dubai לניווט\n• רוב האטרקציות נמצאות עד 30 דקות נסיעה\n\nשאל אותי "מה יש בסביבה?" להמלצות!`,
    ar: `*تم استلام موقعك!*\n\nأرى أنك في دبي. إليك بعض النصائح:\n\n• استخدم مترو دبي للتنقل السهل\n• حمّل تطبيق RTA Dubai للملاحة\n• معظم المعالم على بعد 30 دقيقة بالسيارة\n\nاسألني "ما القريب مني؟" للتوصيات!`
  };
  
  await bot?.sendMessage(chatId, messages[lang], { 
    parse_mode: 'Markdown',
    reply_markup: getReplyKeyboard(lang)
  });
}

async function getPerplexityResponse(chatId: number, userMessage: string, profile: TelegramUserProfile): Promise<string> {
  const lang = profile.language as LangCode;
  
  // Get conversation history from database
  const conversation = await getConversationHistory(profile.id);
  
  // Save user message to database
  await saveConversationMessage(profile.id, 'user', userMessage);

  // Build messages array with proper alternation
  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompts[lang] }
  ];
  
  // Add conversation history ensuring proper alternation
  let lastRole = 'system';
  for (const msg of conversation) {
    if ((lastRole === 'system' || lastRole === 'assistant') && msg.role === 'user') {
      messages.push({ role: 'user', content: msg.content });
      lastRole = 'user';
    } else if (lastRole === 'user' && msg.role === 'assistant') {
      messages.push({ role: 'assistant', content: msg.content });
      lastRole = 'assistant';
    }
  }
  
  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Telegram Bot] Perplexity API response:', errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const rawMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
    // Clean citation numbers from Perplexity response
    const assistantMessage = cleanCitations(rawMessage);
    
    // Save assistant response to database
    await saveConversationMessage(profile.id, 'assistant', assistantMessage);
    
    return assistantMessage;
  } catch (error) {
    console.error('[Telegram Bot] Perplexity error:', error);
    const errorMessages = {
      en: 'Sorry, I encountered an error. Please try again.',
      he: 'סליחה, נתקלתי בשגיאה. אנא נסה שוב.',
      ar: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
    };
    return errorMessages[lang];
  }
}

function showLanguageSelection(chatId: number) {
  bot?.sendMessage(chatId, 'Please select your language / בחר שפה / اختر اللغة:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'English', callback_data: 'lang_en' }],
        [{ text: 'עברית', callback_data: 'lang_he' }],
        [{ text: 'العربية', callback_data: 'lang_ar' }]
      ]
    }
  });
}

// Check if message is a menu button press
function isMenuButton(text: string, lang: LangCode): string | null {
  const labels = menuLabels[lang];
  
  // Check all languages to handle edge cases
  for (const l of ['en', 'he', 'ar'] as LangCode[]) {
    const lbl = menuLabels[l];
    if (text === lbl.attractions) return 'attractions';
    if (text === lbl.hotels) return 'hotels';
    if (text === lbl.restaurants) return 'restaurants';
    if (text === lbl.weather) return 'weather';
    if (text === lbl.currency) return 'currency';
    if (text === lbl.help) return 'help';
  }
  
  return null;
}

export function initTelegramBot() {
  if (!token) {
    console.log('[Telegram Bot] No TELEGRAM_BOT_TOKEN found, bot disabled');
    return null;
  }

  if (!perplexityApiKey) {
    console.log('[Telegram Bot] No PERPLEXITY_API_KEY found, AI features disabled');
  }

  try {
    bot = new TelegramBot(token, { polling: true });
    console.log('[Telegram Bot] AI Assistant Bot started with polling (Perplexity + CMS)');

    // /start command
    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const profile = await getOrCreateUserProfile(chatId, msg.from);
      
      // Check if language was previously set (not default 'en' for new users, or user has interacted before)
      if (profile.totalInteractions > 1 || profile.language !== 'en') {
        const lang = profile.language as LangCode;
        const firstName = msg.from?.first_name || 'Guest';
        await bot?.sendMessage(chatId, welcomeMessages[lang](firstName), { 
          parse_mode: 'Markdown',
          reply_markup: getReplyKeyboard(lang)
        });
      } else {
        showLanguageSelection(chatId);
      }
    });

    // /language command
    bot.onText(/\/language/, (msg) => {
      showLanguageSelection(msg.chat.id);
    });

    // /clear command - clear conversation history
    bot.onText(/\/clear/, async (msg) => {
      const chatId = msg.chat.id;
      const profile = await getOrCreateUserProfile(chatId, msg.from);
      
      // Clear conversation from database
      try {
        await db.delete(telegramConversations)
          .where(eq(telegramConversations.telegramUserId, profile.id));
      } catch (error) {
        console.error('[Telegram Bot] Error clearing conversation:', error);
      }
      
      const lang = profile.language as LangCode;
      const clearMessages = {
        en: 'Conversation cleared! Start fresh.',
        he: 'השיחה נמחקה! מתחילים מחדש.',
        ar: 'تم مسح المحادثة! ابدأ من جديد.'
      };
      await bot?.sendMessage(chatId, clearMessages[lang], {
        reply_markup: getReplyKeyboard(lang)
      });
    });

    // /weather command
    bot.onText(/\/weather/, async (msg) => {
      const chatId = msg.chat.id;
      const lang = await getUserLang(chatId);
      await bot?.sendChatAction(chatId, 'typing');
      const weatherMsg = await formatWeatherMessage(lang);
      await bot?.sendMessage(chatId, weatherMsg, { 
        parse_mode: 'Markdown',
        reply_markup: getReplyKeyboard(lang)
      });
    });

    // /currency command
    bot.onText(/\/currency/, async (msg) => {
      const chatId = msg.chat.id;
      const lang = await getUserLang(chatId);
      const currencyMsg = formatCurrencyMessage(lang);
      await bot?.sendMessage(chatId, currencyMsg, { 
        parse_mode: 'Markdown',
        reply_markup: getReplyKeyboard(lang)
      });
    });

    // /help command
    bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;
      const lang = await getUserLang(chatId);
      const helpMessages = {
        en: '*Travi - Your Dubai Travel Assistant*\n\nUse the menu buttons below or type your question!\n\n*Commands:*\n/start - Start conversation\n/language - Change language\n/weather - Dubai weather\n/currency - Currency converter\n/clear - Clear history\n/help - Show this help\n\nYou can also share your location for nearby recommendations!',
        he: '*טראבי - העוזר שלך לטיולים בדובאי*\n\nהשתמש בכפתורי התפריט למטה או כתוב את השאלה שלך!\n\n*פקודות:*\n/start - התחל שיחה\n/language - שנה שפה\n/weather - מזג אוויר\n/currency - המרת מטבע\n/clear - נקה היסטוריה\n/help - הצג עזרה\n\nאתה יכול גם לשתף את המיקום שלך להמלצות בסביבה!',
        ar: '*ترافي - مساعدك للسفر في دبي*\n\nاستخدم أزرار القائمة أدناه أو اكتب سؤالك!\n\n*الأوامر:*\n/start - بدء المحادثة\n/language - تغيير اللغة\n/weather - الطقس\n/currency - تحويل العملات\n/clear - مسح السجل\n/help - عرض المساعدة\n\nيمكنك أيضاً مشاركة موقعك للحصول على توصيات قريبة!'
      };
      await bot?.sendMessage(chatId, helpMessages[lang], { 
        parse_mode: 'Markdown',
        reply_markup: getReplyKeyboard(lang)
      });
    });

    // Handle callback queries (language selection)
    bot.on('callback_query', async (callbackQuery) => {
      const chatId = callbackQuery.message?.chat.id;
      const data = callbackQuery.data;
      const firstName = callbackQuery.from?.first_name || 'Guest';

      if (!chatId) return;

      await bot?.answerCallbackQuery(callbackQuery.id);

      // Handle language selection
      if (data?.startsWith('lang_')) {
        const langCode = data.replace('lang_', '') as LangCode;
        const profile = await getOrCreateUserProfile(chatId, callbackQuery.from);
        await updateUserLanguage(chatId, langCode);
        
        // Clear conversation history on language change
        try {
          await db.delete(telegramConversations)
            .where(eq(telegramConversations.telegramUserId, profile.id));
        } catch (error) {
          console.error('[Telegram Bot] Error clearing conversation:', error);
        }
        
        await bot?.sendMessage(chatId, languageChangedMessages[langCode]);
        await bot?.sendMessage(chatId, welcomeMessages[langCode](firstName), { 
          parse_mode: 'Markdown',
          reply_markup: getReplyKeyboard(langCode)
        });
      }
    });

    // Handle location messages
    bot.on('location', async (msg) => {
      const chatId = msg.chat.id;
      if (msg.location) {
        await handleLocationMessage(chatId, msg.location.latitude, msg.location.longitude);
      }
    });

    // Handle all text messages (AI conversation + menu buttons)
    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      // Ignore commands and location messages
      if (!text || text.startsWith('/') || msg.location) return;

      // Get or create user profile
      const profile = await getOrCreateUserProfile(chatId, msg.from);
      
      // Check if user has selected language (new users with default 'en' and no interactions)
      if (profile.totalInteractions <= 1 && profile.language === 'en') {
        // Check if cache indicates this is truly a new user
        const cached = userProfileCache.get(chatId);
        if (!cached || (cached.totalInteractions <= 1 && cached.language === 'en')) {
          showLanguageSelection(chatId);
          return;
        }
      }

      const lang = profile.language as LangCode;

      // Check if it's a menu button press
      const menuAction = isMenuButton(text, lang);
      if (menuAction) {
        await bot?.sendChatAction(chatId, 'typing');
        
        switch (menuAction) {
          case 'attractions': {
            const { text: attractionsText, items } = await formatAttractionsMessage(lang);
            
            // Send first attraction image if available
            if (items.length > 0 && items[0].heroImage) {
              try {
                await bot?.sendPhoto(chatId, items[0].heroImage, {
                  caption: items[0].title
                });
              } catch (e) {
                // Image might not be accessible, continue without it
              }
            }
            
            await bot?.sendMessage(chatId, attractionsText, { 
              parse_mode: 'Markdown',
              reply_markup: getReplyKeyboard(lang)
            });
            break;
          }
          case 'hotels': {
            const { text: hotelsText, items } = await formatHotelsMessage(lang);
            
            if (items.length > 0 && items[0].heroImage) {
              try {
                await bot?.sendPhoto(chatId, items[0].heroImage, {
                  caption: items[0].title
                });
              } catch (e) {
                // Continue without image
              }
            }
            
            await bot?.sendMessage(chatId, hotelsText, { 
              parse_mode: 'Markdown',
              reply_markup: getReplyKeyboard(lang)
            });
            break;
          }
          case 'restaurants': {
            const { text: diningText, items } = await formatDiningMessage(lang);
            
            if (items.length > 0 && items[0].heroImage) {
              try {
                await bot?.sendPhoto(chatId, items[0].heroImage, {
                  caption: items[0].title
                });
              } catch (e) {
                // Continue without image
              }
            }
            
            await bot?.sendMessage(chatId, diningText, { 
              parse_mode: 'Markdown',
              reply_markup: getReplyKeyboard(lang)
            });
            break;
          }
          case 'weather': {
            const weatherMsg = await formatWeatherMessage(lang);
            await bot?.sendMessage(chatId, weatherMsg, { 
              parse_mode: 'Markdown',
              reply_markup: getReplyKeyboard(lang)
            });
            break;
          }
          case 'currency': {
            const currencyMsg = formatCurrencyMessage(lang);
            await bot?.sendMessage(chatId, currencyMsg, { 
              parse_mode: 'Markdown',
              reply_markup: getReplyKeyboard(lang)
            });
            break;
          }
          case 'help': {
            const helpMessages = {
              en: '*Travi - Your Dubai Travel Assistant*\n\nUse the menu buttons or type your question!\n\n*Commands:*\n/start - Start conversation\n/language - Change language\n/weather - Dubai weather\n/currency - Currency converter\n/clear - Clear history\n/help - Show this help',
              he: '*טראבי - העוזר שלך לטיולים בדובאי*\n\nהשתמש בכפתורי התפריט או כתוב את השאלה שלך!\n\n*פקודות:*\n/start - התחל שיחה\n/language - שנה שפה\n/weather - מזג אוויר\n/currency - המרת מטבע\n/clear - נקה היסטוריה\n/help - הצג עזרה',
              ar: '*ترافي - مساعدك للسفر في دبي*\n\nاستخدم أزرار القائمة أو اكتب سؤالك!\n\n*الأوامر:*\n/start - بدء المحادثة\n/language - تغيير اللغة\n/weather - الطقس\n/currency - تحويل العملات\n/clear - مسح السجل\n/help - عرض المساعدة'
            };
            await bot?.sendMessage(chatId, helpMessages[lang], { 
              parse_mode: 'Markdown',
              reply_markup: getReplyKeyboard(lang)
            });
            break;
          }
        }
        return;
      }

      // Check for currency conversion request
      const conversionResult = handleCurrencyConversion(text, lang);
      if (conversionResult) {
        await bot?.sendMessage(chatId, conversionResult, { 
          parse_mode: 'Markdown',
          reply_markup: getReplyKeyboard(lang)
        });
        return;
      }

      // Check if Perplexity API is available
      if (!perplexityApiKey) {
        const errorMessages = {
          en: 'AI features are currently unavailable. Please try again later.',
          he: 'תכונות הבינה המלאכותית אינן זמינות כרגע. אנא נסה שוב מאוחר יותר.',
          ar: 'ميزات الذكاء الاصطناعي غير متوفرة حالياً. يرجى المحاولة لاحقاً.'
        };
        await bot?.sendMessage(chatId, errorMessages[lang], {
          reply_markup: getReplyKeyboard(lang)
        });
        return;
      }

      // Show typing indicator
      await bot?.sendChatAction(chatId, 'typing');

      // Get AI response from Perplexity with user profile for conversation memory
      const response = await getPerplexityResponse(chatId, text, profile);
      
      await bot?.sendMessage(chatId, response, { 
        parse_mode: 'Markdown',
        reply_markup: getReplyKeyboard(lang)
      });
    });

    bot.on('polling_error', (error) => {
      console.error('[Telegram Bot] Polling error:', error.message);
    });

    return bot;
  } catch (error) {
    console.error('[Telegram Bot] Failed to initialize:', error);
    return null;
  }
}

export function getTelegramBot() {
  return bot;
}
