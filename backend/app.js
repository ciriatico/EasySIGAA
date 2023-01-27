const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const turmasRoutes = require("./routes/turmas");
const authRoutes = require("./routes/auth");
const notificacaoRoutes = require("./routes/notificacao")
const mudancaRoutes = require("./routes/mudancas")
const usuarioRoutes = require("./routes/usuario")

const app = express();

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb+srv://root:root@cluster0.cstyiqc.mongodb.net/easysigaa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed.");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/turmas", turmasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notificacoes", notificacaoRoutes)
app.use("./api/mudancas", mudancaRoutes)

module.exports = app;