"use client"

import { IconBrandGithub } from "@tabler/icons-react"
import {
  ExternalLink,
  Eye,
  Key,
  Lock,
  ShieldCheck,
  ShieldCheckIcon,
} from "lucide-react"
import { motion } from "motion/react"

type FeatureCardProps = {
  icon: React.FC<{ size?: number; className?: string }>
  title: string
  description: string
}

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <motion.div
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-center justify-center">
        <Icon size={36} className="text-sky-400" />
      </div>
      <h3 className="mb-2 text-center text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="text-center text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </motion.div>
  )
}

// Main Homepage Component
export const Homepage: React.FC = () => {
  return (
    <main className="grow bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <motion.div
              className="mb-10 md:mb-0 md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl dark:text-slate-50">
                Secure your Credentials with &nbsp;
                <span className="text-sky-400">zero knowledge</span>
              </h1>
              <p className="mb-4 text-xl font-light text-slate-700 md:text-2xl dark:text-slate-300">
                Where privacy meets simplicity.
              </p>
              <p className="text-md mb-8 text-slate-600 dark:text-slate-400">
                An open-source password manager that encrypts your data locally
                with end-to-end encryption. Your master passphrase never leaves
                your device.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <motion.a
                  href="/login"
                  className="rounded-lg bg-sky-700 px-6 py-3 text-center font-medium text-white transition duration-300 hover:bg-sky-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.a>
                <motion.a
                  href="https://github.com/saadumairr/lockr"
                  className="flex items-center justify-center space-x-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition duration-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconBrandGithub />
                  <span>View on GitHub</span>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              className="md:w-5/12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="rounded-lg border border-slate-300 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-8 flex justify-center">
                  <motion.div
                    className="relative"
                    animate={{
                      scale: [1, 1.03, 1, 1.035],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 4,
                    }}
                  >
                    <Lock size={80} className="text-sky-400" />
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500">
                      <ShieldCheckIcon size={16} className="text-white" />
                    </div>
                  </motion.div>
                </div>
                <motion.div
                  className="space-y-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.3,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div
                    className="rounded-md bg-slate-200 p-4 dark:bg-slate-700 dark:text-slate-700"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="mb-2 flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">
                        Example Service
                      </span>
                      <Eye
                        size={18}
                        className="text-slate-600 dark:text-slate-400"
                      />
                    </div>
                    <div className="rounded-md bg-slate-300 p-2 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      ••••••••••••••••
                    </div>
                  </motion.div>
                  <motion.div
                    className="rounded-md bg-slate-200 p-4 dark:bg-slate-700"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="mb-2 flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">
                        Your Master Key
                      </span>
                      <Key size={18} className="text-sky-400" />
                    </div>
                    <div className="rounded-md bg-slate-300 p-2 font-mono text-sky-400 dark:bg-slate-800">
                      Only you know this
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white px-4 py-16 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className={
                "mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100"
              }
            >
              Security by Design
            </h2>
            <p
              className={"mx-auto max-w-2xl text-slate-600 dark:text-slate-400"}
            >
              lockr was built from the ground up with your privacy in mind. We
              believe security shouldn&apos;t come at the cost of convenience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={ShieldCheck}
              title="End-to-End Encryption"
              description="All your sensitive data is encrypted locally on your device before it reaches our servers."
            />
            <FeatureCard
              icon={Eye}
              title="Zero Knowledge Architecture"
              description="We can't see your passwords. Your master key never leaves your device, so only you can decrypt your data."
            />
            <FeatureCard
              icon={ExternalLink}
              title="Open Source Transparency"
              description="Our code is fully transparent. Anyone can verify our security practices and contribute improvements."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-100 px-4 py-16 dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
              How lockr Works
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
              Simple for you, complex for attackers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              className="rounded-lg border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                  <span className="font-bold text-sky-400">1</span>
                </div>
              </div>
              <h3 className="mb-2 text-center text-lg font-medium text-slate-900 dark:text-slate-100">
                Create Master Key
              </h3>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Set up your personal passphrase that will be used to encrypt all
                your data.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg border border-slate-300 bg-white p-4 dark:border-slate-300 dark:bg-slate-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                  <span className="font-bold text-sky-400">2</span>
                </div>
              </div>
              <h3 className="mb-2 text-center text-lg font-medium text-slate-900 dark:text-slate-100">
                Add Passwords
              </h3>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Store your login credentials securely with end-to-end
                encryption.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg border bg-white p-4 dark:border-slate-800 dark:bg-slate-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                  <span className="font-bold text-sky-400">3</span>
                </div>
              </div>
              <h3 className="mb-2 text-center text-lg font-medium text-slate-900 dark:text-slate-100">
                Local Encryption
              </h3>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Everything is encrypted on your device before being stored.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                  <span className="font-bold text-sky-400">4</span>
                </div>
              </div>
              <h3 className="mb-2 text-center text-lg font-medium text-slate-900 dark:text-slate-100">
                Access Anywhere
              </h3>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Securely access your passwords across all your devices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-slate-100 to-white px-4 py-16 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="rounded-xl border border-slate-300 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl dark:text-slate-100">
              Ready to secure your Credentials?
            </h2>
            <p className="mb-8 text-slate-700 dark:text-slate-300">
              It takes less than a minute to start protecting your passwords
              with lockr.
            </p>
            <motion.a
              href="/login"
              className="inline-block rounded-lg bg-sky-700 px-8 py-3 text-center font-medium text-white transition duration-300 hover:bg-sky-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Secure My Credentials
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
