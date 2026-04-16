export const CriticoView = {
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
