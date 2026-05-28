$roots = @(
  "RAG/assets/plantuml",
  "agent/assets/plantuml"
)

foreach ($root in $roots) {
  if (-not (Test-Path $root)) {
    continue
  }

  Get-ChildItem -Path $root -Recurse -Filter *.puml | ForEach-Object {
    $target = [System.IO.Path]::ChangeExtension($_.FullName, ".plantuml")
    Copy-Item -LiteralPath $_.FullName -Destination $target -Force
  }
}

Write-Output "done"
