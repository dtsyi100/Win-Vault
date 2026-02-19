
import React from 'react';
import { Win, TeamPool, WinStatus } from '../types';
import { GlassCard } from './GlassCard';
import { OKR_COLORS, TEAM_COLORS, ICONS } from '../constants';

interface WinListProps {
  wins: Win[];
  filterTeam?: TeamPool;
  title: string;
  onEdit?: (win: Win) => void;
}

export const WinList: React.FC<WinListProps> = ({ wins, filterTeam, title, onEdit }) => {
  const filteredWins = filterTeam ? wins.filter(w => w.team === filterTeam) : wins;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h3 className="size-subtitle font-bold text-[var(--text-color)] flex items-center gap-4">
          {title}
          <span className="size-paragraph bg-blue-500/10 text-blue-600 px-5 py-1.5 rounded-full border border-blue-500/20">
            {filteredWins.length}
          </span>
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-10">
        {filteredWins.length === 0 ? (
          <div className="py-40 text-center border-4 border-dashed border-[var(--glass-border)] rounded-[2.5rem] opacity-30">
            <p className="size-subtitle font-bold mb-3">Vault Quiet</p>
            <p className="size-paragraph">No achievements recorded in this sector.</p>
          </div>
        ) : (
          filteredWins.map(win => (
            <GlassCard key={win.id} className="p-10 rounded-[2.5rem] group border-2 relative overflow-hidden shadow-sm hover:shadow-xl transition-all">
              {win.status === WinStatus.DRAFT && (
                <div className="absolute top-10 right-10 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-full size-paragraph font-black uppercase tracking-widest">
                  Draft
                </div>
              )}
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="size-paragraph font-black text-blue-600 uppercase tracking-[0.2em]">{win.team}</span>
                    <span className="w-1.5 h-1.5 bg-slate-500/30 rounded-full" />
                    <span className="size-paragraph font-bold text-slate-500">{new Date(win.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <h4 className="size-subtitle font-black text-[var(--text-color)] group-hover:text-blue-600 transition-colors leading-tight">
                    {win.title}
                  </h4>
                  
                  <p className="size-paragraph text-slate-500 line-clamp-3">
                    {win.description}
                  </p>

                  <div className="flex flex-wrap gap-6 items-center pt-4">
                    <div className="bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20 shadow-sm">
                      <p className="size-paragraph font-black text-emerald-600 uppercase tracking-widest">{win.impact}</p>
                    </div>
                    <div className="bg-blue-500/5 px-6 py-3 rounded-2xl border border-blue-500/10">
                      <p className="size-paragraph font-bold text-slate-500">{win.okrCategory}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-8 min-w-[140px]">
                  <div className="flex -space-x-4">
                    <img 
                      src={`https://picsum.photos/seed/${win.userId}/100/100`} 
                      className="w-16 h-16 rounded-2xl border-4 border-[var(--bg-color)] shadow-2xl" 
                      title={win.userName}
                    />
                    {win.collaborators.length > 0 && (
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 border-4 border-[var(--bg-color)] flex items-center justify-center size-subtitle font-black text-white shadow-2xl">
                        +{win.collaborators.length}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(win)}
                        className="p-6 rounded-2xl bg-slate-500/10 text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-90"
                        title="Quick Edit"
                      >
                        <ICONS.Edit />
                      </button>
                    )}
                    {win.artifacts.length > 0 && (
                      <a 
                        href={win.artifacts[0].url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-6 rounded-2xl bg-slate-500/10 text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-90"
                      >
                        <ICONS.Link />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
