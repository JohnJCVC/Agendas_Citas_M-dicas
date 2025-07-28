"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Phone, Heart, Shield, Clock, MapPin, Download, Subtitles } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import SkipLink from "@/components/skip-link"
import { useI18n } from "@/hooks/use-i18n"
import QuickActions from "@/components/quick-actions"

export default function HomePage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <AccessibilityToolbar />
      <Navigation />
      <QuickActions />

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sistema Universitario de Citas Médicas</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma accesible e intuitiva para la gestión de citas médicas internas de la universidad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" aria-hidden="true" />
                <div>
                  <CardTitle>{t.navigation.appointments}</CardTitle>
                  <CardDescription>Agenda tu cita médica de forma rápida y sencilla</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/appointments">
                <Button className="w-full" size="lg">
                  {t.navigation.myAppointments}
                  <span className="sr-only">Ir a la página de gestión de citas médicas</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" aria-hidden="true" />
                <div>
                  <CardTitle>{t.navigation.profile}</CardTitle>
                  <CardDescription>Actualiza tu información personal y médica</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Ver Perfil
                  <span className="sr-only">Ir a la página de perfil de usuario</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Phone className="h-8 w-8 text-primary" aria-hidden="true" />
                <div>
                  <CardTitle>{t.navigation.contact}</CardTitle>
                  <CardDescription>Comunícate con nuestro equipo de soporte</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/contact">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  {t.navigation.contact}
                  <span className="sr-only">Ir a la página de contacto</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <section className="bg-muted/50 rounded-lg p-8 mb-12" aria-labelledby="video-section">
          <h2 id="video-section" className="text-2xl font-bold text-center mb-8">
            Bienvenida al Sistema de Citas Médicas
          </h2>

          {/* Accessible Video Player */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="video-container relative bg-black rounded-lg overflow-hidden">
              <video
                controls
                preload="metadata"
                className="w-full h-auto"
                aria-describedby="video-description"
                poster="/placeholder.svg?height=400&width=800&text=Video+de+Bienvenida"
              >
                <source src="https://youtu.be/uakjiI7fK7Q" type="video/mp4" />
                <track kind="subtitles" src="/subtitles/welcome-es.vtt" srcLang="es" label="Español" default />
                <track kind="captions" src="/subtitles/welcome-es-cc.vtt" srcLang="es" label="Español (CC)" />
                <track
                  kind="descriptions"
                  src="/subtitles/welcome-descriptions.vtt"
                  srcLang="es"
                  label="Descripciones de Audio"
                />
                <p>
                  Tu navegador no soporta el elemento de video.
                  <a href="https://youtu.be/uakjiI7fK7Q" target="_blank" rel="noopener noreferrer">
                    Ver video en YouTube
                  </a>
                </p>
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-black/70 text-white hover:bg-black/90"
                  onClick={() => {
                    const video = document.querySelector("video")
                    if (video) {
                      const tracks = video.textTracks
                      for (let i = 0; i < tracks.length; i++) {
                        tracks[i].mode = tracks[i].mode === "showing" ? "hidden" : "showing"
                      }
                    }
                  }}
                  aria-label="Activar/Desactivar Subtítulos"
                >
                  <Subtitles className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div id="video-description" className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>Descripción del video:</strong> Video de bienvenida al Sistema Universitario de Citas Médicas.
                Muestra las principales funcionalidades del sistema, incluyendo cómo reservar citas, gestionar tu perfil
                y contactar con el equipo médico. El video incluye subtítulos cerrados y descripciones de audio para
                garantizar la accesibilidad completa.
              </p>
            </div>

            {/* Download Transcription */}
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                onClick={() => {
                  const transcription = `TRANSCRIPCIÓN DEL VIDEO DE BIENVENIDA

Sistema Universitario de Citas Médicas

Bienvenidos al nuevo Sistema Universitario de Citas Médicas, diseñado especialmente para estudiantes, profesores y personal de nuestra institución.

CARACTERÍSTICAS PRINCIPALES:
- Reserva de citas médicas 24/7
- Gestión completa de tu perfil médico
- Contacto directo con especialistas
- Sistema completamente accesible

CÓMO USAR EL SISTEMA:
1. Regístrate con tu información universitaria
2. Completa tu perfil médico
3. Selecciona especialidad y médico
4. Elige fecha y hora disponible
5. Confirma tu cita

ACCESIBILIDAD:
Nuestro sistema cumple con los estándares internacionales de accesibilidad, incluyendo:
- Navegación por teclado
- Compatibilidad con lectores de pantalla
- Alto contraste y ajustes visuales
- Subtítulos y transcripciones

Para más información, contacta con nuestro equipo de soporte.

¡Gracias por usar nuestro sistema de citas médicas!`

                  const blob = new Blob([transcription], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "transcripcion-video-bienvenida.txt"
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="h-4 w-4" />
                Descargar Transcripción
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 rounded-lg p-8 mb-12" aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-bold text-center mb-8">
            Características del Sistema
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Seguro y Privado</h3>
              <p className="text-sm text-muted-foreground">
                Protección total de datos médicos según normativas universitarias
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Completamente Accesible</h3>
              <p className="text-sm text-muted-foreground">
                Diseñado para usuarios con diferentes capacidades y necesidades, cumpliendo estándares ISO
              </p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Disponible 24/7</h3>
              <p className="text-sm text-muted-foreground">Reserva y gestiona tus citas en cualquier momento del día</p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Múltiples Ubicaciones</h3>
              <p className="text-sm text-muted-foreground">Centros médicos en diferentes campus universitarios</p>
            </div>
          </div>
        </section>

        <section className="text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-2xl font-bold mb-4">
            ¿Necesitas ayuda médica?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nuestro equipo médico está disponible para atenderte. Reserva tu cita ahora y recibe atención profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointments">
              <Button size="lg" className="min-w-[200px]">
                Reservar Cita Ahora
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                Contactar Emergencia
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Sistema Universitario de Citas Médicas. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Diseñado con estándares de accesibilidad ISO 9241-11 e ISO 25010:2011
          </p>
        </div>
      </footer>
    </div>
  )
}
