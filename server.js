const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const model = require("./models");
const routes = require("./routes");
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use((err, req, res) => {
  res.status(500).send(err.message);
});

db.sync({ force: false }).then(() => {
  app.listen(4000, () => console.log("Servidor escuchando en el puerto 4000"));
});
