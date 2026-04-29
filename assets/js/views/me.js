export const me = {
    init() {
        registrarVisibilidadSeleccionMe();
        registrarBotonLimpiarMe();
        registrarBotonCalcularMe();
        actualizarVisibilidadSeleccionMe();
    }
};

const vistaMe = document.getElementById("vista-maniobra-estatica");
const btnLimpiarMe = document.getElementById("btn_limpiar_me");
const btnCalcularMe = document.getElementById("me_calcular");
const meDados = document.getElementById("me_dados");
const meBonificador = document.getElementById("me_bonificador");
const meTextoResultado = document.getElementById("me_texto_resultado");
const radiosSeleccionMe = vistaMe?.querySelectorAll('input[name="me_seleccion"]') ?? [];

const meGeneralSeleccion = document.getElementById("me_general_seleccion");

const seleccionablesMe = {
    me_influencia_interaccion: document.getElementById("me_influencia_seleccion"),
    me_percepcion_rastrear: document.getElementById("me_percepcion_seleccion"),
    me_leer_runas: document.getElementById("me_leer_runas_seleccion")
};

const columnasMe = {
    me_general: "general",
    me_influencia_interaccion: "influencia_interaccion",
    me_percepcion_rastrear: "percepcion_rastrear",
    me_desactivar_trampas: "desactivar_trampas_cerraduras",
    me_leer_runas: "leer_runas_usar_objetos"
};

const dificultadesMe = {
    me_rutinaria: "rutinaria",
    me_muy_facil: "muy_facil",
    me_facil: "facil",
    me_media: "media",
    me_dificil: "dificil",
    me_muy_dificil: "muy_dificil",
    me_extr_dificil: "extremadamente_dificil",
    me_locura_comp: "locura_completa",
    me_absurdo: "absurdo"
};

const modificadoresMe = [
    { id: "me_publico_devoto", valor: 50 },
    { id: "me_publico_a_sueldo", valor: 20 },
    { id: "me_busqueda_pausada", valor: 20 },
    { id: "me_dominio_propio", valor: 20 },
    { id: "me_sabes_hechizo", valor: 20 },
    { id: "me_tienes_hechizo", valor: 20 }
];

const cacheTablasMe = new Map();

function registrarVisibilidadSeleccionMe() {
    radiosSeleccionMe.forEach((radio) => {
        radio.addEventListener("change", actualizarVisibilidadSeleccionMe);
    });
}

function registrarBotonLimpiarMe() {
    if (!btnLimpiarMe) {
        return;
    }

    btnLimpiarMe.addEventListener("click", () => {
        limpiarCamposMe();
    });
}

function registrarBotonCalcularMe() {
    if (!btnCalcularMe) {
        return;
    }

    btnCalcularMe.addEventListener("click", async () => {
        try {
            const seleccion = obtenerSeleccionMe();

            if (!Number.isFinite(seleccion.dados)) {
                mostrarResultadoMe("Introduce una tirada de dados válida.");
                return;
            }

            if (!seleccion.columna) {
                mostrarResultadoMe("Selecciona el tipo de maniobra estática.");
                return;
            }

            if (seleccion.requiereDificultad && !seleccion.dificultad) {
                mostrarResultadoMe("Selecciona la dificultad de la maniobra.");
                return;
            }

            const modificadorDificultad = await obtenerModificadorDificultadMe(seleccion.dificultadClave);
            const total = seleccion.totalBase + modificadorDificultad;
            const tabla = await cargarTablaMe("me_tirada", "../../tablas/maniobra_estatica/me_tirada.json");
            const fila = buscarFilaMe(tabla, total);
            const resultado = fila?.[seleccion.columna];

            if (!resultado) {
                mostrarResultadoMe("No se encontró el resultado de la maniobra estática.");
                return;
            }

            mostrarResultadoMe(`Total ${total}: ${resultado}`);
        } catch (error) {
            console.error(error);
            mostrarResultadoMe("No se pudo calcular la maniobra estática.");
        }
    });
}

