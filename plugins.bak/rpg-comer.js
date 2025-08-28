import fs from 'fs/promises'

const usuariosPath = './src/database/usuarios.json'

async function cargarUsuarios() {
  try {
    const data = await fs.readFile(usuariosPath, 'utf-8')
    return JSON.parse(data || '{}')
  } catch (e) {
    return {}
  }
}

async function guardarUsuarios(usuarios) {
  await fs.writeFile(usuariosPath, JSON.stringify(usuarios, null, 2))
}

let handler = async (m) => {
  const userId = m.sender.replace(/[^0-9]/g, '')
  const usuarios = await cargarUsuarios()
  const user = usuarios[userId]

  if (!user || !user.pokemon) {
    return m.reply('😢 No tienes un Pokémon para alimentar. Usa *.atrapar* primero.')
  }

  if (user.pokemon.comida <= 0) {
    return m.reply('🍎 No tienes comida para alimentar a tu Pokémon. Compra en la tienda con *.comprar comida*')
  }

  const pokemon = user.pokemon
  const cantidadCurada = Math.ceil(pokemon.vidaMax * 0.2) // Cura 20% vida max
  pokemon.vida = Math.min(pokemon.vida + cantidadCurada, pokemon.vidaMax)
  pokemon.comida -= 1

  // Guardar cambios en el archivo
  await guardarUsuarios(usuarios)

  return m.reply(`🍎 Alimentaste a *${pokemon.nombre}*.\n❤️ Recuperó *${cantidadCurada}* de vida.\n🩹 Vida actual: ${pokemon.vida}/${pokemon.vidaMax}\n🍎 Comida restante: ${pokemon.comida}`)
}

handler.help = ['comer']
handler.tags = ['juegos']
handler.command = ['comer']
handler.register = true

export default handler