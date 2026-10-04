Sod.sites.instagram = {
  matches: (host) => host === 'instagram.com' || host.endsWith('.instagram.com'),

  features: Sod.instagramSelectors,

  // Instagram's buttons all carry ARIA labels, so CSS covers everything.
  mark() {},

  // Double-clicking a photo or video likes it, even with the heart hidden.
  // Swallow the event before Instagram's handlers see it.
  init() {
    window.addEventListener(
      'dblclick',
      (event) => {
        if (!Sod.featureOn('hideReactions')) return;
        if (event.target.closest('input, textarea, [contenteditable="true"]')) return;
        event.stopImmediatePropagation();
      },
      true
    );
  },
};
