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


