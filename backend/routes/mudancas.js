const express = require('express')
const Mudanca = require('../models/mudanca')

const router = express.Router()

router.post('/mudar/:id/:variacao', (req, res, next) => {
  mudanca = new Mudanca({
    turmaId: req.params.id,
    data: new Date(),
    variacao: req.params.variacao
  })
  mudanca.save().then(
    newMudanca => {
      res.status(201).json({
        message: 'Mudanca registrada!',
        mudanca: {
          id: newMudanca._id,
          turmaId: newMudanca.userId,
          data: newMudanca.data,
          variacao: newMudanca.variacao
        }
      })
    },
    err => {
      res.json({
        message: err
      })
    }
  )
})

router.get('/mudancas/:id', (req, res, next) => {
  Mudanca.find({ turmaId: req.params.id }).then(
    data => {
      res.status(200).json({
        message: 'Mudancas retornadas com sucesso',
        mudancas: data
      })
    },
    err => {
      res.json({
        message: err
      })
    }
  )
})

module.exports = router
