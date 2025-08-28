import db from '../lib/database.js';
import MessageType from '@whiskeysockets/baileys';

const emoji = '✨';  // Define aquí tu emoji personalizado
const emoji2 = '⚠️';

let handler = async (m, { conn, text }) => {
    let who;
    if (m.isGroup) {
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            who = m.mentionedJid[0];
        } else {
            const quoted = m.quoted ? m.quoted.sender : null;
            who = quoted ? quoted : m.sender;
        }
    } else {
        who = m.sender;
    }

    if (!who) return m.reply(`${emoji} Por favor, menciona al usuario o cita un mensaje.`);

    let txt = text ? text.replace('@' + who.split('@')[0], '').trim() : '';
    let dmt;

    let users = global.db.data.users;
    if (!users[who]) return m.reply(`${emoji2} Usuario no encontrado en la base de datos.`);

    if (txt.toLowerCase() === 'all') {
        dmt = users[who].exp;
    } else {
        if (!txt) return m.reply(`${emoji2} Por favor, ingresa la cantidad de experiencia (XP) que deseas quitar.`);
        if (isNaN(txt)) return m.reply(`${emoji2} Solo números son permitidos.`);
        
        dmt = parseInt(txt);
    }

    if (users[who].exp < dmt) {
        return m.reply(`${emoji2} El usuario no tiene suficiente XP para quitar. Tiene ${users[who].exp} XP.`);
    }

    users[who].exp -= dmt;

    // Opcional: recalcular nivel y rango si tienes esas funciones, aquí ejemplo:
    if (typeof calcularNivel === 'function' && typeof obtenerRango === 'function') {
        users[who].level = calcularNivel(users[who].exp);
        users[who].rango = obtenerRango(users[who].level);
    }

    await m.reply(`✨ *Quitado:*\n» ${dmt} XP\n@${who.split('@')[0]}, te han quitado ${dmt} XP`, null, { mentions: [who] });
};

handler.help = ['quitarxp *<@user>*'];
handler.tags = ['owner'];
handler.command = ['quitarxp', 'removexp']; 
handler.rowner = true;

export default handler;