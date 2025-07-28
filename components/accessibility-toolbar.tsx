"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  Palette,
  Volume2,
  VolumeX,
  Minus,
  Plus,
  RotateCcw,
  ZoomIn,
  Type,
  Pause,
  Play,
  Download,
  Subtitles,
  Speaker,
  Accessibility,
  Moon,
  Sun,
  Contrast,
  Move3D,
  Languages,
  FileText,
  Headphones,
} from "lucide-react"

interface AccessibilitySettings {
  // Visual settings
  theme: "light" | "dark" | "high-contrast" | "monochrome"
  fontSize: number
  lineSpacing: number
  letterSpacing: number
  wordSpacing: number
  fontFamily: "default" | "dyslexic"
  colorInversion: boolean
  reducedMotion: boolean
  focusHighlight: boolean
  zoomLevel: number

  // Audio settings
  soundEnabled: boolean
  ttsEnabled: boolean
  ttsRate: number
  ttsVolume: number
  subtitlesEnabled: boolean
  visualAlerts: boolean
}

const defaultSettings: AccessibilitySettings = {
  theme: "light",
  fontSize: 16,
  lineSpacing: 1.5,
  letterSpacing: 0,
  wordSpacing: 0,
  fontFamily: "default",
  colorInversion: false,
  reducedMotion: false,
  focusHighlight: true,
  zoomLevel: 100,
  soundEnabled: true,
  ttsEnabled: false,
  ttsRate: 1,
  ttsVolume: 0.8,
  subtitlesEnabled: true,
  visualAlerts: true,
}

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isReading, setIsReading] = useState(false)
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const magnifierRef = useRef<HTMLDivElement>(null)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings({ ...defaultSettings, ...parsed })
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))
    applySettings(settings)
  }, [settings])

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement

    // Apply font size
    root.style.fontSize = `${newSettings.fontSize}px`

    // Apply spacing
    root.style.setProperty("--line-height", newSettings.lineSpacing.toString())
    root.style.setProperty("--letter-spacing", `${newSettings.letterSpacing}px`)
    root.style.setProperty("--word-spacing", `${newSettings.wordSpacing}px`)

    // Apply theme
    root.className = root.className.replace(/theme-\w+/g, "")
    root.classList.add(`theme-${newSettings.theme}`)

    // Apply font family
    if (newSettings.fontFamily === "dyslexic") {
      root.classList.add("font-dyslexic")
    } else {
      root.classList.remove("font-dyslexic")
    }

    // Apply color inversion
    if (newSettings.colorInversion) {
      root.classList.add("color-inverted")
    } else {
      root.classList.remove("color-inverted")
    }

    // Apply reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Apply focus highlight
    if (newSettings.focusHighlight) {
      root.classList.add("enhanced-focus")
    } else {
      root.classList.remove("enhanced-focus")
    }

    // Apply zoom
    if (newSettings.zoomLevel !== 100) {
      root.style.zoom = `${newSettings.zoomLevel}%`
    } else {
      root.style.zoom = ""
    }
  }

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    announceChange(`${key} actualizado`)
  }

  const announceChange = (message: string) => {
    if (settings.soundEnabled) {
      // Create audio feedback
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
      )
      audio.volume = 0.1
      audio.play().catch(() => {})
    }

    // Visual alert
    if (settings.visualAlerts) {
      const toast = document.createElement("div")
      toast.className =
        "fixed top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 animate-pulse"
      toast.textContent = message
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 2000)
    }

    // Screen reader announcement
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  const startTextToSpeech = () => {
    if (!("speechSynthesis" in window)) {
      announceChange("Lector de pantalla no disponible en este navegador")
      return
    }

    if (isReading) {
      speechSynthesis.cancel()
      setIsReading(false)
      setCurrentUtterance(null)
      return
    }

    const mainContent = document.getElementById("main-content")
    if (!mainContent) return

    const text = mainContent.innerText
    const utterance = new SpeechSynthesisUtterance(text)

    utterance.rate = settings.ttsRate
    utterance.volume = settings.ttsVolume
    utterance.lang = "es-ES"

    utterance.onstart = () => setIsReading(true)
    utterance.onend = () => {
      setIsReading(false)
      setCurrentUtterance(null)
    }
    utterance.onerror = () => {
      setIsReading(false)
      setCurrentUtterance(null)
      announceChange("Error en el lector de pantalla")
    }

    setCurrentUtterance(utterance)
    speechSynthesis.speak(utterance)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (showMagnifier) {
      setMagnifierPosition({ x: e.clientX, y: e.clientY })
    }
  }

  useEffect(() => {
    if (showMagnifier) {
      document.addEventListener("mousemove", handleMouseMove)
      return () => document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [showMagnifier])

  const resetSettings = () => {
    setSettings(defaultSettings)
    announceChange("Configuración de accesibilidad restablecida")
  }

  const downloadTranscription = () => {
    const mainContent = document.getElementById("main-content")
    if (!mainContent) return

    const text = mainContent.innerText
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transcripcion-pagina.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    announceChange("Transcripción descargada")
  }

  return (
    <>
      {/* Accessibility Icon - Always Visible */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 bg-primary hover:bg-primary/90 shadow-lg"
        aria-label="Abrir menú de accesibilidad"
        aria-expanded={isOpen}
        title="Herramientas de Accesibilidad"
      >
        <Accessibility className="h-6 w-6 text-primary-foreground" />
      </Button>

      {/* Magnifier */}
      {showMagnifier && (
        <div
          ref={magnifierRef}
          className="fixed pointer-events-none z-40 w-32 h-32 border-4 border-primary rounded-full overflow-hidden"
          style={{
            left: magnifierPosition.x - 64,
            top: magnifierPosition.y - 64,
            background: `url(${window.location.href}) no-repeat`,
            backgroundSize: `${window.innerWidth * 2}px ${window.innerHeight * 2}px`,
            backgroundPosition: `-${(magnifierPosition.x - 64) * 2}px -${(magnifierPosition.y - 64) * 2}px`,
          }}
        />
      )}

      {/* Accessibility Menu */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-40 w-96 max-h-[80vh] overflow-y-auto shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accesibilidad Universal
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar menú de accesibilidad"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="visual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Auditivo
                </TabsTrigger>
              </TabsList>

              {/* VISUAL ACCESSIBILITY TAB */}
              <TabsContent value="visual" className="space-y-6 mt-4">
                {/* Theme Selector */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Tema de Color
                  </Label>
                  <Select value={settings.theme} onValueChange={(value: any) => updateSetting("theme", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Tema Claro
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Modo Oscuro
                        </div>
                      </SelectItem>
                      <SelectItem value="high-contrast">
                        <div className="flex items-center gap-2">
                          <Contrast className="h-4 w-4" />
                          Alto Contraste
                        </div>
                      </SelectItem>
                      <SelectItem value="monochrome">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Monocromático
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Tamaño de Texto: {settings.fontSize}px
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting("fontSize", Math.max(12, settings.fontSize - 2))}
                      disabled={settings.fontSize <= 12}
                      aria-label="Disminuir tamaño de texto"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={([value]) => updateSetting("fontSize", value)}
                      min={12}
                      max={32}
                      step={2}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting("fontSize", Math.min(32, settings.fontSize + 2))}
                      disabled={settings.fontSize >= 32}
                      aria-label="Aumentar tamaño de texto"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Spacing Controls */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Move3D className="h-4 w-4" />
                    Espaciado
                  </Label>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Espaciado de líneas: {settings.lineSpacing}
                      </Label>
                      <Slider
                        value={[settings.lineSpacing]}
                        onValueChange={([value]) => updateSetting("lineSpacing", value)}
                        min={1}
                        max={3}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Espaciado de letras: {settings.letterSpacing}px
                      </Label>
                      <Slider
                        value={[settings.letterSpacing]}
                        onValueChange={([value]) => updateSetting("letterSpacing", value)}
                        min={0}
                        max={5}
                        step={0.5}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Espaciado de palabras: {settings.wordSpacing}px
                      </Label>
                      <Slider
                        value={[settings.wordSpacing]}
                        onValueChange={([value]) => updateSetting("wordSpacing", value)}
                        min={0}
                        max={10}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Tipografía
                  </Label>
                  <Select
                    value={settings.fontFamily}
                    onValueChange={(value: any) => updateSetting("fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Fuente Estándar</SelectItem>
                      <SelectItem value="dyslexic">OpenDyslexic (Dislexia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Zoom Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <ZoomIn className="h-4 w-4" />
                    Zoom de Página: {settings.zoomLevel}%
                  </Label>
                  <Slider
                    value={[settings.zoomLevel]}
                    onValueChange={([value]) => updateSetting("zoomLevel", value)}
                    min={75}
                    max={200}
                    step={25}
                  />
                </div>

                {/* Visual Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Inversión de Colores</Label>
                    <Switch
                      checked={settings.colorInversion}
                      onCheckedChange={(checked) => updateSetting("colorInversion", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Reducir Animaciones</Label>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Resaltado de Foco</Label>
                    <Switch
                      checked={settings.focusHighlight}
                      onCheckedChange={(checked) => updateSetting("focusHighlight", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Lupa Puntual</Label>
                    <Switch checked={showMagnifier} onCheckedChange={setShowMagnifier} />
                  </div>
                </div>
              </TabsContent>

              {/* AUDIO ACCESSIBILITY TAB */}
              <TabsContent value="audio" className="space-y-6 mt-4">
                {/* Text to Speech */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Speaker className="h-4 w-4" />
                    Lector de Pantalla
                  </Label>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={isReading ? "destructive" : "default"}
                      onClick={startTextToSpeech}
                      className="flex items-center gap-2"
                      disabled={!settings.ttsEnabled}
                    >
                      {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isReading ? "Detener Lectura" : "Leer Página"}
                    </Button>

                    <Switch
                      checked={settings.ttsEnabled}
                      onCheckedChange={(checked) => updateSetting("ttsEnabled", checked)}
                    />
                  </div>

                  {settings.ttsEnabled && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Velocidad: {settings.ttsRate}x</Label>
                        <Slider
                          value={[settings.ttsRate]}
                          onValueChange={([value]) => updateSetting("ttsRate", value)}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Volumen: {Math.round(settings.ttsVolume * 100)}%
                        </Label>
                        <Slider
                          value={[settings.ttsVolume]}
                          onValueChange={([value]) => updateSetting("ttsVolume", value)}
                          min={0}
                          max={1}
                          step={0.1}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Audio Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      Sonidos del Sistema
                    </Label>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Subtitles className="h-4 w-4" />
                      Subtítulos Automáticos
                    </Label>
                    <Switch
                      checked={settings.subtitlesEnabled}
                      onCheckedChange={(checked) => updateSetting("subtitlesEnabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Alertas Visuales</Label>
                    <Switch
                      checked={settings.visualAlerts}
                      onCheckedChange={(checked) => updateSetting("visualAlerts", checked)}
                    />
                  </div>
                </div>

                {/* Download Transcription */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Transcripción
                  </Label>
                  <Button
                    variant="outline"
                    onClick={downloadTranscription}
                    className="w-full flex items-center gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Descargar Transcripción (.txt)
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button variant="ghost" onClick={resetSettings} className="w-full flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Restablecer Configuración
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </>
  )
}
