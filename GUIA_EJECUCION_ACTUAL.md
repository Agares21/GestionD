# Guia de ejecucion actual

## 1. Backend

```powershell
cd Backend
npm install
npm run build
node dist/main.js
```

Backend:

```txt
http://localhost:3005
```

Swagger:

```txt
http://localhost:3005/api
```

## 2. Frontend

```powershell
cd Frontend
npm install
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

## 3. Variables de entorno

Backend `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=agares
DB_NAME=gestionD
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:3005
```

## 4. Solucion a puerto ocupado

```powershell
$listener = Get-NetTCPConnection -LocalPort 3005 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) { Stop-Process -Id $listener.OwningProcess -Force }
```
