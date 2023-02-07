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

async function sendEmail(data) {
  const fake = true;

  const mailOptions = {
    from: "admin@easysigaa.com.br",
    to: data.email,
    subject: `EasySIGAA - Vaga em ${data.nomeDisciplina} - turma ${data.codTurma}`,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title></title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    </head>
    
    <body>
        <div class="es-wrapper-color">
            <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#eff2f7"></v:fill>
          </v:background>
        <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">
                            <table class="es-header esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center" bgcolor="transparent" style="background-color: transparent;">
                                            <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#0c66ff" align="center" style="background-color: #3f51b5;">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p20t es-p20b es-p15r es-p15l" align="left">
                                                            <table cellspacing="0" cellpadding="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="es-m-p0r esd-container-frame" width="570" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image es-m-txt-c" style="font-size: 0px; padding: 20px 20px;"><a target="_blank" href="https://viewstripo.email/"><img src="easysigaa\src\assets\LogoWhiteWord.svg" alt style="display: block;" width="250"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#fefefe" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p40t es-p40b es-p15r es-p15l" align="left">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="570" class="esd-container-frame" align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text">
                                                                                            <h1 style="font-family: 'DM Serif Display', serif; color: #2F2E41;">Olá, ${data.nome}!<br> Há novas vagas para você!</h1>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text es-p10t">
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-button es-p40t es-p20b" ><span class="es-button-border" style="background-color: #3f51b5; padding: 10px 14px;"><a style="text-decoration: none; color: white; font-family: 'Roboto', sans-serif;" href="http://localhost:4200/" class="es-button" target="_blank">${data.nomeDisciplina} - ${data.variacao} novas vagas</a></span></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    
    </html>`,
  };

  if (fake) {
    console.log("Enviando e-mail falso.");
  } else {
    smtpTransport.sendMail(mailOptions).then((result) => {
      console.log("E-mail enviado com sucesso.");
    });
  }
}

async function sendNotifications(mudanca) {
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
        const notificacao = new Notificacao({
          usuarioId: monitorada.usuarioId._id,
          mudancaId: mudanca.mudancaId,
        });
        notificacao.save();
        if (!monitorada.usuarioId.receberNot) {
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

async function sendMudanca(newMudanca) {
  const mudanca = new Mudanca({
    turmaId: newMudanca.turmaId,
    ocupadas: newMudanca.ocupadas,
  });
  mudanca.save().then((result) => {
    if (newMudanca.variacao > 0) {
      console.log(newMudanca.variacao);
      sendNotifications({
        mudancaId: mudanca._id,
        turmaId: mudanca.turmaId,
        ocupadas: mudanca.ocupadas,
        variacao: newMudanca.variacao,
      });
    }
  });
}

async function updateTurma(updatedTurma) {
  Turma.findOne({ idTurma: updatedTurma.idTurma })
    .then((turma) => {
      return Monitora.findOne({ turmaId: turma._id }).populate({
        path: "turmaId",
        select: "idTurma vagasOcupadas",
      });
    })
    .then((monitora) => {
      if (monitora) {
        // Se monitora a turma
        variacao = monitora.turmaId.vagasOcupadas - updatedTurma.vagasOcupadas;
        if (variacao != 0) {
          // Se houve vagas liberadas na turma
          sendMudanca({
            turmaId: monitora.turmaId._id,
            ocupadas: updatedTurma.vagasOcupadas,
            variacao: variacao,
          });
        }
      }
    })
    .then((result) => {
      Turma.findOne({ turmaId: updatedTurma.idTurma }).then((turma) => {
        if (turma.vagasOcupadas != updatedTurma.vagasOcupadas) {
          turma.vagasOcupadas = updatedTurma.vagasOcupadas;
          turma.vagasTotal = updatedTurma.vagasTotal;
          turma.save();
        }
      });
    });
}

async function updateTurmasMonitoradas() {
  Monitora.find()
    .populate({ path: "turmaId", select: "idTurma" })
    .then((monitoras) => {
      let idsMonitorados = new Set();
      monitoras.forEach((mon) => {
        idsMonitorados.add(mon.turmaId.idTurma);
      });
      idsMonitorados = [...idsMonitorados];
      axios
        .post("http://localhost:8000/vagas", { data: idsMonitorados })
        .then((res) => {
          res.data.forEach((turma) => {
            updateTurma(turma);
          });
        });
    });
}

async function updateTurmas() {
  axios
    .get("http://localhost:8000/oferta")
    .then((res) => {
      turmas = res.data;
      turmas.forEach((turma) => {
        updateTurma(turma);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

updateTurmasMonitoradas();

// Atualiza cada turma. Trava o servidor, deve ser executada em intervalo de horas
setInterval(updateTurmas, 3600000);
// Atualiza apenas turmas monitoradas. Pode rodar de 5 em 5 min, gera dados falsos
setInterval(updateTurmasMonitoradas, 30000);

router.get("", (req, res, next) => {
  Turma.find().then((data) => {
    res.status(200).json({
      message: "Turmas retornadas com sucesso",
      turmas: data,
    });
  });
});

router.get("/departamentos", (req, res, next) => {
  Turma.distinct("nomeDepto").then((data) => {
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
          "codTurma numTurma codDisciplina nomeDisciplina codDepto nomeDepto professor periodo horario local vagasOcupadas vagasTotal",
      })
      .then((documents) => {
        return res.status(200).json({ turmasMonitoradas: documents });
      });
  }
});

router.get("/historico/:idTurma", (req, res, next) => {
  Mudanca.find({ turmaId: req.params.idTurma }).then(
    (data) => {
      res.status(200).json({
        message: "Historico retornado com sucesso",
        mudancas: data,
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
