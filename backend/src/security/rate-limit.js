function createRateLimiter({ windowMs, max }) {
  const hits = new Map();

  function check(key, now = Date.now()) {
    const entry = hits.get(key);
    if (!entry || now > entry.resetAt) {
      const resetAt = now + windowMs;
      hits.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: max - 1, resetAt };
    }
    entry.count += 1;
    if (entry.count > max) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }
    return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
  }

  return { check };
}

module.exports = {
  createRateLimiter,
};
