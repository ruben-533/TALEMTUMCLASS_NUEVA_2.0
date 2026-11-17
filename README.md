# TALEMTUMCLASS

Prototipo funcional de la plataforma de tutorías **TALEMTUMCLASS**, organizado como un proyecto real de **React + Vite + TypeScript + Tailwind CSS**.

Incluye todas las pantallas del diseño de Figma Make: landing, autenticación, selección de rol, onboarding de estudiante y tutor, dashboards, búsqueda, perfil de tutor, reserva, recomendaciones con IA, sesiones virtuales y presenciales, calificación, notificaciones, mensajes, historial, solicitudes y disponibilidad del tutor, panel de administración y design system.

---

## 1. Requisitos

- **Node.js 22 o superior** (probado con Node 26). Se usa el módulo nativo `node:sqlite` para la base de datos.
- **npm** (viene incluido con Node.js)
- **Visual Studio Code** (recomendado) o cualquier editor compatible con TypeScript

> Visual Studio 2022 (el IDE de .NET) no está pensado para proyectos Vite/React. Para este proyecto usa **Visual Studio Code**, que es el entorno recomendado.

### Comprobar que Node está instalado

```bash
node -v
npm -v
```

Si no aparece una versión, descarga Node.js desde <https://nodejs.org> y vuelve a abrir la terminal.

---

## 2. Cómo abrir y ejecutar el proyecto

### Forma rápida en este equipo

Dentro de la carpeta `TALEMTUCLASS` hay dos archivos que puedes usar con doble clic:

| Archivo | Para qué sirve |
| --- | --- |
| `ABRIR_EN_VSCODE.bat` | Abre el proyecto ya organizado en Visual Studio Code |
| `INICIAR_APP.bat` | Inicia la aplicación y abre el navegador automáticamente |

Pasos recomendados:

1. Abre la carpeta `C:\Users\javir\Documents\TALEMTUCLASS` en el Explorador de Windows.
2. Haz doble clic en **`ABRIR_EN_VSCODE.bat`**.
3. En VS Code abre la terminal con `` Ctrl + ` ``.
4. Ejecuta:

   ```bash
   npm run dev
   ```

5. Abre `http://localhost:5173`.

Si prefieres no usar VS Code, haz doble clic en **`INICIAR_APP.bat`** y espera a que se abra el navegador.

> En este equipo Node.js ya está instalado en `C:\Program Files\nodejs` (verificado con Node 26 y npm 11). Si `npm` no responde en una terminal que ya estaba abierta, cierra esa terminal y abre una nueva, reinicia VS Code, o usa el atajo `Ctrl + Shift + B` (tarea **Iniciar TALEMTUMCLASS**).

### Opción A — Visual Studio Code (manual)

1. Abre VS Code.
2. `Archivo → Abrir carpeta…` y selecciona `TALEMTUCLASS`.
3. Abre la terminal integrada con `` Ctrl + ` ``.
4. Instala las dependencias (solo la primera vez):

   ```bash
   npm install
   ```

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

6. Abre en el navegador la URL que muestra la terminal, normalmente:

   ```
   http://localhost:5173
   ```

7. Para detener el servidor pulsa `Ctrl + C` en la terminal.

### Opción B — Terminal de Windows

```powershell
cd C:\Users\javir\Documents\TALEMTUCLASS
npm install
npm run dev
```

### Comandos disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Arranca Vite **y** la API de Lumen IA a la vez |
| `npm run dev:web` | Solo el frontend (Vite) |
| `npm run dev:api` | Solo el servidor de Lumen IA (Express) |
| `npm run build` | Compila la versión de producción en `dist/` |
| `npm start` | Sirve `dist/` y la API desde un solo servidor |
| `npm run preview` | Sirve localmente la versión compilada |
| `npm run typecheck` | Revisa errores de TypeScript sin compilar |
| `npm run db:ver` | Muestra usuarios, categorías y sesiones de la base SQLite |
| `npm run db:ver -- usuarios` | Muestra una tabla concreta (`usuarios`, `categorias` o `sesiones`) |

### Activar Lumen IA con Gemini

Lumen IA usa **Google Gemini** a través de un servidor propio. La clave **nunca** se envía al navegador.

1. Entra a <https://aistudio.google.com/apikey> y crea una API key.
2. Abre el archivo `.env` de la raíz del proyecto.
3. Pega la clave después del signo igual:

   ```env
   GEMINI_API_KEY=tu_clave_aqui
   ```

4. Guarda y reinicia el servidor:

   ```bash
   npm run dev
   ```

5. Entra a `http://localhost:5173/#/ai-recommend`.

