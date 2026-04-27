export const me = {
    init() {
        registrarBotonLimpiarMe();
    }
};

const btnLimpiarMe = document.getElementById("btn_limpiar_me");
const meDados = document.getElementById("me_dados");
const meBonificador = document.getElementById("me_bonificador");

function registrarBotonLimpiarMe() {
    if (!btnLimpiarMe) {
        return;
    }

    btnLimpiarMe.addEventListener("click", () => {
        limpiarCamposMe();
    });
}

function limpiarCamposMe() {
    meDados.value = "";
    meBonificador.value = "";
}
