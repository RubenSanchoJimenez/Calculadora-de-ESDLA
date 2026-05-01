import { buscarFilaPorRango } from "../lib/tablas.js";
import { describirRango, validarEnteroEnRango } from "../lib/validacion.js";

export const pifia = {
    init() {
        registrarVisibilidadSeleccionPifia();
        registrarBotonLimpiarPifia();
        registrarBotonCalcularPifia();
        actualizarVisibilidadSeleccionPifia();
    }
};

const vistaPifia = document.getElementById("vista-pifia");
const btnLimpiarPifia = document.getElementById("btn_limpiar_pifia");
const btnCalcularPifia = document.getElementById("pifia_calcular");
const pifiaDados = document.getElementById("pifia_dados");
const pifiaTextoResultado = document.getElementById("pifia_texto_resultado");
const radiosTipoAccionPifia = vistaPifia?.querySelectorAll('input[name="tipo_accion_pifia"]') ?? [];

const seleccionablesPifia = {
    arma_empunada_pifia: document.getElementById("pifia_arma_empunada_seleccion"),
    arma_proyectil_pifia: document.getElementById("pifia_arma_proyectil_seleccion"),
    hechizo_pifia: document.getElementById("pifia_hechizo_seleccion"),
    mm_pifia: document.getElementById("pifia_mm_seleccion")
};

const tablasTipoPifia = {
    arma_empunada_pifia: "FT1_",
    arma_proyectil_pifia: "FT2_",
    hechizo_pifia: "FT3_",
    mm_pifia: "FT4_"
};

const columnasModificadoresPifia = {
    arma_empunada_cont: "armas_contundentes",
    arma_empunada_filo: "armas_de_filo",
    arma_empunada_dos_manos: "armas_a_dos_manos",
    arma_empunada_asta: "armas_de_asta",
    arma_proyectil_honda: "honda",
    arma_proyectil_arco_corto: "arco_corto",
    arma_proyectil_arco_compuesto: "arco_compuesto",
    arma_proyectil_arco_largo: "arco_largo",
    arma_proyectil_ballesta: "ballesta",
    pifia_hechizo_clase_i: "hechizo_clase_T",
    pifia_hechizo_clase_u: "hechizo_clase_U",
    pifia_hechizo_clase_p: "hechizo_clase_P",
    pifia_hechizo_clase_f: "hechizo_clase_F_y_E",
    pifia_hechizo_clase_e: "hechizo_clase_F_y_E",
    pifia_hechizo_clase_ed: "hechizo_clase_ED_y_EB",
    pifia_hechizo_clase_eb: "hechizo_clase_ED_y_EB",
    pifia_mm_rutinaria: "rutinaria",
    pifia_mm_muy_facil: "muy_facil",
    pifia_mm_facil: "facil",
    pifia_mm_media: "dificultad_media",
    pifia_mm_dificil: "dificil",
    pifia_mm_muy_dificil: "muy_dificil",
    pifia_mm_extr_dificil: "extremadamente_dificil",
    pifia_mm_locura_comp: "locura_completa",
    pifia_mm_absurdo: "absurdo"
};

const selectoresSubtipoPifia = {
    arma_empunada_pifia: 'input[name="arma_empunada"]',
    arma_proyectil_pifia: 'input[name="arma_proyectil"]',
    hechizo_pifia: 'input[name="pifia_hechizo_seleccion"]',
    mm_pifia: 'input[name="pifia_mm_seleccion"]'
};

const cacheTablasPifia = new Map();

function registrarVisibilidadSeleccionPifia() {
    radiosTipoAccionPifia.forEach((radio) => {
        radio.addEventListener("change", actualizarVisibilidadSeleccionPifia);
    });
}

function registrarBotonLimpiarPifia() {
    if (!btnLimpiarPifia) {
        return;
    }

    btnLimpiarPifia.addEventListener("click", () => {
        limpiarCamposPifia();
    });
}

