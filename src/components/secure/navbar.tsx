"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LogoutHandler } from "@/actions/user"
import { useData } from "@/context/data.context"
import { saveSpaces } from "@/utils/idb.util"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlignRight,
  ArrowDown01Icon,
  ArrowDownAZIcon,
  ArrowUpDownIcon,
  InfoIcon,
  LogOutIcon,
  MenuIcon,
  MoonStar,
  PlusIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import ThemeToggler from "@/components/theme-toggle"

const formSchema = z.object({
  space: z.string().min(2, {
    message: "Space must be at least 2 characters",
  }),
})

type FormData = z.infer<typeof formSchema>

export function Navbar() {
  const {
    space,
    setSpace,
    selectedSpace,
    setSelectedSpace,
    sortAlphabatically,
    setSortAlphabatically,
    sortByCreation,
    setSortByCreation,
  } = useData()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      space: "main",
    },
  })

  const isMobile = useIsMobile()

  const createNewSpace = async (values: FormData): Promise<void> => {
    if (loading) return
    setLoading(true)

    const newSpace = values.space.trim()

    const exists = space.some((s) => s.toLowerCase() === newSpace.toLowerCase())
    if (exists) {
      form.setError("space", { message: "Space already exists" })
      setLoading(false)
      return
    }

    const updated = [...space, newSpace]
    setSpace(updated)
    await saveSpaces(updated)
    setLoading(false)
    setDialogOpen(false)
  }

  return (
    <div className="mb-3 flex items-center justify-between rounded-xl border-b border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Link href="/main" className="flex items-center">
          <Image
            src="/key96.svg"
            alt="lockr"
            width={24}
            height={24}
            className="dark:invert"
          />
          <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            lock
            <span className="text-amber-500 dark:invert">r</span>
          </span>
        </Link>
      </div>

      <div className="mx-4 hidden max-w-md flex-1 sm:block">
        <Select value={selectedSpace} onValueChange={setSelectedSpace}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select space" />
          </SelectTrigger>
          <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>

              {space.map((items, index) => (
                <SelectItem value={items} key={index}>
                  {items}
                </SelectItem>
              ))}
              <Separator className="my-1 dark:bg-gray-700" />

              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-2"
                onClick={() => setDialogOpen(true)}
              >
                <PlusIcon className="h-4 w-4" />
                <span>New Space</span>
              </Button>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        {!isMobile && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <ArrowUpDownIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-1 dark:border-gray-700 dark:bg-gray-800">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSortByCreation(true)}
                >
                  <ArrowDown01Icon className="h-4 w-4" />
                  <span>By Creation</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSortAlphabatically(true)}
                >
                  <ArrowDownAZIcon className="h-4 w-4" />
                  <span>Alphabetically</span>
                  {}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <div className="ml-2">
          <ThemeToggler />
        </div>

        {!isMobile && (
          <Button
            className="mx-2"
            variant="ghost"
            onClick={async () => {
              await LogoutHandler()
              return redirect("/")
            }}
          >
            <LogOutIcon />
          </Button>
        )}

        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-60 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-2">
                <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                  <SelectTrigger className="mb-2 w-full">
                    <SelectValue placeholder="Select space" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All</SelectItem>
                      {space.map((items, index) => (
                        <SelectItem value={items} key={index}>
                          {items}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="mb-2 w-full justify-start"
                  onClick={() => setDialogOpen(true)}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Space
                </Button>

                <Separator className="my-2 dark:bg-gray-700" />

                <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sort
                </div>
                <Button variant="ghost" className="mb-1 w-full justify-start">
                  <ArrowDown01Icon className="mr-2 h-4 w-4" />
                  By Creation
                  {sortByCreation && <AlignRight />}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ArrowDownAZIcon className="mr-2 h-4 w-4" />
                  Alphabetically
                  {sortAlphabatically && <MoonStar />}
                </Button>
              </div>
              <Button
                className="mx-2 w-full justify-start"
                variant="ghost"
                onClick={async () => {
                  await LogoutHandler()
                  return redirect("/")
                }}
              >
                <LogOutIcon className="mr-2 h-4 w-4" /> Log out
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md dark:border-gray-800 dark:bg-gray-900">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createNewSpace)}
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="dark:text-gray-100">
                  Create New Space
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Spaces = folders for your passwords. Clean, simple, sorted.
                </DialogDescription>
              </DialogHeader>
              <div className="">
                <FormField
                  control={form.control}
                  name="space"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">
                        Space Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="eg: personal"
                          disabled={loading}
                          className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="dark:text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                <h4 className="flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-500">
                  <InfoIcon className="h-4 w-4" />
                  Important
                </h4>
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  New space can be deleted if there&apos;s no password entry
                  with that space
                </p>
              </div>
              <DialogFooter className="flex flex-row items-center justify-end gap-4 pt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setDialogOpen(false)}
                    disabled={loading}
                    className="dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={loading}
                  className="dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
