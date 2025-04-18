import { createContext, useState } from 'react';
import axios from '../config/axios';
import { API_ROUTES } from '../config/api';

// Définition de l'interface User
export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email?: string;
  role?: string;
}

// ✨ Étendre l'interface pour inclure unreadCount et son setter
export interface IUserContext {
    user: User | null;
    setUser: (user: User | null) => void;
    unreadCount: number; // Nombre de messages internes non lus
    setUnreadCount: (count: number) => void; // Fonction pour mettre à jour le compteur
}

// Création du contexte avec les nouvelles valeurs par défaut
export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
  unreadCount: 0, // Valeur par défaut
  setUnreadCount: () => {} // Fonction vide par défaut
});

export default UserContext;