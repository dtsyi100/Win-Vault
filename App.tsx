
import React, { useState, useEffect, useMemo } from 'react';
import { User, Win, TeamPool, WinStatus } from './types';
import { USERS, ICONS } from './constants';
import { GlassCard } from './components/GlassCard';
import { WinForm } from './components/WinForm';
import { WinList } from './components/WinList';
import { WrappedView } from './components/WrappedView';

const App: React.FC = () => {
  // SESSION PERSISTENCE: Save and restore the current user from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUserId = localStorage.getItem('win-vault-session-user');
    return USERS.find(u => u.id === savedUserId) || null;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('vault-theme') as 'dark' | 'light') || 'dark';
  });
  
  const [wins, setWins] = useState<Win[]>(() => {
    const saved = localStorage.getItem('win-vault-data');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse vault data", e);
      return [];
    }
  });

  const [lastSync, setLastSync] = useState<string>(() => new Date().toLocaleTimeString());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWin, setEditingWin] = useState<Win | null>(null);
  const [isWrappedOpen, setIsWrappedOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'team1' | 'team2'>('all');
  const [personalFilter, setPersonalFilter] = useState<'all' | 'mine'>('all');

  // Sync wins to localStorage on every change
  useEffect(() => {
    localStorage.setItem('win-vault-data', JSON.stringify(wins));
    setLastSync(new Date().toLocaleTimeString());
  }, [wins]);

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('win-vault-session-user', currentUser.id);
    } else {
      localStorage.removeItem('win-vault-session-user');
    }
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('vault-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSaveWin = (winData: Partial<Win>) => {
    if (!currentUser) return;
    
    if (winData.id) {
      setWins(prev => prev.map(w => w.id === winData.id ? { ...w, ...winData } as Win : w));
    } else {
      const newWin: Win = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        userName: currentUser.name,
        ...winData as Win
      };
      setWins(prev => [newWin, ...prev]);
    }
    setEditingWin(null);
  };

  const handleEditRequest = (win: Win) => {
    setEditingWin(win);
    setIsFormOpen(true);
  };

  const filteredWins = useMemo(() => {
    let list = wins;

    if (personalFilter === 'mine' && currentUser) {
      list = list.filter(w => w.userId === currentUser.id || w.collaborators.includes(currentUser.name));
    } else {
      // VISIBILITY FIX: Always show user's own drafts even in the team feed so it doesn't look like they disappeared
      list = list.filter(w => w.status === WinStatus.SUBMITTED || (currentUser && w.userId === currentUser.id));
    }

    if (activeTab === 'team1') return list.filter(w => w.team === TeamPool.TEAM_1);
    if (activeTab === 'team2') return list.filter(w => w.team === TeamPool.TEAM_2);
    
    return list;
  }, [wins, activeTab, personalFilter, currentUser]);

  const currentMonthWins = useMemo(() => {
    const now = new Date().toISOString().slice(0, 7);
    return wins.filter(w => w.month === now && w.status === WinStatus.SUBMITTED);
  }, [wins]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-color)] overflow-hidden relative">
        <GlassCard className="w-full max-w-6xl p-12 text-center z-10 rounded-[3rem] border-2 shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl ring-4 ring-white border-2 border-slate-200/50">
            <ICONS.Vault />
          </div>
          <h1 className="size-heading font-black mb-6 tracking-tight text-[var(--text-color)]">Win Vault</h1>
          <p className="size-subtitle text-slate-500 mb-12 max-w-2xl mx-auto">Identify your sector to continue achievement logging and strategic archive management.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
            {USERS.map(user => (
              <button
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className="flex items-center gap-5 p-6 rounded-3xl bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] hover:border-blue-600 hover:bg-blue-600/5 transition-all group text-left shadow-sm"
              >
                <img src={user.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" alt="" />
                <div className="overflow-hidden">
                  <div className="size-subtitle font-bold text-[var(--text-color)] truncate">{user.name}</div>
                  <div className="size-paragraph font-bold text-slate-500 uppercase tracking-widest">{user.team}</div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      <nav className="sticky top-0 z-40 molten-glass border-b px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg ring-4 ring-white border border-slate-200/50`}>
              <ICONS.Vault />
            </div>
            <span className="size-subtitle font-black tracking-tight text-[var(--text-color)] uppercase hidden lg:block">Win Vault</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-500/5 p-2 rounded-2xl border border-[var(--glass-border)]">
            <button onClick={() => setActiveTab('all')} className={`px-6 py-2 rounded-xl size-subtitle font-bold transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-blue-600'}`}>All</button>
            <button onClick={() => setActiveTab('team1')} className={`px-6 py-2 rounded-xl size-subtitle font-bold transition-all ${activeTab === 'team1' ? 'bg-blue-600/20 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Team 1</button>
            <button onClick={() => setActiveTab('team2')} className={`px-6 py-2 rounded-xl size-subtitle font-bold transition-all ${activeTab === 'team2' ? 'bg-purple-600/20 text-purple-600' : 'text-slate-500 hover:text-purple-500'}`}>Team 2</button>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme} 
              className="p-3 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all text-white border-2 border-transparent hover:border-white/50"
              title="Toggle Theme"
            >
              <ICONS.ThemeToggle />
            </button>
            <div className="hidden md:flex flex-col text-right">
              <span className="size-subtitle font-bold text-[var(--text-color)] leading-none mb-1">{currentUser.name}</span>
              <span className="size-paragraph uppercase text-slate-500 font-bold tracking-widest leading-none">{currentUser.team}</span>
            </div>
            <img src={currentUser.avatar} className="w-12 h-12 rounded-2xl border border-[var(--glass-border)] shadow-lg" alt="" />
            <button onClick={() => setCurrentUser(null)} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-16 lg:py-24 space-y-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start justify-between">
          <div className="max-w-3xl">
            <h1 className="size-heading font-extrabold text-[var(--text-color)] leading-tight mb-8">
              Documenting <span className="text-blue-600">Wins.</span><br/>Securing the Archive.
            </h1>
            <p className="size-subtitle text-slate-500 max-w-2xl">
              High-performance achievement tracking for Strategy & Plans. Secure your impact locally for monthly synergy insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <button 
              onClick={() => setIsWrappedOpen(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-4 px-10 py-6 rounded-2xl molten-glass size-subtitle font-bold border-blue-500/30 text-blue-600 hover:bg-blue-600/5 transition-all"
            >
              <ICONS.Wrapped />
              Monthly Wrap
            </button>
            <button 
              onClick={() => {
                setEditingWin(null);
                setIsFormOpen(true);
              }}
              className="flex-1 lg:flex-none flex items-center justify-center gap-4 px-12 py-6 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all size-subtitle font-bold shadow-2xl active:scale-95 shadow-blue-500/30"
            >
              <ICONS.Plus />
              Record Win
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="flex gap-10 mb-12 border-b border-[var(--glass-border)]">
              <button 
                onClick={() => setPersonalFilter('all')}
                className={`size-subtitle font-bold pb-4 border-b-4 transition-all ${personalFilter === 'all' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-blue-500'}`}
              >
                Team Feed
              </button>
              <button 
                onClick={() => setPersonalFilter('mine')}
                className={`size-subtitle font-bold pb-4 border-b-4 transition-all ${personalFilter === 'mine' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-blue-500'}`}
              >
                My Achievements
              </button>
            </div>
            <WinList 
              wins={filteredWins} 
              onEdit={handleEditRequest}
              title={personalFilter === 'mine' ? "Personal Archive" : `${activeTab === 'all' ? 'Consolidated' : activeTab === 'team1' ? 'Team 1' : 'Team 2'} Sector`}
            />
          </div>

          <div className="space-y-12">
            <GlassCard className="p-10 rounded-[2.5rem] border-2 shadow-xl">
              <h3 className="size-subtitle font-bold text-slate-500 mb-8 flex justify-between items-center">
                Local Status
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              </h3>
              <p className="size-paragraph text-slate-500 mb-4">
                Your data is vaulted in <strong>Local Storage</strong>. Session is currently active.
              </p>
              <div className="size-paragraph font-bold text-[var(--text-color)] mb-8 flex justify-between items-center">
                <span>Last Vault Sync</span>
                <span className="text-blue-600">{lastSync}</span>
              </div>
              <button className="w-full py-5 rounded-2xl bg-slate-500/10 size-subtitle font-bold text-slate-500 hover:bg-slate-500/20 transition-all">
                Force Backup
              </button>
            </GlassCard>

            <GlassCard className="p-10 rounded-[2.5rem] border-l-8 border-blue-600 shadow-xl">
              <h3 className="size-subtitle font-bold mb-8 text-[var(--text-color)]">Quarterly Velocity</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between size-subtitle font-bold text-slate-500">
                    <span className="text-[var(--text-color)]">Logged Wins</span>
                    <span className="text-[var(--text-color)]">{wins.length}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg" style={{width: `${Math.min(100, (wins.length / 50) * 100)}%`}} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      {isFormOpen && (
        <WinForm 
          currentUser={currentUser} 
          initialWin={editingWin || undefined}
          onSave={handleSaveWin} 
          onClose={() => {
            setIsFormOpen(false);
            setEditingWin(null);
          }} 
        />
      )}

      {isWrappedOpen && (
        <WrappedView 
          wins={currentMonthWins} 
          month={new Date().toISOString().slice(0, 7)} 
          onClose={() => setIsWrappedOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
