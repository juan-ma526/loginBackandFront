const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./config/db");
const model = require("./models");
const routes = require("./routes");

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors("*"));

app.use("/api", routes);

app.use((err, req, res) => {
  res.status(500).send(err.message);
});

db.sync({ force: false }).then(() => {
  app.listen(4000, () => console.log("Servidor escuchando en el puerto 4000"));
});
