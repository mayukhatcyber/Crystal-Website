"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface FocusTrapProps {
  children: React.ReactNode
  isActive: boolean
  onClose: () => void
}

export function FocusTrap({ children, isActive, onClose }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    // Find all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus the first element when the trap is activated
    firstElement.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === "Escape") {
        onClose()
        return
      }

      // Handle Tab key to trap focus
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // If shift+tab and on first element, go to last element
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // If tab and on last element, go to first element
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    // Save previous active element to restore focus when closed
    const previousActiveElement = document.activeElement as HTMLElement

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      // Restore focus when trap is deactivated
      if (previousActiveElement) {
        previousActiveElement.focus()
      }
    }
  }, [isActive, onClose])

  return <div ref={containerRef}>{children}</div>
}
