import { create } from 'zustand';

import { eventService } from '@centerhit-features/events/services/eventService';
import { AppEvent } from '@centerhit-features/events/types/eventTypes';

type EventStore = {
  activeEvent: AppEvent | null;
  enteredEventIds: string[];
  isLoaded: boolean;
  loadActiveEvent: () => Promise<void>;
  submitEntry: (playerName: string, phone: string) => Promise<void>;
  hasEnteredActiveEvent: () => boolean;
};

export const useEventStore = create<EventStore>((set, get) => ({
  activeEvent: null,
  enteredEventIds: [],
  isLoaded: false,

  async loadActiveEvent() {
    const [event, enteredIds] = await Promise.all([
      eventService.loadActiveEvent(),
      eventService.getEnteredEventIds(),
    ]);

    set({ activeEvent: event, enteredEventIds: enteredIds, isLoaded: true });
  },

  async submitEntry(playerName, phone) {
    const { activeEvent } = get();

    if (!activeEvent) {
      throw new Error('No active event.');
    }

    const deviceId = await eventService.getDeviceId();

    await eventService.submitEntry({
      eventId: activeEvent.id,
      playerName: playerName.trim(),
      phone: phone.trim(),
      deviceId,
    });

    await eventService.markEventEntered(activeEvent.id);

    set(state => ({
      enteredEventIds: [...state.enteredEventIds, activeEvent.id],
    }));
  },

  hasEnteredActiveEvent() {
    const { activeEvent, enteredEventIds } = get();

    if (!activeEvent) {
      return false;
    }

    return enteredEventIds.includes(activeEvent.id);
  },
}));
