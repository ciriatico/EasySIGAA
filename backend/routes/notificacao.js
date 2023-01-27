const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Notificacao = require("../models/notificacao");

const router = express.Router();

router.get("/", checkAuth, (req, res, next) => {
  Notificacao.find({ usuarioId: req.userData.userId })
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

router.get("/novas", checkAuth, (req, res, next) => {
  Notificacao.count({ usuarioId: req.userData.userId, lida: false }).then(
    (data) => {
      res.status(200).json({
        message: "Número de novas notificações retornado com sucesso.",
        qtdNotificacoes: data,
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

router.put("/marcarlidas", checkAuth, (req, res, next) => {
  Notificacao.updateMany(
    { usuarioId: req.userData.userId, lida: false },
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

router.delete("/", checkAuth, (req, res, next) => {
  Notificacao.deleteMany({ usuarioId: req.userData.userId }, (err, result) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "Notificações excluídas com sucesso" });
    }
  });
});

module.exports = router;
