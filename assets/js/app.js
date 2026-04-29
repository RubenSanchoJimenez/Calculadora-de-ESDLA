import { ataque } from "./views/ataque.js";
import { critico } from "./views/critico.js";
import { hechizo } from "./views/hechizo.js";
import { me } from "./views/me.js";
import { mm } from "./views/mm.js";
import { pifia } from "./views/pifia.js";
import { tr } from "./views/tr.js";
import { inicio } from "./views/inicio.js";
import { popupCritico } from "./views/popupCritico.js";

const app = {
    init() {
        me.init();
        mm.init();
        ataque.init();
        critico.init();
        hechizo.init();
        pifia.init();
        tr.init();
        popupCritico.init();
        inicio.init();
    }
};

app.init();
