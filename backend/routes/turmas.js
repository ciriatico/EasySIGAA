const express = require("express");

const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const Turma = require("../models/turma");
const Monitora = require("../models/monitora");
const Mudanca = require("../models/mudanca");
const Notificacao = require("../models/notificacao");
const checkAuth = require("../middleware/check-auth");

const axios = require("axios");

const router = express.Router();

const mailgunAuth = {
  auth: {
    api_key: "",
    domain: "",
  },
};

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

function sendEmail(data) {
  const mailOptions = {
    from: "admin@easysigaa.com.br",
    to: data.email,
    subject: `EasySIGAA - Vaga em ${data.nomeDisciplina} - turma ${data.codTurma}`,
    html: `Olá, ${data.nome}, foram liberadas ${data.variacao} vagas na disciplina de ${data.nomeDisciplina}, turma ${data.codTurma}.`,
  };

  smtpTransport.sendMail(mailOptions).catch((result) => {
    console.log("Successfully sent email.");
    const notificacao = new Notificacao({
      usuarioId: data.usuarioId,
      mudancaId: data.mudancaId,
    });
    notificacao.save();
  });
}

function sendNotifications(mudanca) {
  Monitora.find({ turmaId: mudanca.turmaId })
    .populate({
      path: "usuarioId",
      select: "email nome receberNot maxNot",
    })
    .populate({
      path: "turmaId",
      select: "nomeDisciplina codTurma",
    })
    .then((monitoradas) => {
      monitoradas.forEach((monitorada) => {
        if (monitorada.usuarioId.receberNot) {
          sendEmail({
            usuarioId: monitorada.usuarioId._id,
            mudancaId: mudanca.mudancaId,
            email: monitorada.usuarioId.email,
            nome: monitorada.usuarioId.nome,
            variacao: mudanca.variacao,
            nomeDisciplina: monitorada.turmaId.nomeDisciplina,
            codTurma: monitorada.turmaId.codTurma,
          });
        }
      });
    });
}

function sendMudanca(newMudanca) {
  const mudanca = new Mudanca({
    turmaId: newMudanca.turmaId,
    ocupadas: newMudanca.ocupadas,
  });
  mudanca.save().then((result) => {
    if (newMudanca.variacao > 0) {
      sendNotifications({
        mudancaId: mudanca._id,
        turmaId: mudanca.turmaId,
        ocupadas: mudanca.ocupadas,
        variacao: newMudanca.variacao,
      });
    }
  });
}

function updateTurma(updatedTurma) {
  let turma;
  Turma.findOne({ turmaId: updatedTurma.idTurma })
    .then((turma) => {
      this.turma = turma;
      return Monitora.find({ turmaId: this.turma._id });
    })
    .then((monitora) => {
      if (monitora) {
        variacao = this.turma.vagasOcupadas - updatedTurma.vagasOcupadas;
        if (variacao != 0) {
          // Se houve vagas liberadas na turma
          sendMudanca({
            turmaId: this.turma._id,
            ocupadas: updatedTurma.vagasOcupadas,
            variacao: variacao,
          });
        }
      } else {
        return;
      }
    })
    .then((result) => {
      this.turma.vagasOcupadas = updatedTurma.vagasOcupadas;
      this.turma.vagasTotal = updatedTurma.vagasTotal;
      this.turma.save();
    });
}

function getOferta() {
  axios
    .get("http://localhost:8000/oferta")
    .then((res) => {
      turmas = res.data;
      turmas.forEach(turma => {
        updateTurma(turma);
      })
    })
    .catch((err) => {
      console.log(err);
    });
}

getOferta();

setInterval(getOferta, 150000);

router.get("", (req, res, next) => {
  Turma.find().then((data) => {
    res.status(200).json({
      message: "Turmas retornadas com sucesso",
      turmas: data,
    });
  });
});

router.get("/departamentos", (req, res, next) => {
  Turma.distinct("codDepto").then((data) => {
    res.status(200).json({
      message: "Departamentos retornados com sucesso",
      departamentos: data,
    });
  });
});

router.get("/monitorar/:id", checkAuth, (req, res, next) => {
  monitora = new Monitora({
    usuarioId: req.userData.userId,
    turmaId: req.params.id,
    dataInicio: new Date(),
  });
  monitora.save().then((createdMonitora) => {
    res.status(201).json({
      message: "Turma monitarada!",
      monitorada: {
        id: createdMonitora._id,
        userId: createdMonitora.userId,
        turmaId: createdMonitora.turmaId,
        dataInicio: createdMonitora.dataInicio,
      },
    });
  });
});

router.delete("/monitorar/:id", checkAuth, (req, res, next) => {
  Monitora.deleteOne({
    turmaId: req.params.id,
    usuarioId: req.userData.userId,
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
    Monitora.find({ usuarioId: req.userData.userId }).then((documents) => {
      return res.status(200).json({ turmasMonitoradas: documents });
    });
  } else {
    Monitora.find({ usuarioId: req.userData.userId })
      .populate({
        path: "turmaId",
        select:
          "codTurma numTurma codDisciplina nomeDisciplina codDepto nomeDepto professor periodo horario local vagas_ocupadas vagas_total",
      })
      .then((documents) => {
        return res.status(200).json({ turmasMonitoradas: documents });
      });
  }
});

module.exports = router;
