
import React, { useEffect, useState } from 'react';
import { Win, OKRCategory } from '../types';
import { generateMonthlyInsight } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface WrappedViewProps {
  wins: Win[];
  month: string;
  onClose: () => void;
}

export const WrappedView: React.FC<WrappedViewProps> = ({ wins, month, onClose }) => {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  const monthName = new Date(month + '-01').toLocaleDateString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const data = await generateMonthlyInsight(wins, monthName);
        setInsight(data);
      } catch (e) {
        setInsight({
          monthTitle: "Peak Strategic Flow",
          teamInsight: "Exceptional output across Team 1 and Team 2.",
          topStrengths: ["Agility", "Efficiency", "Growth"]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, [wins, monthName]);

  if (loading) return (
    <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center p-12">
      <div className="w-80 h-2 bg-white/10 rounded-full overflow-hidden mb-12">
        <div className="h-full bg-blue-500 animate-pulse w-full" />
      </div>
      <h2 className="size-heading text-white font-black animate-pulse uppercase tracking-tighter">Syncing {monthName}</h2>
    </div>
  );

  const okrData = Object.values(OKRCategory).map(cat => ({
    name: cat,
    count: wins.filter(w => w.okrCategory === cat).length
  })).filter(d => d.count > 0);

  const renderContent = () => {
    switch(step) {
      case 0: return (
        <div className="text-center space-y-12 animate-in zoom-in duration-500">
          <p className="size-subtitle font-bold text-blue-400 uppercase tracking-widest">{monthName}</p>
          <h1 className="size-heading text-white font-black uppercase leading-none scale-150">Vault<br/>Wrapped</h1>
          <p className="size-subtitle text-slate-400 max-w-xl mx-auto">{wins.length} Major Successes Archived</p>
        </div>
      );
      case 1: return (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-24 items-center animate-in slide-in-from-right">
          <div className="space-y-12">
            <h2 className="size-heading text-white font-black uppercase">Strategic<br/>Focus</h2>
            <div className="space-y-8">
              {okrData.map(d => (
                <div key={d.name} className="space-y-4">
                  <div className="flex justify-between size-subtitle font-bold text-slate-400 uppercase">
                    <span>{d.name}</span>
                    <span>{d.count} wins</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{width: `${(d.count / wins.length) * 100}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[500px] bg-white/5 rounded-3xl p-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={okrData}>
                <XAxis dataKey="name" hide />
                <Bar dataKey="count" fill="#3b82f6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
      case 2: return (
        <div className="text-center space-y-16 animate-in slide-in-from-bottom">
          <h2 className="size-heading text-white font-black uppercase leading-none">{insight.monthTitle}</h2>
          <div className="bg-white/5 p-16 rounded-[4rem] border-4 border-white/10 max-w-4xl mx-auto shadow-2xl">
            <p className="size-heading italic text-slate-200 mb-16 leading-relaxed">"{insight.teamInsight}"</p>
            <div className="flex flex-wrap justify-center gap-6">
              {insight.topStrengths.map((s: string) => (
                <span key={s} className="px-10 py-5 bg-blue-500/10 border-2 border-blue-500/20 rounded-full size-subtitle font-bold text-blue-400">{s}</span>
              ))}
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
      <button onClick={onClose} className="absolute top-12 right-12 p-6 rounded-full bg-white/5 text-slate-500 hover:text-white z-50">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="relative z-10 w-full h-full flex items-center justify-center px-12 pb-48">
        {renderContent()}
      </div>

      <div className="absolute bottom-20 flex flex-col items-center gap-12 w-full max-w-md">
        <div className="flex gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'w-16 bg-blue-500' : 'w-4 bg-white/10'}`} />
          ))}
        </div>
        <div className="flex gap-6 w-full">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-6 rounded-3xl bg-white/5 size-subtitle font-bold text-white uppercase tracking-widest border border-white/10">Back</button>
          )}
          {step < 2 ? (
            <button onClick={() => setStep(s => s + 1)} className="flex-[2] py-6 rounded-3xl bg-blue-600 size-subtitle font-bold text-white uppercase tracking-widest shadow-2xl shadow-blue-600/20">Next</button>
          ) : (
            <button onClick={onClose} className="flex-[2] py-6 rounded-3xl bg-white size-subtitle font-bold text-black uppercase tracking-widest">Vaulted</button>
          )}
        </div>
      </div>
    </div>
  );
};
