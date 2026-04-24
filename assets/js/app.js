const CriticoView = {
  criticoTipoGcElement: null,
  criticoTipoRadios: null,

  init() {
    this.criticoTipoGcElement = document.getElementById('critico_tipo_gc');
    this.criticoTipoRadios = document.querySelectorAll('input[name="critico_tipo"]');

    if (!this.criticoTipoGcElement || !this.criticoTipoRadios.length) {
      return;
    }

    this.criticoTipoRadios.forEach((radio) => {
      radio.addEventListener('change', () => this.updateVisibility());
    });

    this.updateVisibility();
  },

  updateVisibility() {
    const selectedRadio = Array.from(this.criticoTipoRadios).find((radio) => radio.checked);
    const shouldShow = selectedRadio && (selectedRadio.id === 'magico_gc' || selectedRadio.id === 'fisico_gc');

    if (shouldShow) {
      this.criticoTipoGcElement.classList.remove('d-none');
    } else {
      this.criticoTipoGcElement.classList.add('d-none');
    }
  }
};

const AttackView = {
  tamaniosElement: null,
  dadosInput: null,
  bonifPosInput: null,
  bonifNegInput: null,
  clearButton: null,

  init() {
    this.tamaniosElement = document.getElementById('tamanios');
    this.dadosInput = document.getElementById('dadosInput');
    this.bonifPosInput = document.getElementById('bonifPosInput');
    this.bonifNegInput = document.getElementById('bonifNegInput');
    this.clearButton = document.getElementById('clearInputsBtn');
  },

  update(model) {
    if (!this.tamaniosElement) {
      return;
    }

    if (model.isGarraOrAgarre()) {
      this.tamaniosElement.classList.remove('d-none');
    } else {
      this.tamaniosElement.classList.add('d-none');
    }
  },

  clearInputs() {
    if (this.dadosInput) this.dadosInput.value = '';
    if (this.bonifPosInput) this.bonifPosInput.value = '';
    if (this.bonifNegInput) this.bonifNegInput.value = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AttackController.init();
  CriticoView.init();
  AttackView.init();
});
