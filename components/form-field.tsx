"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

interface FormFieldProps {
  id: string
  name: string
  label: string
  type?: "text" | "email" | "password" | "tel" | "textarea"
  value: string
  error?: string
  touched?: boolean
  required?: boolean
  placeholder?: string
  autoComplete?: string
  autoFocus?: boolean
  maxLength?: number
  rows?: number
  onChange: (value: string) => void
  onBlur: () => void
  icon?: React.ReactNode
  helpText?: string
  validationStatus?: "valid" | "invalid" | "pending"
  showCharacterCount?: boolean
  fieldDescription?: string
}

export default function FormField({
  id,
  name,
  label,
  type = "text",
  value,
  error,
  touched,
  required,
  placeholder,
  autoComplete,
  autoFocus,
  maxLength,
  rows = 4,
  onChange,
  onBlur,
  icon,
  helpText,
  validationStatus,
  showCharacterCount,
  fieldDescription,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const hasError = touched && error
  const isValid = touched && !error && value.length > 0

  const inputType = type === "password" && showPassword ? "text" : type

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={`text-sm font-medium flex items-center gap-2 ${hasError ? "text-destructive" : "text-foreground"}`}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {label}
        {required && (
          <span className="text-destructive" aria-label="campo obligatorio">
            *
          </span>
        )}
      </Label>

      <div className="relative">
        {type === "textarea" ? (
          <Textarea
            id={id}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoFocus={autoFocus}
            maxLength={maxLength}
            rows={rows}
            className={`resize-none ${
              hasError
                ? "border-destructive focus:border-destructive focus:ring-destructive"
                : isValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                  : ""
            }`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${id}-error` : helpText ? `${id}-help` : undefined}
            required={required}
          />
        ) : (
          <Input
            id={id}
            name={name}
            type={inputType}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            className={`${type === "password" ? "pr-12" : ""} ${
              hasError
                ? "border-destructive focus:border-destructive focus:ring-destructive"
                : isValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                  : ""
            }`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${id}-error` : helpText ? `${id}-help` : undefined}
            required={required}
          />
        )}

        {/* Password visibility toggle */}
        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={togglePasswordVisibility}
            aria-label={
              showPassword ? `Ocultar contraseña del campo ${label}` : `Mostrar contraseña del campo ${label}`
            }
            tabIndex={-1}
          >
            {showPassword ? (
              <>
                <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Contraseña visible</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Contraseña oculta</span>
              </>
            )}
          </Button>
        )}

        {/* Enhanced Validation icons with better feedback */}
        {type !== "password" && (
          <div className="absolute right-3 top-3 flex items-center gap-1">
            {hasError && (
              <>
                <AlertCircle className="h-4 w-4 text-destructive animate-pulse" aria-hidden="true" />
                <span className="sr-only">Error en el campo {label}</span>
              </>
            )}
            {isValid && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                <span className="sr-only">Campo {label} completado correctamente</span>
              </>
            )}
            {!hasError && !isValid && touched && (
              <div
                className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>

      {/* Enhanced Character count for all input types */}
      {maxLength && value && (
        <div className="flex justify-between items-center text-xs mt-1">
          <span className="text-muted-foreground">{type === "textarea" ? "Caracteres:" : "Longitud:"}</span>
          <div className="flex items-center gap-2">
            <span
              className={`${
                value.length > maxLength * 0.9
                  ? "text-orange-600"
                  : value.length > maxLength * 0.7
                    ? "text-yellow-600"
                    : "text-muted-foreground"
              }`}
            >
              {value.length}/{maxLength}
            </span>
            {value.length > 0 && (
              <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    value.length > maxLength * 0.9
                      ? "bg-orange-500"
                      : value.length > maxLength * 0.7
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min((value.length / maxLength) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help text */}
      {helpText && !hasError && (
        <p id={`${id}-help`} className="text-xs text-muted-foreground">
          {helpText}
        </p>
      )}

      {/* Error message */}
      {hasError && (
        <p id={`${id}-error`} className="text-xs text-destructive flex items-center gap-1" role="alert">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Add this after the error message section */}
      {isValid && touched && (
        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
          <CheckCircle className="h-3 w-3" aria-hidden="true" />
          <span>Campo completado correctamente</span>
        </div>
      )}
    </div>
  )
}
