
CREATE DATABASE empresa;


\c empresa;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'client')) DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role)
VALUES 
  ('admin', '$2a$10$vy7StIYbHe8vjVurcPVTPe5Widu2T.IOo8Un12L3GvJwlceh2TnSG', 'admin'); 

-- Crear la tabla de servicios
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos servicios de ejemplo
INSERT INTO services (name, description, image_url)
VALUES



CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_services_timestamp
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();


CREATE INDEX idx_services_name ON services (LOWER(name));

-- Crear la tabla de componentes
CREATE TABLE components (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos componentes de ejemplo
INSERT INTO components (name, description, price)
VALUES 
  ('Procesador Intel i7', 'Procesador de 8 núcleos y 16 hilos, ideal para juegos y tareas de alto rendimiento.', 300.00),
  ('Tarjeta Gráfica Nvidia RTX 3060', 'Tarjeta gráfica de alto rendimiento para juegos y edición de video.', 500.00,
  ('Placa Base ASUS B450', 'Placa base compatible con procesadores AMD Ryzen, ideal para gamers y entusiastas.', 120.00);

-- Crear una función para actualizar la fecha de actualización
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear un trigger para actualizar el timestamp de los componentes
CREATE TRIGGER update_components_timestamp
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Crear un índice para optimizar la búsqueda por nombre de componente
CREATE INDEX idx_components_name ON components (LOWER(name));
