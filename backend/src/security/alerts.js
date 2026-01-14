const { logSecurityAlert } = require("./logger");

const ALERT_THRESHOLD = 10;

let currentMinute = null;
let currentCount = 0;
let alertedMinute = null;

function recordFailure(failureType, details = {}) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  if (minute !== currentMinute) {
    currentMinute = minute;
    currentCount = 0;
    alertedMinute = null;
  }
  currentCount += 1;
  if (currentCount >= ALERT_THRESHOLD && alertedMinute !== minute) {
    alertedMinute = minute;
    logSecurityAlert("failure_threshold", {}, {
      failureType,
      count: currentCount,
      threshold: ALERT_THRESHOLD,
      details,
    });
  }
  return { count: currentCount, threshold: ALERT_THRESHOLD, minute };
}

module.exports = {
  recordFailure,
  ALERT_THRESHOLD,
};
