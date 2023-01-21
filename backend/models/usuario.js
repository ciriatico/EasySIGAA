const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const usuarioSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    senha: { type: String, required: true },
    receberNot: { type: Boolean, required: true, default: true },
    maxNot: { type: Number, required: true, default: 10 },
  },
  { versionKey: false }
);

usuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Usuario", usuarioSchema);
