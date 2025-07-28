export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export const validateField = (value: string, rules: ValidationRule, fieldName: string): string | null => {
  if (rules.required && (!value || value.trim() === "")) {
    return `${fieldName} es obligatorio`
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return `${fieldName} debe tener al menos ${rules.minLength} caracteres`
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return `${fieldName} no puede exceder ${rules.maxLength} caracteres`
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return `${fieldName} tiene un formato inválido`
  }

  if (value && rules.custom) {
    return rules.custom(value)
  }

  return null
}

export const getPasswordStrength = (password: string): { score: number; text: string; color: string } => {
  let score = 0

  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 2) return { score, text: "Muy débil", color: "text-red-600" }
  if (score <= 3) return { score, text: "Débil", color: "text-orange-600" }
  if (score <= 4) return { score, text: "Media", color: "text-yellow-600" }
  if (score <= 5) return { score, text: "Fuerte", color: "text-green-600" }
  return { score, text: "Muy fuerte", color: "text-green-700" }
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/

export const validationRules = {
  login: {
    username: {
      required: true,
      minLength: 3,
      pattern: usernameRegex,
    },
    password: {
      required: true,
      minLength: 6,
    },
  },
  register: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: emailRegex,
    },
    phone: {
      required: true,
      pattern: phoneRegex,
    },
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: usernameRegex,
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value: string) => {
        const strength = getPasswordStrength(value)
        if (strength.score < 3) {
          return "La contraseña debe ser más segura"
        }
        return null
      },
    },
    confirmPassword: {
      required: true,
    },
  },
  contact: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      required: true,
      pattern: emailRegex,
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 200,
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 2000,
    },
  },
}
