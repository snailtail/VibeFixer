function parseJsonBody(req, { maxBytes }) {
  return new Promise((resolve) => {
    let data = "";
    let tooLarge = false;

    req.on("data", (chunk) => {
      if (tooLarge) {
        return;
      }
      data += chunk;
      if (maxBytes && data.length > maxBytes) {
        tooLarge = true;
      }
    });

    req.on("end", () => {
      if (tooLarge) {
        resolve({ error: "payload_too_large" });
        return;
      }
      if (!data) {
        resolve({ data: null });
        return;
      }
      try {
        resolve({ data: JSON.parse(data) });
      } catch (error) {
        resolve({ error: "invalid_json" });
      }
    });
  });
}

function requireString(value, { maxLength } = {}) {
  if (typeof value !== "string") {
    return { ok: false };
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false };
  }
  if (maxLength && trimmed.length > maxLength) {
    return { ok: false };
  }
  return { ok: true, value: trimmed };
}

function optionalNumber(value, { min, max } = {}) {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    return { ok: false };
  }
  if (min !== undefined && value < min) {
    return { ok: false };
  }
  if (max !== undefined && value > max) {
    return { ok: false };
  }
  return { ok: true, value };
}

function requireEnum(value, allowed) {
  if (typeof value !== "string") {
    return { ok: false };
  }
  const normalized = value.toLowerCase();
  if (!allowed.includes(normalized)) {
    return { ok: false };
  }
  return { ok: true, value: normalized };
}

module.exports = {
  parseJsonBody,
  requireString,
  optionalNumber,
  requireEnum,
};
