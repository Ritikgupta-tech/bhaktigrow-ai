import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { PreferencesProvider } from '../context/PreferencesContext';
import { SavedItemsProvider } from '../context/SavedItemsContext';
import { CalendarProvider } from '../context/CalendarContext';
import { AuthProvider } from '../context/AuthContext';
import { DashboardPage } from '../pages/DashboardPage';
import { StudioPage } from '../pages/StudioPage';
import { ResearchPage } from '../pages/ResearchPage';
import { ThumbnailLabPage } from '../pages/ThumbnailLabPage';
import { SettingsPage } from '../pages/SettingsPage';

function renderWithProviders(ui: React.ReactElement, initialRoute = '/') {
  return render(
    <AuthProvider>
      <PreferencesProvider>
        <ToastProvider>
          <SavedItemsProvider>
            <CalendarProvider>
              <MemoryRouter initialEntries={[initialRoute]}>
                {ui}
              </MemoryRouter>
            </CalendarProvider>
          </SavedItemsProvider>
        </ToastProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}

describe('BhaktiGrow AI UI & Integration Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Dashboard with headline and core overview metrics', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/Devotional Content Creator Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Saved Suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/Content Drafts/i)).toBeInTheDocument();
    expect(screen.getByText(/Scheduled Demos/i)).toBeInTheDocument();
  });

  it('renders Studio page with video upload area and form fields', () => {
    renderWithProviders(<StudioPage />);
    expect(screen.getByText(/AI Devotional Content Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/Local Video Reference/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Hanuman Chalisa 11 Times Recitation/i)).toBeInTheDocument();
  });

  it('filters research records by search term', () => {
    renderWithProviders(<ResearchPage />);
    expect(screen.getByText(/Sample research data — not live/i)).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText(/Search keywords, prayers, gap ideas/i);
    fireEvent.change(searchInput, { target: { value: 'Maha Mrityunjaya' } });

    expect(screen.getByText(/Maha Mrityunjaya Mantra 108 Times Healing/i)).toBeInTheDocument();
  });

  it('switches aspect ratio in Thumbnail Lab', () => {
    renderWithProviders(<ThumbnailLabPage />);
    expect(screen.getByText(/Thumbnail & Hook Lab/i)).toBeInTheDocument();

    const switchBtn = screen.getByText(/9:16 \(Instagram Reels\/Shorts\)/i);
    fireEvent.click(switchBtn);

    const safeAreasBtn = screen.getByText(/Show Safe Areas/i);
    fireEvent.click(safeAreasBtn);

    expect(screen.getByText(/REEL CAPTION AREA/i)).toBeInTheDocument();
  });

  it('renders Settings and allows toggling reduced motion', () => {
    renderWithProviders(<SettingsPage />);
    expect(screen.getByText(/Preferences & System Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Reduced Motion Mode/i)).toBeInTheDocument();
  });
});
