import { PrismaClient } from "@prisma/client";
export let prisma = new PrismaClient();

let isConnected = false;

export const checkDB = async (): Promise<void> => {
  try {
    if (isConnected) return;
    prisma = new PrismaClient();
    await prisma.$connect();
    isConnected = true;
  } catch (err) {
    throw err;
  }
};
