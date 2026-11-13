import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { displayWord, WORDS_BY_ID } from '@/data/vocab';
import { buildQueue } from './learning';
import { useStore, type ScheduledItem } from './store';

/**
 * Reliability strategy
 * ────────────────────
 * Mobile OSes do not allow an app to run code every 2–3 minutes in the background.
 * Instead we pre-schedule a batch of *local* date-triggered notifications, each
 * already containing its word, and top the batch up whenever the app opens or
 * returns to the foreground.
 *
 * • iOS keeps at most 64 pending local notifications per app → we schedule ≤ 60.
 * • Android may batch/delay inexact alarms (Doze); we use the default
 *   'bestEffort' delivery and never request exact-alarm permission.
 * • Quiet hours are skipped so the batch lasts longer and nobody is woken up.
 * • When the app is open, Word Flow mode (app/flow.tsx) delivers cards on the
 *   exact interval with an in-app timer — no OS restrictions apply there.
 */

const MAX_PENDING = Platform.OS === 'ios' ? 60 : 50;
const CHANNEL = 'vocab';

export const notificationsSupported = Platform.OS !== 'web';

export function configureNotifications() {
  if (!notificationsSupported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Vocabulary cards',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 120],
    }).catch(() => {});
  }
}

export async function requestPermission(): Promise<boolean> {
  if (!notificationsSupported) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const res = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
  return res.granted || res.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

function inQuietHours(d: Date, start: number, end: number) {
  const h = d.getHours();
  return start > end ? h >= start || h < end : h >= start && h < end;
}

function nextAllowed(t: number, start: number, end: number) {
  const d = new Date(t);
  if (!inQuietHours(d, start, end)) return t;
  const n = new Date(d);
  if (d.getHours() >= start && start > end) n.setDate(n.getDate() + 1);
  n.setHours(end, 0, 0, 0);
  return n.getTime();
}

/** Cancel everything and schedule a fresh batch. Returns number scheduled. */
export async function rescheduleVocabNotifications(): Promise<number> {
  if (!notificationsSupported) return 0;
  const store = useStore.getState();
  store.absorbDeliveredNotifications();
  await Notifications.cancelAllScheduledNotificationsAsync();
  const { settings } = useStore.getState();
  if (!settings.notifications) {
    store.setScheduled([]);
    return 0;
  }
  const granted = (await Notifications.getPermissionsAsync()).granted;
  if (!granted) return 0;

  const queue = buildQueue(MAX_PENDING);
  const step = settings.intervalMin * 60_000;
  let t = Date.now() + step;
  const scheduled: ScheduledItem[] = [];

  for (const item of queue) {
    t = nextAllowed(t, settings.quietStart, settings.quietEnd);
    const w = WORDS_BY_ID[item.wordId];
    if (!w) continue;
    const ex = w.examples[0];
    const title = item.kind === 'review' ? `🔁 Remember? ${displayWord(w)}` : `🇩🇪 ${displayWord(w)} — ${w.en}`;
    const body =
      item.kind === 'review'
        ? `Tap to check the meaning · ${w.pos}${w.plural ? ` · Pl. ${w.plural}` : ''}`
        : `${ex[0]}\n${ex[1]}`;
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title, body, data: { wordId: w.id, kind: item.kind, url: `/word/${w.id}` } },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(t), channelId: CHANNEL },
      });
      scheduled.push({ wordId: w.id, at: t, kind: item.kind });
    } catch {
      break;
    }
    t += step;
  }
  store.setScheduled(scheduled);
  return scheduled.length;
}

export async function sendTestNotification() {
  if (!notificationsSupported) return;
  await Notifications.scheduleNotificationAsync({
    content: { title: '🇩🇪 die Entscheidung — decision', body: 'Ich muss heute eine Entscheidung treffen.\nI have to make a decision today.', data: { url: '/word/entscheidung' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3, channelId: CHANNEL },
  });
}

export { Notifications };
