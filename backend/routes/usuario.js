const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Usuario = require("../models/usuario");
const Monitora = require("../models/monitora");
const Notificacao = require("../models/notificacao");

const router = express.Router();

router.get("", checkAuth, (req, res, next) => {
  Usuario.findOne({ _id: req.userData.userId }).then((data) => {
    res.status(200).json({
      message: "Usuario retornado com sucesso",
      usuario: data,
    });
  });
});

router.put("/salvarConfiguracoes", checkAuth, (req, res, next) => {
  Usuario.updateOne(
    { _id: req.userData.userId },
    {
      $set: {
        receberNot: req.body.receberNot,
        maxNot: req.body.maxNot,
        nome: req.body.nome,
        email: req.body.email,
      },
    },
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err });
      } else {
        res.status(200).json({
          message: "Configurações do usuário atualizadas com sucesso",
        });
      }
    }
  );
});

router.delete("", checkAuth, (req, res, next) => {
  Notificacao.deleteMany({ usuarioId: req.userData.userId }, (err, result) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      Monitora.deleteMany({ usuarioId: req.userData.userId }, (err, result) => {
        if (err) {
          res.status(500).json({ message: err });
        } else {
          Usuario.deleteOne({ _id: req.userData.userId }, (err, result) => {
            if (err) {
              res.status(500).json({ message: err });
            } else {
              res.status(204).json({ message: "Usuário deletado com sucesso" });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
