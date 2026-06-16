# ⚡ NEXUS GG — LAN Center Platform (SQL Server Edition)

> Plataforma fullstack completa para LAN Center con **SQL Server**, React y Node.js.
> Panel de administración para gestionar usuarios, torneos, productos y anuncios.

---

## 🗂️ Estructura del Proyecto

```
nexusgg-sql/
├── backend/
│   ├── .env.example              ← Copia esto a .env y configura tus datos
│   ├── package.json
│   └── src/
│       ├── server.js             ← Punto de entrada
│       ├── app.js                ← Express + middleware
│       ├── config/
│       │   ├── database.js       ← Conexión a SQL Server (mssql)
│       │   └── schema.sql        ← Script SQL completo (referencia)
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── admin.controller.js
│       │   └── main.controller.js  ← users, tournaments, shop, ranking
│       ├── middleware/
│       │   └── auth.middleware.js  ← JWT protect/authorize
│       ├── routes/
│       │   └── index.js          ← Todas las rutas en un solo archivo
│       └── utils/
│           ├── setupDatabase.js  ← Crea tablas automáticamente
│           ├── seeder.js         ← Datos de prueba
│           ├── helpers.js
│           └── logger.js
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx               ← Router principal
        ├── main.jsx
        ├── context/AuthContext.jsx
        ├── services/api.service.js
        ├── styles/globals.css
        ├── components/layout/
        │   ├── Layout.jsx        ← Navbar + Footer público
        │   └── AdminLayout.jsx   ← Sidebar del panel admin
        └── pages/
            ├── Landing.jsx
            ├── Login.jsx / Register.jsx
            ├── Profile.jsx
            ├── Tournaments.jsx / TournamentDetail.jsx
            ├── Shop.jsx
            ├── Ranking.jsx
            ├── NotFound.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AdminUsers.jsx
                ├── AdminTournaments.jsx
                ├── AdminProducts.jsx
                ├── AdminAnnouncements.jsx
                └── AdminStats.jsx
```

---

## 🚀 Guía Rápida — Desde Cero en la Consola

