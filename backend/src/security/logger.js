function logSecurityEvent(eventType, context = {}, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    eventType,
    ip: context.ip || "unknown",
    path: context.path || "unknown",
    method: context.method || "unknown",
    details,
  };
  console.log(JSON.stringify(entry));
}

function logSecurityAlert(alertType, context = {}, details = {}) {
  logSecurityEvent("security_alert", context, { alertType, ...details });
}

module.exports = {
  logSecurityEvent,
  logSecurityAlert,
};
