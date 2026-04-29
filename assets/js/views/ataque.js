import { mostrarPopupCritico, mostrarPopupPifia } from "./popupCritico.js";

export const ataque = {
    init() {
        registrarVisibilidadTamanios();
        registrarBotonLimpiar();
        registrarBotonCalcular();
    }
};

const vistaAtaque = document.getElementById("vista-ataque");
const radiosAtaque = document.querySelectorAll('input[name="ataque"]');
const radiosTamanio = document.querySelectorAll('input[name="garra/agarre"]');
const radiosArmadura = document.querySelectorAll('input[name="armadura"]');
const ataqueGarra = document.getElementById("ataque_garra");
const ataqueAgarre = document.getElementById("ataque_agarre");
const ataqueTamanios = document.getElementById("ataque_tamanios");
const btnAtaqueLimpiar = document.getElementById("btn_ataque_limpiar");
const btnAtaqueDados = document.getElementById("btn_ataque_dados");
const btnAtaqueBonificadorPos = document.getElementById("btn_ataque_bonificador_pos");
const btnAtaqueBonificadorNeg = document.getElementById("btn_ataque_bonificador_neg");
const ataqueTextoResultado = document.getElementById("ataque_texto_resultado");
const btnAtaqueCalcular = vistaAtaque?.querySelector("#ataque_calcular");
const modificadoresSituacionales = [
    { id: "ataque_flanco", valor: 15 },
    { id: "ataque_espalda", valor: 20 },
    { id: "ataque_sorpresa", valor: 20 },
    { id: "ataque_aturdido", valor: 20 }
];

const tablasAtaque = {
    ataque_filo: "ataque_filo.json",
    ataque_contundente: "ataque_contundente.json",
    ataque_2manos: "ataque_2manos.json",
    ataque_proyectil: "ataque_proyectil.json",
    ataque_garra: "ataque_garras.json",
    ataque_agarre: "ataque_agarrar.json"
};

const tiposCriticoAtaque = {
    ataque_filo: "critico_tajo",
    ataque_contundente: "critico_aplastamiento",
    ataque_2manos: "critico_tajo",
    ataque_proyectil: "critico_perforante",
    ataque_garra: "critico_tajo",
    ataque_agarre: "critico_presa"
};

const tiposPifiaAtaque = {
    ataque_filo: { tipo: "arma_empunada_pifia", subtipo: "arma_empunada_filo" },
    ataque_contundente: { tipo: "arma_empunada_pifia", subtipo: "arma_empunada_cont" },
    ataque_2manos: { tipo: "arma_empunada_pifia", subtipo: "arma_empunada_dos_manos" },
    ataque_proyectil: { tipo: "arma_proyectil_pifia", subtipo: null }
};

const columnasArmadura = {
    ataque_coraza: "coraza",
    ataque_malla: "cota_de_malla",
    ataque_ce: "cuero_endurecido",
    ataque_cuero: "cuero",
    ataque_sa: "sin_armadura"
};

const maximosPorTamanio = {
    ataque_garra: {
        ataque_diminuto: 85,
        ataque_pequeno: 105,
        ataque_mediano: 120,
        ataque_grande: 135,
        ataque_enorme: 150
    },
    ataque_agarre: {
        ataque_diminuto: 85,
        ataque_pequeno: 105,
        ataque_mediano: 120,
        ataque_grande: 135,
        ataque_enorme: 150
    }
};

const cacheTablas = new Map();

function registrarVisibilidadTamanios() {
    if (!ataqueTamanios || radiosAtaque.length === 0) {
        return;
    }

    radiosAtaque.forEach((radio) => {
        radio.addEventListener("change", actualizarVisibilidadTamanios);
    });

    actualizarVisibilidadTamanios();
}

function actualizarVisibilidadTamanios() {
    const mostrarTamanios = Boolean(ataqueGarra?.checked || ataqueAgarre?.checked);
    ataqueTamanios?.classList.toggle("d-none", !mostrarTamanios);
}

function registrarBotonLimpiar() {
    if (!btnAtaqueLimpiar) {
        return;
    }

    btnAtaqueLimpiar.addEventListener("click", () => {
        limpiarCamposAtaque();
    });
}

function registrarBotonCalcular() {
    if (!btnAtaqueCalcular) {
        return;
    }

    btnAtaqueCalcular.addEventListener("click", async () => {
        try {
            const seleccion = obtenerSeleccionAtaque();

            if (!seleccion.tipoAtaque) {
                mostrarResultadoAtaque("Selecciona un tipo de ataque.");
                return;
            }

            if (!seleccion.armadura) {
                mostrarResultadoAtaque("Selecciona una armadura.");
                return;
            }

            if (seleccion.requiereTamanio && !seleccion.tamanio) {
                mostrarResultadoAtaque("Selecciona un tamaño para garra o agarre.");
                return;
            }

            if (!Number.isFinite(seleccion.total)) {
                mostrarResultadoAtaque("Introduce una tirada de dados válida.");
                return;
            }

            const tabla = await cargarTablaAtaque(seleccion.tipoAtaque);
            const totalModificado = aplicarMaximoPorTamanio(seleccion);
            const totalConsulta = obtenerTiradaConsulta(tabla, seleccion.dados, totalModificado);
            const tramo =
                tabla.find((fila) => totalConsulta >= fila.min && totalConsulta <= fila.max) ||
                (totalConsulta > tabla[tabla.length - 1]?.max ? tabla[tabla.length - 1] : null);

            if (!tramo) {
                mostrarResultadoAtaque(`No existe resultado para una tirada total de ${seleccion.total}.`);
                return;
            }

            const resultado = tramo[seleccion.armadura];
            if (typeof resultado === "undefined") {
                mostrarResultadoAtaque("No hay resultado para la combinación seleccionada.");
                return;
            }

            const textoTotal =
                totalConsulta !== seleccion.total
                    ? `Total ${seleccion.total} (${obtenerTextoAjusteConsulta(seleccion, totalConsulta)})`
                    : `Total ${seleccion.total}`;

            const textoResultado = `${textoTotal}: ${resultado}`;
            mostrarResultadoAtaque(textoResultado);

            if (resultado === "F") {
                const pifia = tiposPifiaAtaque[seleccion.tipoAtaque];
                mostrarPopupPifia(textoResultado, pifia?.tipo, pifia?.subtipo);
                return;
            }

            mostrarPopupCritico(resultado, tiposCriticoAtaque[seleccion.tipoAtaque], textoResultado);
        } catch (error) {
            console.error(error);
            mostrarResultadoAtaque("No se pudo calcular el ataque.");
        }
    });
}

