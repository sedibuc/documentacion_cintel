import re
from pathlib import Path

roots = [Path("agent/content"), Path("RAG/content")]
missing = []
mermaid = []
puml_legacy = []

for root in roots:
    for md in root.rglob("*.md"):
        text = md.read_text(encoding="utf-8", errors="ignore")
        if "```mermaid" in text.lower() or "mermaid" in text.lower():
            mermaid.append(str(md))
        if ".puml" in text:
            puml_legacy.append(str(md))

        imgs = re.findall(r"assets/img/diagramas/([^\)\"\s]+\.png)", text)
        for img in imgs:
            base = Path(img).stem
            if f"{base}.plantuml" not in text:
                missing.append((str(md), img))

print("MERMAID_FILES", len(mermaid))
for m in mermaid:
    print(m)

print("LEGACY_PUML_LINK_FILES", len(puml_legacy))
for p in puml_legacy:
    print(p)

print("MISSING_LINKS", len(missing))
for m in missing:
    print(m[0], "->", m[1])
