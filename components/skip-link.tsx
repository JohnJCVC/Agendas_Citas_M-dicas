"use client"

import type React from "react"

import { useEffect, useState } from "react"

export default function SkipLink() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsKeyboardUser(true)
        document.body.classList.add("keyboard-user")
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
      document.body.classList.remove("keyboard-user")
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleMouseDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  const handleSkipToMain = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: "smooth", block: "start" })

      // Announce to screen readers
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "polite")
      announcement.className = "sr-only"
      announcement.textContent = "Saltando al contenido principal"
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 1000)
    }
  }

  return (
    <>
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-6 py-3 rounded-md z-[9999] font-bold text-lg shadow-2xl border-2 border-primary-foreground"
        onClick={handleSkipToMain}
        onFocus={(e) => {
          e.target.scrollIntoView({ behavior: "smooth" })
        }}
      >
        Saltar al contenido principal
      </a>

      {/* Additional Skip Links */}
      <a
        href="#navigation"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 bg-secondary text-secondary-foreground px-4 py-2 rounded-md z-[9998] font-medium shadow-lg"
      >
        Ir a navegación
      </a>

      <a
        href="#accessibility-menu"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 bg-accent text-accent-foreground px-4 py-2 rounded-md z-[9997] font-medium shadow-lg"
        onClick={(e) => {
          e.preventDefault()
          const accessibilityButton = document.querySelector(
            '[aria-label="Abrir menú de accesibilidad"]',
          ) as HTMLButtonElement
          if (accessibilityButton) {
            accessibilityButton.click()
            accessibilityButton.focus()
          }
        }}
      >
        Abrir herramientas de accesibilidad
      </a>
    </>
  )
}
