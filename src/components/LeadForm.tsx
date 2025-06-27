import React, { useState, FormEvent, ChangeEvent } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import axios from '../config/axios';
import { API_ROUTES } from '../config/api';

interface LeadFormProps {
  onSuccess?: () => void;
}

interface LeadState {
  firstName: string;
  lastName: string;
  school: string;
  region: string;
  email: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<LeadState>({
    firstName: '',
    lastName: '',
    school: '',
    region: '',
    email: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof LeadState
  ) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.school || !form.region || !form.email) return;
    
    setLoading(true);
    try {
      await axios.post(API_ROUTES.studentLeads, form);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue. Réessaye !');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Prénom"
          fullWidth
          required
          value={form.firstName}
          onChange={(e) => handleChange(e, 'firstName')}
        />

        <TextField
          label="Nom"
          fullWidth
          required
          value={form.lastName}
          onChange={(e) => handleChange(e, 'lastName')}
        />

        <TextField
          label="École"
          fullWidth
          required
          value={form.school}
          onChange={(e) => handleChange(e, 'school')}
        />

        <TextField
          label="Région"
          fullWidth
          required
          value={form.region}
          onChange={(e) => handleChange(e, 'region')}
        />

        <TextField
          label="E-mail"
          type="email"
          fullWidth
          required
          value={form.email}
          onChange={(e) => handleChange(e, 'email')}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: '#2E5735' }}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Inscription…' : "Je m'inscris gratuitement"}
        </Button>
      </Stack>
    </form>
  );
};

export default LeadForm;
