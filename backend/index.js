// calma-mind-api/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Substitua pela sua chave da API do DeepSeek
const DEEPSEEK_API_KEY = 'SUA API KEY AQUI';

app.post('/terapia', async (req, res) => {
  const { mensagem } = req.body;

  try {
    const resposta = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat', // ou outro modelo da DeepSeek se aplicável
        messages: [
          {
            role: 'system',
            content:
              'Você é uma terapeuta especializada em ansiedade. Responda com empatia, acolhimento e orientação psicológica leve, como se estivesse em uma sessão de terapia virtual.',
          },
          {
            role: 'user',
            content: mensagem,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const respostaTexto = resposta.data.choices[0].message.content;
    res.json({ resposta: respostaTexto });
  } catch (error) {
    console.error('Erro na API DeepSeek:', error.message);
    res.status(500).json({ erro: 'Erro ao buscar resposta da terapeuta.' });
  }
});

app.listen(3001, () => {
  console.log('Servidor terapeuta rodando em http://localhost:3001');
});


