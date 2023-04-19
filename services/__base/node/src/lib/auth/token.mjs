const tokenFromRequest = (req) => {
  const { headers, cookies, query } = req;
  return headers.token || cookies.token || query.token;
};

module.exports = tokenFromRequest;
