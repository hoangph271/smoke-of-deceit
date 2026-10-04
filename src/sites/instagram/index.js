Sod.sites.instagram = {
  matches: (host) => host === 'instagram.com' || host.endsWith('.instagram.com'),

  features: Sod.instagramSelectors,

  // A comment box outside a <form> (Reels) leaves its emoji and Post buttons
  // behind when CSS hides only the input. Walk up to the smallest ancestor
  // that also holds the Post button and mark that whole row.
  mark(root) {
    const selector = this.features.hideCommentBox.textboxes.join(', ');
    for (const box of Sod.queryAll(root, selector)) {
      if (box.closest('form, [data-sod-hide]')) continue;
      let row = box.parentElement;
      for (let depth = 0; row && depth < 6; depth++, row = row.parentElement) {
        const buttons = row.querySelectorAll('button, [role="button"]');
        if ([...buttons].some((b) => b.textContent.trim() === 'Post')) {
          row.dataset.sodHide = 'hideCommentBox';
          break;
        }
      }
    }
  },

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
