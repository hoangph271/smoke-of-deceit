// Swaps the toolbar icon to match the global switch. Runs as a service worker
// in Chrome and as an event page in Firefox (see "background" in the manifest).
// The icon resets whenever the browser or extension restarts, so this runs on
// every wake-up, and settings can change from the popup or another synced
// device, so it also listens for changes.

// Chrome's service worker loads one file; Firefox lists settings.js itself.
if (typeof importScripts === 'function') importScripts('/src/shared/settings.js');

const ICONS = {
  on: { 16: '/icons/icon-16.png', 32: '/icons/icon-32.png' },
  off: { 16: '/icons/icon-off-16.png', 32: '/icons/icon-off-32.png' },
};

const updateIcon = (settings) => {
  chrome.action.setIcon({ path: settings.enabled ? ICONS.on : ICONS.off });
  chrome.action.setTitle({
    title: settings.enabled ? 'Smoke of Deceit' : 'Smoke of Deceit (paused)',
  });
};

Sod.settings.get().then(updateIcon);
Sod.settings.onChange(updateIcon);
