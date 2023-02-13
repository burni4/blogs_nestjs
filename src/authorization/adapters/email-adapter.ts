import nodemailer from 'nodemailer';

export class EmailAdapter {
  async sendEmailFromGmail(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.gmail_login,
        pass: process.env.gmail_password,
      },
    });

    const info = await transporter.sendMail({
      from: 'Incubator Homework <process.env.gmail_login>',
      to: email,
      subject: subject,
      html: message,
    });
    return info;
  }
}
