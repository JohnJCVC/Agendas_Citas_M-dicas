"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { validateField, type ValidationRules } from "@/lib/validation"

interface UseFormValidationProps {
  initialValues: Record<string, string>
  validationRules: ValidationRules
  onSubmit: (values: Record<string, string>) => Promise<void> | void
}

export function useFormValidation({ initialValues, validationRules, onSubmit }: UseFormValidationProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateSingleField = useCallback(
    (name: string, value: string) => {
      const rule = validationRules[name]
      if (!rule) return null

      // Special case for confirmPassword
      if (name === "confirmPassword") {
        if (value !== values.password) {
          return "Las contraseñas no coinciden"
        }
      }

      return validateField(value, rule, name)
    },
    [validationRules, values.password],
  )

  const setValue = useCallback(
    (name: string, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }))

      // Validate field if it has been touched
      if (touched[name]) {
        const error = validateSingleField(name, value)
        setErrors((prev) => ({
          ...prev,
          [name]: error || "",
        }))
      }
    },
    [touched, validateSingleField],
  )

  const setFieldTouched = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }))

      // Validate field when touched
      const error = validateSingleField(name, values[name] || "")
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }))
    },
    [values, validateSingleField],
  )

  const validateAllFields = useCallback(() => {
    const newErrors: Record<string, string> = {}
    let hasErrors = false

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateSingleField(fieldName, values[fieldName] || "")
      if (error) {
        newErrors[fieldName] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

    return !hasErrors
  }, [validationRules, values, validateSingleField])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (isSubmitting) return

      const isValid = validateAllFields()
      if (!isValid) return

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [isSubmitting, validateAllFields, onSubmit, values],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0,
  }
}
