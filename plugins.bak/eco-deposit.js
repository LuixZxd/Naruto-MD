import db from '../lib/database.js'

let handler = async (m, { args }) => {
  let user = global.db.data.users[m.sender]
  const moneda = global.moneda || '¥'

  // Inicializar por si no existen
  if (typeof user.dinero !== 'number') user.dinero = 0
  if (typeof user.banco !== 'number') user.banco = 0

  if (!args[0]) return m.reply(`✧ Ingresa la cantidad de *${moneda}* que deseas depositar.`)

  if (args[0].toLowerCase() === 'all') {
    let count = parseInt(user.dinero)
    if (!count || count < 1) return m.reply(`❀ No tienes nada para depositar.`)
    user.dinero -= count
    user.banco += count
    await m.reply(`✿ Depositaste *${count} ${moneda}* en el banco. Ya no te lo pueden robar alv.`)
    return
  }

  if (isNaN(args[0])) return m.reply(`✦ Ingresa una cantidad válida.\nEjemplo: *#d 5000*`)

  let count = parseInt(args[0])
  if (!user.dinero || user.dinero < 1) return m.reply(`✧ No tienes nada en tu cartera.`)
  if (user.dinero < count) return m.reply(`❀ Solo tienes *${user.dinero} ${moneda}* en la cartera.`)

  user.dinero -= count
  user.banco += count

  await m.reply(`✿ Depositaste *${count} ${moneda}* en el banco.`)
}

handler.help = ['depositar']
handler.tags = ['eco']
handler.command = ['deposit', 'depositar', 'dep', 'aguardar']
handler.group = false
handler.register = true

export default handler