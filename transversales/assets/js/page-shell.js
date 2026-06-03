(async function (global) {
  const root = document.getElementById("site-root");
  if (!root) {
    return;
  }

  try {
    const response = await fetch("assets/partials/site-shell.html?v=20260603");
    if (!response.ok) {
      throw new Error("No se pudo cargar el shell compartido.");
    }

    root.outerHTML = await response.text();

    if (global.SiteApp && typeof global.SiteApp.init === "function") {
      global.SiteApp.init();
    }

    if (global.CintelSession && typeof global.CintelSession.renderIndicator === "function") {
      global.CintelSession.renderIndicator();
    }
  } catch (error) {
    const message = window.location.protocol === "file:"
      ? "El shell del sitio se carga por fetch. Ejecute el micrositio con un servidor estático, por ejemplo: python -m http.server 8000"
      : error.message;

    root.innerHTML = `<div class="shell-error">${message}</div>`;
  }
})(globalThis);