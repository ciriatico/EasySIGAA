const express = require("express");
const { routes } = require("../app");
const checkAuth = require("../middleware/check-auth");
const Usuario = require("../models/usuario");

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
        res
          .status(200)
          .json({
            message: "Configurações do usuário atualizadas com sucesso",
          });
      }
    }
  );
});

module.exports = router;
