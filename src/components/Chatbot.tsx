import { useState } from "react";
import axios from "../config/axios";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { API_ROUTES } from '../config/api';  // Ajout de l'import

function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Pop-up toggle

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      // Utiliser API_ROUTES pour la route du chatbot
      const response = await axios.post(API_ROUTES.chatbot, { message: input });
      setMessages([...newMessages, { role: "assistant", content: response.data.response }]);
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
      {/* Bouton d'ouverture */}
      {!isOpen && (
        <Button variant="contained" color="primary" onClick={() => setIsOpen(true)}>
          💬 Chat Support
        </Button>
      )}

      {/* Fenêtre du chatbot */}
      {isOpen && (
        <Paper elevation={3} sx={{ p: 2, width: 300, position: "relative" }}>
          <Typography variant="h6">Support ODIA</Typography>

          <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
            {messages.map((msg, index) => (
              <Typography key={index} sx={{ textAlign: msg.role === "user" ? "right" : "left" }}>
                <strong>{msg.role === "user" ? "Vous" : "Esther"}:</strong> {msg.content}
              </Typography>
            ))}
          </Box>

          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
          />

          <Button fullWidth variant="contained" onClick={sendMessage} disabled={loading} sx={{ mt: 1 }}>
            {loading ? "Envoi..." : "Envoyer"}
          </Button>

          {/* Bouton de fermeture */}
          <Button onClick={() => setIsOpen(false)} sx={{ position: "absolute", top: 0, right: 0 }}>
            ❌
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Chatbot;
