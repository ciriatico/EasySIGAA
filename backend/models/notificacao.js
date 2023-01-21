const mongoose = require("mongoose");

const notificacaoSchema = mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    mudancaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mudanca",
      required: true,
    },
    dataDisparo: {
      type: Number,
      required: true,
      default: Date.now,
    },
    lida: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Notificacao", notificacaoSchema);
