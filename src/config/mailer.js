import nodeMailer from "nodemailer";

//run evn
require('dotenv').config();

let adminEmail = process.env.MAIL_USER;
let emailPassword = process.env.MAIL_PASSWORD;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;

let sendMail = (to, subject, htmlContent) => {
 let transposter = nodeMailer.createTransport({
  host: mailHost,
  port: mailPort,
  secure: false,
  auth : {
    user: adminEmail,
    pass: emailPassword
  }
 });
 let options = {
   from: adminEmail,
   to: to,
   subject: subject,
   html: htmlContent
 };
 return transposter.sendMail(options);
};

module.exports = sendMail;