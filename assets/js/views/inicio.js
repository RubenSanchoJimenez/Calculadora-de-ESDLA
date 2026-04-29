const btnAtaque = document.getElementById("btn-inicio-ataque");
const btnHechizo = document.getElementById("btn-inicio-hechizo");
const btnCritico = document.getElementById("btn-inicio-critico");
const btnPifia = document.getElementById("btn-inicio-pifia");
const btnMe = document.getElementById("btn-inicio-me");
const btnMm = document.getElementById("btn-inicio-mm");
const btnTr = document.getElementById("btn-inicio-tr");
const btnOtros = document.getElementById("btn-inicio-otros");
const navInicio = document.getElementById("nav-inicio");
const navQueEsEsto = document.getElementById("nav-que-es-esto");
const navQuienesSomos = document.getElementById("nav-quienes-somos");
const navbarNav = document.getElementById("navbarNav");
const btnVolverInicio = document.getElementById("btn-volver-inicio");
const navbarImagenInicio = document.getElementById("navbar_imagen_inicio");
const body = document.body;

const menuPrincipal = document.getElementById("menu-principal");
let vistaActual = null;

const vistas = {
    ataque: document.getElementById("vista-ataque"),
    hechizo: document.getElementById("vista-hechizo"),
    critico: document.getElementById("vista-critico"),
    pifia: document.getElementById("vista-pifia"),
    me: document.getElementById("vista-maniobra-estatica"),
    mm: document.getElementById("vita-maniobra-movimiento"),
    tr: document.getElementById("vista-resistencia"),
    otros: document.getElementById("vista-otros"),
    tablaDinamica: document.getElementById("vista-tabla-dinamica"),
    queEsEsto: document.getElementById("vista-que-es-esto"),
    quienesSomos: document.getElementById("vista-quienes-somos")
};

export const inicio = {
    init() {
        registrarBoton(btnAtaque, vistas.ataque);
        registrarBoton(btnHechizo, vistas.hechizo);
        registrarBoton(btnCritico, vistas.critico);
        registrarBoton(btnPifia, vistas.pifia);
        registrarBoton(btnMe, vistas.me);
        registrarBoton(btnMm, vistas.mm);
        registrarBoton(btnTr, vistas.tr);
        registrarBoton(btnOtros, vistas.otros);
        registrarBoton(navQueEsEsto, vistas.queEsEsto);
        registrarBoton(navQuienesSomos, vistas.quienesSomos);
        registrarBotonInicio();
        mostrarInicio();
    }
};

function registrarBoton(boton, vista) {
    if (!boton || !vista) {
        return;
    }

    boton.addEventListener("click", () => {
        mostrarVistaPorElemento(vista);
        colapsarNavbar();
    });
}

export function mostrarVista(claveVista) {
    const vista = vistas[claveVista];

    if (!vista) {
        return;
    }

    mostrarVistaPorElemento(vista);
}

function mostrarVistaPorElemento(vista) {
    cerrarVistas();
    menuPrincipal?.classList.add("d-none");
    vista.classList.remove("d-none");
    body?.classList.add("con-fondo-borroso");
    vistaActual = vista;
    actualizarImagenNavbar(false);
}

function cerrarVistas() {
    Object.values(vistas).forEach((vista) => {
        vista?.classList.add("d-none");
    });
}

function registrarBotonInicio() {
    if (!btnVolverInicio) {
        return;
    }

    btnVolverInicio.addEventListener("click", () => {
        if (vistaActual === vistas.tablaDinamica) {
            mostrarVistaPorElemento(vistas.otros);
            return;
        }

        mostrarInicio();
    });

    navInicio?.addEventListener("click", (event) => {
        event.preventDefault();
        mostrarInicio();
        colapsarNavbar();
    });
}

function mostrarInicio() {
    cerrarVistas();
    menuPrincipal?.classList.remove("d-none");
    body?.classList.remove("con-fondo-borroso");
    vistaActual = null;
    actualizarImagenNavbar(true);
}

function colapsarNavbar() {
    if (!navbarNav?.classList.contains("show")) {
        return;
    }

    const instanciaCollapse = bootstrap.Collapse.getOrCreateInstance(navbarNav, {
        toggle: false
    });
    instanciaCollapse.hide();
}

function actualizarImagenNavbar(esInicio) {
    if (!navbarImagenInicio) {
        return;
    }

    navbarImagenInicio.src = esInicio ? "assets/img/logos/logo.png" : "assets/img/varios/flecha izquierda.png";
    navbarImagenInicio.alt = esInicio ? "Logo" : "Flecha izquierda";
    navbarImagenInicio.width = 30;
    navbarImagenInicio.height = 30;
}
