export const mm = {
    init() {
        registrarBotonLimpiarMm();
    }
};

const btnLimpiarMm = document.getElementById("btn_limpiar_mm");
const mmDados = document.getElementById("mm_dados");
const mmBonus = document.getElementById("mm_bonus");
const mmOtros = document.getElementById("mm_otros");

function registrarBotonLimpiarMm() {
    if (!btnLimpiarMm) {
        return;
    }

    btnLimpiarMm.addEventListener("click", () => {
        limpiarCamposMm();
    });
}

function limpiarCamposMm() {
    mmDados.value = "";
    mmBonus.value = "";
    mmOtros.value = "";
}
