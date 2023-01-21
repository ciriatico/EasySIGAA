const mongoose = require("mongoose");

const mudancaSchema = mongoose.Schema(
  {
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turma",
      required: true,
    },
    ocupadas: {
      type: Number,
      required: true,
    },
    dataCaptura: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Mudanca", mudancaSchema);
