const axios = require("axios");

const getExchange = () => {
  const url = `${process.env.AWESOME_API_URL}${process.env.EXCHANGE_USD},${process.env.EXCHANGE_EUR},${process.env.EXCHANGE_INR}`;

  return axios.get(url);
};

module.exports = {
  getExchange,
};