function registrarBotonCalcularPifia() {
    if (!btnCalcularPifia) {
        return;
    }

    btnCalcularPifia.addEventListener("click", async () => {
        try {
            const seleccion = obtenerSeleccionPifia();

            if (!Number.isFinite(seleccion.dados)) {
                mostrarResultadoPifia("Introduce una tirada de dados válida.");
                return;
            }

            const errorDados = validarEnteroEnRango(seleccion.dados, 1, 100);
            if (errorDados) {
                mostrarResultadoPifia(`La tirada de dados debe ser un ${describirRango(errorDados)}.`);
                return;
            }

            if (!seleccion.tipoAccion) {
                mostrarResultadoPifia("Selecciona un tipo de acción.");
                return;
            }

            if (!seleccion.subtipo) {
                mostrarResultadoPifia("Selecciona una opción de pifia.");
                return;
            }

            const modificaciones = await cargarTablaPifia(
                "pifia_modificadores",
                "../../tablas/pifia/pifia_modificadores.json"
            );
            const filaModificador = modificaciones.find((fila) => fila.Tabla?.startsWith(seleccion.tablaTipo));

            if (!filaModificador) {
                mostrarResultadoPifia("No se encontró la tabla de modificadores de pifia.");
                return;
            }

            const modificadorBase = Number(filaModificador[seleccion.columnaModificador]);
            const modificadorMontado =
                seleccion.tipoAccion.id === "arma_empunada_pifia" && seleccion.montado
                    ? Number(filaModificador.montado)
                    : 0;
            const modificador = modificadorBase + modificadorMontado;

            if (!Number.isFinite(modificador)) {
                mostrarResultadoPifia("No se pudo obtener el modificador de pifia.");
                return;
            }

            const total = seleccion.dados + modificador;
            const tablaTirada = await cargarTablaPifia(
                "pifia_tirada",
                "../../tablas/pifia/pifia_tirada.json"
            );
            const filaResultado = buscarFilaPorRango(tablaTirada, total);
            const columnaResultado = obtenerColumnaResultadoPifia(filaResultado, seleccion.tablaTipo);
            const resultado = columnaResultado ? filaResultado?.[columnaResultado] : null;

            if (!resultado) {
                mostrarResultadoPifia("No se encontró el resultado de pifia.");
                return;
            }

            mostrarResultadoPifia(`Total ${total}: ${resultado}`);
        } catch (error) {
            console.error(error);
            mostrarResultadoPifia("No se pudo calcular la pifia.");
        }
    });
}

function actualizarVisibilidadSeleccionPifia() {
    const radioSeleccionado = Array.from(radiosTipoAccionPifia).find((radio) => radio.checked);

    Object.entries(seleccionablesPifia).forEach(([radioId, seleccionable]) => {
        const mostrar = radioSeleccionado?.id === radioId;
        seleccionable?.classList.toggle("d-none", !mostrar);

        if (!mostrar) {
            limpiarInputsSeleccionable(seleccionable);
        }
    });
}

function limpiarCamposPifia() {
    if (pifiaDados) {
        pifiaDados.value = "";
    }

    radiosTipoAccionPifia.forEach((radio) => {
        radio.checked = false;
    });

    Object.values(seleccionablesPifia).forEach(limpiarInputsSeleccionable);
    actualizarVisibilidadSeleccionPifia();
    ocultarResultadoPifia();
}

function limpiarInputsSeleccionable(seleccionable) {
    seleccionable?.querySelectorAll("input").forEach((input) => {
        if (input.type === "radio" || input.type === "checkbox") {
            input.checked = false;
            return;
        }

        if (input.type === "number" || input.type === "text") {
            input.value = "";
        }
    });
}

function obtenerSeleccionPifia() {
    const tipoAccion = Array.from(radiosTipoAccionPifia).find((radio) => radio.checked) ?? null;
    const selectorSubtipo = tipoAccion ? selectoresSubtipoPifia[tipoAccion.id] : null;
    const subtipo = selectorSubtipo ? vistaPifia?.querySelector(`${selectorSubtipo}:checked`) ?? null : null;
    const columnaModificador = subtipo ? columnasModificadoresPifia[subtipo.id] : null;
    const dadosTexto = pifiaDados?.value?.trim() ?? "";
    const montado = Boolean(vistaPifia?.querySelector("#arma_empunada_montura")?.checked);

    return {
        dados: dadosTexto === "" ? Number.NaN : Number(dadosTexto),
        tipoAccion,
        subtipo,
        tablaTipo: tipoAccion ? tablasTipoPifia[tipoAccion.id] : null,
        columnaModificador,
        montado
    };
}

async function cargarTablaPifia(clave, rutaRelativa) {
    if (!cacheTablasPifia.has(clave)) {
        const rutaTabla = new URL(rutaRelativa, import.meta.url);
        const promesa = fetch(rutaTabla).then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar la tabla ${clave}.`);
            }

            return respuesta.json();
        });

        cacheTablasPifia.set(clave, promesa);
    }

    return cacheTablasPifia.get(clave);
}

function obtenerColumnaResultadoPifia(filaResultado, tablaTipo) {
    if (!filaResultado || !tablaTipo) {
        return null;
    }

    return Object.keys(filaResultado).find((clave) => clave.startsWith(tablaTipo)) ?? null;
}

function mostrarResultadoPifia(texto) {
    if (!pifiaTextoResultado) {
        return;
    }

    pifiaTextoResultado.textContent = texto;
    pifiaTextoResultado.classList.remove("d-none");
}

function ocultarResultadoPifia() {
    if (!pifiaTextoResultado) {
        return;
    }

    pifiaTextoResultado.textContent = "";
    pifiaTextoResultado.classList.add("d-none");
}
