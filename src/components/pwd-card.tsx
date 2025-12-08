"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DeleteCredential, SaveCredentials } from "@/actions/user"
import { useData } from "@/context/data-context"
import { useKey } from "@/context/key-context"
import { useUser } from "@/context/user-context"
import { Encryptor } from "@/utils/crypto-util"
import { appendLocalPassword, deleteLocalPassword } from "@/utils/idb.util"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Copy,
  Edit,
  ExternalLink,
  Eye,
  EyeIcon,
  EyeOff,
  EyeOffIcon,
  MoreVertical,
  SaveIcon,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { PasswordDataProp } from "./main"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group"

const editSchema = z.object({
  website: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type EditFormData = z.infer<typeof editSchema>

interface PasswordCardProps {
  data: PasswordDataProp
}

// Constants
const FAVICON_BASE_URL = "https://www.google.com/s2/favicons?domain="
const PASSWORD_VISIBILITY_TIMEOUT = 5000
const MASKED_PASSWORD = "••••••••••••"

export function PasswordCard({ data }: PasswordCardProps) {
  const { key } = useKey()
  const { googleID } = useUser()
  const { setPwdFields, setAllDecrypted } = useData()

  const [showPassword, setShowPassword] = useState(false)
  const [editPasswordVisible, setEditPasswordVisible] = useState(false)
  const [copied, setCopied] = useState<"username" | "password" | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      website: data.website || "",
      username: data.username,
      password: data.password,
    },
  })

  // Memoized computations
  const userInitial = useMemo(() => {
    return data.username ? data.username.charAt(0).toUpperCase() : "?"
  }, [data.username])

  const { domain, faviconUrl, visitUrl } = useMemo(() => {
    if (!data.website) return { domain: "—", faviconUrl: null, visitUrl: null }

    try {
      const prefixedWebsite = data.website.startsWith("http")
        ? data.website
        : `https://${data.website}`
      const url = new URL(prefixedWebsite)
      const hostname = url.hostname.replace(/^www\./, "")

      return {
        domain: hostname,
        faviconUrl: `${FAVICON_BASE_URL}${hostname}&sz=64`,
        visitUrl: prefixedWebsite,
      }
    } catch {
      // Fallback for invalid URLs
      const fallbackDomain = data.website
        .replace(/^https?:\/\//, "")
        .split("/")[0]
        .replace(/^www\./, "")

      return {
        domain: fallbackDomain,
        faviconUrl: null,
        visitUrl: data.website.startsWith("http")
          ? data.website
          : `https://${data.website}`,
      }
    }
  }, [data.website])

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    if (!text) {
      toast.error(`No ${label.toLowerCase()} to copy`)
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.opacity = "0"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        toast.success(`${label} copied to clipboard`)
      } catch (fallbackError) {
        toast.error(`Failed to copy ${label}`)
      }
    }
  }, [])

  // Optimized password visibility toggle
  const togglePasswordVisibility = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!showPassword) {
      setShowPassword(true)
      copyToClipboard(data.password, "Password")

      // Auto-hide password after timeout
      timeoutRef.current = setTimeout(() => {
        setShowPassword(false)
        timeoutRef.current = null
      }, PASSWORD_VISIBILITY_TIMEOUT)
    } else {
      setShowPassword(false)
    }
  }, [showPassword, data.password, copyToClipboard])

  // Website visit handler
  const handleVisitWebsite = useCallback(() => {
    if (!visitUrl) return

    try {
      window.open(visitUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      toast.error("Failed to open website")
    }
  }, [visitUrl])

  const handleEdit = useCallback(
    async (values: EditFormData) => {
      if (!key) {
        toast.error("Encryption key missing")
        return
      }

      setLoading(true)
      const toastId = toast.loading("Updating credential...")

      try {
        // Generate new IV for re-encryption
        const iv = crypto.getRandomValues(new Uint8Array(12))

        // Encrypt new values
        const [usernameResult, passwordResult, websiteResult] =
          await Promise.all([
            Encryptor(values.username, key, iv),
            Encryptor(values.password, key, iv),
            values.website ? Encryptor(values.website, key, iv) : null,
          ])

        // Delete old entry
        await DeleteCredential(data.id)
        await deleteLocalPassword(data.id)

        // Save new encrypted entry
        const dbResponse = await SaveCredentials({
          userId: googleID,
          space: data.space,
          website: websiteResult?.encryptedBase64 ?? null,
          username: usernameResult.encryptedBase64,
          password: passwordResult.encryptedBase64,
          iv: usernameResult.ivBase64,
        })

        const updatedEntry: PasswordDataProp = {
          id: dbResponse.id,
          username: values.username,
          password: values.password,
          space: data.space,
          website: values.website,
          iv: dbResponse.iv,
          createdAt: dbResponse.createdAt,
          updatedAt: dbResponse.updatedAt,
        }

        // Update state
        setPwdFields((prev) =>
          prev.map((item) => (item.id === data.id ? updatedEntry : item))
        )
        setAllDecrypted((prev) =>
          prev.map((item) => (item.id === data.id ? updatedEntry : item))
        )

        await appendLocalPassword({
          ...dbResponse,
          website: dbResponse.website ?? undefined,
        } as PasswordDataProp)

        toast.success("Credential updated", { id: toastId })
        setEditDialogOpen(false)
      } catch (error) {
        console.error("Edit credential error:", error)
        toast.error("Failed to update credential", { id: toastId })
      } finally {
        setLoading(false)
      }
    },
    [key, data, googleID, setPwdFields, setAllDecrypted]
  )

  const handleDelete = useCallback(async () => {
    setLoading(true)
    const toastId = toast.loading("Deleting...")

    try {
      await DeleteCredential(data.id)
      await deleteLocalPassword(data.id)

      setPwdFields((prev) => prev.filter((item) => item.id !== data.id))
      setAllDecrypted((prev) => prev.filter((item) => item.id !== data.id))

      toast.success("Credential deleted", { id: toastId })
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Delete credential error:", error)
      toast.error("Failed to delete credential", { id: toastId })
    } finally {
      setLoading(false)
    }
  }, [data.id, setPwdFields, setAllDecrypted])

  const handleEditDialogChange = useCallback(
    (open: boolean) => {
      setEditDialogOpen(open)
      if (open) {
        form.reset({
          website: data.website || "",
          username: data.username,
          password: data.password,
        })
        setEditPasswordVisible(false)
      }
    },
    [data, form]
  )

  // Copy handlers for compatibility
  const handleCopyUsername = useCallback(() => {
    copyToClipboard(data.username, "Username")
  }, [data.username, copyToClipboard])

  const handleCopyPassword = useCallback(() => {
    copyToClipboard(data.password, "Password")
  }, [data.password, copyToClipboard])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        layout
      >
        <Card className="group relative w-full max-w-full min-w-0 border border-gray-200 bg-white transition-all hover:shadow-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl dark:border-gray-700 dark:bg-zinc-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar>
                  <AvatarImage
                    src={faviconUrl ?? undefined}
                    alt={`${domain} favicon`}
                    loading="lazy"
                  />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-col">
                  <button
                    type="button"
                    title={data.website ? `Visit ${data.website}` : undefined}
                    className="hover:text-primary flex cursor-pointer items-center truncate rounded-sm text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    onClick={handleVisitWebsite}
                    disabled={!visitUrl}
                    aria-label={`Visit ${domain}`}
                  >
                    {domain}
                    {data.website && (
                      <ExternalLink
                        className="ml-1 h-3 w-3 shrink-0 opacity-70"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    title={`Copy username: ${data.username}`}
                    className="flex min-w-0 items-center gap-1 rounded-sm text-left text-xs text-gray-500 transition-colors hover:text-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                    onClick={handleCopyUsername}
                    aria-label={`Copy username ${data.username}`}
                  >
                    <span className="truncate">{data.username}</span>
                    <Copy
                      className="h-2.5 w-2.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-70"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <div className="shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full opacity-50 transition-opacity group-hover:opacity-100"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-36 dark:bg-zinc-800"
                  >
                    <DropdownMenuItem
                      onClick={() => setEditDialogOpen(true)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteDialogOpen(true)}
                      className="cursor-pointer text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Password Section */}
            <div className="mt-3">
              <div className="flex w-full items-center gap-2">
                <div className="flex-1 overflow-hidden">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-full justify-between border border-gray-200 bg-gray-50 font-mono text-xs hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show and copy password"
                    }
                  >
                    <div className="max-w-[calc(100%-20px)] truncate overflow-hidden text-left">
                      {showPassword ? data.password : MASKED_PASSWORD}
                    </div>

                    {showPassword ? (
                      <EyeOff className="ml-1 h-3.5 w-3.5 shrink-0 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Eye className="ml-1 h-3.5 w-3.5 shrink-0 text-gray-500 dark:text-gray-400" />
                    )}
                  </Button>
                </div>

                <Button
                  variant="secondary"
                  size="icon"
                  title="Copy password"
                  className="h-8 w-8 shrink-0 border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  onClick={handleCopyPassword}
                  aria-label="Copy password"
                >
                  <Copy className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Credential</DialogTitle>
            <DialogDescription>
              Update your credential information
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEdit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example.com"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username / Email</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type={editPasswordVisible ? "text" : "password"}
                          disabled={loading}
                          {...field}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              setEditPasswordVisible((prev) => !prev)
                            }
                          >
                            {editPasswordVisible ? (
                              <EyeOffIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {editPasswordVisible
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Credential?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              credential for &nbsp;
              <span className="font-semibold">
                {data.website || data.username}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
