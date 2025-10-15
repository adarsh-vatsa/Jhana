import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout";
import Assessment from "./components/Assessment";
import Dashboard from "./components/Dashboard";
import JhanaMeditation from "./components/JhanaMeditation";
import LearningModule from "./components/LearningModule";
import RoutineBuilder from "./components/RoutineBuilder";
import { Toaster } from "./components/ui/toaster";

const AppRoutes = () => {
  const { hasCompletedAssessment } = useApp();

  if (!hasCompletedAssessment) {
    return (
      <Routes>
        <Route path="/" element={<Assessment />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/jhana" element={<JhanaMeditation />} />
      <Route path="/learning" element={<LearningModule />} />
      <Route path="/routine" element={<RoutineBuilder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <Layout>
            <AppRoutes />
          </Layout>
          <Toaster />
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
