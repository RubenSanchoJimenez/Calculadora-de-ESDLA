param(
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
)

$ErrorActionPreference = "Stop"

function Assert-Equal {
    param(
        [object]$Actual,
        [object]$Expected,
        [string]$Message
    )

    if ($Actual -ne $Expected) {
        throw "$Message. Esperado: '$Expected'. Obtenido: '$Actual'"
    }
}

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Read-Json {
    param([string]$RelativePath)

    Get-Content (Join-Path $Root $RelativePath) -Raw | ConvertFrom-Json
}

function Find-RangeRow {
    param(
        [array]$Rows,
        [int]$Total
    )

    $row = $Rows | Where-Object { $Total -ge $_.min -and $Total -le $_.max } | Select-Object -First 1
    if ($row) {
        return $row
    }

    if ($Total -lt $Rows[0].min) {
        return $Rows[0]
    }

    return $Rows[$Rows.Count - 1]
}

function Calculate-SpellDistanceModifier {
    param([int]$Distance)

    if ($Distance -le 0) { return 30 }
    if ($Distance -le 3) { return 10 }
    if ($Distance -le 15) { return 0 }
    if ($Distance -le 30) { return -10 }
    if ($Distance -le 100) { return -20 }
    return -30
}

function Calculate-DirectedSpellDistanceModifier {
    param([int]$Distance)

    if ($Distance -le 3) { return 35 }
    if ($Distance -le 15) { return 0 }
    if ($Distance -le 30) { return -25 }
    if ($Distance -le 60) { return -40 }
    if ($Distance -le 100) { return -55 }
    return -75
}

function Calculate-PreparationModifier {
    param([int]$Rounds)

    if ($Rounds -ge 4) { return 20 }
    if ($Rounds -eq 3) { return 10 }
    if ($Rounds -eq 2) { return 0 }
    if ($Rounds -eq 1) { return -15 }
    return -30
}

$attackFilo = Read-Json "assets\tablas\ataque\ataque_filo.json"
$attackRow = Find-RangeRow $attackFilo 100
Assert-Equal $attackRow.sin_armadura "13C" "Ataque filo total 100 contra sin armadura"
Assert-Equal $attackRow.coraza 6 "Ataque filo total 100 contra coraza"

$mmTable = Read-Json "assets\tablas\maniobra_movimiento\mm_tirada.json"
$mmRow = Find-RangeRow $mmTable -151
Assert-Equal $mmRow.media "F" "MM total -151 en dificultad media"
$mmSuccessRow = Find-RangeRow $mmTable 76
Assert-Equal $mmSuccessRow.rutinaria 100 "MM total 76 en dificultad rutinaria"

$meTable = Read-Json "assets\tablas\maniobra_estatica\me_tirada.json"
$meFailureRow = Find-RangeRow $meTable 50
Assert-True ($meFailureRow.general -like "Fracaso:*") "ME total 50 debe estar en tramo de fracaso"
$meSuccessRow = Find-RangeRow $meTable 111
Assert-True ($meSuccessRow.general -like "*xito*") "ME total 111 debe estar en tramo de exito"

$resistance = Read-Json "assets\tablas\resistencia\resistencia.json"
$levelFiveTarget = $resistance | Where-Object { $_.nivel_blanco -eq 5 } | Select-Object -First 1
Assert-Equal $levelFiveTarget.nivel_atacante."5" 50 "TR nivel atacante 5 contra blanco 5"
Assert-Equal $levelFiveTarget.nivel_atacante."10" 65 "TR nivel atacante 10 contra blanco 5"

Assert-Equal (Calculate-SpellDistanceModifier 0) 30 "Hechizo basico distancia 0"
Assert-Equal (Calculate-SpellDistanceModifier 31) -20 "Hechizo basico distancia 31"
Assert-Equal (Calculate-DirectedSpellDistanceModifier 30) -25 "Hechizo dirigido distancia 30"
Assert-Equal (Calculate-PreparationModifier 4) 20 "Preparacion 4 asaltos"
Assert-Equal (Calculate-PreparationModifier 0) -30 "Preparacion 0 asaltos"

"Tests funcionales de calculo OK"
