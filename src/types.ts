export interface Member {
  id: string;
  rank: number;
  nameTh: string;
  nameEn?: string;
  nickname: string;
  country: string; // e.g. "🇹🇭 ไทย", "🇯🇵 ญี่ปุ่น"
  role: string;
  finalVotes?: number;
  birthDate?: string;
  mbti?: string;
  notes?: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  seasonName: string;
  groupName: string;
  groupType?: 'girl_group' | 'boy_group' | 'co_ed';
  fandomName?: string;
  members: Member[];
}

export type ViewMode = 'cards' | 'podium';
