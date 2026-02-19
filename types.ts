
export enum OKRCategory {
  GROWTH = 'Growth',
  EFFICIENCY = 'Efficiency',
  INNOVATION = 'Innovation',
  CULTURE = 'Culture',
  REVENUE = 'Revenue'
}

export enum TeamPool {
  TEAM_1 = 'Team 1',
  TEAM_2 = 'Team 2',
  DIRECTOR = 'Director'
}

export enum WinStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted'
}

export interface WinArtifact {
  name: string;
  url: string;
}

export interface Win {
  id: string;
  title: string;
  description: string;
  impact: string;
  okrCategory: OKRCategory;
  team: TeamPool;
  collaborators: string[];
  artifacts: WinArtifact[];
  status: WinStatus;
  userId: string;
  userName: string;
  createdAt: string;
  month: string; // YYYY-MM
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  team: TeamPool;
}

export interface WrappedData {
  totalWins: number;
  topOkr: OKRCategory;
  topContributor: string;
  aiInsight: string;
  impactSummary: string;
}
