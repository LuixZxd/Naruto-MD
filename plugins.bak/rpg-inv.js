let handlerInventario = async (m, { conn }) => {
  let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  if (!(who in global.db.data.users)) return m.reply('❐✐ El usuario no se encuentra en mi base de datos.')

  let user = global.db.data.users[who]

  // Inicializar campos en caso de que no existan
  if (typeof user.dinero !== 'number') user.dinero = 0
  if (typeof user.pocion !== 'number') user.pocion = 0
  if (typeof user.comida !== 'number') user.comida = 0
  if (typeof user.revivir !== 'number') user.revivir = 0

  const objetos = ['pocion', 'comida', 'revivir']

  let texto = `💼 *Inventario de ${await conn.getName(who)}*\n\n`

  let tieneObjetos = false
  objetos.forEach(obj => {
    if (user[obj] && user[obj] > 0) {
      texto += `• ${obj.charAt(0).toUpperCase() + obj.slice(1)}: ${user[obj]}\n`
      tieneObjetos = true
    }
  })

  if (!tieneObjetos) texto += '_No tiene objetos en su inventario._\n'

  texto += `\n💰 *Monedas:* ${user.dinero.toLocaleString()}`

  m.reply(texto)
}

handlerInventario.help = ['inventario']
handlerInventario.tags = ['juegos']
handlerInventario.command = ['inventario']
handlerInventario.register = true

export default handlerInventario