import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import axios from '../../config/axios'; // Assurez-vous que le chemin est correct
import { API_ROUTES } from '../../config/api'; // Assurez-vous que le chemin est correct

// Interface pour typer les utilisateurs récupérés de l'API
interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

const Visio = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Récupérer la liste des utilisateurs au montage du composant
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get<{ success: boolean; users: User[] }>(
          API_ROUTES.admin.users
        );
        if (response.data.success) {
          // Filtrer pour ne garder que les utilisateurs (pas les admins) si nécessaire
          // et trier par nom/prénom
          const sortedUsers = response.data.users
            .filter(u => u.id) // S'assurer qu'il y a un ID
            .sort((a, b) => `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`));
          setUsers(sortedUsers);
        } else {
          setError('Erreur lors de la récupération des utilisateurs.');
        }
      } catch (err) {
        console.error('Erreur fetchUsers:', err);
        setError('Une erreur est survenue lors du chargement des utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Gérer le changement de sélection dans la liste déroulante
  const handleUserChange = (event: SelectChangeEvent<string>) => {
    const userId = event.target.value;
    setSelectedUserId(userId);
    const user = users.find((u) => u.id.toString() === userId) || null;
    setSelectedUser(user);
  };

  // Construire l'URL Jitsi
  const jitsiUrl = selectedUserId
    ? `https://meet.jit.si/OdiaStrategie-${selectedUserId}`
    // Ajouter des paramètres pour une meilleure expérience (optionnel)
    // ?userInfo.displayName=${encodeURIComponent(selectedUser ? `${selectedUser.prenom} ${selectedUser.nom}` : 'Admin')}`
    : '';

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#3F51B5', fontWeight: 600 }}>
        Visioconférence Jitsi
      </Typography>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="select-user-label">Sélectionner un utilisateur</InputLabel>
            <Select
              labelId="select-user-label"
              id="select-user"
              value={selectedUserId}
              label="Sélectionner un utilisateur"
              onChange={handleUserChange}
            >
              <MenuItem value="" disabled>
                -- Choisir un utilisateur --
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id.toString()}>
                  {user.prenom} {user.nom} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedUser && (
             <Typography variant="h6" sx={{ mb: 2 }}>
              Visioconférence avec : {selectedUser.prenom} {selectedUser.nom}
             </Typography>
          )}

          {jitsiUrl && (
            <Box sx={{ height: '600px', width: '100%' }}>
              <iframe
                src={jitsiUrl}
                style={{ height: '100%', width: '100%', border: 0 }}
                allow="camera; microphone; fullscreen; display-capture"
                title={`Visioconférence Jitsi avec ${selectedUser?.prenom} ${selectedUser?.nom}`}
              ></iframe>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Visio;
