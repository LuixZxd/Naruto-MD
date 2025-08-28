import { getContentType, generateForwardMessageContent, generateWAMessageFromContent } from '@whiskeysockets/baileys';

// Lista global de mensajes guardados para anti-delete
global.delete = global.delete || [];

// Función que se ejecuta antes de procesar un mensaje
export async function before(m, { conn, isAdmin }) {
    // No aplicar si es admin, si no es grupo o si es el bot mismo
    if (isAdmin) return;
    if (!m.isGroup) return;
    if (m.key.fromMe) return;

    let chat = global.db.data.chats[m.chat];

    if (chat.delete) {
        // Limitar el tamaño de la lista de mensajes guardados
        if (global.delete.length > 500) global.delete = [];

        // Guardar mensaje si no es un protocolo de eliminación
        if (m.type !== 'protocolMessage' && m.key && m.message) {
            global.delete.push({ key: m.key, message: m.message });
        }

        // Si es un mensaje de eliminación
        if (m?.message?.protocolMessage) {
            let deletedMsg = global.delete.find(
                (item) => item.key.id === m.message.protocolMessage.key.id
            );

            if (deletedMsg) {
                // Mensaje citado indicando que se borró algo
                let quoted = {
                    key: deletedMsg.key,
                    message: {
                        extendedTextMessage: {
                            text: '《✧》Este usuario eliminó un mensaje.'
                        }
                    }
                };

                // Reenviar mensaje original
                await sendMessageForward(deletedMsg, {
                    client: conn,
                    from: m.chat,
                    isReadOneView: true,
                    viewOnce: false,
                    quoted
                });

                // Eliminar de la lista el mensaje restaurado
                let index = global.delete.indexOf(deletedMsg);
                if (index !== -1) global.delete.splice(index, 1);
            }
        }
    }
}

/**
 * Reenvía un mensaje con opciones adicionales
 */
async function sendMessageForward(originalMsg, options = {}) {
    let type = getContentType(originalMsg.message);
    let forwardContent = await generateForwardMessageContent(originalMsg, { forwardingScore: true });
    let forwardType = getContentType(forwardContent);

    // Cambiar texto o caption si se pasa en options.text
    if (options.text) {
        if (forwardType === 'conversation') {
            forwardContent[forwardType] = options.text;
        } else if (forwardType === 'extendedTextMessage') {
            forwardContent[forwardType].text = options.text;
        } else {
            forwardContent[forwardType].caption = options.text;
        }
    }

    // Forzar a que un viewOnce se pueda ver más de una vez
    if (options.isReadOneView) {
        forwardContent[forwardType].viewOnce = options.viewOnce;
    }

    // Contexto del mensaje (menciones, etc.)
    forwardContent[forwardType].contextInfo = {
        ...(originalMsg.message[type].contextInfo || {}),
        ...(options.mentions ? { mentionedJid: options.mentions } : {}),
        isForwarded: options.forward || true,
        remoteJid: options.remote || null
    };

    // Generar mensaje listo para enviar
    let waMessage = await generateWAMessageFromContent(options.from, forwardContent, {
        userJid: options.client.user.id,
        quoted: options.quoted || originalMsg
    });

    // Enviar mensaje
    await options.client.relayMessage(options.from, waMessage.message, {
        messageId: waMessage.key.id
    });

    return waMessage;
}