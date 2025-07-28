"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import SkipLink from "@/components/skip-link"
import FormField from "@/components/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation"
import { useI18n } from "@/hooks/use-i18n"

export default function LoginPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)
  const [rememberMe, setRememberMe] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const { values, errors, touched, isSubmitting, setValue, setFieldTouched, handleSubmit, reset } = useFormValidation({
    initialValues: {
      username: "",
      password: "",
    },
    validationRules: validationRules.login,
    onSubmit: async (formValues) => {
      setGeneralError("")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Demo credentials
      if (formValues.username === "admin" && formValues.password === "password123") {
        // Success
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", formValues.username)
        }

        // Announce success to screen readers
        const announcement = document.createElement("div")
        announcement.setAttribute("aria-live", "polite")
        announcement.className = "sr-only"
        announcement.textContent = "Inicio de sesión exitoso. Redirigiendo..."
        document.body.appendChild(announcement)
        setTimeout(() => document.body.removeChild(announcement), 2000)

        router.push("/")
      } else {
        // Failed login
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        setGeneralError("Usuario o contraseña incorrectos")

        if (newAttempts >= 3) {
          setIsBlocked(true)
          setBlockTimeRemaining(300) // 5 minutes
          setGeneralError("Demasiados intentos fallidos. Cuenta bloqueada temporalmente.")
        }
      }
    },
  })

  // Load remembered username
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedUsername")
    if (remembered) {
      setValue("username", remembered)
      setRememberMe(true)
    }
  }, [setValue])

  // Block timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isBlocked && blockTimeRemaining > 0) {
      interval = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false)
            setLoginAttempts(0)
            setGeneralError("")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isBlocked, blockTimeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <AccessibilityToolbar />
      <Navigation />

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="sr-only">Ícono de seguridad - Inicio de sesión</span>
              </div>
              <div>
                <CardTitle className="text-2xl">{t.navigation.login}</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder al sistema de citas médicas</CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-6">
                {/* General Error Alert */}
                {generalError && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{generalError}</AlertDescription>
                  </Alert>
                )}

                {/* Block Timer */}
                {isBlocked && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Cuenta bloqueada. Tiempo restante: {formatTime(blockTimeRemaining)}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Login Attempts Warning */}
                {loginAttempts > 0 && loginAttempts < 3 && (
                  <Alert role="alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Intento {loginAttempts} de 3. {3 - loginAttempts} intentos restantes.
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  id="username"
                  name="username"
                  label="Nombre de Usuario"
                  type="text"
                  value={values.username}
                  error={errors.username}
                  touched={touched.username}
                  required
                  placeholder="Ingresa tu nombre de usuario"
                  autoComplete="username"
                  autoFocus
                  icon={
                    <>
                      <User className="h-4 w-4" />
                      <span className="sr-only">Ícono de usuario</span>
                    </>
                  }
                  onChange={(value) => setValue("username", value)}
                  onBlur={() => setFieldTouched("username")}
                  helpText="Mínimo 3 caracteres, solo letras, números y guiones bajos"
                />

                <FormField
                  id="password"
                  name="password"
                  label="Contraseña"
                  type="password"
                  value={values.password}
                  error={errors.password}
                  touched={touched.password}
                  required
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  icon={
                    <>
                      <Lock className="h-4 w-4" />
                      <span className="sr-only">Ícono de contraseña</span>
                    </>
                  }
                  onChange={(value) => setValue("password", value)}
                  onBlur={() => setFieldTouched("password")}
                />

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    aria-describedby="remember-me-description"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Recordar usuario
                  </label>
                </div>
                <p id="remember-me-description" className="text-xs text-muted-foreground">
                  Tu nombre de usuario se guardará en este dispositivo
                </p>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isBlocked}
                  aria-describedby="login-button-description"
                  aria-label="Iniciar sesión con las credenciales proporcionadas"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span className="sr-only">Cargando</span>
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
                <p id="login-button-description" className="sr-only">
                  Presiona Enter o haz clic para iniciar sesión con las credenciales ingresadas
                </p>

                <div className="text-center text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    Regístrate aquí
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-sm mb-2">Credenciales de demostración:</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Usuario:</strong> admin
              </p>
              <p>
                <strong>Contraseña:</strong> password123
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
