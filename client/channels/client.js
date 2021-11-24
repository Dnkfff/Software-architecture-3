const http = require('../common/http');

const Client = (baseUrl) => {
  const client = http.Client(baseUrl);

  return {
    menu: () => client.get('/menu'),
    createChannel: (name) => client.post('/menu', { name }),
  };
};

module.exports = { Client };
