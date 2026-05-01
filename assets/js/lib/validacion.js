export function esEnteroEnRango(valor, minimo, maximo = Number.POSITIVE_INFINITY) {
    return Number.isInteger(valor) && valor >= minimo && valor <= maximo;
}

export function validarEnteroEnRango(valor, minimo, maximo = Number.POSITIVE_INFINITY) {
    return esEnteroEnRango(valor, minimo, maximo) ? null : { minimo, maximo };
}

export function describirRango({ minimo, maximo }) {
    if (maximo === Number.POSITIVE_INFINITY) {
        return `entero mayor o igual que ${minimo}`;
    }

    return `entero entre ${minimo} y ${maximo}`;
}
