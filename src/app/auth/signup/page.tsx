import { SiteHeader } from "@/components/routes/header"
import { Hero } from "@/components/routes/hero"
import { SignupForm } from "@/components/routes/signupForum"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SignupPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section aria-labelledby="signup-title" className="container mx-auto px-4 md:px-8 my-10 md:my-16">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle id="signup-title" className="text-2xl">
                  Create your account
                </CardTitle>
                <CardDescription>{"Start preparing with tailored interview questions and answers."}</CardDescription>
              </CardHeader>
              <CardContent>
                <SignupForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
