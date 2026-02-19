
import React from 'react';
import { User, TeamPool, OKRCategory } from './types';

export const USERS: User[] = [
  // Team 1
  { id: 't1-1', name: 'Tee Yong Tam', avatar: 'https://picsum.photos/seed/teeyong/100/100', team: TeamPool.TEAM_1 },
  { id: 't1-2', name: 'Karim Sumilo', avatar: 'https://picsum.photos/seed/karim/100/100', team: TeamPool.TEAM_1 },
  { id: 't1-3', name: 'Albert Chen', avatar: 'https://picsum.photos/seed/albert/100/100', team: TeamPool.TEAM_1 },
  { id: 't1-4', name: 'Veronica Sutanto', avatar: 'https://picsum.photos/seed/veronica/100/100', team: TeamPool.TEAM_1 },
  { id: 't1-5', name: 'Zaher Wahab', avatar: 'https://picsum.photos/seed/zaher/100/100', team: TeamPool.TEAM_1 },
  
  // Team 2
  { id: 't2-1', name: 'Agnes Ong', avatar: 'https://picsum.photos/seed/agnes/100/100', team: TeamPool.TEAM_2 },
  { id: 't2-2', name: 'Yu Su Mean', avatar: 'https://picsum.photos/seed/yusu/100/100', team: TeamPool.TEAM_2 },
  { id: 't2-3', name: 'Deniece Tan', avatar: 'https://picsum.photos/seed/deniece/100/100', team: TeamPool.TEAM_2 },
  
  // Director
  { id: 'd-1', name: 'Ming Fai Wong', avatar: 'https://picsum.photos/seed/mingfai/100/100', team: TeamPool.DIRECTOR },
];

export const OKR_COLORS: Record<OKRCategory, string> = {
  [OKRCategory.GROWTH]: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  [OKRCategory.EFFICIENCY]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [OKRCategory.INNOVATION]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [OKRCategory.CULTURE]: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  [OKRCategory.REVENUE]: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export const TEAM_COLORS: Record<TeamPool, string> = {
  [TeamPool.TEAM_1]: 'from-blue-600/40 to-indigo-600/40',
  [TeamPool.TEAM_2]: 'from-purple-600/40 to-fuchsia-600/40',
  [TeamPool.DIRECTOR]: 'from-slate-700 to-slate-900',
};

export const ICONS = {
  Vault: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Wrapped: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Link: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  ThemeToggle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
  Mic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  Wand: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 1.558l-.707.707m5.216-5.216a2.5 2.5 0 113.536 3.536L15 20.485a4.47 4.47 0 01-3.182 1.315H9a1 1 0 01-1-1v-2.818a4.47 4.47 0 011.315-3.182L20.485 3.515a2.5 2.5 0 113.536 3.536L19.428 11.428z" />
    </svg>
  )
};
