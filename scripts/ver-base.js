import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '..', 'database', 'talentumclass.db')
const db = new DatabaseSync(dbPath)

const table = process.argv[2]

function printTable(name) {
  const rows = db.prepare(`SELECT * FROM ${name}`).all()
  console.log(`\n=== ${name} (${rows.length} registros) ===`)
  if (!rows.length) {
    console.log('(vacía)')
    return
  }
  console.table(
    rows.map((row) => {
      const clean = { ...row }
      if (clean.password_hash) clean.password_hash = String(clean.password_hash).slice(0, 24) + '…'
      if (clean.token_hash) clean.token_hash = String(clean.token_hash).slice(0, 16) + '…'
      return clean
    }),
  )
}

console.log(`Base de datos: ${dbPath}`)

if (table) {
  printTable(table)
} else {
  console.log('\nTablas disponibles:')
  console.table(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").all())
  printTable('usuarios')
  printTable('categorias')
  printTable('sesiones')
}

db.close()
