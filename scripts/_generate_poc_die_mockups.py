#!/usr/bin/env python3
"""Generate all 8 navigable mockup screens for poc-die."""
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCKUPS = os.path.join(BASE, "poc-die", "assets", "mockups")
os.makedirs(MOCKUPS, exist_ok=True)

CSS = """
  <style>
    :root {
      --bg-from: #eef2f7;
      --bg-to: #dde4ee;
      --panel: rgba(255,255,255,0.98);
      --ink: #1a2035;
      --muted: #546080;
      --line: rgba(26,64,128,0.12);
      --accent: #1a4480;
      --accent-soft: #d4e1f5;
      --accent-strong: #0f2d5c;
      --success: #1a6340;
      --success-soft: #d4edde;
      --warn: #7d4e00;
      --warn-soft: #fef3c7;
      --danger: #8b1a1a;
      --danger-soft: #fde8e8;
      --neutral: #374151;
      --radius: 14px;
      --radius-sm: 8px;
      --shadow: 0 20px 60px rgba(26,64,128,0.12), 0 4px 16px rgba(26,64,128,0.07);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", "Aptos", sans-serif;
      background: linear-gradient(160deg, var(--bg-from) 0%, var(--bg-to) 100%);
      min-height: 100vh;
      color: var(--ink);
    }
    .mockup-badge {
      position: fixed; top: 1rem; right: 1rem;
      padding: 0.35rem 0.85rem;
      background: #b45309; color: #fff;
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
      border-radius: 999px; text-transform: uppercase; z-index: 200;
    }
    .topbar {
      background: var(--accent-strong);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      height: 52px;
      position: sticky; top: 0; z-index: 100;
    }
    .topbar-brand {
      font-size: 0.92rem;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .topbar-brand span { opacity: 0.6; font-weight: 400; margin-left: 0.4rem; }
    .topbar-nav { display: flex; gap: 0.2rem; }
    .topbar-nav a {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      font-size: 0.78rem;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .topbar-nav a:hover, .topbar-nav a.active { background: rgba(255,255,255,0.15); color: #fff; }
    .topbar-user { font-size: 0.78rem; opacity: 0.75; }
    .main { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--accent-strong); margin-bottom: 0.35rem; }
    .page-sub { color: var(--muted); font-size: 0.88rem; margin-bottom: 1.5rem; }
    .card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .card-title { font-size: 0.85rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
    th { background: var(--accent-soft); color: var(--accent-strong); font-weight: 700; padding: 0.65rem 0.9rem; text-align: left; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; }
    td { padding: 0.65rem 0.9rem; border-bottom: 1px solid var(--line); vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--accent-soft); }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .badge-success { background: var(--success-soft); color: var(--success); }
    .badge-pending { background: var(--warn-soft); color: var(--warn); }
    .badge-error   { background: var(--danger-soft); color: var(--danger); }
    .badge-info    { background: var(--accent-soft); color: var(--accent); }
    .badge-high    { background: var(--success-soft); color: var(--success); }
    .badge-medium  { background: var(--warn-soft); color: var(--warn); }
    .badge-low     { background: var(--danger-soft); color: var(--danger); }
    .btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.55rem 1.1rem;
      border-radius: var(--radius-sm);
      font-size: 0.83rem; font-weight: 600;
      cursor: pointer; text-decoration: none; border: none;
      transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-secondary { background: var(--accent-soft); color: var(--accent-strong); }
    .btn-danger { background: var(--danger-soft); color: var(--danger); }
    .row { display: flex; gap: 1.25rem; }
    .col-2 { flex: 1; min-width: 0; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
    .stat-card {
      background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius);
      padding: 1.1rem 1.25rem;
    }
    .stat-card .stat-val { font-size: 1.9rem; font-weight: 800; color: var(--accent-strong); }
    .stat-card .stat-lbl { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.25rem; }
    .field-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.6rem 0; border-bottom: 1px solid var(--line); gap: 1rem; }
    .field-row:last-child { border-bottom: none; }
    .field-label { font-size: 0.8rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; flex: 0 0 200px; }
    .field-value { font-size: 0.88rem; color: var(--ink); flex: 1; }
    .field-conf { flex: 0 0 auto; }
    .logprob-bar { display: flex; align-items: center; gap: 0.4rem; }
    .logprob-fill { height: 6px; border-radius: 3px; background: var(--accent); }
    .logprob-txt { font-size: 0.75rem; color: var(--muted); }
    .nav-pills { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .nav-pill {
      padding: 0.4rem 1rem; border-radius: 999px;
      font-size: 0.8rem; font-weight: 600;
      text-decoration: none; color: var(--muted);
      background: var(--panel); border: 1px solid var(--line);
    }
    .nav-pill.active { background: var(--accent); color: #fff; border-color: var(--accent); }
    .form-group { margin-bottom: 1rem; }
    .form-label { font-size: 0.8rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; display: block; margin-bottom: 0.4rem; }
    .form-input {
      width: 100%; padding: 0.55rem 0.85rem;
      border: 1px solid var(--line); border-radius: var(--radius-sm);
      font-size: 0.88rem; color: var(--ink);
      background: #f8faff;
    }
    .form-select {
      width: 100%; padding: 0.55rem 0.85rem;
      border: 1px solid var(--line); border-radius: var(--radius-sm);
      font-size: 0.88rem; color: var(--ink);
      background: #f8faff; appearance: none;
    }
    .upload-zone {
      border: 2px dashed var(--line); border-radius: var(--radius);
      padding: 2.5rem; text-align: center; color: var(--muted);
      background: #f8faff; cursor: pointer;
      transition: border-color 0.2s;
    }
    .upload-zone:hover { border-color: var(--accent); }
    .upload-zone .upload-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .alert-item {
      display: flex; align-items: flex-start; gap: 1rem;
      padding: 0.85rem 1rem; border-radius: var(--radius-sm);
      margin-bottom: 0.6rem;
    }
    .alert-blocking { background: var(--danger-soft); border-left: 3px solid var(--danger); }
    .alert-warning  { background: var(--warn-soft);   border-left: 3px solid #d97706; }
    .alert-info     { background: var(--accent-soft);  border-left: 3px solid var(--accent); }
    .alert-icon { font-size: 1.1rem; margin-top: 0.05rem; }
    .alert-content .alert-title { font-size: 0.85rem; font-weight: 700; margin-bottom: 0.25rem; }
    .alert-content .alert-detail { font-size: 0.8rem; color: var(--muted); }
    .mapping-row { display: grid; grid-template-columns: 1fr 40px 1fr 80px; gap: 0.75rem; align-items: center; margin-bottom: 0.6rem; }
    .mapping-arrow { text-align: center; color: var(--accent); font-weight: 700; }
    .mapping-select {
      padding: 0.45rem 0.65rem; border: 1px solid var(--line);
      border-radius: var(--radius-sm); font-size: 0.82rem;
      background: #f8faff; color: var(--ink);
    }
    .mapping-status { font-size: 0.72rem; font-weight: 700; text-align: center; }
    .mapping-status.mapped { color: var(--success); }
    .mapping-status.unmapped { color: var(--muted); }
    .breadcrumb { font-size: 0.8rem; color: var(--muted); margin-bottom: 1.5rem; }
    .breadcrumb a { color: var(--accent); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
  </style>
"""

