import db from '../lib/database.js'

let buatall = 1
let cooldowns = {}

let handler = async (m, { conn, args, usedPrefix, command, DevMode }) => {
  let user = global.db.data.users[m.sender]
  let randomaku = `${Math.floor(Math.random() * 101)}`.trim()
  let randomkamu = `${Math.floor(Math.random() * 55)}`.trim()
  let Aku = Number(randomaku)
  let Kamu = Number(randomkamu)
  let count = args[0]
  let who = m.fromMe ? conn.user.jid : m.sender
  let username = await conn.getName(who)
  let tiempoEspera = 15

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `${emoji3} Ya has iniciado una apuesta recientemente, espera *⏱️ ${tiempoRestante}* para apostar nuevamente`, m)
  }
  cooldowns[m.sender] = Date.now()

  count = count 
    ? /all/i.test(count) 
      ? Math.floor(user.limit / buatall) 
      : parseInt(count) 
    : 1

  count = Math.max(1, count)

  if (args.length < 1) {
    return conn.reply(m.chat, `${emoji} Ingresa la cantidad de 💸 *${moneda}* que deseas aportar contra *${botname}*\n\nEjemplo:\n> *${usedPrefix + command}* 100`, m)
  }

  if (user.dinero >= count) {
    user.dinero -= count
    if (Aku > Kamu) {
      conn.reply(m.chat, `${emoji2} \`Veamos que números tienen!\`\n\n➠ *${botname}* : ${Aku}\n➠ *${username}* : ${Kamu}\n\n> ${username}, *PERDISTE* ${formatNumber(count)} 💸 ${moneda}.`, m)
    } else if (Aku < Kamu) {
      user.dinero += count * 2
      conn.reply(m.chat, `${emoji2} \`Veamos que números tienen!\`\n\n➠ *${botname}* : ${Aku}\n➠ *${username}* : ${Kamu}\n\n> ${username}, *GANASTE* ${formatNumber(count * 2)} 💸 ${moneda}.`, m)
    } else {
      user.dinero += count
      conn.reply(m.chat, `${emoji2} \`Veamos que números tienen!\`\n\n➠ *${botname}* : ${Aku}\n➠ *${username}* : ${Kamu}\n\n> ${username} obtienes ${formatNumber(count)} 💸 ${moneda}.`, m)
    }
  } else {
    conn.reply(m.chat, `No tienes *${formatNumber(count)} 💸 ${moneda}* para apostar!`, m)
  }
}

handler.help = ['apostar *<cantidad>*']
handler.tags = ['economy']
handler.command = ['apostar', 'casino']
handler.group = true
handler.register = true
handler.fail = null
export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function segundosAHMS(segundos) {
  let segundosRestantes = segundos % 60
  return `${segundosRestantes} segundos`
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}