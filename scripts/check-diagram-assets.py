import re
from pathlib import Path

roots = [Path("agent/content"), Path("RAG/content")]
missing_png = []
missing_plantuml = []

for root in roots:
    site_root = root.parent
    for md in root.rglob("*.md"):
        text = md.read_text(encoding="utf-8", errors="ignore")
        pngs = re.findall(r"(assets/img/diagramas/[^\)\"\s]+\.png)", text)
        plants = re.findall(r"(assets/plantuml/[^\)\"\s]+\.plantuml)", text)
        for rel in pngs:
            if not (site_root / rel).exists():
                missing_png.append((str(md), rel))
        for rel in plants:
            if not (site_root / rel).exists():
                missing_plantuml.append((str(md), rel))

print("MISSING_PNG", len(missing_png))
for p in missing_png:
    print(p[0], "->", p[1])
print("MISSING_PLANTUML", len(missing_plantuml))
for p in missing_plantuml:
    print(p[0], "->", p[1])
