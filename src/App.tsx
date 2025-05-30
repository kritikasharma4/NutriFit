import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NutritionProvider } from './contexts/NutritionContext';
import { HealthProvider } from './contexts/HealthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import FoodLogger from './pages/FoodLogger';
import HealthProfile from './pages/HealthProfile';
import FitnessRecommendations from './pages/FitnessRecommendations';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <NutritionProvider>
        <HealthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<Layout />}>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/food-logger" element={
                  <ProtectedRoute>
                    <FoodLogger />
                  </ProtectedRoute>
                } />
                <Route path="/health-profile" element={
                  <ProtectedRoute>
                    <HealthProfile />
                  </ProtectedRoute>
                } />
                <Route path="/fitness-recommendations" element={
                  <ProtectedRoute>
                    <FitnessRecommendations />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </Router>
        </HealthProvider>
      </NutritionProvider>
    </AuthProvider>
  );
}

export default App;