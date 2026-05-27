(function (global) {
  const pages = {
    // ── AS-IS ────────────────────────────────────────────────────────────────
    inicio: { file: "content/inicio.md", title: "Inicio" },
    diagnostico: { file: "content/diagnostico.md", title: "AS-IS — Diagnóstico técnico" },
    arquitectura: { file: "content/arquitectura.md", title: "AS-IS — Arquitectura vigente" },
    brechas: { file: "content/brechas.md", title: "AS-IS — Brechas y oportunidades" },
    despliegue: { file: "content/despliegue.md", title: "AS-IS — Configuración y despliegue" },
    costos: { file: "content/costos.md", title: "AS-IS — Servicios y costos" },
    "mockup": { file: "content/mockup.md", title: "AS-IS — Prototipo / Demostrador" },
    // ── TO-BE ─────────────────────────────────────────────────────────────────
    "to-be": { file: "content/to-be.md", title: "TO-BE — Visión funcional objetivo" },
    "to-be-objetivos-funcionales": { file: "content/to-be-objetivos-funcionales.md", title: "TO-BE — Objetivos funcionales y cobertura arquitectónica" },
    "to-be-onboarding": { file: "content/to-be-onboarding.md", title: "TO-BE — Onboarding institucional" },
    "to-be-contexto": { file: "content/to-be-contexto.md", title: "TO-BE — Contexto organizacional persistente" },
    "to-be-agente-estrategico": { file: "content/to-be-agente-estrategico.md", title: "TO-BE — Agente Estratégico" },
    "to-be-agente-creativo": { file: "content/to-be-agente-creativo.md", title: "TO-BE — Agente Creativo" },
    "to-be-iteracion": { file: "content/to-be-iteracion.md", title: "TO-BE — Ajuste de resultados" },
    "to-be-historico": { file: "content/to-be-historico.md", title: "TO-BE — Histórico y memoria organizacional" },
    // ── Decisiones Técnicas ───────────────────────────────────────────────────
    "to-be-arquitectura": { file: "content/to-be-arquitectura.md", title: "Decisiones Técnicas — Arquitectura TO-BE optimizada" },
    "cronograma-implementacion-sprints": { file: "content/cronograma-implementacion-sprints.md", title: "Decisiones Técnicas — Cronograma de implementación por sprints" },
    "preguntas-experto-tecnico": { file: "content/preguntas-experto-tecnico.md", title: "Decisiones Técnicas — Preguntas para experto técnico" },
    "decisiones-modulos": { file: "content/decisiones-modulos.md", title: "Decisiones Técnicas — Mapa de módulos" },
    "decisiones-modulos-contexto-datos": { file: "content/decisiones-modulos-contexto-datos.md", title: "Decisiones Técnicas — Módulos de contexto y datos" },
    "decisiones-modulos-agentes-canales": { file: "content/decisiones-modulos-agentes-canales.md", title: "Decisiones Técnicas — Módulos de agentes y canales" },
    "decisiones-modulos-gobernanza-operacion": { file: "content/decisiones-modulos-gobernanza-operacion.md", title: "Decisiones Técnicas — Módulos de gobernanza y operación" },
    "decisiones-modulos-seguridad-escalado": { file: "content/decisiones-modulos-seguridad-escalado.md", title: "Decisiones Técnicas — Módulos de seguridad y escalado" },
    // ── Análisis ──────────────────────────────────────────────────────────────
    "analisis-cambio-contexto-to-be": { file: "content/analisis-cambio-contexto-to-be.md", title: "Análisis — Comparativa validación vs TO-BE final" }
  };

  const pageOrder = Object.keys(pages);
  let searchIndex = null;

  function getPageNeighbors(pageKey) {
    const currentIndex = pageOrder.indexOf(pageKey);
    return {
      previous: currentIndex > 0 ? pageOrder[currentIndex - 1] : null,
      next: currentIndex >= 0 && currentIndex < pageOrder.length - 1 ? pageOrder[currentIndex + 1] : null
    };
  }

  function findLastVisibleHeading(headings) {
    for (let index = headings.length - 1; index >= 0; index -= 1) {
      if (headings[index].getBoundingClientRect().top <= 160) {
        return headings[index];
      }
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
    const relevant = headings.filter((heading) => heading.level >= 2 && heading.level <= 3);
    if (!relevant.length) {
      toc.innerHTML = '<p class="muted">Sin subtítulos detectados.</p>';
      return;
    }

    toc.innerHTML = relevant
      .map((heading) => `<a class="toc-level-${heading.level}" href="#${heading.id}">${heading.text}</a>`)
      .join("");
  }

  function addCopyButtons(content) {
    content.querySelectorAll("pre").forEach((block) => {
      if (block.querySelector(".copy-button")) {
        return;
      }
      const button = document.createElement("button");
      button.className = "copy-button";
      button.type = "button";
      button.textContent = "Copiar";
      button.addEventListener("click", async () => {
        const code = block.querySelector("code");
        if (!code) {
          return;
        }
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copiado";
        window.setTimeout(() => {
          button.textContent = "Copiar";
        }, 1200);
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
    function toggle() {
      backToTop.hidden = window.scrollY < 320;
    }
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", toggle, { passive: true });
    window.addEventListener("scroll", () => updateTocActiveState(toc), { passive: true });
    toggle();
  }

  function enhanceSourceLink() {
    const sourceLink = document.getElementById("source-link");
    if (!sourceLink) {
      return;
    }

    sourceLink.href = "source/diagnostico_marketing_agent.md";
    sourceLink.textContent = "Ver diagnóstico fuente (.md)";
    sourceLink.title = "Abre el documento base en formato Markdown";
    sourceLink.setAttribute("aria-label", "Ver diagnóstico fuente en formato Markdown");
  }

  function renderPageNavigation(content, pageKey) {
    const existingNav = content.querySelector(".page-nav");
    if (existingNav) {
      existingNav.remove();
    }

    const neighbors = getPageNeighbors(pageKey);
    if (!neighbors.previous && !neighbors.next) {
      return;
    }

    const nav = document.createElement("nav");
    nav.className = "page-nav";
    nav.setAttribute("aria-label", "Navegación entre secciones");

    const previousMarkup = neighbors.previous
      ? `<a class="page-nav-link prev" href="${neighbors.previous === "inicio" ? "index" : neighbors.previous}.html"><span>Anterior</span><strong>${pages[neighbors.previous].title}</strong></a>`
      : '<span class="page-nav-spacer" aria-hidden="true"></span>';
    const nextMarkup = neighbors.next
      ? `<a class="page-nav-link next" href="${neighbors.next === "inicio" ? "index" : neighbors.next}.html"><span>Siguiente</span><strong>${pages[neighbors.next].title}</strong></a>`
      : '<span class="page-nav-spacer" aria-hidden="true"></span>';

    nav.innerHTML = `${previousMarkup}${nextMarkup}`;
    content.appendChild(nav);
  }

  async function loadPage(pageKey, pageConfig, pageTitle, content, toc, markdownLoader) {
    pageTitle.textContent = pageConfig.title;
    content.innerHTML = '<div class="loading-state">Cargando contenido...</div>';
    if (!markdownLoader || typeof markdownLoader.parseMarkdown !== "function") {
      throw new Error("No se pudo inicializar el renderizador Markdown.");
    }
    const response = await fetch(pageConfig.file);
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${pageConfig.file}`);
    }
    const markdown = await response.text();
    const parsed = markdownLoader.parseMarkdown(markdown);
    content.innerHTML = parsed.html;
    renderToc(toc, parsed.headings);
    addCopyButtons(content);
    renderPageNavigation(content, pageKey);
    updateTocActiveState(toc);
  }

  function buildSnippet(source, query) {
    const lower = source.toLowerCase();
    const start = Math.max(0, lower.indexOf(query) - 70);
    const end = Math.min(source.length, start + 180);
    const raw = source.slice(start, end).replace(/\s+/g, " ").trim();
    return raw
      .replace(/^#{1,3}\s+/gm, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .replace(/\[[^\]]+\]\([^)]+\)/g, "")
      .trim();
  }

  async function ensureSearchIndex() {
    if (searchIndex) {
      return searchIndex;
    }

    const entries = await Promise.all(
      Object.entries(pages).map(async ([key, config]) => {
        const response = await fetch(config.file);
        const text = await response.text();
        return { key, title: config.title, file: `${key === "inicio" ? "index" : key}.html`, text };
      })
    );
    searchIndex = entries;
    return entries;
  }

  async function handleSearch() {
    const searchInput = document.getElementById("site-search");
    const searchResults = document.getElementById("search-results");
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
      return;
    }

    let index;
    try {
      index = await ensureSearchIndex();
    } catch (_error) {
      searchResults.hidden = false;
      searchResults.innerHTML = "<p>No se pudo cargar el índice de búsqueda.</p>";
      return;
    }
    const results = index
      .filter((entry) => entry.text.toLowerCase().includes(query))
      .slice(0, 8)
      .map((entry) => {
        const lines = entry.text.split(/\n/);
        let section = entry.title;
        for (let i = 0; i < lines.length; i += 1) {
          if (lines[i].toLowerCase().includes(query) && i >= 0) {
            for (let j = i; j >= 0; j -= 1) {
              if (/^#{1,3}\s+/.test(lines[j])) {
                section = lines[j].replace(/^#{1,3}\s+/, "");
                break;
              }
            }
            break;
          }
        }
        return {
          ...entry,
          section,
          snippet: buildSnippet(entry.text, query)
        };
      });

    if (!results.length) {
      searchResults.hidden = false;
      searchResults.innerHTML = "<p>No se encontraron coincidencias.</p>";
      return;
    }

    searchResults.hidden = false;
    searchResults.innerHTML = results
      .map((result) => `
        <a href="${result.file}">
          <strong>${result.title}</strong>
          <small>${result.section}</small>
          <small>${result.snippet}</small>
        </a>
      `)
      .join("");
  }

  async function init() {
    const body = document.body;
    if (body.dataset.appInitialized === "true") {
      return;
    }

    const pageKey = body.dataset.page;
    const pageConfig = pages[pageKey];
    const content = document.getElementById("content");
    const toc = document.getElementById("toc");
    const pageTitle = document.getElementById("page-title");
    const runtimeWarning = document.getElementById("runtime-warning");
    const backToTop = document.getElementById("back-to-top");
    const searchInput = document.getElementById("site-search");
    const markdownLoader = global.MarkdownLoader;

    if (!pageConfig || !content || !toc || !pageTitle || !runtimeWarning || !backToTop || !searchInput) {
      return;
    }

    body.dataset.appInitialized = "true";
    setActiveNav(pageKey);
    enhanceSourceLink();
    showRuntimeWarning(runtimeWarning);
    bindBackToTop(backToTop, toc);
    searchInput.addEventListener("input", handleSearch);
    searchInput.addEventListener("blur", () => {
      window.setTimeout(() => {
        const searchResults = document.getElementById("search-results");
        if (searchResults) {
          searchResults.hidden = true;
          searchResults.innerHTML = "";
        }
      }, 200);
    });
    try {
      await loadPage(pageKey, pageConfig, pageTitle, content, toc, markdownLoader);
    } catch (error) {
      content.innerHTML = `<div class="error-state">${error.message}</div>`;
    }
  }

  global.SiteApp = {
    init
  };
})(globalThis);
