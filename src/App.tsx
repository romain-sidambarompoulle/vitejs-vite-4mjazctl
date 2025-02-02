import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Home from "./pages/Home";
import Simulators from "./pages/Simulator/Simulators";
import KineSimulator from "./pages/Simulator/KineSimulator";
import SageFemmeSimulator from "./pages/Simulator/SageFemmeSimulator";
import InfirmierSimulator from "./pages/Simulator/InfirmierSimulator";
import KineExplanation from "./pages/Explanation/KineExplanation";
import SageFemmeExplanation from "./pages/Explanation/SageFemmeExplanation";
import InfirmierExplanation from "./pages/Explanation/InfirmierExplanation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ReglesDeCalcul from "./pages/ReglesDeCalcul";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Routes>
        {/* Redirection par défaut vers Home */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/regles-de-calcul" element={<ReglesDeCalcul />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/simulators" element={<Simulators />} />
        <Route path="/simulators/kine" element={<KineSimulator />} />
        <Route path="/simulators/sage-femme" element={<SageFemmeSimulator />} />
        <Route path="/simulators/infirmier" element={<InfirmierSimulator />} />
        <Route path="/explanation/kine" element={<KineExplanation />} />
        <Route path="/explanation/sage-femme" element={<SageFemmeExplanation />} />
        <Route path="/explanation/infirmier" element={<InfirmierExplanation />} />
  
        <Route path="*" element={<Navigate to="/" />} />

     </Routes>
    </Router>
  );
}

export default App;