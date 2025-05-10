"use client"

import { useEffect, useState } from "react"

interface AccessibilityAnnouncerProps {
  message: string
  assertiveness?: "polite" | "assertive"
  clearDelay?: number
}

export function AccessibilityAnnouncer({
  message,
  assertiveness = "polite",
  clearDelay = 5000,
}: AccessibilityAnnouncerProps) {
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    if (!message) return

    setAnnouncement(message)

    const timeoutId = setTimeout(() => {
      setAnnouncement("")
    }, clearDelay)

    return () => clearTimeout(timeoutId)
  }, [message, clearDelay])

  if (!announcement) return null

  return (
    <div
      aria-live={assertiveness}
      aria-atomic="true"
      className="sr-only"
      role={assertiveness === "assertive" ? "alert" : "status"}
    >
      {announcement}
    </div>
  )
}
