let recordatorios = {};
import fetch from 'node-fetch';

// Función para convertir un string de tiempo tipo "1m30s", "45s", "2m" en segundos
function parseTiempo(tiempoStr) {
    let totalSegundos = 0;
    const regex = /(\d+)([sm]?)/g;
    let match;

    while ((match = regex.exec(tiempoStr.toLowerCase())) !== null) {
        let valor = parseInt(match[1]);
        let unidad = match[2];

        if (unidad === 'm') {
            totalSegundos += valor * 60;
        } else {
            // Por defecto o si es "s", segundos
            totalSegundos += valor;
        }
    }
    return totalSegundos;
}

async function handler(m, { args, command, conn, participants }) {
    const chatId = m.chat;

    const res = await fetch('https://files.catbox.moe/j6ci3o.jpg');
    const thumb2 = Buffer.from(await res.arrayBuffer());

    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: ' 𝗥𝗘𝗖𝗢𝗥𝗗𝗔𝗧𝗢𝗥𝗜𝗢',
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };

    if (command === 'recordatorio') {
        if (args.length < 3) return m.reply('Uso: *!recordatorio [tiempo] [veces] [mensaje]*\nEjemplos de tiempo: 30s, 2m, 1m30s');

        let tiempoStr = args[0];
        let repeticiones = parseInt(args[1]);

        let tiempoSegundos = parseTiempo(tiempoStr);

        if (tiempoSegundos <= 0 || isNaN(tiempoSegundos)) return m.reply('⛔ El tiempo debe ser un número válido en formato segundos (s) o minutos (m).');
        if (isNaN(repeticiones) || repeticiones <= 0) return m.reply('⛔ Las veces deben ser un número válido mayor a 0.');

        let mensaje = args.slice(2).join(' ');

        if (recordatorios[chatId]) clearTimeout(recordatorios[chatId].timeout);

        let contador = 0;
        function enviarRecordatorio() {
            if (contador < repeticiones) {
                let mencionados = participants.map(u => u.id);
                conn.sendMessage(chatId, {
                    text: `${mensaje}`,
                    mentions: mencionados
                }, { quoted: fkontak });
                contador++;
                recordatorios[chatId].timeout = setTimeout(enviarRecordatorio, tiempoSegundos * 1000);
            } else {
                delete recordatorios[chatId];
            }
        }

        recordatorios[chatId] = { timeout: setTimeout(enviarRecordatorio, tiempoSegundos * 1000) };
        m.reply(`✅ Recordatorio activado: *"${mensaje}"* cada ${tiempoStr} (≈${tiempoSegundos} segundo(s)), se enviará ${repeticiones} veces.`);
    }

    if (command === 'cancelarrecordatorio') {
        if (recordatorios[chatId]) {
            clearTimeout(recordatorios[chatId].timeout);
            delete recordatorios[chatId];
            m.reply('❌ Recordatorio cancelado.');
        } else {
            m.reply('No hay recordatorios activos en este grupo.');
        }
    }
}

handler.help = ['recordatorio', 'cancelarrecordatorio'];
handler.tags = ['grupo'];
handler.command = ['recordatorio', 'cancelarrecordatorio'];
handler.admin = true;
handler.group = true;

export default handler;