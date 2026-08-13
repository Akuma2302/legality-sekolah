import { env } from '../config/env.js';

/**
 * Sends a message to one Telegram topic (message_thread_id) within env.telegramChatId.
 * Uses the Bot API directly over HTTPS — no SDK needed.
 * Throws if the config is missing or the Telegram API call fails.
 */
async function sendToTopic(text, topicId) {
  if (!env.telegramBotToken || !env.telegramChatId) {
    throw new Error('Telegram bot is not configured yet (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing)');
  }
  if (!topicId) {
    throw new Error('Missing topic ID');
  }

  const url = `https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.telegramChatId,
      message_thread_id: Number(topicId),
      text,
      parse_mode: 'HTML',
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.description || `Telegram API error (${res.status})`);
  }
  return data;
}

/**
 * Sends `text` to both configured topics. Each topic is attempted independently —
 * one failing doesn't stop the other. Returns a summary of what succeeded.
 */
export async function sendToBothTopics(text) {
  const topics = [env.telegramTopicId1, env.telegramTopicId2].filter(Boolean);

  if (topics.length === 0) {
    return { sent: false, error: 'No Telegram topic IDs configured yet' };
  }

  const results = await Promise.allSettled(topics.map((topicId) => sendToTopic(text, topicId)));
  const failures = results.filter((r) => r.status === 'rejected');

  if (failures.length === 0) {
    return { sent: true, error: '' };
  }
  if (failures.length === results.length) {
    return { sent: false, error: failures.map((f) => f.reason.message).join('; ') };
  }
  // Partial success — at least one topic got it
  return { sent: true, error: `Partially sent — failed: ${failures.map((f) => f.reason.message).join('; ')}` };
}
