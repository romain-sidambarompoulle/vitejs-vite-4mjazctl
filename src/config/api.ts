// Utiliser la variable d'environnement pour la base URL
const BASE_URL = import.meta.env.VITE_API_BASEURL;

// Regroupement des URLs existantes
export const API_ROUTES = {
  // Routes existantes
  chatbot: `${BASE_URL}/chatbot`,
  submit_form: `${BASE_URL}/submit-form`,
  
  // Routes pour l'authentification
  auth: {
    login: `${BASE_URL}/api/auth/login`,
    register: `${BASE_URL}/api/auth/register`,
    logout: `${BASE_URL}/api/auth/logout`,
    user_data: `${BASE_URL}/api/auth/user-data`,
    refresh: `${BASE_URL}/api/auth/refresh`,
    forgotPassword: `${BASE_URL}/api/auth/forgot-password`,
    resetPassword: (token: string) => `${BASE_URL}/api/auth/reset-password/${token}`,
  },
  
  // Routes admin
  admin: {
    users: `${BASE_URL}/api/admin/users`,
    stats: `${BASE_URL}/api/admin/stats`,
    createUser: `${BASE_URL}/api/admin/users`,
    userFormulaire: (userId: number) => `${BASE_URL}/api/admin/users/${userId}/formulaire`,
    updateFormulaire: (userId: number, formulaireId: number) =>
      `${BASE_URL}/api/admin/users/${userId}/formulaire/${formulaireId}`,
    deleteFormulaire: (userId: number, formulaireId: number) =>
      `${BASE_URL}/api/admin/users/${userId}/formulaire/${formulaireId}`,
    messagesUsersList: `${BASE_URL}/api/admin/messages/users`,
    getConversation: (userId: number | string) => `${BASE_URL}/api/admin/messages/${userId}`,
    sendMessageToUser: (userId: number | string) => `${BASE_URL}/api/admin/messages/${userId}`,
    deleteConversation: (userId: number | string) => `${BASE_URL}/api/admin/messages/${userId}`,
    messages: `${BASE_URL}/api/admin/messages`,
    chatMessages: `${BASE_URL}/api/admin/chat-messages`,
    updateChatMessage: (id: number) => `${BASE_URL}/api/admin/chat-messages/${id}`,
    deleteChatMessage: (id: number) => `${BASE_URL}/api/admin/chat-messages/${id}`,
    unreadMessagesCount: `${BASE_URL}/api/admin/chat-messages/unread-count`,
    changePassword: `${BASE_URL}/api/admin/change-password`,
    internalMessagesUnreadCount: `${BASE_URL}/api/admin/messages/unread-count`,
    visio: `${BASE_URL}/api/admin/visio`,
    deactivateVisio: (userId: number) => `${BASE_URL}/api/admin/visio/${userId}`,
    markAdminMessagesAsRead: (userId: number | string) => `${BASE_URL}/api/admin/messages/${userId}/mark-read`,
  },
  
  // Routes protégées
  user: {
    profile: `${BASE_URL}/api/user/profile`,
    updateProfile: `${BASE_URL}/api/user/update`,
    informations: `${BASE_URL}/api/user/profile/informations`,
    documents: `${BASE_URL}/api/user/documents`,
    formulaire: `${BASE_URL}/api/user/formulaire`,
    getUserForms: `${BASE_URL}/api/user/formulaires`,
    updateFormulaire: (id: number) => `${BASE_URL}/api/user/formulaire/${id}`,
    rdv: {
      telephone: `${BASE_URL}/api/user/rdv/telephone`,
      strategie: `${BASE_URL}/api/user/rdv/strategie`
    },
    progression: `${BASE_URL}/api/user/progression`,
    visio: `${BASE_URL}/api/user/visio`,
    sendMessage: `${BASE_URL}/api/user/messages`,
    getMessages: `${BASE_URL}/api/user/messages`,
    internalMessagesUnreadCount: `${BASE_URL}/api/user/messages/unread-count`,
    markUserMessagesAsRead: `${BASE_URL}/api/user/messages/mark-read`,
  },
  
  // Routes pour les simulateurs (à protéger si nécessaire)
  simulateurs: {
    kine: `${BASE_URL}/api/simulateurs/kine`,
    sageFemme: `${BASE_URL}/api/simulateurs/sage-femme`,
    infirmier: `${BASE_URL}/api/simulateurs/infirmier`,
  },
  
  // Routes pour les rendez-vous
  timeSlots: {
    base: `${BASE_URL}/api/time_slots`,
    userTimeSlots: `${BASE_URL}/api/user/time-slots`,
    appointment: `${BASE_URL}/api/rdv`,
    getAvailable: `${BASE_URL}/api/time_slots`,
    create: `${BASE_URL}/api/time_slots`,
    update: (id: number) => `${BASE_URL}/api/time_slots/${id}`
  },
  rdv: {
    create: `${BASE_URL}/api/rdv`,
    getAll: `${BASE_URL}/api/rdv`,
    getUserAppointments: `${BASE_URL}/api/rdv/user`,
    base: `${BASE_URL}/api/rdv`,
    cancel: (id: number) => `${BASE_URL}/api/rdv/${id}/cancel`,
    cancelAdmin: (id: number) => `${BASE_URL}/api/rdv/${id}/cancel-admin`,
    adminCreate: `${BASE_URL}/api/rdv/admin/create`,
  },
  
  // Routes pour l'éducation
  education: {
    sections: `${BASE_URL}/api/education/sections`,
    section: (sectionId: number) => `${BASE_URL}/api/education/sections/${sectionId}`,
    contents: `${BASE_URL}/api/education/contents`,
    content: (contentId: number) => `${BASE_URL}/api/education/contents/${contentId}`,
    userContents: (contentId: number) => `${BASE_URL}/api/user/education/contents/${contentId}`,
    sectionById: (id: number) => `${BASE_URL}/api/education/sections/${id}`,
    contentById: (id: number) => `${BASE_URL}/api/education/contents/${id}`,
  },
  
  // ✨ Nouvelles routes pour l'envoi d'emails
  email: {
    homeForm: `${BASE_URL}/api/email/home-form`,
    rdvTelephone: `${BASE_URL}/api/email/rdv-telephone`,
    rdvStrategie: `${BASE_URL}/api/email/rdv-strategie`,
    userForm: `${BASE_URL}/api/email/user-form`
  },

  // ✨ Nouvelle route pour le chat widget
  chat: {
    messages: `${BASE_URL}/api/chat/messages`,
  }
};

// Exporter la base URL pour d'autres usages
export { BASE_URL };
