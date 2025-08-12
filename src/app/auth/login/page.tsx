import { SiteHeader } from "@/components/routes/header"
import { Hero } from "@/components/routes/hero"
import { LoginForm } from "@/components/routes/loginForum"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section aria-labelledby="login-title" className="container mx-auto px-4 md:px-8 my-10 md:my-16">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle id="login-title" className="text-2xl">
                  Log in
                </CardTitle>
                <CardDescription>{"Access your interview practice sessions and bookmarks."}</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
