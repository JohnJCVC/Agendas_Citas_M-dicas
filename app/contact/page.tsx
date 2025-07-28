"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import Navigation from "@/components/navigation"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import SkipLink from "@/components/skip-link"
import FormField from "@/components/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation"
import { useI18n } from "@/hooks/use-i18n"

export default function ContactPage() {
  const { t } = useI18n()
  const [isSuccess, setIsSuccess] = useState(false)
  const [priority, setPriority] = useState("")
  const [generalError, setGeneralError] = useState("")

  const { values, errors, touched, isSubmitting, setValue, setFieldTouched, handleSubmit, reset } = useFormValidation({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationRules: validationRules.contact,
    onSubmit: async (formValues) => {
      setGeneralError("")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate spam detection
      if (formValues.message.toLowerCase().includes("spam")) {
        setGeneralError("Mensaje detectado como spam. Por favor, revisa el contenido.")
        return
      }

      // Success
      setIsSuccess(true)

      // Announce success to screen readers
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "polite")
      announcement.className = "sr-only"
      announcement.textContent = "Mensaje enviado exitosamente. Te responderemos pronto."
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 2000)

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false)
        reset()
        setPriority("")
      }, 5000)
    },
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "emergency":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Send className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <AccessibilityToolbar />
      <Navigation />

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Contacto y Soporte</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Utiliza este formulario para enviar una consulta al equipo médico
              universitario. Responderemos en menos de 24 horas.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" aria-hidden="true" />
                  Enviar Mensaje
                </CardTitle>
                <CardDescription>
                  Completa todos los campos marcados con asterisco (*). Sé específico en tu consulta para recibir una
                  respuesta más precisa.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Success Message */}
                {isSuccess && (
                  <Alert className="mb-6" role="alert">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>¡Mensaje enviado exitosamente!</strong>
                      <br />
                      Hemos recibido tu consulta. Te responderemos dentro de las próximas 24 horas a la dirección de
                      correo proporcionada.
                    </AlertDescription>
                  </Alert>
                )}

                {/* General Error */}
                {generalError && (
                  <Alert variant="destructive" className="mb-6" role="alert">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{generalError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <FormField
                    id="name"
                    name="name"
                    label="Nombre Completo"
                    type="text"
                    value={values.name}
                    error={errors.name}
                    touched={touched.name}
                    required
                    placeholder="Tu nombre completo"
                    autoComplete="name"
                    autoFocus
                    maxLength={100}
                    onChange={(value) => setValue("name", value)}
                    onBlur={() => setFieldTouched("name")}
                  />

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
                    onChange={(value) => setValue("email", value)}
                    onBlur={() => setFieldTouched("email")}
                    helpText="Usa tu correo universitario para una respuesta más rápida"
                  />

                  {/* Priority Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prioridad de la Consulta</label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la prioridad de tu consulta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
                            Baja - Consulta general
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" aria-hidden="true" />
                            Media - Necesito ayuda
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full" aria-hidden="true" />
                            Alta - Problema urgente
                          </div>
                        </SelectItem>
                        <SelectItem value="emergency">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
                            Emergencia - Atención inmediata
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {priority === "emergency" && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Para emergencias médicas reales, llama al <strong>911</strong> o dirígete a la sala de
                          emergencias más cercana.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <FormField
                    id="subject"
                    name="subject"
                    label="Asunto"
                    type="text"
                    value={values.subject}
                    error={errors.subject}
                    touched={touched.subject}
                    required
                    placeholder="Breve descripción del tema"
                    maxLength={200}
                    onChange={(value) => setValue("subject", value)}
                    onBlur={() => setFieldTouched("subject")}
                    helpText="Describe brevemente el motivo de tu consulta"
                  />

                  <FormField
                    id="message"
                    name="message"
                    label="Mensaje"
                    type="textarea"
                    value={values.message}
                    error={errors.message}
                    touched={touched.message}
                    required
                    placeholder="Describe detalladamente tu consulta o problema. Incluye toda la información relevante para que podamos ayudarte mejor."
                    maxLength={2000}
                    rows={6}
                    onChange={(value) => setValue("message", value)}
                    onBlur={() => setFieldTouched("message")}
                    helpText="Mínimo 10 caracteres. Incluye detalles específicos para una mejor asistencia."
                  />

                  {/* Anti-spam Notice */}
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                    <p>
                      <strong>Nota:</strong> Este formulario está protegido contra spam. Tu mensaje será revisado antes
                      del envío para garantizar la calidad del servicio.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`flex-1 ${priority === "emergency" ? "bg-red-600 hover:bg-red-700" : ""}`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          {getPriorityIcon(priority)}
                          <span className="ml-2">Enviar Mensaje</span>
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        reset()
                        setPriority("")
                        setGeneralError("")
                        setIsSuccess(false)
                      }}
                      disabled={isSubmitting}
                      className="bg-transparent"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription>Múltiples formas de comunicarte con nosotros</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono</h3>
                      <p className="text-muted-foreground mb-1">+1 (555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Lunes a Viernes, 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Correo Electrónico</h3>
                      <p className="text-muted-foreground mb-1">soporte@citasmed.universidad.edu</p>
                      <p className="text-sm text-muted-foreground">Respuesta en 24 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Ubicación</h3>
                      <p className="text-muted-foreground">
                        Centro Médico Universitario
                        <br />
                        Edificio de Salud, Piso 2<br />
                        Campus Principal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horarios de Atención</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
                        <p>Sábados: 9:00 AM - 2:00 PM</p>
                        <p>Domingos: Cerrado</p>
                        <p className="text-red-600 font-medium">Emergencias: 24/7</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Emergencias Médicas</CardTitle>
                  <CardDescription>Para situaciones que requieren atención inmediata</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Si tienes una emergencia médica, llama inmediatamente al <strong>911</strong> o dirígete a la sala
                      de emergencias más cercana.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">Línea de Emergencias Universitaria:</p>
                      <p className="text-2xl font-bold text-red-600">+1 (555) 911-HELP</p>
                      <p className="text-sm text-muted-foreground">Disponible 24 horas, 7 días a la semana</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiempo de Respuesta Estimado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" aria-hidden="true" />
                        Consulta General
                      </span>
                      <span className="text-sm text-muted-foreground">24-48 horas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" aria-hidden="true" />
                        Problema Técnico
                      </span>
                      <span className="text-sm text-muted-foreground">12-24 horas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" aria-hidden="true" />
                        Urgente
                      </span>
                      <span className="text-sm text-muted-foreground">2-6 horas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" aria-hidden="true" />
                        Emergencia
                      </span>
                      <span className="text-sm text-muted-foreground">Inmediato</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
