"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  UserCheck,
  FileText,
  Heart,
  Palette,
  Brain,
  Baby,
  Bone,
} from "lucide-react"
import Navigation from "@/components/navigation"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import SkipLink from "@/components/skip-link"

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  specialty: string
  location: string
  status: "scheduled" | "completed" | "cancelled"
  reason: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "10:00",
    doctor: "Dr. María González",
    specialty: "Medicina General",
    location: "Consultorio 101 - Planta Baja",
    status: "scheduled",
    reason: "Consulta de rutina para chequeo general de salud",
  },
  {
    id: "2",
    date: "2024-01-10",
    time: "14:30",
    doctor: "Dr. Carlos Rodríguez",
    specialty: "Cardiología",
    location: "Consultorio 205 - Segundo Piso",
    status: "completed",
    reason: "Control cardiológico mensual, revisión de presión arterial",
  },
  {
    id: "3",
    date: "2024-01-08",
    time: "09:15",
    doctor: "Dra. Ana Martínez",
    specialty: "Dermatología",
    location: "Consultorio 150 - Primer Piso",
    status: "cancelled",
    reason: "Revisión de lunares y manchas en la piel",
  },
  {
    id: "4",
    date: "2024-01-20",
    time: "11:30",
    doctor: "Dr. Luis Fernández",
    specialty: "Psicología",
    location: "Consultorio 301 - Tercer Piso",
    status: "scheduled",
    reason: "Sesión de terapia psicológica para manejo de ansiedad",
  },
  {
    id: "5",
    date: "2024-01-22",
    time: "16:00",
    doctor: "Dra. Carmen López",
    specialty: "Ginecología",
    location: "Consultorio 250 - Segundo Piso",
    status: "scheduled",
    reason: "Control ginecológico anual y citología",
  },
  {
    id: "6",
    date: "2024-01-18",
    time: "08:30",
    doctor: "Dr. Roberto Silva",
    specialty: "Traumatología",
    location: "Consultorio 180 - Primer Piso",
    status: "scheduled",
    reason: "Revisión de lesión en rodilla izquierda por práctica deportiva",
  },
  {
    id: "7",
    date: "2024-01-12",
    time: "13:00",
    doctor: "Dra. Patricia Morales",
    specialty: "Oftalmología",
    location: "Consultorio 320 - Tercer Piso",
    status: "completed",
    reason: "Examen de la vista y actualización de graduación de lentes",
  },
  {
    id: "8",
    date: "2024-01-25",
    time: "10:45",
    doctor: "Dr. Fernando Castro",
    specialty: "Neurología",
    location: "Consultorio 280 - Segundo Piso",
    status: "scheduled",
    reason: "Consulta por dolores de cabeza frecuentes y mareos",
  },
  {
    id: "9",
    date: "2024-01-14",
    time: "15:30",
    doctor: "Dra. Isabel Ramírez",
    specialty: "Endocrinología",
    location: "Consultorio 190 - Primer Piso",
    status: "completed",
    reason: "Control de diabetes tipo 2 y ajuste de medicación",
  },
  {
    id: "10",
    date: "2024-01-28",
    time: "09:00",
    doctor: "Dr. Miguel Torres",
    specialty: "Urología",
    location: "Consultorio 220 - Segundo Piso",
    status: "scheduled",
    reason: "Consulta por síntomas urinarios y revisión de próstata",
  },
  {
    id: "11",
    date: "2024-01-16",
    time: "12:15",
    doctor: "Dra. Sofía Herrera",
    specialty: "Pediatría",
    location: "Consultorio 110 - Planta Baja",
    status: "completed",
    reason: "Control de crecimiento y desarrollo infantil",
  },
  {
    id: "12",
    date: "2024-01-30",
    time: "14:00",
    doctor: "Dr. Andrés Vega",
    specialty: "Gastroenterología",
    location: "Consultorio 260 - Segundo Piso",
    status: "scheduled",
    reason: "Consulta por problemas digestivos y dolor abdominal",
  },
  {
    id: "13",
    date: "2024-01-19",
    time: "11:00",
    doctor: "Dra. Lucía Mendoza",
    specialty: "Reumatología",
    location: "Consultorio 170 - Primer Piso",
    status: "scheduled",
    reason: "Tratamiento para artritis reumatoide y dolor articular",
  },
  {
    id: "14",
    date: "2024-01-11",
    time: "16:45",
    doctor: "Dr. Diego Paredes",
    specialty: "Neumología",
    location: "Consultorio 290 - Segundo Piso",
    status: "completed",
    reason: "Seguimiento de asma bronquial y función pulmonar",
  },
  {
    id: "15",
    date: "2024-02-02",
    time: "08:00",
    doctor: "Dra. Valentina Cruz",
    specialty: "Hematología",
    location: "Consultorio 330 - Tercer Piso",
    status: "scheduled",
    reason: "Análisis de resultados de laboratorio y control de anemia",
  },
  {
    id: "16",
    date: "2024-01-24",
    time: "13:30",
    doctor: "Dr. Sebastián Rojas",
    specialty: "Oncología",
    location: "Consultorio 350 - Tercer Piso",
    status: "scheduled",
    reason: "Consulta de seguimiento post-tratamiento oncológico",
  },
  {
    id: "17",
    date: "2024-01-13",
    time: "10:30",
    doctor: "Dra. Camila Jiménez",
    specialty: "Infectología",
    location: "Consultorio 200 - Segundo Piso",
    status: "completed",
    reason: "Tratamiento de infección respiratoria recurrente",
  },
  {
    id: "18",
    date: "2024-02-05",
    time: "15:00",
    doctor: "Dr. Nicolás Vargas",
    specialty: "Cirugía General",
    location: "Consultorio 160 - Primer Piso",
    status: "scheduled",
    reason: "Evaluación pre-quirúrgica para cirugía de vesícula",
  },
  {
    id: "19",
    date: "2024-01-26",
    time: "09:30",
    doctor: "Dra. Alejandra Soto",
    specialty: "Medicina Interna",
    location: "Consultorio 120 - Planta Baja",
    status: "scheduled",
    reason: "Consulta por fatiga crónica y pérdida de peso",
  },
  {
    id: "20",
    date: "2024-01-17",
    time: "14:15",
    doctor: "Dr. Mateo Guerrero",
    specialty: "Medicina Deportiva",
    location: "Consultorio 340 - Tercer Piso",
    status: "completed",
    reason: "Rehabilitación de lesión muscular en gemelo derecho",
  },
  {
    id: "21",
    date: "2024-02-08",
    time: "11:45",
    doctor: "Dra. Daniela Peña",
    specialty: "Geriatría",
    location: "Consultorio 130 - Planta Baja",
    status: "scheduled",
    reason: "Control geriátrico integral y evaluación cognitiva",
  },
  {
    id: "22",
    date: "2024-01-29",
    time: "16:30",
    doctor: "Dr. Gabriel Moreno",
    specialty: "Psiquiatría",
    location: "Consultorio 310 - Tercer Piso",
    status: "scheduled",
    reason: "Seguimiento de tratamiento para trastorno depresivo",
  },
  {
    id: "23",
    date: "2024-01-21",
    time: "08:45",
    doctor: "Dra. Natalia Campos",
    specialty: "Nutrición",
    location: "Consultorio 140 - Planta Baja",
    status: "completed",
    reason: "Plan nutricional personalizado para control de peso",
  },
  {
    id: "24",
    date: "2024-02-12",
    time: "12:00",
    doctor: "Dr. Emilio Herrera",
    specialty: "Medicina General",
    location: "Consultorio 102 - Planta Baja",
    status: "scheduled",
    reason: "Chequeo médico anual completo con análisis de laboratorio",
  },
  {
    id: "25",
    date: "2024-01-31",
    time: "17:00",
    doctor: "Dra. Renata Delgado",
    specialty: "Cardiología",
    location: "Consultorio 206 - Segundo Piso",
    status: "scheduled",
    reason: "Ecocardiograma de control y evaluación de soplo cardíaco",
  },
]

