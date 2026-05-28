$roots = @(
  "RAG/content",
  "agent/content"
)

foreach ($root in $roots) {
  if (-not (Test-Path $root)) {
    continue
  }

  Get-ChildItem -Path $root -Recurse -Filter *.md | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content -LiteralPath $path -Raw
    $updated = $content -replace "\.puml", ".plantuml"
    if ($updated -ne $content) {
      Set-Content -LiteralPath $path -Value $updated -Encoding UTF8
    }
  }
}

Write-Output "done"
