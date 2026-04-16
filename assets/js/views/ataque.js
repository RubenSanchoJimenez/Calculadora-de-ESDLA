export const AttackView = {
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
