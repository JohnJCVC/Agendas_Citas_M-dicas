export interface Translation {
  navigation: {
    home: string
    profile: string
    appointments: string
    history: string
    support: string
    contact: string
    login: string
    register: string
    logout: string
    language: string
    newAppointment: string
    myAppointments: string
    medicalHistory: string
    settings: string
    help: string
    emergency: string
  }
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    search: string
    filter: string
    clear: string
    close: string
    open: string
    menu: string
    skipToContent: string
    accessibility: string
  }
  accessibility: {
    mainMenu: string
    currentPage: string
    hasSubmenu: string
    expandSubmenu: string
    collapseSubmenu: string
    languageSelector: string
    mobileMenuToggle: string
  }
}

export const translations: Record<string, Translation> = {
  es: {
    navigation: {
      home: "Inicio",
      profile: "Mi Perfil",
      appointments: "Citas Médicas",
      history: "Historial",
      support: "Soporte",
      contact: "Contacto",
      login: "Iniciar Sesión",
      register: "Registro",
      logout: "Cerrar Sesión",
      language: "Idioma",
      newAppointment: "Nueva Cita",
      myAppointments: "Mis Citas",
      medicalHistory: "Historial Médico",
      settings: "Configuración",
      help: "Ayuda",
      emergency: "Emergencia",
    },
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      search: "Buscar",
      filter: "Filtrar",
      clear: "Limpiar",
      close: "Cerrar",
      open: "Abrir",
      menu: "Menú",
      skipToContent: "Saltar al contenido principal",
      accessibility: "Accesibilidad",
    },
    accessibility: {
      mainMenu: "Menú principal",
      currentPage: "Página actual",
      hasSubmenu: "tiene submenú",
      expandSubmenu: "Expandir submenú",
      collapseSubmenu: "Contraer submenú",
      languageSelector: "Selector de idioma",
      mobileMenuToggle: "Alternar menú móvil",
    },
  },
  en: {
    navigation: {
      home: "Home",
      profile: "My Profile",
      appointments: "Medical Appointments",
      history: "History",
      support: "Support",
      contact: "Contact",
      login: "Sign In",
      register: "Register",
      logout: "Sign Out",
      language: "Language",
      newAppointment: "New Appointment",
      myAppointments: "My Appointments",
      medicalHistory: "Medical History",
      settings: "Settings",
      help: "Help",
      emergency: "Emergency",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      filter: "Filter",
      clear: "Clear",
      close: "Close",
      open: "Open",
      menu: "Menu",
      skipToContent: "Skip to main content",
      accessibility: "Accessibility",
    },
    accessibility: {
      mainMenu: "Main menu",
      currentPage: "Current page",
      hasSubmenu: "has submenu",
      expandSubmenu: "Expand submenu",
      collapseSubmenu: "Collapse submenu",
      languageSelector: "Language selector",
      mobileMenuToggle: "Toggle mobile menu",
    },
  },
  fr: {
    navigation: {
      home: "Accueil",
      profile: "Mon Profil",
      appointments: "Rendez-vous Médicaux",
      history: "Historique",
      support: "Support",
      contact: "Contact",
      login: "Se Connecter",
      register: "S'inscrire",
      logout: "Se Déconnecter",
      language: "Langue",
      newAppointment: "Nouveau Rendez-vous",
      myAppointments: "Mes Rendez-vous",
      medicalHistory: "Dossier Médical",
      settings: "Paramètres",
      help: "Aide",
      emergency: "Urgence",
    },
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      save: "Enregistrer",
      delete: "Supprimer",
      edit: "Modifier",
      search: "Rechercher",
      filter: "Filtrer",
      clear: "Effacer",
      close: "Fermer",
      open: "Ouvrir",
      menu: "Menu",
      skipToContent: "Aller au contenu principal",
      accessibility: "Accessibilité",
    },
    accessibility: {
      mainMenu: "Menu principal",
      currentPage: "Page actuelle",
      hasSubmenu: "a un sous-menu",
      expandSubmenu: "Développer le sous-menu",
      collapseSubmenu: "Réduire le sous-menu",
      languageSelector: "Sélecteur de langue",
      mobileMenuToggle: "Basculer le menu mobile",
    },
  },
}

export type Language = keyof typeof translations

export const languages: Array<{ code: Language; name: string; flag: string }> = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]
