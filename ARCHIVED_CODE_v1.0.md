# Archived Code - Version 1.0
## Removed on: 2024-12-23
## Reason: Code optimization and cleanup

This file contains code that was removed during the v1.0 optimization cleanup.
If you need to restore any of this code, copy it back to the appropriate files.

---

## 1. Telegram Bot Integration (REMOVED)

### Package: node-telegram-bot-api
**Status:** Removed - was installed but never used in the codebase

### Schema Tables (from shared/schema.ts):
```typescript
// TELEGRAM BOT TABLES - For Telegram integration (matching existing DB structure)
// These tables are kept in the database but the code integration was removed

export const telegramUserProfiles = pgTable("telegram_user_profiles", {
  id: serial("id").primaryKey(),
  telegramId: varchar("telegram_id").notNull(),
  telegramUsername: varchar("telegram_username"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  languageCode: varchar("language_code"),
  isPremium: boolean("is_premium").default(false),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const telegramConversations = pgTable("telegram_conversations", {
  id: serial("id").primaryKey(),
  telegramUserId: varchar("telegram_user_id").references(() => telegramUserProfiles.id),
  messageContent: text("message_content"),
  messageType: varchar("message_type"),
  isBot: boolean("is_bot").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type TelegramUserProfile = typeof telegramUserProfiles.$inferSelect;
export type TelegramConversation = typeof telegramConversations.$inferSelect;
```

---

## 2. Temporarily Disabled Content Types

### Content Editor Types (from content-editor.tsx):
The following content types were disabled and may be re-enabled in future versions:
- transport
- event
- itinerary

```typescript
// TEMPORARILY DISABLED: "transport" | "event" | "itinerary" - Will be enabled later
type ContentType = "attraction" | "hotel" | "article" | "dining" | "district";
```

---

## 3. AI Features Disabled Routes

Multiple AI routes were returning "AI features are temporarily disabled".
These routes are still in place but gated by the AI_ENABLED environment variable.

Affected endpoints:
- POST /api/ai/generate-content
- POST /api/ai/translate
- POST /api/ai/suggest-keywords
- POST /api/image-engine/generate
- And others in server/routes.ts and server/routes/image-routes.ts

---

## Notes for Future Development

1. **Telegram Integration**: If re-enabling, the database tables already exist.
   Install the package with: `npm install node-telegram-bot-api`

2. **Content Types**: To re-enable transport/event/itinerary, search for
   "TEMPORARILY DISABLED" in content-editor.tsx and uncomment the relevant code.

3. **AI Features**: AI features are controlled by environment variables.
   Set AI_ENABLED=true in your .env file to enable.

---

Last updated: 2024-12-23
