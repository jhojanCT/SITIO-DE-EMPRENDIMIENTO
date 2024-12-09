const bcrypt = require("bcryptjs");

const password = "root"; // La contraseña que deseas hashificar

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error al generar el hash:", err);
  } else {
    console.log("Contraseña hashificada:", hashedPassword);
  }
});
