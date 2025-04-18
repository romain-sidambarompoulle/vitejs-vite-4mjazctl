import axios from 'axios';
import { API_ROUTES, BASE_URL } from './api'; // Import API_ROUTES et BASE_URL

// État global pour stocker le token CSRF
let csrfToken = '';

// Drapeau pour éviter les appels simultanés à /refresh
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Fonction pour obtenir un nouveau token CSRF
const fetchCsrfToken = async () => {
  try {
    // Ajouter un timestamp à l'URL pour éviter le cache navigateur
    const timestamp = Date.now();
    console.log("🔄 Tentative de récupération du token CSRF...");
    
    // Utiliser l'URL absolue avec BASE_URL
    const response = await axios.get(`${BASE_URL}/api/csrf-token?_t=${timestamp}`, { 
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log("📊 fetchCsrfToken response status:", response.status, response.statusText);
    console.log("📊 fetchCsrfToken response data:", response.data);
    console.log("📊 Avant attribution, csrfToken=", csrfToken);
    
    if (response.data && response.data.csrfToken) {
      csrfToken = response.data.csrfToken;
      console.log('✅ Token CSRF récupéré avec succès:', csrfToken);
      console.log("📊 Après attribution, csrfToken=", csrfToken);
      return csrfToken;
    } else {
      console.error("❌ Réponse sans token CSRF:", response.data);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du token CSRF:', error);
  }
  return null;
};

// Fonction pour rafraîchir le token d'accès
const refreshAccessToken = async (): Promise<void> => {
  if (isRefreshing) {
    // Si un rafraîchissement est déjà en cours, utiliser la même promesse
    return refreshPromise as Promise<void>;
  }

  isRefreshing = true;
  refreshPromise = new Promise<void>(async (resolve, reject) => {
    try {
      const response = await axios.post(API_ROUTES.auth.refresh, {}, { 
        withCredentials: true,
        headers: {
          'CSRF-Token': csrfToken
        }
      });

      if (response.data.success) {
        // Récupérer un nouveau token CSRF après rafraîchissement
        await fetchCsrfToken();
        resolve();
      } else {
        reject(new Error('Échec du rafraîchissement du token'));
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      // En cas d'échec, rediriger vers la page de connexion
      localStorage.removeItem('user');
      // ✨ Suppression aussi du token pour éviter de le renvoyer par erreur
      localStorage.removeItem('token'); 
      window.location.href = '/login';
      reject(error);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  return refreshPromise;
};

// Créer l'instance axios avec baseURL
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requête pour ajouter le token CSRF et le token d'authentification
instance.interceptors.request.use(async (config) => {
  // Ajouter le token d'authentification depuis localStorage si présent
  const authToken = localStorage.getItem('token');
  
  // ✨ Vérifier si l'URL de la requête n'est PAS celle de login avant d'ajouter le header
  const isLoginRequest = config.url === API_ROUTES.auth.login; 
  
  if (authToken && !isLoginRequest) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
    console.log('✅ Token d\'authentification ajouté aux headers');
  } else if (authToken && isLoginRequest) {
    console.log('⚠️ Header Authorization non ajouté pour la requête de login.');
  }

  if (
    config.method !== 'get' && 
    config.method !== 'head' && 
    config.method !== 'options'
  ) {
    console.log("🔍 Intercepteur: method=", config.method, "url=", config.url);
    console.log("🔍 Intercepteur: csrfToken avant vérification =", csrfToken);
    
    // Si aucun token CSRF n'est disponible, essayer d'en récupérer un
    if (!csrfToken) {
      console.log("⚠️ Token CSRF non disponible, tentative de récupération...");
      await fetchCsrfToken();
      console.log("🔍 Intercepteur: csrfToken après récupération =", csrfToken);
    }
    
    if (csrfToken) {
      config.headers['CSRF-Token'] = csrfToken;
      console.log("✅ Intercepteur: token CSRF ajouté aux headers:", csrfToken);
    } else {
      console.warn('❌ Impossible d\'ajouter le token CSRF à la requête, token non disponible');
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur de réponse pour gérer les tokens expirés
instance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  
  // Éviter les boucles infinies
  if (originalRequest._retry) {
    return Promise.reject(error);
  }
  
  // Vérifier si c'est une erreur d'expiration du token
  if (
    error.response && 
    error.response.status === 401 && 
    error.response.data.code === 'TOKEN_EXPIRED' &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    
    try {
      // Rafraîchir le token
      await refreshAccessToken();
      
      // Réessayer la requête originale
      // ✨ Redéfinir isLoginRequest dans cette portée
      const isLoginRequest = originalRequest.url === API_ROUTES.auth.login; 
      // ✨ Assurer que le nouveau token est bien utilisé lors de la nouvelle tentative
      const newAuthToken = localStorage.getItem('token');
      if (newAuthToken && !isLoginRequest) { // Ne pas ajouter sur le login même en retry
        originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;
      }
      // ✨ Assurer que le nouveau CSRF token est aussi utilisé
      if (csrfToken) {
         originalRequest.headers['CSRF-Token'] = csrfToken;
      }
      
      return instance(originalRequest);
    } catch (refreshError) {
      // En cas d'échec du rafraîchissement, rediriger vers la page de connexion
      return Promise.reject(refreshError);
    }
  }
  
  // Pour les autres erreurs, rejeter normalement
  return Promise.reject(error);
});

// Récupérer un token CSRF au démarrage de l'application
fetchCsrfToken().then(token => {
  if (token) {
    console.log('Token CSRF récupéré au démarrage de l\'application');
  } else {
    console.warn('Échec de récupération du token CSRF au démarrage');
  }
});

export { fetchCsrfToken, BASE_URL };
export default instance;
