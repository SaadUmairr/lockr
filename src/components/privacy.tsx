import { Card, CardContent } from "@/components/ui/card"

import { Footer } from "./footer"
import { Navbar } from "./navbar"

export function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      {/* Hero Header */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-foreground text-5xl font-black tracking-tight md:text-7xl">
            PRIVACY POLICY
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-xl">
            Transparency is non-negotiable. Here&apos;s exactly what you need to
            know.
          </p>
        </div>
      </section>
      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-card border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-foreground mt-0 text-3xl font-black">
                  A Quick Note
                </h2>
                <p className="text-muted-foreground">
                  Hey there! 👋 Thanks for trusting lockr. Privacy isn&apos;t
                  just a checkbox here. it&apos;s core to why this project
                  exists. I built this platform to give you a simple, secure way
                  to save and manage your passwords without feeling like
                  you&apos;re giving away your life story. This policy is a
                  quick walkthrough of what I &nbsp;
                  <span className="text-foreground font-bold">do</span>
                  &nbsp; and &nbsp;
                  <span className="text-foreground font-bold">don&apos;t</span>
                  &nbsp; collect.
                </p>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  What I Collect (and Why)
                </h2>
                <p className="text-muted-foreground">
                  To keep things running smoothly, here&apos;s what I collect:
                </p>
                <ul className="text-muted-foreground mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span>
                      <strong className="text-foreground">
                        Google Account Info:
                      </strong>
                      &nbsp; Your email and profile name , just enough to let
                      you sign in and manage your uploads.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span>
                      <strong className="text-foreground">
                        Anonymous Usage Data:
                      </strong>
                      &nbsp; Might use tools like Google Analytics to understand
                      how people use the app , but nothing personal.
                    </span>
                  </li>
                </ul>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  What I &nbsp;
                  <span className="font-bold">Don&apos;t</span>&nbsp; See
                </h2>
                <div className="border-primary bg-accent mt-6 rounded-r-lg border-l-4 p-6">
                  <p className="text-muted-foreground mb-4">
                    I &nbsp;
                    <span className="text-foreground font-bold">
                      don&apos;t
                    </span>
                    &nbsp; have access to:
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li>
                      • Your passwords , they &apos;re encrypted before they hit
                      the server.
                    </li>
                    <li>
                      • Your encryption keys or passwords , those stay on your
                      device.
                    </li>
                    <li>• Your browsing behavior outside of this app.</li>
                  </ul>
                </div>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  How Your Info Is Used
                </h2>
                <p className="text-muted-foreground">
                  Only to make the app work, no funny business. Specifically:
                </p>
                <ul className="text-muted-foreground mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span>Let you manage your passwords</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span>Debug any issues you run into</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span>Improve the app over time</span>
                  </li>
                </ul>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  Do I Share Your Data?
                </h2>
                <p className="text-muted-foreground">
                  Nope. This is a solo project, not a data-harvesting machine.
                  Your info stays here, encrypted and safe. I don&apos;t sell
                  it, rent it, or hand it out.
                </p>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  How Long Is Data Stored?
                </h2>
                <p className="text-muted-foreground">
                  Passwords stick around as long as you saved them, once you
                  delete a password it&apos;s gone from the servers.
                </p>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  Your Rights
                </h2>
                <p className="text-muted-foreground">
                  You can reach out any time to:
                </p>
                <ul className="text-muted-foreground mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span>Access or update your account info</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span>Delete your account or uploaded files</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span>Ask what data I have (spoiler: not much)</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Just email:
                  <span className="text-muted-foreground/70 italic">
                    I&apos;ll be making an account for this later.
                  </span>
                </p>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  Security Stuff
                </h2>
                <p className="text-muted-foreground">
                  I take security seriously. Your passwords are encrypted &nbsp;
                  <span className="text-foreground font-bold">before</span>
                  &nbsp; upload. Encryption keys never touch the server in raw
                  form. I use standard security practices and keep things as
                  locked-down as possible.
                </p>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  Changes?
                </h2>
                <p className="text-muted-foreground">
                  If anything changes in how I handle your data, I&apos;ll be
                  upfront about it here and (if it&apos;s major) via email.
                </p>

                <h2 className="text-foreground mt-12 text-3xl font-black">
                  Let&apos;s Talk
                </h2>
                <p className="text-muted-foreground">
                  Got questions, concerns, or feedback? I&apos;d love to hear
                  from you.
                </p>
                <p className="text-muted-foreground">
                  Email me anytime at:
                  <span className="text-muted-foreground/70 italic">
                    I&apos;ll be making an account for this later.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  )
}
