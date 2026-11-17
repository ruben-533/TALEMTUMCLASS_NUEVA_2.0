-- TALEMTUMCLASS - Esquema real de la base de datos SQLite
-- Motor: SQLite (módulo nativo node:sqlite, Node 22+)
-- Archivo generado en tiempo de ejecución: database/talentumclass.db
--
-- Este archivo documenta el esquema que crea server/db.js.
-- No es necesario ejecutarlo a mano: el servidor lo aplica al arrancar.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Usuarios y autenticación
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS usuarios (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre         TEXT    NOT NULL,
  apellido       TEXT    NOT NULL DEFAULT '',
  email          TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  password_hash  TEXT    NOT NULL, -- scrypt$N$r$p$sal$hash (nunca texto plano)
  rol            TEXT    NOT NULL DEFAULT 'estudiante'
                         CHECK (rol IN ('estudiante', 'tutor', 'admin')),
  ciudad         TEXT,
  telefono       TEXT,
  biografia      TEXT,
  creado_en      TEXT    NOT NULL DEFAULT (datetime('now')),
  ultimo_acceso  TEXT
);

-- Sesiones: se guarda el SHA-256 del token, no el token original.
CREATE TABLE IF NOT EXISTS sesiones (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash  TEXT    NOT NULL UNIQUE,
  expira_en   INTEGER NOT NULL, -- epoch en milisegundos
  creado_en   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_expira  ON sesiones(expira_en);

-- ---------------------------------------------------------------------------
-- Categorías (CRUD protegido por sesión)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categorias (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  descripcion    TEXT    NOT NULL DEFAULT '',
  icono          TEXT    NOT NULL DEFAULT '📚',
  creado_en      TEXT    NOT NULL DEFAULT (datetime('now')),
  actualizado_en TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- Consultas de ejemplo
-- ---------------------------------------------------------------------------

-- Usuarios registrados (sin exponer el hash):
-- SELECT id, nombre, apellido, email, rol, ciudad, creado_en
--   FROM usuarios ORDER BY id DESC;

-- Categorías ordenadas:
-- SELECT * FROM categorias ORDER BY nombre COLLATE NOCASE;

-- Sesiones activas:
-- SELECT u.email, s.expira_en FROM sesiones s
--   JOIN usuarios u ON u.id = s.usuario_id
--  WHERE s.expira_en > (unixepoch('now') * 1000);
