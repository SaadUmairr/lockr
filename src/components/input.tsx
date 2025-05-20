"use client"

import { useCallback, useState } from "react"
import { SaveCredentials } from "@/actions/user"
import { useData } from "@/context/data.context"
import { useKey } from "@/context/key.context"
import { useUser } from "@/context/user.context"
import { Encryptor } from "@/utils/crypto.util"
import { appendLocalPassword } from "@/utils/idb.util"
import { generateStrongPassword } from "@/utils/password.util"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Eye, EyeOff, Plus, WandSparklesIcon, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

import { PasswordDataProp } from "./main"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface EncryptedCredentials {
  encrypted_username: string
  encrypted_password: string
  encrypted_website?: string
  iv: string
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/

const formSchema = z.object({
  website: z.string().optional().or(z.literal("")),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be atleast 6 characters",
    })
    .regex(passwordRegex, {
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    }),
})

type FormData = z.infer<typeof formSchema>

// Password length options
const passwordLengths = [16, 32, 48, 64, 80, 96, 112, 128]

export function CredInput() {
  const { key } = useKey()
  const { googleID } = useUser()
  const { space, selectedSpace, setSelectedSpace, setPwdFields } = useData()

  const [loading, setLoading] = useState<boolean>(false)
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const [inputDialogOen, setInputDialogOpen] = useState<boolean>(false)
  const [passwordLength, setPasswordLength] = useState<number>(24)
  const [showStrengthSlider, setShowStrengthSlider] = useState<boolean>(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: FormData): Promise<void> => {
    if (loading) return
    if (!key) {
      toast.error("Encryption key is missing")
      return
    }
    setLoading(true)
    const submitToast = toast.loading("Saving...")
    try {
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const encryptedResult: Partial<EncryptedCredentials> = {}

      let ivBase64 = ""

      const fieldsToEncrypt: Record<string, string | null | undefined> = {
        username: values.username,
        password: values.password,
        website: values.website,
      }

      for (const [field, value] of Object.entries(fieldsToEncrypt)) {
        if (!value || value.trim() === "") continue

        const { encryptedBase64, ivBase64: currentIV } = await Encryptor(
          value,
          key,
          iv
        )

        if (field === "username")
          encryptedResult.encrypted_username = encryptedBase64
        else if (field === "password")
          encryptedResult.encrypted_password = encryptedBase64
        else if (field === "website")
          encryptedResult.encrypted_website = encryptedBase64 ?? null

        if (!ivBase64) ivBase64 = currentIV
      }

      encryptedResult.iv = ivBase64

      if (
        !encryptedResult.encrypted_username ||
        !encryptedResult.encrypted_password ||
        !encryptedResult.iv
      ) {
        toast.error("Encryption failed. Required fields missing.")
        return
      }

      const dbResponse = await SaveCredentials({
        userId: googleID,
        space: selectedSpace === "all" ? "main" : selectedSpace,
        website: encryptedResult.encrypted_website ?? null,
        username: encryptedResult.encrypted_username,
        password: encryptedResult.encrypted_password,
        iv: encryptedResult.iv,
      })
      // Updating UI
      setPwdFields((prev) => [
        ...prev,
        {
          id: dbResponse.id,
          username: values.username,
          password: values.password,
          space: selectedSpace,
          website: values.website ?? undefined,
          iv: dbResponse.iv,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      console.log("DB RESPONSE: ", dbResponse)
      await appendLocalPassword({
        id: dbResponse.id,
        space: dbResponse.space,
        website: dbResponse.website ?? undefined,
        username: dbResponse.username,
        password: dbResponse.password,
        iv: dbResponse.iv,
        createdAt: dbResponse.createdAt,
        updatedAt: dbResponse.updatedAt,
      } as PasswordDataProp)

      form.reset()
      setInputDialogOpen(false)
      toast.success("Credentials Saved", { id: submitToast })
    } catch (error) {
      console.error(error)
      toast.error(`OOPS SOMETHING WENT WRONG`, { id: submitToast })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordLengthChange = (newValue: number[]) => {
    const newLength = newValue[0]
    // Find the closest value from passwordLengths
    const closestLength = passwordLengths.reduce((prev, curr) =>
      Math.abs(curr - newLength) < Math.abs(prev - newLength) ? curr : prev
    )
    setPasswordLength(closestLength)
  }

  const generatePassword = useCallback(() => {
    const password = generateStrongPassword(passwordLength)
    form.setValue("password", password)
    setPasswordVisible(true)
  }, [passwordLength, form, passwordLength])

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const toggleStrengthSlider = () => {
    setShowStrengthSlider(!showStrengthSlider)
  }

  return (
    <>
      <Dialog open={inputDialogOen}>
        <DialogTrigger asChild>
          <div className="fixed right-6 bottom-6 z-50">
            <Button
              className="rounded-full bg-amber-600 p-4 text-white shadow-lg hover:bg-amber-400 dark:invert"
              onClick={() => setInputDialogOpen(true)}
            >
              <Plus className="h-8 w-8" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>Add a New Credential</DialogTitle>
                <DialogDescription>
                  Enter your login details to securely store them.
                </DialogDescription>
              </DialogHeader>
              {/* 1st input field */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 2nd input field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between select-none">
                      <FormLabel>Username</FormLabel>
                      <p className="text-muted-foreground text-xs text-shadow-2xs">
                        REQUIRED
                      </p>
                    </div>
                    <FormControl>
                      <Input placeholder="your username" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 3rd input field  */}
              <div className="space-y-4">
                <div className="flex items-start gap-x-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="flex justify-between select-none">
                          <FormLabel>Password</FormLabel>
                          <p className="text-muted-foreground text-xs text-shadow-2xs">
                            REQUIRED
                          </p>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter a strong password"
                              type={passwordVisible ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                              onClick={togglePasswordVisibility}
                              type="button"
                              disabled={loading}
                              tabIndex={-1}
                            >
                              {passwordVisible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                Toggle password visibility
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-6">
                    <Button
                      type="button"
                      size="icon"
                      disabled={loading}
                      onClick={generatePassword}
                    >
                      <WandSparklesIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Select
                    value={selectedSpace}
                    onValueChange={setSelectedSpace}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Space" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {space.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant={showStrengthSlider ? "destructive" : "outline"}
                    onClick={toggleStrengthSlider}
                    size="sm"
                    className="px-2 text-xs whitespace-nowrap"
                  >
                    {showStrengthSlider ? (
                      <>
                        <X className="mr-1 h-4 w-4" />
                        CLOSE
                      </>
                    ) : (
                      "PASSWORD STRENGTH"
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {showStrengthSlider && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-md border bg-slate-50 p-4 dark:bg-slate-900">
                        <div className="mb-3 text-center font-medium">
                          Password Length:
                          {passwordLength}
                        </div>
                        <div className="relative mb-6 w-full px-1">
                          <Slider
                            value={[passwordLength]}
                            onValueChange={handlePasswordLengthChange}
                            min={passwordLengths[0]}
                            max={passwordLengths[passwordLengths.length - 1]}
                            step={1}
                            className="h-4"
                          />

                          {/* Ticks for password lengths */}
                          <div className="relative mt-2 h-6">
                            {passwordLengths.map((length) => {
                              const percentage =
                                ((length - passwordLengths[0]) /
                                  (passwordLengths[passwordLengths.length - 1] -
                                    passwordLengths[0])) *
                                100

                              return (
                                <div
                                  key={length}
                                  className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                                  style={{
                                    left: `${percentage}%`,
                                  }}
                                >
                                  <div className="h-1 w-0.5 bg-gray-300"></div>
                                  <div className="mt-1 text-xs">{length}</div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="text-center"
                        >
                          <Button
                            type="button"
                            size="sm"
                            onClick={generatePassword}
                            className="bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            <WandSparklesIcon className="mr-2 h-4 w-4 text-white" />
                            Generate New Password
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DialogFooter className="flex flex-row items-center justify-end gap-4 pt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setInputDialogOpen(false)}
                    disabled={loading}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
