"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Menu,
  Calendar,
  Phone,
  LogIn,
  UserPlus,
  Home,
  User,
  History,
  HelpCircle,
  Settings,
  LogOut,
  Plus,
  ChevronDown,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/hooks/use-i18n"
import LanguageSelector from "@/components/language-selector"

interface NavigationItem {
  href: string
  labelKey: keyof typeof import("@/lib/i18n").translations.es.navigation
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  submenu?: NavigationSubItem[]
}

interface NavigationSubItem {
  href: string
  labelKey: keyof typeof import("@/lib/i18n").translations.es.navigation
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export default function Navigation() {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  const navigationItems: NavigationItem[] = [
    {
      href: "/",
      labelKey: "home",
      icon: Home,
    },
    {
      href: "/profile",
      labelKey: "profile",
      icon: User,
      submenu: [
        {
          href: "/profile/settings",
          labelKey: "settings",
          icon: Settings,
        },
      ],
    },
    {
      href: "/appointments",
      labelKey: "appointments",
      icon: Calendar,
      submenu: [
        {
          href: "/appointments/new",
          labelKey: "newAppointment",
          icon: Plus,
        },
        {
          href: "/appointments",
          labelKey: "myAppointments",
          icon: Calendar,
        },
      ],
    },
    {
      href: "/history",
      labelKey: "history",
      icon: History,
      submenu: [
        {
          href: "/history/medical",
          labelKey: "medicalHistory",
          icon: History,
        },
      ],
    },
    {
      href: "/support",
      labelKey: "support",
      icon: HelpCircle,
      submenu: [
        {
          href: "/contact",
          labelKey: "contact",
          icon: Phone,
        },
        {
          href: "/help",
          labelKey: "help",
          icon: HelpCircle,
        },
        {
          href: "/emergency",
          labelKey: "emergency",
          icon: AlertTriangle,
          badge: "24/7",
        },
      ],
    },
    {
      href: "/login",
      labelKey: "login",
      icon: LogIn,
    },
    {
      href: "/register",
      labelKey: "register",
      icon: UserPlus,
    },
  ]

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!navRef.current) return

      const focusableElements = navRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % focusableElements.length)
          break
        case "ArrowUp":
          event.preventDefault()
          setFocusedIndex((prev) => (prev - 1 + focusableElements.length) % focusableElements.length)
          break
        case "Home":
          event.preventDefault()
          setFocusedIndex(0)
          break
        case "End":
          event.preventDefault()
          setFocusedIndex(focusableElements.length - 1)
          break
      }

      if (focusedIndex >= 0 && focusedIndex < focusableElements.length) {
        ;(focusableElements[focusedIndex] as HTMLElement).focus()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, focusedIndex])

  const toggleSubmenu = (href: string) => {
    setExpandedSubmenu(expandedSubmenu === href ? null : href)
  }

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      ref={navRef}
      role="navigation"
      aria-label={t.accessibility.mainMenu}
      className={mobile ? "flex flex-col space-y-1" : "flex items-center space-x-1"}
    >
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.submenu && item.submenu.some((sub) => pathname === sub.href))
        const hasSubmenu = item.submenu && item.submenu.length > 0
        const isSubmenuExpanded = expandedSubmenu === item.href

        return (
          <div key={item.href} className={mobile ? "w-full" : "relative"}>
            {hasSubmenu ? (
              <div className={mobile ? "w-full" : ""}>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  } ${mobile ? "w-full justify-between" : ""}`}
                  onClick={() => toggleSubmenu(item.href)}
                  aria-expanded={isSubmenuExpanded}
                  aria-haspopup="menu"
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`${t.navigation[item.labelKey]} ${t.accessibility.hasSubmenu}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{t.navigation[item.labelKey]}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isSubmenuExpanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Submenu */}
                {isSubmenuExpanded && (
                  <div
                    className={`${
                      mobile
                        ? "ml-6 mt-1 space-y-1"
                        : "absolute top-full left-0 mt-1 w-48 bg-popover border rounded-md shadow-lg z-50"
                    }`}
                    role="menu"
                    aria-label={`${t.navigation[item.labelKey]} submenu`}
                  >
                    {item.submenu.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = pathname === subItem.href

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                            isSubActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          } ${mobile ? "w-full" : ""}`}
                          role="menuitem"
                          aria-current={isSubActive ? "page" : undefined}
                          onClick={() => mobile && setIsOpen(false)}
                        >
                          <SubIcon className="h-4 w-4" aria-hidden="true" />
                          <span className="flex-1">{t.navigation[subItem.labelKey]}</span>
                          {subItem.badge && (
                            <span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${mobile ? "w-full justify-start" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => mobile && setIsOpen(false)}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{t.navigation[item.labelKey]}</span>
                {item.badge && (
                  <span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full ml-auto">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1"
          >
            <Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
            <span>CitasMed</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavItems />
            <div className="h-6 w-px bg-border mx-2" aria-hidden="true" />
            <LanguageSelector />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  aria-label={t.accessibility.mobileMenuToggle}
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]" id="mobile-menu">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
                    CitasMed
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <NavItems mobile />
                </div>

                {/* Mobile Footer */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="border-t pt-4">
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      onClick={() => {
                        // Handle logout
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      {t.navigation.logout}
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Breadcrumb for screen readers */}
      <div className="sr-only" aria-live="polite">
        {t.accessibility.currentPage}:{" "}
        {navigationItems.find((item) => item.href === pathname)?.labelKey &&
          t.navigation[navigationItems.find((item) => item.href === pathname)!.labelKey]}
      </div>
    </header>
  )
}
