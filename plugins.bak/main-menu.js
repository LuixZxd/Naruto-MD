import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Keep this for now, but we'll use axios for JSON fetching
import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import axios from 'axios'; // Import axios for fetching remote JSON

const cooldowns = new Map();
const ultimoMenuEnviado = new Map();

const newsletterJid = '120363402648953286@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ 𝙕𝙔𝙋𝙃𝙍𝘼-𝙈𝘿 ⚡ 𝘿𝙀𝙑𝙇𝙐𝙎𝙎𝙄𝙉𝙃𝙊7';
const packname = '乙Ƴᑭᕼᖇᗩ-ᗰᗪ';

// --- Global variable for repository info (customize this!) ---
const GITHUB_REPO_OWNER = 'nevi-dev';
const GITHUB_REPO_NAME = 'Ellen-Joe-Bot-MD';
const GITHUB_BRANCH = 'main';

// Configura tu canal con id y nombre
const channelRD = {
  id: newsletterJid,
  name: newsletterName
};

let handler = async (m, { conn, usedPrefix }) => {
  // --- 1. Lectura de la base de datos de medios ---
  let enlacesMultimedia;
  try {
    const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');
    const dbRaw = fs.readFileSync(dbPath);
    enlacesMultimedia = JSON.parse(dbRaw).links;
  } catch (e) {
    console.error("Error al leer o parsear src/database/db.json:", e);
    return conn.reply(m.chat, 'Error al leer la base de datos de medios.', m);
  }

  if (m.quoted?.id && m.quoted?.fromMe) return;

  // --- 2. Sistema de Cooldown (Enfriamiento) ---
  const idChat = m.chat;
  const ahora = Date.now();
  const tiempoEspera = 5 * 60 * 1000; // 5 minutos

  const ultimoUso = cooldowns.get(idChat) || 0;

  if (ahora - ultimoUso < tiempoEspera) {
    const tiempoRestanteMs = tiempoEspera - (ahora - ultimoUso);
    const minutos = Math.floor(tiempoRestanteMs / 60000);
    const segundos = Math.floor((tiempoRestanteMs % 60000) / 1000);
    const ultimo = ultimoMenuEnviado.get(idChat);
    return await conn.reply(
      idChat,
      `@${m.sender.split('@')[0]} cálmate ! Debes esperar para volver a usar el menú.\nTiempo restante: *${minutos}m ${segundos}s*`,
      ultimo?.message || m,
      { mentions: [m.sender] }
    );
  }

  // --- 3. Obtener nombre y hora del usuario ---
  let nombre;
  try {
    nombre = await conn.getName(m.sender);
  } catch {
    nombre = 'Usuario';
  }

  let horaUsuario = 'No disponible';
  try {
    const numeroParseado = new PhoneNumber(m.sender);
    const esValido = numeroParseado.isValid();

    if (esValido) {
      const zonasHorarias = numeroParseado.getTimezones();
      if (zonasHorarias && zonasHorarias.length > 0) {
        const zonaHorariaUsuario = zonasHorarias[0];
        horaUsuario = moment().tz(zonaHorariaUsuario).format('h:mm A');
      }
    }
  } catch (e) {
    console.error("Error al procesar el número con awesome-phonenumber:", e.message);
  }

  // --- 4. Recopilar información y construir el menú ---
  const totalComandos = Object.keys(global.plugins || {}).length;
  const tiempoActividad = clockString(process.uptime() * 1000);
  const totalRegistros = Object.keys(global.db?.data?.users || {}).length;

  const miniaturaRandom = enlacesMultimedia.imagen[Math.floor(Math.random() * enlacesMultimedia.imagen.length)];

  const emojis = {
    'main': '🦈', 'tools': '🛠️', 'audio': '🎧', 'group': '👥',
    'owner': '👑', 'fun': '🎮', 'info': 'ℹ️', 'internet': '🌐',
    'downloads': '⬇️', 'admin': '🧰', 'anime': '✨', 'nsfw': '🔞',
    'search': '🔍', 'sticker': '🖼️', 'game': '🕹️', 'premium': '💎', 'bot': '🤖'
  };

  let grupos = {};
  for (let plugin of Object.values(global.plugins || {})) {
    if (!plugin.help || !plugin.tags) continue;
    for (let tag of plugin.tags) {
      if (!grupos[tag]) grupos[tag] = [];
      for (let help of plugin.help) {
        if (/^\$|^=>|^>/.test(help)) continue;
        grupos[tag].push(`${usedPrefix}${help}`);
      }
    }
  }

  for (let tag in grupos) {
    grupos[tag].sort((a, b) => a.localeCompare(b));
  }

  const secciones = Object.entries(grupos).map(([tag, cmds]) => {
    const emoji = emojis[tag] || '📁';
    return `[${emoji} ${tag.toUpperCase()}]\n` + cmds.map(cmd => `> ${cmd}`).join('\n');
  }).join('\n\n');

  // --- Version Check Logic ---
  let localVersion = 'N/A';
  let serverVersion = 'N/A';
  let updateStatus = 'Desconocido';
      
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonRaw);
    localVersion = packageJson.version || 'N/A';
  } catch (error) {
    console.error("Error al leer la versión local de package.json:", error.message);
    localVersion = 'Error';
  }

  try {
    const githubPackageJsonUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/package.json`;
    const response = await axios.get(githubPackageJsonUrl);
    const githubPackageJson = response.data;
    serverVersion = githubPackageJson.version || 'N/A';

    if (localVersion !== 'N/A' && serverVersion !== 'N/A') {
      if (localVersion === serverVersion) {
        updateStatus = '✅ En última versión';
      } else {
        updateStatus = `⚠️ Actualización disponible. Actualiza con *${usedPrefix}update*`;
      }
    }
  } catch (error) {
    console.error("Error al obtener la versión del servidor de GitHub:", error.message);
    serverVersion = 'Error';
    updateStatus = '❌ No se pudo verificar la actualización';
  }
  // --- End Version Check Logic ---

const encabezado = `
╔═━⊱ Status del usuario  ⊰━═╗
║ ✦ 𝙽𝚘𝚖𝚋𝚛𝚎   » ${nombre}
╚═━⊱   𝙴𝚗𝚍 𝙾𝚏 𝙻𝚒𝚗𝚎.    ⊰━═╝
🧬 » 𝗛𝗔𝗖𝗞 𝗡𝗢𝗗𝗘 𝗔𝗖𝗧𝗜𝗩𝗢 «
👑 » 𝗢𝗽𝗲𝗿𝗮𝗱𝗼𝗿: 𝘿𝙀𝙑𝙇𝙐𝙎𝙎𝙄𝙉𝙃𝙊7 «
`.trim();

  const textoFinal = `${encabezado}\n\n${secciones}\n\n*${packname}*`;

  // --- 5. Construir metaMsg con externalAdReply ---
  const metaMsg = {
    quoted: global.fakeMetaMsg,
    contextInfo: {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        serverMessageId: 100,
        newsletterName: channelRD.name
      },
      externalAdReply: {
  title: packname,
  body: 'Menú de Comandos | 𝒁𝒚𝒑𝒉𝒓𝒂 ⚡',
  mediaUrl: null,
  description: null,
  previewType: "PHOTO",
  thumbnailUrl: 'https://files.catbox.moe/j6ci3o.jpg',  // <-- URL fija que quieres
  sourceUrl: 'https://whatsapp.com/channel/0029VbBJZs5G8l5EwrjizJ2H',
  mediaType: 1,
  renderLargerThumbnail: true
}
    }
  };

  // --- 6. Enviar mensaje solo texto con metaMsg ---
  let msgEnviado;
  try {
    msgEnviado = await conn.sendMessage(idChat, {
      text: textoFinal,
      contextInfo: metaMsg.contextInfo
    }, { quoted: metaMsg.quoted });
  } catch (e) {
    console.error("Error al enviar el menú:", e);
    msgEnviado = await conn.reply(idChat, textoFinal, m);
  }

  // --- 7. Actualizar cooldown ---
  cooldowns.set(idChat, ahora);
  ultimoMenuEnviado.set(idChat, {
    timestamp: ahora,
    message: msgEnviado
  });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.register = true;
handler.command = ['menu', 'menú', 'help'];

export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}