Puedes cambiar el modelo en `.env` con `GEMINI_MODEL` (por defecto `gemini-3.5-flash`). Si la clave no está configurada, la interfaz funciona y muestra un aviso claro en lugar de romperse.

> El archivo `.env` está excluido de Git. No lo subas al repositorio. En producción, configura `GEMINI_API_KEY` en las variables de entorno de la plataforma de despliegue.

### Usuarios, autenticación y base de datos SQLite

El registro y el inicio de sesión ya son **reales**. La información se guarda en SQLite usando el módulo nativo `node:sqlite` (sin instalar drivers externos).

- Archivo de base de datos: `database/talentumclass.db` (se crea automáticamente).
- Esquema documentado: `database/schema.sqlite.sql`.
- Contraseñas: se guardan con **scrypt** y sal aleatoria. Nunca se guarda la contraseña en texto plano.
- Sesiones: token aleatorio en una cookie **httpOnly**, `SameSite=Lax`, con vencimiento de 7 días. En la base solo se guarda el hash SHA-256 del token.
- Validaciones: nombre y apellido, formato de correo, correo único, contraseña de 8 a 72 caracteres con letra y número, confirmación de contraseña, límite de intentos y mensajes de error por campo.
- Categorías: CRUD completo en `#/categories`, protegido por sesión.

**Cuenta de administrador inicial** (se crea al arrancar el servidor):

```text
Correo:     admin@talemtumclass.com
Contraseña: Admin1234
```

> Cambia estas credenciales en `.env` con `ADMIN_EMAIL` y `ADMIN_PASSWORD` antes de publicar la aplicación. Si la cuenta ya existe, el servidor no la vuelve a crear.

**Endpoints principales**

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Crear usuario y abrir sesión |
| `POST` | `/api/auth/login` | Verificar credenciales y abrir sesión |
| `POST` | `/api/auth/logout` | Cerrar sesión y borrar la cookie |
| `GET` | `/api/auth/me` | Usuario de la sesión actual |
| `PATCH` | `/api/auth/role` | Cambiar el rol (estudiante/tutor) |
| `PATCH` | `/api/perfil` | Actualizar nombre, apellido, ciudad, teléfono y biografía |
| `GET` | `/api/usuarios` | Listar usuarios (solo admin) |
| `GET` | `/api/categorias` | Listar categorías (público) |
| `POST` | `/api/categorias` | Crear categoría (sesión requerida) |
| `PUT` | `/api/categorias/:id` | Actualizar categoría (sesión requerida) |
| `DELETE` | `/api/categorias/:id` | Eliminar categoría (sesión requerida) |

> Para producción se recomienda restringir las escrituras de categorías al rol `admin` (hoy cualquier usuario autenticado puede hacer el CRUD para facilitar la demostración académica).

---

## 3. Estructura de carpetas

