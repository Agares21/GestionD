# Decisiones tecnicas y plan de mejora

## Contexto

GestionD es una aplicacion web fullstack para administrar competencias deportivas universitarias. A partir de la retroalimentacion docente, se reforzaron tres aspectos: arquitectura backend, validaciones y experiencia de usuario/documentacion.

## Respuesta al diagnostico docente

El diagnostico indica que el proyecto es aceptable y tiene bases tecnicas razonables, pero tambien senala inconsistencias. Para responder a esa observacion, se realizaron mejoras concretas:

- Se reforzo la validacion global del backend.
- Se endurecieron los DTOs de los modulos principales.
- Se documento la justificacion de las decisiones tecnicas.
- Se definio un plan de mejora para arquitectura, UX y pruebas.

## Arquitectura backend

Se mantiene NestJS porque permite organizar el sistema por modulos de dominio. Cada modulo separa controlador, servicio, entidad y DTO, lo que facilita mantenimiento y crecimiento.

Decisiones aplicadas:

- Modulos por dominio: autenticacion, personas, roles, carreras, disciplinas, equipos, torneos, fixtures, canchas y reservas.
- TypeORM para mapear entidades y relaciones con PostgreSQL.
- DTOs para controlar la estructura de datos recibida por la API.
- `ValidationPipe` global para validar datos antes de ejecutar la logica de negocio.
- `whitelist` y `forbidNonWhitelisted` para rechazar propiedades no esperadas.
- Transformacion implicita para convertir valores HTTP a tipos esperados cuando corresponde.

## Seguridad

La autenticacion usa JWT porque permite proteger rutas y mantener una sesion stateless entre frontend y backend.

Decisiones aplicadas:

- Las contrasenas se almacenan con hash usando bcrypt.
- El token JWT incluye identificador, email y roles del usuario.
- Los roles se normalizan para facilitar el control desde guards y frontend.
- El registro valida duplicados de email y carnet.
- El correo institucional `@ucb.edu.bo` se valida en backend y frontend.

## Validaciones reforzadas

La observacion docente indicaba que las validaciones eran insuficientes. Por eso se reforzaron los DTOs principales:

- Login: email obligatorio y contrasena minima.
- Persona: longitudes minimas, carnet valido, celular numerico y email institucional.
- Carrera y disciplina: nombres con longitud minima y maxima.
- Equipo: nombre valido e identificadores enteros positivos.
- Torneo: tipo controlado, disciplina positiva, fechas ISO y URL valida de imagen.
- Fixture: ronda, equipos, resultados e identificadores enteros positivos.
- Cancha: capacidad entera, estado controlado y longitudes maximas.
- Reserva: cancha/equipo positivos, fecha ISO, horas en formato `HH:mm`, estado controlado y observaciones limitadas.

## Experiencia de usuario

El frontend ya cuenta con pantallas separadas, rutas protegidas, formularios, estados de carga y mensajes de error. Como mejora prioritaria se recomienda mantener consistencia visual y mensajes claros en operaciones sensibles.

Lineamientos adoptados:

- Formularios con validacion visible antes de enviar al backend.
- Mensajes especificos para login, registro y conflictos de datos.
- Estados de carga en acciones principales.
- Navegacion diferenciada por autenticacion y rol.

## Integracion con base de datos

PostgreSQL se usa como motor relacional porque el dominio requiere relaciones claras entre personas, roles, carreras, disciplinas, equipos, torneos, fixtures y reservas.

Decisiones aplicadas:

- Entidades TypeORM por tabla principal.
- Relaciones cargadas en consultas donde el frontend necesita datos compuestos.
- Configuracion por variables de entorno para facilitar ejecucion local.
- `synchronize` limitado por entorno, evitando su uso en produccion.

## Riesgos identificados

- Algunos servicios todavia pueden fortalecerse con reglas de negocio adicionales.
- La eliminacion de registros relacionados debe seguir cuidandose para evitar inconsistencias.
- La UX puede mejorar con confirmaciones, filtros y mensajes mas consistentes.
- Faltan pruebas automatizadas unitarias, aunque existe documentacion y plan de pruebas.

## Plan de mejora

1. Reforzar servicios con validaciones de negocio: existencia de entidades relacionadas, rangos de fecha y conflictos de horario.
2. Agregar pruebas unitarias para autenticacion, reservas, torneos y fixtures.
3. Mejorar tablas y formularios del frontend con confirmaciones, filtros y mensajes consistentes.
4. Documentar flujos principales con capturas o casos de prueba ejecutados.
5. Preparar una demostracion corta enfocada en login, roles, gestion de torneos y reservas.

## Cierre

Con estas mejoras, el proyecto deja de presentarse solo como una aplicacion que cumple los requisitos minimos y pasa a mostrar criterios de mantenibilidad, seguridad, validacion y evolucion tecnica.
