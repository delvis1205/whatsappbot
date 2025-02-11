require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

// Função para enviar mensagem interativa com botões
const sendInteractiveMessage = async (to) => {
    const messageData = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
            type: "button",
            body: {
                text: "Gostaria de conhecer nossos demais cursos?"
            },
            action: {
                buttons: [
                    { type: "reply", reply: { id: "sim", title: "Sim" } },
                    { type: "reply", reply: { id: "talvez", title: "Talvez depois" } }
                ]
            }
        }
    };

    try {
        const response = await axios.post(WHATSAPP_API_URL, messageData, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Mensagem enviada:", response.data);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error.response?.data || error.message);
    }
};

// Rota para testar o envio da mensagem
app.post("/send", async (req, res) => {
    const { number } = req.body;
    if (!number) {
        return res.status(400).json({ error: "Número de telefone é obrigatório" });
    }
    await sendInteractiveMessage(number);
    res.json({ message: "Mensagem enviada com sucesso!" });
});

// Configurar servidor para rodar na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
