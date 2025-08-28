import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import { createHash } from 'crypto';

// Funciones para nivel y rango (importante que estén definidas)
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

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  if (!user) {
    user = global.db.data.users[m.sender] = {
      name: await conn.getName(m.sender),
      dinero: 0,
      exp: 0,
      diamond: 0,
      moneda: '¥',
      level: 0,
      registered: false,
      rango: '⭑ Bronce V ⭑'
    };
  }

  if (!user.registered) {
    const nombre = user.name || await conn.getName(m.sender);
    return m.reply(`🔰 No estás registrado aún.\n➤ Usa: *.reg ${nombre}.18*`);
  }

  // Calcular nivel y rango
  const nivelActual = calcularNivel(user.exp || 0);
  user.level = nivelActual;
  user.rango = obtenerRango(nivelActual);

  const nombre = user.name || await conn.getName(m.sender);
  const avatar = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg');
  const backgroundURL = encodeURIComponent('https://i.ibb.co/2jMjYXK/IMG-20250103-WA0469.jpg');
  const avatarURL = encodeURIComponent(avatar);

  const imageAPI = `https://api.siputzx.my.id/api/canvas/profile?backgroundURL=${backgroundURL}&avatarURL=${avatarURL}&rankName=${encodeURIComponent(user.rango)}&rankId=0&exp=${user.exp}&requireExp=0&level=${nivelActual}&name=${encodeURIComponent(nombre)}`;

  const textoPerfil = `
✿ Perfil de usuario *${nombre}* ✿

${user.moneda || '¥'} : *${(user.dinero || 0).toLocaleString()}*
✨ *Exp:* *${(user.exp || 0).toLocaleString()} XP*
⭐ *Nivel:* *${nivelActual}*
💎 *Diamantes:* *${(user.diamond || 0).toLocaleString()}*
⚔️ *Rango:* ${user.rango}
`.trim();

  try {
    await conn.sendFile(m.chat, imageAPI, 'perfil.jpg', textoPerfil, m);
  } catch (e) {
    await conn.reply(m.chat, '❌ Error al generar el perfil.', m);
    console.error(e);
  }
};

handler.help = ['perfil'];
handler.tags = ['eco'];
handler.command = ['perfil', 'yo', 'miperfil'];
handler.register = true;

export default handler;