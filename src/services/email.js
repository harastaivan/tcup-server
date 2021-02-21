import nodemailer from 'nodemailer';
import config from '../../config';
import User from '../models/User';
import { getNewsText, getNewsHtml } from '../constants/email/news';
import {
    getResetPasswordLink,
    getResetPasswordHtml,
    getResetPasswordText,
    getPasswordResetCompleteHtml,
    getPasswordResetCompleteText
} from '../constants/email/resetPassword';

const getNewsReceivers = async (SEND_EMAILS_TO_ALL) => {
    if (!SEND_EMAILS_TO_ALL) {
        return 'harasta.ivan@gmail.com';
    }
    const users = await User.find();
    const emails = users.map((user) => user.email);
    const to = emails.join(', ');
    return to;
};

const getSubject = (SEND_EMAILS_TO_ALL, title) => {
    if (!SEND_EMAILS_TO_ALL) {
        return `TEST: ${title}`;
    }
    return title;
};

export const sendNewsEmail = async (title, body, author) => {
    const SEND_EMAILS_TO_ALL = config.SEND_EMAILS_TO_ALL;
    const user = config.SMTP_USER;
    const password = config.SMTP_PASSWORD;
    const from = '"tcup novinky" <noreply@tcup.cz>';
    const to = await getNewsReceivers(SEND_EMAILS_TO_ALL);
    const subject = getSubject(SEND_EMAILS_TO_ALL, title);

    const text = getNewsText(title, body, author);
    const html = getNewsHtml(title, body, author);

    sendEmail(user, password, from, to, subject, text, html);
};

export const sendResetPasswordEmail = async (to, token) => {
    const user = config.SMTP_USER;
    const password = config.SMTP_PASSWORD;
    const from = '"tcup" <noreply@tcup.cz>';
    const subject = 'Změna hesla';

    const link = getResetPasswordLink(token);

    const text = getResetPasswordText(link);
    const html = getResetPasswordHtml(link);

    sendEmail(user, password, from, to, subject, text, html);
};

export const sendPasswordResetCompleteEmail = async (to) => {
    const user = config.SMTP_USER;
    const password = config.SMTP_PASSWORD;
    const from = '"tcup" <noreply@tcup.cz>';
    const subject = 'Změna hesla';

    const text = getPasswordResetCompleteText();
    const html = getPasswordResetCompleteHtml();

    sendEmail(user, password, from, to, subject, text, html);
};

const sendEmail = (user, pass, from, to, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.seznam.cz',
        port: 465,
        secure: true,
        auth: {
            user,
            pass
        }
    });

    const mailOptions = {
        from,
        to,
        subject,
        text,
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // eslint-disable-next-line
            console.error('Email not sent:', error);
            throw error;
        }
        // eslint-disable-next-line
        console.log('Email sent:', info.messageId, 'to', to);
    });
};
