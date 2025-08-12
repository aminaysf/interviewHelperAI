"use client"

import type { ComponentProps } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function SubmitButton({ className, children, ...props }: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className={cn("inline-flex items-center justify-center", className)}
      disabled={pending || props.disabled}
      {...props}
    >
      {pending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
      <span>{pending ? "Please wait..." : children}</span>
    </Button>
  )
}
