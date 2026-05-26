# Plan de pruebas y evidencias

## Entorno

- Backend: `http://localhost:3005`
- Swagger: `http://localhost:3005/api`
- Frontend: `http://localhost:5173`
- Base de datos: PostgreSQL `gestionD`

## Credenciales de prueba

| Rol | Email | Password |
|---|---|---|
| Admin | admin@ucb.edu.bo | admin123 |
| Jugador | jugador@ucb.edu.bo | jugador123 |
| Delegado | delegado@ucb.edu.bo | delegado123 |

## Casos de prueba backend

| Caso | Endpoint | Resultado esperado |
|---|---|---|
| Login correcto | `POST /auth/login` | Devuelve `access_token` y usuario |
| Registro correcto | `POST /auth/register` | Crea persona y asigna rol Jugador |
| Listar personas | `GET /persona` | No expone `password` |
| Listar disciplinas | `GET /disciplina` | Devuelve arreglo de disciplinas |
| Crear equipo | `POST /equipo` | Crea equipo con carrera y disciplina |
| Crear torneo | `POST /torneo` | Crea torneo con disciplina |
| Crear fixture | `POST /fixture` | Crea partido |
| Registrar resultado | `PATCH /fixture/:id` | Actualiza resultado |
| Crear cancha | `POST /cancha` | Crea cancha |
| Crear reserva | `POST /reserva` | Crea reserva asociada a cancha |

## Casos de prueba frontend

| Caso | Pantalla | Resultado esperado |
|---|---|---|
| Login | `/login` | Redirige a dashboard |
| Registro | `/register` | Crea usuario y redirige a login |
| Equipos | `/equipos` | Lista equipos y permite crear |
| Jugadores | `/jugadores` | Lista personas del backend |
| Torneos | `/torneos` | Lista torneos y permite crear |
| Resultados | `/resultados` | Lista fixtures y registra resultado |
| Reservas | `/reservas` | Lista canchas/reservas y permite reservar |
| Disciplinas | `/disciplinas` | Lista disciplinas |

## Comandos de verificacion

```powershell
cd Backend
npm run build
node dist/main.js
```

En otra terminal:

```powershell
cd Backend
npm run smoke:test
```

```powershell
cd Frontend
npm run build
npm run dev
```

## Evidencias sugeridas para entregar

- Captura de Swagger abierto en `/api`.
- Captura del login exitoso.
- Captura del registro exitoso.
- Captura de dashboard.
- Captura de listado de jugadores.
- Captura de creacion de equipo.
- Captura de creacion de torneo.
- Captura de reserva creada.
- Captura de terminal con `npm run build` exitoso en Backend y Frontend.
