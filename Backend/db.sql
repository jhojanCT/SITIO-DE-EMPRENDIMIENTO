
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
  ('admin', '$2a$10$R5vE7nK8AfTzGh50gkkBSZceMwBfU07JPO3jDJQmh0kgyhFzKjbEm', 'admin'); 

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
