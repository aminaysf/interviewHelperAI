"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SubmitButton } from "./submitButton"
import { userLoginApiCall } from "@/controllers/Auth"
import { useAuthStore } from "@/store"

type State = {
  success?: boolean
  message?: string
  errors?: {
    email?: string
    password?: string
  }
} | null

export function LoginForm() {
  const [state, setState] = useState<State>(null)
  const router = useRouter()
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setUserDetails = useAuthStore((state) => state.setUserDetails)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await userLoginApiCall({ account: email, password })
      setState({
        success: true,
        message: "Login successful! Redirecting...",
      })
      // Store token and user details
      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token) // Adjust based on your storage method
      }
      setAuthenticated(true)
      setUserDetails(response.data.user)
      router.push("/dashboard") // Redirect to dashboard
    } catch (error: any) {
      console.error("Login error:", error.response?.data, error.message)
      const errorMessage =
        error.response?.data?.message || "An error occurred during login."
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
        Log in
      </SubmitButton>

      <p className="text-sm text-neutral-600">
        {"Don't have an account? "}
        <Link href="/signup" className="text-emerald-700 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}