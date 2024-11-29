const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const { storeData, getData } = require("../services/dataService");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  const { confidenceScore } = await predictClassification(model, image);

  const id = crypto.randomUUID();
  const isCancer = confidenceScore > 50;
  const result = isCancer ? "Cancer" : "Non-cancer";
  const suggestion = isCancer
    ? "Segera periksa ke dokter!"
    : "Penyakit kanker tidak terdeteksi.";
  const className = isCancer ? "cancer-prediction" : "non-cancer-prediction";
  const createdAt = new Date().toISOString();
  const data = {
    id: id,
    result: result,
    suggestion: suggestion,
    createdAt: createdAt,
  };
  await storeData(id, data);
  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data: data,
  });
  response.code(201);
  return response;
}

async function getPredictsHandler(request, h) {
  try {
    const data = await getData();

    const history = data.map((entry) => ({
      id: entry.id,
      history: {
        result: entry.result,
        createdAt: entry.createdAt,
        suggestion: entry.suggestion,
        id: entry.id,
      },
    }));

    return h
      .response({
        status: "success",
        data: history,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Failed to fetch prediction history",
      })
      .code(500);
  }
}

module.exports = { postPredictHandler, getPredictsHandler };
