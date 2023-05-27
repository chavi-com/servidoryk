const express = require("express");
const userSchema = require("../models/user");
const router = express.Router();

// Crear usuario
router.post("/users", (req, res) => {
  const user = userSchema(req.body);
  user.save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Inicio de sesión
router.post("/users/login", (req, res) => {
  const { email, password } = req.body;

  userSchema
    .findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        if (user.password === password) {
          // Contraseña válida, el usuario ha iniciado sesión correctamente
          res.json({ message: "Inicio de sesión exitoso" });
        } else {
          // Contraseña incorrecta, manejar el caso correspondiente
          res.json({ message: "Contraseña incorrecta" });
        }
      } else {
        // Usuario no encontrado, manejar el caso correspondiente
        res.json({ message: "Usuario no encontrado" });
      }
    })
    .catch((error) => {
      // Manejar cualquier error que ocurra durante la consulta
      res.json({ message: "Error al buscar usuario" });
    });
});

// Obtener todos los usuarios
router.get("/users", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Obtener usuario por ID
router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Actualizar usuario por ID
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, lastname, phone, email } = req.body;

  userSchema
    .updateOne({ _id: id }, { $set: { name, lastname, phone, email } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
