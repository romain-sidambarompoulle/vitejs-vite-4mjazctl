import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface GlobalModalContextType {
  anyModalOpen: boolean;
  setAnyModalOpen: (isOpen: boolean) => void;
  openModal: () => boolean;
  closeModal: () => void;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export const GlobalModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [anyModalOpen, setAnyModalOpenState] = useState<boolean>(false);

  // Fonction pour tenter d'ouvrir un modal (vérifie si un autre est déjà ouvert)
  const openModal = useCallback(() => {
    // On ne permet l'ouverture que si aucun autre modal n'est ouvert
    if (!anyModalOpen) {
      setAnyModalOpenState(true);
      return true; // Indique que l'ouverture a réussi
    }
    return false; // Indique que l'ouverture a été bloquée
  }, [anyModalOpen]);

  // Fonction pour fermer un modal
  const closeModal = useCallback(() => {
    setAnyModalOpenState(false);
  }, []);

  // Fournit l'état brut et les fonctions contrôlées pour ouvrir/fermer
  const value = { anyModalOpen, setAnyModalOpen: setAnyModalOpenState, openModal, closeModal };

  return (
    <GlobalModalContext.Provider value={value}>
      {children}
    </GlobalModalContext.Provider>
  );
};

export const useGlobalModal = (): GlobalModalContextType => {
  const context = useContext(GlobalModalContext);
  if (context === undefined) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
};
