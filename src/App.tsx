import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Home from "./pages/Home";
import KineSimulator from "./pages/Simulator/KineSimulator";
import SageFemmeSimulator from "./pages/Simulator/SageFemmeSimulator";
import InfirmierSimulator from "./pages/Simulator/InfirmierSimulator";
import InfirmierExplanation from "./pages/Explanation/InfirmierExplanation";
import SagefemmeExplanation from "./pages/Explanation/SageFemmeExplanation";
import KineExplanation from "./pages/Explanation/KineExplanation";
import Contact from "./pages/Contact";
import ReglesDeCalcul from "./pages/ReglesDeCalcul";
import Navbar from "./components/Navbar";
import FormulaireRDV from "./pages/FormulaireRDV";
import APropos from "./pages/Apropos";
import Simulateur from "./pages/Simulator/Simulateur"
import Chatbot from "./components/Chatbot"; // 🔥 Import du chatbot

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulators/kine" element={<KineSimulator />} />
        <Route path="/simulators/sage-femme" element={<SageFemmeSimulator />} />
        <Route path="/simulators/infirmier" element={<InfirmierSimulator />} />
        <Route path="/explanation/infirmier" element={<InfirmierExplanation />} />
        <Route path="/explanation/sage-femme" element={<SagefemmeExplanation />} />
        <Route path="/explanation/kine" element={<KineExplanation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/simulateur" element={<Simulateur />} />
        <Route path="/regles-de-calcul" element={<ReglesDeCalcul />} />
        <Route path="/simulateur/:type" element={<Simulateur />} />
        <Route path="/formulaire-rdv" element={<FormulaireRDV />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Chatbot /> {/* 🔥 Ajout du Chatbot ici */}
    </Router>
  );
}

export default App;
