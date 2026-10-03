// Every Facebook selector lives here. When Facebook changes its UI, this is
// the file to fix.
//
// Facebook's class names are obfuscated and rotate often, so we target ARIA
// attributes and structure instead. ARIA labels are localized: English only.

(() => {
  const REACTIONS = ['Like', 'Love', 'Care', 'Haha', 'Wow', 'Sad', 'Angry'];

  const COMMENT_BOX_LABELS = [
    'Write a comment',
    'Write a public comment',
    'Comment as',
    'Answer as',
    'Write a reply',
    'Reply to',
  ];

  const commentTextboxes = COMMENT_BOX_LABELS.map(
    (label) => `[role="textbox"][aria-label^="${label}"]`
  );

  Sod.facebookSelectors = {
    hideReactions: {
      // Hidden directly by CSS.
      css: [
        // Like button on posts, before and after reacting.
        ...REACTIONS.map((r) => `[role="button"][aria-label="${r}"]`),
        ...REACTIONS.map((r) => `[role="button"][aria-label="Remove ${r}"]`),
        ...REACTIONS.map((r) => `[role="button"][aria-label="Change ${r} reaction"]`),
        '[role="button"][aria-label="React"]',
        // The hover/long-press reaction picker.
        '[role="toolbar"][aria-label="Reactions"]',
      ],
      // Comment-level Like buttons often have no aria-label, only visible
      // text. These are matched in JS (see index.js).
      buttonText: REACTIONS,
    },

    hideCommentBox: {
      css: [
        // Hide the whole form (avatar, input, emoji/GIF/sticker buttons)...
        ...commentTextboxes.map((tb) => `form:has(${tb})`),
        // ...and the bare textbox, in case it isn't wrapped in a <form>.
        ...commentTextboxes,
      ],
    },
  };
})();
