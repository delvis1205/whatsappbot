const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function iniciarBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./sessions");
    const sock = makeWASocket({ auth: state, printQRInTerminal: true, logger: pino({ level: "silent" }) });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        console.log("Mensagem recebida:", texto);

        if (texto.toLowerCase() === "oi") {
            await sock.sendMessage(from, { text: "Olá! Sou um bot de WhatsApp." });
        }
    });
}

iniciarBot();
