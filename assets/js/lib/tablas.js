export function buscarFilaPorRango(tabla, total) {
    if (!Array.isArray(tabla) || tabla.length === 0) {
        return null;
    }

    const fila = tabla.find((item) => total >= item.min && total <= item.max);
    if (fila) {
        return fila;
    }

    if (total < tabla[0].min) {
        return tabla[0];
    }

    return tabla[tabla.length - 1];
}

export function obtenerTiradaConsulta(tabla, dadosNaturales, tiradaModificada) {
    const tramoSinModificador = tabla.find(
        (fila) => fila.sin_Modificador === 1 && dadosNaturales >= fila.min && dadosNaturales <= fila.max
    );

    return tramoSinModificador ? dadosNaturales : tiradaModificada;
}
