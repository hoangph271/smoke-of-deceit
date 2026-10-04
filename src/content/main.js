// Runs at document_start. The stylesheet hides everything by default and is
// turned off per feature via attributes on <html>, so enabled features never
// flash on screen while settings load.
//
//   <html data-sod-off>                          extension paused
//   <html data-sod-skip="hideReactions ...">     individual features off

(() => {
  const site = Object.values(Sod.sites).find((s) => s.matches(location.hostname));
  if (!site) return;

  const buildCss = (features) =>
    Object.entries(features)
      .map(([key, feature]) => {
        const targets = [...(feature.css || []), `[data-sod-hide="${key}"]`];
        // :is() is forgiving, so one unsupported selector won't drop the rest.
        return (
          `html:not([data-sod-off]):not([data-sod-skip~="${key}"]) :is(\n  ` +
          targets.join(',\n  ') +
          '\n) { display: none !important; }'
        );
      })
      .join('\n\n');

  const style = document.createElement('style');
  style.id = 'smoke-of-deceit';
  style.textContent = buildCss(site.features);
  document.documentElement.appendChild(style);

  const apply = (settings) => {
    const root = document.documentElement;
    root.toggleAttribute('data-sod-off', !settings.enabled);
    const skipped = Object.keys(site.features).filter((key) => !settings[key]);
    if (skipped.length) root.setAttribute('data-sod-skip', skipped.join(' '));
    else root.removeAttribute('data-sod-skip');
  };

  Sod.settings.get().then(apply);
  Sod.settings.onChange(apply);

  // For JS-only rules (event handlers), reading the same attributes the
  // stylesheet uses. True before settings load, matching the CSS default.
  Sod.featureOn = (key) => {
    const root = document.documentElement;
    const skipped = (root.getAttribute('data-sod-skip') || '').split(' ');
    return !root.hasAttribute('data-sod-off') && !skipped.includes(key);
  };
  site.init?.();

  Sod.observe((root) => site.mark(root));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => site.mark(document.documentElement));
  } else {
    site.mark(document.documentElement);
  }
})();
