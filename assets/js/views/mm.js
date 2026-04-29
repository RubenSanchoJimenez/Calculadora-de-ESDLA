import { mostrarPopupPifia } from "./popupCritico.js";

export const mm = {
    init() {
        registrarBotonLimpiarMm();
        registrarBotonCalcularMm();
    }
};

const vistaMm = document.getElementById("vista-maniobra-movimiento");
const btnLimpiarMm = document.getElementById("btn_limpiar_mm");
const btnCalcularMm = document.getElementById("mm_calcular");
const mmDados = document.getElementById("mm_dados");
const mmBonus = document.getElementById("mm_bonus");
const mmOtros = document.getElementById("mm_otros");
const mmTextoResultado = document.getElementById("mm_texto_resultado");
const radiosDificultadMm = vistaMm?.querySelectorAll('input[name="mm_dificultad"]') ?? [];

const columnasMm = {
    mm_rutinaria: "rutinaria",
    mm_muy_facil: "muy_facil",
    mm_facil: "facil",
    mm_media: "media",
    mm_dificil: "dificil",
    mm_muy_dificil: "muy_dificil",
    mm_extr_dificil: "extremadamente_dificil",
    mm_locura_comp: "locura_completa",
    mm_absurdo: "absurdo"
};

const pifiasPorDificultadMm = {
    mm_rutinaria: "pifia_mm_rutinaria",
    mm_muy_facil: "pifia_mm_muy_facil",
    mm_facil: "pifia_mm_facil",
    mm_media: "pifia_mm_media",
    mm_dificil: "pifia_mm_dificil",
    mm_muy_dificil: "pifia_mm_muy_dificil",
    mm_extr_dificil: "pifia_mm_extr_dificil",
    mm_locura_comp: "pifia_mm_locura_comp",
    mm_absurdo: "pifia_mm_absurdo"
};

const modificadoresEstadoMm = [
    { id: "mm_aturdido", valor: -50 },
    { id: "mm_derribado", valor: -70 },
    { id: "mm_extremidad_inutilizada", valor: -30 }
];

const cacheTablasMm = new Map();

function registrarBotonLimpiarMm() {
    if (!btnLimpiarMm) {
        return;
    }

    btnLimpiarMm.addEventListener("click", () => {
        limpiarCamposMm();
    });
}

function registrarBotonCalcularMm() {
    if (!btnCalcularMm) {
        return;
    }

    btnCalcularMm.addEventListener("click", async () => {
        try {
            const seleccion = obtenerSeleccionMm();

            if (!Number.isFinite(seleccion.dados)) {
                mostrarResultadoMm("Introduce una tirada de dados válida.");
                return;
            }

            if (!seleccion.columna) {
                mostrarResultadoMm("Selecciona la dificultad de la maniobra.");
                return;
            }

            const tabla = await cargarTablaMm("mm_tirada", "../../tablas/maniobra_movimiento/mm_tirada.json");
            const fila = buscarFilaMm(tabla, seleccion.total);
            const resultado = fila?.[seleccion.columna];

            if (typeof resultado === "undefined") {
                mostrarResultadoMm("No se encontró el resultado de la maniobra.");
                return;
            }

            const textoResultado = `Total ${seleccion.total}: ${formatearResultadoMm(resultado)}`;
            mostrarResultadoMm(textoResultado);

            if (resultado === "F") {
                mostrarPopupPifia(textoResultado, "mm_pifia", seleccion.pifiaDificultadId);
            }
        } catch (error) {
            console.error(error);
            mostrarResultadoMm("No se pudo calcular la maniobra de movimiento.");
        }
    });
}

function limpiarCamposMm() {
    if (mmDados) {
        mmDados.value = "";
    }

    if (mmBonus) {
        mmBonus.value = "";
    }

    if (mmOtros) {
        mmOtros.value = "";
    }

    radiosDificultadMm.forEach((radio) => {
        radio.checked = false;
    });

    modificadoresEstadoMm.forEach(({ id }) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = false;
        }
    });

    ocultarResultadoMm();
}

function obtenerSeleccionMm() {
    const dificultad = Array.from(radiosDificultadMm).find((radio) => radio.checked) ?? null;
    const dados = leerNumeroObligatorio(mmDados);
    const bonus = leerNumeroOpcional(mmBonus);
    const otros = leerNumeroOpcional(mmOtros);
    const modificadoresEstado = modificadoresEstadoMm.reduce((total, { id, valor }) => {
        const checkbox = document.getElementById(id);
        return total + (checkbox?.checked ? valor : 0);
    }, 0);

    return {
        dados,
        dificultadId: dificultad?.id ?? null,
        pifiaDificultadId: dificultad ? pifiasPorDificultadMm[dificultad.id] : null,
        columna: dificultad ? columnasMm[dificultad.id] : null,
        total: dados + bonus + otros + modificadoresEstado
    };
}

function leerNumeroObligatorio(input) {
    const valor = input?.value?.trim() ?? "";
    return valor === "" ? Number.NaN : Number(valor);
}

function leerNumeroOpcional(input) {
    const valor = input?.value?.trim() ?? "";
    return valor === "" ? 0 : Number(valor);
}

async function cargarTablaMm(clave, rutaRelativa) {
    if (!cacheTablasMm.has(clave)) {
        const rutaTabla = new URL(rutaRelativa, import.meta.url);
        const promesa = fetch(rutaTabla).then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar la tabla ${clave}.`);
            }

            return respuesta.json();
        });

        cacheTablasMm.set(clave, promesa);
    }

    return cacheTablasMm.get(clave);
}

function buscarFilaMm(tabla, total) {
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

function formatearResultadoMm(resultado) {
    return typeof resultado === "number" ? `${resultado}/100` : resultado;
}

function mostrarResultadoMm(texto) {
    if (!mmTextoResultado) {
        return;
    }

    mmTextoResultado.textContent = texto;
    mmTextoResultado.classList.remove("d-none");
}

function ocultarResultadoMm() {
    if (!mmTextoResultado) {
        return;
    }

    mmTextoResultado.textContent = "";
    mmTextoResultado.classList.add("d-none");
}
