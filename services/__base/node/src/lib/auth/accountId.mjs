const accountIdFromRequest = (req) => {
  const { params = {}, query = {} } = req;
  return params.accountId || query.accountId;
};

module.exports = accountIdFromRequest;
