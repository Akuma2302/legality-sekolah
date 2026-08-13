import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || '*',

  // Telegram bot integration for Program Form submissions.
  // All optional — if unset, submissions still save but Telegram delivery is skipped (logged, not fatal).
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '', // the group/supergroup chat ID (same group for both topics)
  telegramTopicId1: process.env.TELEGRAM_TOPIC_ID_1 || '', // message_thread_id of the first topic
  telegramTopicId2: process.env.TELEGRAM_TOPIC_ID_2 || '', // message_thread_id of the second topic
};
