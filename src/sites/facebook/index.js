Sod.sites.facebook = {
  matches: (host) => host === 'facebook.com' || host.endsWith('.facebook.com'),

  features: Sod.facebookSelectors,

  // Marks elements CSS can't select on its own. Marked elements get
  // `data-sod-hide="<feature>"`, and the generated stylesheet decides whether
  // they are hidden, so toggling a feature needs no re-scan.
  mark(root) {
    const reactionText = new Set(this.features.hideReactions.buttonText);

    // Comments are also role="article", so this covers posts and comments
    // while leaving buttons outside the feed alone.
    for (const button of Sod.queryAll(root, '[role="article"] [role="button"]:not([data-sod-hide])')) {
      if (reactionText.has(button.textContent.trim())) {
        button.dataset.sodHide = 'hideReactions';
      }
    }
  },
};