export default function AppointmentsPage() {
  // Replace the useState for appointments with localStorage persistence
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Add useEffect to load appointments from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem("medical-appointments")
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    } else {
      // Set initial mock data only if no saved data exists
      setAppointments(mockAppointments)
    }
  }, [])

  // Add useEffect to save appointments to localStorage whenever they change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("medical-appointments", JSON.stringify(appointments))
    }
  }, [appointments])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    doctor: "",
    specialty: "",
    location: "",
    reason: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter appointments based on search and status
  const filterAppointments = useCallback(() => {
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.reason.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter])

  // Apply filters when search term or status filter changes
  useEffect(() => {
    filterAppointments()
  }, [searchTerm, statusFilter, appointments])

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "date":
        if (!value) {
          newErrors.date = "Selecciona una fecha para tu cita"
        } else {
          const selectedDate = new Date(value)
          const today = new Date()
          const maxDate = new Date()
          maxDate.setMonth(maxDate.getMonth() + 6) // 6 months ahead

          today.setHours(0, 0, 0, 0)

          if (selectedDate < today) {
            newErrors.date = "No puedes agendar citas en fechas pasadas"
          } else if (selectedDate > maxDate) {
            newErrors.date = "Solo puedes agendar citas hasta 6 meses adelante"
          } else {
            delete newErrors.date
          }
        }
        break
      case "time":
        if (!value) {
          newErrors.time = "Selecciona una hora para tu cita"
        } else {
          const [hours, minutes] = value.split(":").map(Number)
          if (hours < 8 || hours > 17 || (hours === 17 && minutes > 0)) {
            newErrors.time = "El horario de atención es de 8:00 AM a 5:00 PM"
          } else {
            delete newErrors.time
          }
        }
        break
      case "doctor":
        if (!value) {
          newErrors.doctor = "Selecciona un médico para tu cita"
        } else {
          delete newErrors.doctor
        }
        break
      case "specialty":
        if (!value) {
          newErrors.specialty = "Selecciona la especialidad médica"
        } else {
          delete newErrors.specialty
        }
        break
      case "reason":
        if (!value.trim()) {
          newErrors.reason = "Describe el motivo de tu consulta"
        } else if (value.length < 10) {
          newErrors.reason = "Proporciona más detalles sobre el motivo (mínimo 10 caracteres)"
        } else if (value.length > 500) {
          newErrors.reason = "El motivo no puede exceder 500 caracteres"
        } else {
          delete newErrors.reason
        }
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const resetForm = () => {
    setFormData({
      date: "",
      time: "",
      doctor: "",
      specialty: "",
      location: "",
      reason: "",
    })
    setErrors({})
  }

  const handleCreateAppointment = () => {
    // Validate all fields with enhanced feedback
    const requiredFields = ["date", "time", "doctor", "specialty", "reason"]
    const newErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      if (field !== "location") {
        const value = formData[field as keyof typeof formData]
        validateField(field, value)
        if (!value || value.trim() === "") {
          newErrors[field] = `${
            field === "date"
              ? "La fecha"
              : field === "time"
                ? "La hora"
                : field === "doctor"
                  ? "El médico"
                  : field === "specialty"
                    ? "La especialidad"
                    : "El motivo"
          } es obligatorio`
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Show validation summary
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "assertive")
      announcement.className = "sr-only"
      announcement.textContent = `Formulario incompleto. ${Object.keys(newErrors).length} campos requieren atención.`
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 3000)
      return
    }

    // Check for duplicate appointments
    const isDuplicate = appointments.some(
      (apt) => apt.date === formData.date && apt.time === formData.time && apt.doctor === formData.doctor,
    )

    if (isDuplicate) {
      setErrors({ general: "Ya existe una cita programada para esta fecha, hora y médico." })
      return
    }

    const newAppointment: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: formData.date,
      time: formData.time,
      doctor: formData.doctor,
      specialty: formData.specialty,
      location: getLocationBySpecialty(formData.specialty),
      status: "scheduled",
      reason: formData.reason,
    }

    setAppointments((prev) => [...prev, newAppointment])
    setIsCreateDialogOpen(false)
    resetForm()

    // Enhanced success feedback
    showSuccessMessage(
      "Cita médica creada exitosamente",
      `Tu cita con ${formData.doctor} ha sido programada para el ${new Date(formData.date).toLocaleDateString("es-ES")} a las ${formData.time}`,
    )
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setFormData({
      date: appointment.date,
      time: appointment.time,
      doctor: appointment.doctor,
      specialty: appointment.specialty,
      location: appointment.location,
      reason: appointment.reason,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateAppointment = () => {
    if (!editingAppointment) return

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== "location") {
        validateField(key, formData[key as keyof typeof formData])
      }
    })

    if (Object.keys(errors).length > 0) {
      return
    }

    const updatedAppointment: Appointment = {
      ...editingAppointment,
      date: formData.date,
      time: formData.time,
      doctor: formData.doctor,
      specialty: formData.specialty,
      location: formData.location,
      reason: formData.reason,
    }

    setAppointments((prev) => prev.map((apt) => (apt.id === editingAppointment.id ? updatedAppointment : apt)))
    setIsEditDialogOpen(false)
    setEditingAppointment(null)
    resetForm()

    // Announce success
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.className = "sr-only"
    announcement.textContent = "Cita médica actualizada exitosamente"
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  const getLocationBySpecialty = (specialty: string): string => {
    const locationMap: Record<string, string> = {
      general: "Consultorio 101 - Planta Baja",
      cardiology: "Consultorio 205 - Segundo Piso",
      dermatology: "Consultorio 150 - Primer Piso",
      psychology: "Consultorio 301 - Tercer Piso",
      gynecology: "Consultorio 250 - Segundo Piso",
      orthopedics: "Consultorio 180 - Primer Piso",
      ophthalmology: "Consultorio 320 - Tercer Piso",
      neurology: "Consultorio 280 - Segundo Piso",
      endocrinology: "Consultorio 190 - Primer Piso",
      urology: "Consultorio 220 - Segundo Piso",
      pediatrics: "Consultorio 110 - Planta Baja",
      gastroenterology: "Consultorio 260 - Segundo Piso",
      rheumatology: "Consultorio 170 - Primer Piso",
      pneumology: "Consultorio 290 - Segundo Piso",
      hematology: "Consultorio 330 - Tercer Piso",
    }
    return locationMap[specialty] || "Por asignar"
  }

  const showSuccessMessage = (title: string, description: string) => {
    // Visual feedback
    const successDiv = document.createElement("div")
    successDiv.className =
      "fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-in slide-in-from-right-2 duration-300"
    successDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <div>
          <div class="font-medium">${title}</div>
          <div class="text-sm opacity-90">${description}</div>
        </div>
      </div>
    `
    document.body.appendChild(successDiv)

    setTimeout(() => {
      successDiv.classList.add("animate-out", "slide-out-to-right-2")
      setTimeout(() => document.body.removeChild(successDiv), 300)
    }, 4000)

    // Screen reader announcement
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.className = "sr-only"
    announcement.textContent = `${title}. ${description}`
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 2000)
  }

  const handleDeleteAppointment = (id: string, doctorName: string, date: string) => {
    const appointmentDetails = `cita con ${doctorName} programada para el ${new Date(date).toLocaleDateString("es-ES")}`

    if (
      confirm(`¿Estás seguro de que deseas eliminar la ${appointmentDetails}?\n\nEsta acción no se puede deshacer.`)
    ) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== id))

      showSuccessMessage("Cita eliminada", `La ${appointmentDetails} ha sido eliminada exitosamente`)
    }
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Programada</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <AccessibilityToolbar />
      <Navigation />

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Citas Médicas</h1>
              <p className="text-muted-foreground mt-2">
                Administra tus citas médicas: crear, editar, buscar y eliminar
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Cita
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
                aria-labelledby="create-dialog-title"
              >
                <DialogHeader>
                  <DialogTitle id="create-dialog-title">Crear Nueva Cita</DialogTitle>
                  <DialogDescription>Completa la información para agendar tu cita médica</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  {/* Sección: Fecha y Hora */}
                  <fieldset className="space-y-4 p-4 border rounded-lg">
                    <legend className="text-sm font-medium px-2">Fecha y Hora de la Cita</legend>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="create-date" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Fecha *
                        </Label>
                        <Input
                          id="create-date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className={errors.date ? "border-destructive" : ""}
                          min={new Date().toISOString().split("T")[0]}
                          max={new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                          aria-invalid={!!errors.date}
                          aria-describedby={errors.date ? "create-date-error" : "create-date-help"}
                          required
                        />
                        <p id="create-date-help" className="text-xs text-muted-foreground">
                          Selecciona una fecha dentro de los próximos 6 meses
                        </p>
                        {errors.date && (
                          <p
                            id="create-date-error"
                            className="text-sm text-destructive flex items-center gap-1"
                            role="alert"
                          >
                            <AlertCircle className="h-3 w-3" />
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="create-time" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Hora *
                        </Label>
                        <Input
                          id="create-time"
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className={errors.time ? "border-destructive" : ""}
                          min="08:00"
                          max="17:00"
                          step="900"
                          aria-invalid={!!errors.time}
                          aria-describedby="create-time-help"
                          required
                        />
                        <p id="create-time-help" className="text-xs text-muted-foreground">
                          Horario de atención: 8:00 AM - 5:00 PM
                        </p>
                        {errors.time && (
                          <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                            <AlertCircle className="h-3 w-3" />
                            {errors.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  {/* Sección: Información Médica */}
                  <fieldset className="space-y-4 p-4 border rounded-lg">
                    <legend className="text-sm font-medium px-2">Información Médica</legend>

                    <div className="space-y-2">
                      <Label htmlFor="create-specialty" className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Especialidad *
                      </Label>
                      <Select
                        value={formData.specialty}
                        onValueChange={(value) => {
                          handleSelectChange("specialty", value)
                          // Auto-update location when specialty changes
                          setFormData((prev) => ({ ...prev, location: getLocationBySpecialty(value) }))
                        }}
                      >
                        <SelectTrigger className={errors.specialty ? "border-destructive" : ""}>
                          <SelectValue placeholder="Selecciona la especialidad médica" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Medicina General
                            </div>
                          </SelectItem>
                          <SelectItem value="cardiology">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              Cardiología
                            </div>
                          </SelectItem>
                          <SelectItem value="dermatology">
                            <div className="flex items-center gap-2">
                              <Palette className="h-4 w-4" />
                              Dermatología
                            </div>
                          </SelectItem>
                          <SelectItem value="psychology">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              Psicología
                            </div>
                          </SelectItem>
                          <SelectItem value="gynecology">
                            <div className="flex items-center gap-2">
                              <Baby className="h-4 w-4" />
                              Ginecología
                            </div>
                          </SelectItem>
                          <SelectItem value="orthopedics">
                            <div className="flex items-center gap-2">
                              <Bone className="h-4 w-4" />
                              Traumatología
                            </div>
                          </SelectItem>
                          <SelectItem value="ophthalmology">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Oftalmología
                            </div>
                          </SelectItem>
                          <SelectItem value="neurology">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              Neurología
                            </div>
                          </SelectItem>
                          <SelectItem value="endocrinology">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Endocrinología
                            </div>
                          </SelectItem>
                          <SelectItem value="urology">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Urología
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.specialty && (
                        <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                          <AlertCircle className="h-3 w-3" />
                          {errors.specialty}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-doctor" className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Médico *
                      </Label>
                      <Select value={formData.doctor} onValueChange={(value) => handleSelectChange("doctor", value)}>
                        <SelectTrigger className={errors.doctor ? "border-destructive" : ""}>
                          <SelectValue placeholder="Selecciona el médico especialista" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dr. María González">Dr. María González - Medicina General</SelectItem>
                          <SelectItem value="Dr. Carlos Rodríguez">Dr. Carlos Rodríguez - Cardiología</SelectItem>
                          <SelectItem value="Dra. Ana Martínez">Dra. Ana Martínez - Dermatología</SelectItem>
                          <SelectItem value="Dr. Luis Fernández">Dr. Luis Fernández - Psicología</SelectItem>
                          <SelectItem value="Dra. Carmen López">Dra. Carmen López - Ginecología</SelectItem>
                          <SelectItem value="Dr. Roberto Silva">Dr. Roberto Silva - Traumatología</SelectItem>
                          <SelectItem value="Dra. Patricia Morales">Dra. Patricia Morales - Oftalmología</SelectItem>
                          <SelectItem value="Dr. Fernando Castro">Dr. Fernando Castro - Neurología</SelectItem>
                          <SelectItem value="Dra. Isabel Ramírez">Dra. Isabel Ramírez - Endocrinología</SelectItem>
                          <SelectItem value="Dr. Miguel Torres">Dr. Miguel Torres - Urología</SelectItem>
                          <SelectItem value="Dra. Sofía Herrera">Dra. Sofía Herrera - Pediatría</SelectItem>
                          <SelectItem value="Dr. Andrés Vega">Dr. Andrés Vega - Gastroenterología</SelectItem>
                          <SelectItem value="Dra. Lucía Mendoza">Dra. Lucía Mendoza - Reumatología</SelectItem>
                          <SelectItem value="Dr. Diego Paredes">Dr. Diego Paredes - Neumología</SelectItem>
                          <SelectItem value="Dra. Valentina Cruz">Dra. Valentina Cruz - Hematología</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.doctor && (
                        <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                          <AlertCircle className="h-3 w-3" />
                          {errors.doctor}
                        </p>
                      )}
                    </div>

                    {/* Auto-filled location */}
                    {formData.location && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Ubicación
                        </Label>
                        <div className="p-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
                          {formData.location}
                        </div>
                      </div>
                    )}
                  </fieldset>

                  {/* Sección: Motivo de la Consulta */}
                  <fieldset className="space-y-4 p-4 border rounded-lg">
                    <legend className="text-sm font-medium px-2">Motivo de la Consulta</legend>

                    <div className="space-y-2">
                      <Label htmlFor="create-reason" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Describe tu consulta *
                      </Label>
                      <Textarea
                        id="create-reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className={`min-h-[100px] ${errors.reason ? "border-destructive" : ""}`}
                        placeholder="Describe detalladamente el motivo de tu consulta médica. Incluye síntomas, duración, y cualquier información relevante..."
                        maxLength={500}
                        aria-invalid={!!errors.reason}
                        aria-describedby={errors.reason ? "create-reason-error" : "create-reason-help"}
                        required
                      />
                      <div className="flex justify-between items-center text-xs">
                        <p id="create-reason-help" className="text-muted-foreground">
                          Proporciona detalles específicos para que el médico pueda prepararse mejor
                        </p>
                        <span
                          className={`${formData.reason.length > 450 ? "text-orange-600" : "text-muted-foreground"}`}
                        >
                          {formData.reason.length}/500
                        </span>
                      </div>
                      {errors.reason && (
                        <p
                          id="create-reason-error"
                          className="text-sm text-destructive flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.reason}
                        </p>
                      )}
                    </div>
                  </fieldset>

                  {/* Confirmation section */}
                  {Object.keys(errors).length === 0 && formData.date && formData.time && formData.doctor && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Resumen de tu cita
                      </h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {new Date(formData.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>
                          <strong>Hora:</strong> {formData.time}
                        </p>
                        <p>
                          <strong>Médico:</strong> {formData.doctor}
                        </p>
                        <p>
                          <strong>Especialidad:</strong> {formData.specialty}
                        </p>
                        <p>
                          <strong>Ubicación:</strong> {formData.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateAppointment}
                    disabled={
                      Object.keys(errors).length > 0 ||
                      !formData.date ||
                      !formData.time ||
                      !formData.doctor ||
                      !formData.specialty ||
                      !formData.reason
                    }
                  >
                    Crear Cita
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar y Filtrar Citas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">
                    Buscar citas
                  </Label>
                  <Input
                    id="search"
                    type="text"
                    placeholder="Buscar por médico, especialidad o motivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="sm:w-48">
                  <Label htmlFor="status-filter" className="sr-only">
                    Filtrar por estado
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="scheduled">Programadas</SelectItem>
                      <SelectItem value="completed">Completadas</SelectItem>
                      <SelectItem value="cancelled">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 bg-transparent">
                  <X className="h-4 w-4" />
                  Limpiar
                </Button>
              </div>

              {(searchTerm || statusFilter !== "all") && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Mostrando {filteredAppointments.length} de {appointments.length} citas
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron citas</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Intenta ajustar tus filtros de búsqueda"
                      : "Aún no tienes citas médicas programadas"}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>Crear Primera Cita</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <span className="font-medium">
                              {new Date(appointment.date).toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <span>{appointment.time}</span>
                          </div>

                          {getStatusBadge(appointment.status)}
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <span className="font-medium">{appointment.doctor}</span>
                          </div>

                          <div className="text-sm text-muted-foreground">{appointment.specialty}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span className="text-sm text-muted-foreground">{appointment.location}</span>
                        </div>

                        <div className="bg-muted/50 rounded-md p-3">
                          <p className="text-sm">
                            <span className="font-medium">Motivo:</span> {appointment.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 lg:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAppointment(appointment)}
                          disabled={appointment.status === "completed"}
                          className="flex items-center gap-2"
                          aria-label={`Editar cita con ${appointment.doctor}`}
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment.id, appointment.doctor, appointment.date)}
                          className="flex items-center gap-2 text-destructive hover:text-destructive"
                          aria-label={`Eliminar cita con ${appointment.doctor}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]" aria-labelledby="edit-dialog-title">
              <DialogHeader>
                <DialogTitle id="edit-dialog-title">Editar Cita</DialogTitle>
                <DialogDescription>Modifica la información de tu cita médica</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Fecha *</Label>
                    <Input
                      id="edit-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={errors.date ? "border-destructive" : ""}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-time">Hora *</Label>
                    <Input
                      id="edit-time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={errors.time ? "border-destructive" : ""}
                      required
                    />
                    {errors.time && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-specialty">Especialidad *</Label>
                  <Select value={formData.specialty} onValueChange={(value) => handleSelectChange("specialty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Medicina General</SelectItem>
                      <SelectItem value="cardiology">Cardiología</SelectItem>
                      <SelectItem value="dermatology">Dermatología</SelectItem>
                      <SelectItem value="psychology">Psicología</SelectItem>
                      <SelectItem value="gynecology">Ginecología</SelectItem>
                      <SelectItem value="orthopedics">Traumatología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-doctor">Médico *</Label>
                  <Select value={formData.doctor} onValueChange={(value) => handleSelectChange("doctor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un médico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. María González">Dr. María González</SelectItem>
                      <SelectItem value="Dr. Carlos Rodríguez">Dr. Carlos Rodríguez</SelectItem>
                      <SelectItem value="Dra. Ana Martínez">Dra. Ana Martínez</SelectItem>
                      <SelectItem value="Dr. Luis Fernández">Dr. Luis Fernández</SelectItem>
                      <SelectItem value="Dra. Carmen López">Dra. Carmen López</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-reason">Motivo de la Consulta *</Label>
                  <Textarea
                    id="edit-reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className={`min-h-[80px] ${errors.reason ? "border-destructive" : ""}`}
                    placeholder="Describe el motivo de tu consulta médica"
                    required
                  />
                  {errors.reason && (
                    <p className="text-sm text-destructive" role="alert">
                      {errors.reason}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingAppointment(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleUpdateAppointment}>Guardar Cambios</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