function limpiarCamposAtaque() {
    btnAtaqueDados.value = "";
    btnAtaqueBonificadorPos.value = "";
    btnAtaqueBonificadorNeg.value = "";
    ataqueTextoResultado?.classList.add("d-none");
    ataqueTextoResultado.textContent = "";

    radiosAtaque.forEach((radio) => {
        radio.checked = false;
    });

    radiosTamanio.forEach((radio) => {
        radio.checked = false;
    });

    radiosArmadura.forEach((radio) => {
        radio.checked = false;
    });

    modificadoresSituacionales.forEach(({ id }) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = false;
        }
    });

    actualizarVisibilidadTamanios();
}

function obtenerSeleccionAtaque() {
    const tipoAtaque = Array.from(radiosAtaque).find((radio) => radio.checked)?.id ?? null;
    const armaduraId = Array.from(radiosArmadura).find((radio) => radio.checked)?.id ?? null;
    const tamanio = Array.from(radiosTamanio).find((radio) => radio.checked)?.id ?? null;
    const dadosTexto = btnAtaqueDados?.value?.trim() ?? "";
    const bonificadorPositivoTexto = btnAtaqueBonificadorPos?.value?.trim() ?? "";
    const bonificadorNegativoTexto = btnAtaqueBonificadorNeg?.value?.trim() ?? "";
    const dados = dadosTexto === "" ? Number.NaN : Number(dadosTexto);
    const bonificadorPositivo = bonificadorPositivoTexto === "" ? 0 : Number(bonificadorPositivoTexto);
    const bonificadorNegativo = bonificadorNegativoTexto === "" ? 0 : Number(bonificadorNegativoTexto);
    const bonificadoresSituacionales = modificadoresSituacionales.reduce((total, { id, valor }) => {
        const checkbox = document.getElementById(id);
        return total + (checkbox?.checked ? valor : 0);
    }, 0);

    return {
        tipoAtaque,
        armadura: armaduraId ? columnasArmadura[armaduraId] : null,
        tamanio,
        tamanioTexto: obtenerTextoTamanio(tamanio),
        requiereTamanio: tipoAtaque === "ataque_garra" || tipoAtaque === "ataque_agarre",
        dados,
        total: dados + bonificadorPositivo - bonificadorNegativo + bonificadoresSituacionales
    };
}

function obtenerTiradaConsulta(tabla, dados, totalModificado) {
    const tramoSinModificador = tabla.find(
        (fila) => fila.sin_Modificador === 1 && dados >= fila.min && dados <= fila.max
    );

    return tramoSinModificador ? dados : totalModificado;
}

function obtenerTextoAjusteConsulta(seleccion, totalConsulta) {
    if (totalConsulta === seleccion.dados) {
        return `dado natural: ${totalConsulta}`;
    }

    return `max. ${seleccion.tamanioTexto}: ${totalConsulta}`;
}

function aplicarMaximoPorTamanio(seleccion) {
    if (!seleccion.requiereTamanio || !seleccion.tamanio) {
        return seleccion.total;
    }

    const maximo = maximosPorTamanio[seleccion.tipoAtaque]?.[seleccion.tamanio];
    return typeof maximo === "number" ? Math.min(seleccion.total, maximo) : seleccion.total;
}

function obtenerTextoTamanio(tamanio) {
    const textos = {
        ataque_diminuto: "diminuto",
        ataque_pequeno: "pequeño",
        ataque_mediano: "mediano",
        ataque_grande: "grande",
        ataque_enorme: "enorme"
    };

    return textos[tamanio] ?? "";
}

async function cargarTablaAtaque(tipoAtaque) {
    const nombreArchivo = tablasAtaque[tipoAtaque];

    if (!nombreArchivo) {
        throw new Error(`No hay tabla configurada para ${tipoAtaque}.`);
    }

    if (!cacheTablas.has(nombreArchivo)) {
        const rutaTabla = new URL(`../../tablas/ataque/${nombreArchivo}`, import.meta.url);
        const respuesta = await fetch(rutaTabla);

        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar la tabla ${nombreArchivo}.`);
        }

        cacheTablas.set(nombreArchivo, await respuesta.json());
    }

    return cacheTablas.get(nombreArchivo);
}

function mostrarResultadoAtaque(texto) {
    if (!ataqueTextoResultado) {
        return;
    }

    ataqueTextoResultado.textContent = texto;
    ataqueTextoResultado.classList.remove("d-none");
}
