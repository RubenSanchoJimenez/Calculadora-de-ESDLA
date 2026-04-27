export const hechizo = {
    init() {
        registrarBotonLimpiarHechizos();
    }
};

const botonLimpiarHechizos = document.getElementById("btn_limpiar_hechizos");
const hechizoDadosLanzador = document.getElementById("hechizo_dados_lanzador");
const hechizoDadosObjetivo = document.getElementById("hechizo_dados_objetivo");
const hechizoNivelLanzador = document.getElementById("hechizo_nivel_lanzador");
const hechizoNivelReceptor = document.getElementById("hechizo_nivel_receptor");
const hechizoNivelHechizo = document.getElementById("hechizo_nivel_hechizo");
const boHechizoBasico = document.getElementById("bo_hechizo_basico");
const hechizoBonificacionResistencia = document.getElementById("hechizo_bonificacion_resistencia");
const hechizoBonificadorPositivo = document.getElementById("hechizo_bonificador_positivo");
const hechizoBonificadorNegativo = document.getElementById("hechizo_bonificador_negativo");
const hechizoAsaltosPreparacion = document.getElementById("hechizo_asaltos_preparacion");
const hechizoDistancia = document.getElementById("hechizo_distancia");

function registrarBotonLimpiarHechizos() {
    if (!botonLimpiarHechizos) {
        return;
    }

    botonLimpiarHechizos.addEventListener("click", () => {
        limpiarInputsHechizo();
    });
}

function limpiarInputsHechizo() {
    hechizoDadosLanzador.value = "";
    hechizoDadosObjetivo.value = "";
    hechizoNivelLanzador.value = "";
    hechizoNivelReceptor.value = "";
    hechizoNivelHechizo.value = "";
    boHechizoBasico.value = "";
    hechizoBonificacionResistencia.value = "";
    hechizoBonificadorPositivo.value = "";
    hechizoBonificadorNegativo.value = "";
    hechizoAsaltosPreparacion.value = "";
    hechizoDistancia.value = "";
}
