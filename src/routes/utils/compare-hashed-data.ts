import { compare } from "bcryptjs";

export async function compareHashedData(
  hashedData: string,
  unHashedData: string
) {
  try {
    const match = compare(unHashedData, hashedData);
    return match;
  } catch (error) {
    throw error;
  }
}
