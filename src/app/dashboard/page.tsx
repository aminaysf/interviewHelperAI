"use client"

import { DashboardHeader } from "@/components/routes/dashboardComp/dashboardHeader"
import { InterviewCard } from "@/components/routes/dashboardComp/interviewCard"
import { InterviewFormModal } from "@/components/routes/dashboardComp/interviewFormModel"
import { generateInterviewQuestions, InterviewFormData } from "@/controllers/Auth/generateInterview"
import { useInterviewSessions } from "@/hooks/useInterviewSession"

// Using custom hook for data management
export default function Dashboard() {
  // Updated to include togglePin from hook
  const { sessions, isLoading, addSession, deleteSession, togglePin } = useInterviewSessions()

  // Handle form submission for new interview
  const handleInterviewSubmit = async (data: InterviewFormData) => {
    try {
      const session = await generateInterviewQuestions(data)
      addSession(session)
    } catch (error) {
      console.error("Failed to generate interview:", error)
      throw error
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Your Interview Sessions</h1>
            <p className="text-neutral-600 mt-1">Manage and review your AI-generated interview questions</p>
          </div>
          <InterviewFormModal onSubmit={handleInterviewSubmit} />
        </div>

        {/* Render loading state or sessions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-neutral-500">Loading your interview sessions...</p>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <InterviewCard
                key={session.id}
                session={session}
                onDelete={deleteSession}
                onTogglePin={togglePin}
              />
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-neutral-500">No interview sessions yet. Click "Add New Interview" to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}