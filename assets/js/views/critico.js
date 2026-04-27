export const critico = {
    init() {
        registrarBotonLimpiarCritico();
    }
};

const btnLimpiarCritico = document.getElementById("btn_limpiar_critico");
const criticoDados = document.getElementById("critico_dados");

function registrarBotonLimpiarCritico() {
    if (!btnLimpiarCritico) {
        return;
    }

    btnLimpiarCritico.addEventListener("click", () => {
        limpiarCamposCritico();
    });
}

function limpiarCamposCritico() {
    criticoDados.value = "";
}
