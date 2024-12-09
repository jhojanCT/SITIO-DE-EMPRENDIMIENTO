CREATE DATABASE empresa;

\c empresa

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO services (name) VALUES 
('Consultoría Empresarial'),
('Desarrollo Web'),
('Marketing Digital'),
('Soporte Técnico');
