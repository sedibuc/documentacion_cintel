"""Renderiza los PNGs del cronograma RAG usando la API online de PlantUML."""
import zlib, urllib.request, os, sys

CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'

def encode3(b1, b2, b3):
    return (CHARS[b1 >> 2] +
            CHARS[((b1 & 3) << 4) | (b2 >> 4)] +
            CHARS[((b2 & 15) << 2) | (b3 >> 6)] +
            CHARS[b3 & 63])

def encode_plantuml(text):
    compressed = zlib.compress(text.encode('utf-8'), 9)[2:-4]
    result = []
    for i in range(0, len(compressed), 3):
        chunk = compressed[i:i+3]
        if len(chunk) == 3:
            result.append(encode3(chunk[0], chunk[1], chunk[2]))
        elif len(chunk) == 2:
            result.append(encode3(chunk[0], chunk[1], 0)[:3])
        else:
            result.append(encode3(chunk[0], 0, 0)[:2])
    return ''.join(result)

def render(puml_path, out_path):
    with open(puml_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if '@enduml' in content:
        content = content[:content.index('@enduml') + len('@enduml')]
    encoded = encode_plantuml(content)
    url = f'https://www.plantuml.com/plantuml/png/{encoded}'
    print(f'  -> {os.path.basename(puml_path)}  (url len={len(url)})')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            if r.status == 200:
                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                with open(out_path, 'wb') as f:
                    f.write(r.read())
                print(f'     OK — {os.path.getsize(out_path):,} bytes -> {out_path}')
                return True
            print(f'     HTTP {r.status}')
            return False
    except Exception as e:
        print(f'     ERROR: {e}')
        return False

base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'RAG')

diagrams = [
    'cronograma-gantt-rag',
    'cronograma-sprints-alcance-rag',
    'cronograma-riesgos-mitigacion-rag',
]

print('=== Renderizando diagramas cronograma RAG ===\n')
ok, fail = 0, 0
for stem in diagrams:
    puml = os.path.join(base, 'assets', 'plantuml', f'{stem}.plantuml')
    out  = os.path.join(base, 'assets', 'img', 'diagramas', f'{stem}.png')
    if render(puml, out):
        ok += 1
    else:
        fail += 1

print(f'\nDone: {ok} OK, {fail} FAILED')
if fail:
    sys.exit(1)
