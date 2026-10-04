# AMO listing

Copy into the [Add-on Developer Hub](https://addons.mozilla.org/developers/) form.

## Name

Smoke of Deceit

## Summary

Hides Like buttons, reactions and comment boxes on Facebook and Instagram, so you can read and browse without being pulled into reacting. Per-feature toggles and a one-click pause. Collects no data.

## Description

Social media is built to make you react. Smoke of Deceit removes the buttons that pull you in, while leaving everything you came to read.

**What it hides**

- Like / reaction buttons (Facebook), including the reaction picker on hover
- Heart buttons on posts, Reels, Stories and comments (Instagram), plus double-click to like
- Comment boxes and Story reply boxes

Each feature has its own toggle, and one switch pauses everything. The toolbar icon turns grey while paused.

**Privacy:** it only hides page elements. It never clicks, posts or reads your data, and makes no network requests.

**Note:** works when Facebook and Instagram are set to English.

Source code (GPL-3.0): https://github.com/hoangph271/smoke-of-deceit

## Categories

- Social & Communication
- Privacy & Security

## License

GNU General Public License v3.0

## Support site

https://github.com/hoangph271/smoke-of-deceit/issues

## Privacy policy

None needed: the add-on collects no data (declared in `data_collection_permissions`).

## Notes to reviewer

No build step; the zip is the unminified source. Content scripts only inject CSS and add data attributes to hide elements. The background script only swaps the toolbar icon. `storage` is used for toggle settings only.
