function triggerRateLimitToast(state) {
  if (!state) {
    return;
  }
  const now = performance.now();
  if (state.lastRateLimitToastAt && now - state.lastRateLimitToastAt < 3000) {
    return;
  }
  state.lastRateLimitToastAt = now;
  const toastStrings = state.strings?.toast || {};
  state.toast = {
    message: toastStrings.rateLimit || "Too many actions at once - slow down a bit.",
    until: now + 2500,
  };
}

export { triggerRateLimitToast };
