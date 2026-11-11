/* ---------- Google Analytics (GA4), only with the visitor's consent ----------
   Nothing loads, and nothing is sent, until the visitor picks REC in the consent banner.
   Their choice is remembered, and the Help modal's "Analytics settings" reopens the banner.
   Never runs on localhost or Netlify deploy previews. Ported from Show Log's analytics.js. */

const GA_ID = 'G-WMJEW7KTGP';
const KEY = 'vhs-analytics';
const OPEN_EVENT = 'vhs:open-consent';
const CHANGE_EVENT = 'vhs:consent-change';

export type ConsentChoice = 'granted' | 'denied' | null;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

const host = window.location.hostname;
// Deploy previews and branch deploys are "something--site.netlify.app"
const isLive = !['localhost', '127.0.0.1', '[::1]'].includes(host) && !host.includes('--');

// ?consent-preview turns the banner on outside the live site (localhost, deploy previews) so it can be checked.
// It behaves like live, saved choice included; GA itself still only loads on the live site.
const isPreview = new URLSearchParams(window.location.search).has('consent-preview');

export const analyticsAvailable = () => isLive || isPreview;

// Storage can throw in private windows or with site data blocked
export function getChoice(): ConsentChoice {
  try {
    const value = localStorage.getItem(KEY);
    if (value === 'granted' || value === 'denied') return value;
  } catch {}
  return null;
}

function saveChoice(value: 'granted' | 'denied') {
  try {
    localStorage.setItem(KEY, value);
  } catch {}
}

let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // No ads features
  window.gtag('config', GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.append(script);
}

// Removes GA's _ga and _ga_<id> cookies, which are set on the site's top domain or a parent of it
function clearGaCookies() {
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i += 1) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  names.forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    });
  });
}

function apply(granted: boolean) {
  // Google's opt-out switch: gtag checks it before every hit, so this stops sending even after gtag.js has loaded
  window[`ga-disable-${GA_ID}`] = !granted;
  if (granted) {
    if (isLive) load();
    return;
  }
  if (loaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
  clearGaCookies();
}

export function choose(granted: boolean) {
  saveChoice(granted ? 'granted' : 'denied');
  apply(granted);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Fires when the choice changes, here or in another tab of the site (the REC/STOP display listens)
export function onChoiceChange(handler: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) handler();
  };
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener('storage', onStorage);
  };
}

// Called once on startup: load GA for returning visitors who already said yes
export function initAnalytics() {
  if (!isLive) return;
  const choice = getChoice();
  if (choice === 'granted') apply(true);
  if (choice === 'denied') apply(false);
  // A choice made in another tab of the site applies here too
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    if (e.newValue === 'granted') apply(true);
    else apply(false);
  });
}

// Lets the Help modal reopen the banner without threading props through the app
export function openConsent() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenConsent(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
