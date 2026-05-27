"""Generate PNG files from all PlantUML diagrams in assets/plantuml/"""
import subprocess
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUML_DIR = os.path.join(BASE, "assets", "plantuml")
OUT_DIR  = os.path.join(BASE, "assets", "img", "diagramas")

os.makedirs(OUT_DIR, exist_ok=True)

puml_files = sorted(f for f in os.listdir(PUML_DIR) if f.endswith(".puml"))
print(f"Found {len(puml_files)} .puml files\n")

ok = []
fail = []
for fname in puml_files:
    stem = fname[:-5]
    src  = os.path.join(PUML_DIR, fname)
    result = subprocess.run(
        ["plantuml", "-tpng", "-o", OUT_DIR, src],
        capture_output=True, text=True
    )
    png = os.path.join(OUT_DIR, stem + ".png")
    if os.path.exists(png):
        size = os.path.getsize(png)
        print(f"  OK  {stem}.png  ({size:,} bytes)")
        ok.append(stem)
    else:
        print(f"  FAIL {fname}")
        if result.stderr:
            print(f"       stderr: {result.stderr[:200]}")
        if result.stdout:
            print(f"       stdout: {result.stdout[:200]}")
        fail.append(stem)

print(f"\nDone: {len(ok)} OK, {len(fail)} FAILED")
if fail:
    print("Failed:", fail)
    sys.exit(1)
