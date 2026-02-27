export const PREF_KEYS = {
  AUDIO: 'exhibit-audio-enabled',
  ANIMATIONS: 'exhibit-animations-enabled',
  COLLAPSED: 'exhibit-description-collapsed',
} as const;

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = \"; expires=\" + date.toUTCString();
  document.cookie = name + \"=\" + (value || \"\")  + expires + \"; path=/\";
}

export function getPreference(name: string, defaultValue = 'true'): boolean {
  const value = getCookie(name);
  return value === undefined ? defaultValue === 'true' : value === 'true';
}

export function setPreference(name: string, value: boolean) {
  setCookie(name, String(value));
}
