import { randomBytes } from "crypto"

export function generateStrongPassword(length: number): string {
  const isClient = typeof window !== "undefined"
  if (!isClient)
    throw new Error("❌ This function should only run on the client side!")
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const allChars = upper + lower + numbers + symbols

  if (length < 4) {
    throw new Error("Password length must be at least 4 characters")
  }

  const getRandomChar = (chars: string): string => {
    const randomIndex = randomBytes(1)[0] % chars.length
    return chars.charAt(randomIndex)
  }

  const password = [
    getRandomChar(upper),
    getRandomChar(lower),
    getRandomChar(numbers),
    getRandomChar(symbols),
  ]

  for (let i = 4; i < length; i++) {
    password.push(getRandomChar(allChars))
  }

  // Shuffle with Fisher-Yates + secure randomness
  for (let i = password.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0] % (i + 1)
    ;[password[i], password[j]] = [password[j], password[i]]
  }

  return password.join("")
}
