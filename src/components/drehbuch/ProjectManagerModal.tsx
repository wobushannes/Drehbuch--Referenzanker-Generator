import React, { useState, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Save,
  Trash2,
  Copy,
  Check,
  Search,
  Clock,
  FileText,
  Users,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ExternalLink,
  X,
  RefreshCw,
  HardDrive,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DrehbuchKonfiguratorState, ScreenplayProjectMetadata } from '../../types';
import { Language } from '../../utils/i18n';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectName?: string;
  currentConfig: DrehbuchKonfiguratorState;
  onLoadProject: (projectData: Partial<DrehbuchKonfiguratorState>, projectName: string) => void;
  onSaveProject: (projectName: string, title?: string) => Promise<boolean>;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  language?: Language;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  currentProjectName,
  currentConfig,
  onLoadProject,
  onSaveProject,
  onShowToast,
  language = 'DE',
}) => {
  const isEn = language === 'EN';
  const [projects, setProjects] = useState<ScreenplayProjectMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'new' | 'saveCurrent'>('browse');

  // New project form state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectSlug, setNewProjectSlug] = useState('');

  // Save current project state
  const [saveTitle, setSaveTitle] = useState(currentConfig.title || currentProjectName || 'Musterhaus Drehbuch');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Fetch projects from server
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        onShowToast('error', data.error || 'Fehler beim Laden der Projektliste.');
      }
    } catch (err: any) {
      onShowToast('error', `Fehler beim Abrufen der Projekte: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      setSaveTitle(currentConfig.title || currentProjectName || 'Musterhaus Drehbuch');
    }
  }, [isOpen, currentProjectName, currentConfig.title]);

  if (!isOpen) return null;

  // Handle Load project
  const handleLoad = async (projectSlug: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/load/${encodeURIComponent(projectSlug)}`);
      const data = await res.json();
      if (data.success && data.project) {
        onLoadProject(data.project, projectSlug);
        onShowToast('success', `Projekt "${data.project.title || projectSlug}" erfolgreich aus /data/projects/${projectSlug}/ geladen!`);
        onClose();
      } else {
        onShowToast('error', data.error || 'Projekt konnte nicht geladen werden.');
      }
    } catch (err: any) {
      onShowToast('error', `Fehler beim Laden: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete project
  const handleDelete = async (projectSlug: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Möchtest du das Projekt "${title}" und den Ordner /data/projects/${projectSlug}/ wirklich unwiderruflich löschen?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/delete/${encodeURIComponent(projectSlug)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('info', `Projektordner "/data/projects/${projectSlug}" gelöscht.`);
        fetchProjects();
      } else {
        onShowToast('error', data.error || 'Fehler beim Löschen.');
      }
    } catch (err: any) {
      onShowToast('error', `Fehler beim Löschen: ${err.message}`);
    }
  };

  // Handle Create New Project
  const handleCreateNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) {
      onShowToast('error', 'Bitte einen Projektnamen eingeben.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProjectTitle.trim(),
          name: newProjectSlug.trim() || newProjectTitle.trim(),
          description: newProjectDescription.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.project) {
        onLoadProject(data.project, data.slug);
        onShowToast('success', `Neues Projekt "${newProjectTitle}" in /data/projects/${data.slug}/ angelegt!`);
        onClose();
      } else {
        onShowToast('error', data.error || 'Fehler beim Anlegen des Projekts.');
      }
    } catch (err: any) {
      onShowToast('error', `Fehler beim Erstellen: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Save Current Project
  const handleSaveCurrent = async () => {
    if (!saveTitle.trim()) {
      onShowToast('error', 'Bitte einen Projekttitel angeben.');
      return;
    }

    setIsSaving(true);
    try {
      const success = await onSaveProject(currentProjectName || saveTitle, saveTitle);
      if (success) {
        fetchProjects();
        setActiveTab('browse');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Copy folder path
  const handleCopyPath = (pathText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(pathText);
    setCopiedSlug(pathText);
    setTimeout(() => setCopiedSlug(null), 2000);
    onShowToast('info', `Pfad "${pathText}" in Zwischenablage kopiert.`);
  };

  // Filter projects by search
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.targetAudienceName && p.targetAudienceName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <HardDrive className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900">
                  {isEn ? 'Project & Data Manager' : 'Projekt- & Datenverwaltung'}
                </h2>
                <span className="px-2 py-0.5 bg-zinc-200 text-zinc-800 text-[10px] font-bold rounded-md font-mono">
                  /data/projects/
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {isEn
                  ? 'Saves all references, single-line prompts and screenplay windows structured in folders on disk.'
                  : 'Speichert alle Referenzen, Single-Line-Prompts und Drehbuch-Windows strukturiert als Unterordner auf der Festplatte.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-zinc-200 bg-zinc-100/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 text-xs font-bold transition cursor-pointer ${
                activeTab === 'browse'
                  ? 'border-indigo-600 text-indigo-900 bg-white/50'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>{isEn ? `Browse Projects (${projects.length})` : `Projekte durchsuchen (${projects.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saveCurrent')}
              className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 text-xs font-bold transition cursor-pointer ${
                activeTab === 'saveCurrent'
                  ? 'border-emerald-600 text-emerald-900 bg-white/50'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Save className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? 'Save current project into data' : 'Aktuelles Projekt in data ablegen'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 text-xs font-bold transition cursor-pointer ${
                activeTab === 'new'
                  ? 'border-zinc-900 text-zinc-900 bg-white/50'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>{isEn ? 'Create New Project' : 'Neues Projekt anlegen'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={fetchProjects}
            title={isEn ? 'Refresh project list' : 'Projektliste aktualisieren'}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: BROWSE PROJECTS */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search projects by title, folder name or target audience...' : 'Projekte nach Titel, Ordnername oder Zielgruppe durchsuchen...'}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                />
              </div>

              {/* Projects Grid */}
              {isLoading && projects.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                  <span>{isEn ? 'Loading projects from /data/projects/...' : 'Lade Projekte aus /data/projects/...'}</span>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-zinc-200 rounded-2xl p-8 space-y-3 bg-zinc-50">
                  <Folder className="w-10 h-10 text-zinc-300 mx-auto" />
                  <h3 className="text-sm font-bold text-zinc-800">
                    {searchQuery
                      ? (isEn ? 'No matching projects found' : 'Keine passenden Projekte gefunden')
                      : (isEn ? 'No projects in /data/projects/ yet' : 'Noch keine Projekte in /data/projects/ vorhanden')}
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    {isEn
                      ? 'Save your current screenplay or create a new project. All data, reference images and generated prompts are stored cleanly in the project directory.'
                      : 'Speichere dein aktuelles Drehbuch oder erstelle ein neues Projekt. Alle Daten, Referenzbilder und generierten Prompts werden sauber im Projektordner abgelegt.'}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('saveCurrent')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Save Current State Now' : 'Aktuellen Stand jetzt speichern'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('new')}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Create New Project' : 'Neues Projekt anlegen'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredProjects.map((p) => {
                    const isCurrent = currentProjectName === p.id;

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleLoad(p.id)}
                        className={`p-4 rounded-2xl border transition shadow-2xs cursor-pointer flex flex-col justify-between group ${
                          isCurrent
                            ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-200'
                            : 'border-zinc-200 hover:border-zinc-400 bg-white hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  isCurrent ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200'
                                }`}
                              >
                                <Folder className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-xs text-zinc-900 truncate">
                                    {p.title}
                                  </h4>
                                  {isCurrent && (
                                    <span className="px-1.5 py-0.2 bg-indigo-600 text-white text-[9px] font-bold rounded">
                                      {isEn ? 'ACTIVE' : 'AKTIV'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                                  <span>{p.folderPath}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyPath(p.folderPath, e)}
                                    title={isEn ? 'Copy path' : 'Pfad kopieren'}
                                    className="hover:text-zinc-800 p-0.5"
                                  >
                                    {copiedSlug === p.folderPath ? (
                                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-2.5 h-2.5 text-zinc-400" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleDelete(p.id, p.title, e)}
                              title={isEn ? 'Delete project folder' : 'Projektordner löschen'}
                              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {p.description && (
                            <p className="text-[11px] text-zinc-600 mt-2 line-clamp-2 leading-relaxed">
                              {p.description}
                            </p>
                          )}
                        </div>

                        {/* Project Statistics Pillbox */}
                        <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500">
                          <div className="flex items-center gap-2.5">
                            <span className="flex items-center gap-1 font-medium">
                              <Layers className="w-3 h-3 text-indigo-500" />
                              {p.windowCount} Windows
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <ImageIcon className="w-3 h-3 text-amber-500" />
                              {p.referencesCount} {isEn ? 'Ref.' : 'Ref.'}
                            </span>
                            <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <FileText className="w-2.5 h-2.5" />
                              Single-Line Prompts
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition">
                            <span>{isEn ? 'Load' : 'Laden'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVE CURRENT PROJECT */}
          {activeTab === 'saveCurrent' && (
            <div className="max-w-2xl mx-auto space-y-5 py-2">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4.5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Save className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? 'Create subfolder structure in /data/projects/' : 'Unterordner-Struktur in /data/projects/ anlegen'}</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {isEn
                    ? <>When saving, a dedicated project folder is created in <code>/data/projects/{'{project_name}'}/</code> containing:</>
                    : <>Beim Speichern wird ein eigener Projektordner in <code>/data/projects/{'{projektname}'}/</code> erstellt. Darin werden:</>}
                </p>
                <ul className="text-xs text-emerald-900 list-disc list-inside space-y-1 font-medium">
                  <li><code>project.json</code> {isEn ? 'with full screenplay state' : 'mit dem kompletten Drehbuchzustand'}</li>
                  <li><code>references/</code> {isEn ? 'with all reference images and catalog' : 'mit allen Referenzbildern und dem Katalog'}</li>
                  <li><code>prompts/windows_single_line.txt</code> ({isEn ? 'copy-ready 14s prompts' : 'kopierfertige 14-Sekunden Prompts'})</li>
                  <li><code>prompts/camera_director_plan.json</code> &amp; {isEn ? 'design concept' : 'Designkonzept'}</li>
                </ul>
              </div>

              <div className="space-y-3.5 bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    {isEn ? 'Project Title / Name of Building Project:' : 'Projekttitel / Name des Bauprojekts:'}
                  </label>
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder={isEn ? 'e.g. Model House Alpine Vista 2026' : 'z.B. Musterhaus Alpenblick 2026'}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                    {isEn ? 'Folder path:' : 'Ordnerpfad:'} /data/projects/{saveTitle.toLowerCase().replace(/[^a-z0-9_-]+/g, '_') || (isEn ? 'my_project' : 'mein_projekt')}/
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'Abbrechen'}
                  </button>
                  <button
                    type="button"
                    disabled={isSaving || !saveTitle.trim()}
                    onClick={handleSaveCurrent}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{isEn ? 'Saving to /data/projects/...' : 'Speichere in /data/projects/...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Save project folder on disk now' : 'Projektordner jetzt auf Festplatte anlegen'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CREATE NEW PROJECT */}
          {activeTab === 'new' && (
            <form onSubmit={handleCreateNewProject} className="max-w-2xl mx-auto space-y-4 py-2">
              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl space-y-3.5">
                <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-indigo-600" />
                  <span>{isEn ? 'Initialize New Project Folder' : 'Neuen Projektordner initialisieren'}</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    {isEn ? 'Project Name:' : 'Projektname:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder={isEn ? 'e.g. Bauhaus Villa Lichtental' : 'z.B. Bauhaus Villa Lichtental'}
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    {isEn ? 'Short Description (optional):' : 'Kurzbeschreibung (optional):'}
                  </label>
                  <textarea
                    rows={2}
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder={isEn ? 'e.g. Brand film & architectural teaser for discerning clients' : 'z.B. Imagefilm & Architektur-Teaser für exklusive Bauherren'}
                    className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    {isEn ? 'Back' : 'Zurück'}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !newProjectTitle.trim()}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? 'Create & Open Project' : 'Projekt anlegen & öffnen'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-zinc-700">
              {isEn ? 'Active Project:' : 'Aktives Projekt:'} <strong>{currentProjectName || (isEn ? 'Default' : 'Standard')}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {isEn ? 'Close' : 'Schließen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
