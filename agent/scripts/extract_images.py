"""Extract base64-embedded images from arquitectura.md and save them as PNG files."""
import re
import base64
import os

MD_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "context", "propuesta_rg", "arquitectura.md"
)
IMG_DIR = os.path.dirname(MD_FILE)

with open(MD_FILE, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(
    r'!\[([^\]]*)\]\(data:image/(png|jpeg|jpg|gif|webp);base64,([A-Za-z0-9+/=\s]+?)\)',
    re.DOTALL
)

counter = [0]
seen = {}   # base64_prefix -> filename (dedup same image)

def replace_match(m):
    alt    = m.group(1)
    ext    = m.group(2).replace("jpeg", "jpg")
    b64    = re.sub(r'\s', '', m.group(3))
    key    = b64[:64]          # use first 64 chars as dedup key

    if key not in seen:
        counter[0] += 1
        fname = f"img-{counter[0]:02d}.{ext}"
        fpath = os.path.join(IMG_DIR, fname)
        data  = base64.b64decode(b64)
        with open(fpath, "wb") as fout:
            fout.write(data)
        seen[key] = fname
        print(f"  saved {fname}  ({len(data):,} bytes)  alt='{alt}'")
    else:
        fname = seen[key]
        print(f"  reuse {fname}  alt='{alt}'")

    return f"![]({fname})"

new_content = pattern.sub(replace_match, content)

with open(MD_FILE, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"\nDone. {counter[0]} unique image(s) extracted.")
print(f"Markdown rewritten: {MD_FILE}")
