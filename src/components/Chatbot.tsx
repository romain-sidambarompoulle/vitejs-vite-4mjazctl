import { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const API_KEY = "Vsk-proj-k8vHR6FljDREz2CMjfVrnTjjuUwwRmMS8P5cfgISWaPUPWuzpUI7KpO2SWarDt3CoPOSxzt5wCT3BlbkFJWynn42puAuej-OQMzBrciuQXcIQXxhsd1Qg9F9bFyYANQh-C4k2BpRBdApGt7Y4nwMmzggWYcA"; // 🔥 Remplace ici avec ta clé API

function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Pop-up toggle

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: newMessages,
        },
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMessages([...newMessages, { role: "assistant", content: response.data.choices[0].message.content }]);
    } catch (error) {
      console.error("Erreur API OpenAI :", error);
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
          <Typography variant="h6">Support Chat</Typography>

          <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
            {messages.map((msg, index) => (
              <Typography key={index} sx={{ textAlign: msg.role === "user" ? "right" : "left" }}>
                <strong>{msg.role === "user" ? "Vous" : "Bot"}:</strong> {msg.content}
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
