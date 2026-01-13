const BASE_URL = "";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json();
}

export function startSession({ durationSeconds } = {}) {
  const body = durationSeconds ? { requestedDurationSeconds: durationSeconds } : undefined;
  return request("/api/sessions", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function depositArtifact(sessionId, artifactId) {
  return request(`/api/sessions/${sessionId}/deposit`, {
    method: "POST",
    body: JSON.stringify({ artifactId }),
  });
}

export function endSession(sessionId) {
  return request(`/api/sessions/${sessionId}/end`, {
    method: "POST",
  });
}

export function spawnArtifact(sessionId, position) {
  return request(`/api/sessions/${sessionId}/spawn`, {
    method: "POST",
    body: JSON.stringify(position),
  });
}

export function updateArtifactStatus(sessionId, artifactId, status) {
  return request(`/api/sessions/${sessionId}/artifact-status`, {
    method: "POST",
    body: JSON.stringify({ artifactId, status }),
  });
}
