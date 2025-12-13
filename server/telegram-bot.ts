import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

let bot: TelegramBot | null = null;

// Store user language preferences (in production, save to database)
const userLanguages: Map<number, string> = new Map();

const messages = {
  en: {
    welcome: (name: string) => `Welcome ${name}!\n\nWelcome to *Travi* - Your complete guide to exploring Dubai!\n\nChoose from the menu below:`,
    hotels: 'Hotels',
    attractions: 'Attractions',
    dining: 'Dining',
    districts: 'Districts',
    articles: 'Articles',
    transport: 'Transport',
    search: 'Search',
    hotelsDesc: '*Hotels in Dubai*\n\nExplore the best hotels for your stay.',
    attractionsDesc: '*Attractions in Dubai*\n\nDiscover amazing places to visit.',
    diningDesc: '*Dining in Dubai*\n\nFind the best restaurants and cafes.',
    districtsDesc: '*Dubai Districts*\n\nExplore different areas of Dubai.',
    articlesDesc: '*Travel Articles*\n\nRead helpful tips and guides.',
    transportDesc: '*Transport*\n\nLearn about getting around Dubai.',
    searchDesc: '*Search*\n\nFind what you need quickly.',
    viewAll: 'View All',
    openInBrowser: 'Open in Browser',
    languageChanged: 'Language changed to English!',
    help: '*Available Commands:*\n\n/start - Start the bot and see main menu\n/help - Show this help message\n/language - Change language'
  },
  he: {
    welcome: (name: string) => `שלום ${name}!\n\nברוכים הבאים ל-*Travi* - המדריך המלא שלך לגילוי דובאי!\n\nבחר מהתפריט למטה:`,
    hotels: 'מלונות',
    attractions: 'אטרקציות',
    dining: 'מסעדות',
    districts: 'אזורים',
    articles: 'מאמרים',
    transport: 'תחבורה',
    search: 'חיפוש',
    hotelsDesc: '*מלונות בדובאי*\n\nגלה את המלונות הטובים ביותר לשהותך.',
    attractionsDesc: '*אטרקציות בדובאי*\n\nגלה מקומות מדהימים לביקור.',
    diningDesc: '*מסעדות בדובאי*\n\nמצא את המסעדות והקפה הטובים ביותר.',
    districtsDesc: '*אזורים בדובאי*\n\nגלה אזורים שונים בדובאי.',
    articlesDesc: '*מאמרי טיולים*\n\nקרא טיפים ומדריכים שימושיים.',
    transportDesc: '*תחבורה*\n\nלמד על התניידות בדובאי.',
    searchDesc: '*חיפוש*\n\nמצא מה שאתה צריך במהירות.',
    viewAll: 'צפה בהכל',
    openInBrowser: 'פתח בדפדפן',
    languageChanged: 'השפה שונתה לעברית!',
    help: '*פקודות זמינות:*\n\n/start - הפעל את הבוט וראה תפריט ראשי\n/help - הצג הודעת עזרה זו\n/language - שנה שפה'
  },
  ar: {
    welcome: (name: string) => `مرحباً ${name}!\n\nأهلاً بك في *Travi* - دليلك الشامل لاستكشاف دبي!\n\nاختر من القائمة أدناه:`,
    hotels: 'فنادق',
    attractions: 'معالم سياحية',
    dining: 'مطاعم',
    districts: 'مناطق',
    articles: 'مقالات',
    transport: 'مواصلات',
    search: 'بحث',
    hotelsDesc: '*فنادق في دبي*\n\nاستكشف أفضل الفنادق لإقامتك.',
    attractionsDesc: '*معالم سياحية في دبي*\n\nاكتشف أماكن مذهلة للزيارة.',
    diningDesc: '*مطاعم في دبي*\n\nابحث عن أفضل المطاعم والمقاهي.',
    districtsDesc: '*مناطق دبي*\n\nاستكشف مناطق مختلفة في دبي.',
    articlesDesc: '*مقالات السفر*\n\nاقرأ نصائح وأدلة مفيدة.',
    transportDesc: '*المواصلات*\n\nتعرف على التنقل في دبي.',
    searchDesc: '*البحث*\n\nابحث عما تحتاجه بسرعة.',
    viewAll: 'عرض الكل',
    openInBrowser: 'فتح في المتصفح',
    languageChanged: 'تم تغيير اللغة إلى العربية!',
    help: '*الأوامر المتاحة:*\n\n/start - بدء البوت وعرض القائمة الرئيسية\n/help - عرض رسالة المساعدة هذه\n/language - تغيير اللغة'
  }
};

type LangCode = 'en' | 'he' | 'ar';

function getUserLang(chatId: number): LangCode {
  return (userLanguages.get(chatId) as LangCode) || 'en';
}

function getMsg(chatId: number) {
  return messages[getUserLang(chatId)];
}

