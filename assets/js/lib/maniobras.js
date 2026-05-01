import { buscarFilaPorRango } from "./tablas.js";

export function calcularTotalMm({ dados, bonus, otros, modificadoresEstado }) {
    return dados + bonus + otros + modificadoresEstado;
}

export function formatearResultadoMm(resultado) {
    return typeof resultado === "number" ? `${resultado}/100` : resultado;
}

export function calcularTotalMe({ dados, bonificador, modificadores, nivelHechizo, modificadorDificultad }) {
    return dados + bonificador + modificadores - nivelHechizo + modificadorDificultad;
}

export { buscarFilaPorRango };
