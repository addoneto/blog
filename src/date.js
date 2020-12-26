const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro','outubro','novembro','dezembro',
];

function ptFormat(date) {
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()} às ${date.toLocaleTimeString('pt-BR').slice(0,5)}`;
}

module.exports.ptFormat = ptFormat;