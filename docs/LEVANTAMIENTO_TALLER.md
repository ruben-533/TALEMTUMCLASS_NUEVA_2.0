# Levantamiento de información — Taller de autenticación y CRUD con Node.js + SQLite

**Curso:** Desarrollo Web — Martes — Presencial 24230
**Actividad:** Taller — Conexión a bases de datos — creación y autenticación de usuarios
**Apertura:** martes 3 de noviembre de 2026, 00:00
**Cierre:** martes 10 de noviembre de 2026, 23:00
**Estado:** Por hacer — pendiente de envío y calificación

---

## 1. Objetivo de la actividad

Tomar como base el CRUD de categorías construido en el video de Node.js + SQLite y ampliarlo con:

1. Una tabla de usuarios.
2. Un formulario de registro.
3. Un formulario de inicio de sesión.
4. Validaciones en registro, autenticación y CRUD.
5. Protección del CRUD: solo un usuario autenticado puede entrar a gestionar las categorías.

En otras palabras: pasar de un CRUD abierto a una pequeña aplicación con **registro, login, sesión y acceso protegido**.

---

## 2. Alcance

### Incluido

- Base de datos SQLite con tablas de `usuarios` y `categorias`.
- Registro de usuario con validaciones.
- Inicio y cierre de sesión.
- Contraseñas almacenadas con hash (nunca en texto plano).
- Middleware que impide acceder a `/categorias` sin sesión.
- CRUD completo de categorías: listar, crear, editar y eliminar.
- Mensajes de error y de éxito visibles para el usuario.
- Capturas de ejecución para el PDF.
- Despliegue público de la aplicación.
- Repositorio público en GitHub.

### No incluido (salvo que el docente lo pida)

- Recuperación de contraseña por correo.
- Inicio de sesión con Google.
- Roles y permisos avanzados.
- Panel de administración.
- Integración con pasarelas de pago.

---

## 3. Actores

| Actor | Descripción | Acciones |
| --- | --- | --- |
| Visitante | Persona sin sesión iniciada | Registrarse, iniciar sesión |
| Usuario autenticado | Persona con sesión activa | Ver, crear, editar y eliminar categorías, cerrar sesión |

---

## 4. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF-01 | El sistema debe permitir registrar un usuario con nombre, correo y contraseña. | Alta |
| RF-02 | El sistema debe validar que el correo tenga formato válido y no esté registrado. | Alta |
| RF-03 | El sistema debe validar la contraseña y su confirmación. | Alta |
| RF-04 | El sistema debe almacenar la contraseña como hash. | Alta |
| RF-05 | El sistema debe permitir iniciar sesión con correo y contraseña. | Alta |
| RF-06 | El sistema debe crear una sesión al autenticar correctamente. | Alta |
| RF-07 | El sistema debe permitir cerrar sesión. | Alta |
| RF-08 | El sistema debe redirigir al login si se intenta acceder al CRUD sin sesión. | Alta |
| RF-09 | El usuario autenticado debe poder listar las categorías. | Alta |
| RF-10 | El usuario autenticado debe poder crear una categoría. | Alta |
| RF-11 | El usuario autenticado debe poder editar una categoría existente. | Alta |
| RF-12 | El usuario autenticado debe poder eliminar una categoría con confirmación. | Alta |
| RF-13 | El sistema debe impedir categorías duplicadas o vacías. | Media |
| RF-14 | El sistema debe mostrar mensajes claros de error y de éxito. | Media |
| RF-15 | El sistema debe conservar los datos al reiniciar el servidor (archivo SQLite persistente). | Media |

---

## 5. Validaciones mínimas

### 5.1 Registro

