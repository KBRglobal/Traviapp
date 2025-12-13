import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
const perplexityApiKey = process.env.PERPLEXITY_API_KEY;

let bot: TelegramBot | null = null;

// Store user language preferences and conversation history
const userLanguages: Map<number, string> = new Map();
const userConversations: Map<number, Array<{ role: 'user' | 'assistant'; content: string }>> = new Map();

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
  en: (name: string) => `Hi ${name}! I'm *Travi*, your AI travel assistant for Dubai.\n\nAsk me anything about:\n- Hotels & accommodations\n- Attractions & things to do\n- Restaurants & dining\n- Transportation\n- Local tips & culture\n\nHow can I help you plan your Dubai adventure?`,
  he: (name: string) => `היי ${name}! אני *טראבי*, העוזר האישי שלך לטיולים בדובאי.\n\nאפשר לשאול אותי על:\n- מלונות ולינה\n- אטרקציות ודברים לעשות\n- מסעדות ואוכל\n- תחבורה\n- טיפים מקומיים ותרבות\n\nאיך אני יכול לעזור לך לתכנן את ההרפתקה שלך בדובאי?`,
  ar: (name: string) => `مرحباً ${name}! أنا *ترافي*، مساعدك الذكي للسفر في دبي.\n\nيمكنك أن تسألني عن:\n- الفنادق والإقامة\n- المعالم السياحية والأنشطة\n- المطاعم والطعام\n- المواصلات\n- النصائح المحلية والثقافة\n\nكيف يمكنني مساعدتك في التخطيط لمغامرتك في دبي؟`
};

const languageChangedMessages = {
  en: 'Language changed to English! How can I help you?',
  he: 'השפה שונתה לעברית! איך אני יכול לעזור?',
  ar: 'تم تغيير اللغة إلى العربية! كيف يمكنني مساعدتك؟'
};

type LangCode = 'en' | 'he' | 'ar';

function getUserLang(chatId: number): LangCode {
  return (userLanguages.get(chatId) as LangCode) || 'en';
}

function getConversation(chatId: number) {
  if (!userConversations.has(chatId)) {
    userConversations.set(chatId, []);
  }
  return userConversations.get(chatId)!;
}

async function getPerplexityResponse(chatId: number, userMessage: string): Promise<string> {
  const lang = getUserLang(chatId);

  // Simple messages array - just system + user for reliability
  const messages = [
    { role: 'system', content: systemPrompts[lang] },
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
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
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
    
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
    console.log('[Telegram Bot] AI Assistant Bot started with polling (Perplexity)');

    // /start command
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      
      if (userLanguages.has(chatId)) {
        const lang = getUserLang(chatId);
        const firstName = msg.from?.first_name || 'Guest';
        bot?.sendMessage(chatId, welcomeMessages[lang](firstName), { parse_mode: 'Markdown' });
      } else {
        showLanguageSelection(chatId);
      }
    });

    // /language command
    bot.onText(/\/language/, (msg) => {
      showLanguageSelection(msg.chat.id);
    });

    // /clear command - clear conversation history
    bot.onText(/\/clear/, (msg) => {
      const chatId = msg.chat.id;
      userConversations.delete(chatId);
      const lang = getUserLang(chatId);
      const clearMessages = {
        en: 'Conversation cleared! Start fresh.',
        he: 'השיחה נמחקה! מתחילים מחדש.',
        ar: 'تم مسح المحادثة! ابدأ من جديد.'
      };
      bot?.sendMessage(chatId, clearMessages[lang]);
    });

    // /help command
    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const lang = getUserLang(chatId);
      const helpMessages = {
        en: '*Travi - Your Dubai Travel Assistant*\n\nJust type your question and I will help you!\n\n*Commands:*\n/start - Start conversation\n/language - Change language\n/clear - Clear conversation history\n/help - Show this help',
        he: '*טראבי - העוזר שלך לטיולים בדובאי*\n\nפשוט כתוב את השאלה שלך ואני אעזור לך!\n\n*פקודות:*\n/start - התחל שיחה\n/language - שנה שפה\n/clear - נקה היסטוריית שיחה\n/help - הצג עזרה',
        ar: '*ترافي - مساعدك للسفر في دبي*\n\nاكتب سؤالك وسأساعدك!\n\n*الأوامر:*\n/start - بدء المحادثة\n/language - تغيير اللغة\n/clear - مسح سجل المحادثة\n/help - عرض المساعدة'
      };
      bot?.sendMessage(chatId, helpMessages[lang], { parse_mode: 'Markdown' });
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
        userLanguages.set(chatId, langCode);
        userConversations.delete(chatId); // Clear history on language change
        
        await bot?.sendMessage(chatId, languageChangedMessages[langCode]);
        await bot?.sendMessage(chatId, welcomeMessages[langCode](firstName), { parse_mode: 'Markdown' });
      }
    });

    // Handle all text messages (AI conversation)
    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      // Ignore commands
      if (!text || text.startsWith('/')) return;

      // Check if user has selected language
      if (!userLanguages.has(chatId)) {
        showLanguageSelection(chatId);
        return;
      }

      // Check if Perplexity API is available
      if (!perplexityApiKey) {
        const lang = getUserLang(chatId);
        const errorMessages = {
          en: 'AI features are currently unavailable. Please try again later.',
          he: 'תכונות הבינה המלאכותית אינן זמינות כרגע. אנא נסה שוב מאוחר יותר.',
          ar: 'ميزات الذكاء الاصطناعي غير متوفرة حالياً. يرجى المحاولة لاحقاً.'
        };
        await bot?.sendMessage(chatId, errorMessages[lang]);
        return;
      }

      // Show typing indicator
      await bot?.sendChatAction(chatId, 'typing');

      // Get AI response from Perplexity
      const response = await getPerplexityResponse(chatId, text);
      
      await bot?.sendMessage(chatId, response, { parse_mode: 'Markdown' });
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
