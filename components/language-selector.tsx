"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, ChevronDown, Check } from "lucide-react"
import { useI18n } from "@/hooks/use-i18n"
import { languages, type Language } from "@/lib/i18n"

export default function LanguageSelector() {
  const { language, setLanguage, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === language)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        setFocusedIndex(-1)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault()
        setIsOpen(true)
        setFocusedIndex(0)
      }
      return
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setFocusedIndex((prev) => (prev + 1) % languages.length)
        break
      case "ArrowUp":
        event.preventDefault()
        setFocusedIndex((prev) => (prev - 1 + languages.length) % languages.length)
        break
      case "Enter":
      case " ":
        event.preventDefault()
        if (focusedIndex >= 0) {
          handleLanguageSelect(languages[focusedIndex].code)
        }
        break
      case "Home":
        event.preventDefault()
        setFocusedIndex(0)
        break
      case "End":
        event.preventDefault()
        setFocusedIndex(languages.length - 1)
        break
    }
  }

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode)
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 h-10 px-3"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-label={t.accessibility.languageSelector}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="language-menu"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        <span className="hidden md:inline">{currentLanguage?.name}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </Button>

      {isOpen && (
        <Card className="absolute top-full right-0 mt-1 w-48 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
          <CardContent className="p-1">
            <div role="listbox" id="language-menu" aria-label={t.accessibility.languageSelector} className="space-y-1">
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={lang.code === language}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                    focusedIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-muted focus:bg-muted"
                  } ${lang.code === language ? "font-medium" : ""}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onFocus={() => setFocusedIndex(index)}
                >
                  <span className="text-lg" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span className="flex-1 text-left">{lang.name}</span>
                  {lang.code === language && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
