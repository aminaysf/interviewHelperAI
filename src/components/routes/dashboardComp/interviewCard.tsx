"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, User, Target, MoreVertical, Trash2, Pin, PinOff } from "lucide-react"
import { InterviewSession } from "@/controllers/Auth/generateInterview"
import Link from "next/link"
import toast from "react-hot-toast"

interface InterviewCardProps {
  session: InterviewSession
  onDelete?: (sessionId: string) => void
  onTogglePin?: (sessionId: string) => void
}

export function InterviewCard({ session, onDelete, onTogglePin }: InterviewCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Delete clicked for session:", session.id)
    if (onDelete && confirm("Delete this session?")) {
      onDelete(session.id)
    }
  }

  const handleTogglePin = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Pin toggled for session:", session.id)
    if (onTogglePin) {
      onTogglePin(session.id)
    }
  }

  console.log("Rendering InterviewCard for session:", session.id, "Questions:", session.questions.length)

  return (
    <Link href={`/dashboard/${session.id}`}>
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-neutral-900 line-clamp-2">{session.targetRole}</CardTitle>
            <div className="flex items-center gap-2">
              {session.pinned && <Pin className="h-4 w-4 text-emerald-600" />}
              <Badge variant="secondary" className="shrink-0">
                {session.questions.length} questions
              </Badge>
              {(onDelete || onTogglePin) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onTogglePin && (
                      <DropdownMenuItem onClick={handleTogglePin}>
                        {session.pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
                        {session.pinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <User className="w-4 h-4" />
            <span>{session.yearsOfExperience} experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Target className="w-4 h-4" />
            <span className="line-clamp-1">{session.topicsToFocus}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(session.createdAt)}</span>
          </div>
          {isHovered && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 bg-transparent"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("View Questions button clicked for session:", session.id)
                toast("Navigating to session page...")
              }}
            >
              View Questions
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}