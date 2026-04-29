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
                mostrarResultadoResistencia("Introduce una tirada de dados válida.");
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
            const fila = tabla.find((item) => item.nivel_blanco === seleccion.nivelBlancoEfectivo);

            if (!fila) {
                mostrarResultadoResistencia("No se encontró la fila del nivel del blanco.");
                return;
            }

            const umbral = fila.nivel_atacante[String(seleccion.nivelAtacanteAjustado)];

            if (!Number.isFinite(umbral)) {
                mostrarResultadoResistencia("No se encontró el valor de resistencia para esos niveles.");
                return;
            }

            const umbralAjustado = umbral + seleccion.ajusteNivelAtacante - seleccion.ajusteNivelBlanco;
            const total = seleccion.dados + seleccion.bonificacion + seleccion.otraBonificacion + seleccion.ajusteVoluntario;
            const exito = total >= umbralAjustado;
            const resultado = exito ? "Éxito" : "Fallo";

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

    const dados = dadosTexto === "" ? Number.NaN : Number(dadosTexto);
    const nivelAtacante = nivelAtacanteTexto === "" ? Number.NaN : Number(nivelAtacanteTexto);
    const nivelBlanco = nivelBlancoTexto === "" ? Number.NaN : Number(nivelBlancoTexto);
    const bonificacion = bonificacionTexto === "" ? 0 : Number(bonificacionTexto);
    const otraBonificacion = otraBonificacionTexto === "" ? 0 : Number(otraBonificacionTexto);
    const nivelAtacanteAjustado = ajustarNivel(nivelAtacante, 1, 15);
    const nivelBlancoAjustado = ajustarNivel(nivelBlanco, 0, 15);
    const ajusteNivelAtacante = calcularExcesoNivel(nivelAtacante);
    const ajusteNivelBlanco = calcularExcesoNivel(nivelBlanco);
    const nivelBlancoEfectivo = Math.max(nivelBlancoAjustado - ajusteNivelAtacante, 0);

    return {
        dados,
        nivelAtacante,
        nivelBlanco,
        bonificacion,
        otraBonificacion,
        ajusteVoluntario: resistenciaBlancoVoluntario?.checked ? -50 : 0,
        nivelAtacanteAjustado,
        nivelBlancoAjustado,
        ajusteNivelAtacante,
        ajusteNivelBlanco,
        nivelBlancoEfectivo
    };
}

function ajustarNivel(valor, minimo, maximo) {
    if (!Number.isFinite(valor)) {
        return Number.NaN;
    }

    return Math.min(Math.max(Math.trunc(valor), minimo), maximo);
}

function calcularExcesoNivel(valor) {
    if (!Number.isFinite(valor)) {
        return 0;
    }

    return Math.max(Math.trunc(valor) - 15, 0);
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
