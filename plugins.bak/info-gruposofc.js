import { join } from 'path'
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

let handler = async (m, { conn }) => {
  const proses = 'Obteniendo información de los grupos oficiales...'
  await conn.sendMessage(m.chat, { text: proses }, { quoted: m })

  // Usar la imagen del thumbnail del bot para evitar errores 404
  async function createImage() {
    try {
      // Fallback directamente a una imagen en línea si no se encuentra la local
      const { imageMessage } = await generateWAMessageContent({ 
        image: { url: 'https://files.cloudkuimages.guru/images/YJ8Olr1D.jpg' }  
      }, {
        upload: conn.waUploadToServer
      });
      return imageMessage;
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      throw error;
    }
  }
  // Define los grupos oficiales aquí
  const groups = [
    {
      name: 'Canal Oficial Zyphra-BOT',
      desc: 'Canal principal del bot para convivir con la comunidad',
      buttons: [
        { name: '⚡ Unirse al Canal', url: 'https://whatsapp.com/channel/0029VbBJZs5G8l5EwrjizJ2H' } // Reemplaza con tu enlace
      ]
    }
  ]

  let cards = []

  // Crear una sola imagen para todos los grupos para evitar errores
  const imageMsg = await createImage()

  // Iterar sobre los grupos para generar las tarjetas
  for (const group of groups) {
    const formattedButtons = group.buttons.map(btn => ({
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: btn.name,
        url: btn.url
      })
    }))

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `💠 *${group.name}*\n${group.desc}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: '> Si el enlace está anulado, contacta al propietario del bot.'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: true,
        imageMessage: imageMsg
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: formattedButtons
      })
    })
  }

  const slideMessage = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: 'Grupos Oficiales de Zypra-MD ⚡'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Únete a nuestros grupos oficiales'
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards
          })
        })
      }
    }
  }, {})

  await conn.relayMessage(m.chat, slideMessage.message, { messageId: slideMessage.key.id })
  
  // Reacción con emoji
  await m.react('✅')
}

handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'canal']

export default handler
