const mongoose = require("mongoose");

const turmaSchema = mongoose.Schema({
  turma: { type: Number, required: true },
  periodo: { type: String, required: true },
  professor: { type: String, required: true },
  horario: { type: String, required: true },
  vagas_ocupadas: { type: Number, required: true },
  vagas_total: { type: Number, required: true },
  local: { type: String, required: true },
  cod_disciplina: { type: String, required: true },
  cod_unico_disciplina: { type: Number, required: true },
  cod_depto: { type: Number, required: true },
  nome_disciplina: { type: String, required: true },
});

module.exports = mongoose.model("Turma", turmaSchema);
