import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../server";

export async function verifyJWT(req: FastifyRequest, res: FastifyReply) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error();
    }
    return await app.jwt.verify(token);
  } catch (error) {
    return res.status(401).send({ message: "Token inválido" });
  }
}
