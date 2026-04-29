import { calcularUmbralResistenciaTabla } from "../lib/resistencia.js";

export const tr = {
    init() {
        registrarBotonLimpiarResistencia();
        registrarBotonCalcularResistencia();
    }
};

const resistenciaDados = document.getElementById("resistencia_dados");
const resistenciaNivelAtacante = document.getElementById("resistencia_nivel_atacante");
const resistenciaNivelBlanco = document.getElementById("resistencia_nivel_blanco");
const resistenciaBonificacion = document.getElementById("resistencia_bonificacion");
const resistenciaOtraBonificacion = document.getElementById("resistencia_otra_bonificacion");
const resistenciaBlancoVoluntario = document.getElementById("resistencia_blanco_voluntario");
const btnLimpiarResistencia = document.getElementById("btn_limpiar_resistencia");
const btnCalcularResistencia = document.getElementById("resistencia_calcular");
const resistenciaTextoResultado = document.getElementById("resistencia_texto_resultado");

let tablaResistenciaPromise;

function registrarBotonLimpiarResistencia() {
    if (!btnLimpiarResistencia) {
        return;
    }

    btnLimpiarResistencia.addEventListener("click", () => {
        limpiarCamposResistencia();
    });
}

function registrarBotonCalcularResistencia() {
    if (!btnCalcularResistencia) {
        return;
    }

    btnCalcularResistencia.addEventListener("click", async () => {
        try {
            const seleccion = obtenerSeleccionResistencia();

            if (!Number.isFinite(seleccion.dados)) {
                mostrarResultadoResistencia("Introduce una tirada de dados valida.");
                return;
            }

            if (!Number.isFinite(seleccion.nivelAtacante)) {
                mostrarResultadoResistencia("Introduce el nivel del atacante.");
                return;
            }

            if (!Number.isFinite(seleccion.nivelBlanco)) {
                mostrarResultadoResistencia("Introduce el nivel del blanco.");
                return;
            }

            const tabla = await cargarTablaResistencia();
            const umbralAjustado = calcularUmbralResistenciaTabla(
                tabla,
                seleccion.nivelAtacante,
                seleccion.nivelBlanco
            );
            const total = seleccion.dados + seleccion.bonificacion + seleccion.otraBonificacion + seleccion.ajusteVoluntario;
            const exito = total >= umbralAjustado;
            const resultado = exito ? "Exito" : "Fallo";

            mostrarResultadoResistencia(`${resultado}: ${total} / ${umbralAjustado}`);
        } catch (error) {
            console.error(error);
            mostrarResultadoResistencia("No se pudo calcular la resistencia.");
        }
    });
}

function limpiarCamposResistencia() {
    resistenciaDados.value = "";
    resistenciaNivelAtacante.value = "";
    resistenciaNivelBlanco.value = "";
    resistenciaBonificacion.value = "";
    resistenciaOtraBonificacion.value = "";

    if (resistenciaBlancoVoluntario) {
        resistenciaBlancoVoluntario.checked = false;
    }

    if (resistenciaTextoResultado) {
        resistenciaTextoResultado.textContent = "";
        resistenciaTextoResultado.classList.add("d-none");
    }
}

function obtenerSeleccionResistencia() {
    const dadosTexto = resistenciaDados?.value?.trim() ?? "";
    const nivelAtacanteTexto = resistenciaNivelAtacante?.value?.trim() ?? "";
    const nivelBlancoTexto = resistenciaNivelBlanco?.value?.trim() ?? "";
    const bonificacionTexto = resistenciaBonificacion?.value?.trim() ?? "";
    const otraBonificacionTexto = resistenciaOtraBonificacion?.value?.trim() ?? "";

    return {
        dados: dadosTexto === "" ? Number.NaN : Number(dadosTexto),
        nivelAtacante: nivelAtacanteTexto === "" ? Number.NaN : Number(nivelAtacanteTexto),
        nivelBlanco: nivelBlancoTexto === "" ? Number.NaN : Number(nivelBlancoTexto),
        bonificacion: bonificacionTexto === "" ? 0 : Number(bonificacionTexto),
        otraBonificacion: otraBonificacionTexto === "" ? 0 : Number(otraBonificacionTexto),
        ajusteVoluntario: resistenciaBlancoVoluntario?.checked ? -50 : 0
    };
}

async function cargarTablaResistencia() {
    if (!tablaResistenciaPromise) {
        const rutaTabla = new URL("../../tablas/resistencia/resistencia.json", import.meta.url);

        tablaResistenciaPromise = fetch(rutaTabla).then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar la tabla de resistencia.");
            }

            return respuesta.json();
        });
    }

    return tablaResistenciaPromise;
}

function mostrarResultadoResistencia(texto) {
    if (!resistenciaTextoResultado) {
        return;
    }

    resistenciaTextoResultado.textContent = texto;
    resistenciaTextoResultado.classList.remove("d-none");
}
