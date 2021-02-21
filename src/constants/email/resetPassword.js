export const getResetPasswordLink = (token) => {
    return `https://www.tcup.cz/password-reset?token=${token}`;
};

export const getResetPasswordText = (link) => {
    return `
Požádali jste o změnu hesla, kliknutím na tento odkaz si heslo změníte:

${link}

Pokud jste to nebyli vy, nemusíte dělat nic.
    `;
};

export const getResetPasswordHtml = (link) => {
    return `
        <h2>Změna hesla</h2>
        <p>Požádali jste o změnu hesla, kliknutím na <a href="${link}">tento odkaz</a> si heslo změníte:</p>
        <a href="${link}">${link}</a>
        <p>Pokud jste to nebyli vy, nemusíte dělat nic, vaše heslo zůstane nezměněno.<p>
    `;
};

export const getPasswordResetCompleteText = () => {
    return 'Vaše heslo bylo obnoveno.';
};

export const getPasswordResetCompleteHtml = () => {
    return `
        <h2>Změna hesla</h2>
        <p>Vaše heslo bylo úspěšně změněno.<p>
    `;
};
