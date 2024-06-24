import { hash } from "bcryptjs";

export async function hashData(data: string) {
  try {
    const hashedData = await hash(data, 10);
    return hashedData;
  } catch (error) {
    throw error;
  }
}
