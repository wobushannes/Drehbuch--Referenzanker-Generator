import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Tag,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCode,
  Sliders,
  X,
  RefreshCw,
} from 'lucide-react';
import { ReferenceImage, ReferenceCategory, PromptTemplate } from '../types';
import { Language, t } from '../utils/i18n';
import {
  loadPromptCatalog,
  savePromptCatalog,
  resetPromptCatalog,
  getPromptForCategory,
} from '../utils/promptCatalog';
import { DEMO_PRESET_REFERENCES } from '../utils/sampleData';

interface ReferenceManagerProps {
  references: ReferenceImage[];
  onUpdateReferences: (refs: ReferenceImage[]) => void;
  onRunSingleTask: (refId: string) => Promise<void>;
  onRunAllTasks: () => Promise<void>;
  isAnalyzingAny: boolean;
  activeProvider: string;
  onProceedToAnchors: () => void;
  language?: Language;
}

const getCategoryMeta = (cat: string, lang: string = 'DE') => {
  const isEn = lang === 'EN';
  const categoryKey = cat as ReferenceCategory;
  const meta: Record<ReferenceCategory, { label: string; icon: string; badgeColor: string; description: string }> = {
    person: {
      label: isEn ? 'Single Person' : 'Einzelperson',
      icon: '👤',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: isEn ? 'Facial shape, eyes, nose, mouth, hair, skin, build & age' : 'Gesichtsform, Augen, Nase, Mund, Haare, Teint, Statur & Alter',
    },
    multi_subject: {
      label: isEn ? 'Person with Pets / Companions' : 'Person mit Tieren / Begleitern (z.B. 2 Hunde)',
      icon: '🐕',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      description: isEn ? 'Strictly separates person, dog 1, dog 2 and spatial relations' : 'Trennt Person, Hund 1, Hund 2 und räumliche Relation strikt auf',
    },
    object: {
      label: isEn ? 'Item / Prop / Object' : 'Gegenstand / Prop / Requisite',
      icon: '🗡️',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: isEn ? 'Material, shape, surface, patina, wear & details' : 'Material, Form, Oberfläche, Patina, Abnutzung & Details',
    },
    vehicle: {
      label: isEn ? 'Vehicle / Machine / Tech' : 'Fahrzeug / Maschine / Tech',
      icon: '🚗',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      description: isEn ? 'Model, body, paint, rims, headlights & silhouette' : 'Modell, Karosserie, Lack, Felgen, Scheinwerfer & Silhouette',
    },
    environment: {
      label: isEn ? 'Location / Room / Set' : 'Location / Raum / Set',
      icon: '🏛️',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: isEn ? 'Architecture, walls, floor, lighting & atmosphere' : 'Architektur, Wände, Boden, Lichtquellen & Raumatmosphäre',
    },
    architecture: {
      label: isEn ? 'Prefab House / Visualization' : 'Fertighaus / Visualisierung',
      icon: '🏡',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      description: isEn ? 'Structure, facade, volume, roof & outdoor spaces' : 'Baukörper, Holz/Putz-Fassade, Kubatur, Dach & Außenanlagen',
    },
    floorplan: {
      label: isEn ? 'Apartment Floor Plan' : 'Wohnungs-Grundriss',
      icon: '📐',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
      description: isEn ? 'Room layout, zones, lighting axes & camera flight paths' : 'Raumaufteilung, Zonen, Flur- & Lichtachsen, Kameraflug-Pfade',
    },
    style: {
      label: isEn ? 'Style / Optics & Film Look' : 'Stil / Optik & Film-Look',
      icon: '🎬',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description: isEn ? 'Grain, color grading, contrast & lens characteristics' : 'Körnung, Color-Grading, Kontrast & Linsencharakteristik',
    },
  };
  return meta[categoryKey] || meta.person;
};

