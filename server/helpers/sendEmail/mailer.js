import nodemailer from 'nodemailer';
import { emailTemplates } from './emailTemplates';
import { email } from '../../config/config';

class Mailer {
  constructor(_userEmail) {
    console.log('email', email);
    this.userMail = _userEmail;
    this.senderEmail = email.user;
    this.senderPass = email.pass;
  }

  addTokenToEmail(token, template = 'verification') {
    return new Promise(async (resolve, reject) => {
      const mailOptions = emailTemplates[template];
      mailOptions.from = this.senderEmail;
      mailOptions.to = this.userMail;
      const addToken = mailOptions.html.replace('$token', token.generate);
      mailOptions.html = addToken;
      try {
        const response = await this.sendEmail(mailOptions);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.senderEmail,
          pass: this.senderPass
        }
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(`Email sent: ${info.response}`);
        }
      });
    });
  }
}

export default Mailer;
