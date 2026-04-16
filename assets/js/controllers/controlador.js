import { AttackModel } from '../models/modelo.js';
import { AttackView } from '../views/ataque.js';

export const AttackController = {
  attackRadios: null,

  init() {
    AttackView.init();
    this.attackRadios = document.querySelectorAll('input[name="ataque"]');
    this.attachEvents();
    this.initializeModel();
    this.syncView();
  },

  attachEvents() {
    this.attackRadios.forEach((radio) => {
      radio.addEventListener('change', () => this.handleAttackChange(radio.id));
    });

    if (AttackView.clearButton) {
      AttackView.clearButton.addEventListener('click', () => this.handleClearClick());
    }
  },

  initializeModel() {
    const selected = document.querySelector('input[name="ataque"]:checked');
    if (selected) {
      AttackModel.setSelectedAttack(selected.id);
    }
  },

  handleAttackChange(selectedId) {
    AttackModel.setSelectedAttack(selectedId);
    this.syncView();
  },

  handleClearClick() {
    AttackView.clearInputs();
  },

  syncView() {
    AttackView.update(AttackModel);
  }
};
