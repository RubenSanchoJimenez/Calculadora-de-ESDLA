import { mostrarPopupCritico, mostrarPopupPifia } from "./popupCritico.js";
import { calcularUmbralResistenciaTabla } from "../lib/resistencia.js";

import {
    calcularModificadorDistancia,
    calcularModificadorDistanciaDirigido,
    calcularModificadorPreparacion,
    calcularTiradaTablaHechizo
} from "../lib/hechizo.js";
import { buscarFilaPorRango, obtenerTiradaConsulta } from "../lib/tablas.js";
import { describirRango, validarEnteroEnRango } from "../lib/validacion.js";

export const hechizo = {
    init() {
        registrarCambioTipoHechizo();
        registrarBotonesLimpiar();
        registrarBotonCalcular();
        actualizarVistaTipoHechizo();
    }
};

const hechizoBasico = document.getElementById("hechizo_basico");
const hechizoDirigido = document.getElementById("hechizo_dirigido");
const hechizoBola = document.getElementById("hechizo_bola");

const hechizoBasicoSeleccionable = document.getElementById("hechizo_basico_seleccionable");
const hechizoDirigidoSeleccionable = document.getElementById("hechizo_dirigido_seleccionable");
const hechizoBolaSeleccionable = document.getElementById("hechizo_bola_seleccionable");

const hechizoTextoResultado = document.getElementById("hechizo_texto_resultado");
const hechizoCalcular = document.getElementById("hechizo_calcular");

const botonesLimpiar = [
    {
        boton: document.getElementById("btn_limpiar_hechizos"),
        contenedor: hechizoBasicoSeleccionable
    },
    {
        boton: document.getElementById("btn_limpiar_hechizo_dirigido"),
        contenedor: hechizoDirigidoSeleccionable
    },
    {
        boton: document.getElementById("btn_limpiar_hechizo_bola"),
        contenedor: hechizoBolaSeleccionable
    }
];

const columnasBasico = {
    hechizo_receptor_coraza: "cota_y_coraza",
    hechizo_receptor_cuero: "cuero",
    hechizo_receptor_sa: "sin_armadura"
};

const columnasImpacto = {
    hechizo_dirigido_coraza: "coraza",
    hechizo_dirigido_malla: "cota_de_malla",
    hechizo_dirigido_ce: "cuero_endurecido",
    hechizo_dirigido_cuero: "cuero",
    hechizo_dirigido_sa: "sin_armadura",
    hechizo_bola_coraza: "coraza",
    hechizo_bola_malla: "cota_de_malla",
    hechizo_bola_ce: "cuero_endurecido",
    hechizo_bola_cuero: "cuero",
    hechizo_bola_sa: "sin_armadura"
};

const cacheTablas = new Map();
const maximosHechizoDirigido = {
    hechizo_dirigido_desc: 90,
    hechizo_dirigido_agua: 110,
    hechizo_dirigido_hielo: 130,
    hechizo_dirigido_igneo: 150,
    hechizo_dirigido_rel: 150
};

const tiposCriticoHechizoDirigido = {
    hechizo_dirigido_desc: "critico_electrico",
    hechizo_dirigido_agua: "critico_impacto",
    hechizo_dirigido_hielo: "critico_frio",
    hechizo_dirigido_igneo: "critico_calor",
    hechizo_dirigido_rel: "critico_electrico"
};

const tiposCriticoHechizoBola = {
    hechizo_bola_frio: "critico_frio",
    hechizo_bola_fuego: "critico_calor"
};

function registrarCambioTipoHechizo() {
    [hechizoBasico, hechizoDirigido, hechizoBola].forEach((radio) => {
        if (!radio) {
            return;
        }

        radio.addEventListener("change", actualizarVistaTipoHechizo);
    });
}

function actualizarVistaTipoHechizo() {
    hechizoBasicoSeleccionable?.classList.toggle("d-none", !hechizoBasico?.checked);
    hechizoDirigidoSeleccionable?.classList.toggle("d-none", !hechizoDirigido?.checked);
    hechizoBolaSeleccionable?.classList.toggle("d-none", !hechizoBola?.checked);
}

