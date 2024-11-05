import nodemailer from "nodemailer";

const myEmail = "axelleger2@gmail.com";

export const email = async (req, res) => {
  const { correo, mensaje, asunto } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: myEmail,
      pass: "Jhonimepeino123",
    },
  });

  const mailOptions = {
    from: correo,
    to: myEmail,
    subject: asunto,
    text: mensaje,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ msg: "El correo se envió correctamente" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};
