export const ataque = {
    init() {
        registrarVisibilidadTamanios();
        registrarBotonLimpiar();
    }
};

const radiosAtaque = document.querySelectorAll('input[name="ataque"]');
const ataqueGarra = document.getElementById("ataque_garra");
const ataqueAgarre = document.getElementById("ataque_agarre");
const ataqueTamanios = document.getElementById("ataque_tamanios");
const btnAtaqueLimpiar = document.getElementById("btn_ataque_limpiar");
const btnAtaqueDados = document.getElementById("btn_ataque_dados");
const btnAtaqueBonificadorPos = document.getElementById("btn_ataque_bonificador_pos");
const btnAtaqueBonificadorNeg = document.getElementById("btn_ataque_bonificador_neg");

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

function limpiarCamposAtaque() {
    btnAtaqueDados.value = "";
    btnAtaqueBonificadorPos.value = "";
    btnAtaqueBonificadorNeg.value = "";
}
