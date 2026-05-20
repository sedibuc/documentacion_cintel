import zlib
import urllib.request
import urllib.error
import os
import sys

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
    if '@enduml' in content:
        idx = content.index('@enduml') + len('@enduml')
        content = content[:idx]

    encoded = encode_plantuml(content)
    url = f'https://www.plantuml.com/plantuml/png/{encoded}'

    print(f'  Rendering: {os.path.basename(puml_path)}')
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
                print(f'  OK — {size} bytes -> {output_path}')
                return True
            else:
                print(f'  ERROR HTTP {response.status}')
                return False
    except urllib.error.HTTPError as e:
        print(f'  ERROR HTTP {e.code}: {e.reason}')
        print(f'  URL was: {url[:120]}...')
        return False
    except Exception as e:
        print(f'  ERROR: {e}')
        return False

# Base directory
base = os.path.dirname(os.path.abspath(__file__))
puml_dir = os.path.join(base, '..', 'plantuml', 'document-intelligence')
img_dir = os.path.join(base, '..', 'img', 'diagramas', 'document-intelligence')

diagrams = [
    '01-vista-negocio-capacidades',
    '02-mapa-componentes-tobe',
    '03-flujo-procesamiento-documentos',
    '04-flujo-extraccion-llm',
    '05-vista-datos-conceptual',
    '06-vista-seguridad-multitenant',
    '07-vista-despliegue-mvp',
    '08-roadmap-arquitectonico',
]

print('=== Document Intelligence Engine — Renderizando diagramas PlantUML ===\n')
success = 0
failed = 0
failed_names = []

for name in diagrams:
    puml_path = os.path.join(puml_dir, f'{name}.puml')
    out_path = os.path.join(img_dir, f'{name}.png')

    if not os.path.exists(puml_path):
        print(f'  SKIP (not found): {puml_path}')
        failed += 1
        failed_names.append(name)
        continue

    ok = render_diagram(puml_path, out_path)
    if ok:
        success += 1
    else:
        failed += 1
        failed_names.append(name)

print(f'\n=== Resultado: {success} OK, {failed} fallidos ===')
if failed_names:
    print('Fallidos:', failed_names)
