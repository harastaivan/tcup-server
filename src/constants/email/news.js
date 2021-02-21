export const getNewsText = (title, body, author) => {
    return `
Byla zveřejněna novinka na tcup:

${title}

${body}

${author.name} ${author.surname}
${author.email}
    `;
};

export const getNewsHtml = (title, body, author) => {
    const bodyParagraphs = body.split('\n').join('<br>');

    return `
        <p>Byla zveřejněna novinka na <a href="https://www.tcup.cz/news">tcup</a>:<p>
        <h2>${title}</h2>
        <p>${bodyParagraphs}</p>
        <address>
            ${author.name} ${author.surname}<br>
            ${author.email}
        </address>
    `;
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
