// lib/email.ts
import nodemailer from 'nodemailer';

// Crear el transportador (usa las variables de .env.local)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Tu correo personal
    pass: process.env.GMAIL_APP_PASS, // Tu Contraseña de Aplicación
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const mailOptions = {
    from: process.env.GMAIL_USER, 
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Correo enviado exitosamente a ${to}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] ❌ Error al enviar el correo:', error);
    return false;
  }
}