"""Renderiza los diagramas PlantUML corregidos en la sesión de validación (junio 2026)."""
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
    for end_tag in ('@enduml', '@endwbs'):
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
base  = os.path.dirname(os.path.abspath(__file__))
root  = os.path.normpath(os.path.join(base, '..'))

agent_puml = os.path.join(root, 'agent', 'assets', 'plantuml')
agent_img  = os.path.join(root, 'agent', 'assets', 'img', 'diagramas')

# ── Diagramas corregidos (validación junio 2026) ───────────────────────────────
# 1. iteracion-integracion-modulos — numeración de módulos corregida (2.3/2.4/2.5/2.6)
diagrams = [
    (
        os.path.join(agent_puml, 'iteracion-integracion-modulos.plantuml'),
        os.path.join(agent_img,  'iteracion-integracion-modulos.png'),
    ),
]

print('=== Renderizando diagramas corregidos — Agent micrositio ===\n')
success = 0
failed  = 0

for puml_path, out_path in diagrams:
    if not os.path.exists(puml_path):
        print(f'  SKIP (no encontrado): {puml_path}\n')
        failed += 1
        continue
    ok = render_diagram(puml_path, out_path)
    if ok:
        success += 1
    else:
        failed += 1

print(f'=== Resultado: {success} OK — {failed} errores ===')
