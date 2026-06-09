"""Render PoC DIE Las Galias PlantUML diagrams to PNG."""
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

    # Trim to first end tag
    for end_tag in ('@enduml', '@endgantt', '@endwbs'):
        if end_tag in content:
            idx = content.index(end_tag) + len(end_tag)
            content = content[:idx]
            break

    encoded = encode_plantuml(content)
    url = f'https://www.plantuml.com/plantuml/png/{encoded}'

    print(f'  Rendering: {os.path.basename(puml_path)}')
    print(f'  URL length: {len(url)} chars')

    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 PlantUML-Renderer/1.0'
    })

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            png_data = response.read()

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(png_data)

        print(f'  ✅ Saved: {output_path} ({len(png_data)} bytes)')
        return True
    except urllib.error.HTTPError as e:
        print(f'  ❌ HTTP error {e.code}: {e.reason}')
        return False
    except Exception as e:
        print(f'  ❌ Error: {e}')
        return False

def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    poc_base = os.path.join(base, 'poc-die')
    plantuml_dir = os.path.join(poc_base, 'assets', 'plantuml')
    img_dir = os.path.join(poc_base, 'assets', 'img', 'diagramas')

    diagrams = [
        ('poc-die-arquitectura.plantuml',    'poc-die-arquitectura.png'),
        ('poc-die-flujo-extraccion.plantuml','poc-die-flujo-extraccion.png'),
        ('poc-die-cronograma.plantuml',      'poc-die-cronograma.png'),
        ('poc-die-prerequisitos.plantuml',   'poc-die-prerequisitos.png'),
        ('poc-die-evolucion.plantuml',       'poc-die-evolucion.png'),
        ('poc-die-riesgos.plantuml',         'poc-die-riesgos.png'),
    ]

    print(f'\n=== Rendering PoC DIE Las Galias diagrams ===\n')
    success = 0
    failed = 0

    for puml_name, png_name in diagrams:
        puml_path = os.path.join(plantuml_dir, puml_name)
        png_path = os.path.join(img_dir, png_name)

        if not os.path.exists(puml_path):
            print(f'  ⚠️  Missing source: {puml_name}')
            failed += 1
            continue

        result = render_diagram(puml_path, png_path)
        if result:
            success += 1
        else:
            failed += 1

    print(f'\n=== Results: {success} OK, {failed} failed ===')
    return 0 if failed == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
