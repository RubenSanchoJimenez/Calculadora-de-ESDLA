export const pifia = {
    init() {
        registrarBotonLimpiarPifia();
    }
};

const btnLimpiarPifia = document.getElementById("btn_limpiar_pifia");
const pifiaDados = document.getElementById("pifia_dados");

function registrarBotonLimpiarPifia() {
    if (!btnLimpiarPifia) {
        return;
    }

    btnLimpiarPifia.addEventListener("click", () => {
        limpiarCamposPifia();
    });
}

function limpiarCamposPifia() {
    pifiaDados.value = "";
}
