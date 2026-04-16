export const AttackModel = {
  selectedAttackId: null,

  setSelectedAttack(id) {
    this.selectedAttackId = id;
  },

  isGarraOrAgarre() {
    return this.selectedAttackId === 'GARRA' || this.selectedAttackId === 'AGARRE';
  }
};
