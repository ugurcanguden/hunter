import { Platform } from 'react-native';

import { APP_VERSION } from '@centerhit-core/constants/app';
import { POCKETBASE_COLLECTIONS, POCKETBASE_URL } from '@centerhit-core/constants/remote';
import { STORAGE_KEYS } from '@centerhit-core/constants/storageKeys';
import { storageClient } from '@centerhit-core/storage/storageClient';
import {
  FeedbackDailyStatus,
  SubmitFeedbackInput,
} from '@centerhit-features/feedback/types/feedbackTypes';

type FeedbackCounter = {
  date: string;
  count: number;
};

const FEEDBACK_DAILY_LIMIT = 5;

function getLocalDateStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function getCounter(): Promise<FeedbackCounter> {
  const today = getLocalDateStamp();
  const stored = await storageClient.getItem<FeedbackCounter>(STORAGE_KEYS.feedbackDailyCounter);

  if (!stored || stored.date !== today) {
    return {
      date: today,
      count: 0,
    };
  }

  return stored;
}

async function saveCounter(counter: FeedbackCounter) {
  await storageClient.setItem(STORAGE_KEYS.feedbackDailyCounter, counter);
}

function toDailyStatus(counter: FeedbackCounter): FeedbackDailyStatus {
  const used = Math.min(counter.count, FEEDBACK_DAILY_LIMIT);

  return {
    limit: FEEDBACK_DAILY_LIMIT,
    used,
    remaining: Math.max(0, FEEDBACK_DAILY_LIMIT - used),
  };
}

export const feedbackService = {
  async getDailyStatus(): Promise<FeedbackDailyStatus> {
    const counter = await getCounter();
    return toDailyStatus(counter);
  },

  async submitFeedback(input: SubmitFeedbackInput) {
    const message = input.message.trim();

    if (!message) {
      throw new Error('Feedback message is empty.');
    }

    const counter = await getCounter();
    const dailyStatus = toDailyStatus(counter);

    if (dailyStatus.remaining <= 0) {
      throw new Error('Daily feedback limit reached.');
    }

    try {
      if (!POCKETBASE_URL) {
        throw new Error('PocketBase URL is not configured.');
      }

      const response = await fetch(
        `${POCKETBASE_URL}/api/collections/${POCKETBASE_COLLECTIONS.feedback}/records`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            app_version: APP_VERSION,
            platform: Platform.OS,
            category: input.category,
            message,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`PocketBase feedback submit failed: ${response.status}`);
      }
    } finally {
      await saveCounter({
        date: counter.date,
        count: counter.count + 1,
      });
    }
  },
};
