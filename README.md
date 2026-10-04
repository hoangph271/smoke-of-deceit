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
- A **content script** runs on Facebook pages at `document_start` and injects a stylesheet, generated from the site's selectors, that hides the targeted elements with `display: none !important`. CSS hiding is fast and doesn't flicker on page load.
- Features are switched off by attributes on `<html>` (`data-sod-off` pauses everything, `data-sod-skip="hideReactions …"` turns off individual features). Everything is hidden by default until settings load, so nothing flashes on screen.
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

## Project structure

```
Smoke_of_Deceit/
├── manifest.json
├── src/
│   ├── content/
│   │   ├── main.js            # Picks the site module, injects the CSS, applies settings
│   │   └── observer.js        # Shared MutationObserver helper
│   ├── sites/
│   │   └── facebook/
│   │       ├── selectors.js   # All Facebook selectors in one place
│   │       └── index.js       # Host matching plus JS-only rules (text matching)
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── shared/
│       └── settings.js        # Defaults plus chrome.storage helpers
├── icons/                     # icon.svg source + 16/32/48/128 PNGs
└── README.md
```

## Running locally

There is no build step. The extension loads straight from the source folder.

### Load the extension

1. Clone or download this repository.
2. Open `chrome://extensions` (or `edge://extensions`, or `brave://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder (the one containing `manifest.json`).
5. Open or reload `https://www.facebook.com`.

Pin the extension from the puzzle-piece menu so the popup is one click away.

### Development loop

| You changed | To apply it |
| --- | --- |
| Anything under `src/content/` or `src/sites/` | Click the reload icon on the extension card, then refresh the Facebook tab. |
| `manifest.json` | Reload the extension card. If it shows an error, fix it and reload again. |
| Anything under `src/popup/` | Close and reopen the popup. |

### Debugging

- **Content script:** open DevTools on the Facebook tab. In the Console, switch the context dropdown from `top` to **Smoke of Deceit** to run code in the extension's context, for example `Sod.settings.get().then(console.log)`.
- **Is the CSS injected?** In the Elements panel, look for `<style id="smoke-of-deceit">` inside `<html>`. The `data-sod-off` and `data-sod-skip` attributes on `<html>` show the current toggle state.
- **Something isn't hidden:** right-click it, choose **Inspect**, and note its `role` and `aria-label`, or the button text for comment buttons. Add the selector to `src/sites/facebook/selectors.js`.
- **Elements marked by JS** carry `data-sod-hide="<feature>"`. Search the Elements panel for `data-sod-hide` to see them.
- **Popup:** right-click the popup and choose **Inspect**.
- **Reset settings:** in the content-script console context, run `chrome.storage.sync.clear()`.

### Syntax check

```sh
for f in $(find src -name '*.js'); do node --check "$f"; done
```

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

## Publishing

### Before the first release

- [x] **Add icons.** `icons/icon.svg` is the source; regenerate the PNGs with `for s in 16 32 48 128; do magick -background none -density 384 icons/icon.svg -resize ${s}x${s} icons/icon-$s.png; done`.
- [ ] **Run the testing checklist** above on a real Facebook account.
- [ ] **Avoid Facebook branding.** Don't use the Facebook logo or name as the extension's name or icon. Saying "works on Facebook" in the description is fine.
- [ ] **Prepare store assets:** at least one screenshot (1280×800 or 640×400) and a small promo tile (440×280).

### 1. Bump the version

Every upload needs a higher `version` in `manifest.json` (for example `0.1.0` → `0.1.1`). Commit and tag it:

```sh
git commit -am "Release v0.1.1"
git tag v0.1.1
```

### 2. Package

Zip only the files the extension needs. `manifest.json` must be at the root of the zip.

```sh
VERSION=$(node -p "require('./manifest.json').version")
mkdir -p dist
zip -r "dist/smoke-of-deceit-$VERSION.zip" manifest.json src icons
```

Before uploading, unzip the archive into a temporary folder and load that folder with **Load unpacked**. This confirms the zip is complete.

### 3. Chrome Web Store

1. Register at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole). There is a one-time US$5 registration fee.
2. Click **New item** and upload the zip.
3. **Store listing:** description, category (Productivity, for example), screenshots and promo tile.
4. **Privacy practices:**
   - *Single purpose:* "Hides like, reaction and comment controls on social media to reduce compulsive engagement."
   - *Permission justifications:* `storage` saves the user's toggle settings. Host access to `facebook.com` is needed to inject the script that hides those elements.
   - *Data usage:* certify that the extension collects no user data. No privacy policy is required when no data is collected.
5. Submit for review. Review usually takes a few days. Extensions that request host access can take longer.

To update the extension later, bump the version, re-zip, and upload on the item's **Package** tab.

### 4. Microsoft Edge Add-ons (optional)

The same zip works. Register for free in [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/), create a new extension, upload the zip, and fill in the same listing and privacy details.

### 5. Firefox (planned)

Firefox needs a `browser_specific_settings.gecko.id` in the manifest and testing in Firefox before it can be submitted to [addons.mozilla.org](https://addons.mozilla.org/developers/).

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
