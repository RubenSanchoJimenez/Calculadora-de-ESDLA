export const AttackView = {
  tamaniosElement: null,

  init() {
    this.tamaniosElement = document.getElementById('tamanios');
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
  }
};
