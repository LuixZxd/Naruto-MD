import db from '../lib/database.js';
import MessageType from '@whiskeysockets/baileys';

const emoji = '💸';  // Emoji para dinero
const emoji2 = '⚠️';
const moneda = '¥';  // Cambia si usas otro símbolo

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
    dmt = users[who].dinero;
  } else {
    if (!txt) return m.reply(`${emoji2} Por favor, ingresa la cantidad que deseas quitar.`);
    if (isNaN(txt)) return m.reply(`${emoji2} Solo números.`);
    dmt = parseInt(txt);
  }

  if (users[who].dinero < dmt) {
    return m.reply(`${emoji2} El usuario no tiene suficiente dinero para quitar. Tiene ${users[who].dinero} ${moneda}.`);
  }

  users[who].dinero -= dmt;

  await m.reply(`${emoji} *Quitado:*\n» ${dmt} ${moneda}\n@${who.split('@')[0]}, te han quitado ${dmt} ${moneda}`, null, { mentions: [who] });
};

handler.help = ['quitardinero *<@user>*', 'quitardinero all'];
handler.tags = ['owner'];
handler.command = ['quitardinero', 'removedinero', 'removedinero']; 
handler.rowner = true;

export default handler;