// services/externalApiService.js
const axios = require('axios');
const https = require('https');
const { getToken } = require('../../utils/tokenManager');
require('dotenv').config();
const httpsAgent = new https.Agent({ rejectUnauthorized: false });


async function callExternalApi(endpoint, method = 'get', data = null, params = {}) {
  const token = await getToken();

  try {
    let url= `${process.env.EXTERNAL_API_BASE_URL}${endpoint}?fechaInicio=2025-01-01&fechaFin=2025-12-31&idEnteGestor=53612251-3990-41d9-965f-f066eab43a8b`
    let headers= {
        "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json', 
            "Content-Type": "application/json",  
            "Referrer-Policy": "no-referrer, strict-origin-when-cross-origin"    ,
        Authorization: `Bearer ${token}`
      }
    console.log("\nurl consulta", url)
    console.log("\nToken", headers)
    console.log("\nparams", params)
    const response = await axios({
      url,
      method,
      headers,
      httpsAgent,
      data
    });

    return response.data;
  } catch (error) {
    console.error(`Error al consumir ${endpoint}:`, error.response?.data || error.message);
    throw new Error("Error al obtener datos del servicio externo.");
  }
}

module.exports = { callExternalApi };
