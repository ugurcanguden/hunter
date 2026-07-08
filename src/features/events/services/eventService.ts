import DeviceInfo from 'react-native-device-info';

import { POCKETBASE_COLLECTIONS, POCKETBASE_URL } from '@centerhit-core/constants/remote';
import { STORAGE_KEYS } from '@centerhit-core/constants/storageKeys';
import { storageClient } from '@centerhit-core/storage/storageClient';
import { AppEvent, SubmitEventEntryInput } from '@centerhit-features/events/types/eventTypes';

async function fetchActiveEvent(): Promise<AppEvent | null> {
  if (!POCKETBASE_URL) {
    return null;
  }

  const response = await fetch(
    `${POCKETBASE_URL}/api/collections/${POCKETBASE_COLLECTIONS.events}/records?filter=(isActive=true)&perPage=1`,
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const items: AppEvent[] = data?.items ?? [];

  return items[0] ?? null;
}

export const eventService = {
  async loadActiveEvent(): Promise<AppEvent | null> {
    try {
      const event = await fetchActiveEvent();

      if (event) {
        await storageClient.setItem(STORAGE_KEYS.activeEventCache, event);
      } else {
        await storageClient.removeItem(STORAGE_KEYS.activeEventCache);
      }

      return event;
    } catch {
      return storageClient.getItem<AppEvent>(STORAGE_KEYS.activeEventCache);
    }
  },

  async getEnteredEventIds(): Promise<string[]> {
    const ids = await storageClient.getItem<string[]>(STORAGE_KEYS.enteredEventIds);
    return ids ?? [];
  },

  async markEventEntered(eventId: string): Promise<void> {
    const ids = await this.getEnteredEventIds();

    if (!ids.includes(eventId)) {
      await storageClient.setItem(STORAGE_KEYS.enteredEventIds, [...ids, eventId]);
    }
  },

  async submitEntry(input: SubmitEventEntryInput): Promise<void> {
    if (!POCKETBASE_URL) {
      throw new Error('PocketBase URL not configured.');
    }

    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/${POCKETBASE_COLLECTIONS.eventEntries}/records`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    );

    if (!response.ok) {
      throw new Error(`Event entry submit failed: ${response.status}`);
    }
  },

  async getDeviceId(): Promise<string> {
    return DeviceInfo.getUniqueId();
  },
};