```text
TALEMTUCLASS/
├─ public/
│  └─ brand/                     Íconos de la pestaña (logo TALEMTUMCLASS)
├─ database/
│  ├─ schema.sql               Esquema PostgreSQL de referencia del proyecto original
│  ├─ schema.sqlite.sql        Esquema real de la base SQLite
│  └─ talentumclass.db         Base de datos local (se crea sola, excluida de Git)
├─ server/
│  ├─ index.js                 API Express (Lumen IA + autenticación + categorías)
│  ├─ db.js                    Conexión SQLite, tablas y datos iniciales
│  └─ auth.js                  Hash scrypt, sesiones, validaciones y middlewares
├─ src/
│  ├─ main.tsx                 Punto de entrada de React
│  ├─ index.css                Tailwind, tokens de color y utilidades propias
│  ├─ vite-env.d.ts            Tipos de Vite
│  │
│  ├─ app/
│  │  ├─ App.tsx               Router por hash y estado global de la demo
│  │  └─ navigation.ts         Tipo Screen, NavProps y lista de pantallas
│  │
│  ├─ assets/
│  │  └─ logo.png              Logo de la marca
│  │
│  ├─ components/
│  │  ├─ layout/
│  │  │  └─ DashboardLayout.tsx  Sidebar de escritorio + barra superior y
│  │  │                          navegación inferior en móvil
│  │  └─ ui/
│  │     ├─ Logo.tsx           Marca TALEMTUMCLASS
│  │     ├─ Stars.tsx          Estrellas de calificación
│  │     ├─ Badge.tsx          Etiquetas de estado
│  │     ├─ Modal.tsx          Ventana modal reutilizable
│  │     ├─ Toast.tsx          Mensaje flotante de confirmación
│  │     ├─ EmptyState.tsx     Estado vacío con acción
│  │     ├─ PageHeader.tsx     Título + subtítulo + acción de pantalla
│  │     ├─ ProgressSteps.tsx  Indicador de pasos (onboarding / reserva)
│  │     ├─ MarkdownText.tsx   Renderiza las respuestas de Lumen IA
│  │     └─ index.ts           Exportaciones centralizadas de UI
│  │
│  ├─ data/
│  │  ├─ tutors.ts             Tutores de ejemplo (precios, materias, reseñas)
│  │  ├─ sessions.ts           Sesiones e historial de ejemplo
│  │  ├─ requests.ts           Solicitudes de tutoría
│  │  ├─ messages.ts           Conversaciones y mensajes
│  │  └─ notifications.ts      Notificaciones de ejemplo
│  │
│  ├─ lib/
│  │  ├─ format.ts             Utilidades: precios COP, iniciales, fechas
│  │  └─ lumen.ts              Cliente del frontend para la API de Lumen IA
│  │
│  └─ screens/
│     ├─ landing/
│     │  └─ Landing.tsx        Página pública de inicio
│     ├─ auth/
│     │  └─ AuthFlow.tsx       Login, registro y selección de rol
│     ├─ onboarding/
│     │  ├─ StudentOnboarding.tsx   Registro guiado del estudiante (4 pasos)
│     │  └─ TutorOnboarding.tsx     Registro del tutor (6 pasos + vista previa)
│     ├─ student/
│     │  ├─ StudentDashboard.tsx    Inicio del estudiante
│     │  ├─ SearchTutors.tsx        Búsqueda y filtros de tutores
│     │  ├─ AvailableNow.tsx        Tutores disponibles en este momento
│     │  ├─ TutorProfile.tsx        Perfil público del tutor
│     │  ├─ BookingFlow.tsx         Reserva en 4 pasos + confirmación
│     │  └─ History.tsx             Historial de tutorías
│     ├─ tutor/
│     │  ├─ TutorDashboard.tsx      Inicio del tutor
│     │  ├─ TutorRequests.tsx       Aceptar / rechazar solicitudes
│     │  └─ TutorAvailability.tsx   Agenda semanal y excepciones
│     ├─ ai/
│     │  └─ LumenIA.tsx            Chat de Lumen IA para estudiantes y tutores
│     ├─ sessions/
│     │  ├─ VirtualSession.tsx      Sala de videollamada simulada
│     │  └─ InPersonSession.tsx     Detalle de tutoría presencial
│     ├─ reviews/
│     │  └─ RatingScreen.tsx        Calificación con estrellas y etiquetas
│     ├─ communication/
│     │  ├─ Messages.tsx            Chat entre estudiante y tutor
│     │  └─ Notifications.tsx       Centro de notificaciones
│     ├─ account/
│     │  └─ ProfileSettings.tsx     Perfil, preferencias y seguridad
│     ├─ admin/
│     │  └─ AdminDashboard.tsx      Métricas y gestión de la plataforma
│     └─ system/
│        ├─ DesignSystem.tsx        Colores, tipografía y componentes
│        └─ ScreenIndex.tsx         Mapa visual de todas las pantallas
│
├─ index.html                  HTML base de la aplicación
├─ package.json                Dependencias y scripts
├─ tsconfig.json               Configuración de TypeScript
├─ vite.config.ts              Configuración de Vite y alias `@/`
└─ README.md
```

