"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store"
import { useEffect, useState } from "react"

export function DashboardHeader() {
  const router = useRouter()
  const { userDetails, setAuthenticated, setToken, setUserDetails } = useAuthStore((state) => state)
  const [userName, setUserName] = useState("John Doe")
  const [initials, setInitials] = useState("JD")
  const [isFetchingUser, setIsFetchingUser] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userDetails && localStorage.getItem("accessToken")) {
        console.log("No userDetails, fetching user data...")
        setIsFetchingUser(true)
        try {
          // Replace with your actual API call to fetch user details
          const response = await fetch("/api/user", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
          if (!response.ok) {
            throw new Error("Failed to fetch user details")
          }
          const data = await response.json()
          console.log("Fetched user details:", data)
          setUserDetails(data.user) // Expecting { id, name, email }
        } catch (error) {
          console.error("Failed to fetch user details:", error)
          setAuthenticated(false)
          setToken(null)
          localStorage.removeItem("accessToken")
          router.push("/")
        } finally {
          setIsFetchingUser(false)
        }
      }
    }

    fetchUserData()
  }, [userDetails, setUserDetails, setAuthenticated, setToken, router])

  useEffect(() => {
    console.log("userDetails:", userDetails)
    if (userDetails && userDetails.name && userDetails.name.trim()) {
      const name = userDetails.name.trim()
      console.log("Setting userName to:", name)
      setUserName(name)
      const nameParts = name.split(" ")
      if (nameParts.length > 1) {
        setInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase())
      } else {
        setInitials(name[0].toUpperCase())
      }
    } else {
      console.log("No valid userDetails.name, falling back to John Doe")
      setUserName("John Doe")
      setInitials("JD")
    }
  }, [userDetails])

  const handleLogout = () => {
    console.log("Logging out, clearing auth state")
    setAuthenticated(false)
    setToken(null)
    localStorage.removeItem("accessToken")
    router.push("/")
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <Link href="/dashboard" className="font-semibold tracking-tight text-neutral-900">
          Interview Helper AI
        </Link>

        <div className="flex items-center gap-4">
          {isFetchingUser ? (
            <span className="text-sm font-medium text-neutral-700">Loading user...</span>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-neutral-700 hidden sm:block">{userName}</span>
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-neutral-600 hover:text-neutral-900">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}