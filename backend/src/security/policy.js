const SECURITY_POLICY = {
  writeRateLimitPerIpPerMinute: 60,
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
};

module.exports = {
  SECURITY_POLICY,
};
