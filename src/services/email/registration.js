import { SMTP_PASSWORD, SMTP_USER } from '../../../config';
import { getRegistrationSubmittedText, getRegistrationSubmittedHtml } from '../../constants/email/registration';
import { sendEmail } from './utils';

export const sendRegistrationSubmittedEmail = async (to) => {
    const user = SMTP_USER;
    const password = SMTP_PASSWORD;
    const from = '"tcup" <noreply@tcup.cz>';
    const subject = 'Přihláška';

    const text = getRegistrationSubmittedText();
    const html = getRegistrationSubmittedHtml();

    sendEmail(user, password, from, to, subject, text, html);
};