| Campo | Regla | Mensaje sugerido |
| --- | --- | --- |
| Nombre | Obligatorio, 2–120 caracteres, solo letras y espacios | “Ingresa tu nombre completo.” |
| Correo | Obligatorio, formato válido, máximo 160 caracteres, único | “Ese correo ya está registrado.” |
| Contraseña | Obligatoria, mínimo 8 caracteres, al menos una letra y un número | “La contraseña debe tener al menos 8 caracteres, una letra y un número.” |
| Confirmación | Obligatoria e igual a la contraseña | “Las contraseñas no coinciden.” |

### 5.2 Inicio de sesión

| Caso | Regla |
| --- | --- |
| Campos vacíos | Mostrar “Completa todos los campos.” |
| Correo inexistente o contraseña incorrecta | Mostrar un mensaje genérico: “Correo o contraseña incorrectos.” |
| Éxito | Crear sesión y redirigir a `/categorias`. |
| Intentos repetidos | Limitar intentos (por ejemplo, 5 por minuto por IP) como mejora de seguridad. |

> Importante: no revelar si el correo existe o no. Eso evita que alguien descubra qué usuarios están registrados.

### 5.3 Categorías

| Campo | Regla |
| --- | --- |
| Nombre | Obligatorio, 2–80 caracteres, único (sin distinguir mayúsculas) |
| Descripción | Opcional, máximo 255 caracteres |
| ID en URL | Debe ser un número entero válido |
| Eliminación | Confirmar antes de borrar; si no existe, responder 404 |
| Acceso | Requiere sesión activa |

### 5.4 Validaciones técnicas

- Consultas SQL con **parámetros** (`?`), nunca concatenando texto.
- Escapado de salida en las vistas para evitar XSS.
- Validación también en el servidor, no solo en el HTML.
- Límite de tamaño del cuerpo de la petición.
- Sesión con cookie `HttpOnly`.
- No mostrar mensajes internos de SQL al usuario.

---

## 6. Requerimientos no funcionales

| ID | Requerimiento |
| --- | --- |
| RNF-01 | La aplicación debe funcionar en Node.js 20 o superior. |
| RNF-02 | La base de datos debe ser SQLite, según la actividad. |
| RNF-03 | El código debe estar organizado en carpetas claras. |
| RNF-04 | El repositorio debe ser público y no incluir `node_modules`, la base de datos ni el archivo `.env`. |
| RNF-05 | La aplicación debe estar desplegada y accesible por URL. |
| RNF-06 | La interfaz debe ser usable en escritorio y móvil. |
| RNF-07 | Los errores deben mostrarse en español y sin datos técnicos sensibles. |

---

## 7. Modelo de datos propuesto (SQLite)

```sql
CREATE TABLE usuarios (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  creado_en     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE categorias (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  descripcion TEXT,
  creado_en   TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Decisión pendiente

¿Las categorías son **globales** (todos los usuarios ven las mismas) o **propias de cada usuario**?

- **Global:** más simple y coherente con el CRUD del video.
- **Por usuario:** agregar `usuario_id` a `categorias` y filtrar siempre por el usuario de la sesión.

Para el taller se recomienda **global**, salvo que el docente indique lo contrario.

---

## 8. Rutas y endpoints propuestos

| Método | Ruta | Acceso | Función |
| --- | --- | --- | --- |
| GET | `/` | Público | Redirige a `/login` o `/categorias` |
| GET | `/registro` | Público | Formulario de registro |
| POST | `/registro` | Público | Crear usuario |
| GET | `/login` | Público | Formulario de login |
| POST | `/login` | Público | Autenticar usuario |
| POST | `/logout` | Autenticado | Cerrar sesión |
| GET | `/categorias` | Autenticado | Listar categorías |
| GET | `/categorias/nueva` | Autenticado | Formulario de creación |
| POST | `/categorias` | Autenticado | Guardar categoría |
| GET | `/categorias/:id/editar` | Autenticado | Formulario de edición |
| POST | `/categorias/:id` | Autenticado | Actualizar categoría |
| POST | `/categorias/:id/eliminar` | Autenticado | Eliminar categoría |

> Se usa `POST` para actualizar y eliminar porque los formularios HTML solo soportan GET y POST. Si se usa una API, se pueden usar `PUT/PATCH` y `DELETE`.

---

## 9. Flujo de navegación

```text
Inicio
  │
  ├─ ¿Tiene sesión? ── No ──> /login ──> credenciales válidas ──> /categorias
  │                                  └─> credenciales inválidas ─> error
  │
  └─ Sí ──> /categorias
              ├─ Crear
              ├─ Editar
              ├─ Eliminar
              └─ Cerrar sesión ──> /login
