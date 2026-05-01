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

$bootstrapCdnTags = [regex]::Matches($html, '<(?:link|script)[^>]+bootstrap@[^>]+>')
foreach ($tag in $bootstrapCdnTags) {
    if (-not $tag.Value.Contains('integrity=')) {
        throw "Referencia Bootstrap CDN sin SRI: $($tag.Value)"
    }

    if (-not $tag.Value.Contains('crossorigin="anonymous"')) {
        throw "Referencia Bootstrap CDN sin crossorigin anonymous: $($tag.Value)"
    }
}

$sourceFiles = Get-ChildItem (Join-Path $Root "assets\js") -Recurse -Filter *.js
$jsonFiles = Get-ChildItem (Join-Path $Root "assets\tablas") -Recurse -Filter *.json
$jsonFilesByName = @{}
foreach ($jsonFile in $jsonFiles) {
    if (-not $jsonFilesByName.ContainsKey($jsonFile.Name)) {
        $jsonFilesByName[$jsonFile.Name] = @()
    }

    $jsonFilesByName[$jsonFile.Name] += $jsonFile.FullName
}

foreach ($file in $sourceFiles) {
    $source = Get-Content $file.FullName -Raw
    foreach ($pattern in $bannedPatterns) {
        if ($source.Contains($pattern)) {
            throw "Patron obsoleto en $($file.FullName): $pattern"
        }
    }

    $jsonMatches = [regex]::Matches($source, '["''`]([^"''`]+\.json)["''`]')
    foreach ($match in $jsonMatches) {
        $jsonRef = $match.Groups[1].Value

        if ($jsonRef -match '[\\/]' -and $jsonRef -notmatch '\$\{') {
            $resolvedPath = [System.IO.Path]::GetFullPath((Join-Path $file.DirectoryName $jsonRef))
            if (-not (Test-Path $resolvedPath)) {
                throw "Ruta JSON inexistente en $($file.FullName): $jsonRef"
            }

            continue
        }

        $jsonName = [System.IO.Path]::GetFileName($jsonRef)
        if (-not $jsonFilesByName.ContainsKey($jsonName)) {
            throw "JSON referenciado por JS no encontrado en assets\tablas: $jsonName ($($file.FullName))"
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

$jsonFiles | ForEach-Object {
    Get-Content $_.FullName -Raw | ConvertFrom-Json | Out-Null
}

"Validacion estatica OK"
