const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors package

const turmasRoutes = require("./routes/turmas");
const authRoutes = require("./routes/auth");
const notificacaoRoutes = require("./routes/notificacao");
const mudancaRoutes = require("./routes/mudancas");
const usuarioRoutes = require("./routes/usuario");

const app = express();

mongoose.set("strictQuery", true);

// Update the connection URI to connect to the MongoDB service in Docker Compose
mongoose
  .connect("mongodb://mongodb:27017/easysigaa", {
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

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:4200', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'], // Allow necessary headers
}));

app.use("/api/turmas", turmasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notificacoes", notificacaoRoutes);
app.use("/api/mudancas", mudancaRoutes);
app.use("/api/usuario", usuarioRoutes);

module.exports = app;
