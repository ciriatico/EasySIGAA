const mongoose = require("mongoose");

const turmaSchema = mongoose.Schema({
  idTurma: { type: String, required: true },
  codTurma: { type: String, required: true },
  codDisciplina: { type: String, required: true },
  nomeDisciplina: { type: String, required: true },
  codDepto: { type: Number, required: true },
  nomeDepto: { type: String, required: true },
  professor: { type: String, required: true },
  periodo: { type: String, required: true },
  horario: { type: String, required: true },
  vagasOcupadas: { type: Number, required: true },
  vagasTotal: { type: Number, required: true },
});

module.exports = mongoose.model("Turma", turmaSchema);
