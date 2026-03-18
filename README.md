<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=MichaellAlavedraMunayco.portman">
    <img src="assets/logo.png" width="120px" />
  </a>
</p>

<h1 align="center">
  Portman: Recuperando el Control de tu Entorno de Desarrollo
</h1>

*EADDRINUSE: address already in use.*

Si eres desarrollador, es muy probable que hayas leído ese error cientos de veces. Estás en medio de un estado de *flow* profundo, listo para compilar y probar tu nueva funcionalidad, y de repente, tu servidor local se niega a iniciar porque un proceso fantasma ha secuestrado tu puerto.

¿La solución tradicional? Abrir una nueva terminal, recordar y escribir comandos arcanos como `lsof -i :3000` o `netstat -ano`, buscar manualmente el PID correcto, y ejecutar un `kill -9` rogando no haber cerrado el proceso equivocado.

Es un proceso tedioso, rompe la concentración y, honestamente, es una pérdida de tiempo inaceptable en el desarrollo moderno.

Por eso construí **Portman**.

[📸 Insertar captura: Vista principal demostrando el diseño minimalista de Portman en el panel lateral de VS Code, mostrando una lista clara de puertos ocupados]

---

## El Valor de la Eficiencia: Por Qué Creé Portman

Como ingeniero, valoro profundamente la **eficiencia y la paz mental**. Cada segundo que pasamos peleando con nuestro entorno de trabajo es un segundo que no estamos creando valor.

Diseñé Portman no solo como un simple plugin de VS Code, sino como una herramienta de productividad indispensable orientada a **eliminar la fricción diaria**. El objetivo era claro: mantenerte en tu zona de genialidad, directamente dentro de tu editor, sin cambios de contexto innecesarios.

### 🚀 Ventajas Absolutas

*   **Cero Cambios de Contexto:** Gestiona todos los puertos y procesos de tu máquina sin abandonar la interfaz de Visual Studio Code.
*   **Acción Inmediata (1-Click Kill):** Identifica qué aplicación está bloqueando tu puerto y terminala con un solo clic. Adiós a la memorización de PIDs y comandos de terminal.
*   **Visibilidad Total:** Obtén una visión clara y en tiempo real de qué servicios se están ejecutando y dónde.
*   **Diseño Nativo y Minimalista:** Se integra de manera fluida y elegante en la Activity Bar o el Panel de VS Code, sintiéndose como una extensión natural de tu IDE.
*   **Soporte Multiplataforma:** Soluciona el problema de los puertos independientemente de si estás en macOS, Windows o Linux.

[📸 Insertar GIF/Video corto: Demostración de un desarrollador encontrando un error "Port in use", abriendo Portman y liberando el puerto en menos de 2 segundos con un clic]

---

## Bajo el capó: Arquitectura y Stack

Si bien la interfaz es deliberadamente simple, el motor que impulsa a Portman está diseñado con un enfoque riguroso en la **robustez y la escalabilidad**. Como Arquitecto de esta solución, me aseguré de aplicar patrones de diseño sólidos que garanticen un rendimiento impecable a través de diferentes sistemas operativos.

*   **Arquitectura Limpia (Hexagonal):** El código fuente está estructurado en capas estrictas (`domain`, `infrastructure`, `presentation`, y `application`). Esto permite una separación clara de responsabilidades, haciendo que el código sea altamente testeable y fácil de mantener o expandir.
*   **TypeScript y Webpack:** Escrito íntegramente en TypeScript para seguridad de tipos y compilado con Webpack para optimizar el tamaño y la velocidad de carga de la extensión.
*   **Sistema de Detección Adaptativo:** La lógica de detección de puertos es inteligente y específica para cada Sistema Operativo:
    *   **Linux:** Prioriza el uso de `netstat`, con un graceful fallback a `ss` si el primero no está disponible.
    *   **Windows:** Utiliza comandos nativos optimizados (`netstat -a -b -n -o`).
    *   **macOS:** Emplea eficientemente `lsof -i -P -n`.
*   **SystemChecker:** Un servicio dedicado valida la disponibilidad de los comandos del sistema antes de la ejecución, asegurando una compatibilidad total con el entorno y previniendo fallos silenciosos.
*   **Gestión de Privilegios (Linux):** Implementé configuraciones personalizables (`portman.linux.asRootUser`) para permitir la terminación de procesos que requieren elevación de privilegios de forma segura.

[📸 Insertar captura: Fragmento de código limpio y bien documentado demostrando el patrón de Arquitectura Hexagonal y la inyección de dependencias en TypeScript]

---

## El Impacto

Portman es la materialización de mi filosofía como desarrollador: **construir herramientas que resuelvan problemas reales de forma elegante**. Al automatizar y simplificar la gestión de puertos, Portman devuelve incontables horas de productividad a los desarrolladores y elimina una frustración diaria persistente.

### ¿Listo para optimizar tu flujo de trabajo?

*   📥 **Prueba Portman gratis:** [Descárgalo desde el VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MichaellAlavedraMunayco.portman)
*   💻 **Explora el código:** Si te interesa la Arquitectura Limpia o quieres contribuir, siéntete libre de clonar y revisar este repositorio.
*   🤝 **¿Hablemos?** Si buscas un ingeniero apasionado por el rendimiento, la experiencia de usuario y la arquitectura de software de alta calidad, [contáctame para consultorías o nuevas oportunidades].

*Desarrollado con pasión por Michaell Alavedra*.
