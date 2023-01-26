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

router.put("/marcarlida/:notificacaoId", checkAuth, (req, res, next) => {
  Notificacao.updateOne(
    { lida: false, _id: req.params.notificacaoId },
    { $set: { lida: true } },
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err });
      } else {
        res
          .status(200)
          .json({ message: "Notificação marcada como lida com sucesso" });
      }
    }
  );
});

router.put("/marcarlidas/:usuarioId", checkAuth, (req, res, next) => {
  Notificacao.updateMany(
    { usuarioId: req.params.usuarioId, lida: false },
    { $set: { lida: true } },
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err });
      } else {
        res
          .status(200)
          .json({ message: "Notificações marcadas como lidas com sucesso" });
      }
    }
  );
});

module.exports = router;
