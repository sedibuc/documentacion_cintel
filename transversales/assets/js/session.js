/**
 * CintelSession — Módulo de sesión compartida entre aplicaciones
 * Almacena y lee el estado de sesión desde localStorage con clave 'cintel_session'.
 * Es compartido entre DIE, Agent y los documentos transversales del mismo origen.
 */
(function (global) {
  "use strict";

  var SESSION_KEY = "cintel_session";
  var SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 horas
  var WARN_THRESHOLD_MS = 30 * 60 * 1000; // 30 min

  function now() {
    return Date.now();
  }

  function get() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (!raw) { return null; }
      var data = JSON.parse(raw);
      if (!data || !data.issuedAt) { return null; }
      if (now() - data.issuedAt > SESSION_TIMEOUT_MS) {
        clear();
        return null;
      }
      return data;
    } catch (_e) {
      return null;
    }
  }

  function set(data) {
    try {
      var session = Object.assign({}, data, { issuedAt: now(), lastActivity: now() });
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    } catch (_e) {
      return null;
    }
  }

  function touch() {
    try {
      var session = get();
      if (!session) { return null; }
      session.lastActivity = now();
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    } catch (_e) {
      return null;
    }
  }

  function clear() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (_e) { /* noop */ }
  }

  function isActive() {
    return get() !== null;
  }

  function isExpiringSoon() {
    var session = get();
    if (!session) { return false; }
    var elapsed = now() - session.issuedAt;
    return SESSION_TIMEOUT_MS - elapsed < WARN_THRESHOLD_MS;
  }

  function getTimeRemaining() {
    var session = get();
    if (!session) { return 0; }
    var remaining = SESSION_TIMEOUT_MS - (now() - session.issuedAt);
    return Math.max(0, remaining);
  }

  function formatTimeRemaining() {
    var ms = getTimeRemaining();
    if (ms <= 0) { return "Expirada"; }
    var totalMinutes = Math.floor(ms / 60000);
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    if (hours > 0) {
      return hours + "h " + (minutes > 0 ? minutes + "m" : "");
    }
    return minutes + " min";
  }

  /**
   * Renderiza el indicador de sesión en el elemento con id "session-indicator".
   * Si no existe el elemento, no hace nada.
   */
  function renderIndicator() {
    var el = document.getElementById("session-indicator");
    if (!el) { return; }
    var session = get();
    if (!session) {
      el.innerHTML =
        '<a class="session-login-link" href="../transversales/dashboard.html">Iniciar sesión</a>';
      el.className = "session-indicator session-indicator--guest";
      return;
    }

    var expiring = isExpiringSoon();
    var timeLabel = formatTimeRemaining();
    el.className = "session-indicator session-indicator--active" + (expiring ? " session-indicator--expiring" : "");
    el.innerHTML =
      '<button class="session-badge" id="session-badge-btn" type="button" aria-expanded="false" aria-controls="session-panel">' +
        '<span class="session-org">' + escHtml(session.orgName || session.tenantId) + '</span>' +
        '<span class="session-sep">|</span>' +
        '<span class="session-user">' + escHtml(session.userName || session.userId) + '</span>' +
        '<span class="session-sep">|</span>' +
        '<span class="session-time' + (expiring ? " session-time--warn" : "") + '">' + timeLabel + '</span>' +
      '</button>' +
      '<div class="session-panel" id="session-panel" hidden>' +
        '<div class="session-panel-header">Sesión activa</div>' +
        '<dl class="session-detail">' +
          '<dt>Organización</dt><dd>' + escHtml(session.orgName || session.tenantId) + '</dd>' +
          '<dt>Usuario</dt><dd>' + escHtml(session.userName || session.userId) + '</dd>' +
          '<dt>Rol</dt><dd>' + escHtml(session.role || '—') + '</dd>' +
          '<dt>Soluciones</dt><dd>' + escHtml((session.solutions || []).join(', ') || '—') + '</dd>' +
          '<dt>Expira en</dt><dd>' + timeLabel + '</dd>' +
        '</dl>' +
        '<div class="session-panel-actions">' +
          '<a class="session-panel-btn session-panel-btn--primary" href="dashboard.html">Dashboard</a>' +
          '<button class="session-panel-btn session-panel-btn--danger" id="session-logout-btn" type="button">Cerrar sesión</button>' +
        '</div>' +
      '</div>';

    var badge = document.getElementById("session-badge-btn");
    var panel = document.getElementById("session-panel");
    var logoutBtn = document.getElementById("session-logout-btn");

    if (badge && panel) {
      badge.addEventListener("click", function () {
        var isOpen = panel.hidden === false;
        panel.hidden = isOpen;
        badge.setAttribute("aria-expanded", String(!isOpen));
      });

      document.addEventListener("click", function (evt) {
        if (!el.contains(evt.target)) {
          panel.hidden = true;
          badge.setAttribute("aria-expanded", "false");
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clear();
        window.location.reload();
      });
    }
  }

  function escHtml(str) {
    if (!str) { return ""; }
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.CintelSession = {
    get: get,
    set: set,
    touch: touch,
    clear: clear,
    isActive: isActive,
    isExpiringSoon: isExpiringSoon,
    getTimeRemaining: getTimeRemaining,
    formatTimeRemaining: formatTimeRemaining,
    renderIndicator: renderIndicator
  };
})(globalThis);