function showMainMenu(chatId: number, firstName: string) {
  const lang = getMsg(chatId);
  
  bot?.sendMessage(chatId, lang.welcome(firstName), {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: lang.hotels, callback_data: 'hotels' },
          { text: lang.attractions, callback_data: 'attractions' }
        ],
        [
          { text: lang.dining, callback_data: 'dining' },
          { text: lang.districts, callback_data: 'districts' }
        ],
        [
          { text: lang.articles, callback_data: 'articles' },
          { text: lang.transport, callback_data: 'transport' }
        ],
        [
          { text: lang.search, callback_data: 'search' }
        ]
      ]
    }
  });
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

export function initTelegramBot() {
  if (!token) {
    console.log('[Telegram Bot] No TELEGRAM_BOT_TOKEN found, bot disabled');
    return null;
  }

  try {
    bot = new TelegramBot(token, { polling: true });
    console.log('[Telegram Bot] Bot started with polling');

    // /start command
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      
      if (userLanguages.has(chatId)) {
        showMainMenu(chatId, msg.from?.first_name || 'Guest');
      } else {
        showLanguageSelection(chatId);
      }
    });

    // /language command
    bot.onText(/\/language/, (msg) => {
      showLanguageSelection(msg.chat.id);
    });

    // /help command
    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const lang = getMsg(chatId);
      bot?.sendMessage(chatId, lang.help, { parse_mode: 'Markdown' });
    });

    // /hotels command
    bot.onText(/\/hotels/, (msg) => {
      const chatId = msg.chat.id;
      const lang = getMsg(chatId);
      bot?.sendMessage(chatId, lang.hotelsDesc, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: lang.viewAll, url: 'https://mzgdubai.replit.app/hotels' }]
          ]
        }
      });
    });

    // /attractions command
    bot.onText(/\/attractions/, (msg) => {
      const chatId = msg.chat.id;
      const lang = getMsg(chatId);
      bot?.sendMessage(chatId, lang.attractionsDesc, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: lang.viewAll, url: 'https://mzgdubai.replit.app/attractions' }]
          ]
        }
      });
    });

    // /dining command
    bot.onText(/\/dining/, (msg) => {
      const chatId = msg.chat.id;
      const lang = getMsg(chatId);
      bot?.sendMessage(chatId, lang.diningDesc, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: lang.viewAll, url: 'https://mzgdubai.replit.app/dining' }]
          ]
        }
      });
    });

    // /districts command
    bot.onText(/\/districts/, (msg) => {
      const chatId = msg.chat.id;
      const lang = getMsg(chatId);
      bot?.sendMessage(chatId, lang.districtsDesc, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: lang.viewAll, url: 'https://mzgdubai.replit.app/districts' }]
          ]
        }
      });
    });

    // /articles command
    bot.onText(/\/articles/, (msg) => {
      const chatId = msg.chat.id;
      const lang = getMsg(chatId);
      bot?.sendMessage(chatId, lang.articlesDesc, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: lang.viewAll, url: 'https://mzgdubai.replit.app/articles' }]
          ]
        }
      });
    });

    // Handle callback queries (button clicks)
    bot.on('callback_query', async (callbackQuery) => {
      const chatId = callbackQuery.message?.chat.id;
      const data = callbackQuery.data;
      const firstName = callbackQuery.from?.first_name || 'Guest';

      if (!chatId) return;

      await bot?.answerCallbackQuery(callbackQuery.id);

      // Handle language selection
      if (data?.startsWith('lang_')) {
        const langCode = data.replace('lang_', '') as LangCode;
        userLanguages.set(chatId, langCode);
        const lang = messages[langCode];
        await bot?.sendMessage(chatId, lang.languageChanged);
        showMainMenu(chatId, firstName);
        return;
      }

      // Handle menu selections
      const lang = getMsg(chatId);
      const responses: Record<string, { text: string; url: string }> = {
        hotels: { text: lang.hotelsDesc, url: 'https://mzgdubai.replit.app/hotels' },
        attractions: { text: lang.attractionsDesc, url: 'https://mzgdubai.replit.app/attractions' },
        dining: { text: lang.diningDesc, url: 'https://mzgdubai.replit.app/dining' },
        districts: { text: lang.districtsDesc, url: 'https://mzgdubai.replit.app/districts' },
        articles: { text: lang.articlesDesc, url: 'https://mzgdubai.replit.app/articles' },
        transport: { text: lang.transportDesc, url: 'https://mzgdubai.replit.app/transport' },
        search: { text: lang.searchDesc, url: 'https://mzgdubai.replit.app/search' }
      };

      const response = responses[data || ''];
      if (response) {
        await bot?.sendMessage(chatId, response.text, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: lang.openInBrowser, url: response.url }]
            ]
          }
        });
      }
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
