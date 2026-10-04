// Every Instagram selector lives here. When Instagram changes its UI, this is
// the file to fix.
//
// Like Facebook, Instagram obfuscates class names, so we target ARIA labels.
// The heart icons are <svg aria-label="Like"> / "Unlike" inside a button.
// ARIA labels are localized: English only.

(() => {
  const BUTTON = ':is(button, [role="button"])';

  // The innermost button containing the icon, so we never hide a larger
  // clickable container that happens to wrap the heart.
  const buttonWithIcon = (label) => {
    const icon = `svg[aria-label="${label}"]`;
    return `${BUTTON}:has(${icon}):not(:has(${BUTTON} ${icon}))`;
  };

  const COMMENT_BOX_LABELS = ['Add a comment', 'Reply to'];

  // Feed posts use a <textarea>. Reels (and newer surfaces) use a
  // contenteditable rich-text editor that carries the label in aria-label or
  // aria-placeholder instead.
  const commentTextboxes = COMMENT_BOX_LABELS.flatMap((label) => [
    `textarea[aria-label^="${label}"]`,
    `textarea[placeholder^="${label}"]`,
    `[contenteditable="true"][aria-label^="${label}"]`,
    `[contenteditable="true"][aria-placeholder^="${label}"]`,
    `[role="textbox"][aria-label^="${label}"]`,
    `[role="textbox"][aria-placeholder^="${label}"]`,
  ]);

  Sod.instagramSelectors = {
    hideReactions: {
      // Heart on posts, Reels, Stories and comments, before and after liking.
      // Double-click to like is blocked in JS (see index.js).
      css: [buttonWithIcon('Like'), buttonWithIcon('Unlike')],
    },

    hideCommentBox: {
      css: [
        // Hide the whole form (input, emoji and Post buttons)...
        ...commentTextboxes.map((tb) => `form:has(${tb})`),
        // ...and the bare textarea, in case it isn't wrapped in a <form>.
        ...commentTextboxes,
      ],
      // Used by index.js to find the box's emoji/Post row when there's no
      // <form> to hide.
      textboxes: commentTextboxes,
    },
  };
})();
