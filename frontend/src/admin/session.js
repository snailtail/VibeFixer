async function ensureSession(statusEl = document.getElementById("admin-status")) {
  try {
    const response = await fetch("/api/admin/logs?limit=1", { cache: "no-store" });
    if (response.ok) {
      if (statusEl) {
        statusEl.textContent = "Session active";
        statusEl.classList.remove("error");
        statusEl.classList.add("success");
      }
      return true;
    }
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return false;
    }
    if (statusEl) {
      statusEl.textContent = `Error ${response.status}`;
      statusEl.classList.add("error");
    }
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = "Network error";
      statusEl.classList.add("error");
    }
  }
  return false;
}

async function logout() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/login";
}

function bindLogout() {
  const button = document.getElementById("admin-logout");
  if (button) {
    button.addEventListener("click", () => logout());
  }
}

export { ensureSession, bindLogout };
