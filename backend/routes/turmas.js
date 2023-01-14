const express = require("express");

const Turma = require("../models/turma");
const Monitorada = require("../models/monitorada");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const turmaQuery = Turma.find();
  let fetchedTurmas;

  if (pageSize && currentPage) {
    turmaQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  turmaQuery
    .then((documents) => {
      fetchedTurmas = documents;
      return Turma.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Turmas retornadas com sucesso",
        turmas: fetchedTurmas,
        maxTurmas: count,
      });
    });
});

router.get("/monitorar/:id", checkAuth, (req, res, next) => {
  monitorada = new Monitorada({
    userId: req.userData.userId,
    turmaId: req.params.id,
    beginDate: new Date(),
  });
  monitorada.save().then((createdMonitorada) => {
    res.status(201).json({
      message: "Turma monitarada!",
      monitorada: {
        id: createdMonitorada._id,
        userId: createdMonitorada.userId,
        turmaId: createdMonitorada.turmaId,
        beginDate: createdMonitorada.beginDate,
      },
    });
  });
});

router.delete("/monitorar/:id", checkAuth, (req, res, next) => {
  Monitorada.deleteOne({
    turmaId: req.params.id,
    userId: req.userData.userId,
  }).then((result) => {
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Monitoramento interrompido" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  });
});

router.get("/monitoradas", checkAuth, (req, res, next) => {
  let fullInfo = req.query.full;
  if (fullInfo === "false") {
    Monitorada.find({ userId: req.userData.userId }).then((documents) => {
      return res.status(200).json({ turmasMonitoradas: documents });
    });
  } else {
    Monitorada.find({ userId: req.userData.userId })
      .populate({
        path: "turmaId",
        select:
          "turma periodo professor horario vagas_ocupadas vagas_total local cod_disciplina cod_depto nome_disciplina",
      })
      .then((documents) => {
        return res.status(200).json({ turmasMonitoradas: documents });
      });
  }
});

module.exports = router;
