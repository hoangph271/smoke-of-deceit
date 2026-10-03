// Calls `callback(element)` for every element added to the page. Batches work
// into one animation frame so Facebook's constant DOM churn stays cheap.
Sod.observe = (callback) => {
  let pending = new Set();
  let scheduled = false;

  const flush = () => {
    scheduled = false;
    const roots = pending;
    pending = new Set();
    for (const root of roots) {
      if (root.isConnected) callback(root);
    }
  };

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) pending.add(node);
      }
    }
    if (!scheduled && pending.size) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
};

// querySelectorAll that also tests the root element itself.
Sod.queryAll = (root, selector) => {
  const found = [...root.querySelectorAll(selector)];
  if (root.matches(selector)) found.push(root);
  return found;
};
