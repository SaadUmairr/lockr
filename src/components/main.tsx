"use client"

import { useEffect, useState } from "react"
import { DeleteCredential, GetCredentials } from "@/actions/user"
import { useData } from "@/context/data.context"
import { useKey } from "@/context/key.context"
import { useUser } from "@/context/user.context"
import { DecryptCredArray } from "@/utils/crypto.util"
import {
  deleteLocalPassword,
  GetLocalPasswords,
  SaveLocalPasswords,
} from "@/utils/idb.util"
import { toast } from "sonner"

import { PasswordCard } from "./pwd-card"

export interface PasswordDataProp {
  id: string
  website?: string
  username: string
  password: string
  space?: string
  iv: string
  createdAt: Date
  updatedAt: Date
}

export function Main() {
  const { key } = useKey()
  const { googleID } = useUser()
  const {
    pwdFields,
    setPwdFields,
    selectedSpace,
    sortAlphabatically,
    sortByCreation,
  } = useData()
  const [allDecrypted, setAllDecrypted] = useState<PasswordDataProp[]>([])

  useEffect(() => {
    if (!key || !googleID) return
    ;(async () => {
      const localData = await GetLocalPasswords()
      if (localData && localData.length > 0) {
        const decryptedCreds = await DecryptCredArray(localData, key)
        setPwdFields(decryptedCreds)
        setAllDecrypted(decryptedCreds)

        return
      }

      const remoteData = await GetCredentials(googleID)
      if (remoteData && remoteData.length > 0) {
        const formattedRemoteData = remoteData.map((item) => ({
          id: item.id,
          website: item.website ?? undefined,
          username: item.username,
          password: item.password,
          space: item.space,
          iv: item.iv,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))

        await SaveLocalPasswords(formattedRemoteData)

        const decryptedCreds = await DecryptCredArray(formattedRemoteData, key)

        setPwdFields(decryptedCreds)
        setAllDecrypted(decryptedCreds)
      }
    })()
  }, [key, googleID])

  useEffect(() => {
    setPwdFields(allDecrypted)
    if (selectedSpace !== "all")
      setPwdFields((prev) => prev.filter((r) => r.space === selectedSpace))
  }, [selectedSpace])

  useEffect(() => {
    let sorted = [...allDecrypted]

    if (sortAlphabatically) {
      sorted.sort(
        (a, b) =>
          a.website
            ?.toLowerCase()
            .localeCompare(b.website?.toLowerCase() || "") || 0
      )
    } else if (sortByCreation) {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }

    if (selectedSpace !== "all") {
      sorted = sorted.filter((r) => r.space === selectedSpace)
    }

    setPwdFields(sorted)
  }, [sortAlphabatically, sortByCreation, allDecrypted, selectedSpace])

  async function handleEdit(id: string) {
    toast(`WORK IN PROGRESS: ${id[0]}`)
    // TODO: WRITE API TO EDIT
  }

  async function handleDelete(id: string) {
    const deleteToast = toast.loading("Deleting...")
    try {
      await DeleteCredential(id)
      await deleteLocalPassword(id)
      setPwdFields((prev) => prev.filter((r) => r.id !== id))
      toast.success("Deleted ", { id: deleteToast })
    } catch (error) {
      toast.error(`FAILED TO DELETE: ${(error as Error).message}`, {
        id: deleteToast,
      })
    }
  }

  return (
    <div className="">
      {(pwdFields.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pwdFields.map((record) => (
            <PasswordCard
              key={record.id}
              {...record}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )) || (
        <div className="mt-3 rounded-xl border-2 border-dashed border-gray-800 px-4 py-2 dark:border-gray-300">
          <p className="text-muted-foreground text-center select-none">
            Looks like your &nbsp;
            <span className="font-bold text-amber-500 dark:invert">
              {selectedSpace}
            </span>
            &nbsp; space is empty! <br />
            Hit the + button to start adding credentials
          </p>
        </div>
      )}
    </div>
  )
}
