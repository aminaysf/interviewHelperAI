"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInterviewSessions } from "@/hooks/useInterviewSession"
import { generateInterviewQuestions, InterviewFormData, InterviewSession } from "@/controllers/Auth/generateInterview"
import { Loader2, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

export default function SessionPage({ params: paramsPromise }: { params: Promise<{ sessionId: string }> }) {
  const { sessions, updateSession } = useInterviewSessions()
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Resolve paramsPromise once and store sessionId
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    paramsPromise.then((params) => {
      console.log("Resolved params.sessionId:", params.sessionId)
      setSessionId(params.sessionId)
    }).catch((err) => {
      console.error("Error resolving params:", err)
      toast.error("Invalid session ID")
      router.push("/dashboard")
      setIsLoading(false)
    })
  }, [paramsPromise, router])

  // Memoize sessions to prevent unnecessary re-renders
  const memoizedSessions = useMemo(() => {
    console.log("Memoizing sessions:", sessions)
    return sessions
  }, [sessions])

  useEffect(() => {
    if (!sessionId) {
      console.log("No sessionId resolved yet, skipping")
      return
    }

    console.log("Session ID:", sessionId)
    console.log("Available sessions:", memoizedSessions)

    // Skip lookup if session is already loaded and matches sessionId
    if (session && session.id === sessionId) {
      console.log("Session already loaded, skipping lookup")
      setIsLoading(false)
      return
    }

    try {
      const foundSession = memoizedSessions.find((s) => s.id === sessionId)
      console.log("Found session:", foundSession)
      if (foundSession) {
        console.log("Session questions:", foundSession.questions)
        console.log("Number of questions:", foundSession.questions.length)
        setSession(foundSession)
        setIsLoading(false)
      } else {
        console.log("Session not found, redirecting to /dashboard")
        toast.error("Session not found")
        router.push("/dashboard")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error in useEffect:", err)
      setError("Failed to load session")
      toast.error("Failed to load session")
      setIsLoading(false)
    }
  }, [sessionId, memoizedSessions, router])

  const handleLoadMore = async () => {
    if (!session) return
    setIsLoadingMore(true)
    try {
      const formData: InterviewFormData = {
        targetRole: session.targetRole,
        yearsOfExperience: session.yearsOfExperience,
        topicsToFocus: session.topicsToFocus,
        description: session.description,
      }
      const newSession = await generateInterviewQuestions(formData)
      const updatedSession = {
        ...session,
        questions: [...session.questions, ...newSession.questions],
      }
      console.log("Updated session with new questions:", updatedSession)
      updateSession(updatedSession)
      setSession(updatedSession)
      toast.success("More questions loaded!")
    } catch (error) {
      console.error("Failed to load more questions:", error)
      toast.error("Failed to load more questions")
    } finally {
      setIsLoadingMore(false)
    }
  }

  if (error) {
    console.log("Rendering error state")
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (isLoading || !session) {
    console.log("Rendering loading state, session:", session)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Loading session...</p>
      </div>
    )
  }

  console.log("Rendering session page with session:", session)

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold text-neutral-900">{session.targetRole} Interview Questions</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        <div className="mb-6 flex gap-4 text-sm text-neutral-600">
          <span>Experience: {session.yearsOfExperience}</span>
          <span>Topics: {session.topicsToFocus}</span>
          <span>Generated: {new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
        <p>Number of questions: {session.questions.length}</p>
        <ScrollArea className="rounded-lg border border-neutral-200 p-4">
          <div className="space-y-6">
            {session.questions.length === 0 ? (
              <p className="text-neutral-500">No questions available.</p>
            ) : (
              session.questions.map((question, index) => {
                console.log(`Rendering question ${index + 1}:`, question)
                return (
                  <div key={question.id} className="border-b border-neutral-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-emerald-100 text-emerald-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {question.category}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-neutral-900 mb-3">{question.question}</h3>
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <h4 className="font-medium text-neutral-700 mb-2">Suggested Answer:</h4>
                          <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">{question.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            {session.questions.length > 0 && session.questions.length < 8 && (
              <p className="text-red-500">Warning: Expected 8 questions, but only {session.questions.length} found.</p>
            )}
          </div>
        </ScrollArea>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading More...
              </>
            ) : (
              "Load More Questions"
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}