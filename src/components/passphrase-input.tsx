"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getUserAESKeyRecord, setPassphraseStatus } from "@/actions/user"
import { useUser } from "@/context/user.context"
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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DrawerDescription } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ValidationChecks {
  uppercase: boolean
  lowercase: boolean
  specialChar: boolean
  number: boolean
  minLength: boolean
}

export const PassphraseInput = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") // this could be 'setup' or 'enter'
  const { googleID, setPassphrase_ctx } = useUser()
  const [showEducation, setShowEducation] = useState(mode === "setup")
  const [showPassphraseDialog, setShowPassphraseDialog] = useState(
    mode === "enter"
  )
  const [passphraseState, setPassphraseState] = useState("")
  const [confirmPassphrase, setConfirmPassphrase] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [validationChecks, setValidationChecks] = useState<ValidationChecks>({
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
    minLength: false,
  })

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
    setShowEducation(false)
    setShowPassphraseDialog(true)
  }

  // Handle submit
  const handleSubmit = async () => {
    if (mode === "setup") {
      setPassphrase_ctx(passphraseState)
      savePassphraseLocally(passphraseState)
      setPassphraseStatus(googleID)
      toast.success("Passphrase set successfully!")
      router.replace("/main")
    } else if (mode === "enter") {
      const userDetails = await getUserAESKeyRecord(googleID)
      if (!userDetails) {
        toast.error("USER DETAILS NOT AVAILABLE")
        return
      }

      const passphraseWithPepper = await PassphrasePepper(
        passphraseState,
        googleID
      )
      setPassphrase_ctx(passphraseState)
      savePassphraseLocally(passphraseState)
      const isPassphraseCorrect = await bcrypt.compare(
        passphraseWithPepper,
        userDetails?.passphrase
      )
      if (!isPassphraseCorrect) {
        toast.error("INCORRECT PASSPRHASE")
        return
      }
      toast.success("Passphrase accepted!")
      // TODO: SET A PROPER ROUTE
      router.replace("/main")
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
        <Dialog open={showEducation}>
          <DialogContent className="min-h-[85vh] overflow-y-hidden">
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
                  Your Privacy Matters
                </DialogTitle>
                <DrawerDescription className="text-muted-foreground mt-4">
                  We understand the importance of your privacy. The passphrase
                  you create:
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
                    <LockIcon className="text-primary h-5 w-5 flex-shrink-0" />
                    <span>
                      Is processed locally on your device and
                      <b>never leaves</b> your device
                    </span>
                  </motion.li>

                  <motion.li
                    variants={itemVariants}
                    className="bg-muted/50 flex items-center gap-3 rounded-lg p-3"
                  >
                    <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>
                      Is solely used to secure your information within this
                      application
                    </span>
                  </motion.li>

                  <motion.li
                    variants={itemVariants}
                    className="bg-muted/50 flex items-center gap-3 rounded-lg p-3"
                  >
                    <AlertTriangleIcon className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                    <span>
                      <b>Warning:</b> If you forget your passphrase, you will
                      lose access to your data
                    </span>
                  </motion.li>
                </motion.ul>
              </div>

              <DialogFooter className="px-0 pt-2">
                <DialogClose asChild>
                  <Button
                    size="lg"
                    onClick={handleEducationUnderstand}
                    className="w-full"
                  >
                    I Understand
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Passphrase Creation/Entry Dialog */}
      <AnimatePresence>
        {showPassphraseDialog && (
          <Dialog open={showPassphraseDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  {mode === "setup"
                    ? "Create a Secure Passphrase"
                    : "Enter Your Passphrase"}
                </DialogTitle>
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
                    {mode === "setup" ? "Passphrase" : "Enter Passphrase"}
                  </Label>
                  <div className="relative">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      id="passphrase"
                      placeholder={
                        mode === "setup"
                          ? "Enter your passphrase"
                          : "Enter your passphrase to continue"
                      }
                      value={passphraseState}
                      onChange={(e) => setPassphraseState(e.target.value)}
                      className="pr-10"
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
                      <span className="sr-only">
                        Toggle password visibility
                      </span>
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
                      placeholder="Confirm your passphrase"
                      value={confirmPassphrase}
                      onChange={(e) => setConfirmPassphrase(e.target.value)}
                    />
                    <AnimatePresence>
                      {!passphrasesMatch && confirmPassphrase.length > 0 && (
                        <motion.p
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="mt-1 text-sm text-red-500"
                        >
                          Passphrases do not match.
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
                        animate={{
                          width: `${getStrengthPercentage()}%`,
                        }}
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
                        text="Uppercase letter"
                      />
                      <RequirementItem
                        met={validationChecks.lowercase}
                        text="Lowercase letter"
                      />
                      <RequirementItem
                        met={validationChecks.number}
                        text="Number"
                      />
                      <RequirementItem
                        met={validationChecks.specialChar}
                        text="Special character"
                      />
                    </motion.div>
                  </div>
                )}
              </motion.div>

              <DialogClose asChild>
                <Button
                  type="button"
                  className="w-full"
                  disabled={!isFormValid}
                  onClick={handleSubmit}
                >
                  {mode === "setup" ? "Create Passphrase" : "Continue"}
                </Button>
              </DialogClose>
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
      {met && <CheckIcon className="h-3 w-3 flex-shrink-0" />}
      <span>{text}</span>
    </motion.div>
  )
}
