# Calculadora - ESDLA

Proyecto web estatico para facilitar partidas de rol basadas en el manual **El Senor de los Anillos 2a Edicion** (MERP/ESDLA).

La aplicacion agrupa calculos y consultas frecuentes para agilizar la partida:

- Ataques.
- Hechizos.
- Criticos.
- Pifias.
- Tiradas de resistencia.
- Maniobras estaticas.
- Maniobras de movimiento.
- Tablas informativas.

El objetivo no es sustituir el manual ni la decision del director de juego, sino reducir el tiempo de consulta y aplicar modificadores de forma consistente.

## Tecnologias

- **HTML5**: estructura principal en `index.html`.
- **CSS3**: estilos propios en `assets/css/styles.css`.
- **Bootstrap 5.3**: rejilla responsive, navbar, botones, tablas y utilidades visuales.
- **JavaScript ES Modules**: logica separada por vista en `assets/js/views/`.
- **Fetch API**: carga de tablas JSON desde `assets/tablas/`.
- **JSON**: almacenamiento de tablas de reglas y tablas informativas.
- **Arquitectura estatica sin backend**: la aplicacion funciona como cliente web.

> Bootstrap se carga desde CDN. Para uso completamente offline conviene servir una copia local.

## Estructura

```text
.
|-- index.html
|-- README.md
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   |-- img/
|   |-- js/
|   |   |-- app.js
|   |   |-- lib/
|   |   |   `-- resistencia.js
|   |   `-- views/
|   |       |-- ataque.js
|   |       |-- critico.js
|   |       |-- hechizo.js
|   |       |-- informativas.js
|   |       |-- inicio.js
|   |       |-- me.js
|   |       |-- mm.js
|   |       |-- pifia.js
|   |       |-- popupCritico.js
|   |       `-- tr.js
|   |-- otros/
|   |   |-- El Senor de los Anillos 2a Ed (MERP).pdf
|   |   |-- reportes/
|   |   `-- tests/
|   |       |-- prueba_manual_release.md
|   |       `-- validacion_estatica.ps1
|   `-- tablas/
|       |-- ataque/
|       |-- critico/
|       |-- hechizo/
|       |-- informativas/
|       |-- maniobra_estatica/
|       |-- maniobra_movimiento/
|       |-- pifia/
|       `-- resistencia/
```

## Ejecucion

La aplicacion usa modulos ES y `fetch` para cargar JSON. Por eso es recomendable ejecutarla desde un servidor local, no abriendo `index.html` directamente con `file://`.

Opciones habituales:

- Extension **Live Server** de VS Code.
- Cualquier servidor estatico local.
- Despliegue GitHub Pages.

Proyecto desplegado:

<https://rubensanchojimenez.github.io/Calculadora-de-ESDLA/>

## Validacion estatica

El proyecto incluye un script de comprobacion basica:

```powershell
powershell -ExecutionPolicy Bypass -File assets\otros\tests\validacion_estatica.ps1
```

Comprueba:

- Que no haya IDs duplicados en `index.html`.
- Que no queden referencias DOM obsoletas detectadas en revisiones anteriores.
- Que todos los JSON de `assets/tablas/` sean validos.

## Prueba manual de release

La guia de prueba manual esta en:

```text
assets/otros/tests/prueba_manual_release.md
```

Recorre los flujos principales recomendados antes de publicar una release:

- Ataque con critico.
- Ataque con pifia.
- Hechizo basico con TR.
- Hechizo dirigido con critico.
- MM con resultado `F` y popup de pifia.
- ME leer runas sin nivel y con nivel.
- Tabla informativa de experiencia.

## Navegacion general

La navegacion principal se gestiona en `assets/js/views/inicio.js`.

El menu principal permite acceder a:

- Ataque.
- Hechizo.
- Critico.
- Pifia.
- ME.
- MM.
- Otros.
- TR.

Al entrar en una vista:

- Se oculta el menu principal.
- Se muestra la vista seleccionada.
- El fondo se desenfoca.
- El icono del navbar cambia del logo a una flecha de volver.

Al pulsar el logo/flecha:

- Si la vista actual es `vista-tabla-dinamica`, vuelve a `vista-otros`.
- En cualquier otro caso, vuelve al menu principal.

## Vistas

### Inicio

- ID: `menu-principal`
- Contiene la imagen principal y los botones de acceso a cada modulo.

### Ataque

- ID: `vista-ataque`
- JS: `assets/js/views/ataque.js`

Permite calcular ataques con arma o ataques naturales.

Tipos:

- Filo.
- Contundente.
- Dos manos.
- Proyectil.
- Garra.
- Agarre.

Entradas principales:

- Dados.
- Bonificador positivo.
- Bonificador negativo.
- Armadura del objetivo.
- Modificadores situacionales.
- Tamano para garra/agarrar.

Tablas usadas:

- `assets/tablas/ataque/ataque_filo.json`
- `assets/tablas/ataque/ataque_contundente.json`
- `assets/tablas/ataque/ataque_2manos.json`
- `assets/tablas/ataque/ataque_proyectil.json`
- `assets/tablas/ataque/ataque_garras.json`
- `assets/tablas/ataque/ataque_agarrar.json`

