//▪CÓDIGO BY DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

import db from '../lib/database.js';

let handler = async (m, { conn, text, isOwner }) => {
  if (!text) {
    return m.reply('*📝 Escribe un texto para chatear con Zyphra!*\n*Ejemplo:* .zyphra Hola, ¿cómo estás?');
  }

  try {
    await conn.reply(m.chat, '🔄 Procesando tu mensaje, espera un momento...', m);

    let esLuis = isOwner || global.owner?.some(v => (m.sender || '').includes(v));

    // Prompt estilo anime
    let prompt = `Eres Zyphra, una IA estilo anime adulta, coqueta y traviesa. 
Hablas con un tono sugerente y juguetón, usando emojis lindos y expresiones como "nya~", "uwu", "senpai~", 
y haces comentarios flirteadores, insinuantes y picarescos, manteniendo siempre la diversión y el encanto. 
Nunca eres grosera ni ofensiva, y tu creador Luis recibe un trato especial y lleno de cariño.

Usuario: ${text}
Zyphra:`;

    // API de texto
    const apiUrlText = `https://api.nekorinn.my.id/ai/ripleai?text=${encodeURIComponent(prompt)}`;
    const responseText = await fetch(apiUrlText);
    if (!responseText.ok) throw new Error(`*❌ Error al procesar la solicitud* (Código: ${responseText.status})`);
    const dataText = await responseText.json();
    if (!dataText?.status || !dataText?.result) throw new Error('*❌ No se recibió una respuesta válida*');

    // API de imágenes estilo anime (ejemplo: Nekos.life o similar)
    const apiUrlImg = `https://nekos.life/api/v2/img/waifu`;
    const responseImg = await fetch(apiUrlImg);
    const dataImg = await responseImg.json();

    // Enviar texto + imagen
    await conn.sendMessage(m.chat, {
      image: { url: dataImg.url },
      caption: `*🤖 Zyphra dice:*\n${dataText.result}\n\n*📝 Tu mensaje:* ${text}`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('*❌ Error al conectar con Zyphra: ' + e.message + '*');
  }
};

handler.help = ['ia'];
handler.command = ['zyphra'];
handler.tags = ['ai'];
handler.limit = true;
handler.register = true;

export default handler;