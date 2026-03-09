import React, { PropsWithChildren, useEffect, useState } from 'react';

import { BrandedLoader } from '@centerhit-components/common/BrandedLoader';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

export function BootstrapGate({ children }: PropsWithChildren) {
  const loadSettings = useSettingsStore(state => state.loadSettings);
  const loadProgress = useProgressStore(state => state.loadProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([loadSettings(), loadProgress()]).finally(() => {
      if (active) {
        setReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, [loadProgress, loadSettings]);

  if (!ready) {
    return <BrandedLoader />;
  }

  return <>{children}</>;
}
