import db from '../lib/database.js'

let handler = async (m, { conn, usedPrefix }) => {
  let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  if (who == conn.user.jid) return m.react('✖️')
  if (!(who in global.db.data.users)) return m.reply(`❐✐ El usuario no se encuentra en mi base de datos.`)

  let user = global.db.data.users[who]

  // Inicializar campos en caso de que no existan
  if (typeof user.dinero !== 'number') user.dinero = 0
  if (typeof user.banco !== 'number') user.banco = 0

  let total = user.dinero + user.banco
  let name = await conn.getName(who)
  const moneda = global.moneda || '¥'

  const texto = 
`❐ *ECONOMÍA DEL USUARIO* ❀

✎ Usuario: *${name}*
☁︎ Dinero en mano: *${user.dinero.toLocaleString()} ${moneda}*
☁︎ Dinero en banco: *${user.banco.toLocaleString()} ${moneda}*
☄︎ Total acumulado: *${total.toLocaleString()} ${moneda}*

✐ Usa: *${usedPrefix}deposit* para proteger tu dinero.`

  await conn.reply(m.chat, texto, m, rcanal)
}

handler.help = ['bal']
handler.tags = ['eco']
handler.command = ['bal', 'balance', 'bank']
handler.register = true
handler.group = false 

export default handler