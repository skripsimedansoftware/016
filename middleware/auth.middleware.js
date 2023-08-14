const passport = require('passport');
const PassportHTTPBearer = require('passport-http-bearer');
const HTTPErrors = require('http-errors');
const { JWTDecode, JWTVerify } = require('../helpers/jwt.helper');
const { Pengguna } = require('../models');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMidlleware
 */

passport.use(
  new PassportHTTPBearer(async (token, done) => {
    try {
      await JWTVerify(token);
      done(null, JWTDecode(token));
    } catch (error) {
      done(error);
    }
  }),
);

/** @type {ExpressMidlleware} */
const HTTPBearer = (req, res, next) => {
  passport.authenticate(
    'bearer',
    { session: false },
    async (error, payload) => {
      if (!error) {
        if (payload?.id) {
          try {
            const find = await Pengguna.findByPk(payload.id);
            if (find !== null) {
              req.user = find.id;
              req.authInfo = find;
            }
          } catch (e) {
            return next(e);
          }
        }

        return next();
      }

      if (error.code === 'ERR_JWT_EXPIRED') {
        if (!req.path.match(/\/auth\/(.*)/)) {
          return next(HTTPErrors.Unauthorized('expired-token'));
        }

        return next();
      }

      return next(error);
    },
  )(req, res, next);
};

module.exports = { HTTPBearer };
