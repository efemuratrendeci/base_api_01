//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const EmailTemplates = require('../../Utils/Templates/EmailTemplates');
const EmailType = require('../Enums/EmailType');
// ────────────────────────────────────────────────────────────────────────────────

class EmailController {
    constructor({
        emailType,
        to,
        from,
        content
    }) {
        this.sendMail = async () => {
            let transporter = nodemailer.createTransport(sendGridTransport({
                auth: {
                    api_key: process.env.SENDGRID_API_KEY
                }
            }));

            let html, subject;
            switch (emailType) {
                case EmailType.FIRST_LOGIN:
                    html = EmailTemplates.firstLogin(content);
                    subject = 'Base API Hoş Geldiniz';
                    break;
                case EmailType.RESET_PASSWORD:
                    html = EmailTemplates.resetPassword(content);
                    subject = 'Base API Şifre Sıfırlama';
                    break;
                case EmailType.INFO:
                    //ayarlanmadı.
                    break;
            }

            transporter.sendMail({
                to: to,
                from: from || process.env.DEFAULT_EMAIL_FROM,
                subject: subject,
                html: html
            });
        }
    }
}

module.exports = EmailController;