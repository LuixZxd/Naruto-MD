import axios from 'axios'
const { generateWAMessageContent } = (await import('@whiskeysockets/baileys')).default

let handler = async (m, { conn }) => {
  const owner = {
    name: '🅉🅈🄿🄷🅁🄰-🄱🄾🅃 💠',
    desc: '𝙲𝚊𝚗𝚊𝚕 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 : *No disponible*\n𝐂𝐫𝐞𝐚𝐝𝐨𝐫: *Luissinho7*',
  }

  await conn.sendMessage(m.chat, {
    text: `✨ *${owner.name}*\n${owner.desc}\n\n> Gracias por usar *Zyphra-BOT*`,
    footer: '🌸 Zyphra-BOT 🌸',
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: '𝐂𝐫𝐞𝐚𝐝𝐨𝐫 : 𝓛𝓼𝓼𝓲𝓷𝓱𝓸7',
        body: '⚡◌*̥₊ Zʏᴘʜʀᴀ-Mᴅ ◌❐💠༉',
        thumbnailUrl: 'https://files.cloudkuimages.guru/images/HUmjMRt8.jpg', // La miniatura que quieres mostrar
        sourceUrl: 'https://github.com/El-brayan502/RoxyBot-MD/',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'donar']

export default handler