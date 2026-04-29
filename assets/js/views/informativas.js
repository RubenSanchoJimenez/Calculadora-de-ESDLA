import { mostrarVista } from "./inicio.js";

export const informativas = {
    init() {
        registrarBotonesInformativos();
    }
};

const tablaTitulo = document.getElementById("tabla_dinamica_titulo");
const tablaContenedor = document.getElementById("tabla_dinamica_contenedor");
const cacheTablas = new Map();

const tablasInformativas = {
    "btn-otros-bonificador-caracteristicas": {
        titulo: "BONIFICADOR CARACTERÍSTICAS",
        archivo: "bonificador_caracteristicas.json"
    },
    "btn-otros-experiencia-por-nivel": {
        titulo: "EXPERIENCIA POR NIVEL",
        archivo: "experiacia_nivel.json"
    },
    "btn-otros-grado-idiomas": {
        titulo: "GRADO DE IDIOMAS",
        archivo: "grado_idiomas.json"
    },
    "btn-otros-modificadores-raza": {
        titulo: "MODIFICADORES DE RAZA",
        archivo: "modificaciones_raza.json"
    },
    "btn-otros-penalizacion-peso": {
        titulo: "PENALIZACIÓN POR PESO",
        archivo: "penalizacion_peso.json"
    },
    "btn-otros-puntos-por-critico": {
        titulo: "PUNTOS POR CRÍTICO",
        archivo: "puntos_criticos.json"
    },
    "btn-otros-puntos-por-hechizo": {
        titulo: "PUNTOS POR HECHIZO",
        archivo: "puntos_hechizos.json"
    },
    "btn-otros-puntos-por-maniobra": {
        titulo: "PUNTOS POR MANIOBRA",
        archivo: "puntos_maniobras.json"
    },
    "btn-otros-puntos-por-muerte": {
        titulo: "PUNTOS POR MUERTE",
        archivo: "puntos_muertes.json"
    }
};

function registrarBotonesInformativos() {
    Object.keys(tablasInformativas).forEach((id) => {
        const boton = document.getElementById(id);

        boton?.addEventListener("click", async () => {
            await cargarVistaTabla(tablasInformativas[id]);
        });
    });
}

async function cargarVistaTabla(configuracion) {
    try {
        mostrarVista("tablaDinamica");
        mostrarMensajeTabla("Cargando tabla...");

        const datos = await cargarTablaInformativa(configuracion.archivo);
        pintarTabla(configuracion.titulo, datos);
    } catch (error) {
        console.error(error);
        mostrarMensajeTabla("No se pudo cargar la tabla.");
    }
}

async function cargarTablaInformativa(archivo) {
    if (!cacheTablas.has(archivo)) {
        const rutaTabla = new URL(`../../tablas/informativas/${archivo}`, import.meta.url);
        const promesa = fetch(rutaTabla).then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar ${archivo}.`);
            }

            return respuesta.json();
        });

        cacheTablas.set(archivo, promesa);
    }

    return cacheTablas.get(archivo);
}

function pintarTabla(titulo, datos) {
    if (tablaTitulo) {
        tablaTitulo.textContent = titulo;
    }

    if (!tablaContenedor) {
        return;
    }

    if (!Array.isArray(datos) || datos.length === 0) {
        mostrarMensajeTabla("No hay datos para mostrar.");
        return;
    }

    const columnas = obtenerColumnas(datos);
    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    tabla.className = "table table-striped table-hover table-bordered tabla-dinamica";
    thead.appendChild(crearFilaCabecera(columnas));

    datos.forEach((fila) => {
        const tr = document.createElement("tr");

        columnas.forEach((columna) => {
            const td = document.createElement("td");
            td.appendChild(crearContenidoCelda(fila[columna]));
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    tablaContenedor.replaceChildren(tabla);
}

function obtenerColumnas(filas) {
    return filas.reduce((columnas, fila) => {
        Object.keys(fila).forEach((columna) => {
            if (!columnas.includes(columna)) {
                columnas.push(columna);
            }
        });

        return columnas;
    }, []);
}

function crearFilaCabecera(columnas) {
    const tr = document.createElement("tr");

    columnas.forEach((columna) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = formatearCabecera(columna);
        tr.appendChild(th);
    });

    return tr;
}

function formatearCabecera(columna) {
    return columna
        .replaceAll("_", " ");
}

function crearContenidoCelda(valor) {
    if (Array.isArray(valor)) {
        return crearListaObjetos(valor);
    }

    if (valor && typeof valor === "object") {
        return crearTablaObjeto(valor);
    }

    const texto = document.createElement("span");
    texto.textContent = formatearValor(valor);
    return texto;
}

function crearTablaObjeto(objeto) {
    const tabla = document.createElement("table");
    const tbody = document.createElement("tbody");

    tabla.className = "tabla-dinamica-interna";

    Object.entries(objeto).forEach(([clave, valor]) => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        const td = document.createElement("td");

        th.textContent = formatearCabecera(clave);
        td.appendChild(crearContenidoCelda(valor));
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    return tabla;
}

function crearListaObjetos(lista) {
    const contenedor = document.createElement("div");
    contenedor.className = "tabla-dinamica-lista";

    lista.forEach((item) => {
        const itemContenedor = document.createElement("div");
        itemContenedor.className = "tabla-dinamica-lista-item";
        itemContenedor.appendChild(crearContenidoCelda(item));
        contenedor.appendChild(itemContenedor);
    });

    return contenedor;
}

function formatearValor(valor) {
    if (valor === null || typeof valor === "undefined") {
        return "";
    }

    return String(valor);
}

function mostrarMensajeTabla(mensaje) {
    if (tablaContenedor) {
        tablaContenedor.replaceChildren();

        const texto = document.createElement("div");
        texto.className = "texto_resultado";
        texto.textContent = mensaje;
        tablaContenedor.appendChild(texto);
    }
}