function registrarBotonesLimpiar() {
    botonesLimpiar.forEach(({ boton, contenedor }) => {
        if (!boton || !contenedor) {
            return;
        }

        boton.addEventListener("click", () => {
            limpiarContenedor(contenedor);
            ocultarResultadoHechizo();
        });
    });
}

function registrarBotonCalcular() {
    if (!hechizoCalcular) {
        return;
    }

    hechizoCalcular.addEventListener("click", async () => {
        try {
            if (hechizoBasico?.checked) {
                await calcularHechizoBasico();
                return;
            }

            if (hechizoDirigido?.checked) {
                await calcularHechizoDirigido();
                return;
            }

            if (hechizoBola?.checked) {
                await calcularHechizoBola();
                return;
            }

            mostrarResultadoHechizo("Selecciona un tipo de hechizo.");
        } catch (error) {
            console.error(error);
            mostrarResultadoHechizo("No se pudo calcular el hechizo.");
        }
    });
}

async function calcularHechizoBasico() {
    const tipoLanzamiento = obtenerRadioMarcado('input[name="tipo_lanzamiento"]')?.id ?? null;
    const armaduraLanzadorId = obtenerRadioMarcado('input[name="lanzador_armadura"]')?.id ?? null;
    const armaduraReceptorId = obtenerRadioMarcado('input[name="receptor_armadura"]')?.id ?? null;
    const dadosLanzador = leerNumeroObligatorio(document.getElementById("hechizo_dados_lanzador"));
    const dadosObjetivo = leerNumeroObligatorio(document.getElementById("hechizo_dados_objetivo"));
    const nivelLanzador = leerNumeroObligatorio(document.getElementById("hechizo_nivel_lanzador"));
    const nivelReceptor = leerNumeroObligatorio(document.getElementById("hechizo_nivel_receptor"));
    const nivelHechizo = leerNumeroObligatorio(document.getElementById("hechizo_nivel_hechizo"));
    const boBasico = leerNumeroOpcional(document.getElementById("hechizo_bo_basico"));
    const bonificacionResistencia = leerNumeroOpcional(document.getElementById("hechizo_bonificacion_resistencia"));
    const bonificadorPositivo = leerNumeroOpcional(document.getElementById("hechizo_bonificador_positivo"));
    const bonificadorNegativo = leerNumeroOpcional(document.getElementById("hechizo_bonificador_negativo"));
    const asaltosPreparacion = leerNumeroObligatorio(document.getElementById("hechizo_asaltos_preparacion"));
    const distancia = leerNumeroObligatorio(document.getElementById("hechizo_distancia"));

    if (!tipoLanzamiento) {
        mostrarResultadoHechizo("Selecciona esencia o canalizacion.");
        return;
    }

    if (!armaduraLanzadorId) {
        mostrarResultadoHechizo("Selecciona la armadura del lanzador.");
        return;
    }

    if (!armaduraReceptorId) {
        mostrarResultadoHechizo("Selecciona la armadura del receptor.");
        return;
    }

    if (tipoLanzamiento === "hechizo_esencia" && armaduraLanzadorId !== "hechizo_lanzador_sa") {
        mostrarResultadoHechizo("Fallo por armadura equipada.");
        return;
    }

    if (
        tipoLanzamiento === "hechizo_canalizacion" &&
        armaduraLanzadorId === "hechizo_lanzador_coraza"
    ) {
        mostrarResultadoHechizo("Fallo por armadura equipada.");
        return;
    }

    if (
        !sonNumerosValidos([
            dadosLanzador,
            dadosObjetivo,
            nivelLanzador,
            nivelReceptor,
            nivelHechizo,
            asaltosPreparacion,
            distancia
        ])
    ) {
        mostrarResultadoHechizo("Completa los campos numericos obligatorios del hechizo basico.");
        return;
    }

    const errorRango = validarRangosHechizo([
        ["Dados lanzador", dadosLanzador, 1, 100],
        ["Dados objetivo", dadosObjetivo, 1, 100],
        ["Nivel lanzador", nivelLanzador, 0],
        ["Nivel receptor", nivelReceptor, 0],
        ["Nivel hechizo", nivelHechizo, 0],
        ["Asaltos de preparacion", asaltosPreparacion, 0],
        ["Distancia", distancia, 0]
    ]);
    if (errorRango) {
        mostrarResultadoHechizo(errorRango);
        return;
    }

    const modDistancia = calcularModificadorDistancia(distancia);
    const modPreparacion = calcularModificadorPreparacion(asaltosPreparacion);
    const modAtacante = boBasico - nivelHechizo;
    const penalizacionCanalizacion =
        tipoLanzamiento === "hechizo_canalizacion" && armaduraReceptorId === "hechizo_receptor_coraza" ? -10 : 0;

    const tiradaAtaque =
        dadosLanzador +
        bonificadorPositivo -
        bonificadorNegativo +
        modAtacante +
        modPreparacion +
        modDistancia +
        penalizacionCanalizacion;

    const tabla = await cargarTabla("hechizo_basico", "../../tablas/hechizo/hechizo_basico.json");
    const tiradaTabla = obtenerTiradaConsulta(tabla, dadosLanzador, calcularTiradaTablaHechizo(dadosLanzador, tiradaAtaque));
    const fila = buscarFilaPorRango(tabla, tiradaTabla);
    const columna = obtenerColumnaBasico(tipoLanzamiento, armaduraReceptorId);
    const modificadorTabla = fila?.[columna];

    if (typeof modificadorTabla === "undefined") {
        mostrarResultadoHechizo("No se encontro el resultado del hechizo basico.");
        return;
    }

    if (modificadorTabla === "F") {
        const textoResultado = `Hechizo basico: total ${tiradaTabla}, resultado F.`;
        mostrarResultadoHechizo(textoResultado);
        mostrarPopupPifia(textoResultado, "hechizo_pifia");
        return;
    }

    const modificadorTR = convertirModificador(modificadorTabla);
    const modificadoresBlanco =
        bonificacionResistencia +
        (document.getElementById("hechizo_blanco_estatico")?.checked ? 10 : 0) +
        (document.getElementById("hechizo_blanco_voluntario")?.checked ? -50 : 0);

    const tiradaResistencia = dadosObjetivo + modificadoresBlanco + modificadorTR;
    const umbral = await calcularUmbralResistencia(nivelLanzador, nivelReceptor);
    const exito = tiradaResistencia >= umbral;
    const resultado = exito ? "Resiste" : "No resiste";

    mostrarResultadoHechizo(
        `Mod. TR ${formatearModificador(modificadorTR)}. TR blanco: ${tiradaResistencia} / ${umbral}. ${resultado}.`
    );
}

