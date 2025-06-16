import { Footer } from "./footer"
import { Navbar } from "./navbar"

export function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-slate-800 py-12 text-white dark:bg-slate-700">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm dark:bg-slate-800 dark:text-white">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="mt-0 text-2xl font-bold text-slate-900 dark:text-white">
              A Quick Note
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Hey there! 👋 Thanks for trusting lockr. Privacy isn&apos;t just a
              checkbox here — it&apos;s core to why this project exists. I built
              this platform to give you a simple, secure way to save and manage
              your passwords without feeling like you&apos;re giving away your
              life story. This policy is a quick walkthrough of what I &nbsp;
              <span className="font-bold text-slate-900 dark:text-white">
                do
              </span>
              &nbsp; and&nbsp;
              <span className="font-bold text-slate-900 dark:text-white">
                don&apos;t
              </span>
              &nbsp; collect.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              What I Collect (and Why)
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              To keep things running smoothly, here&apos;s what I collect:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300">
              <li>
                <strong className="text-slate-900 dark:text-white">
                  Google Account Info:
                </strong>
                &nbsp; Your email and profile name — just enough to let you sign
                in and manage your uploads.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">
                  Anonymous Usage Data:
                </strong>
                &nbsp; Might use tools like Google Analytics to understand how
                people use the app — but nothing personal.
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              What I &nbsp;
              <span className="font-bold">Don&apos;t</span>&nbsp; See
            </h2>
            <div className="my-6 border-l-4 border-indigo-600 bg-indigo-50 p-4 dark:border-indigo-500 dark:bg-slate-700">
              <p className="text-slate-700 dark:text-slate-300">
                I &nbsp;
                <span className="font-bold text-slate-900 dark:text-white">
                  don&apos;t
                </span>
                &nbsp; have access to:
              </p>
              <ul className="mt-2 list-disc pl-5 text-slate-700 dark:text-slate-300">
                <li>
                  Your passwords — they&apos;re encrypted before they hit the
                  server.
                </li>
                <li>
                  Your encryption keys or passwords — those stay on your device.
                </li>
                <li>Your browsing behavior outside of this app.</li>
              </ul>
            </div>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              How Your Info Is Used
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Only to make the app work — no funny business. Specifically:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300">
              <li>Let you manage your passwords</li>
              <li>Debug any issues you run into</li>
              <li>Improve the app over time</li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              Do I Share Your Data?
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Nope. This is a solo project, not a data-harvesting machine. Your
              info stays here, encrypted and safe. I don&apos;t sell it, rent
              it, or hand it out.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              How Long Is Data Stored?
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Passwords stick around as long as you saved them, once you delete
              a password it&apos; gone from the servers.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              Your Rights
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              You can reach out any time to:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300">
              <li>Access or update your account info</li>
              <li>Delete your account or uploaded files</li>
              <li>Ask what data I have (spoiler: not much)</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
              Just email:
              <span className="text-slate-500 dark:text-slate-400">
                I&apos;ll be making an account for this later.
              </span>
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              Security Stuff
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              I take security seriously. Your passwords are encrypted
              <span className="font-bold">before</span>
              &nbsp; upload. Encryption keys never touch the server in raw form.
              I use standard security practices and keep things as locked-down
              as possible.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              Changes?
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              If anything changes in how I handle your data, I&apos;ll be
              upfront about it here and (if it&apos;s major) via email.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              Let&apos;s Talk
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Got questions, concerns, or feedback? I&apos;d love to hear from
              you.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Email me anytime at:
              <span className="text-slate-500 dark:text-slate-400">
                I&apos;ll be making an account for this later.
              </span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
