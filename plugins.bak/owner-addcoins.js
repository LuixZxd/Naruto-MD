import db from '../lib/database.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Si no pone la cantidad
    if (!text) throw `✳️ Ingresa la cantidad de dinero\n\n📌 Ejemplo: ${usedPrefix + command} 100`

    let who
    if (m.isGroup) {
        if (m.mentionedJid[0]) {
            who = m.mentionedJid[0]
        } else if (m.quoted) {
            who = m.quoted.sender
        } else {
            throw '⚠️ Menciona o responde a alguien'
        }
    } else {
        who = m.chat
    }

    let user = db.data.users[who]
    if (!user) throw '❌ Usuario no registrado en la base de datos'

    let dinero = parseInt(text)
    if (isNaN(dinero)) throw '⚠️ Solo números'

    user.dinero += dinero

    conn.reply(m.chat, `✅ Se agregó *${dinero}* monedas a @${who.split('@')[0]}\n💰 Total: *${user.dinero}* monedas`, m, { mentions: [who] })
}

handler.help = ['adddinero <cantidad> @tag']
handler.tags = ['owner']
handler.command = /^adddinero$/i
handler.rowner = true  // Solo dueño puede usar

export default handler