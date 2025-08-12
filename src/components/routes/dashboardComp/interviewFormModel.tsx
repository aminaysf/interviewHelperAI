"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { InterviewFormData } from "@/controllers/Auth/generateInterview"

interface InterviewFormModalProps {
  onSubmit: (data: InterviewFormData) => Promise<void>
}

export function InterviewFormModal({ onSubmit }: InterviewFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<InterviewFormData>({
    targetRole: "",
    yearsOfExperience: "",
    topicsToFocus: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      setOpen(false)
      setFormData({
        targetRole: "",
        yearsOfExperience: "",
        topicsToFocus: "",
        description: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof InterviewFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Interview Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="targetRole">Target Role</Label>
            <Input
              id="targetRole"
              placeholder="e.g., Web Developer, Data Scientist, Product Manager"
              value={formData.targetRole}
              onChange={(e) => updateFormData("targetRole", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Select
              value={formData.yearsOfExperience}
              onValueChange={(value) => updateFormData("yearsOfExperience", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                <SelectItem value="2-3">2-3 years (Junior)</SelectItem>
                <SelectItem value="4-6">4-6 years (Mid Level)</SelectItem>
                <SelectItem value="7-10">7-10 years (Senior)</SelectItem>
                <SelectItem value="10+">10+ years (Expert)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topicsToFocus">Topics to Focus On</Label>
            <Input
              id="topicsToFocus"
              placeholder="e.g., React, Node.js, System Design, Algorithms"
              value={formData.topicsToFocus}
              onChange={(e) => updateFormData("topicsToFocus", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Description</Label>
            <Textarea
              id="description"
              placeholder="Any specific requirements, company type, or areas you want to emphasize..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Interview"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
