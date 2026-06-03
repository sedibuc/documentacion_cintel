"""Renderiza los diagramas PlantUML del micrositio Arquitectura Transversal CINTEL."""
import zlib
import urllib.request
import urllib.error
import os

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

def render_diagram(puml_path, output_path):
    with open(puml_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Trim to first @enduml to avoid duplicates
    for end_tag in ('@enduml', '@endwbs', '@endgantt'):
        if end_tag in content:
            idx = content.index(end_tag) + len(end_tag)
            content = content[:idx]
            break

    encoded = encode_plantuml(content)
    url = f'https://www.plantuml.com/plantuml/png/{encoded}'

    print(f'  Renderizando: {os.path.basename(puml_path)}')
    print(f'  URL length: {len(url)} chars')

    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 PlantUML-Renderer/1.0'
    })

    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            if response.status == 200:
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                with open(output_path, 'wb') as f:
                    f.write(response.read())
                size = os.path.getsize(output_path)
                print(f'  OK — {size:,} bytes -> {os.path.basename(output_path)}\n')
                return True
            else:
                print(f'  ERROR HTTP {response.status}\n')
                return False
    except urllib.error.HTTPError as e:
        print(f'  ERROR HTTP {e.code}: {e.reason}\n')
        return False
    except Exception as e:
        print(f'  ERROR: {e}\n')
        return False

# ── Paths ──────────────────────────────────────────────────────────────────────
base = os.path.dirname(os.path.abspath(__file__))
root = os.path.normpath(os.path.join(base, '..'))

transv_puml = os.path.join(root, 'transversales', 'assets', 'plantuml')
transv_img  = os.path.join(root, 'transversales', 'assets', 'img', 'diagramas')

# ── Diagramas del Core Transversal ─────────────────────────────────────────────
diagrams = [
    (
        os.path.join(transv_puml, 'arquitectura-transversal.puml'),
        os.path.join(transv_img, 'arquitectura-transversal.png'),
    ),
    (
        os.path.join(transv_puml, 'modulos-reutilizables.puml'),
        os.path.join(transv_img, 'modulos-reutilizables.png'),
    ),
    (
        os.path.join(transv_puml, 'separacion-core-proyectos.puml'),
        os.path.join(transv_img, 'separacion-core-proyectos.png'),
    ),
    (
        os.path.join(transv_puml, 'flujo-nuevo-proyecto.puml'),
        os.path.join(transv_img, 'flujo-nuevo-proyecto.png'),
    ),
    (
        os.path.join(transv_puml, 'roadmap-fases.puml'),
        os.path.join(transv_img, 'roadmap-fases.png'),
    ),
]

print('=' * 60)
print('Renderizando diagramas del Core Transversal CINTEL')
print('=' * 60)
print()

ok = 0
fail = 0
for puml_path, img_path in diagrams:
    if not os.path.exists(puml_path):
        print(f'  SKIP (no existe): {puml_path}\n')
        fail += 1
        continue
    if render_diagram(puml_path, img_path):
        ok += 1
    else:
        fail += 1

print('=' * 60)
print(f'Resultado: {ok} OK, {fail} fallidos de {len(diagrams)} diagramas')
print('=' * 60)
