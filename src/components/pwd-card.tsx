"use client"

import { useState } from "react"
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

interface PasswordCardProp extends PasswordDataProp {
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PasswordCard({
  id,
  website,
  username,
  password,
  space,
  onEdit,
  onDelete,
}: PasswordCardProp) {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  // const [editDialog, setEditDialog] = useState<boolean>(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch {
      toast.error(`Failed to copy ${label}`)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
    if (!showPassword) {
      copyToClipboard(password, "Password")
    }
    setTimeout(() => setShowPassword(false), 5000)
  }

  const getInitial = () => {
    return username ? username.charAt(0).toUpperCase() : "?"
  }

  const getFaviconUrl = (): string | null => {
    if (!website) return null
    try {
      // Ensure protocol exists for URL constructor
      const prefixedWebsite = website.startsWith("http")
        ? website
        : `https://${website}`
      const url = new URL(prefixedWebsite)
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
    } catch (e) {
      console.error("Error creating URL for favicon:", e)
      return null
    }
  }

  const faviconUrl = getFaviconUrl()

  const getDomain = () => {
    if (!website) return "—"
    try {
      const prefixedWebsite = website.startsWith("http")
        ? website
        : `https://${website}`
      const url = new URL(prefixedWebsite)
      return url.hostname.replace(/^www\./, "")
    } catch {
      return website
        .replace(/^https?:\/\//, "")
        .split("/")[0]
        .replace(/^www\./, "")
    }
  }

  const visitWebsite = () => {
    if (!website) return
    window.open(
      website.startsWith("http") ? website : `https://${website}`,
      "_blank",
      "noopener noreferrer"
    )
  }

  return (
    <>
      <Card className="group relative w-full max-w-full min-w-0 border border-gray-200 bg-white transition-all hover:shadow-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl dark:border-gray-700 dark:bg-zinc-900">
        <Badge variant="secondary" className="absolute top-2.5 right-2 z-10">
          {space}
        </Badge>
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar>
                <AvatarImage
                  src={faviconUrl ?? undefined}
                  alt={`${getDomain()} favicon`}
                />
                <AvatarFallback>{getInitial()}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <div
                  title={website ?? undefined}
                  className="hover:text-primary flex cursor-pointer items-center truncate text-sm font-medium"
                  onClick={visitWebsite}
                >
                  {getDomain()}
                  {website && (
                    <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0 opacity-70" />
                  )}
                </div>
                <button
                  title={`Copy username: ${username}`}
                  className="flex min-w-0 items-center gap-1 text-left text-xs text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                  onClick={() => copyToClipboard(username, "Username")}
                >
                  <span className="truncate">{username}</span>
                  <Copy className="h-2.5 w-2.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-70" />
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
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 dark:bg-zinc-800"
                >
                  <DropdownMenuItem
                    // onClick={() => onEdit?.(id)}
                    onClick={() => {
                      toast("👨🏻‍💻 WORK IN PROGRESS")
                    }}
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
                >
                  <div className="max-w-[calc(100%-20px)] truncate overflow-hidden text-left">
                    {showPassword ? password : "••••••••••••"}
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
                onClick={() => copyToClipboard(password, "Password")}
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
              credential.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setDeleteDialog(false)}>Close</Button>
            </DialogClose>
            <Button onClick={() => onDelete?.(id)} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
