(function (global) {
  const contentVersion = "20260609";
  const pages = {
    inicio:        { file: "content/inicio.md",        title: "Inicio — PoC DIE · Las Galias" },
    alcance:       { file: "content/alcance.md",       title: "Alcance funcional, arquitectura y definición técnica" },
    prerequisitos: { file: "content/prerequisitos.md", title: "Prerequisitos externos y validaciones" },
    cronograma:    { file: "content/cronograma.md",    title: "Cronograma de trabajo — Sprints Jun 9–30" },
    prototipo:     { file: "content/prototipo.md",     title: "Prototipo de la PoC — API, contratos y datos de ejemplo" },
    riesgos:       { file: "content/riesgos.md",       title: "Riesgos y mitigaciones" }
  };

  const pageOrder = Object.keys(pages);
  let searchIndex = null;

  function getPageFile(pageKey) {
    const page = pages[pageKey];
    if (!page) return "index.html";
    if (page.href) return page.href;
    return `${pageKey === "inicio" ? "index" : pageKey}.html`;
  }

  function getPageNeighbors(pageKey) {
    const currentIndex = pageOrder.indexOf(pageKey);
    return {
      previous: currentIndex > 0 ? pageOrder[currentIndex - 1] : null,
      next: currentIndex >= 0 && currentIndex < pageOrder.length - 1 ? pageOrder[currentIndex + 1] : null
    };
  }

  function findLastVisibleHeading(headings) {
    for (let index = headings.length - 1; index >= 0; index -= 1) {
      if (headings[index].getBoundingClientRect().top <= 160) return headings[index];
    }
    return headings[0];
  }

  function setActiveNav(pageKey) {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === pageKey);
    });
  }

  function showRuntimeWarning(runtimeWarning) {
    if (window.location.protocol === "file:") {
      runtimeWarning.hidden = false;
      runtimeWarning.textContent = "El contenido Markdown se carga por fetch. Para ver el sitio correctamente, levántelo con un servidor estático simple, por ejemplo: python -m http.server 8000";
    }
  }

  function renderToc(toc, headings) {
    const relevant = headings.filter((h) => h.level >= 2 && h.level <= 3);
    if (!relevant.length) {
      toc.innerHTML = '<p class="muted">Sin subtítulos detectados.</p>';
      return;
    }
    toc.innerHTML = relevant
      .map((h) => `<a class="toc-level-${h.level}" href="#${h.id}">${h.text}</a>`)
      .join("");
  }

  function addCopyButtons(content) {
    content.querySelectorAll("pre").forEach((block) => {
      if (block.querySelector(".copy-button")) return;
      const button = document.createElement("button");
      button.className = "copy-button";
      button.type = "button";
      button.textContent = "Copiar";
      button.addEventListener("click", async () => {
        const code = block.querySelector("code");
        if (!code) return;
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copiado";
        window.setTimeout(() => { button.textContent = "Copiar"; }, 1200);
      });
      block.appendChild(button);
    });
  }

  function updateTocActiveState(toc) {
    const links = [...toc.querySelectorAll("a")];
    const headings = links
      .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
      .filter(Boolean);
    const current = findLastVisibleHeading(headings);
    links.forEach((link) => {
      link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
    });
  }

  function bindBackToTop(backToTop, toc) {
    function toggle() { backToTop.hidden = window.scrollY < 320; }
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", toggle, { passive: true });
    window.addEventListener("scroll", () => updateTocActiveState(toc), { passive: true });
    toggle();
  }

  function renderPageNavigation(content, pageKey) {
    const existingNav = content.querySelector(".page-nav");
    if (existingNav) existingNav.remove();
    const neighbors = getPageNeighbors(pageKey);
    if (!neighbors.previous && !neighbors.next) return;

    const nav = document.createElement("nav");
    nav.className = "page-nav";
    nav.setAttribute("aria-label", "Navegación entre secciones");

    const previousMarkup = neighbors.previous
      ? `<a class="page-nav-link" href="${getPageFile(neighbors.previous)}"><span>← Anterior</span><strong>${pages[neighbors.previous].title}</strong></a>`
      : `<span class="page-nav-spacer"></span>`;
    const nextMarkup = neighbors.next
      ? `<a class="page-nav-link next" href="${getPageFile(neighbors.next)}"><span>Siguiente →</span><strong>${pages[neighbors.next].title}</strong></a>`
      : `<span class="page-nav-spacer"></span>`;

    nav.innerHTML = previousMarkup + nextMarkup;
    content.appendChild(nav);
  }

  function buildSearchIndex(pageKey, text) {
    return { pageKey, text: text.toLowerCase() };
  }

  function performSearch(query, searchResults) {
    if (!query || query.length < 2) { searchResults.hidden = true; return; }
    const q = query.toLowerCase();
    const hits = pageOrder.filter((k) => {
      const page = pages[k];
      return page.title.toLowerCase().includes(q) ||
        (searchIndex && searchIndex[k] && searchIndex[k].includes(q));
    });

    if (!hits.length) {
      searchResults.innerHTML = `<p style="padding:0.6rem 0.75rem;color:var(--muted)">Sin resultados para "<em>${query}</em>"</p>`;
    } else {
      searchResults.innerHTML = hits.map((k) =>
        `<a href="${getPageFile(k)}">${pages[k].title}</a>`
      ).join("");
    }
    searchResults.hidden = false;
  }

  async function loadPage(pageKey) {
    const page = pages[pageKey];
    if (!page) return;

    const content = document.getElementById("content");
    const pageTitle = document.getElementById("page-title");
    const toc = document.getElementById("toc");
    if (!content || !pageTitle || !toc) return;

    content.innerHTML = `<div class="loading-state">Cargando contenido…</div>`;
    pageTitle.textContent = "Cargando…";

    try {
      const url = `${page.file}?v=${contentVersion}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
      const markdown = await response.text();
      const { html, headings } = global.MarkdownLoader.parseMarkdown(markdown);
      content.innerHTML = html;
      pageTitle.textContent = page.title;
      document.title = `${page.title} | PoC DIE · Las Galias`;
      renderToc(toc, headings);
      addCopyButtons(content);
      renderPageNavigation(content, pageKey);
      setActiveNav(pageKey);
      if (!searchIndex) searchIndex = {};
      searchIndex[pageKey] = markdown.toLowerCase();
    } catch (err) {
      content.innerHTML = `<div class="error-state">No se pudo cargar el contenido: ${err.message}</div>`;
    }
  }

  function init() {
    const pageKey = document.body.dataset.page || "inicio";
    const toc = document.getElementById("toc");
    const backToTop = document.getElementById("back-to-top");
    const runtimeWarning = document.getElementById("runtime-warning");
    const searchInput = document.getElementById("site-search");
    const searchResults = document.getElementById("search-results");

    if (runtimeWarning) showRuntimeWarning(runtimeWarning);
    if (backToTop && toc) bindBackToTop(backToTop, toc);

    if (searchInput && searchResults) {
      searchInput.addEventListener("input", (e) => performSearch(e.target.value, searchResults));
      document.addEventListener("click", (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
          searchResults.hidden = true;
        }
      });
    }

    loadPage(pageKey);
  }

  global.SiteApp = { init, loadPage, pages };
})(globalThis);
