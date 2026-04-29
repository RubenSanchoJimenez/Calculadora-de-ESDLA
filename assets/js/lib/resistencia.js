export function calcularUmbralResistenciaTabla(tabla, nivelAtacante, nivelBlanco) {
    const nivelAtacanteAjustado = ajustarNivel(nivelAtacante, 1, 15);
    const nivelBlancoAjustado = ajustarNivel(nivelBlanco, 0, 15);
    const ajusteNivelAtacante = calcularExcesoNivel(nivelAtacante);
    const ajusteNivelBlanco = calcularExcesoNivel(nivelBlanco);
    const fila = tabla.find((item) => item.nivel_blanco === nivelBlancoAjustado);

    if (!fila) {
        throw new Error("No se encontro la fila de resistencia.");
    }

    const umbralBase = fila.nivel_atacante[String(nivelAtacanteAjustado)];
    if (!Number.isFinite(umbralBase)) {
        throw new Error("No se encontro el umbral de resistencia.");
    }

    return umbralBase + ajusteNivelAtacante - ajusteNivelBlanco;
}

export function ajustarNivel(valor, minimo, maximo) {
    if (!Number.isFinite(valor)) {
        return Number.NaN;
    }

    return Math.min(Math.max(Math.trunc(valor), minimo), maximo);
}

export function calcularExcesoNivel(valor) {
    if (!Number.isFinite(valor)) {
        return 0;
    }

    return Math.max(Math.trunc(valor) - 15, 0);
}
