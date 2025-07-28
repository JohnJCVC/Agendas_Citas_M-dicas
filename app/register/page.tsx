"use client"
import { AlertCircle } from "lucide-react" // Import AlertCircle
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { User, Mail, Phone, Lock, UserPlus, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import SkipLink from "@/components/skip-link"
import FormField from "@/components/form-field"
import PasswordStrength from "@/components/password-strength"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation"
import { useI18n } from "@/hooks/use-i18n"

export default function RegisterPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const { values, errors, touched, isSubmitting, setValue, setFieldTouched, handleSubmit, reset } = useFormValidation({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationRules: validationRules.register,
    onSubmit: async (formValues) => {
      setGeneralError("")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate email check
      if (formValues.email === "test@example.com") {
        setGeneralError("Este correo electrónico ya está registrado")
        return
      }

      // Simulate username check
      if (formValues.username === "admin") {
        setGeneralError("Este nombre de usuario no está disponible")
        return
      }

      // Success
      setIsSuccess(true)

      // Announce success to screen readers
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "polite")
      announcement.className = "sr-only"
      announcement.textContent = "Registro completado exitosamente"
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 2000)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    },
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const [fieldValidationStatus, setFieldValidationStatus] = useState<Record<string, "valid" | "invalid" | "pending">>(
    {},
  )
  const [showValidationSummary, setShowValidationSummary] = useState(false)
  const [formCompletionPercentage, setFormCompletionPercentage] = useState(0)

  // Add this useEffect to calculate form completion
  useEffect(() => {
    const totalFields = Object.keys(validationRules.register).length
    const completedFields = Object.keys(values).filter((key) => values[key] && values[key].trim() !== "").length
    const percentage = Math.round((completedFields / totalFields) * 100)
    setFormCompletionPercentage(percentage)
  }, [values])

  // Add this function to show field completion status
  const getFieldCompletionIcon = (fieldName: string) => {
    const hasValue = values[fieldName] && values[fieldName].trim() !== ""
    const hasError = errors[fieldName]
    const isTouched = touched[fieldName]

    if (!isTouched) return null
    if (hasError) return <AlertCircle className="h-4 w-4 text-destructive" />
    if (hasValue) return <CheckCircle className="h-4 w-4 text-green-500" />
    return null
  }

  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 1:
        return ["firstName", "lastName"]
      case 2:
        return ["email", "phone"]
      case 3:
        return ["username", "password", "confirmPassword"]
      default:
        return []
    }
  }

  const validateCurrentStep = () => {
    const currentFields = getCurrentStepFields()
    return currentFields.every((field) => {
      const hasValue = values[field] && values[field].trim() !== ""
      const hasError = errors[field]
      return hasValue && !hasError
    })
  }

  const handleNextStep = () => {
    const currentFields = getCurrentStepFields()

    // Touch all current step fields
    currentFields.forEach((field) => {
      setFieldTouched(field)
    })

    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <SkipLink />
        <AccessibilityToolbar />
        <Navigation />

        <main id="main-content" className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-bold text-green-600 mb-2">¡Registro Exitoso!</h1>
                <p className="text-muted-foreground mb-4">
                  Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión en unos segundos.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Usuario:</strong> {values.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Email:</strong> {values.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <AccessibilityToolbar />
      <Navigation />

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="sr-only">Ícono de registro de usuario</span>
              </div>
              <div>
                <CardTitle className="text-2xl">{t.navigation.register}</CardTitle>
                <CardDescription>
                  Crea tu cuenta para acceder al sistema de citas médicas universitarias
                </CardDescription>
              </div>

              {/* Enhanced Progress Indicator with completion status */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Paso {currentStep} de {totalSteps}
                  </span>
                  <span>{Math.round(progress)}% del proceso</span>
                </div>
                <Progress
                  value={progress}
                  className="h-3"
                  aria-label={`Progreso del registro: ${Math.round(progress)}% completado`}
                />

                {/* Form completion indicator */}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Campos completados:</span>
                  <span
                    className={`font-medium ${formCompletionPercentage === 100 ? "text-green-600" : "text-primary"}`}
                  >
                    {formCompletionPercentage}%
                  </span>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        step < currentStep
                          ? "bg-green-500 text-white"
                          : step === currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                      aria-label={`Paso ${step} ${step < currentStep ? "completado" : step === currentStep ? "actual" : "pendiente"}`}
                    >
                      {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-6">
                {/* Add this right after CardContent opening tag */}
                {showValidationSummary && Object.keys(errors).length > 0 && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Por favor corrige los siguientes errores:</strong>
                      <ul className="mt-2 space-y-1">
                        {Object.entries(errors).map(([field, error]) => (
                          <li key={field} className="text-sm">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* General Error Alert */}
                {generalError && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{generalError}</AlertDescription>
                  </Alert>
                )}

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Paso 1:</strong> Información personal básica. Estos datos aparecerán en tu perfil
                        médico.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">Información Personal</h3>
                        <p className="text-sm text-muted-foreground">Ingresa tu nombre completo</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          id="firstName"
                          name="firstName"
                          label="Nombre"
                          type="text"
                          value={values.firstName}
                          error={errors.firstName}
                          touched={touched.firstName}
                          required
                          placeholder="Tu nombre"
                          autoComplete="given-name"
                          autoFocus
                          icon={
                            <>
                              <User className="h-4 w-4" />
                              <span className="sr-only">Ícono de usuario</span>
                              {getFieldCompletionIcon("firstName")}
                            </>
                          }
                          onChange={(value) => setValue("firstName", value)}
                          onBlur={() => setFieldTouched("firstName")}
                        />

                        <FormField
                          id="lastName"
                          name="lastName"
                          label="Apellido"
                          type="text"
                          value={values.lastName}
                          error={errors.lastName}
                          touched={touched.lastName}
                          required
                          placeholder="Tu apellido"
                          autoComplete="family-name"
                          icon={
                            <>
                              <User className="h-4 w-4" />
                              <span className="sr-only">Ícono de usuario</span>
                              {getFieldCompletionIcon("lastName")}
                            </>
                          }
                          onChange={(value) => setValue("lastName", value)}
                          onBlur={() => setFieldTouched("lastName")}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Paso 2:</strong> Información de contacto. Usaremos estos datos para confirmaciones y
                        recordatorios.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">Información de Contacto</h3>
                        <p className="text-sm text-muted-foreground">Proporciona tu email y teléfono</p>
                      </div>

                      <FormField
                        id="email"
                        name="email"
                        label="Correo Electrónico"
                        type="email"
                        value={values.email}
                        error={errors.email}
                        touched={touched.email}
                        required
                        placeholder="tu.email@universidad.edu"
                        autoComplete="email"
                        autoFocus
                        icon={
                          <>
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Ícono de correo electrónico</span>
                            {getFieldCompletionIcon("email")}
                          </>
                        }
                        onChange={(value) => setValue("email", value)}
                        onBlur={() => setFieldTouched("email")}
                        helpText="Usa tu correo universitario oficial"
                      />

                      <FormField
                        id="phone"
                        name="phone"
                        label="Teléfono"
                        type="tel"
                        value={values.phone}
                        error={errors.phone}
                        touched={touched.phone}
                        required
                        placeholder="+1 234 567 8900"
                        autoComplete="tel"
                        icon={
                          <>
                            <Phone className="h-4 w-4" />
                            <span className="sr-only">Ícono de teléfono</span>
                            {getFieldCompletionIcon("phone")}
                          </>
                        }
                        onChange={(value) => setValue("phone", value)}
                        onBlur={() => setFieldTouched("phone")}
                        helpText="Incluye código de país si es internacional"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Account Credentials */}
                {currentStep === 3 && (
                  <>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Paso 3:</strong> Credenciales de acceso. Elige una contraseña segura que recordarás
                        fácilmente.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">Credenciales de Acceso</h3>
                        <p className="text-sm text-muted-foreground">Crea tu usuario y contraseña</p>
                      </div>

                      <FormField
                        id="username"
                        name="username"
                        label="Nombre de Usuario"
                        type="text"
                        value={values.username}
                        error={errors.username}
                        touched={touched.username}
                        required
                        placeholder="Elige un nombre de usuario único"
                        autoComplete="username"
                        autoFocus
                        icon={
                          <>
                            <User className="h-4 w-4" />
                            <span className="sr-only">Ícono de usuario</span>
                            {getFieldCompletionIcon("username")}
                          </>
                        }
                        onChange={(value) => setValue("username", value)}
                        onBlur={() => setFieldTouched("username")}
                        helpText="3-20 caracteres, solo letras, números y guiones bajos"
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
                        placeholder="Crea una contraseña segura"
                        autoComplete="new-password"
                        icon={
                          <>
                            <Lock className="h-4 w-4" />
                            <span className="sr-only">Ícono de contraseña</span>
                            {getFieldCompletionIcon("password")}
                          </>
                        }
                        onChange={(value) => setValue("password", value)}
                        onBlur={() => setFieldTouched("password")}
                      />

                      <PasswordStrength
                        password={values.password}
                        show={touched.password || values.password.length > 0}
                      />

                      <FormField
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirmar Contraseña"
                        type="password"
                        value={values.confirmPassword}
                        error={errors.confirmPassword}
                        touched={touched.confirmPassword}
                        required
                        placeholder="Confirma tu contraseña"
                        autoComplete="new-password"
                        icon={
                          <>
                            <Lock className="h-4 w-4" />
                            <span className="sr-only">Ícono de contraseña</span>
                            {getFieldCompletionIcon("confirmPassword")}
                          </>
                        }
                        onChange={(value) => setValue("confirmPassword", value)}
                        onBlur={() => setFieldTouched("confirmPassword")}
                      />
                    </div>
                  </>
                )}

                {currentStep === totalSteps && (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-sm">Resumen de tu registro:</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nombre completo:</span>
                        <span className="font-medium">
                          {values.firstName} {values.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{values.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teléfono:</span>
                        <span className="font-medium">{values.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Usuario:</span>
                        <span className="font-medium">{values.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contraseña:</span>
                        <span className="font-medium">••••••••</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Al completar el registro aceptas nuestros términos de servicio y política de privacidad.
                      </p>
                    </div>
                  </div>
                )}

                {/* Enhanced Navigation Buttons */}
                <div className="flex justify-between items-center pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="bg-transparent flex items-center gap-2"
                    aria-label={`Volver al paso ${currentStep - 1}`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-3">
                    {/* Step completion indicator */}
                    <span className="text-xs text-muted-foreground">
                      {validateCurrentStep()
                        ? "Paso completado"
                        : `${getCurrentStepFields().filter((field) => values[field] && !errors[field]).length}/${getCurrentStepFields().length} campos`}
                    </span>

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!validateCurrentStep()}
                        className="flex items-center gap-2"
                        aria-label={`Continuar al paso ${currentStep + 1}`}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !validateCurrentStep()}
                        aria-label="Completar proceso de registro con la información proporcionada"
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span className="sr-only">Procesando registro</span>
                            Registrando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Completar Registro
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </form>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
