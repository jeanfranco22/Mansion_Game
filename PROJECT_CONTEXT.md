# PROJECT_CONTEXT

## 1. Resumen del juego

### Nombre del proyecto

El proyecto se llama internamente `year` en `package.json`, pero el juego se presenta al jugador como **Vale House**. La metadata de Next usa el título **Project Mansion**.

### Genero

Prototipo de exploracion en primera persona con atmosfera de mansion, puzzles de escape room, progresion por llaves, puertas, notas y mecanismos.

### Objetivo del jugador

Explorar la mansion, encontrar la llave del pasillo, acceder al estudio, restaurar la electricidad, descubrir el codigo de la caja fuerte, abrir el acceso al sotano/final room, alinear el mecanismo de escape y salir por la puerta final.

### Estado actual del desarrollo

El proyecto es un prototipo jugable de un capitulo. La ruta principal esta implementada de inicio a fin, usando geometria procedural/simple en Three.js en lugar de modelos 3D externos. No hay sistema de guardado de partida, enemigos ni IA. El estado de gameplay existe solo en memoria y se reinicia desde el menu.

### Que ya funciona

- App Next.js que renderiza el juego en `/`.
- Menu principal, pausa, ajustes y pantalla de victoria.
- Canvas 3D con React Three Fiber.
- Fisica y colisiones basicas con Rapier.
- Movimiento en primera persona con pointer lock.
- Controles de teclado y controles tactiles.
- Sprint con stamina.
- Linterna con tecla `F`.
- HUD con objetivo, inventario, stamina, mira, prompts y overlay de documentos.
- Interaccion por raycast con tecla `E`.
- Inventario basico.
- Notas legibles.
- Puertas animadas con bloqueo por estado.
- Puzzles: interruptores ocultos, panel electrico, orden de libros, caja fuerte, valvula, placa de presion y palanca.
- Evento guionado del estudio con puerta, luz y sonido.
- Audio de ambiente, pasos, puertas, llave, parpadeo y golpe distante.
- Ajustes persistentes en `localStorage`.
- Modo debug con `?debug=true`.
- Lint pasa correctamente con `npm run lint`.

### Que aun falta

- Guardado/carga de partida.
- Enemigos, IA o amenazas activas.
- Modelos, texturas y animaciones de produccion.
- Sistema formal de escenas o niveles multiples.
- Cinematicas con camara, timeline o bloqueo visual dedicado.
- Sistema de dialogos o narrativa estructurada.
- Puzzle UI dedicada para caja fuerte u otros mecanismos.
- Configuracion completa de audio final; el README de audio menciona MP3, pero el codigo usa WAV.
- Tests automatizados.
- Optimizacion y modularizacion del mapa, que hoy esta hardcodeado en un solo componente grande.

## 2. Tecnologias

### Motor

No usa Unity, Godot ni Unreal. El "motor" del prototipo es una combinacion web:

- **Next.js 16.2.10** como framework de aplicacion.
- **React 19.2.4** para UI y componentes.
- **Three.js 0.185.1** para render 3D.
- **@react-three/fiber 9.6.1** como reconciler React para Three.js.
- **@react-three/rapier 2.2.0** para fisica.

### Lenguaje

- TypeScript.
- TSX para componentes React y React Three Fiber.
- CSS global con Tailwind CSS v4.

### Frameworks

- Next.js App Router.
- React.
- Tailwind CSS.
- React Three Fiber.

### Librerias

- `three`: renderizado 3D.
- `@react-three/fiber`: escena declarativa.
- `@react-three/drei`: `KeyboardControls` y `PointerLockControls`.
- `@react-three/rapier`: `Physics`, `RigidBody`, `CapsuleCollider`, `CuboidCollider`.
- `zustand`: store global de gameplay y settings.

### Dependencias importantes

