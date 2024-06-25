import jwt from "jsonwebtoken";

const key = process.env.TOKEN_KEY;
const expiry = process.env.TOKEN_EXPIRY;

export async function createToken(data: object) {
  try {
    return await jwt.sign(data, key, { expiresIn: expiry });
  } catch (error) {
    throw error;
  }
}
