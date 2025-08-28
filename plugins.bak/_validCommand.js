import fetch from 'node-fetch'

export async function before(m, { conn }) {
  try {
    if (!m.text || !global.prefix || !global.prefix.test(m.text)) return;

    const Buffer = global.Buffer || ((...args) => new Uint8Array(...args));

    // 📌 Datos de tu perfil
    const numeroBot = '50765836410'
    const nombreBot = '𝐙𝐘𝐏𝐇𝐑𝐀'
    const fotoBotURL = 'https://files.catbox.moe/j6ci3o.jpg' // tu foto o avatar
    const fotoBuffer = await fetch(fotoBotURL).then(res => res.buffer())

    const channelRD = global.channelRD || {
      id: '120363402648953286@newsletter',
      name: 'Canal Oficial Zypḥra'
    }

    if (!Array.prototype.getRandom) {
      Array.prototype.getRandom = function () {
        return this[Math.floor(Math.random() * this.length)];
      };
    }

    // 📌 Contacto principal con tu número
    global.fkontak = {
      key: {
        participant: `0@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: `status@broadcast` } : {})
      },
      message: {
        contactMessage: {
          displayName: nombreBot,
          vcard: `BEGIN:VCARD
VERSION:3.0
N:XL;${nombreBot},;;;
FN:${nombreBot}
item1.TEL;waid=${numeroBot}:${numeroBot}
item1.X-ABLabel:Owner Bot
item2.TEL;waid=${m.sender ? m.sender.split('@')[0] : '0'}:${m.sender ? m.sender.split('@')[0] : '0'}
item2.X-ABLabel:Usuario
END:VCARD`,
          jpegThumbnail: fotoBuffer,
          thumbnail: fotoBuffer,
          sendEphemeral: true
        }
      }
    };

    // 📌 Mensaje fake para citar
    global.fakeMetaMsg = {
      key: {
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'F4KE-MSG-LUIS',
        participant: '0@s.whatsapp.net'
      },
      message: {
        contactMessage: {
          displayName: nombreBot,
          vcard: `BEGIN:VCARD
VERSION:3.0
FN:${nombreBot}
ORG:${nombreBot}
TEL;type=CELL;type=VOICE;waid=${numeroBot}:+${numeroBot}
END:VCARD`,
          jpegThumbnail: fotoBuffer,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true
          }
        }
      }
    };

    // 📌 Configuración del reply tipo canal
    global.rcanal = {
      quoted: global.fakeMetaMsg,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: nombreBot,
          body: '⚡◌*̥₊ Zʏᴘʜʀᴀ-Mᴅ ◌❐💠༉',
          mediaUrl: null,
          description: null,
          previewType: "PHOTO",
          thumbnailUrl: fotoBotURL,
          sourceUrl: `https://wa.me/${numeroBot}`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    };

    const usedPrefix = global.prefix.exec(m.text)[0];
    const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
    if (!command) return;

    const validCommand = (command, plugins) => {
      if (!plugins) return false;
      return Object.values(plugins).some(plugin =>
        plugin && plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)
      );
    };

    if (command === "bot") return;

    if (validCommand(command, global.plugins)) {
      const chat = global.db.data.chats[m.chat];
      const user = global.db.data.users[m.sender];

      if (chat && chat.isBanned) {
        const adReplyMsgBanned = {
          text: `《✦》El bot *${nombreBot}* está desactivado en este grupo.\n\n> ✦ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              title: nombreBot,
              body: '⚡◌*̥₊ Zʏᴘʜʀᴀ-Mᴅ ◌❐💠༉',
              thumbnailUrl: fotoBotURL,
              sourceUrl: `https://wa.me/${numeroBot}`,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        };

        try {
          await conn.sendMessage(m.chat, adReplyMsgBanned, { quoted: global.fakeMetaMsg });
        } catch {
          await m.reply(`《✦》El bot *${nombreBot}* está desactivado en este grupo.\n\n> ✦ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`);
        }
        return;
      }

      if (user) user.commands = (user.commands || 0) + 1;
    } else {
      const comando = m.text.trim().split(' ')[0];
      const adReplyMsgInvalidCommand = {
        text: `《✦》El comando *${comando}* no existe.\nPara ver la lista de comandos usa:\n» *${usedPrefix}help*`,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: nombreBot,
            body: '⚡◌*̥₊ Zʏᴘʜʀᴀ-Mᴅ ◌❐💠༉',
            thumbnailUrl: fotoBotURL,
            sourceUrl: `https://wa.me/${numeroBot}`,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      try {
        await conn.sendMessage(m.chat, adReplyMsgInvalidCommand, { quoted: global.fakeMetaMsg });
      } catch {
        await m.reply(`《✦》El comando *${comando}* no existe.\nPara ver la lista de comandos usa:\n» *${usedPrefix}help*`);
      }
    }
  } catch (error) {
    console.error(`Error en _validCommand.js: ${error}`);
  }
}