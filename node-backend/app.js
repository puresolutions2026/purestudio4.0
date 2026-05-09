const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const askRoute = require('./routes/ask');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares flexibles para desarrollo
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir cualquier puerto de localhost o peticiones sin origen (como Postman)
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/ask', askRoute);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`PureStudio Backend Corriendo en Puerto ${PORT}`);
    console.log(`Modo Fail-Safe Activado.`);
});
