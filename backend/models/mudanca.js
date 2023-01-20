const mongoose = require('mongoose')

const mudancaSchema = mongoose.Schema(
  {
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turma',
      required: true
    },
    variacao: {
      type: Number,
      required: true
    },
    data: {
      type: Date,
      required: true
    }
  }
)

module.exports = mongoose.model('Mudanca', mudancaSchema)
