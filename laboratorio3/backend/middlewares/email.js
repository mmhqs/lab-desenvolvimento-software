const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alemaopura7@gmail.com',
    pass: 'lozhwxgecquzsoow',
  },
});

const enviarEmail = async (destinatario, assunto, corpo) => {
  try {
    await transporter.sendMail({
      from: `"Sistema de Moedas" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: assunto,
      html: corpo,
    });
    console.log(`E-mail enviado para ${destinatario}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Falha no envio do e-mail');
  }
};

module.exports = { enviarEmail };