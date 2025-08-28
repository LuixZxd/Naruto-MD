let handler = async (m, { conn, usedPrefix, command, args }) => {
  // Verificar si el chat está registrado
  if (!(m.chat in global.db.data.chats)) {
    return conn.reply(m.chat, `Este chat no está registrado.`, m);
  }

  let chat = global.db.data.chats[m.chat];

  if (command === 'bot') {
    if (args.length === 0) {
      const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado';
      const info = `
*Puedes activar o desactivar el bot en este chat usando los siguientes comandos:*

${usedPrefix}bot on — Activar el bot  
${usedPrefix}bot off — Desactivar el bot

Estado actual: ${estado}
      `.trim();
      return conn.reply(m.chat, info, m);
    }

    let opcion = args[0].toLowerCase();

    if (opcion === 'off') {
      if (chat.isBanned) {
        return conn.reply(m.chat, `El bot ya está desactivado en este chat.`, m);
      }
      chat.isBanned = true;
      return conn.reply(m.chat, `Bot desactivado correctamente.`, m);

    } else if (opcion === 'on') {
      if (!chat.isBanned) {
        return conn.reply(m.chat, `El bot ya está activo en este chat.`, m);
      }
      chat.isBanned = false;
      return conn.reply(m.chat, `Bot activado correctamente.`, m);

    } else {
      return conn.reply(m.chat, `Opción no válida. Usa:\n${usedPrefix}bot on\n${usedPrefix}bot off`, m);
    }
  }
};

handler.help = ['bot'];
handler.tags = ['grupo'];
handler.command = ['bot'];
handler.admin = true;

export default handler;