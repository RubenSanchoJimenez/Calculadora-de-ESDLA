const btnAtaque = document.getElementById("btn-inicio-ataque");
const btnHechizo = document.getElementById("btn-inicio-hechizo");
const btnCritico = document.getElementById("btn-inicio-critico");
const btnPifia = document.getElementById("btn-inicio-pifia");
const btnMe = document.getElementById("btn-inicio-me");
const btnMm = document.getElementById("btn-inicio-mm");
const btnTr = document.getElementById("btn-inicio-tr");
const btnVolverInicio = document.getElementById("btn-volver-inicio");
const body = document.body;

const menuPrincipal = document.getElementById("menu-principal");

const vistas = {
    ataque: document.getElementById("vista-ataque"),
    hechizo: document.getElementById("vista-hechizo"),
    critico: document.getElementById("vista-critico"),
    pifia: document.getElementById("vista-pifia"),
    me: document.getElementById("vita-maniobra-estatica"),
    mm: document.getElementById("vita-maniobra-movimiento"),
    tr: document.getElementById("vista-resistencia")
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
        registrarBotonInicio();
        mostrarInicio();
    }
};

function registrarBoton(boton, vista) {
    if (!boton || !vista) {
        return;
    }

    boton.addEventListener("click", () => {
        cerrarVistas();
        menuPrincipal?.classList.add("d-none");
        vista.classList.remove("d-none");
        body?.classList.add("con-fondo-borroso");
    });
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
        mostrarInicio();
    });
}

function mostrarInicio() {
    cerrarVistas();
    menuPrincipal?.classList.remove("d-none");
    body?.classList.remove("con-fondo-borroso");
}
