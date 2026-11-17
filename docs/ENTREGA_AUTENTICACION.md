# Entrega — Registro y autenticación con SQLite

Documento de apoyo para la entrega académica del CRUD de categorías con usuarios y autenticación.

## Archivos de la entrega

| Archivo | Descripción |
| --- | --- |
| `docs/Entrega_Autenticacion_SQLite.pdf` | Documento listo para entregar (explicación + capturas). |
| `docs/entrega-autenticacion.html` | Fuente del PDF, editable e imprimible. |
| `docs/capturas/` | Capturas de registro, login, validaciones, CRUD y panel de usuarios. |
| `database/schema.sqlite.sql` | Esquema real de la base SQLite. |
| `server/db.js` | Creación de tablas, datos iniciales y conexión. |
| `server/auth.js` | Hash scrypt, sesiones, validaciones y middlewares. |
| `server/index.js` | Endpoints de autenticación y CRUD de categorías. |
| `src/lib/auth.ts` | Cliente de autenticación del frontend. |
| `src/lib/categories.ts` | Cliente del CRUD de categorías. |
| `src/screens/auth/AuthFlow.tsx` | Formularios de registro y login reales. |
| `src/screens/categories/Categories.tsx` | Pantalla CRUD protegida por sesión. |

## Ejecutar

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173/#/register` o `http://localhost:5173/#/login`.

La base se crea automáticamente en `database/talentumclass.db` (excluida de Git).

## Cuenta de administrador inicial

```text
Correo:     admin@talemtumclass.com
Contraseña: Admin1234
```

Cambiar en `.env`:

```env
ADMIN_EMAIL=admin@talemtumclass.com
ADMIN_PASSWORD=Admin1234
```

## Funcionalidades implementadas

- Tabla `usuarios` con nombre, apellido, correo único, hash de contraseña, rol, ciudad y fechas.
- Registro con validaciones en cliente y servidor.
- Login con verificación scrypt y mensaje genérico ante credenciales incorrectas.
- Sesiones con token aleatorio, hash SHA-256 en base y cookie `httpOnly` de 7 días.
- Cierre de sesión real.
- Recuperación de la sesión al recargar (`GET /api/auth/me`).
- CRUD de categorías con `GET`, `POST`, `PUT` y `DELETE`.
- Escrituras de categorías rechazadas sin sesión (401).
- Panel de administración con usuarios reales leídos desde SQLite.
- Límite de intentos de login/registro por IP.
- Consultas SQL preparadas.

## Capturas incluidas

1. `01-registro.png` — formulario de registro.
2. `02-login.png` — inicio de sesión.
3. `03-validaciones.png` — errores por campo.
4. `04-categorias-crud.png` — CRUD con sesión activa.
5. `05-categoria-creada.png` — categoría creada y persistida.
6. `06-admin-usuarios.png` — usuarios reales desde SQLite.

## Enlaces pendientes de publicar

- Repositorio GitHub: `https://github.com/<usuario>/TALEMTUCLASS`
- Despliegue: completar después de publicar en Render, Railway, Fly.io u otro proveedor.

> Para producción: cambiar la contraseña del administrador y restringir el CRUD de categorías al rol `admin`.
