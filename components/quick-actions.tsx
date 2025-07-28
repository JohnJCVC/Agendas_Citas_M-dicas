"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Calendar, Phone, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/hooks/use-i18n"

export default function QuickActions() {
  const { t } = useI18n()

  const quickActions = [
    {
      href: "/appointments/new",
      labelKey: "newAppointment" as const,
      icon: Plus,
      variant: "default" as const,
      priority: true,
    },
    {
      href: "/appointments",
      labelKey: "myAppointments" as const,
      icon: Calendar,
      variant: "outline" as const,
    },
    {
      href: "/contact",
      labelKey: "contact" as const,
      icon: Phone,
      variant: "outline" as const,
    },
    {
      href: "/emergency",
      labelKey: "emergency" as const,
      icon: AlertTriangle,
      variant: "destructive" as const,
      priority: true,
    },
  ]

  return (
    <Card className="fixed bottom-6 left-6 z-30 shadow-lg lg:hidden">
      <CardContent className="p-3">
        <div className="flex gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant={action.variant}
                  size="sm"
                  className={`flex items-center gap-2 ${action.priority ? "animate-pulse" : ""}`}
                  aria-label={t.navigation[action.labelKey]}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{t.navigation[action.labelKey]}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
