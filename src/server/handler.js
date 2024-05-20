const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');

const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;

    const { model } = request.server.app;

    // Lakukan prediksi
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt
    };

    await storeData(id, data);

    return h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    }).code(201);

  } catch (error) {
    console.error('Prediction error:', error);

    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    }).code(400);
  }
}

module.exports = postPredictHandler;
