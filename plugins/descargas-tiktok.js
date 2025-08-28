import fetch from 'node-fetch';

var handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `Por favor, envía un enlace de TikTok para descargar el video.`, m, rcanal);
    }

    try {
        await conn.reply(m.chat, `Descargando el video, por favor espera...`, m, rcanal);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData || !tiktokData.video_url) {
            return conn.reply(m.chat, "No se pudo obtener el video de TikTok.", m, rcanal);
        }

        const videoURL = tiktokData.video_url;
        const { title, author } = tiktokData;

        const info = `
📄 *Título:* ${title || 'No disponible'}
👤 *Autor:* ${author || 'Desconocido'}
        

> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F`.trim();

        await conn.sendFile(m.chat, videoURL, "tiktok.mp4", `${info}\n\n✅ Video descargado correctamente.`, m);
    } catch (error1) {
        console.error(error1);
        return conn.reply(m.chat, `Ocurrió un error al descargar el video: ${error1.message}`, m, rcanal);
    }
};

handler.help = ['tiktok'].map(v => v + ' <link>');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];

handler.group = true;

export default handler;

async function tiktokdl(url) {
    let api = `https://g-mini-ia.vercel.app/api/tiktok?url=${encodeURIComponent(url)}`;
    let res = await fetch(api);
    if (!res.ok) throw new Error(`Respuesta inválida de la API`);
    let json = await res.json();
    return json;
}