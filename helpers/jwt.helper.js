const fs = require('node:fs');
const {
  importPKCS8,
  importSPKI,
  SignJWT,
  decodeJwt,
  jwtVerify,
} = require('jose');

/**
 * Encode
 *
 * @param {object} data
 * @param {object} options
 * @returns {Promise<string>}
 */
const JWTEncode = async (data = {}, options = {}) => {
  try {
    const algorithm = options.algo || process.env.JWT_ALGO;
    const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY);
    const importPrivateKey = await importPKCS8(
      privateKey.toString(),
      algorithm,
    );

    return new SignJWT(data)
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setIssuer(options.issuer || process.env.JWT_ISSUER)
      .setAudience(options.audience || process.env.JWT_AUDIENCE)
      .setExpirationTime(options.expiration || process.env.JWT_EXPIRE)
      .sign(importPrivateKey);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Decode
 *
 * @param {string} token
 * @returns {import('jose').JWTPayload}
 */
const JWTDecode = (token) => decodeJwt(token);

/**
 * Verify
 *
 * @param {string} token
 * @param {object} options
 * @returns {Promise<import('jose').JWTVerifyResult>}
 */
const JWTVerify = (token, options = {}) => new Promise((resolve, reject) => {
  const algorithm = options.algo || process.env.JWT_ALGO;
  const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY);

  importSPKI(publicKey.toString(), algorithm).then((importPublicKey) => {
    jwtVerify(token, importPublicKey, {
      issuer: options.issuer || process.env.JWT_ISSUER,
      audience: options.audience || process.env.JWT_AUDIENCE,
    }).then(resolve, reject);
  }, reject);
});

module.exports = {
  JWTEncode,
  JWTDecode,
  JWTVerify,
};
