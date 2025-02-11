const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const token = process.env.TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

// ✅ 1️⃣ Enviar Mensagem de Boas-Vindas
async function sendWelcomeMessage(number) {
    try {
        const response = await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: "whatsapp",
                to: number,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: "👋 Olá! Seja bem-vindo(a) à *D´Morais Lda*! Como podemos te ajudar?"
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "conhecer_servicos",
                                    title: "📋 Conhecer os serviços"
                                }
                            }
                        ]
                    }
                }
            }
        });

        console.log("✅ Mensagem de boas-vindas enviada:", response.data);
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error.response ? error.response.data : error.message);
    }
}

// ✅ 2️⃣ Enviar Lista de Serviços
async function sendServiceOptions(number) {
    try {
        const response = await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: "whatsapp",
                to: number,
                type: "interactive",
                interactive: {
                    type: "list",
                    body: {
                        text: "📌 Aqui estão os nossos serviços, escolha o que deseja:"
                    },
                    action: {
                        button: "Selecionar serviço",
                        sections: [
                            {
                                title: "Nossos Serviços",
                                rows: [
                                    { id: "servico_freefire", title: "🎮 Free Fire" },
                                    { id: "servico_banco", title: "🏦 Abertura de conta bancária estrangeira" },
                                    { id: "servico_envio_dinheiro", title: "💸 Envio e recebimento de dinheiro no exterior" },
                                    { id: "servico_mentoria", title: "🎓 Formações e Mentorias" },
                                    { id: "servico_cpr", title: "🆔 Criação de CPR" },
                                    { id: "servico_rg", title: "🆔 Criação de RG" },
                                    { id: "servico_outros", title: "📌 Outros serviços" }
                                ]
                            }
                        ]
                    }
                }
            }
        });

        console.log("✅ Lista de serviços enviada:", response.data);
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error.response ? error.response.data : error.message);
    }
}

// ✅ 3️⃣ Capturar Respostas do Usuário
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object) {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const message = body.entry[0].changes[0].value.messages[0];
            const number = message.from;

            // Verifica se é um botão interativo
            if (message.type === "interactive" && message.interactive.type === "button_reply") {
                const buttonId = message.interactive.button_reply.id;

                if (buttonId === "conhecer_servicos") {
                    sendServiceOptions(number);
                }
            }
        }
    }
    res.sendStatus(200);
});

// ✅ 4️⃣ Rodar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// ✅ Teste manual (envia mensagem de boas-vindas para um número específico)
sendWelcomeMessage("244930441438"); // Substitua pelo seu número
