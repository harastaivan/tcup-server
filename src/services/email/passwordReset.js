import { SMTP_PASSWORD, SMTP_USER } from '../../../config';
import {
    getResetPasswordLink,
    getResetPasswordHtml,
    getResetPasswordText,
    getPasswordResetCompleteHtml,
    getPasswordResetCompleteText
} from '../../constants/email/resetPassword';
import { sendEmail } from './utils';

export const sendResetPasswordEmail = async (to, token) => {
    const user = SMTP_USER;
    const password = SMTP_PASSWORD;
    const from = '"tcup" <noreply@tcup.cz>';
    const subject = 'Změna hesla';

    const link = getResetPasswordLink(token);

    const text = getResetPasswordText(link);
    const html = getResetPasswordHtml(link);

    sendEmail(user, password, from, to, subject, text, html);
};

export const sendPasswordResetCompleteEmail = async (to) => {
    const user = SMTP_USER;
    const password = SMTP_PASSWORD;
    const from = '"tcup" <noreply@tcup.cz>';
    const subject = 'Změna hesla';

    const text = getPasswordResetCompleteText();
    const html = getPasswordResetCompleteHtml();

    sendEmail(user, password, from, to, subject, text, html);
};
