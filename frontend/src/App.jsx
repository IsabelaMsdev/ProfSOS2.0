import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Componentes
import PageTransition from "./components/PageTransition";

// Páginas
import AppHome from "./pages/AppHome";
import Registrar from "./pages/Registrar";
import Status from "./pages/Status";
import Historico from "./pages/Historico";
import Login from "./pages/Login";
import Tutorial from "./pages/Tutorial";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition location={location}>
      <Routes location={location}>
        {/* Primeiro tutorial, depois login */}
        <Route path="/" element={<Tutorial />} />
        <Route path="/login" element={<Login />} />

        {/* Home e navegação interna */}
        <Route path="/home" element={<AppHome />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/status" element={<Status />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
