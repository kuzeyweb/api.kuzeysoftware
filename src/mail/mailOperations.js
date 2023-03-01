import nodemailer from "nodemailer";
import { contactMessageTemplate, emailValidationTemplate, passwordResetTemplate, twoFactorAuthTemplate } from "./emailTemplates.js";

const transfer = nodemailer.createTransport({
    host: "mail.kuzeysoftware.com",
    port: '465',
    auth: {
        user: "mailer@kuzeysoftware.com",
        pass: "%mOvPLJKTD*p"
    },

});

export const sendEmailValidationMail = ({ to, name, code }) => {

    var mailcontent = { ...emailValidationTemplate(name, code) };
    mailcontent.to = to;
    let response = {};

    try {
        transfer.sendMail(mailcontent);
        response = { error: false, message: "success" }
    } catch (err) {
        response = { error: true, message: err }
    }

    return response;

}
export const sendTwoFactorAuthMail = ({ to, name, code }) => {

    var mailcontent = { ...twoFactorAuthTemplate(name, code) };
    mailcontent.to = to;
    let response = {};

    try {
        transfer.sendMail(mailcontent);
        response = { error: false, message: "success" }
    } catch (err) {
        response = { error: true, message: err }
    }

    return response;

}

export const sendPasswordResetEmail = ({ to, name, code }) => {

    var mailcontent = { ...passwordResetTemplate(name, code, to) };
    mailcontent.to = to;
    let response = {};

    try {
        transfer.sendMail(mailcontent);
        response = { error: false, message: "success" }
    } catch (err) {
        response = { error: true, message: err }
    }

    return response;

}

export const sendContactEmail = ({ fullname, email, message, to }) => {
    var mailcontent = { ...contactMessageTemplate(fullname, email, message) };
    mailcontent.to = to;
    let response = {};

    try {
        transfer.sendMail(mailcontent);
        response = { error: false, message: "success" }
    } catch (err) {
        response = { error: true, message: err }
    }

    return response;
}