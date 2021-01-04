const months = [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
'julho', 'agosto', 'setembro','outubro','novembro','dezembro'];

//  Convert the Date stored in DB with US timestanp to Brazil GMT-3 format
function ptFormat(d) {
    const r = d.toLocaleString('pt-PT', {hour12: false, timezone : "America/Sao_Paulo"});
    return `${r.slice(0,2)} de ${months[Number(r.slice(3,5))]} de ${r.slice(6,10)} às ${r.slice(12,17)}`;

    //return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()} às ${d.toLocaleTimeString('pt-PT', {hour12: false}).slice(0,5)}`;
}

module.exports.ptFormat = ptFormat;