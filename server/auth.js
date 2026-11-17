import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto'
import { promisify } from 'node:util'
import { db } from './db.js'

const scrypt = promisify(scryptCallback)

export const SESSION_COOKIE = 'talentum_session'
const SESSION_DAYS = 7
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 }

/* -------------------------------------------------------------------------- */
/* Contraseñas                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Formato guardado: scrypt$N$r$p$salHex$hashHex
 * Usamos scrypt (incluido en Node) para no depender de módulos nativos externos.
 */
export async function hashPassword(password) {
  const salt = randomBytes(16)
  const derived = await scrypt(password, salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
  })
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('hex')}$${derived.toString('hex')}`
}

/** Variante síncrona, solo para crear el administrador inicial. */
export function hashPasswordSync(password) {
  const salt = randomBytes(16)
  const derived = scryptSync(password, salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
  })
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('hex')}$${derived.toString('hex')}`
}

export async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string') return false
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false

  const [, n, r, p, saltHex, hashHex] = parts
  const expected = Buffer.from(hashHex, 'hex')
  if (!expected.length) return false

  try {
    const derived = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    })
    return derived.length === expected.length && timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}

/* -------------------------------------------------------------------------- */
/* Sesiones                                                                   */
/* -------------------------------------------------------------------------- */

const hashToken = (token) => createHash('sha256').update(token).digest('hex')

export function createSession(userId) {
  const token = randomBytes(32).toString('base64url')
  const expires = Date.now() + SESSION_MS
  db.prepare(
    'INSERT INTO sesiones (usuario_id, token_hash, expira_en) VALUES (?, ?, ?)',
  ).run(userId, hashToken(token), expires)
  return { token, expires }
}

export function parseCookies(header = '') {
  const cookies = {}
  for (const part of String(header).split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (!key) continue
    try {
      cookies[key] = decodeURIComponent(value)
    } catch {
      cookies[key] = value
    }
  }
  return cookies
}

