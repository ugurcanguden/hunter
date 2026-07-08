export type AppEvent = {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  prize_tr: string;
  prize_en: string;
  isActive: boolean;
};

export type SubmitEventEntryInput = {
  eventId: string;
  playerName: string;
  phone: string;
  deviceId: string;
};
