const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const pool = require("./db"); // Configuración de conexión a la base de datos
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;
const SECRET_KEY = "root";

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// Asegúrate de que las rutas estén al final de las configuraciones de las rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// Configuración de multer para almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware para verificar el token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

// Rutas
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error al autenticar:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Middleware para verificar el token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}


// Obtener todos los servicios
app.get("/api/services", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
});

// Añadir un nuevo servicio
app.post("/api/services", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image_url = req.file
      ? `http://localhost:${PORT}/uploads/${req.file.filename}`
      : null;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Nombre y descripción son requeridos" });
    }

    const result = await pool.query(
      "INSERT INTO services (name, description, image_url) VALUES ($1, $2, $3) RETURNING *",
      [name, description, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al añadir servicio:", error);
    res.status(500).json({ error: "Error al añadir el servicio" });
  }
});

// Buscar servicios por nombre
app.get("/api/services/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "El parámetro de búsqueda es requerido" });
    }

    const result = await pool.query(
      "SELECT * FROM services WHERE LOWER(name) LIKE $1",
      [`%${query.toLowerCase()}%`]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al buscar servicios:", error);
    res.status(500).json({ error: "Error al buscar los servicios" });
  }
});

// Ruta para el frontend (debe estar al final)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

