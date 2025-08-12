"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SubmitButton } from "./submitButton"
import { userSignupApiCall } from "@/controllers/Auth"
import { useAuthStore } from "@/store"

type State = {
  success?: boolean
  message?: string
  errors?: {
    name?: string
    email?: string
    password?: string
  }
} | null

export function SignupForm() {
  const [state, setState] = useState<State>(null)
  const router = useRouter()
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setUserDetails = useAuthStore((state) => state.setUserDetails)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await userSignupApiCall({ name, email, password })
      setState({
        success: true,
        message: "Account created successfully! Redirecting...",
      })
      // Store token and user details
      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token) // Adjust based on your storage method
      }
      setAuthenticated(true)
      setUserDetails(response.data.user)
      router.push("/dashboard") // Redirect to dashboard
    } catch (error: any) {
      console.error("Signup error:", error.response?.data, error.message)
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup."
      setState({
        success: false,
        errors: error.response?.data?.errors || {
          email: errorMessage,
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state?.message && state.success && (
        <Alert className="border-emerald-200 text-emerald-800">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state && !state.success && state.errors && (
        <Alert variant="destructive">
          <AlertDescription>
            {state.errors.email || "Please correct the highlighted fields and try again."}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Jane Doe"
          required
          aria-describedby="name-error"
        />
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-red-600">
            {state.errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          aria-describedby="email-error"
        />
        {state?.errors?.email && (
          <p id="email-error" className="text-sm text-red-600">
            {state.errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          aria-describedby="password-error"
        />
        {state?.errors?.password && (
          <p id="password-error" className="text-sm text-red-600">
            {state.errors.password}
          </p>
        )}
      </div>

      <SubmitButton className="w-full bg-emerald-600 hover:bg-emerald-700">
        Create account
      </SubmitButton>

      <p className="text-sm text-neutral-600">
        {"Already have an account? "}
        <Link href="/login" className="text-emerald-700 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}