import fs from 'fs'

const usuariosPath = './src/database/usuarios.json'

function cargarJSON(ruta, valorDefault = {}) {
  try {
    if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, JSON.stringify(valorDefault, null, 2))
    const data = fs.readFileSync(ruta, 'utf-8').trim()
    return data ? JSON.parse(data) : valorDefault
  } catch (e) {
    return valorDefault
  }
}

function guardarJSON(ruta, data) {
  fs.writeFileSync(ruta, JSON.stringify(data, null, 2))
}

let handler = async (m, { conn }) => {
  const userId = m.sender.replace(/[^0-9]/g, '')
  const usuarios = cargarJSON(usuariosPath)
  const user = usuarios[userId]

  if (!user || !user.pokemon) {
    return m.reply('😢 No tienes un Pokémon para curar. Usa *.atrapar* primero.')
  }

  if (!user.pociones || user.pociones <= 0) {
    return m.reply('🧴 No tienes pociones para curar. Compra una en la tienda con *.tienda*')
  }

  const cantidadCurada = Math.ceil(user.pokemon.vidaMax * 0.1)
  user.pokemon.vida = Math.min(user.pokemon.vida + cantidadCurada, user.pokemon.vidaMax)
  user.pociones -= 1

  guardarJSON(usuariosPath, usuarios)

  return m.reply(`🧑‍⚕️ Usaste 1 poción.\n❤️ *${user.pokemon.nombre}* recuperó *${cantidadCurada}* de vida.\n🩹 Vida actual: ${user.pokemon.vida}/${user.pokemon.vidaMax}\n🧪 Pociones restantes: ${user.pociones}`)
}

handler.help = ['curar']
handler.tags = ['juegos']
handler.command = ['curar']
handler.register = true

export default handler