### Pre-requisitos
- **Node.js >= 18** ([descargar](https://nodejs.org))
- **SQL Server** con autenticación SQL habilitada
- **SQL Server Management Studio (SSMS)** (opcional, para verificar)

---

### 1️⃣ Abrir terminal (PowerShell / CMD)

Ubícate en la carpeta del proyecto:

```bash
cd "C:\Users\jean\OneDrive - undac.edu.pe\Escritorio\nexusgg-sql"
```

> Si la ruta tiene espacios, las comillas dobles son obligatorias en PowerShell.

---

### 2️⃣ Crear la base de datos

Abre SSMS, conéctate a tu instancia de SQL Server y ejecuta:

```sql
CREATE DATABASE nexusgg;
```

Si no tienes SSMS, puedes usar `sqlcmd` desde la terminal:

```bash
sqlcmd -S localhost\JEANSQL -U sa -P NexusGG2024! -Q "CREATE DATABASE nexusgg"
```

Ajusta el nombre de instancia, usuario y contraseña según tu configuración.

---

### 3️⃣ Configurar e instalar Backend

```bash
cd backend
npm install
```

Luego abre el archivo **`.env`** (si no existe, copia desde `.env.example`):

```bash
notepad .env
```

Verifica que coincida con tu instancia de SQL Server:

```env
DB_SERVER=localhost
DB_INSTANCE=JEANSQL        ← nombre de tu instancia SQL
DB_DATABASE=nexusgg
DB_USER=sa
DB_PASSWORD=NexusGG2024!   ← tu contraseña SQL
```

> Si tu SQL Server es Express sin instancia nombrada, deja `DB_INSTANCE` vacío.
> Si usas Windows Auth, cambia `DB_WINDOWS_AUTH=true` y omite DB_USER/DB_PASSWORD.

---

### 4️⃣ Crear tablas y cargar datos de prueba

```bash
# Crea todas las tablas automáticamente:
npm run setup-db

# Carga usuarios de prueba (admin + gamer), productos, torneos y anuncios:
npm run seed
```

> Si el seed falla con error de "columna no válida", verifica que el paso de tablas se haya completado sin errores.

---

### 5️⃣ Iniciar el Backend

```bash
npm run dev
```

Deberías ver en la terminal:

```
✅ SQL Server conectado: localhost / nexusgg
🚀 NEXUS GG API en http://localhost:5000
📊 Health: http://localhost:5000/health
```

Si ves esto, el backend está corriendo correctamente.

> Deja esta terminal abierta. Abre **una segunda terminal** para el frontend.

---

### 6️⃣ Iniciar el Frontend

En la segunda terminal:

```bash
cd "C:\Users\jean\OneDrive - undac.edu.pe\Escritorio\nexusgg-sql\frontend"
npm install
npm run dev
```

Deberías ver:

```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173
```

---

### 7️⃣ Abrir la aplicación

Ve a `http://localhost:5173` en tu navegador.

Ya puedes iniciar sesión con las credenciales de prueba o crear una cuenta nueva.

---

### 🧪 Verificar que todo funciona

| Qué revisar | Cómo |
|-------------|------|
| Backend vivo | `curl http://localhost:5000/health` → `{"status":"ok"}` |
| Frontend cargando | Abrir `http://localhost:5173` → debe mostrar el Landing |
| Login admin | `admin@nexusgg.pe` / `Admin123!` → panel en `/admin` |
| Login gamer | `shadow@gmail.com` / `Pass123!` → perfil y torneos |

---

### 🛑 Detener el proyecto

En cada terminal presiona **`Ctrl + C`** y confirma con `S` (Sí).

O desde PowerShell:

```bash
Get-NetTCPConnection -LocalPort 5000 | ForEach { Stop-Process $_.OwningProcess -Force }
Get-NetTCPConnection -LocalPort 5173 | ForEach { Stop-Process $_.OwningProcess -Force }
```

---

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | `admin@nexusgg.pe` | `Admin123!` |
| Gamer | `shadow@gmail.com` | `Pass123!` |

Acceso al panel admin: `http://localhost:5173/admin`

---

## 🗃️ Tablas de la Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `Branches` | Sucursales — preparado para multi-sede |
| `Users` | Usuarios con gamificación (puntos, nivel, historial) |
| `Sessions` | Horas jugadas registradas por el administrador |
| `Tournaments` | Torneos con estado y formato |
| `TournamentParticipants` | Inscripciones a torneos |
| `Products` | Catálogo de la tienda de puntos |
| `Redemptions` | Historial de canjes de puntos |
| `Announcements` | Noticias, promociones y eventos |

---

## 📡 Endpoints de la API

### Autenticación
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### Usuarios (requiere login)
```
GET  /api/users/profile
PUT  /api/users/profile
GET  /api/users/history
GET  /api/users/notifications
GET  /api/users/my-redemptions
```

### Torneos (público)
```
GET  /api/tournaments
GET  /api/tournaments/:id
POST /api/tournaments/:id/register  (requiere login)
```

### Tienda
```
GET  /api/shop/products
POST /api/shop/redeem               (requiere login)
```

### Ranking
```
GET  /api/ranking
GET  /api/ranking/me                (requiere login)
```

### Admin (requiere rol admin/superadmin)
```
GET  /api/admin/dashboard
GET  /api/admin/stats
GET  /api/admin/users
GET  /api/admin/users/:id
POST /api/admin/users/:id/sessions  ← Asignar horas jugadas
POST /api/admin/tournaments
PUT  /api/admin/tournaments/:id
POST /api/admin/products
PUT  /api/admin/products/:id
DELETE /api/admin/products/:id
POST /api/admin/announcements
PUT  /api/admin/announcements/:id
DELETE /api/admin/announcements/:id
```

---

## 🔐 Seguridad

| Capa | Implementación |
|------|---------------|
| Contraseñas | bcrypt (salt 12) |
| Sesiones | JWT Access Token (15min) + Refresh Token (7d) |
| Rate limiting | 200 req/15min global · 20 req/15min en auth |
| Headers | Helmet (XSS, CORS, etc.) |
| SQL Injection | Queries con parámetros tipados (`mssql` inputs) |
| Roles | `user` / `admin` / `superadmin` |

---

## 📈 Niveles de Gamificación

| Nivel | Puntos | Ícono |
|-------|--------|-------|
| NOVATO | 0–24 | 🎮 |
| GAMER | 25–99 | ⚡ |
| PRO | 100–199 | 🏆 |
| LEYENDA | 200–499 | 👑 |
| INMORTAL | 500+ | 💎 |

**Puntos por hora según plan:**
- VIP: 1 punto/hora
- SUPER VIP: 2 puntos/hora
- PLATINUM: 3 puntos/hora

---

## 🏢 Escalabilidad Multi-Sede

La tabla `Branches` ya está diseñada para múltiples sucursales.
Cuando quieras agregar otra sede:

```sql
INSERT INTO Branches (name, slug, address, city, total_pcs)
VALUES ('NEXUS GG Lima', 'lima', 'Av. Principal 456', 'Lima', 50);
```

Los usuarios, sesiones, torneos y productos se pueden filtrar por `branch_id`.

---

## 🛠️ Solución de Problemas Comunes

**Error: "Login failed for user 'sa'"**
→ Habilitar autenticación SQL Server en SSMS:
`Properties → Security → SQL Server and Windows Authentication`

**Error: "Cannot open database nexusgg"**
→ Crear la base de datos primero:
```sql
CREATE DATABASE nexusgg;
```

**Error: "Named Pipes Provider: Could not open a connection"**
→ Habilitar TCP/IP en SQL Server Configuration Manager

**Error de puerto al conectar**
→ Verificar que SQL Server Browser esté corriendo
→ Para Express: agregar `DB_INSTANCE=SQLEXPRESS` en `.env`

**Error: `POST /api/admin/users/undefined/sessions 500`**
→ El frontend espera `_id` pero la BD devuelve `id`. El normalizador en `AdminUsers.jsx` lo resuelve automáticamente.

**Error: `Invalid column name 'NaN'`**
→ Misma causa: un `id` undefined produce `parseInt(undefined) = NaN`. Se soluciona con la normalización.

**Error: torneos siempre muestran "Lleno"**
→ La API devuelve `participant_count` (número) pero el frontend esperaba `participants[]` (arreglo). El `normalizeTournament()` crea un arreglo sintético con la longitud correcta.

**Error: `Cannot read properties of undefined (reading 'map')`**
→ Los datos de la API tienen campos en snake_case (`prize_text`, `max_participants`), el frontend usa camelCase. Solucionado con las funciones `normalizeTournament()` y `normalizeUser()`.
