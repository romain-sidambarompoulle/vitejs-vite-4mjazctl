import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from '@mui/material';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  school: string;
  region: string;
  email: string;
  created_at: string;
}

const StudentLeadsList = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: Lead[] }>(
          API_ROUTES.adminStudentLeads
        );
        if (res.data.success) {
          setLeads(res.data.data);
        }
      } catch (err) {
        console.error('Erreur récupération leads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4} color="#3F51B5">
        Inscriptions Web-Conférence
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Prénom</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>École</TableCell>
                <TableCell>Région</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Inscrit le</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.first_name}</TableCell>
                  <TableCell>{lead.last_name}</TableCell>
                  <TableCell>{lead.school}</TableCell>
                  <TableCell>{lead.region}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default StudentLeadsList;
