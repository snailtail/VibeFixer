const logRepo = require("../storage/log-repo");

const SENSITIVE_KEYS = /password|secret|token|authorization|api[_-]?key/i;

function redactDetails(value) {
  if (Array.isArray(value)) {
    return value.map(redactDetails);
  }
  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, val]) => {
      if (SENSITIVE_KEYS.test(key)) {
        acc[key] = "[REDACTED]";
      } else {
        acc[key] = redactDetails(val);
      }
      return acc;
    }, {});
  }
  return value;
}

function getSeverity(eventType) {
  switch (eventType) {
    case "security_alert":
    case "db_error":
    case "server_error":
      return "high";
    case "rate_limit":
      return "medium";
    case "validation_failed":
      return "low";
    default:
      return "info";
  }
}

function writeLog({ category, eventType, context = {}, details = {}, message }) {
  const timestamp = new Date().toISOString();
  const contextDetails = {
    ip: context.ip || "unknown",
    path: context.path || "unknown",
    method: context.method || "unknown",
  };
  const entry = {
    timestamp,
    category,
    severity: getSeverity(eventType),
    eventType,
    details: redactDetails({ ...contextDetails, ...details }),
    message,
  };
  console.log(JSON.stringify(entry));
  try {
    logRepo.saveLog({
      timestamp: entry.timestamp,
      category: entry.category,
      severity: entry.severity,
      eventType: entry.eventType,
      message: entry.message,
      details: entry.details,
    });
  } catch (error) {
    // Avoid logging loops if storage is unavailable.
  }
}

function logSecurityEvent(eventType, context = {}, details = {}) {
  const message = `Security event: ${eventType}`;
  writeLog({ category: "security", eventType, context, details, message });
}

function logSecurityAlert(alertType, context = {}, details = {}) {
  writeLog({
    category: "security",
    eventType: "security_alert",
    context,
    details: { alertType, ...details },
    message: `Security alert: ${alertType}`,
  });
}

function logGameplayEvent(eventType, details = {}) {
  writeLog({
    category: "gameplay",
    eventType,
    details,
    message: `Gameplay event: ${eventType}`,
  });
}

module.exports = {
  logSecurityEvent,
  logSecurityAlert,
  logGameplayEvent,
};