export const ReferenceManager: React.FC<ReferenceManagerProps> = ({
  references,
  onUpdateReferences,
  onRunSingleTask,
  onRunAllTasks,
  isAnalyzingAny,
  activeProvider = 'lmstudio',
  onProceedToAnchors,
  language = 'DE',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const catalogFileInputRef = useRef<HTMLInputElement>(null);
  const targetSlotRef = useRef<number | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [expandedPromptRefId, setExpandedPromptRefId] = useState<string | null>(null);

  // Catalog State (sourced from /src/data/prompts.ts)
  const [catalog, setCatalog] = useState<PromptTemplate[]>(() => loadPromptCatalog(language));
  const [catalogFilter, setCatalogFilter] = useState<ReferenceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedCatalogId, setCopiedCatalogId] = useState<string | null>(null);

  useEffect(() => {
    setCatalog(loadPromptCatalog(language));
  }, [language]);

  // New Custom Prompt Form State
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReferenceCategory>('person');
  const [newBadge, setNewBadge] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [newKeywords, setNewKeywords] = useState('');

  // File Upload Handlers
  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const newEntries: ReferenceImage[] = [];

    fileArray.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const category: ReferenceCategory = 'person';
        const assignedPrompt = getPromptForCategory(category);
        const nameClean = file.name.replace(/\.[^/.]+$/, '') || `Referenz ${references.length + idx + 1}`;

        if (targetSlotRef.current !== null && targetSlotRef.current < references.length) {
          const updated = [...references];
          updated[targetSlotRef.current] = {
            ...updated[targetSlotRef.current],
            dataUrl,
            mimeType: file.type || 'image/jpeg',
            taskStatus: 'idle',
            extractedAnchor: undefined,
          };
          onUpdateReferences(updated);
          targetSlotRef.current = null;
        } else {
          newEntries.push({
            id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: nameClean,
            category,
            dataUrl,
            mimeType: file.type || 'image/jpeg',
            assignedPrompt,
            taskStatus: 'idle',
          });

          if (newEntries.length === fileArray.length) {
            onUpdateReferences([...references, ...newEntries]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerUploadNew = () => {
    targetSlotRef.current = null;
    fileInputRef.current?.click();
  };

  const triggerUploadSlot = (idx: number) => {
    targetSlotRef.current = idx;
    fileInputRef.current?.click();
  };

  const handleRemove = (id: string) => {
    onUpdateReferences(references.filter((r) => r.id !== id));
  };

  const handleCategoryChange = (id: string, newCat: ReferenceCategory) => {
    const updated = references.map((r) => {
      if (r.id === id) {
        // Find matching prompt in loaded catalog
        const match = catalog.find((p) => p.category === newCat);
        const newPrompt = match ? match.prompt : getPromptForCategory(newCat);
        return {
          ...r,
          category: newCat,
          assignedPrompt: newPrompt,
          taskStatus: 'idle' as const,
        };
      }
      return r;
    });
    onUpdateReferences(updated);
  };

  const handleNameChange = (id: string, newName: string) => {
    const updated = references.map((r) => (r.id === id ? { ...r, name: newName } : r));
    onUpdateReferences(updated);
  };

  const handleCustomPromptChange = (id: string, newPrompt: string) => {
    const updated = references.map((r) => (r.id === id ? { ...r, assignedPrompt: newPrompt } : r));
    onUpdateReferences(updated);
  };

  const handleApplyCatalogPromptToRef = (refId: string, promptText: string) => {
    const updated = references.map((r) => (r.id === refId ? { ...r, assignedPrompt: promptText } : r));
    onUpdateReferences(updated);
    setExpandedPromptRefId(refId);
  };

  const handleCopyCatalogPrompt = (item: PromptTemplate) => {
    navigator.clipboard.writeText(item.prompt);
    setCopiedCatalogId(item.id);
    setTimeout(() => setCopiedCatalogId(null), 2000);
  };

  const handleLoadDemoPresets = () => {
    onUpdateReferences(DEMO_PRESET_REFERENCES);
  };

  const handleClearAll = () => {
    onUpdateReferences([]);
  };

  // Catalog Reload & Persistence Handlers
  const handleReloadDefaultCatalog = () => {
    const reloaded = resetPromptCatalog();
    setCatalog(reloaded);
    setCurrentPage(1);
  };

  const handleExportCatalogJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(catalog, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'drehbuch-prompts-katalog.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportCatalogJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          savePromptCatalog(parsed);
          setCatalog(parsed);
          setCurrentPage(1);
        }
      } catch (err) {
        alert('Ungültige JSON-Datei: Das Format entspricht nicht dem Prompt-Katalog.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCreateNewPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPromptText.trim()) return;

    const newTemplate: PromptTemplate = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      badge: newBadge.trim() || 'Benutzerdefiniert',
      description: newDescription.trim() || 'Eigene Prompt-Vorlage',
      keywords: newKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      prompt: newPromptText.trim(),
    };

    const updated = [newTemplate, ...catalog];
    savePromptCatalog(updated);
    setCatalog(updated);
    setIsCreatingPrompt(false);
    setNewTitle('');
    setNewBadge('');
    setNewDescription('');
    setNewPromptText('');
    setNewKeywords('');
    setCurrentPage(1);
  };

  // Filtering & Pagination Logic
  const filteredCatalog = catalog.filter((item) => {
    const matchesCat = catalogFilter === 'all' || item.category === catalogFilter;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.prompt.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const PAGE_SIZE = 6; // Exactly 6 items per page as requested
  const totalPages = Math.max(1, Math.ceil(filteredCatalog.length / PAGE_SIZE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * PAGE_SIZE;
  const paginatedCatalog = filteredCatalog.slice(startIndex, startIndex + PAGE_SIZE);

  const completedCount = references.filter((r) => r.taskStatus === 'completed').length;
  const runningCount = references.filter((r) => r.taskStatus === 'running').length;

  return (
    <div className="space-y-8">
      {/* Hidden Multi-file input for references */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Hidden file input for Catalog JSON import */}
      <input
        type="file"
        ref={catalogFileInputRef}
        onChange={handleImportCatalogJSON}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Hero / Workflow Header */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {language === 'EN' ? 'Step 1: References & Multi-Task Pipeline' : 'Schritt 1: Referenzen & Multi-Task Pipeline'}
            </span>
            <span className="text-[11px] font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
              {language === 'EN' ? 'Local LM Studio Engine (No Cloud)' : 'Lokale LM Studio Engine (Keine Cloud)'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            {language === 'EN' ? 'References Require Anchors • Task per Reference' : 'Referenzen verlangen Anker • Task je Referenz'}
          </h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {language === 'EN'
              ? 'Upload your reference images via drag & drop. Choose the appropriate category for each image (Single Person, Person with Companions, Prop, Vehicle, Location, Style). Each image is sent to your local LM Studio as a separate task.'
              : 'Lade deine Referenzbilder per Drag & Drop hoch. Wähle für jedes Bild die passende Kategorie (Einzelperson, Person mit 2 Hunden, Gegenstand, Fahrzeug oder Location). Jedes Bild wird als separater Task an dein lokales LM Studio geschickt.'}
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {references.length > 0 && (
            <button
              type="button"
              id="btn-run-all-tasks"
              onClick={onRunAllTasks}
              disabled={isAnalyzingAny || runningCount > 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {isAnalyzingAny ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'EN' ? 'Tasks running...' : 'Tasks laufen...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{language === 'EN' ? `Send All Tasks (${references.length})` : `Alle Tasks an LM Studio (${references.length})`}</span>
                </>
              )}
            </button>
          )}

          {completedCount > 0 && (
            <button
              type="button"
              onClick={onProceedToAnchors}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <span>{language === 'EN' ? `To Anchors (${completedCount})` : `Zu den Ankern (${completedCount})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {references.length === 0 && (
            <button
              type="button"
              onClick={handleLoadDemoPresets}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold border border-zinc-200 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'EN' ? 'Load Demo Data' : 'Demodaten laden'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={triggerUploadNew}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? 'border-zinc-900 bg-zinc-100/80 scale-[1.005]'
            : 'border-zinc-300 hover:border-zinc-500 bg-white shadow-xs'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shadow-xs">
          <Upload className="w-5 h-5 text-zinc-700" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-zinc-900">
            {language === 'EN' ? 'Drag & drop reference images here or click' : 'Referenzbilder hier hineinziehen oder klicken'}
          </p>
          <p className="text-xs text-zinc-500">
            {language === 'EN' ? 'Supports PNG, JPG, WebP. Multi-selection supported • Flexible category mapping.' : 'Unterstützt PNG, JPG, WebP. Mehrfachauswahl möglich • Kein starres Vorlagen-Korsett.'}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500 font-medium">
          <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">{language === 'EN' ? '👤 Person' : '👤 Einzelperson'}</span>
          <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">{language === 'EN' ? '🐕 Person + Pets' : '🐕 Person + 2 Hunde'}</span>
          <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">{language === 'EN' ? '🗡️ Props' : '🗡️ Props'}</span>
          <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">{language === 'EN' ? '🚗 Vehicles' : '🚗 Fahrzeuge'}</span>
          <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">{language === 'EN' ? '🏛️ Sets' : '🏛️ Sets'}</span>
        </div>
      </div>

      {/* References Grid / Cards Section */}
      {references.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900">
                {language === 'EN' ? `Loaded References (${references.length})` : `Geladene Referenzen (${references.length})`}
              </h3>
              <span className="text-xs text-zinc-500">
                {language === 'EN'
                  ? `(${completedCount} analyzed, ${runningCount} in progress)`
                  : `(${completedCount} analysiert, ${runningCount} in Bearbeitung)`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerUploadNew}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold border border-zinc-200 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'EN' ? 'Add Another Image' : 'Weiteres Bild hinzufügen'}</span>
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-zinc-500 hover:text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-50 transition cursor-pointer"
                title={language === 'EN' ? 'Clear all references' : 'Alle Referenzen entfernen'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'EN' ? 'Clear All' : 'Alle leeren'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {references.map((ref, index) => {
              const catConfig = getCategoryMeta(ref.category, language);
              const isTaskRunning = ref.taskStatus === 'running';
              const isTaskDone = ref.taskStatus === 'completed';
              const isTaskError = ref.taskStatus === 'error';
              const isExpanded = expandedPromptRefId === ref.id;

              return (
                <div
                  key={ref.id}
                  className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition flex flex-col justify-between ${
                    isTaskRunning
                      ? 'border-amber-400 ring-2 ring-amber-200'
                      : isTaskDone
                      ? 'border-emerald-300'
                      : isTaskError
                      ? 'border-rose-300'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {/* Top Header of Reference Card */}
                  <div className="p-4 pb-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={ref.name}
                          onChange={(e) => handleNameChange(ref.id, e.target.value)}
                          className="font-bold text-sm text-zinc-900 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none px-1"
                          placeholder={language === 'EN' ? 'Name / Title' : 'Name / Bezeichnung'}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(ref.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
                        title={language === 'EN' ? 'Delete reference' : 'Referenz löschen'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Image Preview with overlay slot changer */}
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 group">
                      <img
                        src={ref.dataUrl}
                        alt={ref.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {/* Status indicator on image */}
                      <div className="absolute top-2.5 left-2.5">
                        {isTaskDone && (
                          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{language === 'EN' ? 'Anchor extracted' : 'Anker extrahiert'}</span>
                          </span>
                        )}
                        {isTaskRunning && (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs animate-pulse">
                            <div className="w-2.5 h-2.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            <span>{language === 'EN' ? 'LM Studio analyzing...' : 'LM Studio analysiert...'}</span>
                          </span>
                        )}
                        {isTaskError && (
                          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                            <AlertCircle className="w-3 h-3" />
                            <span>{language === 'EN' ? 'Error' : 'Fehler'}</span>
                          </span>
                        )}
                        {!ref.taskStatus || ref.taskStatus === 'idle' ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-900/80 text-white backdrop-blur-xs">
                            {language === 'EN' ? 'Ready for Task' : 'Bereit für Task'}
                          </span>
                        ) : null}
                      </div>

                      {/* Hover action to replace image or trigger single task */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRunSingleTask(ref.id);
                          }}
                          disabled={isTaskRunning}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-zinc-950" />
                          <span>{language === 'EN' ? `⚡ Analyze Image #${index + 1}` : `⚡ Bild #${index + 1} per LM Studio analysieren`}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerUploadSlot(index);
                          }}
                          className="px-2.5 py-1 bg-white/90 hover:bg-white text-zinc-900 rounded-md text-[11px] font-semibold shadow-xs transition cursor-pointer"
                        >
                          {language === 'EN' ? 'Replace Image' : 'Bild ersetzen'}
                        </button>
                      </div>
                    </div>

                    {/* Extracted LM Studio Specification Datasheet Box */}
                    {isTaskDone && (
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-1.5">
                          <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{language === 'EN' ? 'Extracted LM Studio Datasheet:' : 'Extrahierte LM Studio Spezifikation:'}</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                            {ref.tag || `<Ref ${index + 1}>`}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                          {ref.hairOrMaterial && (
                            <div>
                              <span className="font-semibold text-emerald-900 block text-[10px] uppercase">
                                {ref.category === 'human' || ref.category === 'multi_subject' ? 'Haar / Frisur:' : 'Material / Textur:'}
                              </span>
                              <span className="text-zinc-800 font-medium truncate block" title={ref.hairOrMaterial}>
                                {ref.hairOrMaterial}
                              </span>
                            </div>
                          )}
                          {ref.eyesOrGlazing && (
                            <div>
                              <span className="font-semibold text-emerald-900 block text-[10px] uppercase">
                                {ref.category === 'human' || ref.category === 'multi_subject' ? 'Augenfarbe:' : 'Verglasung / Fenster:'}
                              </span>
                              <span className="text-zinc-800 font-medium truncate block" title={ref.eyesOrGlazing}>
                                {ref.eyesOrGlazing}
                              </span>
                            </div>
                          )}
                          {ref.clothingOrFinish && (
                            <div className="col-span-2">
                              <span className="font-semibold text-emerald-900 block text-[10px] uppercase">
                                {ref.category === 'human' || ref.category === 'multi_subject' ? 'Kleidung / Outfit:' : 'Oberfläche / Finish:'}
                              </span>
                              <span className="text-zinc-800 font-medium block leading-snug" title={ref.clothingOrFinish}>
                                {ref.clothingOrFinish}
                              </span>
                            </div>
                          )}
                          {ref.distinguishingMarks && (
                            <div className="col-span-2">
                              <span className="font-semibold text-emerald-900 block text-[10px] uppercase">
                                {language === 'EN' ? 'Distinguishing Features / Anchors:' : 'Besondere Merkmale / Anker:'}
                              </span>
                              <span className="text-zinc-800 font-medium block leading-snug" title={ref.distinguishingMarks}>
                                {ref.distinguishingMarks}
                              </span>
                            </div>
                          )}
                        </div>

                        {ref.extractedAnchor?.compactPromptAnchor && (
                          <div className="pt-1 border-t border-emerald-200/50">
                            <span className="text-[9px] font-bold text-emerald-900 uppercase block tracking-wider">
                              {language === 'EN' ? 'Maestro 2.1.6 Compact Prompt Anchor:' : 'Maestro 2.1.6 Kompakter Prompt-Anker:'}
                            </span>
                            <p className="text-[10px] font-mono text-emerald-950 bg-white/90 p-1.5 rounded border border-emerald-200 leading-tight">
                              {ref.extractedAnchor.compactPromptAnchor}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Category Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                        <span>{language === 'EN' ? 'Reference Category:' : 'Referenz-Kategorie:'}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border ${catConfig.badgeColor}`}>
                          {catConfig.icon} {catConfig.label}
                        </span>
                      </label>
                      <select
                        value={ref.category}
                        onChange={(e) => handleCategoryChange(ref.id, e.target.value as ReferenceCategory)}
                        className="w-full text-xs font-semibold bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1.5 text-zinc-900 focus:outline-none focus:border-zinc-900 cursor-pointer"
                      >
                        <option value="person">👤 {language === 'EN' ? 'Single Person (Physiognomy & Features)' : 'Einzelperson (Physiognomie & Merkmale)'}</option>
                        <option value="multi_subject">🐕 {language === 'EN' ? 'Person with Companions (e.g., 2 dogs)' : 'Person mit Begleitern (z.B. 2 Hunde)'}</option>
                        <option value="object">🗡️ {language === 'EN' ? 'Item / Prop / Object' : 'Gegenstand / Prop / Requisite'}</option>
                        <option value="vehicle">🚗 {language === 'EN' ? 'Vehicle / Machine / Tech' : 'Fahrzeug / Maschine / Tech'}</option>
                        <option value="environment">🏛️ {language === 'EN' ? 'Location / Room / Set' : 'Location / Raum / Set'}</option>
                        <option value="architecture">🏡 {language === 'EN' ? 'Prefab House / Visualization' : 'Fertighaus / Visualisierung'}</option>
                        <option value="floorplan">📐 {language === 'EN' ? 'Floor Plan' : 'Wohnungs-Grundriss'}</option>
                        <option value="style">🎬 {language === 'EN' ? 'Style / Optics & Film Look' : 'Stil / Optik & Film-Look'}</option>
                      </select>
                      <p className="text-[11px] text-zinc-500 leading-tight">
                        {catConfig.description}
                      </p>

                      {/* Task trigger button (EXPLICIT SINGLE-IMAGE ANALYSIS) */}
                      <div className="pt-2">
                        <button
                          type="button"
                          id={`btn-single-task-${ref.id}`}
                          onClick={() => onRunSingleTask(ref.id)}
                          disabled={isTaskRunning}
                          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50 border border-zinc-700"
                        >
                          {isTaskRunning ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                              <span className="text-amber-300">{language === 'EN' ? `Analyzing Image #${index + 1}...` : `Analysiere Einzelbild #${index + 1}...`}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span>
                                {isTaskDone
                                  ? (language === 'EN' ? `⚡ Re-Analyze Single Image #${index + 1}` : `⚡ Einzelbild #${index + 1} erneut analysieren`)
                                  : (language === 'EN' ? `⚡ Analyze Single Image #${index + 1}` : `⚡ Einzelbild #${index + 1} per LM Studio analysieren`)}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Accordion: Assigned Prompt for this Reference */}
                  <div className="border-t border-zinc-200 bg-zinc-50/50">
                    <button
                      type="button"
                      onClick={() => setExpandedPromptRefId(isExpanded ? null : ref.id)}
                      className="w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/50 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'EN' ? 'Customize prompt for this image' : 'Prompt für dieses Bild anpassen'}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-1 space-y-2.5">
                        <textarea
                          rows={6}
                          value={ref.assignedPrompt}
                          onChange={(e) => handleCustomPromptChange(ref.id, e.target.value)}
                          className="w-full p-2.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800 font-mono leading-relaxed focus:outline-none focus:border-zinc-900"
                          placeholder={language === 'EN' ? 'Prompt for this reference image...' : 'Prompt für dieses Referenzbild...'}
                        />
                        <div className="flex items-center justify-between text-[11px] text-zinc-500">
                          <span>{language === 'EN' ? 'Sent as inference task to LM Studio.' : 'Wird als Inferenz-Task an LM Studio übermittelt.'}</span>
                          <button
                            type="button"
                            onClick={() => handleCategoryChange(ref.id, ref.category)}
                            className="text-zinc-600 hover:text-zinc-900 font-medium underline cursor-pointer"
                          >
                            {language === 'EN' ? 'Reset to catalog default' : 'Auf Katalog-Standard'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROMPT CATALOG SECTION WITH SEARCH, PAGINATION (6 / PAGE) & DATA STORAGE */}
      {/* ========================================================================= */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Top title and catalog data controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-amber-600" />
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                {language === 'EN' ? 'Prompt Catalog (Data Directory Storage)' : 'Prompt-Katalog (Ausgelagert in data-Ordner)'}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                {language === 'EN' ? `${filteredCatalog.length} templates available` : `${filteredCatalog.length} Vorlagen verfügbar`}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'EN'
                ? 'Structured prompt templates for single individuals, companions (person with dogs), props, vehicles, locations & visual styles.'
                : 'Strukturierte Prompt-Vorlagen für Einzelpersonen, Begleiter (Person mit 2 Hunden), Requisiten, Fahrzeuge, Locations & Optik.'}
            </p>
          </div>

          {/* Action buttons: Reload, Import, Export, Add New */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleReloadDefaultCatalog}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium border border-zinc-200 transition cursor-pointer"
              title={language === 'EN' ? 'Reload / Reset catalog from data directory' : 'Katalog aus dem data-Ordner neu laden / zurücksetzen'}
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              <span>{language === 'EN' ? 'Reload' : 'Neu laden'}</span>
            </button>

            <button
              type="button"
              onClick={() => catalogFileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium border border-zinc-200 transition cursor-pointer"
              title={language === 'EN' ? 'Import prompts from a JSON file' : 'Prompts aus einer JSON-Datei importieren'}
            >
              <FileCode className="w-3.5 h-3.5 text-zinc-500" />
              <span>{language === 'EN' ? 'Import JSON' : 'JSON Importieren'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCatalogJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium border border-zinc-200 transition cursor-pointer"
              title={language === 'EN' ? 'Export catalog as JSON' : 'Katalog als JSON exportieren'}
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>{language === 'EN' ? 'Export' : 'Exportieren'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreatingPrompt(!isCreatingPrompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'EN' ? 'Create Custom Prompt' : 'Eigenen Prompt anlegen'}</span>
            </button>
          </div>
        </div>

        {/* Modal / Inline Expandable Form for creating a new custom prompt */}
        {isCreatingPrompt && (
          <form
            onSubmit={handleCreateNewPrompt}
            className="p-5 bg-zinc-50 rounded-xl border border-zinc-300 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900">
                {language === 'EN'
                  ? 'Save new prompt in catalog (persisted in data directory)'
                  : 'Neuen Prompt im Katalog speichern (Wird im data-Ordner persistent hinterlegt)'}
              </h4>
              <button
                type="button"
                onClick={() => setIsCreatingPrompt(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">{language === 'EN' ? 'Title' : 'Titel'}</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === 'EN' ? 'e.g. Person with 2 Dogs (Close-up)' : 'z.B. Person mit 2 Hunden (Nahaufnahme)'}
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">{language === 'EN' ? 'Category' : 'Kategorie'}</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ReferenceCategory)}
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="person">👤 {language === 'EN' ? 'Single Person' : 'Einzelperson'}</option>
                  <option value="multi_subject">🐕 {language === 'EN' ? 'Person with Dogs' : 'Person mit 2 Hunden'}</option>
                  <option value="object">🗡️ {language === 'EN' ? 'Prop / Object' : 'Gegenstand / Prop'}</option>
                  <option value="vehicle">🚗 {language === 'EN' ? 'Vehicle' : 'Fahrzeug'}</option>
                  <option value="environment">🏛️ {language === 'EN' ? 'Location / Set' : 'Location / Set'}</option>
                  <option value="style">🎬 {language === 'EN' ? 'Style / Look' : 'Stil / Look'}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">{language === 'EN' ? 'Badge Label' : 'Badge-Bezeichnung'}</label>
                <input
                  type="text"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder={language === 'EN' ? 'e.g. Dog Duo' : 'z.B. Hunde-Duo'}
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="font-semibold text-zinc-700 block">{language === 'EN' ? 'Short Description' : 'Kurzbeschreibung'}</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder={language === 'EN' ? 'Brief summary of use case...' : 'Kurze Zusammenfassung des Verwendungszwecks...'}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="text-xs space-y-1">
              <label className="font-semibold text-zinc-700 block">{language === 'EN' ? 'Keywords (comma separated)' : 'Schlüsselwörter (kommagetrennt)'}</label>
              <input
                type="text"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                placeholder={language === 'EN' ? 'e.g. dog, shepherd, breed, leash, coat color' : 'z.B. Hund, Schäferhund, Rasse, Leine, Fellfarbe'}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="text-xs space-y-1">
              <label className="font-semibold text-zinc-700 block">{language === 'EN' ? 'Full Prompt Text' : 'Vollständiger Prompt-Text'}</label>
              <textarea
                required
                rows={5}
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                placeholder={language === 'EN' ? 'Analyze this reference image...' : 'Analysiere dieses Referenzbild...'}
                className="w-full p-3 bg-white border border-zinc-300 rounded-lg font-mono text-xs text-zinc-900 leading-relaxed focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingPrompt(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                {language === 'EN' ? 'Cancel' : 'Abbrechen'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                {language === 'EN' ? 'Save to Catalog' : 'Im Katalog speichern'}
              </button>
            </div>
          </form>
        )}

        {/* Search Bar & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Real-time Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
              placeholder={language === 'EN' ? 'Search catalog (title, keyword, features)...' : 'Prompt-Katalog durchsuchen (Titel, Stichwort, Merkmale)...'}
              className="w-full pl-9 pr-8 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setCatalogFilter('all');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                catalogFilter === 'all'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {language === 'EN' ? `All (${catalog.length})` : `Alle (${catalog.length})`}
            </button>
            <button
              type="button"
              onClick={() => {
                setCatalogFilter('person');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                catalogFilter === 'person'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              👤 {language === 'EN' ? 'Person' : 'Person'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCatalogFilter('multi_subject');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                catalogFilter === 'multi_subject'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🐕 {language === 'EN' ? 'Person + Dogs' : 'Person + 2 Hunde'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCatalogFilter('object');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                catalogFilter === 'object'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🗡️ {language === 'EN' ? 'Prop' : 'Requisite'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCatalogFilter('vehicle');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                catalogFilter === 'vehicle'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🚗 {language === 'EN' ? 'Vehicle' : 'Fahrzeug'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCatalogFilter('environment');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                catalogFilter === 'environment'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🏛️ {language === 'EN' ? 'Location' : 'Location'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCatalogFilter('style');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                catalogFilter === 'style'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🎬 {language === 'EN' ? 'Look' : 'Look'}
            </button>
          </div>
        </div>

        {/* Catalog Items Grid (Paginated to 6 results per page) */}
        {paginatedCatalog.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
            <Search className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-800">
              {language === 'EN' ? 'No prompts found for this filter' : 'Keine Prompts für diesen Filter gefunden'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {language === 'EN' ? 'Try a different search term or reset the category filter.' : 'Versuche einen anderen Suchbegriff oder setze den Kategoriefilter zurück.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCatalog.map((item) => {
              const isCopied = copiedCatalogId === item.id;
              return (
                <div
                  key={item.id}
                  className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                        {item.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCatalogPrompt(item)}
                        className="p-1 text-zinc-400 hover:text-zinc-800 rounded transition cursor-pointer"
                        title={language === 'EN' ? 'Copy to clipboard' : 'In Zwischenablage kopieren'}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 leading-snug">{item.title}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">{item.description}</p>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.keywords.slice(0, 5).map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-white text-zinc-600 border border-zinc-200 px-1.5 py-0.5 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                      {item.keywords.length > 5 && (
                        <span className="text-[10px] text-zinc-400 self-center">
                          +{item.keywords.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prompt Preview Snippet & Assignment Selector */}
                  <div className="space-y-2 pt-2 border-t border-zinc-200">
                    <pre className="text-[11px] font-mono text-zinc-700 bg-white p-2.5 rounded-lg border border-zinc-200 max-h-24 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {item.prompt}
                    </pre>

                    {references.length > 0 && (
                      <div className="flex items-center gap-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleApplyCatalogPromptToRef(e.target.value, item.prompt);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                          className="w-full text-xs font-semibold bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-xs"
                        >
                          <option value="" disabled>
                            {language === 'EN' ? 'Apply to reference image...' : 'Auf Referenzbild anwenden...'}
                          </option>
                          {references.map((r, i) => (
                            <option key={r.id} value={r.id}>
                              #{i + 1} {r.name} ({getCategoryMeta(r.category, language).label})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls (6 Results per page) */}
        {filteredCatalog.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-200 text-xs">
            <div className="text-zinc-500 font-medium">
              {language === 'EN' ? (
                <>
                  Showing <span className="text-zinc-900 font-semibold">{startIndex + 1}</span>–
                  <span className="text-zinc-900 font-semibold">
                    {Math.min(startIndex + PAGE_SIZE, filteredCatalog.length)}
                  </span>{' '}
                  of <span className="text-zinc-900 font-semibold">{filteredCatalog.length}</span> templates (6 per page)
                </>
              ) : (
                <>
                  Zeige <span className="text-zinc-900 font-semibold">{startIndex + 1}</span>–
                  <span className="text-zinc-900 font-semibold">
                    {Math.min(startIndex + PAGE_SIZE, filteredCatalog.length)}
                  </span>{' '}
                  von <span className="text-zinc-900 font-semibold">{filteredCatalog.length}</span> Vorlagen (6 je Seite)
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validPage <= 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-700 font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{language === 'EN' ? 'Previous' : 'Zurück'}</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                      validPage === pageNum
                        ? 'bg-zinc-900 text-white'
                        : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validPage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-700 font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <span>{language === 'EN' ? 'Next' : 'Weiter'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
