import nodemailer from 'nodemailer';
import { SEND_EMAILS_TO_ALL } from '../../../../config';

export const sendEmail = (user, pass, from, to, subject, text, html) => {
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

export const getSubject = (title) => {
    if (!SEND_EMAILS_TO_ALL) {
        return `TEST: ${title}`;
    }
    return title;
};
