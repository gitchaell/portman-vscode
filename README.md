<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=MichaellAlavedraMunayco.portman">
    <img src="assets/logo.png" width="120px" />
  </a>
</p>

<h1 align="center">
  Portman: Visualización y Control de Puertos en VS Code
</h1>

**Portman** es una extensión para Visual Studio Code diseñada para monitorear y gestionar los procesos de red directamente desde el editor. Nace de la necesidad de simplificar el flujo de trabajo cuando se lidia con errores de puertos ocupados (como el clásico `EADDRINUSE`) durante el desarrollo local, evitando la necesidad de recurrir a la terminal y comandos específicos de cada sistema operativo.

[📸 Insertar captura: Vista principal de Portman mostrando la lista de procesos activos en la Activity Bar de VS Code]

---

## El Problema y la Propuesta

Durante el ciclo de desarrollo, es común que instancias de servidores locales o procesos *zombies* queden ocupando puertos de red, bloqueando la inicialización de nuevos servicios. Resolver esto tradicionalmente implica cambiar de contexto hacia una terminal y ejecutar comandos como `lsof`, `netstat` o `ss` para identificar el PID (Process ID), para luego forzar su cierre mediante `kill` o herramientas similares.

La propuesta de Portman es centralizar esta operativa. Provee un árbol interactivo de los procesos activos, sus PIDs, protocolos, y puertos locales/remotos asociados, permitiendo terminar cualquier proceso seleccionado con un solo clic.

---

## Bajo el capó: Arquitectura y Modelado

Para asegurar que Portman sea escalable, mantenible y agnóstico a la plataforma subyacente, he estructurado el proyecto siguiendo los principios de la **Arquitectura Hexagonal (Clean Architecture)**. El código, escrito en **TypeScript** y empaquetado con **Webpack**, se divide claramente en cuatro capas, separando la lógica de negocio de los detalles de implementación del sistema operativo y de la API de Visual Studio Code.

### 1. Capa de Dominio (Domain)
Es el núcleo de la aplicación. Aquí residen los modelos de datos que representan conceptos abstractos que no dependen de la infraestructura.
*   **El modelo `Process`**: Actúa como el *Aggregate Root*. Representa un proceso de red de forma canónica. Contiene un identificador (`ProcessId`), el nombre del programa (`ProcessProgram`), el protocolo utilizado (`Protocol`), el estado (`ProcessStatus`), y direcciones abstractas (`Address`, compuestas por `AddressHost` y `AddressPort`) tanto locales como remotas.
*   **La interfaz `ProcessRepository`**: Define los contratos que las capas externas deben implementar para recuperar y manipular procesos (`search` y `kill`).

### 2. Capa de Aplicación (Application)
Coordina las intenciones del usuario, orquestando las llamadas entre el dominio y la infraestructura.
*   Contiene casos de uso puros y de una sola responsabilidad, como `KillProcess` y `SearchProcesses`. Estos interactúan exclusivamente con la interfaz abstracta `ProcessRepository`.

### 3. Capa de Infraestructura (Infrastructure)
Esta capa es responsable de proveer las implementaciones concretas para `ProcessRepository` según el sistema operativo en el que se ejecute la extensión.
La detección de plataforma se realiza durante la activación de la extensión en `extension.ts`, inyectando la implementación adecuada:
*   **Linux (`LinuxProcessRepository`)**: Emplea comandos nativos. Prioriza el uso de `netstat`, pero implementa un *graceful fallback* a `ss` en caso de que el primero no esté instalado en la distribución.
*   **macOS (`MacProcessRepository`)**: Utiliza `lsof -i -P -n` para recolectar información de la red y filtrarla.
*   **Windows (`WindowsProcessRepository`)**: Se apoya en comandos de red optimizados para el entorno Microsoft (`netstat -a -b -n -o`).
*   **Transformadores**: Cada módulo de infraestructura incluye componentes `*ProcessTransformer` encargados de parsear la salida cruda de los comandos de terminal y convertirlos en entidades `Process` del dominio.

### 4. Capa de Presentación (Presentation)
Maneja la integración directa con la API de extensiones de VS Code (`vscode.*`), aislando a la extensión de la lógica subyacente.
*   **`ProcessTreeDataProvider`**: Es el encargado de proveer los datos a la vista en formato de árbol (TreeView). Recupera la información de la capa de aplicación e inicializa los objetos visuales (`ProcessTreeItem` y `ProcessQuickPickItem`). Además, captura errores de infraestructura y los notifica al usuario de forma amigable a través de `vscode.window.showErrorMessage`.
*   **Comandos y Vistas**: Orquesta las interacciones del usuario, como el botón de "Refresh" (`RefreshProcessesCommand`) o la acción de terminar un proceso (`KillProcessCommand`).

[📸 Insertar diagrama o captura de código: Mostrar el entrypoint `extension.ts` donde se inyecta la dependencia según la plataforma (e.g., `linux: new LinuxProcessRepository()`, `win32: new WindowsProcessRepository()`)]

---

## Flujo de Ejecución (Workflow)

1.  **Activación:** Al abrir VS Code, el punto de entrada (`activate`) determina el `process.platform` y crea la instancia del `ProcessRepository` que corresponde al sistema operativo anfitrión.
2.  **Lectura:** Cuando el usuario abre la vista de Portman, el `ProcessTreeDataProvider` invoca el caso de uso `SearchProcesses`. Este caso delega en el repositorio correspondiente (e.g., ejecutar y parsear `netstat` en Windows), el cual devuelve un arreglo de entidades de dominio `Process`.
3.  **Presentación:** La capa de presentación mapea estas entidades en nodos visuales (`TreeItem`) y los despliega en la barra lateral.
4.  **Acción (Kill):** Si el usuario hace clic en el botón de terminar en un proceso específico, se dispara el comando asociado, invocando a la capa de infraestructura para emitir la señal de finalización (`kill -9` o su equivalente). El árbol se refresca automáticamente.

---

## Enlaces del Proyecto

*   **Instalación:** [Disponible en VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MichaellAlavedraMunayco.portman)
*   **Repositorio:** Siéntete libre de clonar y revisar la implementación de Arquitectura Limpia en este repositorio.
*   **Autor:** Desarrollado por Michaell Alavedra.
