import React, { PropsWithChildren, useEffect, useState } from 'react';

import { BrandedLoader } from '@centerhit-components/common/BrandedLoader';
import { ForceUpdateScreen } from '@centerhit-components/common/ForceUpdateScreen';
import { CAMPAIGN_REFRESH_INTERVAL_MS } from '@centerhit-core/constants/remote';
import { useCampaignStore } from '@centerhit-features/campaign/store/useCampaignStore';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';
import { versionCheckService } from '@centerhit-features/version/services/versionCheckService';
import { VersionCheckResult } from '@centerhit-features/version/types/versionTypes';

const MIN_SPLASH_DURATION_MS = 1800;

export function BootstrapGate({ children }: PropsWithChildren) {
  const loadSettings = useSettingsStore(state => state.loadSettings);
  const loadProgress = useProgressStore(state => state.loadProgress);
  const loadCampaign = useCampaignStore(state => state.loadCampaign);
  const refreshCampaign = useCampaignStore(state => state.refreshCampaign);
  const [ready, setReady] = useState(false);
  const [requiredUpdate, setRequiredUpdate] = useState<VersionCheckResult | null>(null);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      const startedAt = Date.now();

      try {
        await loadSettings();
        const language = useSettingsStore.getState().settings.language;
        const [, , versionResult] = await Promise.all([
          loadProgress(),
          loadCampaign(),
          versionCheckService.checkForRequiredUpdate(language),
        ]);

        const elapsedMs = Date.now() - startedAt;
        const remainingMs = Math.max(MIN_SPLASH_DURATION_MS - elapsedMs, 0);
        if (remainingMs > 0) {
          await new Promise<void>(resolve => {
            setTimeout(() => resolve(), remainingMs);
          });
        }

        if (!active) {
          return;
        }

        if (versionResult?.isUpdateRequired) {
          setRequiredUpdate(versionResult);
          return;
        }

        setReady(true);
      } catch {
        const elapsedMs = Date.now() - startedAt;
        const remainingMs = Math.max(MIN_SPLASH_DURATION_MS - elapsedMs, 0);
        if (remainingMs > 0) {
          await new Promise<void>(resolve => {
            setTimeout(() => resolve(), remainingMs);
          });
        }

        if (active) {
          setReady(true);
        }
      }
    };

    bootstrap().catch(() => {
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
    if (requiredUpdate) {
      return <ForceUpdateScreen result={requiredUpdate} />;
    }

    return <BrandedLoader />;
  }

  return <>{children}</>;
}
