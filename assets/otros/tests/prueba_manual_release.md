# Prueba manual de release

Fecha recomendada de ejecucion: antes de publicar cada release.

## Preparacion

1. Servir el proyecto desde un servidor local o GitHub Pages.
2. Abrir `index.html` desde navegador.
3. Confirmar que la pantalla inicial carga con imagen, navbar y botones principales.
4. Abrir la consola del navegador y comprobar que no aparecen errores JavaScript al cargar.

## Flujos a validar

### 1. Ataque con critico

1. Entrar en `Ataque`.
2. Seleccionar un tipo de ataque, armadura y dados/modificadores que produzcan un resultado con letra de critico.
3. Pulsar `CALCULAR`.
4. Confirmar que aparece el resultado.
5. Confirmar que se abre el popup de critico.
6. Pulsar `SI`.
7. Confirmar que se abre la vista `Critico` con letra y tipo preseleccionados.

Resultado esperado: el flujo llega a Critico sin errores y conserva la preseleccion.

### 2. Ataque con pifia

1. Entrar en `Ataque`.
2. Seleccionar un tipo de ataque con tabla que pueda devolver `F`.
3. Introducir una tirada que produzca pifia.
4. Pulsar `CALCULAR`.
5. Confirmar que se abre el popup de pifia.
6. Pulsar `SI`.
7. Confirmar que se abre la vista `Pifia` con tipo/subtipo preseleccionados cuando aplique.

Resultado esperado: el flujo llega a Pifia sin errores.

### 3. Hechizo basico con TR

1. Entrar en `Hechizo`.
2. Seleccionar `Basico`.
3. Rellenar tipo de lanzamiento, armaduras, dados, niveles, nivel de hechizo, asaltos de preparacion y distancia.
4. Pulsar `CALCULAR`.
5. Confirmar que muestra modificador de TR, tirada del blanco, umbral y resultado.

Resultado esperado: el calculo de TR usa `assets/js/lib/resistencia.js` y no genera errores.

### 4. Hechizo dirigido con critico

1. Entrar en `Hechizo`.
2. Seleccionar `Dirigido`.
3. Rellenar subtipo, armadura, dados, asaltos y distancia.
4. Usar valores que produzcan resultado con letra de critico.
5. Pulsar `CALCULAR`.
6. Confirmar popup de critico y preseleccion en la vista `Critico`.

Resultado esperado: el grupo de armadura de hechizo dirigido no interfiere con Ataque ni Bola.

### 5. MM con resultado F y popup de pifia

1. Entrar en `MM`.
2. Seleccionar dificultad.
3. Introducir una tirada total que devuelva `F`.
4. Pulsar `CALCULAR`.
5. Confirmar popup de pifia.
6. Pulsar `SI`.
7. Confirmar que Pifia abre con `Maniobra de movimiento` y dificultad equivalente preseleccionadas.

Resultado esperado: los IDs `mm_*` se traducen correctamente a `pifia_mm_*`.

### 6. ME leer runas sin nivel y con nivel

1. Entrar en `ME`.
2. Seleccionar `Leer runas`.
3. Introducir dados, pero dejar vacio `Nivel de hechizo`.
4. Pulsar `CALCULAR`.
5. Confirmar mensaje de validacion.
6. Introducir nivel de hechizo.
7. Pulsar `CALCULAR` de nuevo.

Resultado esperado: sin nivel muestra error; con nivel calcula resultado.

### 7. Tabla informativa de experiencia

1. Entrar en `Otros`.
2. Pulsar `EXPERIENCIA POR NIVEL`.
3. Confirmar que carga la tabla desde `experiencia_nivel.json`.
4. Volver con la flecha del navbar.

Resultado esperado: no aparece error de carga y la navegacion vuelve a `Otros`.

### 8. Navegacion visual general

1. Desde Inicio, entrar en `Ataque`, `Hechizo`, `Critico`, `Pifia`, `ME`, `MM`, `Otros` y `TR`.
2. En cada vista, confirmar que solo queda visible la pantalla seleccionada y que el logo del navbar cambia a flecha de volver.
3. Pulsar la flecha de volver desde cada vista y confirmar retorno a Inicio.
4. Entrar en `Otros`, abrir cualquier tabla dinamica y pulsar la flecha de volver.
5. Confirmar que desde una tabla dinamica se vuelve a `Otros`, no directamente a Inicio.
6. Reducir el ancho del navegador a tamano movil y comprobar que el boton hamburguesa abre y cierra el navbar.

Resultado esperado: la navegacion es coherente en escritorio y movil, sin vistas solapadas ni errores en consola.

## Cierre

La release queda lista si:

- Los ocho flujos anteriores pasan.
- La consola del navegador no muestra errores JavaScript.
- `assets/otros/tests/validacion_estatica.ps1` devuelve `Validacion estatica OK`.
- `assets/otros/tests/calculos_funcionales.ps1` devuelve `Tests funcionales de calculo OK`.
