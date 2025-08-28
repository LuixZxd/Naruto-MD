const roles = {
  'Bronce V 🥉': 0,
  'Bronce IV 🥉': 2,
  'Bronce III 🥉': 4,
  'Bronce II 🥉': 6,
  'Bronce I 🥉': 8,
  'Plata V ⚪': 10,
  'Plata IV ⚪': 12,
  'Plata III ⚪': 14,
  'Plata II ⚪': 16,
  'Plata I ⚪': 18,
  'Oro V 🟡': 20,
  'Oro IV 🟡': 22,
  'Oro III 🟡': 24,
  'Oro II 🟡': 26,
  'Oro I 🟡': 28,
  'Platino V 🔷': 30,
  'Platino IV 🔷': 32,
  'Platino III 🔷': 34,
  'Platino II 🔷': 36,
  'Platino I 🔷': 38,
  'Diamante V 💎': 40,
  'Diamante IV 💎': 42,
  'Diamante III 💎': 44,
  'Diamante II 💎': 46,
  'Diamante I 💎': 48,
  'Heroico V 🦸': 50,
  'Heroico IV 🦸': 52,
  'Heroico III 🦸': 54,
  'Heroico II 🦸': 56,
  'Heroico I 🦸': 58,
  'Gran Maestro V 👑': 60,
  'Gran Maestro IV 👑': 62,
  'Gran Maestro III 👑': 64,
  'Gran Maestro II 👑': 66,
  'Gran Maestro I 👑': 68,
  'Leyenda 🔥': 70,
}

let handler = m => m
handler.before = async function (m, { conn }) {
  let user = db.data.users[m.sender]
  let level = user.level || 0
  // Ordena de mayor a menor el nivel y busca el rango que corresponda
  let rango = (Object.entries(roles)
    .sort((a, b) => b[1] - a[1])
    .find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
  user.rango = rango
  return true
}

export default handler