```

---

## 10. Arquitectura recomendada

### Opción A — Aplicación separada (recomendada para el taller)

```text
taller-categorias/
├─ app.js
├─ db.js
├─ middleware/auth.js
├─ routes/auth.js
├─ routes/categorias.js
├─ views/
│  ├─ layout.ejs
│  ├─ login.ejs
│  ├─ registro.ejs
│  └─ categorias/
│     ├─ lista.ejs
│     ├─ formulario.ejs
├─ public/styles.css
├─ database.sqlite
├─ .env
├─ .gitignore
└─ package.json
```

**Stack:**

- Node.js + Express
- SQLite con `better-sqlite3` (simple y síncrono)
- Vistas EJS
- `bcryptjs` para hash de contraseñas
- `express-session` + `connect-sqlite3` para sesiones persistentes
- `express-validator` o validación manual
- `helmet`, `morgan`, `dotenv`

**Ventajas:** se parece al video, es rápido de construir y fácil de explicar en el PDF.
**Tiempo estimado:** 1 día de desarrollo + 1 día de pruebas, despliegue y documento.

### Opción B — Integrarlo al proyecto TALEMTUMCLASS

Reutilizar el frontend React existente y crear un backend API con Express + SQLite. Implica:

- Endpoints JSON.
- Cambiar `AuthFlow.tsx` para consumir la API.
- Manejo de sesión o JWT en React.
- Adaptar el CRUD de categorías a nuevas pantallas.

**Ventaja:** queda integrado con el proyecto grande.
**Riesgo:** es bastante más trabajo y el taller pide específicamente el CRUD de categorías del video.

> Para cumplir la actividad a tiempo, la Opción A es la más segura. La Opción B se puede plantear como evolución posterior.

---

## 11. Seguridad mínima esperada

- Hash con `bcryptjs` (10–12 rondas). Nunca guardar la contraseña original.
- Cookie de sesión `HttpOnly`, `SameSite=Lax` y `Secure` en producción.
- `SESSION_SECRET` en `.env`.
- Consultas preparadas.
- Validación en servidor.
- Mensaje genérico en login fallido.
- Limitar intentos de login.
- No subir `.env` ni `database.sqlite` al repositorio.
- Cerrar la sesión correctamente con `req.session.destroy()`.

---

## 12. Entregables

| # | Entregable | Detalle |
| --- | --- | --- |
| 1 | **PDF** | Explicación del código + capturas de ejecución |
| 2 | **Link de despliegue** | Aplicación funcionando públicamente |
| 3 | **Link de repositorio GitHub** | Repositorio público con README |

### Contenido sugerido del PDF

1. Portada (nombre, curso, fecha).
2. Descripción de la actividad y objetivo.
3. Tecnologías utilizadas.
4. Estructura del proyecto.
5. Explicación de la conexión a SQLite.
6. Explicación del registro y del hash de contraseñas.
7. Explicación del login y de la sesión.
8. Explicación del middleware de protección.
9. Explicación del CRUD de categorías.
10. Capturas:
    - Formulario de registro.
    - Error de validación (correo duplicado o contraseñas distintas).
    - Registro exitoso.
    - Login incorrecto.
    - Login correcto.
    - Lista de categorías.
    - Crear categoría.
    - Editar categoría.
    - Eliminar categoría con confirmación.
    - Intento de entrar a `/categorias` sin sesión (redirección).
11. Conclusiones.
12. Enlaces al despliegue y al repositorio.

---

## 13. Criterios de aceptación

- [ ] Se puede registrar un usuario nuevo.
- [ ] No se permiten correos duplicados.
- [ ] No se permiten contraseñas débiles ni confirmaciones distintas.
- [ ] La contraseña se guarda como hash en la base de datos.
- [ ] Un usuario registrado puede iniciar sesión.
- [ ] Un login incorrecto muestra error sin revelar datos.
- [ ] Sin sesión, `/categorias` redirige al login.
- [ ] Con sesión, se pueden listar, crear, editar y eliminar categorías.
- [ ] Los datos persisten al reiniciar el servidor.
- [ ] La aplicación está desplegada y accesible.
- [ ] El repositorio es público y tiene README.
- [ ] El PDF incluye explicación y capturas reales.

---

## 14. Plan de trabajo (cierre: 10 de noviembre, 23:00)

### Día 1 — 8 de noviembre

- [ ] Confirmar con el docente si se usa el código del video y qué framework de vistas.
- [ ] Crear el repositorio y la estructura del proyecto.
- [ ] Configurar SQLite y las tablas.
- [ ] Implementar registro con validaciones y hash.
- [ ] Implementar login, sesión, logout y middleware.

### Día 2 — 9 de noviembre

- [ ] Implementar el CRUD de categorías.
- [ ] Aplicar validaciones y mensajes.
- [ ] Probar todos los casos de la lista de aceptación.
- [ ] Preparar el despliegue con volumen persistente para SQLite.
- [ ] Tomar capturas de ejecución.

### Día 3 — 10 de noviembre (margen)

- [ ] Redactar el PDF.
- [ ] Verificar enlaces de despliegue y GitHub.
- [ ] Entregar antes de las 23:00.

---

## 15. Riesgos y consideraciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| SQLite en hosting con sistema de archivos efímero | Los datos se borran al reiniciar | Usar un volumen persistente (Railway/Fly.io) o Turso |
| No tener el código del video | Diferencias con lo esperado | Pedir el enlace del video o del repositorio base |
| Contraseñas sin hash | Pérdida de puntos y riesgo de seguridad | Usar `bcryptjs` desde el inicio |
| Validar solo en el navegador | Se puede saltar la validación | Validar siempre en el servidor |
| Subir `.env` o la base de datos a GitHub | Fuga de información | Configurar `.gitignore` |
| Falta de tiempo | Entrega incompleta | Priorizar registro, login, protección y CRUD; luego mejoras |

---

## 16. Preguntas pendientes para cerrar el levantamiento

1. ¿El taller debe hacerse sobre la **aplicación de categorías del video** o se puede integrar al proyecto **TALEMTUMCLASS**?
2. ¿Tienes el **enlace del video** o el código base del CRUD de categorías?
3. ¿El docente exige un framework específico (Express, EJS, React) o solo Node.js + SQLite?
4. ¿Las categorías deben ser **globales** o **propias de cada usuario**?
5. ¿La autenticación debe usar **sesiones con cookie** o **JWT**?
6. ¿El despliegue puede hacerse en Railway/Render/Fly.io, o hay una plataforma obligatoria?
7. ¿El trabajo es individual o grupal? ¿El repositorio debe ser de una sola persona?
8. ¿Hay rúbrica o formato específico para el PDF?

---

## 17. Resumen ejecutivo

La actividad pide **ampliar un CRUD de categorías** con un sistema de usuarios: registro, autenticación, sesión y protección de rutas, aplicando validaciones y buenas prácticas de seguridad. Se entrega un **PDF explicativo con capturas**, un **despliegue funcional** y un **repositorio público**.

La ruta más segura es construir una aplicación pequeña con **Node.js + Express + SQLite + EJS**, mantener el alcance del video y dejar la integración con TALEMTUMCLASS como una evolución posterior.
