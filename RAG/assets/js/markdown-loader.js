(function (global) {
  function slugify(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderImageTag(alt, src) {
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
  }

  function extractStandaloneImages(text) {
    const matches = [...text.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    if (!matches.length) {
      return null;
    }

    const remainder = text.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim();
    if (remainder) {
      return null;
    }

    return matches.map((match) => ({ alt: match[1], src: match[2] }));
  }

  function inlineFormat(text) {
    let formatted = escapeHtml(text);
    formatted = formatted.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => renderImageTag(alt, src));
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return formatted;
  }

  function buildTable(lines) {
    const rows = lines
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));

    if (rows.length < 2) {
      return "";
    }

    const header = rows[0];
    const body = rows.slice(2);
    const thead = `<thead><tr>${header.map((cell) => `<th>${inlineFormat(cell)}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${body
      .map((row) => `<tr>${row.map((cell) => `<td>${inlineFormat(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;

    return `<table>${thead}${tbody}</table>`;
  }

  function parseMarkdown(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    const headings = [];
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();

      if (!trimmed) {
        index += 1;
        continue;
      }

      if (trimmed.startsWith("```")) {
        const language = trimmed.slice(3).trim() || "texto";
        const codeLines = [];
        index += 1;
        while (index < lines.length && !lines[index].trim().startsWith("```")) {
          codeLines.push(lines[index]);
          index += 1;
        }
        index += 1;
        html.push(`<pre data-language="${escapeHtml(language)}"><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        continue;
      }

      if (/^<[^>]+>/.test(trimmed) || /^<\//.test(trimmed)) {
        const rawLines = [line];
        index += 1;
        while (index < lines.length && lines[index].trim()) {
          rawLines.push(lines[index]);
          index += 1;
        }
        html.push(rawLines.join("\n"));
        continue;
      }

      const standaloneImages = extractStandaloneImages(trimmed);
      if (standaloneImages) {
        html.push(
          standaloneImages
            .map((image) => `<div class="diagram">${renderImageTag(image.alt, image.src)}</div>`)
            .join("\n")
        );
        index += 1;
        continue;
      }

      if (/^\|.+\|$/.test(trimmed) && index + 1 < lines.length && /^\|?\s*[-:]+/.test(lines[index + 1].trim())) {
        const tableLines = [line, lines[index + 1]];
        index += 2;
        while (index < lines.length && /^\|.+\|$/.test(lines[index].trim())) {
          tableLines.push(lines[index]);
          index += 1;
        }
        html.push(buildTable(tableLines));
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const rawText = headingMatch[2].trim();
        const text = rawText.replace(/\\\./g, ".");
        const id = slugify(text);
        headings.push({ level, text, id });
        html.push(`<h${level} id="${id}">${inlineFormat(text)}<a class="heading-anchor" href="#${id}">#</a></h${level}>`);
        index += 1;
        continue;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        const items = [];
        while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
          items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
          index += 1;
        }
        html.push(`<ul>${items.map((item) => `<li>${inlineFormat(item)}</li>`).join("")}</ul>`);
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const items = [];
        while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
          items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
          index += 1;
        }
        html.push(`<ol>${items.map((item) => `<li>${inlineFormat(item)}</li>`).join("")}</ol>`);
        continue;
      }

      if (/^>\s?/.test(trimmed)) {
        const quoteLines = [];
        while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
          quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
          index += 1;
        }
        html.push(`<blockquote><p>${inlineFormat(quoteLines.join(" "))}</p></blockquote>`);
        continue;
      }

      if (/^---+$/.test(trimmed)) {
        html.push("<hr>");
        index += 1;
        continue;
      }

      const paragraph = [trimmed];
      index += 1;
      while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+/.test(lines[index].trim()) && !/^```/.test(lines[index].trim()) && !/^[-*]\s+/.test(lines[index].trim()) && !/^\d+\.\s+/.test(lines[index].trim()) && !/^>\s?/.test(lines[index].trim()) && !/^\|.+\|$/.test(lines[index].trim()) && !/^<[^>]+>/.test(lines[index].trim()) && !/^<\//.test(lines[index].trim()) && !extractStandaloneImages(lines[index].trim())) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      html.push(`<p>${inlineFormat(paragraph.join(" ").replace(/\\\./g, "."))}</p>`);
    }

    return {
      html: html.join("\n"),
      headings
    };
  }

  global.MarkdownLoader = {
    slugify,
    parseMarkdown
  };
})(globalThis);