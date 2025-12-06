import { IDBPDatabase, openDB } from "idb"

import { PasswordDataProp } from "@/components/main"

const DB_NAME = "secureStore"
const DB_VERSION = 1

const STORE_KEYS = {
  AES: "aes",
  PASSPHRASE: "passphrase",
  SPACES: "spaces",
  PASSWORDS: "passwords",
}

export interface AESKeyRecord {
  id: "aes-key"
  encryptedKey: string
  iv: string
}

async function getDB(): Promise<IDBPDatabase> {
  try {
    return await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_KEYS.AES)) {
          db.createObjectStore(STORE_KEYS.AES, { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains(STORE_KEYS.PASSPHRASE)) {
          db.createObjectStore(STORE_KEYS.PASSPHRASE, { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains(STORE_KEYS.SPACES)) {
          db.createObjectStore(STORE_KEYS.SPACES)
        }
        if (!db.objectStoreNames.contains(STORE_KEYS.PASSWORDS)) {
          db.createObjectStore(STORE_KEYS.PASSWORDS, { keyPath: "id" })
        }
      },
    })
  } catch (error) {
    console.error("Failed to open IndexedDB:", error)
    throw new Error(
      `IndexedDB initialization failed: ${(error as Error).message}`
    )
  }
}

// ===== AES KEY =====
export async function saveAESKey(
  encryptedKey: string,
  iv: string
): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE_KEYS.AES, "readwrite")
    await tx.objectStore(STORE_KEYS.AES).put({
      id: "aes-key",
      encryptedKey,
      iv,
    })
    await tx.done
  } catch (error) {
    console.error("saveAESKey error:", error)
    throw new Error(`Failed to save AES key: ${(error as Error).message}`)
  }
}

export async function loadAESKey(): Promise<AESKeyRecord | null> {
  try {
    const db = await getDB()
    const record = await db
      .transaction(STORE_KEYS.AES, "readonly")
      .objectStore(STORE_KEYS.AES)
      .get("aes-key")
    return record ?? null
  } catch (error) {
    console.error("loadAESKey error:", error)
    return null
  }
}

// ===== PASSPHRASE =====
export async function savePassphraseLocally(passphrase: string): Promise<void> {
  try {
    const db = await getDB()
    await db.put(STORE_KEYS.PASSPHRASE, { id: "passphrase", data: passphrase })
  } catch (error) {
    console.error("savePassphraseLocally error:", error)
    throw new Error(`Failed to save passphrase: ${(error as Error).message}`)
  }
}

export async function loadPassphrase(): Promise<string | null> {
  try {
    const db = await getDB()
    const record = await db
      .transaction(STORE_KEYS.PASSPHRASE, "readonly")
      .objectStore(STORE_KEYS.PASSPHRASE)
      .get("passphrase")
    return record?.data ?? null
  } catch (error) {
    console.error("loadPassphrase error:", error)
    return null
  }
}

export async function clearPassphrase(): Promise<void> {
  try {
    const db = await getDB()
    await db.delete(STORE_KEYS.PASSPHRASE, "passphrase")
  } catch (error) {
    console.error("clearPassphrase error:", error)
    throw new Error(`Failed to clear passphrase: ${(error as Error).message}`)
  }
}

// ===== SPACES (string[]) =====
export async function saveSpaces(spaces: string[]): Promise<void> {
  try {
    const db = await getDB()
    await db.put(STORE_KEYS.SPACES, spaces, "spaceList")
  } catch (error) {
    console.error("saveSpaces error:", error)
    throw new Error(`Failed to save spaces: ${(error as Error).message}`)
  }
}

export async function loadSpaces(): Promise<string[]> {
  try {
    const db = await getDB()
    return (await db.get(STORE_KEYS.SPACES, "spaceList")) || []
  } catch (error) {
    console.error("loadSpaces error:", error)
    return []
  }
}

export async function clearSpaces(): Promise<void> {
  try {
    const db = await getDB()
    await db.delete(STORE_KEYS.SPACES, "spaceList")
  } catch (error) {
    console.error("clearSpaces error:", error)
    throw new Error(`Failed to clear spaces: ${(error as Error).message}`)
  }
}

// ===== PASSWORDS =====
export async function GetLocalPasswords(): Promise<PasswordDataProp[]> {
  try {
    const db = await getDB()
    return await db.getAll(STORE_KEYS.PASSWORDS)
  } catch (error) {
    console.error("GetLocalPasswords error:", error)
    return []
  }
}

export async function SaveLocalPasswords(
  data: PasswordDataProp[]
): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE_KEYS.PASSWORDS, "readwrite")
    const store = tx.objectStore(STORE_KEYS.PASSWORDS)
    await store.clear()

    for (const item of data) {
      await store.put(item)
    }

    await tx.done
  } catch (error) {
    console.error("SaveLocalPasswords error:", error)
    throw new Error(`Failed to save passwords: ${(error as Error).message}`)
  }
}

export async function appendLocalPassword(
  item: PasswordDataProp
): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE_KEYS.PASSWORDS, "readwrite")
    await tx.objectStore(STORE_KEYS.PASSWORDS).put(item)
    await tx.done
  } catch (error) {
    console.error("appendLocalPassword error:", error)
    throw new Error(`Failed to append password: ${(error as Error).message}`)
  }
}

export async function deleteLocalPassword(id: string): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE_KEYS.PASSWORDS, "readwrite")
    await tx.objectStore(STORE_KEYS.PASSWORDS).delete(id)
    await tx.done
  } catch (error) {
    console.error("deleteLocalPassword error:", error)
    throw new Error(`Failed to delete password: ${(error as Error).message}`)
  }
}

// ===== GENERAL CLEAR =====
export async function clearStore(
  storeName: keyof typeof STORE_KEYS
): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE_KEYS[storeName], "readwrite")
    await tx.objectStore(STORE_KEYS[storeName]).clear()
    await tx.done
  } catch (error) {
    console.error(`clearStore ${storeName} error:`, error)
    throw new Error(`Failed to clear store: ${(error as Error).message}`)
  }
}

// ===== CLEAR ALL DATA (for logout) =====
export async function clearAllLocalData(): Promise<void> {
  try {
    await clearStore("AES")
    await clearStore("PASSPHRASE")
    await clearStore("SPACES")
    await clearStore("PASSWORDS")
  } catch (error) {
    console.error("clearAllLocalData error:", error)
    throw new Error(`Failed to clear all data: ${(error as Error).message}`)
  }
}
