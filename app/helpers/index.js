const toTwoDecimal = (number, digits) => {
  const quota = Math.pow(10, digits);
  return Math.floor(number * quota) / quota;
};

const calculateExchange = (exchangeOptions, amount) => {
  const exchangedValues = {};

  exchangedValues.USD = toTwoDecimal(exchangeOptions["BRLUSD"].ask * amount, 2);
  exchangedValues.EUR = toTwoDecimal(exchangeOptions["BRLEUR"].ask * amount, 2);
  exchangedValues.INR = toTwoDecimal(exchangeOptions["BRLINR"].ask * amount, 2);

  return exchangedValues;
};

module.exports = {
  calculateExchange,
};