async function calcularHechizoDirigido() {
    const subtipo = obtenerRadioMarcado('input[name="hechizo_dirigido_tipo"]')?.id ?? null;
    const armaduraId = obtenerRadioMarcado('#hechizo_dirigido_seleccionable input[type="radio"][name="hechizo_dirigido_armadura"]')?.id ?? null;
    const dados = leerNumeroObligatorio(document.getElementById("hechizo_dirigido_dados"));
    const bonifPos = leerNumeroOpcional(document.getElementById("hechizo_dirigido_bonif_pos"));
    const bonifNeg = leerNumeroOpcional(document.getElementById("hechizo_dirigido_bonif_neg"));
    const asaltos = leerNumeroObligatorio(document.getElementById("hechizo_dirigido_asaltos_preparacion"));
    const distancia = leerNumeroObligatorio(document.getElementById("hechizo_dirigido_distancia"));

    if (!subtipo) {
        mostrarResultadoHechizo("Selecciona el tipo de hechizo dirigido.");
        return;
    }

    if (!armaduraId) {
        mostrarResultadoHechizo("Selecciona la armadura del blanco.");
        return;
    }

    if (!sonNumerosValidos([dados, asaltos, distancia])) {
        mostrarResultadoHechizo("Completa los campos numericos obligatorios del hechizo dirigido.");
        return;
    }

    const errorRango = validarRangosHechizo([
        ["Dados", dados, 1, 100],
        ["Asaltos de preparacion", asaltos, 0],
        ["Distancia", distancia, 0]
    ]);
    if (errorRango) {
        mostrarResultadoHechizo(errorRango);
        return;
    }

    const modEscudo = document.getElementById("hechizo_dirigido_escudo")?.checked ? -20 : 0;
    const tirada =
        dados +
        bonifPos -
        bonifNeg +
        calcularModificadorPreparacion(asaltos) +
        calcularModificadorDistanciaDirigido(distancia) +
        modEscudo;

    const tabla = await cargarTabla("hechizo_dirigido", "../../tablas/hechizo/hechizo_dirigido.json");
    // Los maximos de subtipo limitan la tirada modificada antes de consultar la tabla.
    const tiradaCapada = Math.min(tirada, maximosHechizoDirigido[subtipo] ?? 150);
    const tiradaTabla = obtenerTiradaConsulta(tabla, dados, tiradaCapada);
    const fila = buscarFilaPorRango(tabla, tiradaTabla);
    const resultado = fila?.[columnasImpacto[armaduraId]];

    if (typeof resultado === "undefined") {
        mostrarResultadoHechizo("No se encontro el resultado del hechizo dirigido.");
        return;
    }

    if (resultado === "F") {
        const textoResultado = `Hechizo dirigido: total ${tiradaTabla}, resultado F.`;
        mostrarResultadoHechizo(textoResultado);
        mostrarPopupPifia(textoResultado, "hechizo_pifia");
        return;
    }

    const textoTotal =
        tiradaCapada !== tirada ? `total ${tirada} (max. ${tiradaCapada})` : `total ${tirada}`;

    const textoResultado = `Hechizo dirigido: ${textoTotal}, resultado ${resultado}.`;
    mostrarResultadoHechizo(textoResultado);
    mostrarPopupCritico(resultado, tiposCriticoHechizoDirigido[subtipo], textoResultado);
}

