import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import Home from "./pages/Home";
import ReglesDeCalcul from "./pages/ReglesDeCalcul";
import Navbar from "./components/Navbar";
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CGU_CGV from "./pages/CGU_CGV";
import MentionsLegales from "./pages/MentionsLegales";
import Footer from "./components/Footer";
import CookieBanner from './components/CookieBanner';

// Import des composants du dashboard
import DashboardVisitor from "./pages/dashboard/DashboardVisitor.tsx";
import Profile from "./pages/dashboard/Profile.tsx";
import Documents from "./pages/dashboard/Documents.tsx";
import UserForm from "./pages/dashboard/UserForm.tsx";
import PersonalSimulation from "./pages/dashboard/PersonalSimulation.tsx";
import Appointment from "./pages/dashboard/Appointment.tsx";
import { useState, useEffect } from "react";
import DashboardHome from "./pages/dashboard/DashboardHome.tsx";
import DashboardAdmin from './pages/admin/DashboardAdmin';
import AdminHome from './pages/admin/AdminHome';
import UserDetails from './pages/admin/UserDetails';
import UsersList from './pages/admin/UsersList';
import AddUser from './pages/admin/AddUser';
import AppointmentAdmin from './pages/admin/AppointmentAdmin.tsx';
import SectionsList from './pages/admin/education/SectionsList.tsx';
import SectionForm from './pages/admin/education/SectionForm.tsx';
import ContentsList from './pages/admin/education/ContentsList.tsx';
import ContentForm from './pages/admin/education/ContentForm.tsx';
import { UserContext, User, IUserContext } from './contexts/UserContext';
import EducationView from "./pages/dashboard/EducationView.tsx";
import ComptaFictive from "./pages/dashboard/ComptaFictive.tsx";
import InvestmentPage from "./pages/dashboard/Investment.tsx";
import { GlobalModalProvider } from './contexts/GlobalModalContext';
import VisioUserPage from './pages/dashboard/UtilsVisio';

// IMPORTANT : Utilisez ces importations
import axios, { fetchCsrfToken } from './config/axios';
import { API_ROUTES } from './config/api';

// ✨ Importer le nouveau composant ChatWidget
import ChatWidget from './components/ChatWidget';

// ✨ Importer le nouveau composant admin des messages
import MessagesAdmin from './pages/admin/MessagesAdmin';

// ✨ Importer le composant ResetPassword
import ResetPassword from './components/auth/ResetPassword';

// ✨ Importer le nouveau composant ForgotPassword
import ForgotPassword from './components/auth/ForgotPassword';

// ✨ Importer le composant ChangeAdminPassword
import ChangeAdminPassword from './pages/admin/ChangeAdminPassword';

// ✨ Importer le nouveau composant Visio
import Visio from './pages/admin/Visio';

// ✨ Importer la nouvelle page de messagerie utilisateur
import Messages from './pages/dashboard/Messages.tsx';

// ✨ Importer les nouveaux composants admin
import MessagesUsersList from './pages/admin/MessagesUsersList';
import ConversationAdmin from './pages/admin/ConversationAdmin';

