const express = require('express');

const app = express();
app.use(express.json());

const EXTERNAL_ENDPOINT = 'https://callback-iot.up.railway.app/data';
const NODE_RED_URL = 'http://localhost:1880/visualizar';
const PORT = 3000;

app.get('/data', async (req, res) => {
  try {
    const respuesta = await fetch(EXTERNAL_ENDPOINT);
    const datos = await respuesta.json();
    const ultimosDos = datos.slice(-2);
    res.json(ultimosDos);
  } catch (error) {
    res.status(502).json({
      error: 'No se pudo consultar el endpoint externo',
      detalle: error.message
    });
  }
});

app.post('/visualize', async (req, res) => {
  const datosRecibidos = req.body;

  try {
    await fetch(NODE_RED_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosRecibidos)
    });

    res.status(200).json({
      mensaje: 'Datos reenviados a la aplicacion de visualizacion',
      datos: datosRecibidos
    });
  } catch (error) {
    res.status(502).json({
      error: 'No se pudo reenviar a la aplicacion de visualizacion',
      detalle: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
