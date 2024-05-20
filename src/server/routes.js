const postPredictHandler = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000, // Batas maksimum ukuran file 1 MB
        output: 'stream',
        parse: true,
        failAction: async (request, h, err) => {
          if (err.output.statusCode === 413) {
            return h.response({
              status: 'fail',
              message: 'Payload content length greater than maximum allowed: 1000000'
            }).code(413).takeover();
          }
          throw err;
        }
      }
    }
  }
];

module.exports = routes;
