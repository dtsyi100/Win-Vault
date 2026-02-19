
import React, { useState, useCallback, useRef } from 'react';
import { OKRCategory, Win, WinStatus, User } from '../types';
import { USERS, ICONS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface WinFormProps {
  currentUser: User;
  initialWin?: Win;
  onSave: (win: Partial<Win>) => void;
  onClose: () => void;
}

type FieldType = 'title' | 'description' | 'impact';

export const WinForm: React.FC<WinFormProps> = ({ currentUser, initialWin, onSave, onClose }) => {
  const [title, setTitle] = useState(initialWin?.title || '');
  const [description, setDescription] = useState(initialWin?.description || '');
  const [impact, setImpact] = useState(initialWin?.impact || '');
  const [okr, setOkr] = useState<OKRCategory>(initialWin?.okrCategory || OKRCategory.GROWTH);
  const [collaborators, setCollaborators] = useState<string[]>(initialWin?.collaborators || []);
  const [artifactUrl, setArtifactUrl] = useState(initialWin?.artifacts?.[0]?.url || '');

  // AI & Speech States
  const [isListening, setIsListening] = useState<Record<FieldType, boolean>>({ title: false, description: false, impact: false });
  const [isRefining, setIsRefining] = useState<Record<FieldType, boolean>>({ title: false, description: false, impact: false });
  const [previousValues, setPreviousValues] = useState<Record<FieldType, string | null>>({ title: null, description: null, impact: null });

  const aiRef = useRef<GoogleGenAI | null>(null);

  const getAI = () => {
    if (!aiRef.current) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    }
    return aiRef.current;
  };

  const handleRefine = async (field: FieldType, currentVal: string) => {
    if (!currentVal || isRefining[field]) return;
    
    setIsRefining(prev => ({ ...prev, [field]: true }));
    const ai = getAI();

    const prompts: Record<FieldType, string> = {
      title: "Refine this project title to be more professional, punchy, and clear for a corporate achievement vault. Keep it short.",
      impact: "Refine this impact statement to be more quantitative, achievement-oriented, and impactful.",
      description: "Refine this project description to be professional, detailed yet concise, highlighting the strategic execution and value delivered."
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${prompts[field]}\n\nInput: ${currentVal}`,
        config: { temperature: 0.7 }
      });

      const refined = response.text?.trim();
      if (refined) {
        setPreviousValues(prev => ({ ...prev, [field]: currentVal }));
        if (field === 'title') setTitle(refined);
        if (field === 'description') setDescription(refined);
        if (field === 'impact') setImpact(refined);
      }
    } catch (error) {
      console.error("Refinement failed:", error);
    } finally {
      setIsRefining(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleRevert = (field: FieldType) => {
    const prev = previousValues[field];
    if (prev === null) return;
    
    if (field === 'title') setTitle(prev);
    if (field === 'description') setDescription(prev);
    if (field === 'impact') setImpact(prev);
    setPreviousValues(prevVal => ({ ...prevVal, [field]: null }));
  };

  const startSpeechToText = async (field: FieldType) => {
    if (isListening[field]) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Try to secure microphone permission first if mediaDevices is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close the stream immediately as SpeechRecognition will manage its own connection
        stream.getTracks().forEach(track => track.stop());
      } catch (e: any) {
        console.warn("Microphone permission check failed or denied:", e);
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          alert("Microphone access was denied. Please check your browser's site permissions.");
          return;
        }
        // If it's just 'NotSupported' or similar, we'll still try to proceed with SpeechRecognition
      }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(prev => ({ ...prev, [field]: true }));

    recognition.onstart = () => {
      console.log(`Recognition started for ${field}`);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (field === 'title') setTitle(prev => (prev ? prev + ' ' : '') + transcript);
      if (field === 'description') setDescription(prev => (prev ? prev + ' ' : '') + transcript);
      if (field === 'impact') setImpact(prev => (prev ? prev + ' ' : '') + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error(`Speech recognition error for ${field}:`, event.error);
      if (event.error === 'audio-capture') {
        alert("Microphone capture failed. Please ensure no other app is using the mic and that you have granted permission in browser settings.");
      } else if (event.error === 'not-allowed') {
        alert("Microphone access was denied. Please check your browser's site permissions.");
      } else if (event.error === 'network') {
        alert("Network error occurred during speech recognition. Please check your connection.");
      }
      setIsListening(prev => ({ ...prev, [field]: false }));
    };

    recognition.onend = () => {
      setIsListening(prev => ({ ...prev, [field]: false }));
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setIsListening(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = (status: WinStatus) => {
    if (!title) return;
    onSave({
      id: initialWin?.id,
      title,
      description,
      impact,
      okrCategory: okr,
      collaborators,
      team: initialWin?.team || currentUser.team,
      status,
      artifacts: artifactUrl ? [{ name: 'Artifact', url: artifactUrl }] : [],
      createdAt: initialWin?.createdAt || new Date().toISOString(),
      month: initialWin?.month || new Date().toISOString().slice(0, 7),
    });
    onClose();
  };

  const InputActions = ({ field, value }: { field: FieldType, value: string }) => (
    <div className="flex items-center gap-2 mt-2">
      <button 
        type="button"
        onClick={() => startSpeechToText(field)}
        className={`p-3 rounded-xl molten-glass transition-all hover:text-blue-500 border border-[var(--glass-border)] ${isListening[field] ? 'text-red-500 animate-pulse border-red-500/50 bg-red-500/5' : 'text-slate-500'}`}
        title="Speak to enter text"
      >
        <ICONS.Mic />
      </button>
      <button 
        type="button"
        onClick={() => handleRefine(field, value)}
        disabled={!value || isRefining[field]}
        className={`p-3 rounded-xl molten-glass transition-all border border-[var(--glass-border)] ${isRefining[field] ? 'text-purple-500 animate-spin' : 'text-slate-500 hover:text-purple-500 disabled:opacity-30'}`}
        title="Refine with AI"
      >
        <ICONS.Wand />
      </button>
      {previousValues[field] !== null && (
        <button 
          type="button"
          onClick={() => handleRevert(field)}
          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 transition-all border border-[var(--glass-border)]"
        >
          Revert
        </button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-3xl">
      <div 
        className="w-[95vw] h-[95vh] molten-glass-opaque rounded-3xl shadow-2xl flex flex-col relative animate-in zoom-in duration-300 border border-[var(--glass-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-10 right-10 p-5 rounded-2xl bg-slate-500/10 hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-all z-50 border border-[var(--glass-border)]"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto p-12 lg:p-24">
          <div className="max-w-6xl mx-auto space-y-20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="size-heading font-black text-[var(--text-color)] mb-6">
                  {initialWin ? 'Edit Achievement' : 'Archive Achievement'}
                </h2>
                <p className="size-subtitle text-slate-500">Provide a structured log of the team's strategic output.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="size-subtitle font-bold text-slate-500 block">Achievement Label</label>
                  </div>
                  <div className="relative group">
                    <input 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Briefly name the win..."
                      className="w-full bg-transparent border-b-4 border-[var(--glass-border)] py-6 size-subtitle font-bold text-[var(--text-color)] focus:border-blue-500 outline-none transition-all placeholder:opacity-20"
                    />
                    <InputActions field="title" value={title} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="size-subtitle font-bold text-slate-500 block">Metric Impact</label>
                  <div className="relative group">
                    <input 
                      value={impact}
                      onChange={e => setImpact(e.target.value)}
                      placeholder="e.g. +$2M Revenue Opportunity"
                      className="w-full bg-transparent border-b-4 border-[var(--glass-border)] py-6 size-subtitle font-bold text-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:opacity-20"
                    />
                    <InputActions field="impact" value={impact} />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="size-subtitle font-bold text-slate-500 block">OKR Alignment</label>
                  <div className="flex flex-wrap gap-4">
                    {Object.values(OKRCategory).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setOkr(cat)}
                        className={`px-8 py-4 rounded-2xl size-paragraph font-bold border-2 transition-all ${okr === cat ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-500/5 border-transparent text-slate-500'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="space-y-4">
                  <label className="size-subtitle font-bold text-slate-500 block">Full Description</label>
                  <div className="relative group">
                    <textarea 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Detail the context and execution..."
                      rows={6}
                      className="w-full bg-slate-500/5 border-2 border-transparent rounded-3xl p-8 size-paragraph text-[var(--text-color)] focus:border-purple-500 focus:bg-transparent outline-none transition-all resize-none"
                    />
                    <InputActions field="description" value={description} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="size-subtitle font-bold text-slate-500 block">Collaborators</label>
                  <div className="grid grid-cols-2 gap-4">
                    {USERS.filter(u => u.id !== currentUser.id).map(user => (
                      <button
                        key={user.id}
                        onClick={() => setCollaborators(prev => prev.includes(user.name) ? prev.filter(n => n !== user.name) : [...prev, user.name])}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${collaborators.includes(user.name) ? 'bg-purple-500/20 border-purple-500 text-[var(--text-color)]' : 'bg-slate-500/5 border-transparent text-slate-500'}`}
                      >
                        <img src={user.avatar} className="w-12 h-12 rounded-xl" alt="" />
                        <span className="size-paragraph font-bold">{user.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 lg:px-24 border-t border-[var(--glass-border)] bg-slate-500/5 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={currentUser.avatar} className="w-16 h-16 rounded-2xl shadow-xl" alt="" />
            <div>
              <p className="size-paragraph text-slate-500 font-bold uppercase tracking-widest">Lead Member</p>
              <p className="size-subtitle font-bold text-[var(--text-color)]">{currentUser.name} ({currentUser.team})</p>
            </div>
          </div>
          <div className="flex gap-6 w-full md:w-auto">
            <button 
              onClick={() => handleSubmit(WinStatus.DRAFT)}
              className="flex-1 md:px-12 py-6 rounded-2xl bg-slate-500/10 size-subtitle font-bold text-slate-500 transition-all active:scale-95 border border-[var(--glass-border)] hover:bg-slate-500/20"
            >
              {initialWin ? 'Keep as Draft' : 'Save as Draft'}
            </button>
            <button 
              onClick={() => handleSubmit(WinStatus.SUBMITTED)}
              className="flex-[2] md:px-20 py-6 rounded-2xl bg-blue-600 text-white size-subtitle font-bold shadow-2xl shadow-blue-500/30 transition-all hover:bg-blue-500 active:scale-95"
            >
              {initialWin ? 'Update Achievement' : 'Finalize Win'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
