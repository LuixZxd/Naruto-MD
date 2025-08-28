function getRandomRatio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  if (!user) return m.reply('Usuario no encontrado.')

  let args = m.text.trim().split` `
  if (args.length < 2) return m.reply('Usa: !cambiar <cantidad>\n\n*Nota:* Los diamantes son para comandos +18.')

  let cantidad = parseInt(args[1])
  if (isNaN(cantidad) || cantidad <= 0) return m.reply('Ingresa una cantidad válida.')

  // Ratio de cambio aleatorio entre 500 y 800
  const ratio = getRandomRatio(500, 800)

  let diamantesACambiar = Math.floor(cantidad / ratio)
  if (diamantesACambiar < 1) return m.reply(`Necesitas al menos ${ratio} monedas para obtener 1 diamante.\nLos diamantes sirven para comandos +18.`)

  if (user.dinero < cantidad) return m.reply('No tienes suficiente dinero para hacer este intercambio.')

  user.dinero -= cantidad
  user.diamond = (user.diamond || 0) + diamantesACambiar

  m.reply(`Has cambiado ${cantidad} monedas por ${diamantesACambiar} diamante(s) (ratio actual: ${ratio} monedas por diamante).\nAhora tienes ${user.dinero} monedas y ${user.diamond} diamantes.\nRecuerda que los diamantes son para comandos +18.`)
}

handler.command = /^cambiar$/i

export default handler