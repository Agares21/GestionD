# Analisis y planteamiento del proyecto

## 1. Problema y contexto

La Universidad necesita administrar competencias deportivas universitarias de forma organizada. Antes del sistema, la informacion de carreras, disciplinas, equipos, jugadores, torneos, fixtures, resultados y reservas de canchas puede quedar dispersa en hojas de calculo, mensajes o registros manuales. Esto dificulta la inscripcion de participantes, la consulta de datos, la programacion de partidos y la revision de resultados.

GestionD es un sistema fullstack para centralizar la gestion deportiva universitaria. El sistema esta orientado a administradores, delegados, jugadores y usuarios autenticados que necesitan registrar, consultar y actualizar informacion deportiva desde una interfaz web conectada a una API REST.

## 2. Usuarios del sistema

- Administrador: gestiona usuarios, carreras, disciplinas, equipos, torneos, canchas, reservas y resultados.
- Delegado: consulta y gestiona informacion relacionada con equipos y torneos.
- Jugador: puede autenticarse y acceder a vistas permitidas segun su rol.
- Usuario visitante: puede registrarse con correo institucional para obtener acceso inicial como jugador.

## 3. Objetivo general

Desarrollar una aplicacion web fullstack para gestionar competencias deportivas universitarias mediante un frontend en React y un backend en NestJS conectado a PostgreSQL.

## 4. Objetivos especificos

- Implementar autenticacion con JWT y roles de usuario.
- Registrar personas y asignar rol inicial al usuario registrado.
- Gestionar carreras, disciplinas, equipos, jugadores, torneos, fixtures, resultados, canchas y reservas.
- Exponer una API REST modular, documentada y consumida por el frontend.
- Persistir informacion en PostgreSQL usando TypeORM.
- Presentar una interfaz navegable, protegida por rutas y conectada con los modulos principales del backend.

## 5. Alcance funcional

Incluido:

- Login y registro de usuarios.
- Control basico de roles.
- CRUD de carreras, disciplinas, personas, roles, equipos, torneos, fixtures, canchas y reservas.
- Relacion persona-rol, jugador-equipo y torneo-equipo.
- Registro de resultados por medio de actualizacion de fixtures.
- Consumo de API desde servicios frontend.
- Documentacion Swagger en `/api`.

No incluido o limitado:

- Despliegue remoto en servidor publico.
- Reportes PDF/Excel.
- Notificaciones en tiempo real.
- Pagos, academias, comunicados e historial como modulos persistentes completos.

## 6. Requerimientos funcionales

| Codigo | Requerimiento | Backend | Frontend |
|---|---|---|---|
| RF-01 | El usuario puede iniciar sesion con email y contrasena | `/auth/login` | LoginForm, authService |
| RF-02 | El usuario puede registrarse con correo institucional | `/auth/register` | RegisterForm |
| RF-03 | El sistema asigna rol Jugador al registrarse | AuthService + persona_rol | AuthStore |
| RF-04 | El administrador puede gestionar disciplinas | `/disciplina` | DisciplinesPage |
| RF-05 | El administrador puede gestionar equipos | `/equipo` | TeamList |
| RF-06 | El sistema puede listar jugadores/personas | `/persona` | PlayersPage |
| RF-07 | El administrador puede gestionar torneos | `/torneo` | TournamentList |
| RF-08 | El sistema puede registrar fixtures y resultados | `/fixture` | MatchResultsList |
| RF-09 | El sistema puede gestionar canchas | `/cancha` | ReservationCalendar |
| RF-10 | El sistema puede crear y consultar reservas | `/reserva` | ReservationCalendar |

## 7. Requerimientos no funcionales

| Codigo | Requerimiento | Evidencia |
|---|---|---|
| RNF-01 | Arquitectura modular | Modulos NestJS por dominio y carpetas frontend por capa |
| RNF-02 | Seguridad basica | JWT, roles, guards, ocultamiento de password en `/persona` |
| RNF-03 | Validacion de datos | ValidationPipe global y DTOs con class-validator |
| RNF-04 | Mantenibilidad | Servicios, controladores, stores y servicios API separados |
| RNF-05 | Reproducibilidad local | README, QUICKSTART, `.env`, scripts npm |
| RNF-06 | Documentacion tecnica | Swagger, README, API_EXAMPLES y este documento |

## 8. Justificacion tecnica

NestJS permite estructurar el backend por modulos y separar controladores, servicios, entidades y DTOs. TypeORM facilita la persistencia en PostgreSQL y la representacion de relaciones. React con Vite permite una interfaz rapida y modular. Zustand reduce complejidad en el manejo de estado y Axios centraliza el consumo de API con interceptores para autenticacion.

La eleccion fullstack es adecuada porque el sistema requiere persistencia, autenticacion, reglas de negocio, relaciones entre entidades y una interfaz web para usuarios finales.
