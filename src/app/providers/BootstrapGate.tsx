import React, { PropsWithChildren, useEffect, useState } from 'react';

import { BrandedLoader } from '@centerhit-components/common/BrandedLoader';
import { CAMPAIGN_REFRESH_INTERVAL_MS } from '@centerhit-core/constants/remote';
import { useCampaignStore } from '@centerhit-features/campaign/store/useCampaignStore';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

export function BootstrapGate({ children }: PropsWithChildren) {
  const loadSettings = useSettingsStore(state => state.loadSettings);
  const loadProgress = useProgressStore(state => state.loadProgress);
  const loadCampaign = useCampaignStore(state => state.loadCampaign);
  const refreshCampaign = useCampaignStore(state => state.refreshCampaign);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([loadSettings(), loadProgress(), loadCampaign()]).finally(() => {
      if (active) {
        setReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, [loadCampaign, loadProgress, loadSettings]);

  useEffect(() => {
    if (!ready) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      refreshCampaign().catch(() => undefined);
    }, CAMPAIGN_REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [ready, refreshCampaign]);

  if (!ready) {
    return <BrandedLoader />;
  }

  return <>{children}</>;
}