### Para qué sirve cada carpeta

- **`app/`**: contiene el “cerebro” de la navegación. `App.tsx` decide qué pantalla mostrar y guarda el rol activo, el nombre del usuario y el tutor seleccionado. `navigation.ts` define todas las rutas válidas.
- **`components/layout/`**: el marco común de las pantallas privadas. En escritorio muestra la barra lateral; en móvil cambia a barra superior + navegación inferior.
- **`components/ui/`**: piezas pequeñas y reutilizables (botones de estado, modales, estrellas, encabezados). Si cambias un componente aquí, cambia en todas las pantallas.
- **`data/`**: datos simulados. Aquí se reemplazarán los `mock` por llamadas a una API real.
- **`lib/`**: funciones auxiliares sin componentes visuales.
- **`screens/`**: una carpeta por área funcional y un archivo por pantalla. El nombre de la carpeta indica el rol o el módulo.
- **`assets/`** y **`public/`**: imágenes y archivos estáticos.
- **`database/`**: esquema de referencia y base SQLite real. `talentumclass.db` se genera al arrancar el servidor.

---

## 4. Pantallas y rutas

La navegación usa el **hash de la URL**, por lo que funciona sin configurar un servidor y permite atrás/adelante y enlaces directos.

Ejemplo: `http://localhost:5173/#/booking`

| Ruta (`#/…`) | Pantalla |
| --- | --- |
| `/` o `/landing` | Landing pública |
| `/login` | Iniciar sesión |
| `/register` | Crear cuenta |
| `/role-select` | Elegir estudiante o tutor |
| `/student-onboarding` | Registro del estudiante (4 pasos) |
| `/tutor-onboarding` | Registro del tutor (6 pasos) |
| `/student-dashboard` | Dashboard del estudiante |
| `/tutor-dashboard` | Dashboard del tutor |
| `/search` | Buscar tutores con filtros |
| `/available-now` | Tutores disponibles ahora |
| `/tutor-profile` | Perfil del tutor |
| `/booking` | Reserva de tutoría |
| `/ai-recommend` | Lumen IA (asistente con Gemini) |
| `/virtual-session` | Sesión virtual |
| `/inperson-session` | Sesión presencial |
| `/rating` | Calificar una tutoría |
| `/notifications` | Notificaciones |
| `/messages` | Mensajes |
| `/history` | Historial |
| `/tutor-requests` | Solicitudes recibidas por el tutor |
| `/tutor-availability` | Disponibilidad del tutor |
| `/profile-settings` | Perfil y ajustes |
| `/admin` | Panel de administración |
| `/categories` | CRUD de categorías (SQLite) |
| `/design-system` | Design system |
| `/screens` | Mapa de todas las pantallas |

> **Atajo:** abre `#/screens` para ver un índice visual con acceso a cada pantalla del prototipo.

### Roles

- Las pantallas que empiezan por `tutor-` asumen automáticamente el rol **tutor** al entrar por enlace directo.
- `/admin` se muestra como visitante/administrador.
- El resto asume **estudiante**.
- Para cambiar de rol de forma normal: `#/role-select` → elegir rol → onboarding.

