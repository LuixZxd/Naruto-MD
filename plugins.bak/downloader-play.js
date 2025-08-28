import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `*✨️ QUE MÚSICA QUIERES DESCARGAR*.`, m)
    }

    // ===== Búsqueda de video =====
    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]  
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    } 
    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2  
    if (!ytplay2 || ytplay2.length == 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    // ===== Info del video =====
    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'
    const infoMessage = `「✦」Descargando *<${title || 'Desconocido'}>*\n\n> 📺 Canal ✦ *${canal}*\n> 👀 Vistas ✦ *${vistas}*\n> ⏳ Duración ✦ *${timestamp || 'Desconocido'}*\n> 📆 Publicado ✦ *${ago || 'Desconocido'}*\n> 🖇️ Link ✦ ${url}`

    // ===== Miniatura random para la cita =====
    const textRandom = [
    "𝗣𝗟𝗔𝗬 ✦ 𝗔𝗨𝗗𝗜𝗢 ♫"
    ]
    const imgRandom = [
      "https://files.catbox.moe/qzp733.jpg"
    ]

    const msjRandom = textRandom[Math.floor(Math.random() * textRandom.length)]
    const imgSelected = imgRandom[Math.floor(Math.random() * imgRandom.length)]
    const thumbMini = Buffer.from((await axios.get(imgSelected, { responseType: 'arraybuffer' })).data)

    const izumi = {
      key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
      message: {
        locationMessage: {
          name: msjRandom,
          jpegThumbnail: thumbMini,
          vcard:
            "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\n" +
            "item1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\n" +
            "X-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
        }
      },
      participant: "0@s.whatsapp.net"
    }

    // ===== Enviar mensaje principal con cita tipo ubicación =====
    const thumb = (await conn.getFile(thumbnail)).data
    await conn.sendMessage(m.chat, { 
      text: infoMessage,
      contextInfo: {
        externalAdReply: {
          title: 'Zyphra-BOT',
          body: canal,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        }
      }
    }, { quoted: izumi })    

    // ===== Descarga según comando =====
    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
        const result = api.result?.download?.url    
        if (!result) throw new Error('✦ El enlace de audio no se generó correctamente.')
        await conn.sendMessage(m.chat, { audio: { url: result }, fileName: `${api.result.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '✦ No se pudo enviar el audio. Intenta nuevamente.', m)
      }
    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
        const json = await response.json()
        await conn.sendFile(m.chat, json.data.url, json.title + '.mp4', title, m)
      } catch (e) {
        return conn.reply(m.chat, '✦ No se pudo enviar el video. Intenta nuevamente.', m)
      }
    }

  } catch (error) {
    return m.reply(`✦ Ocurrió un error: ${error}`)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']

export default handler

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  else if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  else if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}