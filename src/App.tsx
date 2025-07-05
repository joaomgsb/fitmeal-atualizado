import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useScrollToTop } from './hooks/useScrollToTop';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import MealPlansPage from './pages/MealPlansPage';
import TrackerPage from './pages/TrackerPage';
import ProfilePage from './pages/ProfilePage';
import MealPlanDetailPage from './pages/MealPlanDetailPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ShoppingListPage from './pages/ShoppingListPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SuggestedRecipesPage from './pages/SuggestedRecipesPage';
import AdminPage from './pages/AdminPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AdminNewsPage from './pages/AdminNewsPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import AdminTermsPage from './pages/AdminTermsPage';

function App() {
  useScrollToTop();

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="receitas" element={<RecipesPage />} />
          <Route path="receitas/:id" element={<RecipeDetailPage />} />
          <Route path="planos" element={<PrivateRoute><MealPlansPage /></PrivateRoute>} />
          <Route path="planos/:id" element={<PrivateRoute><MealPlanDetailPage /></PrivateRoute>} />
          <Route path="planos/personalizado" element={<PrivateRoute><MealPlanDetailPage /></PrivateRoute>} />
          <Route path="sugestoes-receitas" element={<PrivateRoute><SuggestedRecipesPage /></PrivateRoute>} />
          <Route path="tracker" element={<PrivateRoute><TrackerPage /></PrivateRoute>} />
          <Route path="lista-compras" element={<PrivateRoute><ShoppingListPage /></PrivateRoute>} />
          <Route path="perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="admin/termos" element={<AdminRoute><AdminTermsPage /></AdminRoute>} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="admin/news" element={<AdminRoute><AdminNewsPage /></AdminRoute>} />
          <Route path="termos-de-uso" element={<TermsOfUsePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignUpPage />} />
        <Route path="/recuperar-senha" element={<ResetPasswordPage />} />
      </Routes>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;