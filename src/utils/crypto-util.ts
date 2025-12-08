import { PasswordDataProp } from "@/components/main"

interface EncryptorReturnProp {
  encryptedBase64: string
  ivBase64: string
}

export async function Encryptor(
  input: string,
  key: CryptoKey,
  iv: Uint8Array
): Promise<EncryptorReturnProp> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }

  const inputBuffer = new TextEncoder().encode(input)

  // Converting iv.buffer to a true ArrayBuffer
  const ivArray = new Uint8Array(iv.buffer.slice(0))

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: ivArray as BufferSource,
    },
    key,
    inputBuffer
  )

  const encryptedBase64 = btoa(
    String.fromCharCode(...new Uint8Array(encryptedBuffer))
  )
  const ivBase64 = btoa(String.fromCharCode(...ivArray))

  return {
    encryptedBase64,
    ivBase64,
  }
}

export async function Decryptor(
  encryptedBase64: string,
  ivBase64: string,
  key: CryptoKey
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }

  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (char) =>
    char.charCodeAt(0)
  )

  const iv = Uint8Array.from(atob(ivBase64), (char) => char.charCodeAt(0))

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedBytes
  )

  return new TextDecoder().decode(decryptedBuffer)
}

export async function EncryptedObject() {}

export async function DecryptCredArray(
  data: PasswordDataProp[],
  key: CryptoKey
) {
  const decrypted = await Promise.all(
    data.map(async (record) => {
      const iv = record.iv
      const username = await Decryptor(record.username, iv, key)

      const password = await Decryptor(record.password, iv, key)

      const website = record.website
        ? await Decryptor(record.website, iv, key)
        : undefined

      return {
        id: record.id,
        username,
        password,
        website,
        space: record.space,
        iv,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }
    })
  )
  return decrypted
}
