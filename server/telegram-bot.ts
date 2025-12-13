import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

let bot: TelegramBot | null = null;

export function initTelegramBot() {
  if (!token) {
    console.log('[Telegram Bot] No TELEGRAM_BOT_TOKEN found, bot disabled');
    return null;
  }

  try {
    bot = new TelegramBot(token, { polling: true });
    console.log('[Telegram Bot] Bot started with polling');

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || 'Guest';

      const welcomeMessage = `
مرحباً ${firstName}! 🌴

أهلاً بك في *Travi* - دليلك الشامل لاستكشاف دبي!

اختر من القائمة أدناه:
      `.trim();

      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🏨 Hotels', callback_data: 'hotels' },
              { text: '🎢 Attractions', callback_data: 'attractions' }
            ],
            [
              { text: '🍽️ Dining', callback_data: 'dining' },
              { text: '🏙️ Districts', callback_data: 'districts' }
            ],
            [
              { text: '📰 Articles', callback_data: 'articles' },
              { text: '🚇 Transport', callback_data: 'transport' }
            ],
            [
              { text: '🔍 Search', callback_data: 'search' }
            ]
          ]
        },
        parse_mode: 'Markdown' as const
      };

      bot?.sendMessage(chatId, welcomeMessage, keyboard);
    });

    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `
*Available Commands:*

/start - Start the bot and see main menu
/help - Show this help message
/hotels - Browse hotels in Dubai
/attractions - Explore attractions
/dining - Find restaurants
/districts - Discover Dubai districts
/articles - Read travel articles
      `.trim();

      bot?.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    });

    bot.onText(/\/hotels/, (msg) => {
      const chatId = msg.chat.id;
      bot?.sendMessage(chatId, '🏨 *Hotels in Dubai*\n\nExplore the best hotels for your stay.', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 View All Hotels', url: 'https://mzgdubai.replit.app/hotels' }]
          ]
        }
      });
    });

    bot.onText(/\/attractions/, (msg) => {
      const chatId = msg.chat.id;
      bot?.sendMessage(chatId, '🎢 *Attractions in Dubai*\n\nDiscover amazing places to visit.', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 View All Attractions', url: 'https://mzgdubai.replit.app/attractions' }]
          ]
        }
      });
    });

    bot.onText(/\/dining/, (msg) => {
      const chatId = msg.chat.id;
      bot?.sendMessage(chatId, '🍽️ *Dining in Dubai*\n\nFind the best restaurants and cafes.', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 View All Restaurants', url: 'https://mzgdubai.replit.app/dining' }]
          ]
        }
      });
    });

    bot.onText(/\/districts/, (msg) => {
      const chatId = msg.chat.id;
      bot?.sendMessage(chatId, '🏙️ *Dubai Districts*\n\nExplore different areas of Dubai.', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 View All Districts', url: 'https://mzgdubai.replit.app/districts' }]
          ]
        }
      });
    });

    bot.onText(/\/articles/, (msg) => {
      const chatId = msg.chat.id;
      bot?.sendMessage(chatId, '📰 *Travel Articles*\n\nRead helpful tips and guides.', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 View All Articles', url: 'https://mzgdubai.replit.app/articles' }]
          ]
        }
      });
    });

    bot.on('callback_query', async (callbackQuery) => {
      const chatId = callbackQuery.message?.chat.id;
      const data = callbackQuery.data;

      if (!chatId) return;

      await bot?.answerCallbackQuery(callbackQuery.id);

      const responses: Record<string, { text: string; url: string }> = {
        hotels: { text: '🏨 *Hotels*\n\nExplore the best hotels in Dubai.', url: 'https://mzgdubai.replit.app/hotels' },
        attractions: { text: '🎢 *Attractions*\n\nDiscover amazing places to visit.', url: 'https://mzgdubai.replit.app/attractions' },
        dining: { text: '🍽️ *Dining*\n\nFind great restaurants and cafes.', url: 'https://mzgdubai.replit.app/dining' },
        districts: { text: '🏙️ *Districts*\n\nExplore different areas of Dubai.', url: 'https://mzgdubai.replit.app/districts' },
        articles: { text: '📰 *Articles*\n\nRead helpful travel tips and guides.', url: 'https://mzgdubai.replit.app/articles' },
        transport: { text: '🚇 *Transport*\n\nLearn about getting around Dubai.', url: 'https://mzgdubai.replit.app/transport' },
        search: { text: '🔍 *Search*\n\nFind what you need quickly.', url: 'https://mzgdubai.replit.app/search' }
      };

      const response = responses[data || ''];
      if (response) {
        await bot?.sendMessage(chatId, response.text, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌐 Open in Browser', url: response.url }]
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
