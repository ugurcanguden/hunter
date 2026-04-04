import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';

import { translations } from '@centerhit-core/i18n/translations';
import { AppLanguage } from '@centerhit-features/settings/types/settingsTypes';

const INACTIVE_REMINDER_NOTIFICATION_ID = 'inactive-player-reminder';
const INACTIVE_REMINDER_CHANNEL_ID = 'inactive-player-reminders';
const INACTIVE_REMINDER_DELAY_MS = 24 * 60 * 60 * 1000;

async function hasIosPermission() {
  const settings = await notifee.getNotificationSettings();

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
}

async function hasAndroidPermission() {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (Platform.Version < 33) {
    return true;
  }

  return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

async function ensureAndroidChannel(language: AppLanguage) {
  if (Platform.OS !== 'android') {
    return undefined;
  }

  return notifee.createChannel({
    id: INACTIVE_REMINDER_CHANNEL_ID,
    name: translations[language].notifications.channelName,
    importance: AndroidImportance.DEFAULT,
  });
}

export const notificationService = {
  async hasPermission() {
    if (Platform.OS === 'ios') {
      return hasIosPermission();
    }

    return hasAndroidPermission();
  },

  async requestPermission() {
    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();

      return (
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
      );
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  },

  async cancelInactiveReminder() {
    await notifee.cancelNotification(INACTIVE_REMINDER_NOTIFICATION_ID);
  },

  async displayTestReminder(language: AppLanguage) {
    const hasPermission = await this.hasPermission();
    if (!hasPermission) {
      return false;
    }

    const channelId = await ensureAndroidChannel(language);
    const localeCopy = translations[language].notifications;

    await notifee.displayNotification({
      id: `${INACTIVE_REMINDER_NOTIFICATION_ID}-dev-test`,
      title: localeCopy.reminderTitle,
      body: localeCopy.reminderBody,
      android: channelId
        ? {
            channelId,
            pressAction: {
              id: 'default',
            },
          }
        : undefined,
    });

    return true;
  },

  async scheduleInactiveReminder(input: { language: AppLanguage; fromDate?: Date }) {
    const hasPermission = await this.hasPermission();
    if (!hasPermission) {
      return false;
    }

    const channelId = await ensureAndroidChannel(input.language);
    const localeCopy = translations[input.language].notifications;
    const baseDate = input.fromDate ?? new Date();
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: baseDate.getTime() + INACTIVE_REMINDER_DELAY_MS,
    };

    await this.cancelInactiveReminder();
    await notifee.createTriggerNotification(
      {
        id: INACTIVE_REMINDER_NOTIFICATION_ID,
        title: localeCopy.reminderTitle,
        body: localeCopy.reminderBody,
        android: channelId
          ? {
              channelId,
              pressAction: {
                id: 'default',
              },
            }
          : undefined,
      },
      trigger,
    );

    return true;
  },
};
