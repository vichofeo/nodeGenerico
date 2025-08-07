// routes/externalApi.routes.js
const express = require('express');
const router = express.Router();
const { callExternalApi } = require('../services/services/externalApiService');

// Ejemplo de endpoint expuesto al frontend
router.get('/bdpa', async (req, res) => {
  try {
    console.log("\ndesde controler params::", req.query)
    const data = await callExternalApi('/consultas/tipoAfiliacion', 'get', null, req.query); // <-- ajustá el endpoint real
    res.json(data);
    //res.send({error: 'holasss'})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
