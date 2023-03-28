import { SMTP_PASSWORD, SMTP_USER } from '../../../config';
import {
    getRegistrationSubmittedText,
    getRegistrationSubmittedHtml,
    getAdminRegistrationSubmittedText,
    getAdminRegistrationSubmittedHtml
} from '../../constants/email/registration';
import { sendEmail } from './utils';

export const sendRegistrationSubmittedEmail = async (to) => {
    const user = SMTP_USER;
    const password = SMTP_PASSWORD;
    const from = '"tcup" <noreply@tcup.cz>';
    const subject = 'Přihláška';

    const text = getRegistrationSubmittedText();
    const html = getRegistrationSubmittedHtml();

    sendEmail(user, password, from, to.email, subject, text, html);
};

export const sendRegistrationSubmittedEmailToAdmin = async (toUser) => {
    const user = SMTP_USER;
    const password = SMTP_PASSWORD;
    const from = '"tcup" <noreply@tcup.cz>';
    const subject = `Přihláška ${toUser.name} ${toUser.surname}`;

    const text = getAdminRegistrationSubmittedText(toUser);
    const html = getAdminRegistrationSubmittedHtml(toUser);

    const to = ['harasta.ivan@gmail.com', 'pjiranekpj@gmail.com'].join(', ');

    sendEmail(user, password, from, to, subject, text, html);
};
