// Código creado por Deylin
// https://github.com/Deylin-eliac 
// codigo creado para https://github.com/Deylin-eliac
// No quites créditos

import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn }) => {
  m.react('👑');

  const numCreador = '50765836410';
  const ownerJid = numCreador + '@s.whatsapp.net';
  const name = await conn.getName(ownerJid) || 'Deylin';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || `Hola, mucho gusto. Soy Luis.`;

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
NOTE:${about}
END:VCARD`.trim();

  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: name,
        contacts: [{ vcard }]
      },
    },
    { quoted: m }
  );
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;