import { AttackController } from './controllers/controlador.js';
import { CriticoView } from './views/critico.js';

document.addEventListener('DOMContentLoaded', () => {
  AttackController.init();
  CriticoView.init();
});
