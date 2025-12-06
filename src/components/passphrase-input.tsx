"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserAESKeyRecord, setPassphraseStatus } from "@/actions/user"
import { savePassphraseLocally } from "@/utils/idb.util"
import { PassphrasePepper } from "@/utils/passphrase.util"
import bcrypt from "bcryptjs"
import {
  AlertTriangleIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  ShieldIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DrawerDescription } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PassphraseInputProps {
  googleID: string
  userName: string
  userEmail: string
  mode: "setup" | "enter"
}

interface ValidationChecks {
  uppercase: boolean
  lowercase: boolean
  specialChar: boolean
  number: boolean
  minLength: boolean
}

export const PassphraseInput = ({
  googleID,
  userName,
  userEmail,
  mode,
}: PassphraseInputProps) => {
  const router = useRouter()
  const [showEducation, setShowEducation] = useState(mode === "setup")
  const [showPassphraseDialog, setShowPassphraseDialog] = useState(
    mode === "enter"
  )
  const [passphraseState, setPassphraseState] = useState("")
  const [confirmPassphrase, setConfirmPassphrase] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationChecks, setValidationChecks] = useState<ValidationChecks>({
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
    minLength: false,
  })

  // Log for debugging
  useEffect(() => {
    console.log("[PassphraseInput] Mounted", {
      mode,
      googleID: googleID.substring(0, 8) + "...",
      userName,
    })
  }, [mode, googleID, userName])

  // Calculate strength percentage
  const getStrengthPercentage = () => {
    const checksCount = Object.values(validationChecks).filter(Boolean).length
    return (checksCount / 5) * 100
  }

  // Get color based on strength
  const getStrengthColor = () => {
    const percentage = getStrengthPercentage()
    if (percentage <= 20) return "bg-red-500"
    if (percentage <= 40) return "bg-orange-500"
    if (percentage <= 60) return "bg-yellow-500"
    if (percentage <= 80) return "bg-blue-500"
    return "bg-green-500"
  }

  // Get strength label
  const getStrengthLabel = () => {
    const percentage = getStrengthPercentage()
    if (percentage <= 20) return "Very Weak"
    if (percentage <= 40) return "Weak"
    if (percentage <= 60) return "Medium"
    if (percentage <= 80) return "Strong"
    return "Very Strong"
  }

  // Update validation checks when passphrase changes
  useEffect(() => {
    if (mode === "setup") {
      setValidationChecks({
        uppercase: /[A-Z]/.test(passphraseState),
        lowercase: /[a-z]/.test(passphraseState),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passphraseState),
        number: /[0-9]/.test(passphraseState),
        minLength: passphraseState.length >= 8,
      })
    }
  }, [passphraseState, mode])

  // Handle education drawer close
  const handleEducationUnderstand = () => {
    console.log("[PassphraseInput] Education completed")
    setShowEducation(false)
    setShowPassphraseDialog(true)
  }

  // Handle submit
  const handleSubmit = async () => {
    if (isSubmitting) {
      console.log("[PassphraseInput] Already submitting, ignoring")
      return
    }

    console.log("[PassphraseInput] Submitting passphrase", { mode })
    setIsSubmitting(true)

    try {
      if (mode === "setup") {
        console.log("[PassphraseInput] Setup mode: saving passphrase")

        // Save passphrase locally first
        await savePassphraseLocally(passphraseState)
        console.log("[PassphraseInput] Passphrase saved to IndexedDB")

        // Update server status
        await setPassphraseStatus(googleID)
        console.log("[PassphraseInput] Server status updated")

        toast.success("Passphrase set successfully!")

        // Small delay to ensure storage is complete
        await new Promise((resolve) => setTimeout(resolve, 100))

        console.log("[PassphraseInput] Redirecting to /main")
        router.push("/main")
      } else if (mode === "enter") {
        console.log("[PassphraseInput] Enter mode: verifying passphrase")

        // Verify passphrase
        const userDetails = await getUserAESKeyRecord(googleID)

        if (!userDetails) {
          console.error("[PassphraseInput] User encryption keys not found")
          toast.error("User encryption keys not found")
          return
        }

        console.log(
          "[PassphraseInput] User details retrieved, comparing passphrase"
        )

        const passphraseWithPepper = await PassphrasePepper(
          passphraseState,
          googleID
        )

        const isPassphraseCorrect = await bcrypt.compare(
          passphraseWithPepper,
          userDetails.passphrase
        )

        if (!isPassphraseCorrect) {
          console.error("[PassphraseInput] Incorrect passphrase")
          toast.error("Incorrect passphrase")
          setPassphraseState("")
          return
        }

        console.log("[PassphraseInput] Passphrase verified successfully")

        // Save passphrase locally
        await savePassphraseLocally(passphraseState)
        console.log("[PassphraseInput] Passphrase saved to IndexedDB")

        toast.success("Passphrase verified!")

        // Small delay to ensure storage is complete
        await new Promise((resolve) => setTimeout(resolve, 100))

        console.log("[PassphraseInput] Redirecting to /main")
        router.push("/main")
      }
    } catch (error) {
      console.error("[PassphraseInput] Error during submit:", error)
      toast.error(`Failed: ${(error as Error).message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const passphrasesMatch =
    mode === "enter" || passphraseState === confirmPassphrase
  const isFormValid =
    mode === "enter"
      ? passphraseState.length > 0
      : Object.values(validationChecks).every(Boolean) && passphrasesMatch

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      {/* Education Drawer - Only shown in setup mode */}
      {mode === "setup" && (
        <Dialog open={showEducation} onOpenChange={() => {}}>
          <DialogContent
            className="min-h-[85vh] overflow-y-hidden"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div className="mx-auto max-w-md px-4 pb-8">
              <DialogHeader className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4 flex justify-center"
                >
                  <ShieldIcon
                    className="text-primary h-12 w-12"
                    color="#0039a6"
                  />
                </motion.div>
                <DialogTitle className="text-center text-2xl font-bold">
                  Welcome, {userName}!
                </DialogTitle>
                <DrawerDescription className="text-muted-foreground mt-4">
                  Before we begin, let&apos;s secure your data with a
                  passphrase.
                </DrawerDescription>
              </DialogHeader>

              <div className="py-2">
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-6 space-y-4"
                >
                  <motion.li
                    variants={itemVariants}
                    className="bg-muted/50 flex items-center gap-3 rounded-lg p-3"
                  >
                    <LockIcon className="text-primary h-5 w-5 shrink-0" />
                    <span>
                      Your passphrase <b>never leaves</b> your device
                    </span>
                  </motion.li>

                  <motion.li
                    variants={itemVariants}
                    className="bg-muted/50 flex items-center gap-3 rounded-lg p-3"
                  >
                    <CheckIcon className="h-5 w-5 shrink-0 text-green-500" />
                    <span>
                      All your passwords are encrypted with military-grade
                      security
                    </span>
                  </motion.li>

                  <motion.li
                    variants={itemVariants}
                    className="bg-muted/50 flex items-center gap-3 rounded-lg p-3"
                  >
                    <AlertTriangleIcon className="h-5 w-5 shrink-0 text-yellow-500" />
                    <span>
                      <b>Important:</b> If you forget your passphrase, your data
                      cannot be recovered
                    </span>
                  </motion.li>
                </motion.ul>
              </div>

              <DialogFooter className="px-0 pt-2">
                <Button
                  size="lg"
                  onClick={handleEducationUnderstand}
                  className="w-full"
                >
                  I Understand, Continue
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Passphrase Creation/Entry Dialog */}
      <AnimatePresence>
        {showPassphraseDialog && (
          <Dialog open={showPassphraseDialog} onOpenChange={() => {}}>
            <DialogContent
              className="sm:max-w-md"
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  {mode === "setup"
                    ? "Create Your Master Passphrase"
                    : `Welcome back, ${userName}!`}
                </DialogTitle>
                {mode === "enter" && (
                  <DrawerDescription className="pt-2 text-center">
                    Enter your passphrase to unlock your passwords
                  </DrawerDescription>
                )}
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 py-4"
              >
                {/* Passphrase Input */}
                <div className="space-y-2">
                  <Label htmlFor="passphrase" className="text-sm font-medium">
                    {mode === "setup" ? "Passphrase" : "Master Passphrase"}
                  </Label>
                  <div className="relative">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      id="passphrase"
                      placeholder={
                        mode === "setup"
                          ? "Enter a strong passphrase"
                          : "Enter your passphrase"
                      }
                      value={passphraseState}
                      onChange={(e) => setPassphraseState(e.target.value)}
                      className="pr-10"
                      disabled={isSubmitting}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isFormValid && !isSubmitting) {
                          handleSubmit()
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                      type="button"
                      tabIndex={-1}
                    >
                      {passwordVisible ? (
                        <EyeIcon className="h-4 w-4" />
                      ) : (
                        <EyeOffIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle visibility</span>
                    </Button>
                  </div>
                </div>

                {/* Confirm Passphrase Input - Only in setup mode */}
                {mode === "setup" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassphrase"
                      className="text-sm font-medium"
                    >
                      Confirm Passphrase
                    </Label>
                    <Input
                      type="password"
                      id="confirmPassphrase"
                      placeholder="Re-enter your passphrase"
                      value={confirmPassphrase}
                      onChange={(e) => setConfirmPassphrase(e.target.value)}
                      disabled={isSubmitting}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isFormValid && !isSubmitting) {
                          handleSubmit()
                        }
                      }}
                    />
                    <AnimatePresence>
                      {!passphrasesMatch && confirmPassphrase.length > 0 && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-1 text-sm text-red-500"
                        >
                          Passphrases do not match
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Strength Meter - Only in setup mode */}
                {mode === "setup" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Strength</span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          getStrengthPercentage() <= 40
                            ? "text-red-500"
                            : getStrengthPercentage() <= 60
                              ? "text-yellow-500"
                              : "text-green-500"
                        )}
                      >
                        {getStrengthLabel()}
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${getStrengthPercentage()}%` }}
                        transition={{ duration: 0.5 }}
                        className={cn("h-full", getStrengthColor())}
                      />
                    </div>

                    {/* Requirements */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="mt-3 grid grid-cols-2 gap-2"
                    >
                      <RequirementItem
                        met={validationChecks.minLength}
                        text="8+ characters"
                      />
                      <RequirementItem
                        met={validationChecks.uppercase}
                        text="Uppercase"
                      />
                      <RequirementItem
                        met={validationChecks.lowercase}
                        text="Lowercase"
                      />
                      <RequirementItem
                        met={validationChecks.number}
                        text="Number"
                      />
                      <RequirementItem
                        met={validationChecks.specialChar}
                        text="Special char"
                      />
                    </motion.div>
                  </div>
                )}
              </motion.div>

              <Button
                type="button"
                className="w-full"
                disabled={!isFormValid || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting
                  ? "Processing..."
                  : mode === "setup"
                    ? "Create Passphrase"
                    : "Unlock"}
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
      }}
      className={cn(
        "flex items-center gap-2 rounded-md p-2 text-xs",
        met
          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      {met && <CheckIcon className="h-3 w-3 shrink-0" />}
      <span>{text}</span>
    </motion.div>
  )
}
