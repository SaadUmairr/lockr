"use client"

import { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogoutHandler } from "@/actions/user"
import { useData } from "@/context/data-context"
import { saveSpaces } from "@/utils/idb.util"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowDownAZIcon,
  ArrowUpDownIcon,
  Clock,
  LogOutIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  Dialog,
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
  DropdownMenuLabel,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ThemeToggler from "@/components/theme-toggle"

const formSchema = z.object({
  space: z
    .string()
    .min(2, "Space must be at least 2 characters")
    .max(20, "Space name too long")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Only letters, numbers, hyphens and underscores"
    ),
})

type FormData = z.infer<typeof formSchema>

export function Navbar() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const {
    space,
    setSpace,
    selectedSpace,
    setSelectedSpace,
    sortAlphabatically,
    setSortAlphabatically,
    sortByCreation,
    setSortByCreation,
    searchQuery,
    setSearchQuery,
  } = useData()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      space: "",
    },
  })

  const handleLogout = useCallback(async () => {
    try {
      await LogoutHandler()
      router.push("/")
    } catch (error) {
      toast.error("Logout failed")
    }
  }, [router])

  const handleSort = useCallback(
    (type: "creation" | "alphabetical") => {
      if (type === "creation") {
        setSortByCreation(true)
        setSortAlphabatically(false)
      } else {
        setSortAlphabatically(true)
        setSortByCreation(false)
      }
    },
    [setSortByCreation, setSortAlphabatically]
  )

  const createNewSpace = useCallback(
    async (values: FormData) => {
      if (loading) return

      setLoading(true)
      try {
        const newSpace = values.space.trim().toLowerCase()

        if (space.some((s) => s.toLowerCase() === newSpace)) {
          form.setError("space", { message: "Space already exists" })
          return
        }

        const updated = [...space, values.space.trim()]
        setSpace(updated)
        await saveSpaces(updated)

        toast.success(`Space "${values.space}" created`)
        form.reset()
        setDialogOpen(false)
      } catch (error) {
        toast.error("Failed to create space")
      } finally {
        setLoading(false)
      }
    },
    [loading, space, setSpace, form]
  )

  const currentSort = useMemo(() => {
    if (sortByCreation) return "creation"
    if (sortAlphabatically) return "alphabetical"
    return "none"
  }, [sortByCreation, sortAlphabatically])

  return (
    <>
      {/* Floating Navbar */}
      <nav className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2">
        <div className="rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/main" className="flex shrink-0 items-center gap-2">
              <Image
                src="/key96.svg"
                alt="lockr"
                width={24}
                height={24}
                className="dark:invert"
                priority
              />
              <span className="hidden text-lg font-semibold sm:inline">
                lock<span className="text-amber-500 dark:invert">r</span>
              </span>
            </Link>

            {/* Desktop Controls */}
            {!isMobile && (
              <div className="flex max-w-2xl flex-1 items-center gap-3">
                {/* Space Selector */}
                <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Space" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Spaces</SelectItem>
                    <DropdownMenuSeparator />
                    {space.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => setDialogOpen(true)}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      New Space
                    </Button>
                  </SelectContent>
                </Select>

                {/* Search */}
                <div className="relative max-w-md flex-1">
                  <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search passwords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-9 pl-9"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                      onClick={() => setSearchQuery("")}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Sort Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleSort("creation")}
                      className="gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      <span>Creation Date</span>
                      {currentSort === "creation" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort("alphabetical")}
                      className="gap-2"
                    >
                      <ArrowDownAZIcon className="h-4 w-4" />
                      <span>Alphabetically</span>
                      {currentSort === "alphabetical" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <ThemeToggler />

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOutIcon className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MenuIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Spaces</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <Select
                      value={selectedSpace}
                      onValueChange={setSelectedSpace}
                    >
                      <SelectTrigger className="mx-2 my-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Spaces</SelectItem>
                        <DropdownMenuSeparator />
                        {space.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      New Space
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Sort</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleSort("creation")}>
                      <Clock className="mr-2 h-4 w-4" />
                      Creation Date
                      {currentSort === "creation" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort("alphabetical")}
                    >
                      <ArrowDownAZIcon className="mr-2 h-4 w-4" />
                      Alphabetically
                      {currentSort === "alphabetical" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <div className="px-2 py-1">
                      <ThemeToggler className="w-full" />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 dark:text-red-400"
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Search Bar */}
          {isMobile && searchOpen && (
            <div className="mt-3 border-t pt-3">
              <div className="relative">
                <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search passwords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9 pl-9"
                  autoFocus
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                    onClick={() => {
                      setSearchQuery("")
                      setSearchOpen(false)
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-20" />

      {/* Create Space Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createNewSpace)}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>Create New Space</DialogTitle>
                <DialogDescription>
                  Organize your passwords into separate spaces for better
                  management.
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="space"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Space Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., work, personal, finance"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    form.reset()
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Space"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
