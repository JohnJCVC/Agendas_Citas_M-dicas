"use client"

import { getPasswordStrength } from "@/lib/validation"

interface PasswordStrengthProps {
  password: string
  show: boolean
}

export default function PasswordStrength({ password, show }: PasswordStrengthProps) {
  if (!show || !password) return null

  const strength = getPasswordStrength(password)
  const percentage = (strength.score / 6) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Fortaleza de contraseña:</span>
        <span className={strength.color}>{strength.text}</span>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            strength.score <= 2
              ? "bg-red-500"
              : strength.score <= 3
                ? "bg-orange-500"
                : strength.score <= 4
                  ? "bg-yellow-500"
                  : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={strength.score}
          aria-valuemin={0}
          aria-valuemax={6}
          aria-label={`Fortaleza de contraseña: ${strength.text}`}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div
            className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}
          >
            <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-muted"}`} />
            <span>8+ caracteres</span>
          </div>
          <div
            className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
          >
            <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? "bg-green-500" : "bg-muted"}`} />
            <span>Mayúscula</span>
          </div>
          <div
            className={`flex items-center gap-1 ${/[a-z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
          >
            <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? "bg-green-500" : "bg-muted"}`} />
            <span>Minúscula</span>
          </div>
        </div>
        <div className="space-y-1">
          <div
            className={`flex items-center gap-1 ${/[0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
          >
            <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(password) ? "bg-green-500" : "bg-muted"}`} />
            <span>Número</span>
          </div>
          <div
            className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
          >
            <div className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(password) ? "bg-green-500" : "bg-muted"}`} />
            <span>Especial</span>
          </div>
          <div
            className={`flex items-center gap-1 ${password.length >= 12 ? "text-green-600" : "text-muted-foreground"}`}
          >
            <div className={`w-2 h-2 rounded-full ${password.length >= 12 ? "bg-green-500" : "bg-muted"}`} />
            <span>12+ (recomendado)</span>
          </div>
        </div>
      </div>

      {strength.score < 4 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            <strong>Consejo:</strong> Usa una frase con números y símbolos para mayor seguridad.
          </p>
        </div>
      )}
    </div>
  )
}
