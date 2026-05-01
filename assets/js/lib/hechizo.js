export function calcularModificadorDistancia(distancia) {
    if (distancia <= 0) {
        return 30;
    }

    if (distancia <= 3) {
        return 10;
    }

    if (distancia <= 15) {
        return 0;
    }

    if (distancia <= 30) {
        return -10;
    }

    if (distancia <= 100) {
        return -20;
    }

    return -30;
}

export function calcularModificadorDistanciaDirigido(distancia) {
    if (distancia <= 3) {
        return 35;
    }

    if (distancia <= 15) {
        return 0;
    }

    if (distancia <= 30) {
        return -25;
    }

    if (distancia <= 60) {
        return -40;
    }

    if (distancia <= 100) {
        return -55;
    }

    return -75;
}

export function calcularModificadorPreparacion(asaltos) {
    if (asaltos >= 4) {
        return 20;
    }

    if (asaltos === 3) {
        return 10;
    }

    if (asaltos === 2) {
        return 0;
    }

    if (asaltos === 1) {
        return -15;
    }

    return -30;
}

export function calcularTiradaTablaHechizo(dadosNaturales, tiradaModificada) {
    if (dadosNaturales === 100) {
        return 100;
    }

    if (dadosNaturales >= 97 && dadosNaturales <= 99) {
        return dadosNaturales;
    }

    return Math.min(tiradaModificada, 96);
}
