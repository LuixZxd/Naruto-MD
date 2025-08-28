const precios = {
  pocion: 20,
  comida: 15,
  revivir: 50
}

let handler = async (m, { conn, args }) => {
  let who = m.sender
  if (!(who in global.db.data.users)) return m.reply('😢 No tienes perfil. Usa *.atrapar* primero.')

  let user = global.db.data.users[who]

  // Inicializar campos en caso de que no existan
  if (typeof user.dinero !== 'number') user.dinero = 0
  if (typeof user.pocion !== 'number') user.pocion = 0
  if (typeof user.comida !== 'number') user.comida = 0
  if (typeof user.revivir !== 'number') user.revivir = 0

  if (!args[0]) return m.reply('❓ ¿Qué quieres comprar? Usa *.tienda* para ver opciones.')

  const item = args[0].toLowerCase()

  if (!precios[item]) return m.reply('❌ Ese objeto no existe. Usa *.tienda* para ver opciones.')

  // Validar cantidad para evitar NaN y valores inválidos
  let cantidad = 1
  if (args[1]) {
    cantidad = parseInt(args[1])
    if (isNaN(cantidad) || cantidad < 1) cantidad = 1
  }

  const costo = precios[item] * cantidad

  if (user.dinero < costo) {
    return m.reply(`💸 No tienes suficientes monedas.\nTienes: ${user.dinero} – Necesitas: ${costo}`)
  }

  user.dinero -= costo
  user[item] += cantidad

  return m.reply(`✅ Compraste *${cantidad} ${item}* por 💰 ${costo} monedas.\nMonedas restantes: ${user.dinero}`)
}

handler.help = ['comprar <item> <cantidad>']
handler.tags = ['juegos']
handler.command = ['comprar']
handler.register = true

export default handler