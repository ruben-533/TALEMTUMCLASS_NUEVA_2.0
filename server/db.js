import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Base de datos SQLite local.
 *
 * - En desarrollo se guarda en `database/talentumclass.db`.
 * - Se puede cambiar con la variable de entorno `DATABASE_PATH`.
 * - Usa el módulo nativo `node:sqlite` (Node 22+), sin dependencias externas.
 */
export const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.resolve(__dirname, '..', 'database', 'talentumclass.db')

mkdirSync(path.dirname(DB_PATH), { recursive: true })

export const db = new DatabaseSync(DB_PATH)

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;

  CREATE TABLE IF NOT EXISTS usuarios (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre         TEXT    NOT NULL,
    apellido       TEXT    NOT NULL DEFAULT '',
    email          TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    password_hash  TEXT    NOT NULL,
    rol            TEXT    NOT NULL DEFAULT 'estudiante'
                           CHECK (rol IN ('estudiante', 'tutor', 'admin')),
    ciudad         TEXT,
    creado_en      TEXT    NOT NULL DEFAULT (datetime('now')),
    ultimo_acceso  TEXT
  );

  CREATE TABLE IF NOT EXISTS sesiones (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token_hash  TEXT    NOT NULL UNIQUE,
    expira_en   INTEGER NOT NULL,
    creado_en   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_sesiones_expira  ON sesiones(expira_en);

  CREATE TABLE IF NOT EXISTS categorias (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    descripcion    TEXT    NOT NULL DEFAULT '',
    icono          TEXT    NOT NULL DEFAULT '📚',
    creado_en      TEXT    NOT NULL DEFAULT (datetime('now')),
    actualizado_en TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reservas (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tutor_id       INTEGER NOT NULL,
    tutor_nombre   TEXT    NOT NULL,
    tutor_avatar   TEXT,
    materia        TEXT    NOT NULL,
    nivel          TEXT    NOT NULL DEFAULT 'Universitario',
    modalidad      TEXT    NOT NULL CHECK (modalidad IN ('virtual', 'presencial')),
    fecha          TEXT    NOT NULL, -- ISO YYYY-MM-DD
    hora           TEXT    NOT NULL, -- HH:MM
    duracion       INTEGER NOT NULL CHECK (duracion IN (30, 60, 90)),
    precio         INTEGER NOT NULL,
    estado         TEXT    NOT NULL DEFAULT 'confirmada'
                           CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    calificacion   INTEGER CHECK (calificacion BETWEEN 1 AND 5),
    comentario     TEXT,
    creado_en      TEXT    NOT NULL DEFAULT (datetime('now')),
    actualizado_en TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_reservas_fecha   ON reservas(fecha, hora);
`)

// Migraciones sencillas: agrega columnas nuevas sin borrar datos existentes.
const userColumns = db
  .prepare('PRAGMA table_info(usuarios)')
  .all()
  .map((column) => column.name)

if (!userColumns.includes('telefono')) {
  db.exec('ALTER TABLE usuarios ADD COLUMN telefono TEXT')
}
if (!userColumns.includes('biografia')) {
  db.exec('ALTER TABLE usuarios ADD COLUMN biografia TEXT')
}

const CATEGORIAS_INICIALES = [
  ['Matemáticas', 'Álgebra, cálculo, geometría y estadística.', '📐'],
  ['Programación', 'Desarrollo web, backend, bases de datos y algoritmos.', '💻'],
  ['Inglés', 'Conversación, gramática y preparación de exámenes.', '🌍'],
  ['Física', 'Mecánica, electricidad, magnetismo y astronomía.', '⚛️'],
  ['Química', 'Química general, orgánica y laboratorio.', '🧪'],
  ['Biología', 'Biología celular, genética y anatomía.', '🧬'],
  ['Marketing', 'Marketing digital, pauta, SEO y analítica.', '📊'],
  ['Diseño', 'Diseño gráfico, UX/UI y herramientas creativas.', '🎨'],
  ['Finanzas', 'Contabilidad, inversión y análisis financiero.', '💰'],
  ['Negocios', 'Emprendimiento, liderazgo y modelos de negocio.', '🏢'],
  ['Tecnología', 'Redes, cloud y ciberseguridad.', '🤖'],
  ['Historia', 'Historia de Colombia, universal y pensamiento crítico.', '📜'],
  ['Música', 'Guitarra, piano, teoría y apreciación musical.', '🎵'],
  ['Francés', 'Francés comunicativo y preparación DELF.', '🇫🇷'],
]

const count = db.prepare('SELECT COUNT(*) AS total FROM categorias').get()
if (!count || count.total === 0) {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO categorias (nombre, descripcion, icono) VALUES (?, ?, ?)',
  )
  for (const [nombre, descripcion, icono] of CATEGORIAS_INICIALES) {
    insert.run(nombre, descripcion, icono)
  }
}

/** Limpia sesiones vencidas. Se llama al iniciar y periódicamente. */
export function cleanupSessions() {
  db.prepare('DELETE FROM sesiones WHERE expira_en <= ?').run(Date.now())
}

cleanupSessions()
