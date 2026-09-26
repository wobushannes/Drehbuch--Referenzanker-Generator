import React, { useState, useMemo } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Film,
  FileCode,
  FileSpreadsheet,
  FileText,
  Sliders,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SingleLineWindow, DialogueLanguage } from '../../types';
import {
  generateEdlTimeline,
  generateFcpxmlTimeline,
  generateCsvExport,
  generateMarkdownScreenplay,
  downloadExportFile,
  TimelineExportOptions,
} from '../../utils/timelineExport';
import { Language } from '../../utils/i18n';

export type ExportFormat = 'edl' | 'fcpxml' | 'csv' | 'markdown' | 'txt';

interface TimelineExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  windows: SingleLineWindow[];
  projectTitle?: string;
  dialogueLanguage?: DialogueLanguage | string;
  genre?: string;
  aspectRatio?: string;
  targetAudienceName?: string;
  weather?: string;
  background?: string;
  language?: Language;
  onShowToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const TimelineExportModal: React.FC<TimelineExportModalProps> = ({
  isOpen,
  onClose,
  windows,
  projectTitle = 'Musterhaus Drehbuch',
  dialogueLanguage = 'German',
  genre = 'Architektur & Lifestyle',
  aspectRatio = '16:9',
  targetAudienceName,
  weather,
  background,
  language = 'DE',
  onShowToast,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('edl');
  const [fps, setFps] = useState<24 | 25 | 30>(24);
  const [copied, setCopied] = useState<boolean>(false);

  const exportOptions: TimelineExportOptions = useMemo(() => ({
    projectTitle: projectTitle || 'Musterhaus_Drehbuch',
    fps,
    dialogueLanguage,
    genre,
    aspectRatio,
    targetAudienceName,
    weather,
    background,
  }), [projectTitle, fps, dialogueLanguage, genre, aspectRatio, targetAudienceName, weather, background]);

  // Compute file content based on selected format
  const generatedContent = useMemo(() => {
    if (!windows || windows.length === 0) return '';
    switch (selectedFormat) {
      case 'edl':
        return generateEdlTimeline(windows, exportOptions);
      case 'fcpxml':
        return generateFcpxmlTimeline(windows, exportOptions);
      case 'csv':
        return generateCsvExport(windows, exportOptions);
      case 'markdown':
        return generateMarkdownScreenplay(windows, exportOptions);
      case 'txt':
        return windows.map((w) => w.singleLinePrompt).join('\n\n');
      default:
        return '';
    }
  }, [windows, selectedFormat, exportOptions]);

  if (!isOpen) return null;

  const totalDuration = windows.reduce((sum, w) => sum + (w.durationSeconds || 14), 0);

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onShowToast) {
      onShowToast('info', language === 'DE' ? 'In Zwischenablage kopiert!' : 'Copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    const safeTitle = (projectTitle || 'Drehbuch')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 32);

    let filename = `${safeTitle}_timeline`;
    let mimeType = 'text/plain;charset=utf-8';

    switch (selectedFormat) {
      case 'edl':
        filename += `_${fps}fps.edl`;
        mimeType = 'text/plain;charset=utf-8';
        break;
      case 'fcpxml':
        filename += `_${fps}fps.fcpxml`;
        mimeType = 'application/xml;charset=utf-8';
        break;
      case 'csv':
        filename += '.csv';
        mimeType = 'text/csv;charset=utf-8';
        break;
      case 'markdown':
        filename += '_drehbuch.md';
        mimeType = 'text/markdown;charset=utf-8';
        break;
      case 'txt':
        filename += '_single_line_prompts.txt';
        mimeType = 'text/plain;charset=utf-8';
        break;
    }

    downloadExportFile(generatedContent, filename, mimeType);
    if (onShowToast) {
      onShowToast('success', `${filename} ${language === 'DE' ? 'erfolgreich heruntergeladen!' : 'downloaded successfully!'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold shadow-xs">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                {language === 'DE' ? 'Timeline- & Schnitt-Export' : 'Timeline & Editing Export'}
              </h2>
              <p className="text-xs text-zinc-500">
                {language === 'DE'
                  ? `DaVinci Resolve, Premiere Pro, FCPXML, CSV & Markdown (${windows.length} Windows, ${totalDuration}s Gesamt)`
                  : `DaVinci Resolve, Premiere Pro, FCPXML, CSV & Markdown (${windows.length} Windows, ${totalDuration}s total)`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Format Selector Pills */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-2">
              {language === 'DE' ? '1. Export-Format wählen' : '1. Select Export Format'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Option 1: EDL */}
              <button
                type="button"
                onClick={() => setSelectedFormat('edl')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedFormat === 'edl'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Film className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    .EDL
                  </span>
                </div>
                <div className="text-xs font-bold">{language === 'DE' ? 'DaVinci / Premiere' : 'DaVinci / Premiere'}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{language === 'DE' ? 'CMX 3600 Timeline' : 'CMX 3600 Timeline'}</div>
              </button>

              {/* Option 2: FCPXML */}
              <button
                type="button"
                onClick={() => setSelectedFormat('fcpxml')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedFormat === 'fcpxml'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    .FCPXML
                  </span>
                </div>
                <div className="text-xs font-bold">Final Cut / Resolve</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{language === 'DE' ? 'Mit Marker-Notizen' : 'With Marker Notes'}</div>
              </button>

              {/* Option 3: CSV */}
              <button
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedFormat === 'csv'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    .CSV
                  </span>
                </div>
                <div className="text-xs font-bold">Excel / Sheets</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{language === 'DE' ? 'Tabelle mit UTF-8' : 'Table with UTF-8'}</div>
              </button>

              {/* Option 4: Markdown */}
              <button
                type="button"
                onClick={() => setSelectedFormat('markdown')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedFormat === 'markdown'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                    .MD
                  </span>
                </div>
                <div className="text-xs font-bold">{language === 'DE' ? 'Ablaufplan' : 'Schedule'}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{language === 'DE' ? 'Regie & Team' : 'Director & Crew'}</div>
              </button>

              {/* Option 5: TXT */}
              <button
                type="button"
                onClick={() => setSelectedFormat('txt')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedFormat === 'txt'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Sliders className="w-4 h-4 text-zinc-600" />
                  <span className="text-[10px] font-mono font-bold bg-zinc-200 text-zinc-800 px-1.5 py-0.5 rounded">
                    .TXT
                  </span>
                </div>
                <div className="text-xs font-bold">Single-Line</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{language === 'DE' ? '0 Zeilenumbrüche' : '0 Line breaks'}</div>
              </button>
            </div>
          </div>

          {/* Framerate Selection (Relevant for EDL and FCPXML) */}
          {(selectedFormat === 'edl' || selectedFormat === 'fcpxml') && (
            <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-zinc-800">
                  {language === 'DE' ? 'Timeline Framerate (FPS):' : 'Timeline Framerate (FPS):'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[24, 25, 30].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFps(rate as 24 | 25 | 30)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      fps === rate
                        ? 'bg-amber-500 border-amber-600 text-zinc-950'
                        : 'bg-white border-zinc-300 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {rate} fps {rate === 24 ? '(Cinema/KI)' : rate === 25 ? '(PAL)' : '(Web)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                {language === 'DE' ? '2. Live-Dateivorschau' : '2. Live File Preview'}
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {generatedContent.split('\n').length} {language === 'DE' ? 'Zeilen' : 'lines'} • {new Blob([generatedContent]).size} Bytes
              </span>
            </div>
            <div className="relative">
              <pre className="p-4 bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto overflow-x-auto whitespace-pre select-all">
                {generatedContent}
              </pre>
            </div>
          </div>

          {/* Practical Import Instructions */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
            <div className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>{language === 'DE' ? 'Kurzanleitung für DaVinci Resolve & Premiere Pro' : 'Quick Guide for DaVinci Resolve & Premiere Pro'}</span>
            </div>
            <p className="text-[11px] text-zinc-700 leading-relaxed">
              {selectedFormat === 'edl' || selectedFormat === 'fcpxml' ? (
                <>
                  <strong>DaVinci Resolve:</strong> Wählen Sie im Menü <code>Datei &gt; Importieren &gt; Timeline...</code> und wählen Sie diese Datei. Jeder 14s-Clip liegt sofort auf der Videospur, inklusive Timecode-Markern mit Dialogtext und Regieanweisungen.
                </>
              ) : selectedFormat === 'csv' ? (
                <>
                  <strong>Tabellenkalkulation:</strong> Die CSV enthält ein UTF-8-BOM und Semikolon-Trennzeichen. Lässt sich direkt doppelklicken und fehlerfrei in Microsoft Excel, Apple Numbers oder Google Sheets öffnen.
                </>
              ) : (
                <>
                  <strong>Ablauf & Prompts:</strong> Perfekt zur Übergabe an Regie, Kundenabstimmung oder zum schrittweisen Einfügen in MiniMax H3 / Maestro.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <div className="text-xs text-zinc-500">
            Format: <span className="font-mono font-bold text-zinc-800">.{selectedFormat}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'DE' ? 'Kopiert!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-600" />
                  <span>{language === 'DE' ? 'In Zwischenablage kopieren' : 'Copy to Clipboard'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {language === 'DE'
                  ? `Datei herunterladen (.${selectedFormat})`
                  : `Download File (.${selectedFormat})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
