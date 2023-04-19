const logger = require('../logger');
const tokenFromRequest = require('./token');
const accountIdFromRequest = require('./accountId');
const { googleAuthUser } = require('./google');
const config = require('../config');
const isTrue = require('../istrue');

const { useAuth: useAuthStr = 'true' } = config;
const useAuth = isTrue(useAuthStr);

const getUser = async (req) => {
  const token = tokenFromRequest(req);
  if (!token) {
    return false;
  }

  const user = await googleAuthUser(token);
  if (!user || !user.profile) {
    return false;
  }

  return user;
};

const isAdmin = async (req, res, next) => {
  if (!useAuth) {
    return next();
  }
  const user = await getUser(req);
  if (!user || !user.isAdmin()) {
    const errNotAdmin = new Error(`Unauthorized`);
    errNotAdmin.status = 401;
    return next(errNotAdmin);
  }
  return next();
};

const isUser = async (req, res, next) => {
  if (!useAuth) {
    return next();
  }
  const user = await getUser(req);

  if (!user || !user.profile) {
    const errBadUser = new Error(`Unauthorized`);
    errBadUser.status = 401;
    return next(errBadUser);
  }

  return next();
};

const isAccountUser = async (req, res, next) => {
  if (!useAuth) {
    return next();
  }
  const accountId = accountIdFromRequest(req);
  if (!accountId) {
    logger.error('No accountId present in path');
    const badRequest = new Error(`No accountId present in path`);
    badRequest.status = 400;
    return next(errBadUser);
  }
  const user = await getUser(req);

  if (!user || !user.isAccount(accountId)) {
    const errBadUser = new Error(`Unauthorized`);
    errBadUser.status = 401;
    return next(errBadUser);
  }

  return next();
};

module.exports = {
  isAdmin,
  isUser,
  isAccountUser,
};
