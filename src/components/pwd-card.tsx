"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"
import {
  Copy,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  MoreVertical,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { PasswordDataProp } from "./main"
import { Badge } from "./ui/badge"

interface PasswordCardProps extends PasswordDataProp {
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

// Constants
const FAVICON_BASE_URL = "https://www.google.com/s2/favicons?domain="
const PASSWORD_VISIBILITY_TIMEOUT = 5000
const MASKED_PASSWORD = "••••••••••••"

export function PasswordCard({
  id,
  website,
  username,
  password,
  space,
  onEdit,
  onDelete,
}: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Memoized computations
  const userInitial = useMemo(() => {
    return username ? username.charAt(0).toUpperCase() : "?"
  }, [username])

  const { domain, faviconUrl, visitUrl } = useMemo(() => {
    if (!website) return { domain: "—", faviconUrl: null, visitUrl: null }

    try {
      const prefixedWebsite = website.startsWith("http")
        ? website
        : `https://${website}`
      const url = new URL(prefixedWebsite)
      const hostname = url.hostname.replace(/^www\./, "")

      return {
        domain: hostname,
        faviconUrl: `${FAVICON_BASE_URL}${hostname}&sz=64`,
        visitUrl: prefixedWebsite,
      }
    } catch {
      // Fallback for invalid URLs
      const fallbackDomain = website
        .replace(/^https?:\/\//, "")
        .split("/")[0]
        .replace(/^www\./, "")

      return {
        domain: fallbackDomain,
        faviconUrl: null,
        visitUrl: website.startsWith("http") ? website : `https://${website}`,
      }
    }
  }, [website])

  // Optimized clipboard function with error handling
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
      copyToClipboard(password, "Password")

      // Auto-hide password after timeout
      timeoutRef.current = setTimeout(() => {
        setShowPassword(false)
        timeoutRef.current = null
      }, PASSWORD_VISIBILITY_TIMEOUT)
    } else {
      setShowPassword(false)
    }
  }, [showPassword, password, copyToClipboard])

  // Website visit handler
  const handleVisitWebsite = useCallback(() => {
    if (!visitUrl) return

    try {
      window.open(visitUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      toast.error("Failed to open website")
    }
  }, [visitUrl])

  // Delete handlers
  const handleDeleteConfirm = useCallback(() => {
    onDelete?.(id)
    setDeleteDialog(false)
  }, [id, onDelete])

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog(false)
  }, [])

  // Edit handler
  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(id)
    } else {
      toast("👨🏻‍💻 WORK IN PROGRESS")
    }
  }, [id, onEdit])

  // Copy username handler
  const handleCopyUsername = useCallback(() => {
    copyToClipboard(username, "Username")
  }, [username, copyToClipboard])

  // Copy password handler
  const handleCopyPassword = useCallback(() => {
    copyToClipboard(password, "Password")
  }, [password, copyToClipboard])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <Card className="group relative w-full max-w-full min-w-0 border border-gray-200 bg-white transition-all hover:shadow-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl dark:border-gray-700 dark:bg-zinc-900">
        <Badge
          variant="secondary"
          className="absolute top-2.5 right-2 z-10"
          aria-label={`Space: ${space}`}
        >
          {space}
        </Badge>

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
                  title={website ? `Visit ${website}` : undefined}
                  className="hover:text-primary flex cursor-pointer items-center truncate rounded-sm text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  onClick={handleVisitWebsite}
                  disabled={!visitUrl}
                  aria-label={`Visit ${domain}`}
                >
                  {domain}
                  {website && (
                    <ExternalLink
                      className="ml-1 h-3 w-3 flex-shrink-0 opacity-70"
                      aria-hidden="true"
                    />
                  )}
                </button>

                <button
                  type="button"
                  title={`Copy username: ${username}`}
                  className="flex min-w-0 items-center gap-1 rounded-sm text-left text-xs text-gray-500 transition-colors hover:text-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                  onClick={handleCopyUsername}
                  aria-label={`Copy username ${username}`}
                >
                  <span className="truncate">{username}</span>
                  <Copy
                    className="h-2.5 w-2.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-70"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <div className="flex-shrink-0">
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
                    onClick={handleEdit}
                    className="cursor-pointer"
                    disabled={!onEdit}
                  >
                    <Edit className="mr-2 h-3.5 w-3.5" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteDialog(true)}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    disabled={!onDelete}
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
                    {showPassword ? password : MASKED_PASSWORD}
                  </div>

                  {showPassword ? (
                    <EyeOff className="ml-1 h-3.5 w-3.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="ml-1 h-3.5 w-3.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                  )}
                </Button>
              </div>

              <Button
                variant="secondary"
                size="icon"
                title="Copy password"
                className="h-8 w-8 flex-shrink-0 border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                onClick={handleCopyPassword}
                aria-label="Copy password"
              >
                <Copy className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deletion Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              credential for {domain}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleDeleteCancel} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleDeleteConfirm} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
