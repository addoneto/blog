const months = [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
'julho', 'agosto', 'setembro','outubro','novembro','dezembro'];

function ptFormat(d) {
return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()} às ${d.toLocaleTimeString('pt-BR').slice(0,5)}`;}

module.exports.ptFormat = ptFormat;