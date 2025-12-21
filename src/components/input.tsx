"use client"

import { useCallback, useMemo, useState } from "react"
import { SaveCredentials } from "@/actions/user"
import { useData } from "@/context/data-context"
import { useKey } from "@/context/key-context"
import { useUser } from "@/context/user-context"
import { Encryptor } from "@/utils/crypto-util"
import { appendLocalPassword } from "@/utils/idb.util"
import { generateStrongPassword } from "@/utils/password.util"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertTriangleIcon,
  CheckCircle2,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  WandSparklesIcon,
  XCircleIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { PasswordDataProp } from "./main"

const PASSWORD_LENGTHS = [12, 16, 20, 24, 32, 48, 64] as const

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

const strongSchema = z.object({
  website: z.string().optional(),
  username: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordRegex, "Password must meet security requirements"),
})

const relaxedSchema = z.object({
  website: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type FormData = z.infer<typeof strongSchema>

interface PasswordStrength {
  minLength: boolean
  hasUpper: boolean
  hasLower: boolean
  hasNumber: boolean
  hasSpecial: boolean
  score: number
}

export function CredInput() {
  const { key } = useKey()
  const { googleID } = useUser()
  const { space, selectedSpace, setPwdFields, setAllDecrypted } = useData()
  const [spaceForPwd, setSpaceForPwd] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [bypassMode, setBypassMode] = useState(false)
  const [passwordLength, setPasswordLength] = useState(16)
  const [showGenerator, setShowGenerator] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(bypassMode ? relaxedSchema : strongSchema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
    },
  })

  const currentPassword = form.watch("password")

  const passwordStrength = useMemo<PasswordStrength | null>(() => {
    if (!currentPassword) return null

    const checks = {
      minLength: currentPassword.length >= 8,
      hasUpper: /[A-Z]/.test(currentPassword),
      hasLower: /[a-z]/.test(currentPassword),
      hasNumber: /\d/.test(currentPassword),
      hasSpecial: /[\W_]/.test(currentPassword),
    }

    const score = Object.values(checks).filter(Boolean).length

    return { ...checks, score }
  }, [currentPassword])

  const getStrengthColor = useCallback((score: number) => {
    if (score <= 2) return "text-red-500"
    if (score <= 3) return "text-orange-500"
    if (score === 4) return "text-yellow-500"
    return "text-green-500"
  }, [])

  const getStrengthLabel = useCallback((score: number) => {
    if (score <= 2) return "Weak"
    if (score <= 3) return "Fair"
    if (score === 4) return "Good"
    return "Strong"
  }, [])

  const generatePassword = useCallback(() => {
    const password = generateStrongPassword(passwordLength)
    form.setValue("password", password, { shouldValidate: true })
    setPasswordVisible(true)
    toast.success(`Generated ${passwordLength}-character password`)
  }, [passwordLength, form])

  const handleSubmit = useCallback(
    async (values: FormData) => {
      if (loading || !key) {
        if (!key) toast.error("Encryption key missing")
        return
      }

      if (bypassMode && passwordStrength && passwordStrength.score < 5) {
        toast.warning("Saving with weak password", {
          description: "Consider updating this password later",
        })
      }

      setLoading(true)
      const toastId = toast.loading("Encrypting and saving...")

      try {
        const iv = crypto.getRandomValues(new Uint8Array(12))

        const [usernameResult, passwordResult, websiteResult] =
          await Promise.all([
            Encryptor(values.username, key, iv),
            Encryptor(values.password, key, iv),
            values.website ? Encryptor(values.website, key, iv) : null,
          ])

        console.log("SPACE BEFORE SAVE: ", spaceForPwd)

        const dbResponse = await SaveCredentials({
          userId: googleID,
          space: spaceForPwd || "main",
          website: websiteResult?.encryptedBase64 ?? null,
          username: usernameResult.encryptedBase64,
          password: passwordResult.encryptedBase64,
          iv: usernameResult.ivBase64,
        })

        console.log("DB RESPONSE: ", dbResponse)

        const newEntry: PasswordDataProp = {
          id: dbResponse.id,
          username: values.username,
          password: values.password,
          space: spaceForPwd || "main",
          website: values.website,
          iv: dbResponse.iv,
          createdAt: dbResponse.createdAt,
          updatedAt: dbResponse.updatedAt,
        }

        console.log("NEW ENTRY: ", newEntry)

        setPwdFields((prev) => [newEntry, ...prev])
        setAllDecrypted((prev) => [newEntry, ...prev])
        await appendLocalPassword({
          ...dbResponse,
          website: dbResponse.website ?? undefined,
        } as PasswordDataProp)

        toast.success("Credential saved securely", { id: toastId })
        form.reset()
        setIsOpen(false)
        setBypassMode(false)
        setShowGenerator(false)
      } catch (error) {
        console.error("Save credential error:", error)
        toast.error("Failed to save credential", { id: toastId })
      } finally {
        setLoading(false)
      }
    },
    [
      loading,
      key,
      bypassMode,
      passwordStrength,
      googleID,
      spaceForPwd,
      selectedSpace,
      form,
      setPwdFields,
      setAllDecrypted,
    ]
  )

  const handleDialogChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        form.reset()
        setBypassMode(false)
        setShowGenerator(false)
        setPasswordVisible(false)
      }
    },
    [form]
  )

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed right-6 bottom-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[90vh] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Add Credential
              {bypassMode && (
                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-normal text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  <ShieldAlertIcon className="h-3 w-3" />
                  Relaxed Mode
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Store your login credentials securely with end-to-end encryption
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                {/* Security Mode Toggle */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    {bypassMode ? (
                      <ShieldAlertIcon className="h-4 w-4 text-orange-500" />
                    ) : (
                      <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {bypassMode
                          ? "Relaxed Validation"
                          : "Strong Validation"}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {bypassMode
                          ? "For legacy systems with weak password requirements"
                          : "Enforces strong password requirements"}
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={bypassMode}
                    onCheckedChange={setBypassMode}
                    disabled={loading}
                  />
                </div>

                {/* Website Field */}
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

                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username / Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username@email.com"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field with Tabs */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Tabs defaultValue="generate" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="generate">Generate</TabsTrigger>
                          <TabsTrigger value="manual">Enter</TabsTrigger>
                        </TabsList>

                        <TabsContent value="manual" className="space-y-3">
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Enter password"
                                disabled={loading}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                                onClick={() =>
                                  setPasswordVisible(!passwordVisible)
                                }
                                disabled={loading}
                              >
                                {passwordVisible ? (
                                  <EyeOffIcon className="h-4 w-4" />
                                ) : (
                                  <EyeIcon className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>

                          {/* Password Strength Indicator */}
                          {!bypassMode &&
                            passwordStrength &&
                            currentPassword && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-muted/50 space-y-2 rounded-lg border p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    Password Strength
                                  </span>
                                  <span
                                    className={`text-sm font-semibold ${getStrengthColor(passwordStrength.score)}`}
                                  >
                                    {getStrengthLabel(passwordStrength.score)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <StrengthCheck
                                    met={passwordStrength.minLength}
                                    label="8+ characters"
                                  />
                                  <StrengthCheck
                                    met={passwordStrength.hasUpper}
                                    label="Uppercase"
                                  />
                                  <StrengthCheck
                                    met={passwordStrength.hasLower}
                                    label="Lowercase"
                                  />
                                  <StrengthCheck
                                    met={passwordStrength.hasNumber}
                                    label="Number"
                                  />
                                  <StrengthCheck
                                    met={passwordStrength.hasSpecial}
                                    label="Special char"
                                  />
                                </div>
                              </motion.div>
                            )}
                        </TabsContent>

                        <TabsContent value="generate" className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                Length
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {passwordLength} characters
                              </span>
                            </div>

                            <Slider
                              value={[passwordLength]}
                              onValueChange={([value]) =>
                                setPasswordLength(value)
                              }
                              min={12}
                              max={64}
                              step={4}
                              className="w-full"
                            />

                            <div className="text-muted-foreground flex justify-between text-xs">
                              {PASSWORD_LENGTHS.map((len) => (
                                <button
                                  key={len}
                                  type="button"
                                  onClick={() => setPasswordLength(len)}
                                  className={`hover:text-foreground transition-colors ${
                                    passwordLength === len
                                      ? "text-foreground font-medium"
                                      : ""
                                  }`}
                                >
                                  {len}
                                </button>
                              ))}
                            </div>

                            <Button
                              type="button"
                              onClick={generatePassword}
                              className="w-full"
                              disabled={loading}
                            >
                              <WandSparklesIcon className="mr-2 h-4 w-4" />
                              Generate Secure Password
                            </Button>

                            {currentPassword && (
                              <div className="bg-muted/50 rounded-lg border p-3">
                                <div className="font-mono text-sm break-all">
                                  {passwordVisible
                                    ? currentPassword
                                    : "••••••••••••••••"}
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Space Selector */}
                <FormItem>
                  <FormLabel>Space</FormLabel>
                  <Select
                    value={spaceForPwd || "main"}
                    onValueChange={(value) => {
                      setSpaceForPwd(value)
                    }}
                    defaultValue="main"
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {space.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which space to store this credential
                  </FormDescription>
                </FormItem>

                {/* Warning for Bypass Mode */}
                {bypassMode &&
                  currentPassword &&
                  passwordStrength &&
                  passwordStrength.score < 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900/50 dark:bg-orange-900/20"
                    >
                      <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
                      <div className="text-sm text-orange-600 dark:text-orange-400">
                        <p className="font-medium">Weak Password Detected</p>
                        <p className="mt-1 text-xs">
                          Consider updating this password to a stronger one when
                          possible
                        </p>
                      </div>
                    </motion.div>
                  )}
              </form>
            </Form>
          </ScrollArea>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Credential"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StrengthCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <CheckCircle2 className="h-3 w-3 text-green-600" />
      ) : (
        <XCircleIcon className="text-muted-foreground h-3 w-3" />
      )}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  )
}
