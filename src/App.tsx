import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import ReglesDeCalcul from "./pages/ReglesDeCalcul";
import Navbar from "./components/Navbar";
import FormulaireRDV from "./pages/FormulaireRDV";
import Simulateur from "./pages/Simulator/Simulateur";
// import Chatbot from "./components/Chatbot"; // Chatbot temporairement désactivé

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
        <Route path="/simulateur" element={<Simulateur />} />
        <Route path="/regles-de-calcul" element={<ReglesDeCalcul />} />
        <Route path="/simulateur/:type" element={<Simulateur />} />
        <Route path="/formulaire-rdv" element={<FormulaireRDV />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