async function calcularHechizoBola() {
    const subtipo = obtenerRadioMarcado('input[name="hechizo_bola_tipo"]')?.id ?? null;
    const armaduraId = obtenerRadioMarcado('#hechizo_bola_seleccionable input[type="radio"][name="hechizo_bola_armadura"]')?.id ?? null;
    const dados = leerNumeroObligatorio(document.getElementById("hechizo_bola_dados"));
    const bonifPos = leerNumeroOpcional(document.getElementById("hechizo_bola_bonif_pos"));
    const bonifNeg = leerNumeroOpcional(document.getElementById("hechizo_bola_bonif_neg"));
    const asaltos = leerNumeroObligatorio(document.getElementById("hechizo_bola_asaltos_preparacion"));
    const distancia = leerNumeroObligatorio(document.getElementById("hechizo_bola_distancia"));
    const modCentro = document.getElementById("hechizo_bola_centro")?.checked ? 20 : 0;

    if (!subtipo) {
        mostrarResultadoHechizo("Selecciona el tipo de hechizo de bola.");
        return;
    }

    if (!armaduraId) {
        mostrarResultadoHechizo("Selecciona la armadura del blanco.");
        return;
    }

    if (!sonNumerosValidos([dados, asaltos, distancia])) {
        mostrarResultadoHechizo("Completa los campos numericos obligatorios del hechizo de bola.");
        return;
    }

    const errorRango = validarRangosHechizo([
        ["Dados", dados, 1, 100],
        ["Asaltos de preparacion", asaltos, 0],
        ["Distancia", distancia, 0]
    ]);
    if (errorRango) {
        mostrarResultadoHechizo(errorRango);
        return;
    }

    const tirada =
        dados +
        bonifPos -
        bonifNeg +
        modCentro +
        calcularModificadorPreparacion(asaltos) +
        calcularModificadorDistanciaDirigido(distancia);

    const tabla = await cargarTabla("hechizo_bola", "../../tablas/hechizo/hechizo_bola.json");
    const tiradaTabla = obtenerTiradaConsulta(tabla, dados, calcularTiradaTablaHechizo(dados, tirada));
    const fila = buscarFilaPorRango(tabla, tiradaTabla);
    const resultado = fila?.[columnasImpacto[armaduraId]];

    if (typeof resultado === "undefined") {
        mostrarResultadoHechizo("No se encontro el resultado del hechizo de bola.");
        return;
    }

    if (resultado === "F") {
        const textoResultado = `Hechizo de bola: total ${tiradaTabla}, resultado F.`;
        mostrarResultadoHechizo(textoResultado);
        mostrarPopupPifia(textoResultado, "hechizo_pifia");
        return;
    }

    const textoResultado = `Hechizo de bola: total ${tirada}, resultado ${resultado}.`;
    mostrarResultadoHechizo(textoResultado);
    mostrarPopupCritico(resultado, tiposCriticoHechizoBola[subtipo], textoResultado);
}

