const SECURITY_POLICY = {
  writeRateLimitPerIpPerMinute: 60,
  maxRequestBytes: 100 * 1024,
  retentionSessionsDays: 30,
  retentionHighScoresDays: 180,
};

module.exports = {
  SECURITY_POLICY,
};
