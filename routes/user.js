const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../libs/jwt");
const { authRequired } = require("../middlewares/validateToken");
const { validetaSchema } = require("../middlewares/validator.middlewares");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");
const { TOKEN_SECRET } = require("../config");

router.get("/", async (req, res) => {
  const users = await User.findAll();

  res.send(users);
});

router.post("/register", validetaSchema(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: passwordHash });

    const token = await createAccessToken({ id: newUser.id });

    res.cookie("token", token);
    res.send({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/login", validetaSchema(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ where: { email } });
    if (!userFound) return res.status(400).send("El usuario no existe");

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).send("Password incorrecto");

    const token = await createAccessToken({ id: userFound.id });

    res.cookie("token", token);
    res.send({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });

  return res.sendStatus(200);
});

router.get("/profile", authRequired, async (req, res) => {
  const userFound = await User.findByPk(req.user.id);

  if (!userFound)
    return res.status(400).send({ message: "Usuario no encontrado" });

  return res.send({
    id: userFound.id,
    name: userFound.name,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
});

router.get("/verify", async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).send({ message: "No autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).send({ message: "No autorizado" });

    const userFound = await User.findByPk(user.id);
    if (!userFound) return res.status(401).send({ message: "No autorizado" });

    return res.send({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  });
});

module.exports = router;