---

## 5. Flujos interactivos incluidos

- **Selección de rol → onboarding** de estudiante (4 pasos) y de tutor (6 pasos, con vista previa y publicación).
- **Búsqueda de tutores** con filtros por materia, modalidad, precio y calificación.
- **Perfil de tutor → reserva** en 4 pasos: modalidad y duración → fecha → horario → confirmación con total en COP.
- **Confirmación de reserva** con acceso a la sesión, calificación o búsqueda.
- **Solicitudes del tutor**: aceptar o rechazar con motivo y notificación flotante.
- **Disponibilidad del tutor**: bloques semanales, excepciones y guardado.
- **Calificación**: estrellas, etiquetas, comentario y pantalla de agradecimiento.
- **Mensajes y notificaciones** con estados leídos/no leídos.
- **Design system** con colores, tipografía, botones, badges y estados.

---

## 6. Diseño y responsive

La interfaz está construida con Tailwind CSS 4 y tokens propios en `src/index.css`.

- **Escritorio (1440 × 1024)**: barra lateral fija de 256 px, contenido centrado y navegación completa.
- **Móvil (390 × 844)**: barra superior con logo, notificaciones y avatar; navegación inferior con 5 accesos; contenido a una columna.
- **Color principal**: `#5548C8` (violeta de marca).
- **Fondo de la app**: `#F4F3FD`.
- **Tipografía**: fuente del sistema con utilidades `font-400` a `font-800`.

Para probar el responsive en VS Code/Chrome:

1. Abre las herramientas de desarrollador (`F12`).
2. Activa el modo dispositivo (`Ctrl + Shift + M`).
3. Elige un preset o introduce `390 × 844`.
4. Recarga y navega por las pantallas.

---

## 7. Cómo se conecta con el diseño original de Figma Make

- Cada pantalla del prototipo tiene un archivo propio en `src/screens/`.
- Los componentes repetidos del diseño (logo, estrellas, badges, modales, encabezados, pasos) se extrajeron a `src/components/ui/`.
- Los datos que en Figma eran ejemplos están centralizados en `src/data/`.
- El diseño visual se mantiene: mismos colores, tarjetas redondeadas, tipografía y jerarquía.
- Se añadieron las pantallas que faltaban para que el prototipo sea navegable de principio a fin.

---

## 8. Próximos pasos sugeridos

1. Sustituir los datos de `src/data/` (tutores, reservas) por consultas a la API/SQLite.
2. Ampliar la autenticación con recuperación de contraseña y verificación de correo.
3. Implementar la videollamada con WebRTC o un proveedor externo.
4. Migrar la base a PostgreSQL si se necesita despliegue multiusuario (el esquema de referencia está en `database/schema.sql`).
5. Restringir el CRUD de categorías al rol `admin` y añadir pruebas con Vitest y Playwright.

---

## 9. Problemas frecuentes

**`npm` no se reconoce como comando**
Instala Node.js y cierra y vuelve a abrir la terminal (o VS Code).

**El puerto 5173 está ocupado**
Vite cambiará de puerto automáticamente; revisa la URL que muestra la terminal.

**La página se queda en la landing al abrir un enlace**
Comprueba que la ruta esté escrita como `#/nombre-de-la-pantalla` y que exista en `src/app/navigation.ts`.

**Errores de tipos**
Ejecuta:

```bash
npm run typecheck
```

**No puedo iniciar sesión o la base no guarda usuarios**
Verifica que el servidor API esté activo (`npm run dev` arranca web y API). Si el puerto 3001 está ocupado, ciérralo y vuelve a iniciar. La base se crea automáticamente en `database/talentumclass.db`; puedes borrarla para reiniciar los datos (se volverán a crear las categorías y el administrador).

**La versión compilada no se actualiza**
Detén el servidor, borra `dist/` y vuelve a ejecutar `npm run build`.
