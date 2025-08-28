import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  // Solo para grupos y mensajes de tipo stub (entrada/salida)
  if (!m.isGroup || !m.messageStubType) return true;

  // Valida stub parameters
  const stubParams = m.messageStubParameters || [];
  if (!Array.isArray(stubParams) || stubParams.length === 0) return true;

  // Datos de usuario que entra o sale
  const userJid = stubParams[0];
  if (!userJid) return true;

  const username = userJid.split('@')[0];
  const mention = '@' + username;

  // Número de miembros seguro
  let memberCount = groupMetadata.participants?.length || participants.length || 0;
  if (m.messageStubType === 27) memberCount++; // usuario entró
  if (m.messageStubType === 28 || m.messageStubType === 32) memberCount = Math.max(0, memberCount - 1); // usuario salió

  // Obtiene avatar o fallback
  let avatar;
  try {
    avatar = await conn.profilePictureUrl(userJid, 'image');
  } catch {
    avatar = 'https://files.catbox.moe/emwtzj.png'; // fallback
  }

  // Construye URLs para API de imágenes
  const guildName = encodeURIComponent(groupMetadata.subject);
  const apiBase = "https://api.siputzx.my.id/api/canvas";
  const background = encodeURIComponent('https://files.catbox.moe/w1r8jh.jpeg');
  const welcomeApiUrl = `${apiBase}/welcomev2?username=${username}&guildName=${guildName}&memberCount=${memberCount}&avatar=${encodeURIComponent(avatar)}&background=${background}`;
  const goodbyeApiUrl = `${apiBase}/goodbyev2?username=${username}&guildName=${guildName}&memberCount=${memberCount}&avatar=${encodeURIComponent(avatar)}&background=${background}`;

  async function fetchImage(url, fallbackUrl) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al descargar imagen');
      return await res.buffer();
    } catch {
      // Intenta fallback si falla la API
      const fallbackRes = await fetch(fallbackUrl);
      return await fallbackRes.buffer();
    }
  }

  // Prepara base de datos de chat
  let chat = global.db.data.chats[m.chat] || {};
  if (typeof chat.welcome === 'undefined') chat.welcome = true;

  // Mensajes de texto para bienvenida y despedida
  const txtWelcome = '👋 ¡Nuevo miembro!';
  const txtGoodbye = '👋 Hasta luego!';

  const bienvenida = `❀ *Bienvenido* a ${groupMetadata.subject}\n✰ ${mention}\n✦ Ahora somos ${memberCount} miembros.\n• Disfruta tu estadía en el grupo!\n> Usa *#help* para ver comandos.`;
  const bye = `❀ *Adiós* de ${groupMetadata.subject}\n✰ ${mention}\n✦ Ahora somos ${memberCount} miembros.\n• ¡Te esperamos pronto!`;

  // Variables globales que puedes definir en tu entorno
  const dev = global.dev || '';
  const redes = global.redes || '';
  const fkontak = global.fkontak || {};

  // Enviar mensajes si está activada la bienvenida en el chat
  if (chat.welcome) {
    if (m.messageStubType === 27) { // Entró usuario
      const imgBuffer = await fetchImage(welcomeApiUrl, avatar);
      try {
        // Intenta enviar con método custom si existe
        await conn.sendMini?.(m.chat, txtWelcome, dev, bienvenida, imgBuffer, imgBuffer, redes, fkontak);
      } catch {
        // Fallback básico
        await conn.sendMessage(m.chat, { image: imgBuffer, caption: bienvenida, mentions: [userJid] }, { quoted: m });
      }
    } else if (m.messageStubType === 28 || m.messageStubType === 32) { // Salió usuario
      const imgBuffer = await fetchImage(goodbyeApiUrl, avatar);
      try {
        await conn.sendMini?.(m.chat, txtGoodbye, dev, bye, imgBuffer, imgBuffer, redes, fkontak);
      } catch {
        await conn.sendMessage(m.chat, { image: imgBuffer, caption: bye, mentions: [userJid] }, { quoted: m });
      }
    }
  }

  return true; // continuar con el flujo normal
}