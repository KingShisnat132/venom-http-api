const express = require('express');
const { create } = require('venom-bot');

const app = express();
app.use(express.json());

let clientInstance = null;

// Inicializa o Venom
create()
  .then((client) => {
    clientInstance = client;
    console.log('Venom client initialized!');
  })
  .catch((error) => {
    console.error('Error initializing Venom:', error);
  });

// Endpoint para enviar mensagem
app.post('/send-message', async (req, res) => {
  if (!clientInstance) {
    return res.status(500).json({ error: 'Venom client not initialized' });
  }
  const { number, message } = req.body;
  if (!number || !message) {
    return res.status(400).json({ error: 'number and message are required' });
  }
  try {
    const result = await clientInstance.sendText(number, message);
    res.json({ status: 'success', result });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.send('Venom WhatsApp HTTP API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});