import { buscarFilaPorRango, obtenerTiradaConsulta } from "./tablas.js";

export const maximosPorTamanio = {
    ataque_garra: {
        ataque_diminuto: 85,
        ataque_pequeno: 105,
        ataque_mediano: 120,
        ataque_grande: 135,
        ataque_enorme: 150
    },
    ataque_agarre: {
        ataque_diminuto: 85,
        ataque_pequeno: 105,
        ataque_mediano: 120,
        ataque_grande: 135,
        ataque_enorme: 150
    }
};

export function calcularTotalAtaque({ dados, bonificadorPositivo, bonificadorNegativo, bonificadoresSituacionales }) {
    return dados + bonificadorPositivo - bonificadorNegativo + bonificadoresSituacionales;
}

export function aplicarMaximoPorTamanio(seleccion) {
    if (!seleccion.requiereTamanio || !seleccion.tamanio) {
        return seleccion.total;
    }

    const maximo = maximosPorTamanio[seleccion.tipoAtaque]?.[seleccion.tamanio];
    return typeof maximo === "number" ? Math.min(seleccion.total, maximo) : seleccion.total;
}

export function calcularResultadoAtaque(tabla, seleccion) {
    const totalModificado = aplicarMaximoPorTamanio(seleccion);
    const totalConsulta = obtenerTiradaConsulta(tabla, seleccion.dados, totalModificado);
    const tramo = buscarFilaPorRango(tabla, totalConsulta);
    const resultado = tramo?.[seleccion.armadura];

    return {
        totalConsulta,
        resultado,
        tramo
    };
}