NAV = """  <div class="topbar">
    <div class="topbar-brand">DIE PoC<span>— Las Galias</span></div>
    <nav class="topbar-nav">
      <a href="dashboard.html" {dashboard}>Dashboard</a>
      <a href="upload.html" {upload}>Cargar doc.</a>
      <a href="alerts.html" {alerts}>Alertas</a>
      <a href="admin-template.html" {admin}>Admin</a>
      <a href="history.html" {history}>Historial</a>
    </nav>
    <span class="topbar-user">admin · las-galias</span>
  </div>"""

def nav(active=""):
    keys = ["dashboard","upload","alerts","admin","history"]
    d = {k: ('class="active"' if k==active else '') for k in keys}
    return NAV.format(**d)

# ── LOGIN ──────────────────────────────────────────────────────────────────────
login_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIE PoC — Acceso</title>
  {CSS}
  <style>
    body {{ display: flex; align-items: center; justify-content: center; min-height: 100vh; }}
    .login-wrap {{ width: 100%; max-width: 420px; }}
    .logo-mark {{ width: 52px; height: 52px; background: var(--accent); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }}
    .logo-mark span {{ color: #fff; font-size: 1.3rem; font-weight: 900; }}
    .login-title {{ text-align: center; font-size: 1.4rem; font-weight: 800; color: var(--accent-strong); margin-bottom: 0.3rem; }}
    .login-sub {{ text-align: center; font-size: 0.83rem; color: var(--muted); margin-bottom: 1.75rem; }}
    .login-card {{ background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 2rem; }}
    .login-footer {{ text-align: center; font-size: 0.75rem; color: var(--muted); margin-top: 1.5rem; }}
  </style>
</head>
<body>
  <span class="mockup-badge">Mockup</span>
  <div class="login-wrap">
    <div class="logo-mark"><span>D</span></div>
    <div class="login-title">Document Intelligence Engine</div>
    <div class="login-sub">PoC — Las Galias · CINTEL 2026</div>
    <div class="login-card">
      <div class="form-group">
        <label class="form-label">Usuario</label>
        <input class="form-input" type="text" value="admin@las-galias.co" readonly>
      </div>
      <div class="form-group">
        <label class="form-label">Contraseña</label>
        <input class="form-input" type="password" value="••••••••" readonly>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <a href="dashboard.html" class="btn btn-primary" style="width:100%;justify-content:center;display:flex;">Ingresar al sistema</a>
      </div>
    </div>
    <div class="login-footer">Ambiente de demostración · PoC mono-tenant · Las Galias</div>
  </div>
</body>
</html>"""

# ── DASHBOARD ─────────────────────────────────────────────────────────────────
dashboard_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIE PoC — Dashboard</title>
  {CSS}
</head>
<body>
  <span class="mockup-badge">Mockup</span>
  {nav("dashboard")}
  <div class="main">
    <div class="page-title">Dashboard</div>
    <div class="page-sub">Resumen de procesamiento documental · Las Galias · Jun 2026</div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-val">47</div><div class="stat-lbl">Documentos procesados</div></div>
      <div class="stat-card"><div class="stat-val">93%</div><div class="stat-lbl">Completitud promedio</div></div>
      <div class="stat-card"><div class="stat-val">3</div><div class="stat-lbl">Alertas BLOCKING abiertas</div></div>
      <div class="stat-card"><div class="stat-val">4.1s</div><div class="stat-lbl">Latencia promedio</div></div>
    </div>
    <div class="card">
      <div class="card-title">Documentos recientes</div>
      <table>
        <tr><th>Documento</th><th>Tipo</th><th>Estado</th><th>Completitud</th><th>Alertas</th><th>Acción</th></tr>
        <tr>
          <td>ctl_50C_1234567.pdf</td><td><span class="badge badge-info">DOC_CTL</span></td>
          <td><span class="badge badge-success">DONE</span></td><td>93%</td>
          <td><span class="badge badge-error">1 BLOCKING</span></td>
          <td><a href="extraction.html" class="btn btn-secondary" style="padding:0.3rem 0.7rem;font-size:0.76rem;">Ver resultado</a></td>
        </tr>
        <tr>
          <td>ctl_50C_789012.pdf</td><td><span class="badge badge-info">DOC_CTL</span></td>
          <td><span class="badge badge-success">DONE</span></td><td>100%</td>
          <td><span class="badge badge-success">Sin alertas</span></td>
          <td><a href="extraction.html" class="btn btn-secondary" style="padding:0.3rem 0.7rem;font-size:0.76rem;">Ver resultado</a></td>
        </tr>
        <tr>
          <td>escritura_2025_003.pdf</td><td><span class="badge badge-info">DOC_ESCRITURA</span></td>
          <td><span class="badge badge-success">DONE</span></td><td>87%</td>
          <td><span class="badge badge-pending">2 WARNING</span></td>
          <td><a href="extraction.html" class="btn btn-secondary" style="padding:0.3rem 0.7rem;font-size:0.76rem;">Ver resultado</a></td>
        </tr>
        <tr>
          <td>ctl_50C_334455.pdf</td><td><span class="badge badge-info">DOC_CTL</span></td>
          <td><span class="badge badge-pending">PROCESSING</span></td><td>—</td>
          <td>—</td>
          <td><span style="font-size:0.76rem;color:var(--muted);">En proceso…</span></td>
        </tr>
      </table>
    </div>
    <div style="text-align:right">
      <a href="upload.html" class="btn btn-primary">+ Cargar nuevo documento</a>
    </div>
  </div>
</body>
</html>"""

# ── UPLOAD ────────────────────────────────────────────────────────────────────
upload_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIE PoC — Cargar documento</title>
  {CSS}
</head>
<body>
  <span class="mockup-badge">Mockup</span>
  {nav("upload")}
  <div class="main">
    <div class="breadcrumb"><a href="dashboard.html">Dashboard</a> › Cargar documento</div>
    <div class="page-title">Cargar documento</div>
    <div class="page-sub">Sube un PDF para extracción estructurada de campos</div>
    <div class="row">
      <div class="col-2">
        <div class="card">
          <div class="card-title">Documento</div>
          <div class="form-group">
            <label class="form-label">Tipo documental</label>
            <select class="form-select">
              <option selected>DOC_CTL — Certificado de Tradición y Libertad</option>
              <option>DOC_ESCRITURA — Escritura Pública</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Versión de prompt</label>
            <select class="form-select">
              <option selected>DOC_CTL_v2 (recomendada)</option>
              <option>DOC_CTL_v1</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Archivo PDF</label>
            <div class="upload-zone">
              <div class="upload-icon">📄</div>
              <div style="font-weight:600;margin-bottom:0.35rem;">Arrastra el PDF aquí</div>
              <div style="font-size:0.8rem;">o haz clic para seleccionar · Máx. 20 MB</div>
              <div style="margin-top:1rem;padding:0.4rem 0.8rem;background:var(--accent-soft);display:inline-block;border-radius:6px;font-size:0.78rem;color:var(--accent);">ctl_50C_1234567.pdf seleccionado</div>
            </div>
          </div>
          <a href="extraction.html" class="btn btn-primary" style="width:100%;justify-content:center;display:flex;margin-top:0.5rem;">
            Iniciar extracción
          </a>
        </div>
      </div>
      <div class="col-2">
        <div class="card">
          <div class="card-title">Campos que se extraerán · DOC_CTL v2</div>
          <div style="font-size:0.82rem;color:var(--muted);margin-bottom:0.75rem;">14 campos definidos en schema DOC_CTL_v1.json</div>
          <table>
            <tr><th>Campo</th><th>Tipo</th><th>Obligatorio</th></tr>
            <tr><td>matricula_inmobiliaria</td><td>string</td><td>✅</td></tr>
            <tr><td>codigo_orip</td><td>string</td><td>✅</td></tr>
            <tr><td>departamento</td><td>string</td><td>✅</td></tr>
            <tr><td>municipio</td><td>string</td><td>✅</td></tr>
            <tr><td>direccion</td><td>string</td><td>✅</td></tr>
            <tr><td>propietario_nombre</td><td>string</td><td>✅</td></tr>
            <tr><td>propietario_cedula</td><td>string</td><td>✅</td></tr>
            <tr><td>fecha_expedicion</td><td>date</td><td>✅</td></tr>
            <tr><td>vigente</td><td>boolean</td><td>✅</td></tr>
            <tr><td>gravamenes</td><td>array</td><td>—</td></tr>
            <tr><td>area_construida_m2</td><td>number</td><td>—</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</body>
</html>"""

# ── EXTRACTION RESULT ─────────────────────────────────────────────────────────
extraction_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIE PoC — Resultado de extracción</title>
  {CSS}
</head>
<body>
  <span class="mockup-badge">Mockup</span>
  {nav("")}
  <div class="main">
    <div class="breadcrumb"><a href="dashboard.html">Dashboard</a> › <a href="#">ctl_50C_1234567.pdf</a> › Resultado</div>
    <div class="page-title">Resultado de extracción</div>
    <div class="page-sub">ctl_50C_1234567.pdf · DOC_CTL · GPT-4o · prompt v2 · 3.87s · 2 560 tokens</div>
    <div class="nav-pills">
      <a href="extraction.html" class="nav-pill active">Campos extraídos</a>
      <a href="validation.html" class="nav-pill">Validación cruzada</a>
      <a href="alerts.html" class="nav-pill">Alertas (3)</a>
    </div>
    <div class="row">
      <div class="col-2">
        <div class="card">
          <div class="card-title">Campos extraídos</div>
          <div class="field-row"><span class="field-label">matricula_inmobiliaria</span><span class="field-value">50C-1234567</span><span class="field-conf"><span class="badge badge-high">HIGH 0.98</span></span></div>
          <div class="field-row"><span class="field-label">codigo_orip</span><span class="field-value">050C</span><span class="field-conf"><span class="badge badge-high">HIGH 0.97</span></span></div>
          <div class="field-row"><span class="field-label">departamento</span><span class="field-value">Cundinamarca</span><span class="field-conf"><span class="badge badge-high">HIGH 0.99</span></span></div>
          <div class="field-row"><span class="field-label">municipio</span><span class="field-value">Bogotá D.C.</span><span class="field-conf"><span class="badge badge-high">HIGH 0.99</span></span></div>
          <div class="field-row"><span class="field-label">tipo_predio</span><span class="field-value">Propiedad horizontal</span><span class="field-conf"><span class="badge badge-high">HIGH 0.94</span></span></div>
          <div class="field-row"><span class="field-label">direccion</span><span class="field-value">Cra 7 No 24-89 Apt 401</span><span class="field-conf"><span class="badge badge-medium">MEDIUM 0.82</span></span></div>
          <div class="field-row"><span class="field-label">propietario_nombre</span><span class="field-value">LAS GALIAS S.A.S.</span><span class="field-conf"><span class="badge badge-high">HIGH 0.98</span></span></div>
          <div class="field-row"><span class="field-label">propietario_cedula</span><span class="field-value">900123456-7</span><span class="field-conf"><span class="badge badge-high">HIGH 0.97</span></span></div>
          <div class="field-row"><span class="field-label">gravamenes</span><span class="field-value">Hipoteca a favor de Banco de Bogotá</span><span class="field-conf"><span class="badge badge-medium">MEDIUM 0.81</span></span></div>
          <div class="field-row"><span class="field-label">area_terreno_m2</span><span class="field-value" style="color:var(--muted);font-style:italic;">null</span><span class="field-conf"><span class="badge badge-high">HIGH 0.96</span></span></div>
          <div class="field-row"><span class="field-label">area_construida_m2</span><span class="field-value">82.5</span><span class="field-conf"><span class="badge badge-high">HIGH 0.93</span></span></div>
          <div class="field-row"><span class="field-label">fecha_expedicion</span><span class="field-value">2026-06-10</span><span class="field-conf"><span class="badge badge-high">HIGH 0.99</span></span></div>
          <div class="field-row"><span class="field-label">folios_anteriores</span><span class="field-value" style="color:var(--muted);font-style:italic;">[]</span><span class="field-conf"><span class="badge badge-high">HIGH 0.95</span></span></div>
          <div class="field-row"><span class="field-label">vigente</span><span class="field-value">true</span><span class="field-conf"><span class="badge badge-low">LOW 0.68 ⚠</span></span></div>
        </div>
      </div>
      <div class="col-2">
        <div class="card">
          <div class="card-title">Métricas de extracción</div>
          <div class="field-row"><span class="field-label">Completitud</span><span class="field-value" style="font-weight:700;font-size:1.1rem;color:var(--success);">93%</span></div>
          <div class="field-row"><span class="field-label">Campos extraídos</span><span class="field-value">13 / 14</span></div>
          <div class="field-row"><span class="field-label">Confianza mínima</span><span class="field-value">0.68 (campo: vigente)</span></div>
          <div class="field-row"><span class="field-label">Campos LOW_CONFIDENCE</span><span class="field-value" style="color:var(--danger);">vigente</span></div>
          <div class="field-row"><span class="field-label">Modelo</span><span class="field-value">gpt-4o</span></div>
          <div class="field-row"><span class="field-label">Prompt version</span><span class="field-value">DOC_CTL_v2</span></div>
          <div class="field-row"><span class="field-label">Tokens entrada</span><span class="field-value">2 140</span></div>
          <div class="field-row"><span class="field-label">Tokens salida</span><span class="field-value">420</span></div>
          <div class="field-row"><span class="field-label">Latencia total</span><span class="field-value">3 870 ms</span></div>
        </div>
        <div style="display:flex;gap:0.75rem;">
          <a href="validation.html" class="btn btn-primary" style="flex:1;justify-content:center;">Ver validación cruzada →</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>"""

# ── VALIDATION ────────────────────────────────────────────────────────────────
validation_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIE PoC — Validación cruzada</title>
  {CSS}
</head>
<body>
  <span class="mockup-badge">Mockup</span>
  {nav("")}
  <div class="main">
    <div class="breadcrumb"><a href="dashboard.html">Dashboard</a> › <a href="extraction.html">ctl_50C_1234567.pdf</a> › Validación cruzada</div>
    <div class="page-title">Validación cruzada</div>
    <div class="page-sub">Comparación campo a campo · mapeo activo: v1-jun-17 · 4 MATCH · 1 MISMATCH · 2 PENDIENTE</div>
    <div class="nav-pills">
      <a href="extraction.html" class="nav-pill">Campos extraídos</a>
      <a href="validation.html" class="nav-pill active">Validación cruzada</a>
      <a href="alerts.html" class="nav-pill">Alertas (3)</a>
    </div>
    <div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card"><div class="stat-val" style="color:var(--success)">4</div><div class="stat-lbl">MATCH</div></div>
      <div class="stat-card"><div class="stat-val" style="color:var(--danger)">1</div><div class="stat-lbl">MISMATCH</div></div>
      <div class="stat-card"><div class="stat-val" style="color:var(--warn)">2</div><div class="stat-lbl">PENDIENTE</div></div>
    </div>
    <div class="card">
      <div class="card-title">Resultado por campo</div>
      <table>
        <tr><th>Campo JSON</th><th>Columna Excel</th><th>Valor extraído</th><th>Valor referencia</th><th>Resultado</th></tr>
        <tr>
          <td>matricula_inmobiliaria</td><td>Matricula</td>
          <td>50C-1234567</td><td>50C-1234567</td>
          <td><span class="badge badge-success">MATCH</span></td>
        </tr>
        <tr>
          <td>propietario_nombre</td><td>Propietario</td>
          <td>LAS GALIAS S.A.S.</td><td>LAS GALIAS S.A.S.</td>
          <td><span class="badge badge-success">MATCH</span></td>
        </tr>
        <tr>
          <td>propietario_cedula</td><td>Cedula NIT</td>
          <td>900123456-7</td><td>900123456-7</td>
          <td><span class="badge badge-success">MATCH</span></td>
        </tr>
        <tr>
          <td>fecha_expedicion</td><td>Fecha CTL</td>
          <td>2026-06-10</td><td>2026-06-10</td>
          <td><span class="badge badge-success">MATCH</span></td>
        </tr>
        <tr style="background:var(--danger-soft)">
          <td>direccion</td><td>Direccion</td>
          <td>Cra 7 No 24-89 Apt 401</td><td>Cra. 7 #24-89 Ap. 401</td>
          <td><span class="badge badge-error">MISMATCH</span></td>
        </tr>
        <tr>
          <td>gravamenes</td><td>Gravamenes</td>
          <td>Hipoteca a favor de Banco de Bogotá</td><td>—</td>
          <td><span class="badge badge-pending">PENDIENTE</span></td>
        </tr>
        <tr>
          <td>vigente</td><td><span style="color:var(--muted);font-style:italic;">Sin mapeo</span></td>
          <td>true</td><td>—</td>
          <td><span class="badge badge-pending">PENDIENTE</span></td>
        </tr>
      </table>
    </div>
    <div style="text-align:right">
      <a href="alerts.html" class="btn btn-primary">Ver alertas generadas →</a>
    </div>
  </div>
</body>
</html>"""

# ── ALERTS ────────────────────────────────────────────────────────────────────
alerts_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIE PoC — Alertas</title>
  {CSS}
</head>
<body>
  <span class="mockup-badge">Mockup</span>
  {nav("alerts")}
  <div class="main">
    <div class="breadcrumb"><a href="dashboard.html">Dashboard</a> › <a href="extraction.html">ctl_50C_1234567.pdf</a> › Alertas</div>
    <div class="page-title">Alertas de discrepancia</div>
    <div class="page-sub">3 alertas generadas · 1 BLOCKING · 1 WARNING · 1 INFO</div>
    <div class="nav-pills">
      <a href="extraction.html" class="nav-pill">Campos extraídos</a>
      <a href="validation.html" class="nav-pill">Validación cruzada</a>
      <a href="alerts.html" class="nav-pill active">Alertas (3)</a>
    </div>
    <div class="card">
      <div class="card-title">Alertas activas</div>
      <div class="alert-item alert-blocking">
        <div class="alert-icon">🚫</div>
        <div class="alert-content">
          <div class="alert-title">BLOCKING · campo: direccion</div>
          <div class="alert-detail">
            Extraído: "Cra 7 No 24-89 Apt 401" · Referencia: "Cra. 7 #24-89 Ap. 401"<br>
            La dirección no coincide con el registro de referencia. Requiere revisión manual antes de continuar.
          </div>
          <div style="margin-top:0.5rem;display:flex;gap:0.5rem;">
            <span class="badge badge-error">OPEN</span>
            <span style="font-size:0.75rem;color:var(--muted);">Creada Jun 18, 2026 10:31</span>
          </div>
        </div>
      </div>
      <div class="alert-item alert-warning">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <div class="alert-title">WARNING · campo: gravamenes</div>
          <div class="alert-detail">
            Extraído: "Hipoteca a favor de Banco de Bogotá" · Referencia: sin valor de comparación (PENDIENTE)<br>
            Campo no tiene referencia en el Excel. No es posible validar. Revisar mapeo en módulo admin.
          </div>
          <div style="margin-top:0.5rem;display:flex;gap:0.5rem;">
            <span class="badge badge-pending">OPEN</span>
            <span style="font-size:0.75rem;color:var(--muted);">Creada Jun 18, 2026 10:31</span>
          </div>
        </div>
      </div>
      <div class="alert-item alert-info">
        <div class="alert-icon">ℹ️</div>
        <div class="alert-content">
          <div class="alert-title">INFO · campo: vigente (LOW_CONFIDENCE)</div>
          <div class="alert-detail">
            Valor extraído: true · Confianza: LOW (logprob=0.68, umbral=0.85)<br>
            El modelo no está seguro de este campo. Sin referencia para validar. Revisar manualmente.
          </div>
          <div style="margin-top:0.5rem;display:flex;gap:0.5rem;">
            <span class="badge badge-info">OPEN</span>
            <span style="font-size:0.75rem;color:var(--muted);">Creada Jun 18, 2026 10:31</span>
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:0.75rem;justify-content:flex-end">
      <a href="admin-template.html" class="btn btn-secondary">Configurar mapeo en módulo admin</a>
      <a href="dashboard.html" class="btn btn-primary">Volver al Dashboard</a>
    </div>
  </div>
</body>
</html>"""

# ── ADMIN TEMPLATE ────────────────────────────────────────────────────────────
admin_template_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIE PoC — Módulo Admin — Template de referencia</title>
  {CSS}
</head>
<body>
  <span class="mockup-badge">Mockup</span>
  {nav("admin")}
  <div class="main">
    <div class="page-title">Módulo administrativo — Template de referencia</div>
    <div class="page-sub">Carga tu Excel con registros de referencia y mapea cada columna al campo del extractor</div>
    <div class="nav-pills">
      <a href="admin-template.html" class="nav-pill active">Template · DOC_CTL</a>
      <a href="#" class="nav-pill">Template · DOC_ESCRITURA</a>
    </div>
    <div class="row">
      <div class="col-2">
        <div class="card">
          <div class="card-title">1. Archivo de referencia cargado</div>
          <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;background:var(--success-soft);border-radius:var(--radius-sm);margin-bottom:1rem;">
            <span style="font-size:1.5rem;">📊</span>
            <div>
              <div style="font-weight:700;font-size:0.88rem;">registros_ctl_referencia.xlsx</div>
              <div style="font-size:0.78rem;color:var(--muted);">47 filas · 7 columnas · Cargado Jun 17, 2026</div>
            </div>
            <span class="badge badge-success" style="margin-left:auto;">Activo</span>
          </div>
          <div style="font-size:0.8rem;color:var(--muted);margin-bottom:0.5rem;text-transform:uppercase;font-weight:600;letter-spacing:0.04em;">Columnas detectadas en Excel</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem;">
            <span class="badge badge-info">Matricula</span>
            <span class="badge badge-info">Propietario</span>
            <span class="badge badge-info">Cedula NIT</span>
            <span class="badge badge-info">Fecha CTL</span>
            <span class="badge badge-info">Direccion</span>
            <span class="badge badge-info">Gravamenes</span>
            <span class="badge badge-info">Area m2</span>
          </div>
          <a href="#" class="btn btn-secondary" style="font-size:0.78rem;">Reemplazar archivo</a>
        </div>
        <div class="card">
          <div class="card-title">3. Estado del mapeo activo</div>
          <div class="field-row"><span class="field-label">Versión de mapeo</span><span class="field-value">v1-jun-17</span></div>
          <div class="field-row"><span class="field-label">Campos mapeados</span><span class="field-value" style="color:var(--success);font-weight:700;">7 / 14</span></div>
          <div class="field-row"><span class="field-label">Sin referencia</span><span class="field-value" style="color:var(--muted);">tipo_predio, codigo_orip, departamento, municipio, folios_anteriores, vigente, area_terreno_m2</span></div>
          <div class="field-row"><span class="field-label">Activo desde</span><span class="field-value">Jun 17, 2026 14:23</span></div>
          <div style="margin-top:1rem;">
            <a href="validation.html" class="btn btn-primary">Ver validación con este mapeo</a>
          </div>
        </div>
      </div>
      <div class="col-2">
        <div class="card">
          <div class="card-title">2. Mapeo columna Excel ↔ campo JSON</div>
          <div style="font-size:0.78rem;color:var(--muted);margin-bottom:1rem;">Asigna cada columna de tu Excel al campo correspondiente del extractor</div>
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--muted);display:grid;grid-template-columns:1fr 40px 1fr 80px;gap:0.75rem;margin-bottom:0.5rem;">
            <span>Columna Excel</span><span></span><span>Campo JSON (extractor)</span><span>Estado</span>
          </div>
          <div class="mapping-row">
            <select class="mapping-select"><option>Matricula</option></select>
            <div class="mapping-arrow">→</div>
            <select class="mapping-select"><option>matricula_inmobiliaria</option></select>
            <div class="mapping-status mapped">✅ Mapeado</div>
          </div>
          <div class="mapping-row">
            <select class="mapping-select"><option>Propietario</option></select>
            <div class="mapping-arrow">→</div>
            <select class="mapping-select"><option>propietario_nombre</option></select>
            <div class="mapping-status mapped">✅ Mapeado</div>
          </div>
          <div class="mapping-row">
            <select class="mapping-select"><option>Cedula NIT</option></select>
            <div class="mapping-arrow">→</div>
            <select class="mapping-select"><option>propietario_cedula</option></select>
            <div class="mapping-status mapped">✅ Mapeado</div>
          </div>
          <div class="mapping-row">
            <select class="mapping-select"><option>Fecha CTL</option></select>
            <div class="mapping-arrow">→</div>
            <select class="mapping-select"><option>fecha_expedicion</option></select>
            <div class="mapping-status mapped">✅ Mapeado</div>
          </div>
          <div class="mapping-row">
            <select class="mapping-select"><option>Direccion</option></select>
            <div class="mapping-arrow">→</div>
            <select class="mapping-select"><option>direccion</option></select>
            <div class="mapping-status mapped">✅ Mapeado</div>
          </div>
          <div class="mapping-row">
            <select class="mapping-select"><option>Gravamenes</option></select>
            <div class="mapping-arrow">→</div>
            <select class="mapping-select"><option>gravamenes</option></select>
            <div class="mapping-status mapped">✅ Mapeado</div>
          </div>
          <div class="mapping-row">
            <select class="mapping-select"><option>Area m2</option></select>
            <div class="mapping-arrow">→</div>
            <select class="mapping-select"><option>area_construida_m2</option></select>
            <div class="mapping-status mapped">✅ Mapeado</div>
          </div>
          <div style="margin-top:1rem;display:flex;gap:0.75rem;justify-content:flex-end;">
            <span class="btn btn-secondary">Agregar fila</span>
            <span class="btn btn-primary">Guardar mapeo</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>"""

# ── HISTORY ───────────────────────────────────────────────────────────────────
history_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIE PoC — Historial</title>
  {CSS}
</head>
<body>
  <span class="mockup-badge">Mockup</span>
  {nav("history")}
  <div class="main">
    <div class="page-title">Historial de ejecuciones</div>
    <div class="page-sub">Trazabilidad completa de extracciones · tenant: las-galias</div>
    <div class="card">
      <div class="card-title">Ejecuciones recientes</div>
      <table>
        <tr><th>Fecha</th><th>Documento</th><th>Tipo</th><th>Modelo</th><th>Prompt</th><th>Completitud</th><th>Alertas</th><th>Tokens</th><th>Latencia</th><th></th></tr>
        <tr>
          <td style="white-space:nowrap">Jun 18 10:31</td><td>ctl_50C_1234567.pdf</td><td><span class="badge badge-info">DOC_CTL</span></td>
          <td>gpt-4o</td><td>CTL_v2</td>
          <td><span style="color:var(--success);font-weight:700;">93%</span></td>
          <td><span class="badge badge-error">1B 1W 1I</span></td>
          <td>2 560</td><td>3 870ms</td>
          <td><a href="extraction.html" class="btn btn-secondary" style="padding:0.25rem 0.6rem;font-size:0.72rem;">Ver</a></td>
        </tr>
        <tr>
          <td style="white-space:nowrap">Jun 18 09:14</td><td>ctl_50C_789012.pdf</td><td><span class="badge badge-info">DOC_CTL</span></td>
          <td>gpt-4o</td><td>CTL_v2</td>
          <td><span style="color:var(--success);font-weight:700;">100%</span></td>
          <td><span class="badge badge-success">Sin alertas</span></td>
          <td>2 410</td><td>4 120ms</td>
          <td><a href="extraction.html" class="btn btn-secondary" style="padding:0.25rem 0.6rem;font-size:0.72rem;">Ver</a></td>
        </tr>
        <tr>
          <td style="white-space:nowrap">Jun 17 16:43</td><td>escritura_2025_003.pdf</td><td><span class="badge badge-info">DOC_ESCRITURA</span></td>
          <td>gpt-4o</td><td>ESC_v1</td>
          <td><span style="color:var(--warn);font-weight:700;">87%</span></td>
          <td><span class="badge badge-pending">2 WARNING</span></td>
          <td>3 100</td><td>5 240ms</td>
          <td><a href="extraction.html" class="btn btn-secondary" style="padding:0.25rem 0.6rem;font-size:0.72rem;">Ver</a></td>
        </tr>
        <tr>
          <td style="white-space:nowrap">Jun 17 15:22</td><td>ctl_50C_334455.pdf</td><td><span class="badge badge-info">DOC_CTL</span></td>
          <td>gpt-4o</td><td>CTL_v1</td>
          <td><span style="color:var(--success);font-weight:700;">93%</span></td>
          <td><span class="badge badge-info">1 INFO</span></td>
          <td>2 490</td><td>4 070ms</td>
          <td><a href="extraction.html" class="btn btn-secondary" style="padding:0.25rem 0.6rem;font-size:0.72rem;">Ver</a></td>
        </tr>
        <tr>
          <td style="white-space:nowrap">Jun 16 11:05</td><td>ctl_50C_901234.pdf</td><td><span class="badge badge-info">DOC_CTL</span></td>
          <td>gpt-4o</td><td>CTL_v1</td>
          <td><span style="color:var(--success);font-weight:700;">87%</span></td>
          <td><span class="badge badge-success">Sin alertas</span></td>
          <td>2 230</td><td>3 650ms</td>
          <td><a href="extraction.html" class="btn btn-secondary" style="padding:0.25rem 0.6rem;font-size:0.72rem;">Ver</a></td>
        </tr>
      </table>
    </div>
    <div style="display:flex;gap:0.75rem;justify-content:flex-end">
      <span class="btn btn-secondary">⬇ Exportar historial CSV</span>
      <a href="dashboard.html" class="btn btn-primary">Volver al Dashboard</a>
    </div>
  </div>
</body>
</html>"""

# Write all files
files = {
    "login.html": login_html,
    "dashboard.html": dashboard_html,
    "upload.html": upload_html,
    "extraction.html": extraction_html,
    "validation.html": validation_html,
    "alerts.html": alerts_html,
    "admin-template.html": admin_template_html,
    "history.html": history_html,
}

for name, content in files.items():
    path = os.path.join(MOCKUPS, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Written: {name}")

print("\nAll 8 mockup screens generated.")
