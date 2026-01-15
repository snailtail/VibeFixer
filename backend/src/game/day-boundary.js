function getTodayWindow(nowMs = Date.now()) {
  const now = new Date(nowMs);
  // Use server-local day boundaries to match system time for daily stats.
  const startLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return {
    startAt: startLocal.toISOString(),
    endAt: endLocal.toISOString(),
  };
}

module.exports = {
  getTodayWindow,
};
