export async function generateSymmetricKeyPair() {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  try {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    );
    const exportedKeyBase64 = await crypto.subtle.exportKey('raw', key);
    return {
      symmetricKey: key,
      exportedKey: btoa(
        String.fromCharCode(...new Uint8Array(exportedKeyBase64)),
      ),
      rawSymmetricKey: exportedKeyBase64,
    };
  } catch (error) {
    throw new Error(
      `Error generating symmetric key: ${(error as Error).message}`,
    );
  }
}
// EXPORT METHODS

export async function exportKeyToBase64(
  key: CryptoKey,
  type: 'public' | 'private',
): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const exportedKey = await crypto.subtle.exportKey(
    type === 'public' ? 'spki' : 'pkcs8',
    key,
  );
  return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
}

export function base64ToArrayBuffer(base64: string): Uint8Array {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++)
    bytes[i] = binaryString.charCodeAt(i);

  return bytes;
}

export function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      '',
    ),
  );
}

// KEY IMPORT, DERIVATION, ENCRYPTION AND DECRYPTION

export async function deriveSymmetricKey(
  passphrase: string,
  googleID: string,
): Promise<CryptoKey> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(googleID),
      iterations: 200000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function deriveEncryptionKey(
  passphrase: string,
  googleID: string,
): Promise<CryptoKey> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(googleID),
      iterations: 200000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
}
export async function encryptAESKey(
  aesKey: CryptoKey,
  derivedKey: CryptoKey,
): Promise<{
  encryptedKey: string;
  iv: string;
}> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const rawKey = await crypto.subtle.exportKey('raw', aesKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    derivedKey,
    rawKey,
  );

  return {
    encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptAESKey(
  encryptedKeyBase64: string,
  ivBase64: string,
  derivedKey: CryptoKey,
): Promise<CryptoKey> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const encryptedKey = Uint8Array.from(atob(encryptedKeyBase64), (c) =>
    c.charCodeAt(0),
  );
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const rawKey = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    derivedKey,
    encryptedKey,
  );

  return await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt'],
  );
}