- Runtime: `next`, `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `zustand`.
- Dev: `typescript`, `eslint`, `eslint-config-next`, `tailwindcss`, `@tailwindcss/postcss`, tipos de React/Node/Three.

## 3. Arquitectura

### Organizacion general

El proyecto real esta dentro de `year/`.

- `app/`: rutas Next, layout global y estilos.
- `public/`: assets publicos, principalmente audio WAV e iconos SVG heredados de plantilla.
- `src/game/`: todo el juego.
- `src/game/audio/`: reproduccion de sonidos, mezcla, ambiente y soundscape procedural.
- `src/game/components/`: contenedor principal del canvas 3D.
- `src/game/hooks/`: hooks compartidos de juego, actualmente debug mode.
- `src/game/interactions/`: registro global de interacciones y raycast de uso.
- `src/game/objects/`: puertas, objetos coleccionables, notas, props y puzzles.
- `src/game/physics/`: wrapper de Rapier.
- `src/game/player/`: controlador de primera persona, linterna y mapa de controles.
- `src/game/scripted-events/`: evento guionado del estudio.
- `src/game/store/`: Zustand store, tipos y valores iniciales.
- `src/game/triggers/`: zonas sensor que ejecutan callbacks.
- `src/game/ui/`: HUD, menus, documentos, controles tactiles y helpers de navegador.
- `src/game/world/`: construccion de la mansion, cuartos, paredes, luces y particulas.

### Flujo general

1. `app/page.tsx` recibe `searchParams` y activa debug si `?debug=true`.
2. `Game.tsx` renderiza `GameCanvas`.
3. `GameCanvas.tsx` crea `DebugModeProvider`, `AudioController`, `KeyboardControls`, `Canvas`, `GamePhysics`, mundo, jugador, linterna, audio espacial, raycast de interacciones y HUD.
4. `MansionWorld.tsx` instancia toda la mansion, objetos interactivos, puzzles y triggers.
5. `useGameStore.ts` centraliza estados de menu, jugador, inventario, progreso, settings, interaccion activa y evento del estudio.
6. El jugador mira objetos con `InteractionRaycaster`; si hay `interactionId`, aparece prompt y `E` ejecuta la accion registrada.
7. Las acciones actualizan `progression`, `inventory` y `objective`, lo que abre/cierra puertas, activa luces y desbloquea pasos.

### Inicializacion del juego

- Estado inicial: `gameStatus = "menu"`.
- Objetivo inicial: `"Find the corridor key"`.
- Spawn del jugador: `[0, 0.95, 3]`.
- La camara inicia en `[0, 1.55, 3]`, luego el controlador la alinea con el rigid body.
- Al pulsar **Start chapter**, `startGame()` cambia a `"playing"` y libera `controlsSuspended`.
- `activateGameView()` intenta fullscreen si el usuario lo prefirio y pide pointer lock en desktop.

### Sistema de escenas

No existe un sistema formal de escenas. Hay una sola escena 3D montada dentro del `Canvas`. El estado de "escena" se maneja por componentes condicionales y flags:

- `gameStatus`: menu, playing, paused, settings, victory.
- `progression`: flags de puertas, puzzles y final.
- `studyRoom`: estado especial de puerta/luz del estudio.

Para agregar niveles o escenas reales convendria separar `MansionWorld` en un renderer por zona o crear un enrutador interno de escenas.

### Sistema de estados

El sistema de estados esta en `src/game/store/useGameStore.ts`.

Estados principales:

- `gameStatus`: `"menu" | "playing" | "paused" | "settings" | "victory"`.
- `lastGameStatus`: usado para volver desde settings.
- `pointerLocked`: sincroniza UI/audio con pointer lock.
- `flashlightEnabled` y `flashlightHintVisible`.
- `objective`: texto actual del objetivo.
- `documentContent`: si no es `null`, abre overlay de lectura.
- `inventory`: lista de items unicos.
- `settings`: sensibilidad, volumenes, calidad grafica, fullscreen.
- `mobileInput`: movimiento, camara y sprint tactil.
- `progression`: flags narrativos y mecanicos.
- `player`: movimiento, stamina, suspension de controles y contador de reset.
- `interaction`: id y prompt activos.
- `studyRoom`: puerta/luz/interaccion del evento del estudio.

## 4. Gameplay

### Movimiento

Funciona con `FirstPersonController.tsx`.

- Teclado: `WASD` o flechas para moverse.
- Sprint: `ShiftLeft` o `ShiftRight`.
- Movil: joystick izquierdo para movimiento.
- Velocidad normal: `4.2`.
- Sprint: `6.4`.
- El cuerpo del jugador es un `RigidBody` dinamico con `CapsuleCollider`.
- La velocidad horizontal se suaviza con `Vector3.lerp`.
- La camara sigue la posicion del rigid body y aplica bobbing/sway.

Archivos:

- `src/game/player/FirstPersonController.tsx`
- `src/game/player/playerControls.ts`
- `src/game/store/gameDefaults.ts`
- `src/game/ui/mobile/MobileControls.tsx`

Extension:

- Agregar crouch, salto, inclinacion o ruido de movimiento.
- Separar configuracion de velocidades en datos.
- Mejorar deteccion de suelo si se agregan desniveles.

### Camara

La camara usa `PointerLockControls` en desktop y rotacion manual por joystick tactil si no hay pointer lock.

- FOV: `75`.
- Near/far: `0.1 / 100`.
- Altura visual: `translation.y + 0.62`.
- Limite vertical tactil: `-1.35` a `1.35`.
- Sensibilidad configurable y persistida.

Archivos:

- `src/game/components/GameCanvas.tsx`
- `src/game/player/FirstPersonController.tsx`
- `src/game/ui/browserControls.ts`

Extension:

- Camara cinematica.
- Head bob configurable.
- FOV dinamico al sprintar.

### Inventario

Inventario simple en Zustand.

- Los items son `{ id, label }`.
- `addUniqueInventoryItem()` evita duplicados por `id`.
- `hasInventoryItem(id)` consulta inventario.
- No hay consumo/remocion de items.
- Se muestra en `InventoryPanel` si hay al menos un item.

Items definidos:

- `corridorKey`
- `screwdriver`
- `fuse`
- `batteries`
- `crowbar`
- `basementKey`
- `architectReport`

Archivos:

- `src/game/store/gameStoreTypes.ts`
- `src/game/store/useGameStore.ts`
- `src/game/objects/CollectibleItem.tsx`
- `src/game/objects/MainKey.tsx`
- `src/game/ui/hud/InventoryPanel.tsx`

Extension:

- Agregar uso/consumo de items.
- Agregar item inspection.
- Agregar combinacion de items o condiciones compuestas.

### Interaccion

El sistema usa raycast desde el centro de pantalla.

- Cada objeto interactivo pone `userData={{ interactionId: id }}`.
- `useRegisterInteraction(id, config)` registra prompt, enabled y callback.
- `InteractionRaycaster` busca objetos a distancia maxima `2.6`.
- `E` ejecuta `triggerInteraction(activeInteractionId)`.
- En movil, el boton `Use` hace lo mismo.

Archivos:

- `src/game/interactions/interactionRegistry.ts`
- `src/game/interactions/useRegisterInteraction.ts`
- `src/game/interactions/InteractionRaycaster.tsx`
- `src/game/ui/hud/InteractionPrompt.tsx`
- `src/game/ui/mobile/MobileControls.tsx`

Extension:

- Prioridad entre hits.
- Distancias por objeto.
- Reticula que cambie al mirar objetos.
- Soporte de hold-to-use.

### Objetos

Hay tres familias:

- Props decorativos/collider: mesas, sillas, libreros, gabinetes, alfombras, papeles, tuberias, danos de pared, cajas.
- Objetos coleccionables: llave principal, destornillador, fusible, baterias, palanca/crowbar.
- Objetos interactivos mecanicos: puertas, interruptores, panel, libros, caja fuerte, valvula, placa, palanca, salida.

Archivos:

- `src/game/objects/*`
- `src/game/world/MansionWorld.tsx`

Extension:

- Reemplazar primitivas por modelos GLTF.
- Extraer data de objetos a JSON/arrays.
- Crear prefabs/componentes configurables para props repetidos.

### IA

No hay IA implementada. No existen enemigos, pathfinding, comportamiento, percepcion ni estados de NPC.

Extension:

- Agregar enemigos como componentes dentro de `src/game/objects` o `src/game/ai`.
- Usar navmesh o steering simple segun el tamano del mapa.
- Vincular eventos de IA al `progression` store.

### Enemigos

No hay enemigos implementados. El terror viene de luces, sonido, bloqueo temporal del estudio y exploracion.

### Puzzles

Puzzles implementados:

- Interruptor oculto de almacen: libera `storageLatchReleased`.
- Interruptor oculto del estudio: marca `studyDoorUnlocked`.
- Panel electrico: requiere destornillador para abrir y fusible para restaurar electricidad.
- Puzzle de libros: secuencia `raven -> sun -> crown`; `ash` es distractor.
- Caja fuerte: requiere `safeCodeDiscovered`; abre con codigo textual `1847` sin UI de dial.
- Puerta del sotano: requiere electricidad restaurada y `basementKey`.
- Mecanismo final: requiere abrir sotano, girar valvula, estar sobre la placa de presion y tirar palanca.
- Puerta final: requiere sotano abierto, mecanismo alineado y haber entrado a la sala final.

Archivos:

- `src/game/objects/PuzzleObjects.tsx`
- `src/game/objects/CorridorDoor.tsx`
- `src/game/objects/StudyDoor.tsx`
- `src/game/objects/FinalExitDoor.tsx`
- `src/game/store/useGameStore.ts`

Extension:

- Convertir puzzles en definiciones de datos.
- Agregar UI real para caja fuerte.
- Hacer que `batteries` y `crowbar` tengan usos reales.
- Agregar feedback negativo mas claro.

### Guardado

No hay guardado de partida. Solo los settings persisten en `localStorage` bajo `vale-house-settings-v1`.

Archivos:

- `src/game/store/useGameStore.ts`

Extension:

- Persistir `progression`, `inventory`, `objective`, posicion del jugador y estado de puertas.
- Agregar slots o autosave.

### Eventos

Eventos implementados:

- Trigger de estudio: inicia evento de luz/puerta al entrar en la zona del estudio.
- Trigger de cierre de puerta: fuerza puerta del estudio cerrada al entrar mas dentro.
- Trigger de sala final: marca `finalRoomReached`.
- `SoundTrigger` existe como componente reutilizable, pero no esta instanciado actualmente en `MansionWorld`.

Archivos:

- `src/game/triggers/TriggerZone.tsx`
- `src/game/triggers/LightFlickerTrigger.tsx`
- `src/game/triggers/DoorCloseTrigger.tsx`
- `src/game/triggers/FinalRoomTrigger.tsx`
- `src/game/triggers/SoundTrigger.tsx`
- `src/game/scripted-events/*`

Extension:

- Sistema de eventos con cola/cancelacion.
- Eventos con camara, subtitulos, timeline y condiciones.

### Sonidos

Audio implementado:

- Archivos WAV en `public/audio`.
- Reproduccion SFX clonando `HTMLAudioElement`.
- Ambiente en loop cuando hay pointer lock y el juego no termino.
- Pasos alternos mientras el jugador se mueve.
- Sonidos aleatorios de golpe/parpadeo cada 9-22 segundos aprox.
- Soundscape procedural con osciladores Web Audio y pan/atenuacion por distancia.

Archivos:

- `src/game/audio/audioFiles.ts`
- `src/game/audio/gameAudio.ts`
- `src/game/audio/AudioController.tsx`
- `src/game/audio/AmbientSoundscape.tsx`
- `public/audio/*`

Extension:

- Audio posicional real con `AudioListener`/`PositionalAudio`.
- Mixer por buses mas completo.
- Crossfade ambiental por zona.

### Animaciones

No hay clips de animacion. Las animaciones son procedurales:

- Puertas interpolan rotacion hacia angulo abierto.
- Linterna interpola intensidad y sigue camara con sway.
- Luces parpadean con senos.
- Polvo rota y sube/baja.
- Items flotan levemente.
- Palanca interpola rotacion.
- Valvula rota tras alinearse.
- HUD usa keyframes CSS para objetivo e inventario.

Archivos:

- `src/game/objects/AnimatedDoor.tsx`
- `src/game/player/Flashlight.tsx`
- `src/game/world/FlickeringLight.tsx`
- `src/game/world/DustParticles.tsx`
- `src/game/objects/CollectibleItem.tsx`
- `src/game/objects/PuzzleObjects.tsx`
- `app/globals.css`

Extension:

- Integrar GLTF con animaciones.
- Timeline de eventos.
- Sonidos sincronizados a animaciones.

### UI

UI implementada:

- Menu principal.
- Pausa.
- Settings.
- Victoria.
- HUD durante gameplay.
- Documento/notas.
- Controles tactiles.
- Debug panel con `?debug=true`.

Archivos:

- `src/game/ui/GameHud.tsx`
- `src/game/ui/hud/*`
- `src/game/ui/menus/*`
- `src/game/ui/documents/DocumentOverlay.tsx`
- `src/game/ui/mobile/MobileControls.tsx`
- `src/game/ui/browserControls.ts`
- `app/globals.css`

Extension:

- Rehacer inventario con slots.
- Agregar mapa o diario.
- Mejorar accesibilidad y remapping de controles.

## 5. Mapa

### Como esta construida la mansion

La mansion se construye manualmente en `src/game/world/MansionWorld.tsx` con primitivas:

- `Room` crea piso y opcionalmente paredes.
- `Corridor` crea piso de pasillo y opcionalmente paredes laterales.
- `Wall` envuelve `StaticBox`.
- `StaticBox` crea mesh y, por defecto, `RigidBody fixed` con collider cuboid.
- `DoorFrame` crea marcos.
- `WindowPanel` crea paneles transparentes.

En `MansionWorld`, `Room` y `Corridor` se usan con `walls={false}` y las paredes se colocan manualmente para dejar aberturas. Las puertas animadas agregan colliders invisibles cuando estan cerradas.

### Conexiones

- El jugador aparece en el salon/entrada, cerca de `[0, 0.95, 3]`.
- Salon principal conecta con el pasillo por el marco en `[0, 0, -2]`.
- El pasillo central se extiende hacia z negativo.
- El almacen oeste conecta por puerta en `[-1.15, 0, -6]`.
- El estudio/oficina este conecta por puerta en `[1.15, 0, -8]`.
- Una puerta de pasillo bloqueada esta en `[0, 0, -11.45]`.
- La puerta de acceso a sotano/final room esta en `[0, 0, -14.5]`.
- La salida final esta al fondo en `[0, 0, -19.45]`.

### Zonas existentes

1. **Salon principal / entrada**
   - Centro `[0, 2]`, tamano `[8, 8]`.
   - Tiene alfombra, mesa, silla, cuadros, papeles, mobiliario roto.
   - Contiene nota de entrada y switch oculto del almacen.
   - Inicio del juego.

2. **Pasillo central**
   - Centro `[0, -8]`, largo `12`, ancho `2.3`.
   - Conecta salon, almacen, estudio, puerta del pasillo y sotano.
   - Contiene switch oculto del estudio.
   - Tiene alfombra larga y divisiones de pared.

3. **Almacen oeste**
   - Centro `[-4.15, -6]`, tamano `[6, 5]`.
   - Contiene gabinete, cajas, tuberias, cables, fusible, destornillador, baterias, crowbar, memo de mantenimiento, llave principal y panel electrico.
   - Acceso por puerta `StorageDoor`.

4. **Estudio / oficina este**
   - Centro `[4.15, -8]`, tamano `[6, 5]`.
   - Contiene mesa, sillas, libreros, lampara de escritorio, nota del puzzle, reporte de arquitecto, puzzle de libros y caja fuerte.
   - Acceso por `StudyDoor`.
   - Tiene evento guionado al entrar.

5. **Sala final / sotano mecanico**
   - Centro `[0, -17]`, tamano `[6, 5]`.
   - Contiene valvula, placa de presion, palanca de escape, cuadro y salida final.
   - Acceso por `BasementAccessDoor`.
   - `FinalRoomTrigger` marca entrada a la zona.

### Habitaciones que ya funcionan

- Salon principal: navegable, nota e interruptor interactivos.
- Pasillo: navegable, puerta bloqueada y switch de estudio funcionales.
- Almacen: puerta, coleccionables, llave y panel electrico funcionales.
- Estudio: puerta, evento, notas, puzzle de libros y caja fuerte funcionales.
- Sala final: acceso, trigger, valvula, placa, palanca y salida funcionales.

### Habitaciones pendientes

No hay habitaciones declaradas que esten totalmente pendientes. Lo pendiente es ampliar la mansion con nuevas habitaciones o convertir zonas existentes en espacios mas ricos. La pantalla de victoria indica que "the lower rooms are still awake", lo que sugiere contenido futuro fuera del primer capitulo.

## 6. Sistemas importantes

### Interaccion

Implementacion:

- `interactionRegistry.ts` mantiene un `Map<string, InteractionConfig>`.
- Cada componente llama `useRegisterInteraction`.
- `InteractionRaycaster` recorre hits del raycast y sube por padres hasta encontrar `userData.interactionId`.
- Si el objeto esta habilitado y tiene prompt, guarda `activeInteractionId` y `activeInteractionPrompt` en Zustand.
- `E` o boton tactil `Use` ejecuta la accion.

Notas:

- El registro es global en memoria de modulo.
- Si dos objetos comparten id, el ultimo registro pisa al anterior.
- Los prompts pueden ser strings o funciones dinamicas.

### Objetos

Los objetos son componentes React. Muchos son primitivas con colliders fijos. Los objetos interactivos mezclan visual, prompt, condiciones y mutaciones del store dentro del mismo componente.

Punto de extension recomendado:

- Mantener este patron para cambios pequenos.
- Para crecimiento, extraer definiciones de objetos/puzzles a data y dejar componentes renderer.

### Inventario

Sistema en memoria con items unicos. Se usa como condicion de:

- `corridorKey`: abre puerta de pasillo.
- `screwdriver`: abre panel electrico.
- `fuse`: restaura electricidad.
- `basementKey`: abre acceso a sotano.
- `architectReport`: se agrega al abrir caja fuerte, pero no tiene uso mecanico adicional.

Items sin uso actual:

- `batteries`
- `crowbar`
- `architectReport` como condicion futura

### Llaves

- Llave principal: `MainKey`, id de interaccion `main-key`, otorga `corridorKey` y `hasMainKey`.
- Llave de sotano: no existe como objeto fisico inicial; se agrega al inventario al abrir la caja fuerte con `openSafe()`.

### Puertas

Base comun:

- `AnimatedDoor` registra interaccion y rota el grupo visual hacia `Math.PI * 0.46`.
- Mientras esta cerrada crea `StaticBox` invisible con collider para bloquear paso.

Puertas:

- `StorageDoor`: requiere `storageLatchReleased`.
- `CorridorDoor`: requiere `hasMainKey`.
- `StudyDoor`: requiere `studyDoorUnlocked`; puede ser bloqueada durante evento.
- `BasementAccessDoor`: requiere electricidad y `basementKey`.
- `FinalExitDoor`: requiere `basementDoorOpened`, `escapeMechanismAligned` y `finalRoomReached`.

### Eventos

Eventos directos:

- Interacciones mutan estado.
- Triggers sensor llaman acciones.
- Evento del estudio ejecuta una funcion async con `wait()`.

No hay bus de eventos formal ni historial.

### Triggers

`TriggerZone` usa `CuboidCollider` con `sensor`.

- `once=true` por defecto.
- En debug renderiza caja wireframe verde.
- No filtra explicitamente por jugador; depende de intersecciones Rapier. En la practica, con pocos cuerpos dinamicos, lo activa el jugador.

Triggers actuales:

- `LightFlickerTrigger`: entrada al estudio.
- `DoorCloseTrigger`: cierra puerta del estudio.
- `FinalRoomTrigger`: marca sala final alcanzada.
- `PressurePlate`: sensor persistente con enter/exit.
- `SoundTrigger`: componente disponible, no usado.

### IA

No implementada.

### Sistema de iluminacion

- `GameCanvas` define background y fog oscuros.
- `MansionWorld` agrega `ambientLight`, varias `FlickeringLight` y `pointLight`.
- La electricidad cambia intensidades globales y activa la lampara del escritorio.
- La linterna crea `spotLight` y `pointLight` que siguen la camara.
- Calidad grafica afecta sombras, DPR, antialias, distancia y shadow map sizes.

### Audio

- `audioFiles.ts` mapea claves a WAV.
- `gameAudio.ts` cachea audio, valida disponibilidad con `HEAD`, clona para SFX y mantiene mezcla master/music/sfx.
- `AudioController` inicia/para ambiente por pointer lock, reproduce pasos y sonidos aleatorios.
- `AmbientSoundscape` crea osciladores lowpass con panner estereo y atenuacion por distancia.

### Cinematicas

No hay sistema formal de cinematicas. La cinimatica actual es `runStudyRoomEvent`:

1. Cierra puerta del estudio.
2. Bloquea interaccion de la puerta.
3. Reproduce parpadeo.
4. Alterna intensidad de luz 6 veces.
5. Apaga luz por 2 segundos.
6. Reproduce impacto distante.
7. Restaura luz tenue.
8. Desbloquea puerta.
9. Marca evento completado.

## 7. Scripts principales

| Archivo | Responsabilidad | Dependencias | Donde se usa |
| --- | --- | --- | --- |
| `app/page.tsx` | Entrada de ruta principal; pasa `debug` al juego. | `Game` | Next App Router |
| `app/layout.tsx` | Metadata y layout HTML global. | `globals.css` | Next App Router |
| `app/globals.css` | Tailwind, base visual, efectos de pantalla y animaciones HUD. | Tailwind CSS | Toda la app |
| `src/game/Game.tsx` | Wrapper cliente del juego. | `GameCanvas` | `app/page.tsx` |
| `src/game/components/GameCanvas.tsx` | Composicion principal de Canvas, fisica, mundo, jugador, audio y HUD. | R3F, Drei, Three, store | `Game.tsx` |
| `src/game/store/useGameStore.ts` | Store global y acciones de juego. | Zustand, defaults, types | Casi todos los sistemas |
| `src/game/store/gameStoreTypes.ts` | Tipos de objetivos, inventario, settings, progreso y estados. | TypeScript | Store, objetos, UI |
| `src/game/store/gameDefaults.ts` | Estado inicial y posicion de spawn. | Types | Store, player |
| `src/game/physics/GamePhysics.tsx` | Wrapper Rapier con gravedad. | `@react-three/rapier` | `GameCanvas` |
| `src/game/player/FirstPersonController.tsx` | Movimiento, camara, stamina y pointer lock. | Drei, R3F, Rapier, Three, store | `GameCanvas` |
| `src/game/player/Flashlight.tsx` | Linterna ligada a camara y tecla `F`. | R3F, Three, store | `GameCanvas` |
| `src/game/player/playerControls.ts` | Mapa de controles de teclado. | Drei | `GameCanvas`, player |
| `src/game/interactions/interactionRegistry.ts` | Registro global y ejecucion de interacciones. | Ninguna | Raycaster, objetos, movil |
| `src/game/interactions/useRegisterInteraction.ts` | Hook para registrar/desregistrar interacciones. | React, registry | Objetos interactivos |
| `src/game/interactions/InteractionRaycaster.tsx` | Detecta objeto interactivo bajo mira y escucha `E`. | R3F, Three, registry, store | `GameCanvas` |
| `src/game/world/MansionWorld.tsx` | Construye mapa completo, objetos, puzzles y triggers. | Objetos, triggers, store, world primitives | `GameCanvas` |
| `src/game/world/Room.tsx` | Piso y paredes opcionales de cuarto. | `StaticBox`, `Wall` | `MansionWorld` |
| `src/game/world/Corridor.tsx` | Piso y paredes opcionales de pasillo. | `StaticBox`, `Wall` | `MansionWorld` |
| `src/game/world/StaticBox.tsx` | Caja visual con collider fijo opcional. | Rapier, R3F | World y props |
| `src/game/world/Wall.tsx` | Alias semantico de pared. | `StaticBox` | `MansionWorld`, `Room`, `Corridor` |
| `src/game/world/DoorFrame.tsx` | Marco visual de puerta. | `StaticBox` | `MansionWorld` |
| `src/game/world/WindowPanel.tsx` | Panel transparente de ventana. | R3F | `MansionWorld` |
| `src/game/world/FlickeringLight.tsx` | Luz puntual con parpadeo procedural. | R3F, Three, store | `MansionWorld` |
| `src/game/world/DustParticles.tsx` | Particulas de polvo segun calidad grafica. | R3F, Three, store | `GameCanvas` |
| `src/game/objects/AnimatedDoor.tsx` | Puerta animada reusable con collider invisible cuando cierra. | R3F, store, interaction, `StaticBox` | Puertas |
| `src/game/objects/CorridorDoor.tsx` | Puerta bloqueada por llave de pasillo. | Store, audio, `AnimatedDoor` | `MansionWorld` |
| `src/game/objects/StudyDoor.tsx` | Puerta del estudio con bloqueo de evento. | Store, audio, `AnimatedDoor` | `MansionWorld` |
| `src/game/objects/FinalExitDoor.tsx` | Salida que completa el juego. | Store, `AnimatedDoor` | `MansionWorld` |
| `src/game/objects/PuzzleObjects.tsx` | Interruptores, almacen, sotano, panel, libros, caja fuerte, valvula, placa y palanca. | Rapier, R3F, store, audio, interactions | `MansionWorld` |
| `src/game/objects/CollectibleItem.tsx` | Coleccionable generico. | R3F, store, audio, interactions | `MansionWorld` |
| `src/game/objects/MainKey.tsx` | Llave principal especial que actualiza objetivo/progreso. | Store, audio, interactions | `MansionWorld` |
| `src/game/objects/ReadableNote.tsx` | Nota legible que abre documento. | Store, interactions | `MansionWorld` |
| `src/game/objects/EnvironmentProps.tsx` | Props ambientales simples. | `StaticBox`, `StaticCylinder` | `MansionWorld` |
| `src/game/objects/Bookshelf.tsx` | Librero decorativo con colliders. | `StaticBox` | `MansionWorld` |
| `src/game/objects/Cabinet.tsx` | Gabinete decorativo con colliders. | `StaticBox` | `MansionWorld` |
| `src/game/objects/SimpleTable.tsx` | Mesa decorativa. | `StaticBox`, `StaticCylinder` | `MansionWorld` |
| `src/game/objects/SimpleChair.tsx` | Silla decorativa. | `StaticBox` | `MansionWorld` |
| `src/game/objects/PictureFrame.tsx` | Cuadros decorativos. | R3F | `MansionWorld` |
| `src/game/objects/StaticCylinder.tsx` | Cilindro con collider hull fijo. | Rapier, R3F | Props |
| `src/game/triggers/TriggerZone.tsx` | Sensor cubico reusable con render debug. | Rapier, debug hook | Triggers |
| `src/game/triggers/LightFlickerTrigger.tsx` | Inicia evento del estudio. | Store, `TriggerZone` | `MansionWorld` |
| `src/game/triggers/DoorCloseTrigger.tsx` | Cierra puerta del estudio al entrar. | Store, `TriggerZone` | `MansionWorld` |
| `src/game/triggers/FinalRoomTrigger.tsx` | Marca llegada a sala final. | Store, `TriggerZone` | `MansionWorld` |
| `src/game/triggers/SoundTrigger.tsx` | Trigger generico de sonido. | Audio, `TriggerZone` | Disponible, no instanciado |
| `src/game/scripted-events/StudyRoomEventController.tsx` | Lanza evento async del estudio una vez. | Store, `runStudyRoomEvent` | `MansionWorld` |
| `src/game/scripted-events/studyRoomEvent.ts` | Secuencia temporal del evento del estudio. | Audio, `wait` | Controller |
| `src/game/scripted-events/wait.ts` | Promise con `window.setTimeout`. | Browser API | Eventos |
| `src/game/audio/audioFiles.ts` | Mapa de claves a archivos de audio. | Ninguna | Audio |
| `src/game/audio/gameAudio.ts` | Cache, playback, ambiente y mezcla. | Browser Audio, fetch | AudioController, objetos, eventos |
| `src/game/audio/AudioController.tsx` | Controla ambiente, pasos, sonidos aleatorios y stop al terminar. | Store, gameAudio | `GameCanvas` |
| `src/game/audio/AmbientSoundscape.tsx` | Ambiente procedural por osciladores y pan. | R3F, Web Audio, store | `GameCanvas` |
| `src/game/ui/GameHud.tsx` | Composicion de HUD, menus, documentos y movil. | Store, UI components | `GameCanvas` |
| `src/game/ui/browserControls.ts` | Pointer lock y fullscreen. | DOM, store | Menus, pause, documents |
| `src/game/ui/FullscreenPreferenceSync.tsx` | Sincroniza preferencia fullscreen con estado DOM. | Store, DOM | `GameHud` |
| `src/game/ui/hud/PauseController.tsx` | Escucha Escape/P para pausar/reanudar. | Store, browserControls | `GameHud` |
| `src/game/ui/hud/DebugPanel.tsx` | Muestra objetivo, stamina y progression en debug. | Store, debug hook | `GameHud` |
| `src/game/ui/hud/*` | Mira, objetivo, inventario, prompt, stamina, pista y efectos. | Store, CSS | `GameHud` |
| `src/game/ui/documents/DocumentOverlay.tsx` | Overlay de notas, suspende controles y recupera pointer lock. | Store, browserControls | `GameHud` |
| `src/game/ui/menus/GameMenus.tsx` | Menu principal, pausa, victoria y settings routing. | Store, MenuButton, SettingsMenu | `GameHud` |
| `src/game/ui/menus/SettingsMenu.tsx` | Sliders de sensibilidad/volumen, calidad y fullscreen. | Store, browserControls | `GameMenus` |
| `src/game/ui/menus/MenuButton.tsx` | Boton estilizado reutilizable. | React | Menus |
| `src/game/ui/mobile/MobileControls.tsx` | Joysticks tactiles y botones de pausa/luz/sprint/use. | Store, interaction registry, touch hook | `GameHud` |
| `src/game/ui/hooks/useIsTouchDevice.ts` | Detecta pointer coarse. | Browser matchMedia | MobileControls, prompt |
| `src/game/ui/completion/CompletionScreen.tsx` | Pantalla de completado alternativa no usada actualmente. | Store | Sin uso detectado |
| `src/game/hooks/useDebugMode.ts` | Contexto de debug. | React | GameCanvas, DebugPanel, TriggerZone |

## 8. Flujo del jugador

1. El jugador abre la app y ve el menu de **Vale House**.
2. Puede abrir **Settings** para ajustar sensibilidad, volumenes, calidad grafica y fullscreen.
3. Pulsa **Start chapter**.
4. El juego cambia a `playing`, intenta pointer lock en desktop y muestra HUD.
5. Aparece en el salon principal con objetivo `"Find the corridor key"`.
6. Puede moverse con `WASD`/flechas, mirar con mouse, sprintar con Shift y activar linterna con `F`.
7. En el salon puede leer la carta de entrada en la mesa.
8. El jugador encuentra un switch oculto en la pared izquierda del salon; al usarlo libera el latch del almacen.
9. Entra al pasillo y puede intentar varias puertas. La puerta del pasillo aun pide llave; el estudio indica que el lock se controla desde cerca.
10. Usa el switch oculto del pasillo para desbloquear la puerta del estudio. El objetivo cambia a `"Restore electricity"`.
11. Abre el almacen cuando el latch fue liberado.
12. En el almacen puede recoger destornillador, fusible, baterias, crowbar y la llave principal sobre el gabinete.
13. Al recoger la llave principal, el objetivo cambia a `"Unlock the corridor door"`.
14. Usa el destornillador en el panel electrico para abrirlo.
15. Usa el fusible en el panel abierto para restaurar electricidad. El objetivo cambia a `"Find the safe code"`.
16. Vuelve al pasillo y abre la puerta del pasillo con la llave principal. El objetivo cambia a `"Find the study"`.
17. Entra al estudio por la puerta este. Al cruzar el trigger, la puerta se cierra/bloquea y ocurre el evento de luces.
18. Tras el evento, la puerta vuelve a desbloquearse y el objetivo queda en restaurar electricidad o buscar codigo, segun el progreso.
19. Lee la nota del estudio: indica el orden `Raven before Sun, Sun before Crown` y que ignore `ash`.
20. Interactua con los libros en orden `raven`, `sun`, `crown`.
21. Al resolver el puzzle, `safeCodeDiscovered` se activa y el objetivo cambia a `"Open the office safe"`.
22. Usa la caja fuerte; el prompt indica entrar `1847`. La caja se abre y otorga `Basement Key` y `Architect Report`.
23. El objetivo cambia a `"Unlock the basement access"`.
24. Usa la puerta de acceso al sotano/final room. Requiere electricidad restaurada y `basementKey`.
25. Al abrirla, el objetivo cambia a `"Align the escape mechanism"`.
26. Entra a la sala final; `FinalRoomTrigger` marca `finalRoomReached`.
27. Gira la valvula de presion.
28. Se coloca sobre la placa de presion.
29. Mientras la placa esta activa y la valvula alineada, tira la palanca de escape.
30. El objetivo cambia a `"Find a way out"`.
31. Interactua con la puerta final.
32. `completeGame()` cambia `gameStatus` a `"victory"`, suspende controles, marca `gameCompleted` y muestra pantalla de victoria.
33. Desde victoria puede reiniciar el capitulo o abrir settings.

## 9. Recursos

### Modelos

No hay modelos 3D externos. Todos los objetos 3D son primitivas generadas con geometria de Three.js: cajas, cilindros, torus, esferas, puntos/particles.

### Sprites

No hay sprites de gameplay. Hay SVGs publicos heredados de plantilla Next:

- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

### Texturas

No hay archivos de textura. Los materiales usan colores planos, roughness, metalness, emissive, transparencia y luces.

### Audio

Archivos existentes:

- `public/audio/ambient-room.wav`
- `public/audio/distant-impact.wav`
- `public/audio/door-open.wav`
- `public/audio/footstep-wood-1.wav`
- `public/audio/footstep-wood-2.wav`
- `public/audio/key-pickup.wav`
- `public/audio/light-flicker.wav`
- `public/audio/README.md`

Claves usadas:

- `ambient`
- `footstepWood1`
- `footstepWood2`
- `doorOpen`
- `keyPickup`
- `lightFlicker`
- `distantImpact`

### Animaciones

No hay assets de animacion. Animaciones procedurales en codigo:

- Puertas.
- Linterna.
- Luces.
- Polvo.
- Items flotantes.
- Valvula.
- Palanca.
- HUD.

### Prefabs

No hay prefabs en formato externo. Componentes reutilizables equivalentes:

- `StaticBox`
- `StaticCylinder`
- `Room`
- `Corridor`
- `Wall`
- `DoorFrame`
- `AnimatedDoor`
- `CollectibleItem`
- `ReadableNote`
- `TriggerZone`
- Props de `EnvironmentProps`

### Escenas

Una sola escena runtime:

- `GameCanvas` + `MansionWorld`.

No hay archivos de escena externos.

### Assets importantes

- `MansionWorld.tsx`: layout completo de mapa.
- `useGameStore.ts`: progresion completa.
- `PuzzleObjects.tsx`: mayor parte de gameplay.
- `public/audio/*.wav`: feedback auditivo actual.

## 10. Pendientes

### Alta prioridad

- Agregar guardado/carga o al menos autosave de progreso.
- Separar `MansionWorld.tsx` en zonas o data para que el mapa sea mantenible.
- Separar logica de puzzles de su visual en `PuzzleObjects.tsx`.
- Definir si `batteries`, `crowbar` y `architectReport` tendran uso o eliminarlos del flujo.
- Crear UI real para caja fuerte si el codigo debe sentirse como puzzle interactivo, no prompt automatico.
- Resolver inconsistencia de `public/audio/README.md`: menciona MP3, pero el juego usa WAV.
- Agregar tests basicos de store/progresion.
- Revisar triggers para filtrar solo al jugador si luego se agregan cuerpos dinamicos.

### Media prioridad

- Agregar sistema de guardado de posicion del jugador.
- Agregar sistema de escenas/zonas si el capitulo crece.
- Mejorar feedback visual de interaccion.
- Agregar remapping de controles.
- Mejorar accesibilidad de UI y soporte teclado completo para menus.
- Agregar modelos GLTF y materiales/texturas finales.
- Agregar audio posicional real para fuentes ambientales.
- Agregar sistema formal de eventos/cinematicas con cancelacion y limpieza en restart.
- Revisar balance de luces/fog por calidad grafica.
- Usar `SoundTrigger` o eliminarlo si no se necesita.
- Unificar pantalla de victoria: `CompletionScreen.tsx` existe pero no se usa.

### Baja prioridad

- Reemplazar SVGs heredados de plantilla si no se usan.
- Mejorar README principal, que aun es el texto inicial de Next.
- Agregar documentacion de controles dentro del repo.
- Agregar creditos/licencias de audio.
- Agregar estadisticas de finalizacion o tiempo.
- Agregar efectos visuales mas pulidos de miedo/impacto.
- Agregar soporte para gamepad.

## 11. Problemas conocidos

### Errores actuales

- No se detectaron errores de lint: `npm run lint` pasa.
- No hay suite de tests, por lo que no hay verificacion automatizada de gameplay.

### Limitaciones

- Estado de gameplay no persiste.
- Todo el mapa esta hardcodeado en JSX.
- No hay assets 3D ni pipeline de importacion.
- No hay IA ni enemigos.
- No hay sistema de escenas.
- No hay sistema formal de misiones; `objective` es un string union actualizado manualmente.
- No hay localizacion; todo el texto de juego esta en ingles.
- No hay UI de inventario interactivo.
- La caja fuerte se abre automaticamente si `safeCodeDiscovered` es true; no hay input real.
- La linterna no consume bateria; las baterias se pueden recoger pero no se usan.
- El `crowbar` se puede recoger pero no se usa.
- El `architectReport` se agrega al inventario al abrir la caja fuerte aunque tambien existe una nota visible con el mismo texto en el estudio.

### Codigo tecnico que deberia refactorizarse

- `MansionWorld.tsx` concentra layout, decoracion, objetos, puzzles y triggers.
- `PuzzleObjects.tsx` concentra muchas mecanicas distintas en un archivo grande.
- El registry global de interacciones no tiene namespacing ni proteccion contra ids duplicados.
- `TriggerZone` no filtra por entidad de jugador.
- `gameAudio.ts` hace `fetch HEAD` por archivo; en entornos que no soporten HEAD correctamente puede marcar audios como faltantes.
- `CompletionScreen.tsx` parece obsoleto o alternativo y no se importa.
- `readElectricalMemo()` y `discoverSafeCode()` existen en el store pero no se usan directamente en los componentes actuales.

### Bugs conocidos o riesgos

- Si un evento async del estudio sigue corriendo durante un restart, no hay cancel token; podria aplicar cambios tardios al nuevo run.
- `StudyRoomEventController` reinicia `hasRun` con `resetCounter`, pero la promesa previa no se cancela.
- Los prompts dinamicos pueden seguir registrados aunque el objeto deje de renderizarse si algun componente no desmonta limpiamente; hoy el hook limpia en unmount.
- Al agregar mas rigid bodies dinamicos, triggers podrian activarse por objetos no jugador.
- El README de audio puede confundir a quien agregue assets porque lista `.mp3` esperados y el codigo referencia `.wav`.

## 12. Ideas futuras

- Segundo tramo de la mansion despues de la puerta final.
- Enemigo o presencia que patrulle tras restaurar electricidad.
- Sistema de bateria real para linterna.
- Uso del crowbar para abrir una ruta alternativa o romper tablas.
- Diario del jugador con notas coleccionadas.
- Mapa de la mansion desbloqueable.
- Inventario visual con inspeccion 3D de objetos.
- Puzzles fisicos con piezas movibles.
- Caja fuerte con dial interactivo.
- Eventos de sonido por zonas usando `SoundTrigger`.
- Cinematicas con movimiento de camara y subtitulos.
- Guardado automatico por checkpoint.
- Mas finales segun objetos encontrados.
- Dificultad ajustable: pistas, stamina, linterna, frecuencia de sustos.
- Importar modelos GLTF de puertas, muebles y arquitectura.
- Sistema de localizacion ingles/espanol.

## 13. Resumen para IA

Este proyecto es un prototipo web de juego 3D llamado **Vale House**, en el repo `year/`. Usa Next.js 16, React 19, TypeScript, React Three Fiber, Drei, Rapier y Zustand. La entrada es `app/page.tsx`, que renderiza `src/game/Game.tsx`; este delega a `src/game/components/GameCanvas.tsx`. `GameCanvas` crea el `Canvas`, configura calidad grafica, fog, fisica, mundo, jugador, linterna, audio, interacciones y HUD. No hay Unity ni archivos de escena externos.

El estado central esta en `src/game/store/useGameStore.ts`. Ahi viven `gameStatus`, `objective`, `inventory`, `settings`, `progression`, `player`, `interaction`, `mobileInput` y `studyRoom`. La progresion se modela con booleans como `hasMainKey`, `corridorDoorOpened`, `studyDoorUnlocked`, `electricityRestored`, `bookPuzzleSolved`, `safeOpened`, `basementDoorOpened`, `valveAligned`, `pressurePlateActive`, `escapeMechanismAligned`, `finalRoomReached` y `gameCompleted`. Las acciones del store cambian objetivos e inventario. Solo los settings persisten en `localStorage`; la partida no se guarda.

El mapa completo esta hardcodeado en `src/game/world/MansionWorld.tsx`, con primitivas Three/Rapier. Las zonas son salon de entrada, pasillo, almacen oeste, estudio este y sala final/sotano. `Room`, `Corridor`, `Wall`, `StaticBox`, `DoorFrame`, `WindowPanel`, `FlickeringLight` y `DustParticles` construyen el entorno. `StaticBox` suele crear un collider fijo. No hay modelos, sprites ni texturas de gameplay; solo colores/materiales y audio WAV en `public/audio`.

El jugador se controla con `src/game/player/FirstPersonController.tsx`: rigid body con capsule collider, camara en primera persona, pointer lock, teclado `WASD`/flechas, sprint con Shift, stamina y bobbing. En movil, `src/game/ui/mobile/MobileControls.tsx` aporta joysticks de movimiento/mirada y botones de pausa, luz, sprint y uso. `Flashlight.tsx` crea una linterna con spotlight/pointlight ligada a la camara y activada con `F`.

Las interacciones usan `src/game/interactions/*`. Cada objeto interactivo registra un `InteractionConfig` con `useRegisterInteraction(id, config)` y marca su mesh/grupo con `userData.interactionId`. `InteractionRaycaster.tsx` lanza un raycast desde el centro de pantalla a 2.6 unidades; si encuentra una interaccion habilitada, guarda prompt activo. La tecla `E` o el boton tactil `Use` ejecutan `triggerInteraction`.

La ruta jugable actual: iniciar capitulo, buscar switch oculto del almacen en el salon, abrir almacen, recoger llave principal/destornillador/fusible, abrir panel electrico y restaurar electricidad, desbloquear estudio con switch oculto del pasillo, entrar al estudio y activar evento de luces, resolver puzzle de libros con secuencia `raven -> sun -> crown`, abrir caja fuerte con codigo `1847`, obtener `basementKey`, abrir acceso al sotano, entrar a sala final, girar valvula, ponerse sobre placa de presion, tirar palanca, usar puerta final y llegar a victoria.

Los objetos principales estan en `src/game/objects`. `AnimatedDoor.tsx` es la base de puertas: registra interaccion, rota visualmente y agrega collider invisible cuando esta cerrada. `CorridorDoor`, `StudyDoor`, `FinalExitDoor` y puertas dentro de `PuzzleObjects.tsx` especializan condiciones. `PuzzleObjects.tsx` tambien contiene interruptores ocultos, panel electrico, puzzle de libros, caja fuerte, valvula, placa y palanca. `CollectibleItem.tsx`, `MainKey.tsx` y `ReadableNote.tsx` cubren objetos recogibles y documentos.

El HUD esta en `src/game/ui`. `GameHud.tsx` compone menus, objetivo, inventario, prompt, stamina, crosshair, efectos de pantalla, documentos y movil. `GameMenus.tsx` maneja menu principal, pausa, victoria y settings. `SettingsMenu.tsx` ajusta sensibilidad, volumenes, calidad grafica y fullscreen. `DocumentOverlay.tsx` suspende controles y muestra notas.

El audio esta en `src/game/audio`. `gameAudio.ts` reproduce WAVs, mantiene cache y mezcla master/music/sfx. `AudioController.tsx` inicia ambiente cuando hay pointer lock, reproduce pasos mientras el jugador camina/corre y lanza sonidos aleatorios. `AmbientSoundscape.tsx` genera drones procedurales con Web Audio segun distancia a emisores.

Prioridades para continuar: separar `MansionWorld` y `PuzzleObjects` en modulos/data, implementar guardado de progreso, dar uso a `batteries`/`crowbar`/`architectReport`, crear UI real de caja fuerte, corregir README de audio WAV/MP3, agregar tests de store/progresion, filtrar triggers por jugador y cancelar eventos async al reiniciar. No modificar archivos de juego si solo se quiere documentar; el documento actual es `PROJECT_CONTEXT.md`.
