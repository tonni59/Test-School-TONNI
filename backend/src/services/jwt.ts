import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export const signAccessToken = (payload: object) => {
  const secret = process.env.JWT_ACCESS_SECRET as Secret;
  const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as SignOptions['expiresIn'];

  return jwt.sign(payload, secret, { expiresIn });
};

export const signRefreshToken = (payload: object) => {
  const secret = process.env.JWT_REFRESH_SECRET as Secret;
  const expiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as Secret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as Secret);
};
