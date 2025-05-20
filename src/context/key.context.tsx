"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getUserAESKeyRecord, SaveUserKeysInDB } from "@/actions/user"
import { loadAESKey, saveAESKey } from "@/utils/idb.util" // revised utils
import {
  decryptAESKey,
  deriveSymmetricKey,
  encryptAESKey,
  generateSymmetricKeyPair,
} from "@/utils/key-ops.util"
import { hashPassphrase } from "@/utils/passphrase.util"

import { useUser } from "./user.context"

type SymmetricKeyContextType = {
  key: CryptoKey | null
}

const KeyContext = createContext<SymmetricKeyContextType | null>(null)

export function KeyContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { passphrase_ctx: passphrase, googleID } = useUser()
  const [key, setKey] = useState<CryptoKey | null>(null)

  useEffect(() => {
    if (!passphrase || !googleID) return
    ;(async () => {
      const derivedKey = await deriveSymmetricKey(passphrase, googleID)

      // 1. Try to load AES key from IndexedDB
      const local = await loadAESKey()
      if (local) {
        const aesKey = await decryptAESKey(
          local.encryptedKey,
          local.iv,
          derivedKey
        )
        setKey(aesKey)
        return
      }

      // 2. Try to load from remote DB
      const remote = await getUserAESKeyRecord(googleID)
      if (remote) {
        await saveAESKey(remote.aesKey, remote.aesIV)
        const aesKey = await decryptAESKey(
          remote.aesKey,
          remote.aesIV,
          derivedKey
        )
        setKey(aesKey)
        return
      }

      // 3. First-time: generate new AES key and store it
      const { symmetricKey: aesKey } = await generateSymmetricKeyPair()
      const { encryptedKey, iv } = await encryptAESKey(aesKey, derivedKey)

      await saveAESKey(encryptedKey, iv)

      const passphraseWithPepper = await hashPassphrase(passphrase, googleID)
      await SaveUserKeysInDB({
        aesKey: encryptedKey,
        aesIV: iv,
        googleID,
        passphrase: passphraseWithPepper,
      })

      setKey(aesKey)
    })()
  }, [passphrase, googleID])

  return <KeyContext.Provider value={{ key }}>{children}</KeyContext.Provider>
}

export const useKey = (): SymmetricKeyContextType => {
  const context = useContext(KeyContext)
  if (!context)
    throw new Error("useKey must be used within SymmetricKeyContext")
  return context
}
