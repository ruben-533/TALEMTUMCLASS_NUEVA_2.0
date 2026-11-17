-- TALEMTUMCLASS - Esquema relacional (PostgreSQL)

CREATE TYPE rol_usuario        AS ENUM ('estudiante', 'tutor');
CREATE TYPE modalidad_tutoria  AS ENUM ('virtual', 'presencial');
CREATE TYPE estado_reserva     AS ENUM ('pendiente', 'aceptada', 'rechazada', 'completada', 'cancelada');
CREATE TYPE estado_pago        AS ENUM ('pendiente', 'pagado', 'reembolsado');

CREATE TABLE usuarios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(120) NOT NULL,
  email          VARCHAR(160) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  rol            rol_usuario  NOT NULL,
  avatar_url     TEXT,
  ciudad         VARCHAR(80),
  creado_en      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE estudiantes (
  usuario_id        INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  nivel_educativo   VARCHAR(60),
  institucion       VARCHAR(120)
);

CREATE TABLE tutores (
  usuario_id          INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  especialidad        VARCHAR(160) NOT NULL,
  biografia           TEXT,
  experiencia_anios   SMALLINT NOT NULL DEFAULT 0,
  precio_virtual      INT NOT NULL CHECK (precio_virtual >= 0),
  precio_presencial   INT CHECK (precio_presencial >= 0),
  verificado          BOOLEAN NOT NULL DEFAULT FALSE,
  disponible_ahora    BOOLEAN NOT NULL DEFAULT FALSE,
  calificacion_prom   NUMERIC(2,1) NOT NULL DEFAULT 0,
  total_resenas       INT NOT NULL DEFAULT 0,
  total_sesiones      INT NOT NULL DEFAULT 0
);

CREATE TABLE materias (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE tutor_materias (
  tutor_id    INT NOT NULL REFERENCES tutores(usuario_id) ON DELETE CASCADE,
  materia_id  INT NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
  PRIMARY KEY (tutor_id, materia_id)
);

CREATE TABLE tutor_modalidades (
  tutor_id   INT NOT NULL REFERENCES tutores(usuario_id) ON DELETE CASCADE,
  modalidad  modalidad_tutoria NOT NULL,
  PRIMARY KEY (tutor_id, modalidad)
);

CREATE TABLE disponibilidades (
  id           SERIAL PRIMARY KEY,
  tutor_id     INT NOT NULL REFERENCES tutores(usuario_id) ON DELETE CASCADE,
  dia_semana   SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  hora_inicio  TIME NOT NULL,
  hora_fin     TIME NOT NULL,
  CHECK (hora_fin > hora_inicio)
);

CREATE TABLE reservas (
  id            SERIAL PRIMARY KEY,
  estudiante_id INT NOT NULL REFERENCES estudiantes(usuario_id),
  tutor_id      INT NOT NULL REFERENCES tutores(usuario_id),
  materia_id    INT NOT NULL REFERENCES materias(id),
  modalidad     modalidad_tutoria NOT NULL,
  fecha_hora    TIMESTAMP NOT NULL,
  duracion_min  SMALLINT NOT NULL DEFAULT 60,
  precio_total  INT NOT NULL,
  estado        estado_reserva NOT NULL DEFAULT 'pendiente',
  notas         TEXT,
  creado_en     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE pagos (
  id           SERIAL PRIMARY KEY,
  reserva_id   INT NOT NULL UNIQUE REFERENCES reservas(id) ON DELETE CASCADE,
  monto        INT NOT NULL,
  metodo       VARCHAR(40) NOT NULL,
  estado       estado_pago NOT NULL DEFAULT 'pendiente',
  pagado_en    TIMESTAMP
);

CREATE TABLE resenas (
  id            SERIAL PRIMARY KEY,
  reserva_id    INT NOT NULL UNIQUE REFERENCES reservas(id) ON DELETE CASCADE,
  estudiante_id INT NOT NULL REFERENCES estudiantes(usuario_id),
  tutor_id      INT NOT NULL REFERENCES tutores(usuario_id),
  estrellas     SMALLINT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  comentario    TEXT,
  creado_en     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notificaciones (
  id          SERIAL PRIMARY KEY,
  usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo      VARCHAR(120) NOT NULL,
  mensaje     TEXT,
  leida       BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE recomendaciones_ia (
  id             SERIAL PRIMARY KEY,
  estudiante_id  INT NOT NULL REFERENCES estudiantes(usuario_id) ON DELETE CASCADE,
  tutor_id       INT NOT NULL REFERENCES tutores(usuario_id) ON DELETE CASCADE,
  consulta       TEXT NOT NULL,
  puntaje_match  NUMERIC(4,1) NOT NULL,
  creado_en      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservas_tutor      ON reservas(tutor_id, fecha_hora);
CREATE INDEX idx_reservas_estudiante ON reservas(estudiante_id);
CREATE INDEX idx_resenas_tutor       ON resenas(tutor_id);
CREATE INDEX idx_notif_usuario       ON notificaciones(usuario_id, leida);

-- Datos de ejemplo
INSERT INTO materias (nombre) VALUES ('Matemáticas'), ('Física'), ('Inglés'), ('Programación');

INSERT INTO usuarios (nombre, email, password_hash, rol, ciudad) VALUES
  ('Carlos Gómez',   'carlos@mail.com', 'hash', 'estudiante', 'Bogotá'),
  ('Laura Martínez', 'laura@mail.com',  'hash', 'tutor',      'Bogotá');

INSERT INTO estudiantes (usuario_id, nivel_educativo) VALUES (1, 'Universitario');

INSERT INTO tutores (usuario_id, especialidad, experiencia_anios, precio_virtual, precio_presencial, verificado, disponible_ahora)
VALUES (2, 'Cálculo diferencial e integral', 5, 40000, 55000, TRUE, TRUE);

INSERT INTO tutor_materias VALUES (2, 1), (2, 2);
INSERT INTO tutor_modalidades VALUES (2, 'virtual'), (2, 'presencial');

