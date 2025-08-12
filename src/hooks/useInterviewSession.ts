
"use client"

import { InterviewSession } from "@/controllers/Auth/generateInterview"
import { useState, useEffect } from "react"

const STORAGE_KEY = "interview-sessions"

export function useInterviewSessions() {
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedSessions = JSON.parse(stored)
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
        }))
        setSessions(sessionsWithDates)
      }
    } catch (error) {
      console.error("Error loading sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
      } catch (error) {
        console.error("Error saving sessions:", error)
      }
    }
  }, [sessions, isLoading])

  const addSession = (session: InterviewSession) => {
    setSessions((prev) => [...prev, session].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)))
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
  }

  const togglePin = (sessionId: string) => {
    setSessions((prev) =>
      prev
        .map((s) => (s.id === sessionId ? { ...s, pinned: !s.pinned } : s))
        .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    )
  }

  const updateSession = (updatedSession: InterviewSession) => {
    setSessions((prev) =>
      prev
        .map((s) => (s.id === updatedSession.id ? updatedSession : s))
        .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    )
  }

  return { sessions, isLoading, addSession, deleteSession, togglePin, updateSession }
}