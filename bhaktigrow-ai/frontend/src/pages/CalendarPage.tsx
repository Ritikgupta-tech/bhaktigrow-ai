import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { PlatformBadge, CalendarStatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useCalendar } from '../context/CalendarContext';
import { useToast } from '../context/ToastContext';
import { DEVOTIONAL_CATEGORIES } from '../data/seedData';
import { CalendarEntry, CalendarStatus, Platform, DevotionalCategory } from '../types';
import { 
  CalendarDays, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Calendar as CalendarIcon, 
  Edit3, 
  Trash2, 
  AlertCircle,
  List,
  Columns
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { entries, addEntry, updateEntry, deleteEntry } = useCalendar();
  const { showToast } = useToast();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [today] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<CalendarStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formPlatform, setFormPlatform] = useState<Platform>('youtube');
  const [formCategory, setFormCategory] = useState<DevotionalCategory>('Hanuman Chalisa');
  const [formDateTime, setFormDateTime] = useState('');
  const [formStatus, setFormStatus] = useState<CalendarStatus>('Draft');
  const [formNotes, setFormNotes] = useState('');

  // Open Create Modal
  const handleOpenCreateModal = (defaultDate?: Date) => {
    setEditingEntryId(null);
    setFormTitle('');
    setFormPlatform('youtube');
    setFormCategory('Hanuman Chalisa');
    const target = defaultDate || new Date();
    // format as YYYY-MM-DDTHH:mm
    const dateStr = target.toISOString().slice(0, 16);
    setFormDateTime(dateStr);
    setFormStatus('Draft');
    setFormNotes('');
    setIsEntryModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (entry: CalendarEntry) => {
    setEditingEntryId(entry.id);
    setFormTitle(entry.title);
    setFormPlatform(entry.platform);
    setFormCategory(entry.category);
    setFormDateTime(entry.plannedDateTime.slice(0, 16));
    setFormStatus(entry.status);
    setFormNotes(entry.notes || '');
    setIsEntryModalOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Please provide a content title.', 'error');
      return;
    }

    if (editingEntryId) {
      updateEntry(editingEntryId, {
        title: formTitle.trim(),
        platform: formPlatform,
        category: formCategory,
        plannedDateTime: new Date(formDateTime).toISOString(),
        status: formStatus,
        notes: formNotes.trim()
      });
      showToast('Calendar entry updated!', 'success');
    } else {
      addEntry({
        title: formTitle.trim(),
        platform: formPlatform,
        category: formCategory,
        plannedDateTime: new Date(formDateTime).toISOString(),
        status: formStatus,
        notes: formNotes.trim()
      });
      showToast('Scheduled entry added to calendar!', 'success');
    }

    setIsEntryModalOpen(false);
  };

  const handleDeleteEntry = () => {
    if (deleteConfirmId) {
      deleteEntry(deleteConfirmId);
      showToast('Entry removed from calendar', 'info');
      setDeleteConfirmId(null);
    }
  };

  // Filtered & Sorted Entries
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchSearch = !searchTerm.trim() || e.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPlatform = filterPlatform === 'all' || e.platform === filterPlatform;
      const matchStatus = filterStatus === 'all' || e.status === filterStatus;
      return matchSearch && matchPlatform && matchStatus;
    }).sort((a, b) => new Date(a.plannedDateTime).getTime() - new Date(b.plannedDateTime).getTime());
  }, [entries, searchTerm, filterPlatform, filterStatus]);

  // Calendar Date Navigation
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Grid Calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthWeeks = useMemo(() => {
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    // Fill leading empty days
    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [year, month, firstDayOfMonth, daysInMonth]);

  // Week View calculation (7 days around current week)
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day); // Sunday

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Content Planning Calendar"
        subtitle="Schedule and organize your devotional video releases across YouTube, Instagram, and Facebook in Month, Week, or List views."
        icon={<CalendarDays className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content Calendar' }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4 text-slate-950" />}
            onClick={() => handleOpenCreateModal()}
          >
            Add Calendar Entry
          </Button>
        }
      />

      {/* Honest Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Demo planning only.</strong> No content is actually scheduled or published to social media.
          </span>
        </div>
        <span className="text-[11px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded font-semibold hidden sm:inline">
          Local Storage Persisted
        </span>
      </div>

      {/* Toolbar: Navigation, Views, Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Month / Period Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Previous period"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Next period"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              {monthName}
            </h3>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'month' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'week' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List ({filteredEntries.length})</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search entries by title..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={filterPlatform}
              onChange={e => setFilterPlatform(e.target.value as Platform | 'all')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as CalendarStatus | 'all')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled Demo">Scheduled Demo</option>
              <option value="Published Demo">Published Demo</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW: Month Grid View */}
      {viewMode === 'month' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/70 text-center text-xs font-bold text-slate-400 py-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue (Hanuman)</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri (Devi)</span>
            <span>Sat (Shani)</span>
          </div>

          {/* Weeks and Days */}
          <div className="divide-y divide-slate-800/80">
            {monthWeeks.map((week, wIndex) => (
              <div key={wIndex} className="grid grid-cols-7 divide-x divide-slate-800/80 min-h-[110px]">
                {week.map((day, dIndex) => {
                  if (day === null) {
                    return <div key={dIndex} className="bg-slate-950/30 p-2" />;
                  }

                  const cellDate = new Date(year, month, day);
                  const isToday =
                    today.getDate() === day &&
                    today.getMonth() === month &&
                    today.getFullYear() === year;

                  // Find entries matching this date
                  const dayEntries = filteredEntries.filter(entry => {
                    const eDate = new Date(entry.plannedDateTime);
                    return (
                      eDate.getDate() === day &&
                      eDate.getMonth() === month &&
                      eDate.getFullYear() === year
                    );
                  });

                  return (
                    <div
                      key={dIndex}
                      onClick={() => handleOpenCreateModal(cellDate)}
                      className={`p-2 transition-colors cursor-pointer group flex flex-col justify-between ${
                        isToday ? 'bg-amber-500/5' : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            isToday
                              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                              : 'text-slate-400 group-hover:text-white'
                          }`}
                        >
                          {day}
                        </span>
                        {dayEntries.length > 0 && (
                          <span className="text-[10px] text-amber-400 font-medium">
                            {dayEntries.length} {dayEntries.length === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </div>

                      {/* Entries preview chips */}
                      <div className="space-y-1.5 overflow-hidden">
                        {dayEntries.slice(0, 2).map(entry => (
                          <div
                            key={entry.id}
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenEditModal(entry);
                            }}
                            className="p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 text-[11px] truncate text-slate-200"
                            title={entry.title}
                          >
                            <div className="flex items-center gap-1 truncate font-medium">
                              <PlatformBadge platform={entry.platform} showIcon={false} className="scale-75 origin-left" />
                              <span className="truncate">{entry.title}</span>
                            </div>
                          </div>
                        ))}
                        {dayEntries.length > 2 && (
                          <span className="text-[10px] text-slate-400 block text-right font-medium">
                            +{dayEntries.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
          {weekDays.map((dayDate, idx) => {
            const isToday =
              dayDate.getDate() === today.getDate() &&
              dayDate.getMonth() === today.getMonth() &&
              dayDate.getFullYear() === today.getFullYear();

            const dayEntries = filteredEntries.filter(entry => {
              const eDate = new Date(entry.plannedDateTime);
              return (
                eDate.getDate() === dayDate.getDate() &&
                eDate.getMonth() === dayDate.getMonth() &&
                eDate.getFullYear() === dayDate.getFullYear()
              );
            });

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[300px] ${
                  isToday
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        {dayDate.toLocaleDateString(undefined, { weekday: 'short' })}
                      </p>
                      <p className={`text-lg font-black ${isToday ? 'text-amber-400' : 'text-white'}`}>
                        {dayDate.getDate()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenCreateModal(dayDate)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Add Entry on this date"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {dayEntries.map(entry => (
                      <div
                        key={entry.id}
                        onClick={() => handleOpenEditModal(entry)}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 cursor-pointer text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <PlatformBadge platform={entry.platform} showIcon={false} />
                          <CalendarStatusBadge status={entry.status} />
                        </div>
                        <p className="font-semibold text-slate-200 line-clamp-2">
                          {entry.title}
                        </p>
                      </div>
                    ))}
                    {dayEntries.length === 0 && (
                      <p className="text-[11px] text-slate-500 italic text-center py-6">
                        No entries
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenCreateModal(dayDate)}
                  className="w-full text-[11px] text-slate-400 hover:text-white mt-4"
                >
                  + Add Post
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredEntries.length > 0 ? (
            filteredEntries.map(entry => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PlatformBadge platform={entry.platform} />
                    <CalendarStatusBadge status={entry.status} />
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {entry.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {entry.title}
                  </h4>
                  {entry.notes && (
                    <p className="text-xs text-slate-400 italic">
                      Notes: {entry.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right text-xs">
                    <p className="font-semibold text-slate-200">
                      {new Date(entry.plannedDateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-slate-400">
                      {new Date(entry.plannedDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(entry)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Edit Entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(entry.id)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No Calendar Entries Found"
              description="No content items match your current filters. Add a new planned devotional video or reset filters."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenCreateModal()}
                >
                  Create New Entry
                </Button>
              }
            />
          )}
        </div>
      )}

      {/* Entry Create / Edit Modal */}
      <Modal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        title={editingEntryId ? 'Edit Calendar Entry' : 'Plan New Content Entry'}
        subtitle="Organize your upcoming devotional video releases"
      >
        <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Content Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="e.g., Saturday Hanuman Chalisa Morning Chants"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Platform
              </label>
              <select
                value={formPlatform}
                onChange={e => setFormPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Devotional Category
              </label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value as DevotionalCategory)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {DEVOTIONAL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Planned Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={formDateTime}
                onChange={e => setFormDateTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value as CalendarStatus)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Draft">Draft</option>
                <option value="Scheduled Demo">Scheduled Demo</option>
                <option value="Published Demo">Published Demo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Notes &amp; Production Checklist (Optional)
            </label>
            <textarea
              rows={3}
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              placeholder="e.g., Check Sanskrit subtitles; tune audio to 432Hz; prepare thumbnail..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsEntryModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingEntryId ? 'Update Entry' : 'Add to Calendar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteEntry}
        title="Delete Calendar Entry"
        message="Are you sure you want to remove this entry from your planning calendar? This action cannot be undone."
        confirmLabel="Delete Entry"
        isDestructive={true}
      />
    </div>
  );
};