// ✨ Importer le nouveau composant AccueilHome
import AccueilHome from './pages/dashboard/AccueilHome.tsx';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // ✨ Ajouter l'état pour le compteur de messages non lus
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // ✨ Fonction pour charger le compteur initial de messages non lus
  const fetchInitialUnreadCount = async (currentUser: User) => {
    if (!currentUser) {
       setUnreadCount(0); // Reset si pas d'utilisateur
       return;
    }
    try {
      let apiUrl = '';
      if (currentUser.role === 'admin') {
        apiUrl = API_ROUTES.admin.internalMessagesUnreadCount;
      } else {
        apiUrl = API_ROUTES.user.internalMessagesUnreadCount;
      }
      const response = await axios.get<{ success: boolean; unreadCount: number }>(apiUrl);
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
        console.log("Compteur initial non lus chargé:", response.data.unreadCount);
      } else {
         setUnreadCount(0);
      }
    } catch (error) {
      console.error("Erreur chargement compteur initial non lus:", error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    // Débogage
    console.log("Cookies :", document.cookie);
    console.log("User en localStorage :", localStorage.getItem('user'));

    let isMounted = true;
    setIsLoading(true);

    const storedUser = localStorage.getItem('user');
    let initialUserSet = false;

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (isMounted) {
          setUser(parsedUser);
          initialUserSet = true;
        }
      } catch (e) {
        console.error("Erreur parsing utilisateur localStorage:", e);
        localStorage.removeItem('user');
        if (isMounted) setUser(null);
      }
    }

    const attemptRefreshAndRetry = async () => {
      console.log("Tentative de rafraîchissement du token...");
      try {
        await axios.post(API_ROUTES.auth.refresh);
        console.log("✅ Rafraîchissement réussi. Nouvelle tentative de validation...");
        const retryResponse = await axios.get(API_ROUTES.auth.user_data);
        if (retryResponse.data.success && retryResponse.data.user) {
          if (isMounted) {
            console.log("✅ Validation après refresh réussie.");
            updateUser(retryResponse.data.user);
            await fetchInitialUnreadCount(retryResponse.data.user); // ✨ Charger compteur après refresh réussi
          }
        } else {
          console.log("❌ Validation après refresh échouée.");
          if (isMounted) updateUser(null);
        }
      } catch (refreshError) {
        console.error("❌ Échec du rafraîchissement du token:", refreshError);
        if (isMounted) updateUser(null);
      }
    };

    const validateSession = async () => {
      try {
        const response = await axios.get(API_ROUTES.auth.user_data);
        console.log("Réponse de vérification auth:", response.data);
        if (response.data.success && response.data.user) {
          if (isMounted) {
            updateUser(response.data.user);
            await fetchInitialUnreadCount(response.data.user); // ✨ Charger compteur après validation réussie
          }
        } else {
          console.log("Validation initiale échouée (success: false). Tentative de refresh...");
          await attemptRefreshAndRetry();
        }
      } catch (error: any) {
        console.error("Erreur d'authentification initiale:", error);
        if (error.response && error.response.status === 401) {
          console.log("Validation initiale échouée (401). Tentative de refresh...");
          await attemptRefreshAndRetry();
        } else {
          console.warn("L'appel de vérification initial a échoué (autre que 401).");
        }
      } finally {
         console.log("Fin de validateSession (finally). Mise de isLoading à false.");
         if (isMounted) {
             setIsLoading(false);
         }
      }
    };

    if (initialUserSet) {
      console.log("Utilisateur trouvé dans localStorage, validation de la session...");
      validateSession();
    } else {
      console.log("Aucun utilisateur trouvé dans localStorage. Pas de validation de session.");
      if (isMounted) {
        setUser(null);
        setIsLoading(false);
      }
    }

    // Récupérer le token CSRF
    fetchCsrfToken();

    return () => {
      isMounted = false;
    };

  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log("Utilisateur mis à jour dans le contexte et localStorage:", newUser);
      // ✨ Recharger le compteur si l'utilisateur change (ex: login/logout)
      fetchInitialUnreadCount(newUser); 
    } else {
      localStorage.removeItem('user');
      console.log("Utilisateur supprimé du contexte et localStorage.");
      setUnreadCount(0); // ✨ Reset le compteur si logout
    }
  };

  if (isLoading) {
     return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Chargement...</p></Box>;
  }

  // ✨ Préparer la valeur du contexte
  const contextValue: IUserContext = {
    user,
    setUser: updateUser,
    unreadCount,
    setUnreadCount // Passer la fonction pour la mettre à jour
  };

  return (
    <UserContext.Provider value={contextValue}>
      <GlobalModalProvider>
        <Router>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          }}>
            <CssBaseline />
            <Navbar user={user} />
            <Box sx={{ 
              flexGrow: 1,
              display: 'flex', 
              flexDirection: 'column'
            }}> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/regles-de-calcul" element={<ReglesDeCalcul />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/education" element={<EducationView />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cgu-cgv" element={<CGU_CGV />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />

                {/* Routes du dashboard avec Outlet */}
                <Route path="/dashboard/*" element={user && user.role !== 'admin' ? <DashboardVisitor /> : <Navigate to="/login" replace />}>
                  <Route path="accueil" element={<AccueilHome />} />
                  <Route path="" element={<DashboardHome />} /> {/* Fallback pour /dashboard */}
                  <Route index element={<DashboardHome />} /> {/* Route par défaut */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="form" element={<UserForm />} />
                  <Route path="simulation" element={<PersonalSimulation />} />
                  <Route path="appointment/:type?" element={<Appointment />} />
                  <Route path="education" element={<EducationView />} />
                  <Route path="compta-fictive" element={<ComptaFictive />} />
                  <Route path="investissement" element={<InvestmentPage />} />
                  <Route path="visio" element={<VisioUserPage />} />
                  <Route path="messages" element={<Messages />} /> 
                </Route>

                <Route 
                  path="/admin/*" 
                  element={
                    user && user.role === 'admin' ? <DashboardAdmin /> : <Navigate to="/login" replace /> 
                  }
                >
                  <Route index element={<AdminHome />} />
                  <Route path="users" element={<UsersList />} />
                  <Route path="users/:userId" element={<UserDetails />} />
                  <Route path="users/add" element={<AddUser />} />
                  <Route path="appointments" element={<AppointmentAdmin />} />
                  <Route path="education/sections" element={<SectionsList />} />
                  <Route path="education/sections/add" element={<SectionForm />} />
                  <Route path="education/sections/:id/edit" element={<SectionForm />} />
                  <Route path="education/contents" element={<ContentsList />} />
                  <Route path="education/contents/add" element={<ContentForm />} />
                  <Route path="education/contents/:id/edit" element={<ContentForm />} />
                  <Route path="change-admin-password" element={<ChangeAdminPassword />} />
                  <Route path="visio" element={<Visio />} />
                  <Route path="messages-users" element={<MessagesUsersList />} /> 
                  <Route path="messages/:userId" element={<ConversationAdmin />} />
                  <Route path="chat-messages" element={<MessagesAdmin />} /> 
                </Route>

                {/* Redirection pour les chemins non trouvés */}
                <Route path="*" element={<Navigate to="/" replace />} /> 
              </Routes>
            </Box>
            {/* Footer et autres éléments globaux */}
            <Footer />
            <CookieBanner />
             {/* Le ChatWidget public reste ici */}
            <ChatWidget />
          </Box>
        </Router>
      </GlobalModalProvider>
    </UserContext.Provider>
  );
}

export default App;
