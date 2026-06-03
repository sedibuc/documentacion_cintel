"""Renderiza los nuevos diagramas PlantUML para RAG y Agent micrositios."""
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

    # Trim to first @enduml / @endwbs to avoid duplicates
    for end_tag in ('@enduml', '@endwbs'):
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
        with urllib.request.urlopen(req, timeout=60) as response:
            if response.status == 200:
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                with open(output_path, 'wb') as f:
                    f.write(response.read())
                size = os.path.getsize(output_path)
                print(f'  OK — {size:,} bytes -> {os.path.basename(output_path)}')
                return True
            else:
                print(f'  ERROR HTTP {response.status}')
                return False
    except urllib.error.HTTPError as e:
        print(f'  ERROR HTTP {e.code}: {e.reason}')
        return False
    except Exception as e:
        print(f'  ERROR: {e}')
        return False

# Base directory (project root)
base = os.path.dirname(os.path.abspath(__file__))
root = os.path.join(base, '..')

# ===================================================================
# RAG micrositio — new diagrams
# ===================================================================
rag_tobe_puml = os.path.join(root, 'RAG', 'assets', 'plantuml', 'tobe')
rag_tobe_img  = os.path.join(root, 'RAG', 'assets', 'img', 'diagramas', 'tobe')

rag_root_puml = os.path.join(root, 'RAG', 'assets', 'plantuml')
rag_root_img  = os.path.join(root, 'RAG', 'assets', 'img', 'diagramas')

rag_diagrams = [
    (os.path.join(rag_tobe_puml, '09-pipeline-tecnico-llm.plantuml'),
     os.path.join(rag_tobe_img,  '09-pipeline-tecnico-llm.png')),
    (os.path.join(rag_root_puml, 'flujo-rag-tipico.plantuml'),
     os.path.join(rag_root_img,  'flujo-rag-tipico.png')),
]

# ===================================================================
# Agent micrositio — new diagrams
# ===================================================================
agent_puml = os.path.join(root, 'agent', 'assets', 'plantuml')
agent_img  = os.path.join(root, 'agent', 'assets', 'img', 'diagramas')

agent_diagrams = [
    (os.path.join(agent_puml, 'arquitectura-relaciones-componentes.plantuml'),
     os.path.join(agent_img,  'arquitectura-relaciones-componentes.png')),
    (os.path.join(agent_puml, 'inicio-flujo-sistema.plantuml'),
     os.path.join(agent_img,  'inicio-flujo-sistema.png')),
    (os.path.join(agent_puml, 'mockup-estructura.plantuml'),
     os.path.join(agent_img,  'mockup-estructura.png')),
    (os.path.join(agent_puml, 'to-be-arquitectura-capas-logicas.plantuml'),
     os.path.join(agent_img,  'to-be-arquitectura-capas-logicas.png')),
    (os.path.join(agent_puml, 'to-be-estrategia-recuperacion-contexto.plantuml'),
     os.path.join(agent_img,  'to-be-estrategia-recuperacion-contexto.png')),
    (os.path.join(agent_puml, 'to-be-flujo-funcional-e2e.plantuml'),
     os.path.join(agent_img,  'to-be-flujo-funcional-e2e.png')),
]

all_diagrams = rag_diagrams + agent_diagrams

print('=== Renderizando nuevos diagramas PlantUML (RAG + Agent) ===\n')
success = 0
failed = 0
failed_names = []

for puml_path, out_path in all_diagrams:
    if not os.path.exists(puml_path):
        print(f'  SKIP (not found): {puml_path}')
        failed += 1
        failed_names.append(os.path.basename(puml_path))
        continue

    ok = render_diagram(puml_path, out_path)
    if ok:
        success += 1
    else:
        failed += 1
        failed_names.append(os.path.basename(puml_path))
    print()

print(f'=== Resultado: {success} OK, {failed} fallidos ===')
if failed_names:
    print('Fallidos:', failed_names)
