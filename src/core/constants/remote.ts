export const POCKETBASE_URL = 'https://pocketbase.curioboxapp.info';
export const CAMPAIGN_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export const POCKETBASE_COLLECTIONS = {
  packs: 'campaign_packs',
  levels: 'campaign_levels',
  versionRules: 'app_version_rules',
  feedback: 'app_feedback',
} as const;
