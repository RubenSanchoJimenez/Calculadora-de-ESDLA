CALCULADORA - ESDLA
===================

Proyecto web para facilitar partidas de rol basadas en el manual "El Señor de los Anillos 2ª Edición" (MERP/ESDLA).
La aplicación concentra cálculos y consultas de tablas frecuentes para agilizar el juego: ataques, hechizos, críticos,
pifias, tiradas de resistencia, maniobras estáticas, maniobras de movimiento y tablas informativas.

El objetivo no es sustituir al manual ni a la decisión del director de juego, sino reducir el tiempo de consulta y
aplicar modificadores de forma consistente durante la partida.


TECNOLOGÍAS UTILIZADAS
======================

- HTML5: estructura principal de la aplicación en index.html.
- CSS3: estilos propios en assets/css/styles.css.
- Bootstrap 5.3: rejilla responsive, navbar, botones, tablas y utilidades visuales.
- JavaScript ES Modules: lógica separada por vista en assets/js/views/*.js.
- Fetch API: carga de tablas JSON desde assets/tablas.
- JSON: almacenamiento de todas las tablas de reglas y tablas informativas.
- Arquitectura modular frontend sin backend: la aplicación funciona como cliente estático.


ESTRUCTURA DEL PROYECTO
=======================

- index.html
  Contiene todas las vistas de la aplicación, el navbar, el contenedor general y el popup compartido.

- assets/css/styles.css
  Define el estilo visual: botones, fondo, resultados, popup, tablas dinámicas, vistas informativas y navbar.

- assets/js/app.js
  Punto de entrada JavaScript. Inicializa todos los módulos de vista.

- assets/js/views/
  Contiene un archivo JavaScript por bloque funcional:
  - inicio.js
  - ataque.js
  - hechizo.js
  - critico.js
  - pifia.js
  - tr.js
  - mm.js
  - me.js
  - informativas.js
  - popupCritico.js

- assets/tablas/
  Contiene todas las tablas JSON utilizadas por la lógica:
  - ataque/
  - hechizo/
  - critico/
  - pifia/
  - resistencia/
  - maniobra_movimiento/
  - maniobra_estatica/
  - informativas/

- assets/img/
  Recursos visuales: logo, fondo, imagen de inicio y flecha de navegación.

- assets/otros/
  Incluye el PDF del manual de referencia.


NAVEGACIÓN GENERAL
==================

La navegación principal se gestiona desde assets/js/views/inicio.js.

El menú principal muestra botones para:
- Ataque
- Hechizo
- Crítico
- Pifia
- ME
- MM
- Otros
- TR

Cuando el usuario entra en una vista:
- Se oculta el menú principal.
- Se muestra la vista seleccionada.
- El fondo se desenfoca.
- El icono del navbar cambia del logo a una flecha de volver.

Cuando se pulsa la zona del logo/flecha:
- Si se está en vista-tabla-dinamica, vuelve a vista-otros.
- En cualquier otra vista, vuelve al menú principal.

Los enlaces del navbar abren:
- Inicio
- ¿Qué es esto?
- ¿Quiénes somos?

En dispositivos pequeños, al pulsar un enlace del navbar, el menú colapsado se cierra automáticamente.


VISTA DE INICIO
===============

ID: menu-principal

Es la pantalla de entrada de la aplicación. Contiene el logo/imagen principal y los botones que llevan a cada módulo.

Botones principales:
- btn-inicio-ataque
- btn-inicio-hechizo
- btn-inicio-critico
- btn-inicio-pifia
- btn-inicio-me
- btn-inicio-mm
- btn-inicio-otros
- btn-inicio-tr


VISTA DE ATAQUE
===============

ID: vista-ataque
Archivo JS: assets/js/views/ataque.js

Permite calcular resultados de ataques con arma o ataques naturales.

Tipos de ataque:
- Filo
- Contundente
- Dos manos
- Proyectil
- Garra
- Agarre

Entradas:
- Dados
- Bonificador positivo
- Bonificador negativo
- Armadura del objetivo
- Modificadores situacionales:
  - Flanco +15
  - Espalda +20
  - Sorpresa +20
  - Aturdido +20
- Tamaño para ataques de garra/agarre:
  - Diminuto
  - Pequeño
  - Mediano
  - Grande
  - Enorme

Tablas usadas:
- assets/tablas/ataque/ataque_filo.json
- assets/tablas/ataque/ataque_contundente.json
- assets/tablas/ataque/ataque_2manos.json
- assets/tablas/ataque/ataque_proyectil.json
- assets/tablas/ataque/ataque_garras.json
- assets/tablas/ataque/ataque_agarrar.json

Comportamiento:
- Calcula el total de ataque.
- Busca el tramo correspondiente en la tabla JSON.
- Muestra el resultado en ataque_texto_resultado.
- Si el resultado contiene una letra de crítico, por ejemplo 12T o 20C, abre el popup de crítico.
- Si el resultado es F, abre el popup de pifia.
- Si una fila de tabla tiene sin_Modificador: 1 y el dado natural cae en ese tramo, consulta con el dado natural sin aplicar modificadores.


VISTA DE HECHIZO
================

ID: vista-hechizo
Archivo JS: assets/js/views/hechizo.js

Permite resolver diferentes tipos de hechizo.

Tipos:
- Hechizo básico
- Hechizo dirigido
- Hechizo de bola

Hechizo básico:
- Tipo de lanzamiento:
  - Esencia
  - Canalización
- Armadura del lanzador
- Armadura del receptor
- Dados del lanzador
- Dados del objetivo
- Nivel lanzador
- Nivel receptor
- Nivel hechizo
- BO de hechizo básico
- Bonificación de resistencia
- Bonificadores positivos y negativos
- Asaltos de preparación
- Distancia
- Blanco estático
- Blanco voluntario

Hechizo dirigido:
- Subtipo de hechizo dirigido
- Armadura del objetivo
- Dados
- Bonificadores
- Asaltos de preparación
- Distancia
- Escudo

Hechizo de bola:
- Bola de frío
- Bola de fuego
- Armadura del objetivo
- Dados
- Bonificadores
- Asaltos de preparación
- Distancia
- Objetivo en el centro

Tablas usadas:
- assets/tablas/hechizo/hechizo_basico.json
- assets/tablas/hechizo/hechizo_dirigido.json
- assets/tablas/hechizo/hechizo_bola.json
- assets/tablas/resistencia/resistencia.json

Comportamiento:
- Aplica modificadores de preparación, distancia, armadura y nivel.
- Consulta las tablas JSON correspondientes.
- En hechizo básico calcula también la tirada de resistencia.
- Si el resultado de impacto incluye crítico, abre el popup de crítico.
- Si el resultado es F, abre el popup de pifia.
- Respeta sin_Modificador: 1 en tablas de hechizo: si el dado natural cae en ese tramo, usa el dado natural sin modificadores.


VISTA DE CRÍTICO
================

ID: vista-critico
Archivo JS: assets/js/views/critico.js

Permite calcular el resultado de un crítico.

Entradas:
- Dados
- Letra del crítico:
  - T
  - A
  - B
  - C
  - D
  - E
- Tipo de crítico:
  - Calor
  - Frío
  - Eléctrico
  - Impacto
  - Aplastamiento
  - Tajo
  - Perforante
  - Desequilibrante
  - Presa
  - Físico GC
  - Mágico GC

Para críticos de grandes criaturas:
- Arma normal o garras/dientes
- Arma mágica
- Arma mithril
- Arma sagrada
- Arma exterminadora

Tablas usadas:
- assets/tablas/critico/critico_modificaciones.json
- assets/tablas/critico/critico_tirada.json

Comportamiento:
- Obtiene el modificador según tipo y letra.
- Suma dados + modificador.
- Busca el resultado textual en la tabla de tirada.
- Muestra el resultado en critico_texto_resultado.


VISTA DE PIFIA
==============

ID: vista-pifia
Archivo JS: assets/js/views/pifia.js

Permite calcular pifias de diferentes tipos de acción.

Tipos de acción:
- Arma empuñada
- Arma proyectil
- Hechizo
- Maniobra de movimiento

Cada tipo muestra su bloque de opciones correspondiente:
- pifia_arma_empunada_seleccion
- pifia_arma_proyectil_seleccion
- pifia_hechizo_seleccion
- pifia_mm_seleccion

Tablas usadas:
- assets/tablas/pifia/pifia_modificadores.json
- assets/tablas/pifia/pifia_tirada.json

Comportamiento:
- Muestra solo el bloque correspondiente al tipo de pifia seleccionado.
- Calcula dados + modificador de pifia.
- En arma empuñada puede sumar el modificador de montura.
- Busca el resultado en pifia_tirada.json.
- Muestra el resultado en pifia_texto_resultado.


VISTA DE TIRADA DE RESISTENCIA
==============================

ID: vista-resistencia
Archivo JS: assets/js/views/tr.js

Permite calcular tiradas de resistencia.

Entradas:
- Dados
- Nivel del atacante
- Nivel del blanco
- Bonificación
- Otros bonificadores
- Blanco voluntario

Tabla usada:
- assets/tablas/resistencia/resistencia.json

Comportamiento:
- Ajusta niveles y modificadores.
- Calcula el umbral de resistencia.
- Indica si el blanco resiste o no.


VISTA DE MANIOBRA DE MOVIMIENTO
===============================

ID: vita-maniobra-movimiento
Archivo JS: assets/js/views/mm.js

Permite calcular maniobras de movimiento.

Entradas:
- Dados
- Bonus MM
- Otros modificadores
- Dificultad:
  - Rutinaria
  - Muy fácil
  - Fácil
  - Media
  - Difícil
  - Muy difícil
  - Extremadamente difícil
  - Locura completa
  - Absurdo
- Estados:
  - Aturdido -50
  - Derribado -70
  - Extremidad inutilizada -30

Tabla usada:
- assets/tablas/maniobra_movimiento/mm_tirada.json

Comportamiento:
- Calcula dados + bonus + otros + penalizadores.
- Busca el resultado según dificultad.
- Si el resultado es numérico, lo muestra como x/100.
- Si el resultado es F, abre el popup de pifia con MM preseleccionado.


VISTA DE MANIOBRA ESTÁTICA
==========================

ID: vista-maniobra-estatica
Archivo JS: assets/js/views/me.js

Permite calcular maniobras estáticas.

Tipos de maniobra:
- General
- Influencia e interacción
- Percepción y rastrear
- Desactivar trampas y abrir cerraduras
- Leer runas y usar objetos

Bloques seleccionables:
- me_general_seleccion
- me_influencia_seleccion
- me_percepcion_seleccion
- me_leer_runas_seleccion

Regla de visibilidad:
- me_general_seleccion se muestra en todas las maniobras excepto leer runas.
- Las maniobras de influencia y percepción añaden modificadores específicos.
- Leer runas muestra su bloque propio.

Entradas:
- Dados
- Bonificador
- Dificultad
- Modificadores específicos:
  - Público devoto +50
  - Público a sueldo +20
  - Búsqueda pausada +20
  - Dominio propio
  - Sé qué hechizo es
  - Tengo el hechizo
- Nivel de hechizo para leer runas

Tablas usadas:
- assets/tablas/maniobra_estatica/me_tirada.json
- assets/tablas/maniobra_estatica/me_modificadores.json

Comportamiento:
- Calcula dados + bonificador + modificadores específicos - nivel de hechizo + modificador de dificultad.
- Busca el resultado en me_tirada.json.
- Muestra el resultado en me_texto_resultado.


VISTA OTROS
===========

ID: vista-otros

Pantalla de acceso a tablas informativas.

Botones:
- btn-otros-bonificador-caracteristicas
- btn-otros-experiencia-por-nivel
- btn-otros-grado-idiomas
- btn-otros-modificadores-raza
- btn-otros-penalizacion-peso
- btn-otros-puntos-por-critico
- btn-otros-puntos-por-hechizo
- btn-otros-puntos-por-maniobra
- btn-otros-puntos-por-muerte

Cada botón carga una tabla JSON informativa en vista-tabla-dinamica.


VISTA TABLA DINÁMICA
====================

ID: vista-tabla-dinamica
Archivo JS: assets/js/views/informativas.js

Muestra tablas informativas cargadas desde assets/tablas/informativas.

Tablas disponibles:
- bonificador_caracteristicas.json
- experiacia_nivel.json
- grado_idiomas.json
- modificaciones_raza.json
- penalizacion_peso.json
- puntos_criticos.json
- puntos_hechizos.json
- puntos_maniobras.json
- puntos_muertes.json

Comportamiento:
- Carga el JSON correspondiente al botón pulsado.
- Genera una tabla HTML de forma dinámica.
- Si una celda contiene objetos o arrays, los muestra como tablas internas.
- puntos_criticos.json se limita hasta nivel_oponente 10.
- puntos_hechizos.json se transforma en filas por nivel_personaje y una tabla interna de nivel/valor.
- puntos_muertes.json se transforma de forma similar, con nivel_personaje y nivel_oponente.
- penalizacion_peso.json renombra las cabeceras a peso min, peso max y cargas.


VISTA ¿QUÉ ES ESTO?
===================

ID: vista-que-es-esto

Vista informativa que explica el propósito del proyecto:
- Facilitar el juego de rol con "El Señor de los Anillos 2ª Edición".
- Reducir consultas manuales.
- Agilizar cálculos.
- Servir de apoyo al director de juego y jugadores.


VISTA ¿QUIÉNES SOMOS?
=====================

ID: vista-quienes-somos

Vista de presentación profesional de Rubén Sancho Jiménez.

Resume:
- Experiencia en automatización de procesos (RPA).
- Uso de IA y Big Data.
- Certificación Blue Prism Developer.
- Formación Azure AI Engineer Associate.
- Herramientas: UiPath, Blue Prism, Azure Cognitive Services.
- Experiencia full stack: Angular, Spring Boot, MySQL.
- Enlace al perfil de LinkedIn.


POPUP DE CRÍTICO / PIFIA
========================

ID: contenedor_popup
Archivo JS: assets/js/views/popupCritico.js

Popup compartido que se abre cuando:
- Un ataque o hechizo produce un resultado con letra de crítico.
- Un ataque, hechizo o maniobra de movimiento produce F.

Elementos:
- popup_titulo_critico
- popup_titulo_pifia
- popup_texto_resultado
- btn_popup_no
- btn_popup_si

Comportamiento:
- En modo crítico, muestra "¿Calcular crítico?".
- En modo pifia, muestra "¿Calcular pifia?".
- NO cierra el popup.
- SI lleva a vista-critico o vista-pifia según corresponda.
- Preselecciona, cuando es posible, los radios relacionados con el resultado.


ESTILOS PRINCIPALES
===================

Archivo:
- assets/css/styles.css

Incluye:
- Fondo general con imagen y blur al entrar en vistas.
- Botones verdes con gradiente.
- Resultados adaptables en altura.
- Popup centrado con fondo desenfocado.
- Tabla dinámica responsive con cabecera fija.
- Tablas internas para objetos JSON anidados.
- Vistas informativas con fondo blanco semitransparente.
- Navbar responsive con color blanco cuando está colapsado.


TABLAS JSON Y DATOS
===================

Las reglas están desacopladas del código JavaScript y almacenadas en JSON.

Ventajas:
- Las tablas pueden modificarse sin reescribir la lógica principal.
- Cada módulo carga solo los JSON que necesita.
- Se usa cache en memoria para evitar recargar la misma tabla varias veces.


NOTAS DE USO
============

La aplicación es estática, pero usa módulos ES y fetch para cargar JSON. Por ello, es recomendable ejecutarla desde
un servidor local en vez de abrir index.html directamente con file://.

El proyecto esta desplegado en:
https://rubensanchojimenez.github.io/Calculadora-de-ESDLA/

Ejemplos:
- Extensión Live Server de VS Code.
- Servidor local simple.
- Cualquier servidor estático que sirva la carpeta del proyecto.


LIMITACIONES
============

- La aplicación automatiza consultas y cálculos, pero no reemplaza la interpretación de reglas del manual.
- Algunas decisiones de juego siguen dependiendo del director de juego.
- La precisión depende de que las tablas JSON estén correctamente transcritas.


AUTOR
=====

Rubén Sancho Jiménez
LinkedIn: https://www.linkedin.com/in/ruben-sancho-jimenez/