function actualizarVisibilidadSeleccionMe() {
    const radioSeleccionado = Array.from(radiosSeleccionMe).find((radio) => radio.checked);
    const mostrarGeneral = Boolean(radioSeleccionado && radioSeleccionado.id !== "me_leer_runas");
    meGeneralSeleccion?.classList.toggle("d-none", !mostrarGeneral);

    if (!mostrarGeneral) {
        limpiarInputsSeleccionable(meGeneralSeleccion);
    }

    Object.entries(seleccionablesMe).forEach(([radioId, seleccionable]) => {
        const mostrar = radioSeleccionado?.id === radioId;
        seleccionable?.classList.toggle("d-none", !mostrar);

        if (!mostrar) {
            limpiarInputsSeleccionable(seleccionable);
        }
    });
}

function limpiarCamposMe() {
    if (meDados) {
        meDados.value = "";
    }

    if (meBonificador) {
        meBonificador.value = "";
    }

    radiosSeleccionMe.forEach((radio) => {
        radio.checked = false;
    });

    limpiarInputsSeleccionable(meGeneralSeleccion);
    Object.values(seleccionablesMe).forEach(limpiarInputsSeleccionable);
    actualizarVisibilidadSeleccionMe();
    ocultarResultadoMe();
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

function obtenerSeleccionMe() {
    const tipoManiobra = Array.from(radiosSeleccionMe).find((radio) => radio.checked) ?? null;
    const dificultad = vistaMe?.querySelector('input[name="me_seleccion_dificultad"]:checked') ?? null;
    const dados = leerNumeroObligatorio(meDados);
    const bonificador = leerNumeroOpcional(meBonificador);
    const modificadores = modificadoresMe.reduce((total, { id, valor }) => {
        const checkbox = document.getElementById(id);
        return total + (checkbox?.checked ? valor : 0);
    }, 0);
    const nivelHechizo = leerNumeroOpcional(document.getElementById("me_nivel_hechizo"));

    return {
        dados,
        dificultad,
        dificultadClave: dificultad ? dificultadesMe[dificultad.id] : null,
        columna: tipoManiobra ? columnasMe[tipoManiobra.id] : null,
        requiereDificultad: Boolean(tipoManiobra && tipoManiobra.id !== "me_leer_runas"),
        totalBase: dados + bonificador + modificadores - nivelHechizo
    };
}

async function obtenerModificadorDificultadMe(dificultadClave) {
    if (!dificultadClave) {
        return 0;
    }

    const modificadores = await cargarTablaMe(
        "me_modificadores",
        "../../tablas/maniobra_estatica/me_modificadores.json"
    );
    const fila = modificadores.find((item) => item.dificultad === dificultadClave);
    const modificador = Number(fila?.modificador);

    return Number.isFinite(modificador) ? modificador : 0;
}

function leerNumeroObligatorio(input) {
    const valor = input?.value?.trim() ?? "";
    return valor === "" ? Number.NaN : Number(valor);
}

function leerNumeroOpcional(input) {
    const valor = input?.value?.trim() ?? "";
    return valor === "" ? 0 : Number(valor);
}

async function cargarTablaMe(clave, rutaRelativa) {
    if (!cacheTablasMe.has(clave)) {
        const rutaTabla = new URL(rutaRelativa, import.meta.url);
        const promesa = fetch(rutaTabla).then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar la tabla ${clave}.`);
            }

            return respuesta.json();
        });

        cacheTablasMe.set(clave, promesa);
    }

    return cacheTablasMe.get(clave);
}

function buscarFilaMe(tabla, total) {
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

function mostrarResultadoMe(texto) {
    if (!meTextoResultado) {
        return;
    }

    meTextoResultado.textContent = texto;
    meTextoResultado.classList.remove("d-none");
}

function ocultarResultadoMe() {
    if (!meTextoResultado) {
        return;
    }

    meTextoResultado.textContent = "";
    meTextoResultado.classList.add("d-none");
}
