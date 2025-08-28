import db from '../lib/database.js';
import MessageType from '@whiskeysockets/baileys';

const pajak = 0; // Si quieres usar algún porcentaje de impuesto a la XP

// Funciones de nivel y rango (deberías importarlas si están en otro archivo)
function calcularNivel(exp) {
  return Math.floor(Math.sqrt(exp) / 10);
}

const rangos = [
  { nivel: 0, rango: '⭑ Bronce V ⭑' },
  { nivel: 2, rango: '⭑ Bronce IV ⭑' },
  { nivel: 4, rango: '⭑ Bronce III ⭑' },
  { nivel: 6, rango: '⭑ Bronce II ⭑' },
  { nivel: 8, rango: '⭑ Bronce I ⭑' },
  { nivel: 10, rango: '⭑ Plata V ⭑' },
  { nivel: 12, rango: '⭑ Plata IV ⭑' },
  { nivel: 14, rango: '⭑ Plata III ⭑' },
  { nivel: 16, rango: '⭑ Plata II ⭑' },
  { nivel: 18, rango: '⭑ Plata I ⭑' },
  { nivel: 20, rango: '⭑ Oro V ⭑' },
  { nivel: 25, rango: '⭑ Oro IV ⭑' },
  { nivel: 30, rango: '⭑ Oro III ⭑' },
  { nivel: 35, rango: '⭑ Oro II ⭑' },
  { nivel: 40, rango: '⭑ Oro I ⭑' },
  { nivel: 45, rango: '⭑ Diamante ⭑' },
  { nivel: 50, rango: '⭑ Maestro ⭑' },
  { nivel: 60, rango: '⭑ Gran Maestro ⭑' },
  { nivel: 70, rango: '⭑ Leyenda ⭑' }
];

function obtenerRango(nivel) {
  let rangoActual = rangos[0].rango;
  for (let i = 0; i < rangos.length; i++) {
    if (nivel >= rangos[i].nivel) rangoActual = rangos[i].rango;
    else break;
  }
  return rangoActual;
}

let handler = async (m, { conn, text }) => {
  let who;
  if (m.isGroup) {
    if (m.mentionedJid.length > 0) {
      who = m.mentionedJid[0];
    } else {
      const quoted = m.quoted ? m.quoted.sender : null;
      who = quoted ? quoted : m.sender;
    }
  } else {
    who = m.sender;
  }

  if (!who) return m.reply('❌ Por favor, menciona al usuario o cita un mensaje.');

  const txt = text ? text.replace('@' + who.split('@')[0], '').trim() : '';
  if (!txt) return m.reply('❌ Ingresa la cantidad de experiencia (XP) que deseas añadir.');
  if (isNaN(txt)) return m.reply('❌ Solo se permiten números.');

  const xp = parseInt(txt);
  if (xp < 1) return m.reply('❌ El mínimo de experiencia (XP) para añadir es *1*.');

  const users = global.db.data.users;
  if (!users[who]) {
    // Si no existe el usuario en la db, crea uno básico para evitar errores
    users[who] = {
      name: await conn.getName(who),
      dinero: 0,
      exp: 0,
      diamond: 0,
      moneda: '¥',
      level: 0,
      registered: false,
      rango: '⭑ Bronce V ⭑'
    };
  }

  users[who].exp += xp;

  // Recalcular nivel y rango
  const nivelActual = calcularNivel(users[who].exp);
  users[who].level = nivelActual;
  users[who].rango = obtenerRango(nivelActual);

  await m.reply(`✨ XP Añadido: *${xp}*\n@${who.split('@')[0]}, ahora tienes:\n⭐ Nivel: *${nivelActual}*\n⚔️ Rango: ${users[who].rango}`, null, { mentions: [who] });
};

handler.command = ['añadirxp', 'addexp'];
handler.rowner = true;

export default handler;