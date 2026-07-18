export type ImpactLevel = 'SMALL' | 'MEDIUM' | 'MAJOR';

export interface WinModel {
  id: string;
  userId: string;
  title: string;
  description?: string;
  impact: ImpactLevel;
  tags: string[];
  challenges: string[];
  skills: string[];
  startDate: string;
  completionDate: string;
  collaborators: string[];
  evidence?: string;
}

export interface CreateWinInput {
  userId: string;
  title: string;
  description?: string;
  impact: ImpactLevel;
  tags: string[];
  challenges: string[];
  skills: string[];
  startDate: string;
  completionDate: string;
  collaborators: string[];
  evidence?: string;
}

export type UpdateWinInput = Partial<Omit<WinModel, 'id' | 'userId'>>;
