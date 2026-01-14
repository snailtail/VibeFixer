const SECURITY_POLICY = {
  writeRateLimitPerIpPerMinute: 600,
  maxRequestBytes: 100 * 1024,
  retentionSessionsDays: 30,
  retentionHighScoresDays: 180,
  adminLogViewDays: 7,
  adminLogDefaultLimit: 200,
  adminLogMaxLimit: 500,
  adminUser: process.env.ADMIN_USER || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  adminAuthMaxFailures: 5,
  adminAuthWindowMs: 10 * 60 * 1000,
  adminAuthBlockMs: 15 * 60 * 1000,
  adminSessionTtlMs: 30 * 60 * 1000,
  adminSessionCookieName: "vibefixer_admin_session",
  adminSessionSecure: process.env.NODE_ENV === "production",
};

module.exports = {
  SECURITY_POLICY,
};
