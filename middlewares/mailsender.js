const nodemailer = require("nodemailer");

const mailsender = async (email, verifyToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "meta",
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: "elatan@meta.ua",
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "kyrylo_polozhenets@meta.ua",
      to: email,
      subject: "Mail confirmation",
      text: `Hello please confirm the email!`,
      html: `<a href="${process.env.BASE_URL}/users/verify/${verifyToken}">Confirm your email</a>`,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = mailsender;