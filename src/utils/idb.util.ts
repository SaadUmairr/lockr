import { PasswordDataProp } from '@/components/main';
import { IDBPDatabase, openDB } from 'idb';

const DB_NAME = 'secureStore';
const DB_VERSION = 1;

const STORE_KEYS = {
  AES: 'aes',
  PASSPHRASE: 'passphrase',
  SPACES: 'spaces',
  PASSWORDS: 'passwords',
};

export interface AESKeyRecord {
  id: 'aes-key';
  encryptedKey: string;
  iv: string;
}

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_KEYS.AES)) {
        db.createObjectStore(STORE_KEYS.AES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_KEYS.PASSPHRASE)) {
        db.createObjectStore(STORE_KEYS.PASSPHRASE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_KEYS.SPACES)) {
        db.createObjectStore(STORE_KEYS.SPACES);
      }
      if (!db.objectStoreNames.contains(STORE_KEYS.PASSWORDS)) {
        db.createObjectStore(STORE_KEYS.PASSWORDS, { keyPath: 'id' });
      }
    },
  });
}

// ===== AES KEY =====
export async function saveAESKey(
  encryptedKey: string,
  iv: string,
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_KEYS.AES, 'readwrite');
  await tx.objectStore(STORE_KEYS.AES).put({
    id: 'aes-key',
    encryptedKey,
    iv,
  });
  await tx.done;
}

export async function loadAESKey(): Promise<AESKeyRecord | null> {
  const db = await getDB();
  return (
    (await db
      .transaction(STORE_KEYS.AES, 'readonly')
      .objectStore(STORE_KEYS.AES)
      .get('aes-key')) ?? null
  );
}

// ===== PASSPHRASE =====
export async function savePassphraseLocally(passphrase: string): Promise<void> {
  const db = await getDB();
  await db.put(STORE_KEYS.PASSPHRASE, { id: 'passphrase', data: passphrase });
}

export async function loadPassphrase(): Promise<string | null> {
  const db = await getDB();
  const record = await db
    .transaction(STORE_KEYS.PASSPHRASE, 'readonly')
    .objectStore(STORE_KEYS.PASSPHRASE)
    .get('passphrase');
  return record?.data ?? null;
}

// ===== SPACES (string[]) =====
export async function saveSpaces(spaces: string[]): Promise<void> {
  const db = await getDB();
  await db.put(STORE_KEYS.SPACES, spaces, 'spaceList');
}

export async function loadSpaces(): Promise<string[]> {
  const db = await getDB();
  return (await db.get(STORE_KEYS.SPACES, 'spaceList')) || [];
}

export async function clearSpaces(): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_KEYS.SPACES, 'spaceList');
}

// ===== GENERAL CLEAR (if needed) =====
export async function clearStore(
  storeName: keyof typeof STORE_KEYS,
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_KEYS[storeName], 'readwrite');
  await tx.objectStore(STORE_KEYS[storeName]).clear();
  await tx.done;
}

export async function GetLocalPasswords(): Promise<PasswordDataProp[]> {
  const db = await getDB();
  return await db.getAll(STORE_KEYS.PASSWORDS);
}

export async function SaveLocalPasswords(
  data: PasswordDataProp[],
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_KEYS.PASSWORDS, 'readwrite');
  const store = tx.objectStore(STORE_KEYS.PASSWORDS);
  await store.clear();

  for (const item of data) await store.put(item);

  await tx.done;
}

export async function appendLocalPassword(
  item: PasswordDataProp,
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_KEYS.PASSWORDS, 'readwrite');
  await tx.objectStore(STORE_KEYS.PASSWORDS).put(item);
  await tx.done;
}

export async function deleteLocalPassword(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_KEYS.PASSWORDS, 'readwrite');
  await tx.objectStore(STORE_KEYS.PASSWORDS).delete(id);
  await tx.done;
}