Comportamiento:

- Calcula el total.
- Aplica maximos por tamano en garra/agarrar.
- Respeta `sin_Modificador`.
- Abre popup de critico si el resultado incluye letra de critico.
- Abre popup de pifia si el resultado es `F`.

### Hechizo

- ID: `vista-hechizo`
- JS: `assets/js/views/hechizo.js`

Tipos:

- Hechizo basico.
- Hechizo dirigido.
- Hechizo de bola.

Tablas usadas:

- `assets/tablas/hechizo/hechizo_basico.json`
- `assets/tablas/hechizo/hechizo_dirigido.json`
- `assets/tablas/hechizo/hechizo_bola.json`
- `assets/tablas/resistencia/resistencia.json`

Comportamiento:

- Aplica modificadores de preparacion, distancia, armadura y nivel.
- Calcula TR del blanco en hechizo basico.
- Respeta `sin_Modificador`.
- Usa popup de critico o pifia cuando corresponde.

### Critico

- ID: `vista-critico`
- JS: `assets/js/views/critico.js`

Calcula resultados de critico a partir de:

- Dados.
- Letra del critico.
- Tipo de critico.
- Subtipo de grandes criaturas cuando aplica.

Tablas usadas:

- `assets/tablas/critico/critico_modificaciones.json`
- `assets/tablas/critico/critico_tirada.json`

### Pifia

- ID: `vista-pifia`
- JS: `assets/js/views/pifia.js`

Tipos de pifia:

- Arma empunada.
- Arma proyectil.
- Hechizo.
- Maniobra de movimiento.

Tablas usadas:

- `assets/tablas/pifia/pifia_modificadores.json`
- `assets/tablas/pifia/pifia_tirada.json`

### Tirada de Resistencia

- ID: `vista-resistencia`
- JS: `assets/js/views/tr.js`
- Utilidad compartida: `assets/js/lib/resistencia.js`

Entradas:

- Dados.
- Nivel del atacante.
- Nivel del blanco.
- Bonificacion.
- Otros bonificadores.
- No resiste voluntariamente `-50 TR`.

Tabla usada:

- `assets/tablas/resistencia/resistencia.json`

### Maniobra de Movimiento

- ID: `vista-maniobra-movimiento`
- JS: `assets/js/views/mm.js`

Entradas:

- Dados.
- Bonus MM.
- Otros modificadores.
- Dificultad.
- Estados: aturdido, derribado, extremidad inutilizada.

Tabla usada:

- `assets/tablas/maniobra_movimiento/mm_tirada.json`

Si el resultado es `F`, abre el popup de pifia con MM preseleccionado.

### Maniobra Estatica

- ID: `vista-maniobra-estatica`
- JS: `assets/js/views/me.js`

Tipos:

- General.
- Influencia e interaccion.
- Percepcion y rastrear.
- Desactivar trampas y abrir cerraduras.
- Leer runas y usar objetos.

Tablas usadas:

- `assets/tablas/maniobra_estatica/me_tirada.json`
- `assets/tablas/maniobra_estatica/me_modificadores.json`

Para `leer runas`, el nivel de hechizo es obligatorio.

### Otros

- ID: `vista-otros`

Pantalla de acceso a tablas informativas.

### Tabla Dinamica

- ID: `vista-tabla-dinamica`
- JS: `assets/js/views/informativas.js`

Tablas disponibles:

- `bonificador_caracteristicas.json`
- `experiencia_nivel.json`
- `grado_idiomas.json`
- `modificaciones_raza.json`
- `penalizacion_peso.json`
- `puntos_criticos.json`
- `puntos_hechizos.json`
- `puntos_maniobras.json`
- `puntos_muertes.json`

Renderiza el JSON seleccionado como tabla HTML. Si una celda contiene objetos o arrays, crea tablas internas.

### Que es esto

- ID: `vista-que-es-esto`

Vista informativa sobre el proposito de la herramienta.

### Quienes somos

- ID: `vista-quienes-somos`

Vista de presentacion profesional de Ruben Sancho Jimenez.

## Popup de Critico y Pifia

- ID: `contenedor_popup`
- JS: `assets/js/views/popupCritico.js`

Se abre cuando:

- Un ataque o hechizo produce un resultado con letra de critico.
- Un ataque, hechizo o MM produce `F`.

Puede redirigir a:

- `vista-critico`
- `vista-pifia`

Cuando es posible, preselecciona los radios relacionados con el resultado.

## Datos

Las reglas estan desacopladas del codigo y almacenadas en JSON.

Ventajas:

- Las tablas pueden corregirse sin reescribir la logica principal.
- Cada modulo carga solo los JSON que necesita.
- Se usa cache en memoria para evitar recargar la misma tabla varias veces.

## Limitaciones

- La aplicacion automatiza consultas y calculos, pero no reemplaza la interpretacion de reglas del manual.
- Algunas decisiones siguen dependiendo del director de juego.
- La precision depende de que las tablas JSON esten correctamente transcritas.
- Bootstrap depende de CDN salvo que se anada una copia local.

## Autor

Ruben Sancho Jimenez  
LinkedIn: <https://www.linkedin.com/in/ruben-sancho-jimenez/>