export function setSessionCookie(req, res, token) {
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https'
  const attributes = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_MS / 1000)}`,
  ]
  if (secure) attributes.push('Secure')
  res.setHeader('Set-Cookie', attributes.join('; '))
}

export function clearSessionCookie(req, res) {
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https'
  const attributes = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0']
  if (secure) attributes.push('Secure')
  res.setHeader('Set-Cookie', attributes.join('; '))
}

export function publicUser(row) {
  if (!row) return null
  return {
    id: row.id,
    nombre: row.nombre,
    apellido: row.apellido,
    email: row.email,
    rol: row.rol,
    ciudad: row.ciudad || '',
    telefono: row.telefono || '',
    biografia: row.biografia || '',
    creadoEn: row.creado_en,
    ultimoAcceso: row.ultimo_acceso || null,
  }
}

export function getUserFromRequest(req) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE]
  if (!token) return null

  const row = db
    .prepare(
      `SELECT u.*, s.expira_en
         FROM sesiones s
         JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ? AND s.expira_en > ?`,
    )
    .get(hashToken(token), Date.now())

  if (!row) return null
  return publicUser(row)
}

export function destroySession(req) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE]
  if (token) {
    db.prepare('DELETE FROM sesiones WHERE token_hash = ?').run(hashToken(token))
  }
}

export function requireAuth(req, res, next) {
  const user = getUserFromRequest(req)
  if (!user) {
    return res.status(401).json({
      code: 'AUTH_REQUIRED',
      message: 'Debes iniciar sesión para realizar esta acción.',
    })
  }
  req.user = user
  return next()
}

export function requireAdmin(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        code: 'ADMIN_REQUIRED',
        message: 'Esta acción requiere permisos de administrador.',
      })
    }
    return next()
  })
}

/* -------------------------------------------------------------------------- */
/* Validaciones                                                               */
/* -------------------------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_RE = /^[\p{L}\p{M}' .-]+$/u
const COMMON_PASSWORDS = new Set([
  '12345678',
  '123456789',
  'password',
  'contraseña',
  'qwerty123',
  'admin123',
  'iloveyou',
  '1234567890',
])

export function validationError(res, errors) {
  return res.status(400).json({
    code: 'VALIDATION_ERROR',
    message: errors[0]?.message || 'Revisa los datos del formulario.',
    errors,
  })
}

function cleanName(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

export function validateRegistration(body = {}) {
  const errors = []
  const nombre = cleanName(body.nombre)
  const apellido = cleanName(body.apellido)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const ciudad = typeof body.ciudad === 'string' ? body.ciudad.trim().slice(0, 80) : ''
  const rol = body.rol === 'tutor' ? 'tutor' : 'estudiante'

  if (nombre.length < 2 || nombre.length > 60) {
    errors.push({ field: 'nombre', message: 'El nombre debe tener entre 2 y 60 caracteres.' })
  } else if (!NAME_RE.test(nombre)) {
    errors.push({ field: 'nombre', message: 'El nombre solo puede contener letras, espacios y guiones.' })
  }

  if (apellido.length < 2 || apellido.length > 60) {
    errors.push({ field: 'apellido', message: 'El apellido debe tener entre 2 y 60 caracteres.' })
  } else if (!NAME_RE.test(apellido)) {
    errors.push({ field: 'apellido', message: 'El apellido solo puede contener letras, espacios y guiones.' })
  }

  if (!email) {
    errors.push({ field: 'email', message: 'El correo electrónico es obligatorio.' })
  } else if (email.length > 160 || !EMAIL_RE.test(email)) {
    errors.push({ field: 'email', message: 'Escribe un correo electrónico válido.' })
  }

  if (password.length < 8) {
    errors.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres.' })
  } else if (password.length > 72) {
    errors.push({ field: 'password', message: 'La contraseña no puede superar los 72 caracteres.' })
  } else if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(password) || !/\d/.test(password)) {
    errors.push({ field: 'password', message: 'La contraseña debe incluir al menos una letra y un número.' })
  } else if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push({ field: 'password', message: 'Esa contraseña es demasiado común. Elige una más segura.' })
  }

  if (!['estudiante', 'tutor'].includes(rol)) {
    errors.push({ field: 'rol', message: 'El rol seleccionado no es válido.' })
  }

  return { errors, data: { nombre, apellido, email, password, ciudad, rol } }
}

const PHONE_RE = /^[+]?[\d\s()-]{7,30}$/

export function validateProfile(body = {}) {
  const errors = []
  const nombre = cleanName(body.nombre)
  const apellido = cleanName(body.apellido)
  const ciudad = typeof body.ciudad === 'string' ? body.ciudad.trim().slice(0, 80) : ''
  const telefono = typeof body.telefono === 'string' ? body.telefono.trim().slice(0, 30) : ''
  const biografia = typeof body.biografia === 'string' ? body.biografia.trim().slice(0, 500) : ''

  if (nombre.length < 2 || nombre.length > 60) {
    errors.push({ field: 'nombre', message: 'El nombre debe tener entre 2 y 60 caracteres.' })
  } else if (!NAME_RE.test(nombre)) {
    errors.push({ field: 'nombre', message: 'El nombre solo puede contener letras, espacios y guiones.' })
  }

  if (apellido.length < 2 || apellido.length > 60) {
    errors.push({ field: 'apellido', message: 'El apellido debe tener entre 2 y 60 caracteres.' })
  } else if (!NAME_RE.test(apellido)) {
    errors.push({ field: 'apellido', message: 'El apellido solo puede contener letras, espacios y guiones.' })
  }

  if (telefono && !PHONE_RE.test(telefono)) {
    errors.push({ field: 'telefono', message: 'Escribe un teléfono válido (solo números, espacios y guiones).' })
  }

  return { errors, data: { nombre, apellido, ciudad, telefono, biografia } }
}

export function validateCategory(body = {}) {
  const errors = []
  const nombre = cleanName(body.nombre)
  const descripcion = typeof body.descripcion === 'string' ? body.descripcion.trim().slice(0, 240) : ''
  const icono = typeof body.icono === 'string' && body.icono.trim() ? body.icono.trim().slice(0, 8) : '📚'

  if (nombre.length < 2 || nombre.length > 60) {
    errors.push({ field: 'nombre', message: 'El nombre de la categoría debe tener entre 2 y 60 caracteres.' })
  }

  return { errors, data: { nombre, descripcion, icono } }
}

/* -------------------------------------------------------------------------- */
/* Límite de intentos de autenticación                                        */
/* -------------------------------------------------------------------------- */

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10
const attempts = new Map()

export function authRateLimit(req, res, next) {
  const key = `${req.ip || 'unknown'}:${req.path}`
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(key, { start: now, count: 1 })
    return next()
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - entry.start)) / 1000)
    res.setHeader('Retry-After', String(retryAfter))
    return res.status(429).json({
      code: 'AUTH_RATE_LIMIT',
      message: 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.',
    })
  }

  entry.count += 1
  return next()
}

export function resetAuthRateLimit(req) {
  attempts.delete(`${req.ip || 'unknown'}:${req.path}`)
}
