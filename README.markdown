# Calculadora - ESDLA

Proyecto web estático para facilitar partidas de rol basadas en el manual **El Señor de los Anillos 2ª Edición** (MERP/ESDLA).

La aplicación agrupa cálculos y consultas frecuentes para agilizar la partida:

- Ataques.
- Hechizos.
- Críticos.
- Pifias.
- Tiradas de resistencia.
- Maniobras estáticas.
- Maniobras de movimiento.
- Tablas informativas.

El objetivo no es sustituir el manual ni la decisión del director de juego, sino reducir el tiempo de consulta y aplicar modificadores de forma consistente.

## Tecnologías

- **HTML5**: estructura principal en `index.html`.
- **CSS3**: estilos propios en `assets/css/styles.css`.
- **Bootstrap 5.3**: rejilla responsive, navbar, botones, tablas y utilidades visuales.
- **JavaScript ES Modules**: lógica separada por vista en `assets/js/views/`.
- **Fetch API**: carga de tablas JSON desde `assets/tablas/`.
- **JSON**: almacenamiento de tablas de reglas y tablas informativas.
- **Arquitectura estática sin backend**: la aplicación funciona como cliente web.

> Bootstrap se carga desde CDN. Para uso completamente offline conviene servir una copia local.

## Estructura

```text
.
├── index.html
├── README.markdown
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   ├── js/
│   │   ├── app.js
│   │   ├── lib/
│   │   │   └── resistencia.js
│   │   └── views/
│   │       ├── ataque.js
│   │       ├── critico.js
│   │       ├── hechizo.js
│   │       ├── informativas.js
│   │       ├── inicio.js
│   │       ├── me.js
│   │       ├── mm.js
│   │       ├── pifia.js
│   │       ├── popupCritico.js
│   │       └── tr.js
│   ├── otros/
│   │   ├── El Señor de los Anillos 2a Ed (MERP).pdf
│   │   ├── reportes/
│   │   └── tests/
│   │       └── validacion_estatica.ps1
│   └── tablas/
│       ├── ataque/
│       ├── critico/
│       ├── hechizo/
│       ├── informativas/
│       ├── maniobra_estatica/
│       ├── maniobra_movimiento/
│       ├── pifia/
│       └── resistencia/
```

## Ejecución

La aplicación usa módulos ES y `fetch` para cargar JSON. Por eso es recomendable ejecutarla desde un servidor local, no abriendo `index.html` directamente con `file://`.

Opciones habituales:

- Extensión **Live Server** de VS Code.
- Cualquier servidor estático local.
- Despliegue GitHub Pages.

Proyecto desplegado:

<https://rubensanchojimenez.github.io/Calculadora-de-ESDLA/>

## Validación estática

El proyecto incluye un script de comprobación básica:

```powershell
powershell -ExecutionPolicy Bypass -File assets\otros\tests\validacion_estatica.ps1
```

Comprueba:

- Que no haya IDs duplicados en `index.html`.
- Que no queden referencias DOM obsoletas detectadas en revisiones anteriores.
- Que todos los JSON de `assets/tablas/` sean válidos.

## Navegación general

La navegación principal se gestiona en `assets/js/views/inicio.js`.

El menú principal permite acceder a:

- Ataque.
- Hechizo.
- Crítico.
- Pifia.
- ME.
- MM.
- Otros.
- TR.

Al entrar en una vista:

- Se oculta el menú principal.
- Se muestra la vista seleccionada.
- El fondo se desenfoca.
- El icono del navbar cambia del logo a una flecha de volver.

Al pulsar el logo/flecha:

- Si la vista actual es `vista-tabla-dinamica`, vuelve a `vista-otros`.
- En cualquier otro caso, vuelve al menú principal.

## Vistas

### Inicio

- ID: `menu-principal`
- Contiene la imagen principal y los botones de acceso a cada módulo.

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
- Tamaño para garra/agarrar.

Tablas usadas:

- `assets/tablas/ataque/ataque_filo.json`
- `assets/tablas/ataque/ataque_contundente.json`
- `assets/tablas/ataque/ataque_2manos.json`
- `assets/tablas/ataque/ataque_proyectil.json`
- `assets/tablas/ataque/ataque_garras.json`
- `assets/tablas/ataque/ataque_agarrar.json`

Comportamiento:

- Calcula el total.
- Aplica máximos por tamaño en garra/agarrar.
- Respeta `sin_Modificador`.
- Abre popup de crítico si el resultado incluye letra de crítico.
- Abre popup de pifia si el resultado es `F`.

### Hechizo

- ID: `vista-hechizo`
- JS: `assets/js/views/hechizo.js`

Tipos:

- Hechizo básico.
- Hechizo dirigido.
- Hechizo de bola.

Tablas usadas:

- `assets/tablas/hechizo/hechizo_basico.json`
- `assets/tablas/hechizo/hechizo_dirigido.json`
- `assets/tablas/hechizo/hechizo_bola.json`
- `assets/tablas/resistencia/resistencia.json`

Comportamiento:

- Aplica modificadores de preparación, distancia, armadura y nivel.
- Calcula TR del blanco en hechizo básico.
- Respeta `sin_Modificador`.
- Usa popup de crítico o pifia cuando corresponde.

### Crítico

- ID: `vista-critico`
- JS: `assets/js/views/critico.js`

Calcula resultados de crítico a partir de:

- Dados.
- Letra del crítico.
- Tipo de crítico.
- Subtipo de grandes criaturas cuando aplica.

Tablas usadas:

- `assets/tablas/critico/critico_modificaciones.json`
- `assets/tablas/critico/critico_tirada.json`

### Pifia

- ID: `vista-pifia`
- JS: `assets/js/views/pifia.js`

Tipos de pifia:

- Arma empuñada.
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
- Bonificación.
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

### Maniobra Estática

- ID: `vista-maniobra-estatica`
- JS: `assets/js/views/me.js`

Tipos:

- General.
- Influencia e interacción.
- Percepción y rastrear.
- Desactivar trampas y abrir cerraduras.
- Leer runas y usar objetos.

Tablas usadas:

- `assets/tablas/maniobra_estatica/me_tirada.json`
- `assets/tablas/maniobra_estatica/me_modificadores.json`

Para `leer runas`, el nivel de hechizo es obligatorio.

### Otros

- ID: `vista-otros`

Pantalla de acceso a tablas informativas.

### Tabla Dinámica

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

### ¿Qué es esto?

- ID: `vista-que-es-esto`

Vista informativa sobre el propósito de la herramienta.

### ¿Quiénes somos?

- ID: `vista-quienes-somos`

Vista de presentación profesional de Rubén Sancho Jiménez.

## Popup de Crítico y Pifia

- ID: `contenedor_popup`
- JS: `assets/js/views/popupCritico.js`

Se abre cuando:

- Un ataque o hechizo produce un resultado con letra de crítico.
- Un ataque, hechizo o MM produce `F`.

Puede redirigir a:

- `vista-critico`
- `vista-pifia`

Cuando es posible, preselecciona los radios relacionados con el resultado.

## Datos

Las reglas están desacopladas del código y almacenadas en JSON.

Ventajas:

- Las tablas pueden corregirse sin reescribir la lógica principal.
- Cada módulo carga solo los JSON que necesita.
- Se usa cache en memoria para evitar recargar la misma tabla varias veces.

## Limitaciones

- La aplicación automatiza consultas y cálculos, pero no reemplaza la interpretación de reglas del manual.
- Algunas decisiones siguen dependiendo del director de juego.
- La precisión depende de que las tablas JSON estén correctamente transcritas.
- Bootstrap depende de CDN salvo que se añada una copia local.

## Autor

Rubén Sancho Jiménez  
LinkedIn: <https://www.linkedin.com/in/ruben-sancho-jimenez/>
