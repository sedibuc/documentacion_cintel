from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "assets" / "img" / "diagramas"
OUT.mkdir(parents=True, exist_ok=True)


def get_font(size=18, bold=False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def save_gantt(path: Path):
    img = Image.new("RGB", (1800, 760), "white")
    d = ImageDraw.Draw(img)
    title = get_font(34, bold=True)
    head = get_font(21, bold=True)
    txt = get_font(18)

    d.text((40, 30), "Cronograma de implementacion - Diagrama de Gantt", fill="#1f2a37", font=title)
    d.rectangle((40, 110, 1760, 700), outline="#d0d7de", width=2)

    start_x = 240
    lane_h = 56
    top = 140
    unit = 165

    months = ["Jul", "Ago", "Sep", "Oct", "Nov"]
    for i, m in enumerate(months):
        x = start_x + i * unit * 2
        d.text((x + 10, 112), m, fill="#586171", font=head)
        d.line((x, 135, x, 700), fill="#e6e9ee", width=2)

    sprints = [
        ("Sprint 0", 0, "#0f5a58"),
        ("Sprint 1", 1, "#1f6f8b"),
        ("Sprint 2", 2, "#1f6f8b"),
        ("Sprint 3", 3, "#2d8c6e"),
        ("Sprint 4", 4, "#2d8c6e"),
        ("Sprint 5", 5, "#8d4a1f"),
        ("Sprint 6", 6, "#8d4a1f"),
        ("Sprint 7", 7, "#6e59a5"),
        ("Sprint 8", 8, "#6e59a5"),
    ]

    for idx, (name, pos, color) in enumerate(sprints):
        y = top + idx * lane_h
        d.text((55, y + 12), name, fill="#1f2a37", font=txt)
        x1 = start_x + pos * (unit // 1)
        x2 = x1 + unit - 16
        d.rounded_rectangle((x1, y + 8, x2, y + 46), radius=10, fill=color)

    d.text((40, 715), "Fuente: plan por sprints (2 semanas cada sprint)", fill="#586171", font=txt)
    img.save(path)


def save_sprints_scope(path: Path):
    img = Image.new("RGB", (1800, 860), "white")
    d = ImageDraw.Draw(img)
    title = get_font(34, bold=True)
    txt = get_font(18)
    head = get_font(22, bold=True)

    d.text((40, 30), "Sprints y alcance principal", fill="#1f2a37", font=title)

    items = [
        ("S0", "Base tecnica", "Modelo de datos, tenant_id, ambientes"),
        ("S1", "Contexto institucional", "OnboardingService y auth minima"),
        ("S2", "Marca y completitud", "BrandGuidelines + CompletenessScorer"),
        ("S3", "Agente estrategico", "Flujo de estrategia y brief inicial"),
        ("S4", "Agente creativo", "Canales y piezas por formato"),
        ("S5", "Gobernanza", "Aprobacion/rechazo y trazabilidad"),
        ("S6", "Historico", "Recuperacion y reutilizacion"),
        ("S7", "Operacion MVP", "Exportacion asistida y hardening"),
        ("S8", "Piloto", "E2E, seguridad y salida controlada"),
    ]

    x, y = 50, 120
    w, h = 540, 88
    colors = ["#d6ebe8", "#dbeaf6", "#e8f5e9", "#fbe9d9", "#f3e8ff"]

    for i, (sprint, name, scope) in enumerate(items):
        col = i % 3
        row = i // 3
        xx = x + col * (w + 24)
        yy = y + row * (h + 24)
        d.rounded_rectangle((xx, yy, xx + w, yy + h), radius=14, fill=colors[row % len(colors)], outline="#d0d7de")
        d.text((xx + 16, yy + 12), f"{sprint} - {name}", fill="#0f5a58", font=head)
        d.text((xx + 16, yy + 50), scope, fill="#1f2a37", font=txt)

    d.text((40, 810), "Vista grafica del alcance incremental del MVP por sprint.", fill="#586171", font=txt)
    img.save(path)


def save_risks(path: Path):
    img = Image.new("RGB", (1600, 900), "white")
    d = ImageDraw.Draw(img)
    title = get_font(34, bold=True)
    head = get_font(22, bold=True)
    txt = get_font(18)

    d.text((40, 30), "Riesgos y mitigacion del cronograma", fill="#1f2a37", font=title)

    rows = [
        ("R1", "Insumos de marca incompletos", "Alto", "Checklist de entrada + gate de calidad en S1"),
        ("R2", "Retraso en controles multi-organizacion", "Alto", "Hardening de seguridad desde S0-S2"),
        ("R3", "Calidad irregular de salidas IA", "Medio", "Validacion humana + metricas por canal"),
        ("R4", "Deriva de alcance del MVP", "Medio", "Backlog quincenal con control de cambios"),
    ]

    x0, y0 = 40, 120
    widths = [90, 520, 180, 720]
    headers = ["ID", "Riesgo", "Impacto", "Mitigacion"]

    x = x0
    for i, h in enumerate(headers):
        d.rectangle((x, y0, x + widths[i], y0 + 54), fill="#0f5a58")
        d.text((x + 12, y0 + 14), h, fill="white", font=head)
        x += widths[i]

    for r, row in enumerate(rows):
        y = y0 + 54 + r * 86
        bg = "#f8fbff" if r % 2 == 0 else "#ffffff"
        x = x0
        for c, cell in enumerate(row):
            d.rectangle((x, y, x + widths[c], y + 86), fill=bg, outline="#d0d7de")
            d.text((x + 12, y + 28), cell, fill="#1f2a37", font=txt)
            x += widths[c]

    d.text((40, 830), "Riesgos priorizados para proteger salida a piloto.", fill="#586171", font=txt)
    img.save(path)


save_gantt(OUT / "cronograma-gantt.png")
save_sprints_scope(OUT / "cronograma-sprints-alcance.png")
save_risks(OUT / "cronograma-riesgos-mitigacion.png")
print("ok")
