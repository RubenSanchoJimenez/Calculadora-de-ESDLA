import { mostrarVista } from "./inicio.js";

const contenedorPopup = document.getElementById("contenedor_popup");
const popupTituloCritico = document.getElementById("popup_titulo_critico");
const popupTituloPifia = document.getElementById("popup_titulo_pifia");
const popupTextoResultado = document.getElementById("popup_texto_resultado");
const btnPopupNo = document.getElementById("btn_popup_no");
const btnPopupSi = document.getElementById("btn_popup_si");

const letrasCritico = {
    T: "critico_tipo_t",
    A: "critico_tipo_a",
    B: "critico_tipo_b",
    C: "critico_tipo_c",
    D: "critico_tipo_d",
    E: "critico_tipo_e"
};

let popupPendiente = null;

export const popupCritico = {
    init() {
        registrarBotonesPopup();
    }
};

export function extraerCriticoDeResultado(resultado) {
    const coincidencia = String(resultado).trim().match(/^(\d+)\s*([TABCDES])$/i);

    if (!coincidencia) {
        return null;
    }

    const letra = coincidencia[2].toUpperCase();
    if (!letrasCritico[letra]) {
        return null;
    }

    return {
        texto: `${coincidencia[1]}${letra}`,
        letra
    };
}

export function mostrarPopupCritico(resultado, tipoCriticoId, textoResultado = resultado) {
    const critico = extraerCriticoDeResultado(resultado);

    if (!critico || !tipoCriticoId) {
        return;
    }

    popupPendiente = {
        modo: "critico",
        ...critico,
        tipoCriticoId
    };

    mostrarPopup("critico", textoResultado);
}

export function mostrarPopupPifia(textoResultado, tipoPifiaId = null, subtipoPifiaId = null) {
    popupPendiente = {
        modo: "pifia",
        tipoPifiaId,
        subtipoPifiaId
    };

    mostrarPopup("pifia", textoResultado);
}

function registrarBotonesPopup() {
    btnPopupNo?.addEventListener("click", cerrarPopupCritico);
    btnPopupSi?.addEventListener("click", confirmarPopupCritico);
}

function confirmarPopupCritico() {
    if (!popupPendiente) {
        cerrarPopupCritico();
        return;
    }

    if (popupPendiente.modo === "pifia") {
        seleccionarRadio(popupPendiente.tipoPifiaId);
        seleccionarRadio(popupPendiente.subtipoPifiaId);
        cerrarPopupCritico();
        mostrarVista("pifia");
        return;
    }

    seleccionarRadio(letrasCritico[popupPendiente.letra]);
    seleccionarRadio(popupPendiente.tipoCriticoId);
    cerrarPopupCritico();
    mostrarVista("critico");
}

function mostrarPopup(modo, textoResultado) {
    popupTituloCritico?.classList.toggle("d-none", modo !== "critico");
    popupTituloPifia?.classList.toggle("d-none", modo !== "pifia");

    if (popupTextoResultado) {
        popupTextoResultado.textContent = textoResultado;
    }

    contenedorPopup?.classList.remove("d-none");
}

function seleccionarRadio(id) {
    const radio = document.getElementById(id);

    if (!radio) {
        return;
    }

    radio.checked = true;
    radio.dispatchEvent(new Event("change", { bubbles: true }));
}

function cerrarPopupCritico() {
    contenedorPopup?.classList.add("d-none");
    popupPendiente = null;
}
