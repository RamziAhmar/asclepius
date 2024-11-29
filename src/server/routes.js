const { postPredictHandler } = require('../server/handler');
const { getPredictsHandler } = require('../server/handler');

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1048576,
      },
    },
  },
  {
    path: "/predict/histories",
    method: "GET",
    handler: getPredictsHandler,
  },
];

module.exports = routes;
