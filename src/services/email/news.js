import { SEND_EMAILS_TO_ALL, SMTP_PASSWORD, SMTP_USER } from '../../../config';
import { getNewsText, getNewsHtml } from '../../constants/email/news';
import { getSubject, sendEmail } from './utils';

import User from '../../models/User';

const getReceivers = async () => {
    if (!SEND_EMAILS_TO_ALL) {
        return 'harasta.ivan@gmail.com';
    }
    const users = await User.find();
    const emails = users.map((user) => user.email);
    const to = emails.join(', ');
    return to;
};

export const sendNewsEmail = async (title, body, author) => {
    const user = SMTP_USER;
    const password = SMTP_PASSWORD;
    const from = '"tcup novinky" <noreply@tcup.cz>';
    const to = await getReceivers();
    const subject = getSubject(title);

    const text = getNewsText(title, body, author);
    const html = getNewsHtml(title, body, author);

    sendEmail(user, password, from, to, subject, text, html);
};
