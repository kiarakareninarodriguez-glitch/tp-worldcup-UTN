
export interface MatchCurrentSquadItemPlayer {
  playerId: string;
  name: string;
  shirtNumber: number;
  position: string;
  age: number;
  energy: number;
  isCaptain: boolean;
  isStarter: boolean;
  isOnField: boolean;
  yellowCards: number;
  redCard: boolean;
  isInjured: boolean;
}
export interface MatchCurrentSquadItem {
  id: string;
  name: string;
  formation: string;
  strategy: string;
  coachName: string;
  coachProfile: string;
  maxSubstitutions: number;
  substitutionsUsed: number;
  remainingSubstitutions: number;
  onFieldCount: number;
  tacticalBreakdown: any;
  onField:MatchCurrentSquadItemPlayer[];
  bench:MatchCurrentSquadItemPlayer[];
}

export interface MatchCurrentSquadResponse {
  matchId: string;
  isActive: boolean;
  isFinished: boolean;
  minute: number;
  turn: number;
  score: string;
  team: MatchCurrentSquadItem;
  opponent: MatchCurrentSquadItem;
    
}