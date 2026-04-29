param(
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
)

$ErrorActionPreference = "Stop"

$indexPath = Join-Path $Root "index.html"
$html = Get-Content $indexPath -Raw

$duplicatedIds = [regex]::Matches($html, 'id="([^"]+)"') |
    ForEach-Object { $_.Groups[1].Value } |
    Group-Object |
    Where-Object { $_.Count -gt 1 }

if ($duplicatedIds) {
    throw "IDs duplicados: $($duplicatedIds.Name -join ', ')"
}

$bannedPatterns = @(
    'name="armadura"',
    'id="vita-maniobra-movimiento"',
    'experiacia_nivel.json',
    'README.markdown'
)

foreach ($pattern in $bannedPatterns) {
    if ($html.Contains($pattern)) {
        throw "Patron obsoleto en index.html: $pattern"
    }
}

$sourceFiles = Get-ChildItem (Join-Path $Root "assets\js") -Recurse -Filter *.js
foreach ($file in $sourceFiles) {
    $source = Get-Content $file.FullName -Raw
    foreach ($pattern in $bannedPatterns) {
        if ($source.Contains($pattern)) {
            throw "Patron obsoleto en $($file.FullName): $pattern"
        }
    }
}

$readmePath = Join-Path $Root "README.md"
if (Test-Path $readmePath) {
    $readme = Get-Content $readmePath -Raw
    foreach ($pattern in $bannedPatterns) {
        if ($readme.Contains($pattern)) {
            throw "Patron obsoleto en README.md: $pattern"
        }
    }
}

Get-ChildItem (Join-Path $Root "assets\tablas") -Recurse -Filter *.json | ForEach-Object {
    Get-Content $_.FullName -Raw | ConvertFrom-Json | Out-Null
}

"Validacion estatica OK"
