// Registration closes at midnight May 30, 2026 CST (UTC-6) = May 31 06:00 UTC
export const REGISTRATION_DEADLINE = new Date('2026-05-31T06:00:00Z');

export const EVENT_START = '8:00 AM';
export const EVENT_END = '9:00 PM';
export const EVENT_DATE = 'Saturday, May 30, 2026';
export const EVENT_DATE_FULL = `${EVENT_DATE} · ${EVENT_START} – ${EVENT_END}`;

export function isRegistrationOpen(): boolean {
  return new Date() < REGISTRATION_DEADLINE;
}

export function getDeadlineDisplay(): string {
  return 'midnight May 30, 2026 CST';
}
