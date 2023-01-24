const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Notificacao = require("../models/notificacao");

const router = express.Router();

router.get("/:usuarioId", checkAuth, (req, res, next) => {
  Notificacao.find({ usuarioId: req.params.usuarioId })
    .populate({
      path: "mudancaId",
      populate: { path: "turmaId", model: "Turma" },
    })
    .then(
      (data) => {
        res.status(200).json({
          message: "Notificações retornadas com sucesso",
          notificacoes: data,
        });
      },
      (err) => {
        res.json({
          message: err,
        });
      }
    );
});

module.exports = router;
