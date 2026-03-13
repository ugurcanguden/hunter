export type FeedbackCategory = 'complaint' | 'suggestion' | 'question' | 'other';

export type SubmitFeedbackInput = {
  category: FeedbackCategory;
  message: string;
};

export type FeedbackDailyStatus = {
  limit: number;
  remaining: number;
  used: number;
};
