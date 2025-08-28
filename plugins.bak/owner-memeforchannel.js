import axios from 'axios';

const handler = async (m, { conn }) => {
  try {
    const res = await axios.get('https://g-mini-ia.vercel.app/api/meme');
    const memeUrl = res.data.url;

    if (!memeUrl) {
      return m.reply('❌ No se pudo obtener el meme.');
    }

    await conn.sendMessage('120363402648953286@newsletter', {
      image: { url: memeUrl },
      caption: `╭─〔 *🟡 𝑴𝑬𝑴𝑬 𝑫𝑬 𝑳𝑨 𝑯𝑶𝑹𝑨* 〕─⬣
│📸 Disfruta este meme fresco 😄
╰─────────────⬣`
    });

    m.reply('✅ Meme enviado al canal :D');
  } catch (e) {
    console.error(e);
    m.reply('❌ Hubo un error al intentar enviar el meme :C');
  }
};

handler.command = handler.help = ['enviarmeme'];
handler.tags = ['owner']
handler.rowner = true;

export default handler;