const handler = async (m, { conn, participants, isAdmin, isBotAdmin, command }) => {
  if (!m.isGroup) return m.reply('❗ Este comando solo se puede usar en grupos.')
  if (!isAdmin) return m.reply('🛡️ Solo los administradores pueden usar este comando.')

  const countryFlags = {
  "1": "🇺🇸",         // USA/Canadá y territorios NANP
  "7": "🇷🇺",         // Rusia y Kazajistán
  "20": "🇪🇬",        // Egipto
  "211": "🇸🇸",       // Sudán del Sur
  "212": "🇲🇦",       // Marruecos
  "213": "🇩🇿",       // Argelia
  "216": "🇹🇳",       // Túnez
  "218": "🇱🇾",       // Libia
  "220": "🇬🇲",       // Gambia
  "221": "🇸🇳",       // Senegal
  "222": "🇲🇷",       // Mauritania
  "223": "🇲🇱",       // Malí
  "224": "🇬🇳",       // Guinea
  "225": "🇨🇮",       // Costa de Marfil
  "226": "🇧🇫",       // Burkina Faso
  "227": "🇳🇪",       // Níger
  "228": "🇹🇬",       // Togo
  "229": "🇧🇯",       // Benín
  "230": "🇲🇺",       // Mauricio
  "231": "🇱🇷",       // Liberia
  "232": "🇸🇱",       // Sierra Leona
  "233": "🇬🇭",       // Ghana
  "234": "🇳🇬",       // Nigeria
  "235": "🇹🇩",       // Chad
  "236": "🇨🇫",       // República Centroafricana
  "237": "🇨🇲",       // Camerún
  "238": "🇨🇻",       // Cabo Verde
  "239": "🇸🇹",       // Santo Tomé y Príncipe
  "240": "🇬🇶",       // Guinea Ecuatorial
  "241": "🇬🇦",       // Gabón
  "242": "🇨🇬",       // Congo
  "243": "🇨🇩",       // Congo (RD)
  "244": "🇦🇴",       // Angola
  "245": "🇬🇼",       // Guinea-Bisáu
  "246": "🇮🇴",       // Territorio Británico del Océano Índico
  "248": "🇸🇨",       // Seychelles
  "249": "🇸🇩",       // Sudán
  "250": "🇷🇼",       // Ruanda
  "251": "🇪🇹",       // Etiopía
  "252": "🇸🇴",       // Somalia
  "253": "🇩🇯",       // Yibuti
  "254": "🇰🇪",       // Kenia
  "255": "🇹🇿",       // Tanzania
  "256": "🇺🇬",       // Uganda
  "257": "🇧🇮",       // Burundi
  "258": "🇲🇿",       // Mozambique
  "260": "🇿🇲",       // Zambia
  "261": "🇲🇬",       // Madagascar
  "262": "🇷🇪",       // Reunión
  "263": "🇿🇼",       // Zimbabue
  "264": "🇳🇦",       // Namibia
  "265": "🇲🇼",       // Malawi
  "266": "🇱🇸",       // Lesoto
  "267": "🇧🇼",       // Botsuana
  "268": "🇸🇿",       // Suazilandia
  "269": "🇰🇲",       // Comoras
  "290": "🇸🇭",       // Santa Elena
  "291": "🇪🇷",       // Eritrea
  "297": "🇦🇼",       // Aruba
  "298": "🇫🇴",       // Islas Feroe
  "299": "🇬🇱",       // Groenlandia
  "30": "🇬🇷",        // Grecia
  "31": "🇳🇱",        // Países Bajos
  "32": "🇧🇪",        // Bélgica
  "33": "🇫🇷",        // Francia
  "34": "🇪🇸",        // España
  "350": "🇬🇮",       // Gibraltar
  "351": "🇵🇹",       // Portugal
  "352": "🇱🇺",       // Luxemburgo
  "353": "🇮🇪",       // Irlanda
  "354": "🇮🇸",       // Islandia
  "355": "🇦🇱",       // Albania
  "356": "🇲🇹",       // Malta
  "357": "🇨🇾",       // Chipre
  "358": "🇫🇮",       // Finlandia
  "359": "🇧🇬",       // Bulgaria
  "36": "🇭🇺",        // Hungría
  "370": "🇱🇹",       // Lituania
  "371": "🇱🇻",       // Letonia
  "372": "🇪🇪",       // Estonia
  "373": "🇲🇩",       // Moldavia
  "374": "🇦🇲",       // Armenia
  "375": "🇧🇾",       // Bielorrusia
  "376": "🇦🇩",       // Andorra
  "377": "🇲🇨",       // Mónaco
  "378": "🇸🇲",       // San Marino
  "379": "🇻🇦",       // Ciudad del Vaticano
  "380": "🇺🇦",       // Ucrania
  "381": "🇷🇸",       // Serbia
  "382": "🇲🇪",       // Montenegro
  "383": "🇽🇰",       // Kosovo
  "385": "🇭🇷",       // Croacia
  "386": "🇸🇮",       // Eslovenia
  "387": "🇧🇦",       // Bosnia y Herzegovina
  "389": "🇲🇰",       // Macedonia del Norte
  "39": "🇮🇹",        // Italia
  "40": "🇷🇴",        // Rumania
  "41": "🇨🇭",        // Suiza
  "43": "🇦🇹",        // Austria
  "44": "🇬🇧",        // Reino Unido
  "45": "🇩🇰",        // Dinamarca
  "46": "🇸🇪",        // Suecia
  "47": "🇳🇴",        // Noruega
  "48": "🇵🇱",        // Polonia
  "49": "🇩🇪",        // Alemania
  "50": "🇺🇦",        // (A veces reservado para Ucrania)
  "51": "🇵🇪",        // Perú
  "52": "🇲🇽",        // México
  "53": "🇨🇺",        // Cuba
  "54": "🇦🇷",        // Argentina
  "55": "🇧🇷",        // Brasil
  "56": "🇨🇱",        // Chile
  "57": "🇨🇴",        // Colombia
  "58": "🇻🇪",        // Venezuela
  "60": "🇲🇾",        // Malasia
  "61": "🇦🇺",        // Australia
  "62": "🇮🇩",        // Indonesia
  "63": "🇵🇭",        // Filipinas
  "64": "🇳🇿",        // Nueva Zelanda
  "65": "🇸🇬",        // Singapur
  "66": "🇹🇭",        // Tailandia
  "81": "🇯🇵",        // Japón
  "82": "🇰🇷",        // Corea del Sur
  "84": "🇻🇳",        // Vietnam
  "86": "🇨🇳",        // China
  "90": "🇹🇷",        // Turquía
  "91": "🇮🇳",        // India
  "92": "🇵🇰",        // Pakistán
  "93": "🇦🇫",        // Afganistán
  "94": "🇱🇰",        // Sri Lanka
  "95": "🇲🇲",        // Myanmar
  "98": "🇮🇷",        // Irán
  "211": "🇸🇸",       // Sudán del Sur
  "212": "🇲🇦",       // Marruecos
  "213": "🇩🇿",       // Argelia
  "216": "🇹🇳",       // Túnez
  "218": "🇱🇾",       // Libia
  "220": "🇬🇲",       // Gambia
  "221": "🇸🇳",       // Senegal
  "222": "🇲🇷",       // Mauritania
  "223": "🇲🇱",       // Malí
  "224": "🇬🇳",       // Guinea
  "225": "🇨🇮",       // Costa de Marfil
  "226": "🇧🇫",       // Burkina Faso
  "227": "🇳🇪",       // Níger
  "228": "🇹🇬",       // Togo
  "229": "🇧🇯",       // Benín
  "230": "🇲🇺",       // Mauricio
  "231": "🇱🇷",       // Liberia
  "232": "🇸🇱",       // Sierra Leona
  "233": "🇬🇭",       // Ghana
  "234": "🇳🇬",       // Nigeria
  "235": "🇹🇩",       // Chad
  "236": "🇨🇫",       // República Centroafricana
  "237": "🇨🇲",       // Camerún
  "238": "🇨🇻",       // Cabo Verde
  "239": "🇸🇹",       // Santo Tomé y Príncipe
  "240": "🇬🇶",       // Guinea Ecuatorial
  "241": "🇬🇦",       // Gabón
  "242": "🇨🇬",       // Congo
  "243": "🇨🇩",       // Congo (República Democrática)
  "244": "🇦🇴",       // Angola
  "245": "🇬🇼",       // Guinea-Bisáu
  "246": "🇮🇴",       // Territorio Británico del Océano Índico
  "248": "🇸🇨",       // Seychelles
  "249": "🇸🇩",       // Sudán
  "250": "🇷🇼",       // Ruanda
  "251": "🇪🇹",       // Etiopía
  "252": "🇸🇴",       // Somalia
  "253": "🇩🇯",       // Yibuti
  "254": "🇰🇪",       // Kenia
  "255": "🇹🇿",       // Tanzania
  "256": "🇺🇬",       // Uganda
  "257": "🇧🇮",       // Burundi
  "258": "🇲🇿",       // Mozambique
  "260": "🇿🇲",       // Zambia
  "261": "🇲🇬",       // Madagascar
  "262": "🇷🇪",       // Reunión
  "263": "🇿🇼",       // Zimbabue
  "264": "🇳🇦",       // Namibia
  "265": "🇲🇼",       // Malawi
  "266": "🇱🇸",       // Lesoto
  "267": "🇧🇼",       // Botsuana
  "268": "🇸🇿",       // Suazilandia
  "269": "🇰🇲",       // Comoras
  "290": "🇸🇭",       // Santa Elena
  "291": "🇪🇷",       // Eritrea
  "297": "🇦🇼",       // Aruba
  "298": "🇫🇴",       // Islas Feroe
  "299": "🇬🇱",       // Groenlandia
  "350": "🇬🇮",       // Gibraltar
  "351": "🇵🇹",       // Portugal
  "352": "🇱🇺",       // Luxemburgo
  "353": "🇮🇪",       // Irlanda
  "354": "🇮🇸",       // Islandia
  "355": "🇦🇱",       // Albania
  "356": "🇲🇹",       // Malta
  "357": "🇨🇾",       // Chipre
  "358": "🇫🇮",       // Finlandia
  "359": "🇧🇬",       // Bulgaria
  "370": "🇱🇹",       // Lituania
  "371": "🇱🇻",       // Letonia
  "372": "🇪🇪",       // Estonia
  "373": "🇲🇩",       // Moldavia
  "374": "🇦🇲",       // Armenia
  "375": "🇧🇾",       // Bielorrusia
  "376": "🇦🇩",       // Andorra
  "377": "🇲🇨",       // Mónaco
  "378": "🇸🇲",       // San Marino
  "379": "🇻🇦",       // Ciudad del Vaticano
  "380": "🇺🇦",       // Ucrania
  "381": "🇷🇸",       // Serbia
  "382": "🇲🇪",       // Montenegro
  "383": "🇽🇰",       // Kosovo
  "385": "🇭🇷",       // Croacia
  "386": "🇸🇮",       // Eslovenia
  "387": "🇧🇦",       // Bosnia y Herzegovina
  "389": "🇲🇰",       // Macedonia del Norte
  "420": "🇨🇿",       // República Checa
  "421": "🇸🇰",       // Eslovaquia
  "423": "🇱🇮",       // Liechtenstein
  "500": "🇫🇰",       // Islas Malvinas
  "501": "🇧🇿",       // Belice
  "502": "🇬🇹",       // Guatemala
  "503": "🇸🇻",       // El Salvador
  "504": "🇭🇳",       // Honduras
  "505": "🇳🇮",       // Nicaragua
  "506": "🇨🇷",       // Costa Rica
  "507": "🇵🇦",       // Panamá
  "508": "🇧🇱",       // San Bartolomé
  "509": "🇭🇹",       // Haití
  "590": "🇬🇵",       // Guadalupe
  "591": "🇧🇴",       // Bolivia
  "592": "🇬🇾",       // Guyana
  "593": "🇪🇨",       // Ecuador
  "594": "🇬🇫",       // Guayana Francesa
  "595": "🇵🇾",       // Paraguay
  "596": "🇲🇶",       // Martinica
  "597": "🇸🇷",       // Surinam
  "598": "🇺🇾",       // Uruguay
  "599": "🇨🇼",       // Curazao
  "670": "🇹🇱",       // Timor Oriental
  "672": "🇦🇺",       // Islas menores alejadas de Australia
  "673": "🇧🇳",       // Brunéi
  "674": "🇳🇫",       // Isla Norfolk
  "675": "🇵🇬",       // Papúa Nueva Guinea
  "676": "🇹🇴",       // Tonga
  "677": "🇸🇧",       // Islas Salomón
  "678": "🇻🇺",       // Vanuatu
  "679": "🇫🇯",       // Fiyi
  "680": "🇵🇼",       // Palaos
  "681": "🇼🇫",       // Wallis y Futuna
  "682": "🇨🇰",       // Islas Cook
  "683": "🇳🇺",       // Niue
  "685": "🇼🇸",       // Samoa
  "686": "🇰🇮",       // Kiribati
  "687": "🇳🇨",       // Nueva Caledonia
  
  }

  let text = '👥 *Invocando a todos los miembros:*\n\n'
  let mentions = []

  for (let user of participants) {
    try {
      const number = user.id.split('@')[0]
      // Extraer prefijo de país: generalmente 1 a 4 dígitos, aquí usamos máximo 4 para mejor precisión
      // Pero como la lista usa prefijos de 1 a 3 dígitos, usamos eso:
      let prefix = null
      for (let len = 3; len > 0; len--) {
        let tryPrefix = number.slice(0, len)
        if (countryFlags[tryPrefix]) {
          prefix = tryPrefix
          break
        }
      }
      if (!prefix) prefix = '' // Si no se encuentra, se pone vacío para la bandera por defecto
      const flag = countryFlags[prefix] || '🏳️'

      text += `${flag} @${number}\n`
      mentions.push(user.id)
    } catch (e) {
      // En caso de error no bloquear el proceso
      continue
    }
  }

  await conn.sendMessage(m.chat, { text, mentions }, { quoted: m })
}

handler.help = ['invocar', 'todos']
handler.tags = ['grupo']
handler.command = ['invocar', 'todos']
handler.group = true

export default handler