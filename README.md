# Smoke of Deceit

A browser extension that removes interaction from social media. Read and browse, but the buttons that pull you into reacting, commenting and chasing numbers are gone.

The MVP targets **Facebook** (`www.facebook.com`, `web.facebook.com`).

## Why

Like buttons, reaction counts and comment boxes are built to keep you engaged. Smoke of Deceit hides them so you can still read content without being prompted to respond to it.

## Features

### MVP (v0.1): Facebook

| Feature | Description |
| --- | --- |
| Hide Like / React button | Removes the Like button and the reaction picker that appears on hover or long press, on posts and on comments. |
| Hide comment box | Removes the "Write a comment…" input under posts, in the post modal, and in reply threads. |
| Per-feature toggles | Each feature can be switched on or off from the extension popup. |
| Global on/off | A single switch to pause the extension without uninstalling it. |

### Proposed next (v0.2+)

Ordered roughly by impact. These are suggestions; nothing here is built yet.

1. **Hide engagement counts**: reaction counts ("👍❤️ 1.2K"), comment counts and share counts. This is often the biggest driver of compulsive checking, so it is a strong candidate to move into the MVP.
2. **Hide the Share button**: the third button in the Like / Comment / Share row. Leaving it alone leaves the row half-removed.
3. **Hide the Comment button**: the button that opens or focuses the comment box. Without it, a visible "Comment" button that does nothing looks broken.
4. **Hide existing comments** (optional, off by default): collapse comment threads entirely for a read-only feed.
5. **Hide notification and message badge counts**: the red numbers on the bell and Messenger icons.
6. **Stories, Reels and Watch**: hide reaction and reply bars on Stories, and like/comment/share overlays on Reels and videos.
7. **Friction for pausing**: require a short delay or a typed confirmation before the global switch turns off, so it cannot be disabled on impulse.
8. **More platforms**: Instagram, X/Twitter, YouTube, LinkedIn, Reddit, Threads. The architecture keeps each site's rules in its own module.
9. **Firefox support**: Manifest V3 is supported in Firefox, so mainly packaging and testing.

## How it works

- **Manifest V3** extension (Chrome, Edge, Brave, other Chromium browsers; Firefox planned).
- A **content script** runs on Facebook pages and injects a stylesheet that hides the targeted elements with `display: none !important`. CSS hiding is fast and doesn't flicker on page load.
- Facebook is a single-page app that loads content continuously, so a **`MutationObserver`** handles elements that CSS selectors alone cannot target reliably (for example, matching by text or walking up from an icon to its button).
- Settings are stored in **`chrome.storage.sync`**, so they follow the user across devices. The content script listens for changes and applies them live without a page reload.
- The extension only **hides** elements. It never clicks, submits or reads personal data, and it makes no network requests.

### Selector strategy

Facebook's class names are obfuscated and change often, so the extension avoids relying on them. In order of preference, it targets:

1. ARIA attributes, such as `[aria-label="Like"]`, `[aria-label="Write a comment…"]` and `role="button"`.
2. Structural relationships, such as the action bar under a post (`[role="article"]`).
3. `contenteditable` text boxes inside comment forms.

All selectors live in one file per site (`src/sites/facebook/selectors.js`), so a Facebook UI change can be fixed in one place.

**Known limitation:** ARIA labels are localized. The MVP supports **English** labels. Other languages need either a label map per locale or language-independent structural selectors.

## Project structure (planned)

```
Smoke_of_Deceit/
├── manifest.json
├── src/
│   ├── content/
│   │   ├── main.js            # Bootstraps the site module for the current host
│   │   └── observer.js        # Shared MutationObserver helper
│   ├── sites/
│   │   └── facebook/
│   │       ├── selectors.js   # All Facebook selectors in one place
│   │       ├── hide.css       # Static CSS rules
│   │       └── index.js       # Dynamic rules plus feature toggles
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── shared/
│       └── settings.js        # Defaults plus chrome.storage helpers
├── icons/
└── README.md
```

## Installation (development)

1. Clone or download this repository.
2. Open `chrome://extensions` (or `edge://extensions`, or `brave://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the project folder.
5. Open or reload Facebook.

After changing the code, click the reload icon on the extension card and refresh Facebook.

## Usage

Click the Smoke of Deceit icon in the toolbar to open the popup:

- **Enabled**: the global switch.
- **Hide Like / React**
- **Hide comment box**

Changes apply immediately to open Facebook tabs.

## Permissions

| Permission | Reason |
| --- | --- |
| `storage` | Save your toggle settings. |
| Host access to `*://*.facebook.com/*` | Inject the content script that hides elements. |

No other permissions are requested.

## Testing checklist

Check each of the following with the feature on and with it off:

- [ ] News feed posts
- [ ] Post opened in the modal or permalink view
- [ ] Group posts
- [ ] Page posts
- [ ] Comments and nested replies (the Like button on comments)
- [ ] Hover or long press on the hidden Like area, which must not open the reaction picker
- [ ] Infinite scroll: newly loaded posts are also cleaned
- [ ] Toggling in the popup updates the page live

## Roadmap

- [ ] v0.1: Facebook MVP (hide Like/React, hide comment box, popup toggles)
- [ ] v0.2: Engagement counts, Share and Comment buttons, notification badges
- [ ] v0.3: Stories, Reels, Watch; pause friction
- [ ] v0.4: Instagram and X/Twitter
- [ ] Firefox build

## Name

In Dota 2, Smoke of Deceit makes your party invisible. This extension does the same for the engagement buttons.

## License

To be decided (MIT suggested).
