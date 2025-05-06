'use server';

import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/lib/db';
import { UserEncryptionKey } from '@prisma/client';

export interface PasswordEntryCreateInput {
  userId: string;
  space?: string;
  website?: string | null;
  username: string;
  password: string;
  iv: string;
}

export async function SaveUserKeysInDB({
  googleID,
  passphrase,
  aesKey,
  aesIV,
}: UserEncryptionKey) {
  try {
    const dbResponse = await prisma.userEncryptionKey.create({
      data: {
        googleID,
        passphrase,
        aesIV,
        aesKey,
      },
    });
    if (!dbResponse) return null;
    return dbResponse;
  } catch (error) {
    throw new Error(`KEYS ARE NOT APPENDED TO DB: ${(error as Error).message}`);
  }
}

export async function getUserAESKeyRecord(googleID: string) {
  if (!googleID) throw new Error('UNAUTHENTICATED REQUEST');
  try {
    const key = await prisma.userEncryptionKey.findUnique({
      where: { googleID },
    });

    return key;
  } catch (error) {
    throw new Error(`ERROR FETCHING RECORD: ${(error as Error).message}`);
  }
}

export async function getPassphraseStatus(googleID: string) {
  try {
    const status = await prisma.user.findUnique({
      where: { googleID },
      select: { isPassphraseSet: true },
    });

    return status?.isPassphraseSet ?? false;
  } catch (error) {
    throw new Error(
      `FAILED TO GET PASSPHRASE STATUS: ${(error as Error).message}`,
    );
  }
}

export async function setPassphraseStatus(googleID: string) {
  try {
    const user = await prisma.user.findUnique({ where: { googleID } });
    if (!user) return null;
    const updatedPassphraseStatus = await prisma.user.update({
      where: { googleID },
      data: { isPassphraseSet: true },
    });
    return updatedPassphraseStatus;
  } catch (error) {
    throw new Error(
      `PASSPRHASE STATUS NOT UPDATED IN DB: ${(error as Error).message}`,
    );
  }
}

export async function getCurrentUserSession() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function SaveCredentials({
  userId,
  space = 'main',
  website,
  username,
  password,
  iv,
}: PasswordEntryCreateInput) {
  if (!username || !password || !iv)
    throw new Error('REQUIRED FIELDS ARE MISSING');
  try {
    const response = await prisma.passwordEntry.create({
      data: {
        userId,
        space,
        website,
        username,
        password,
        iv,
      },
    });
    return response;
  } catch (error) {
    throw new Error(`FAIED TO SAVE CRED: ${(error as Error).message}`);
  }
}

export async function GetCredentials(googleID: string) {
  if (!googleID) throw new Error('UNAUTHENTICATED REQUEST');
  try {
    const records = await prisma.passwordEntry.findMany({
      where: { userId: googleID },
    });
    if (!records) return null;
    return records;
  } catch (error) {
    throw new Error(`GET CRED FAILED: ${(error as Error).message}`);
  }
}

export async function GetSpaces(googleID: string) {
  if (!googleID) throw new Error('UNAUTHENTICATED REQUEST');
  try {
    const spaces = await prisma.passwordEntry.findMany({
      where: { userId: googleID },
      distinct: ['space'],
      select: {
        space: true,
      },
    });
    return spaces
      .map((entry) => entry.space)
      .filter((space): space is string => Boolean(space));
  } catch (error) {
    throw new Error(`FAILED TO GET SPACES: ${(error as Error).message}`);
  }
}

export async function DeleteCredential(id: string) {
  if (!id) throw new Error('ID IS REQUIRED');
  try {
    const response = await prisma.passwordEntry.delete({ where: { id } });
    return response;
  } catch (error) {
    throw new Error(`FAILED TO DELETE CRED: ${(error as Error).message}`);
  }
}

export async function GoogleLoginHandler() {
  await signIn('google');
}

export async function LogoutHandler() {
  return await signOut({ redirect: false });
}
