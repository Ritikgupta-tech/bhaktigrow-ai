import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { SavedItemsProvider } from './context/SavedItemsContext';
import { CalendarProvider } from './context/CalendarContext';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// 12 Application Pages
import { DashboardPage } from './pages/DashboardPage';
import { StudioPage } from './pages/StudioPage';
import { YouTubeStudioPage } from './pages/YouTubeStudioPage';
import { InstagramStudioPage } from './pages/InstagramStudioPage';
import { FacebookStudioPage } from './pages/FacebookStudioPage';
import { ResearchPage } from './pages/ResearchPage';
import { ThumbnailLabPage } from './pages/ThumbnailLabPage';
import { ContentLibraryPage } from './pages/ContentLibraryPage';
import { CalendarPage } from './pages/CalendarPage';
import { SavedPage } from './pages/SavedPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

// Authentication Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <ToastProvider>
          <SavedItemsProvider>
            <CalendarProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    {/* Default Route redirects to Dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* 12 Core Pages */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/studio" element={<StudioPage />} />
                    <Route path="/youtube" element={<YouTubeStudioPage />} />
                    <Route path="/instagram" element={<InstagramStudioPage />} />
                    <Route path="/facebook" element={<FacebookStudioPage />} />
                    <Route path="/research" element={<ResearchPage />} />
                    <Route path="/thumbnail-lab" element={<ThumbnailLabPage />} />
                    <Route path="/library" element={<ContentLibraryPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/saved" element={<SavedPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </CalendarProvider>
          </SavedItemsProvider>
        </ToastProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
};

export default App;
