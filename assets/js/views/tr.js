export const tr = {
    init() {
        registrarBotonLimpiarResistencia();
    }
};

const btnLimpiarResistencia = document.getElementById("btn_limpiar_resistencia");
const resistenciaDados = document.getElementById("resistencia_dados");
const resistenciaNivelOrigen = document.getElementById("resistencia_nivel_origen");
const resistenciaNivelReceptor = document.getElementById("resistencia_nivel_receptor");
const resistenciaBonificacion = document.getElementById("resistencia_bonificacion");
const resistenciaOtraBonificacion = document.getElementById("resistencia_otra_bonificacion");

function registrarBotonLimpiarResistencia() {
    if (!btnLimpiarResistencia) {
        return;
    }

    btnLimpiarResistencia.addEventListener("click", () => {
        limpiarCamposResistencia();
    });
}

function limpiarCamposResistencia() {
    resistenciaDados.value = "";
    resistenciaNivelOrigen.value = "";
    resistenciaNivelReceptor.value = "";
    resistenciaBonificacion.value = "";
    resistenciaOtraBonificacion.value = "";
}