function limpiarContenedor(contenedor) {
    const inputs = contenedor.querySelectorAll("input");

    inputs.forEach((input) => {
        if (input.type === "radio" || input.type === "checkbox") {
            input.checked = false;
            return;
        }

        if (input.type === "number" || input.type === "text") {
            input.value = "";
        }
    });
}

function leerNumeroObligatorio(input) {
    const valor = input?.value?.trim() ?? "";
    return valor === "" ? Number.NaN : Number(valor);
}

function leerNumeroOpcional(input) {
    const valor = input?.value?.trim() ?? "";
    return valor === "" ? 0 : Number(valor);
}

function sonNumerosValidos(valores) {
    return valores.every((valor) => Number.isFinite(valor));
}

function validarRangosHechizo(campos) {
    const invalido = campos.find(([, valor, minimo, maximo]) =>
        validarEnteroEnRango(valor, minimo, maximo) !== null
    );

    if (!invalido) {
        return null;
    }

    const [nombre, valor, minimo, maximo] = invalido;
    const error = validarEnteroEnRango(valor, minimo, maximo);
    return `${nombre} debe ser un ${describirRango(error)}.`;
}

function obtenerRadioMarcado(selector) {
    return document.querySelector(`${selector}:checked`);
}

function obtenerColumnaBasico(tipoLanzamiento, armaduraReceptorId) {
    // Regla de canalizacion: cuero del receptor consulta la columna sin armadura.
    if (tipoLanzamiento === "hechizo_canalizacion" && armaduraReceptorId === "hechizo_receptor_cuero") {
        return "sin_armadura";
    }

    return columnasBasico[armaduraReceptorId];
}

function convertirModificador(valor) {
    if (typeof valor === "number") {
        return valor;
    }

    return Number.parseInt(String(valor), 10);
}

function formatearModificador(valor) {
    return valor > 0 ? `+${valor}` : String(valor);
}

async function cargarTabla(clave, rutaRelativa) {
    if (!cacheTablas.has(clave)) {
        const rutaTabla = new URL(rutaRelativa, import.meta.url);
        const promesa = fetch(rutaTabla).then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar la tabla ${clave}.`);
            }

            return respuesta.json();
        });

        cacheTablas.set(clave, promesa);
    }

    return cacheTablas.get(clave);
}

async function calcularUmbralResistencia(nivelAtacante, nivelBlanco) {
    const tabla = await cargarTabla("resistencia", "../../tablas/resistencia/resistencia.json");
    return calcularUmbralResistenciaTabla(tabla, nivelAtacante, nivelBlanco);
}

function mostrarResultadoHechizo(texto) {
    if (!hechizoTextoResultado) {
        return;
    }

    hechizoTextoResultado.textContent = texto;
    hechizoTextoResultado.classList.remove("d-none");
}

function ocultarResultadoHechizo() {
    if (!hechizoTextoResultado) {
        return;
    }

    hechizoTextoResultado.textContent = "";
    hechizoTextoResultado.classList.add("d-none");
}
