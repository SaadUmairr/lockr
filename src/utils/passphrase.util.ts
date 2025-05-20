import bcrypt from "bcryptjs"

export async function hashPassphrase(passphrase: string, googleID: string) {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  // const PEPPER = await getHashSecret();

  // const passphraseUnique = passphrase + PEPPER + googleID;
  const passphraseUnique = passphrase + googleID
  try {
    const hashedPassphrase = await bcrypt.hash(passphraseUnique, 12)
    return hashedPassphrase
  } catch (error) {
    throw new Error(`UNABLE TO HASH: ${(error as Error).message}`)
  }
}

export async function PassphrasePepper(passphrase: string, googleID: string) {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  // const PEPPER = await getHashSecret();
  // const passphraseUnique = passphrase + PEPPER + googleID;
  const passphraseUnique = passphrase + googleID

  return passphraseUnique
}
