// Shared by the content scripts and the popup. Content scripts listed in the
// manifest share one global scope, so everything hangs off a single namespace.
globalThis.Sod = globalThis.Sod || { sites: {} };

Sod.DEFAULTS = {
  enabled: true,
  hideReactions: true,
  hideCommentBox: true,
};

Sod.settings = {
  get() {
    return chrome.storage.sync.get(Sod.DEFAULTS);
  },

  set(patch) {
    return chrome.storage.sync.set(patch);
  },

  onChange(callback) {
    chrome.storage.onChanged.addListener((_changes, area) => {
      if (area === 'sync') Sod.settings.get().then(callback);
    });
  },
};
