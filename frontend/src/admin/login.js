const form = document.getElementById("admin-login-form");
const statusEl = document.getElementById("admin-login-status");

function setStatus(message, kind) {
  if (!statusEl) {
    return;
  }
  statusEl.textContent = message;
  statusEl.classList.remove("success", "error");
  if (kind) {
    statusEl.classList.add(kind);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("admin-login-user")?.value.trim();
  const password = document.getElementById("admin-login-pass")?.value;
  if (!username || !password) {
    setStatus("Username and password required", "error");
    return;
  }
  setStatus("Logging in...");
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    setStatus(payload.error || "Login failed", "error");
    return;
  }
  setStatus("Login successful", "success");
  window.location.href = "/admin";
}

if (form) {
  form.addEventListener("submit", handleLogin);
}
