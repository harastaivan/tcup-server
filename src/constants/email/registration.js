export const getRegistrationSubmittedText = () => {
    return 'Děkujeme za přihlášení se na tcup, vaše přihláška nám úspěšně dorazila.';
};

export const getRegistrationSubmittedHtml = () => {
    return `
        <h2>Přihláška</h2>
        <p>Děkujeme za přihlášení se na tcup, vaše přihláška nám úspěšně dorazila.<p>
    `;
};

export const getAdminRegistrationSubmittedText = (to) => {
    return `${to.name} ${to.surname} (${to.email}) si vytvořil přihlášku.`;
};

export const getAdminRegistrationSubmittedHtml = (to) => {
    return `
        <h2>Přihláška</h2>
        <p>${to.name} ${to.surname} (${to.email}) si vytvořil přihlášku.<p>
    `;
};
