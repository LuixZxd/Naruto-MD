import { createHash } from 'crypto';
import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
  if (!(m.chat in global.db.data.chats)) {
    return conn.reply(m.chat, '⚠️ Este chat no está registrado.', m);
  }

  const chat = global.db.data.chats[m.chat];
  const botSettings = global.db.data.settings[conn.user.jid] || {};
  const feature = command.toLowerCase();

  // Validar argumentos para activar o desactivar
  let isEnable;
  if (['on', 'enable'].includes(args[0]?.toLowerCase())) {
    isEnable = true;
  } else if (['off', 'disable'].includes(args[0]?.toLowerCase())) {
    isEnable = false;
  } else {
    const estado = chat[feature] ? '🟢 ACTIVADO' : '🔴 DESACTIVADO';
    return conn.reply(m.chat,
      `🧩 *ZYPRA CONFIGURADOR*\n━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎮 Puedes controlar la función: *${feature}*\n\n` +
      `⚙️ Usa:\n` +
      `• *${usedPrefix}${feature} on* – Activar\n` +
      `• *${usedPrefix}${feature} off* – Desactivar\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎯 Estado actual: ${estado}\n━━━━━━━━━━━━━━━━━━━━━━`, m);
  }

  // Validar permisos para cada función
  const requireAdminInGroup = [
    'welcome', 'bv', 'bienvenida',
    'reaction', 'reaccion', 'emojis',
    'nsfw', 'nsfwhot', 'nsfwhorny',
    'detect', 'avisos',
    'detect2', 'eventos'
  ];

  const requireGroupAdminOnly = [
    'antisubbots', 'antisub', 'antisubot', 'antibot2',
    'modoadmin', 'soloadmin',
    'antilink', 'antilink2'
  ];

  // Para funciones que afectan todo el bot
  const globalFeatures = ['jadibotmd', 'modejadibot'];

  // Validación de permisos
  if (m.isGroup) {
    if (requireAdminInGroup.includes(feature) && !isAdmin && !isOwner) {
      return conn.reply(m.chat, '🛡️ Solo administradores o propietarios pueden usar esta función en grupos.', m);
    }
    if (requireGroupAdminOnly.includes(feature) && !isAdmin && !isOwner) {
      return conn.reply(m.chat, '🛡️ Solo administradores o propietarios pueden usar esta función en grupos.', m);
    }
  } else {
    if ((requireAdminInGroup.includes(feature) || requireGroupAdminOnly.includes(feature)) && !isOwner) {
      return conn.reply(m.chat, '🛡️ Solo el propietario puede usar esta función en chats privados.', m);
    }
  }

  // Aplicar configuración según la función
  if (globalFeatures.includes(feature)) {
    if (!isOwner) {
      return conn.reply(m.chat, '🛡️ Solo el propietario puede modificar esta función global.', m);
    }
    botSettings[feature] = isEnable;
  } else {
    chat[feature] = isEnable;
  }

  const scope = globalFeatures.includes(feature) ? '⚙️ Aplicado globalmente en el bot' : '👥 Aplicado solo en este grupo';

  return conn.reply(m.chat,
    `╭━━🎉 *ZYPRA CONFIGURACIÓN COMPLETA* ━━╮
┃
┃ 🧩 Función: *${feature}*
┃ 🎛 Estado: *${isEnable ? '✅ ACTIVADO' : '❌ DESACTIVADO'}*
┃ ${scope}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
✨ ¡Sigue configurando tu aventura ZYPRA!`, m);
};

handler.help = [
  'welcome', 'bv', 'bienvenida',
  'antisubbots', 'antisub', 'antisubot', 'antibot2',
  'modoadmin', 'soloadmin',
  'reaction', 'reaccion', 'emojis',
  'nsfw', 'nsfwhot', 'nsfwhorny',
  'jadibotmd', 'modejadibot',
  'detect', 'avisos',
  'detect2', 'eventos',
  'antilink', 'antilink2'
];
handler.tags = ['group', 'settings'];
handler.command = handler.help;
handler.register = true;

export default handler;