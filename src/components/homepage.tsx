"use client"

import Link from "next/link"
import { IconBrandGithub } from "@tabler/icons-react"
import { ExternalLink, Eye, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
    <Card className="border-border border shadow-sm">
      <CardHeader className="flex items-center justify-center pb-4">
        <Icon size={36} className="text-primary" />
      </CardHeader>
      <CardContent className="text-center">
        <CardTitle className="text-foreground mb-2 text-lg font-bold">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

// Main Homepage Component
export const Homepage: React.FC = () => {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-foreground mb-6 text-5xl font-black tracking-tight md:text-7xl">
            Secure your Credentials with &nbsp;
            <span className="text-sky-500 dark:text-sky-400">
              Zero Knowledge
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Privacy meets simplicity. An open-source password manager that
            encrypts your data locally with end-to-end encryption. Your master
            passphrase never leaves your device.
          </p>
          <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              <Link href="/login">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-accent hover:text-foreground w-full sm:w-auto"
            >
              <Link
                href="https://github.com/saadumairr/lockr"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-black">
              Security by Design
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              lockr is built for your privacy. Security without compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={ShieldCheck}
              title="End-to-End Encryption"
              description="Your data is encrypted on your device before it ever touches the servers."
            />
            <FeatureCard
              icon={Eye}
              title="Zero Knowledge"
              description="We see nothing. Your master key stays local, only you decrypt your vault."
            />
            <FeatureCard
              icon={IconBrandGithub}
              title="Open Source"
              description="Full transparency. Audit the code. Contribute if you dare."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-black">
              How lockr Works
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Simple steps. Ironclad protection.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border border shadow-sm">
              <CardHeader className="flex items-center justify-center pb-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-lg font-bold">
                    1
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-foreground mb-2 text-lg font-bold">
                  Create Master Key
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Set a passphrase. It guards everything.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border border shadow-sm">
              <CardHeader className="flex items-center justify-center pb-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-lg font-bold">
                    2
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-foreground mb-2 text-lg font-bold">
                  Add Passwords
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Store credentials. Locked tight.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border border shadow-sm">
              <CardHeader className="flex items-center justify-center pb-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-lg font-bold">
                    3
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-foreground mb-2 text-lg font-bold">
                  Local Encryption
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Encrypt locally. We never see it.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border border shadow-sm">
              <CardHeader className="flex items-center justify-center pb-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-lg font-bold">
                    4
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-foreground mb-2 text-lg font-bold">
                  Access Anywhere
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Sync securely. Own it everywhere.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="from-background to-muted bg-linear-to-b py-20">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-card border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-foreground mb-6 text-5xl font-black">
                LOCK DOWN YOUR CREDENTIALS
              </h2>
              <p className="text-muted-foreground mb-8 text-xl">
                Unbreakable security. Start in seconds.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg font-bold"
              >
                <Link href="/login">SECURE NOW</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
