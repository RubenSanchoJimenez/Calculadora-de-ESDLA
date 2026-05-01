import { buscarFilaPorRango } from "../lib/tablas.js";
import { describirRango, validarEnteroEnRango } from "../lib/validacion.js";

export const critico = {
    init() {
        registrarVisibilidadTipoGc();
        registrarBotonLimpiarCritico();
        registrarBotonCalcularCritico();
    }
};

const btnLimpiarCritico = document.getElementById("btn_limpiar_critico");
const btnCalcularCritico = document.getElementById("critico_calcular");
const criticoDados = document.getElementById("critico_dados");
const criticoTextoResultado = document.getElementById("critico_texto_resultado");
const criticoFisicoGc = document.getElementById("critico_fisico_gc");
const criticoMagicoGc = document.getElementById("critico_magico_gc");
const criticoTipoGc = document.getElementById("critico_tipo_gc");
const radiosCriticoTipo = document.querySelectorAll('input[name="critico_tipo"]');
const radiosCriticoLetra = document.querySelectorAll('input[name="critico_letra"]');
const radiosCriticoGc = document.querySelectorAll('input[name="critico_gc"]');

const tablasCritico = {
    critico_tirada: null,
    critico_modificaciones: null
};

const tablasTipo = {
    critico_aplastamiento: "CT1_aplastamiento",
    critico_tajo: "CT2_tajo",
    critico_perforante: "CT3_perforacion",
    critico_desequilibrante: "CT4_desequilibrio",
    critico_presa: "CT5_presa",
    critico_calor: "CT6_calor",
    critico_frio: "CT7_frio",
    critico_electrico: "CT8_electricidad",
    critico_impacto: "CT9_impacto",
    critico_fisico_gc: "CT10_grandes_fisico",
    critico_magico_gc: "CT11_grandes_hechizos"
};

const columnasLetra = {
    critico_tipo_t: "Critico_T",
    critico_tipo_a: "Critico_A",
    critico_tipo_b: "Critico_B",
    critico_tipo_c: "Critico_C",
    critico_tipo_d: "Critico_D",
    critico_tipo_e: "Critico_E"
};

const columnasGc = {
    critico_tipo_gc_normal: "arma_normal_o_garras_dientes",
    critico_tipo_gc_magica: "arma_magica",
    critico_tipo_gc_mithril: "arma_mithril",
    critico_tipo_gc_sagrada: "arma_sagrada",
    critico_tipo_gc_exterminadora: "arma_exterminadora"
};

function registrarVisibilidadTipoGc() {
    if (!criticoTipoGc || radiosCriticoTipo.length === 0) {
        return;
    }

    radiosCriticoTipo.forEach((radio) => {
        radio.addEventListener("change", actualizarVisibilidadTipoGc);
    });

    actualizarVisibilidadTipoGc();
}

function actualizarVisibilidadTipoGc() {
    const mostrar = Boolean(criticoFisicoGc?.checked || criticoMagicoGc?.checked);
    criticoTipoGc?.classList.toggle("d-none", !mostrar);

    if (!mostrar) {
        radiosCriticoGc.forEach((radio) => {
            radio.checked = false;
        });
    }
}

function registrarBotonLimpiarCritico() {
    if (!btnLimpiarCritico) {
        return;
    }

    btnLimpiarCritico.addEventListener("click", () => {
        limpiarCamposCritico();
    });
}

function registrarBotonCalcularCritico() {
    if (!btnCalcularCritico) {
        return;
    }

    btnCalcularCritico.addEventListener("click", async () => {
        try {
            const dados = leerNumeroObligatorio(criticoDados);
            const tipo = obtenerRadioMarcado('input[name="critico_tipo"]');
            const letra = obtenerRadioMarcado('input[name="critico_letra"]');
            const subtipoGc = obtenerRadioMarcado('input[name="critico_gc"]');

            if (!Number.isFinite(dados)) {
                mostrarResultadoCritico("Introduce una tirada de dados válida.");
                return;
            }

            const errorDados = validarEnteroEnRango(dados, 1, 100);
            if (errorDados) {
                mostrarResultadoCritico(`La tirada de dados debe ser un ${describirRango(errorDados)}.`);
                return;
            }

            if (!tipo) {
                mostrarResultadoCritico("Selecciona un tipo de crítico.");
                return;
            }

            const tablaTipo = tablasTipo[tipo.id];
            if (!tablaTipo) {
                mostrarResultadoCritico("No se reconoció el tipo de crítico.");
                return;
            }

            const modificaciones = await cargarTablaCritico(
                "critico_modificaciones",
                "../../tablas/critico/critico_modificaciones.json"
            );
            const filaModificador = modificaciones.find((fila) => fila.Tabla === tablaTipo);

            if (!filaModificador) {
                mostrarResultadoCritico("No se encontró la tabla de modificaciones del crítico.");
                return;
            }

            let modificador = 0;

            if (tipo.id === "critico_fisico_gc" || tipo.id === "critico_magico_gc") {
                if (!subtipoGc) {
                    mostrarResultadoCritico("Selecciona el subtipo de arma GC.");
                    return;
                }

                const columnaGc = columnasGc[subtipoGc.id];
                modificador = Number(filaModificador[columnaGc]);
            } else {
                if (!letra) {
                    mostrarResultadoCritico("Selecciona la letra del crítico.");
                    return;
                }

                const columnaLetra = columnasLetra[letra.id];
                modificador = Number(filaModificador[columnaLetra]);
            }

            if (!Number.isFinite(modificador)) {
                mostrarResultadoCritico("No se pudo obtener el modificador del crítico.");
                return;
            }

            const total = dados + modificador;
            const tablaTirada = await cargarTablaCritico(
                "critico_tirada",
                "../../tablas/critico/critico_tirada.json"
            );
            const filaResultado = buscarFilaPorRango(tablaTirada, total);
            const resultado = filaResultado?.[tablaTipo];

            if (!resultado) {
                mostrarResultadoCritico("No se encontró el resultado del crítico.");
                return;
            }

            mostrarResultadoCritico(`Total ${total}: ${resultado}`);
        } catch (error) {
            console.error(error);
            mostrarResultadoCritico("No se pudo calcular el crítico.");
        }
    });
}

function limpiarCamposCritico() {
    criticoDados.value = "";

    radiosCriticoTipo.forEach((radio) => {
        radio.checked = false;
    });

    radiosCriticoLetra.forEach((radio) => {
        radio.checked = false;
    });

    radiosCriticoGc.forEach((radio) => {
        radio.checked = false;
    });

    actualizarVisibilidadTipoGc();
    ocultarResultadoCritico();
}

function leerNumeroObligatorio(input) {
    const valor = input?.value?.trim() ?? "";
    return valor === "" ? Number.NaN : Number(valor);
}

function obtenerRadioMarcado(selector) {
    return document.querySelector(`${selector}:checked`);
}

async function cargarTablaCritico(clave, rutaRelativa) {
    if (!tablasCritico[clave]) {
        const rutaTabla = new URL(rutaRelativa, import.meta.url);

        tablasCritico[clave] = fetch(rutaTabla).then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar la tabla ${clave}.`);
            }

            return respuesta.json();
        });
    }

    return tablasCritico[clave];
}

function mostrarResultadoCritico(texto) {
    if (!criticoTextoResultado) {
        return;
    }

    criticoTextoResultado.textContent = texto;
    criticoTextoResultado.classList.remove("d-none");
}

function ocultarResultadoCritico() {
    if (!criticoTextoResultado) {
        return;
    }

    criticoTextoResultado.textContent = "";
    criticoTextoResultado.classList.add("d-none");
}
