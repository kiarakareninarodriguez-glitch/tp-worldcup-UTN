export interface JourneyMatchApiItem {
  stage?: string;
  stageLabel?: string;
  matchCode?: string;
  opponentTeamId?: string;
  opponentTeamName?: string;
  opponentFlag?: string;
  goalsFor?: number | null;
  goalsAgainst?: number | null;
  scoreLabel?: string;
  result?: string;
  resultLabel?: string;
  resultStyle?: string;
  resolution?: string;
  resolutionLabel?: string;
  isPending?: boolean;
}

export interface JourneyApiRawResponse {
  worldCupId?: string;
  teamId?: string;
  teamName?: string;
  lang?: string;
  worldCupStatus?: string;
  stageReached?: string;
  stageReachedLabel?: string;
  isChampion?: boolean;
  isFinalPending?: boolean;
  eliminatedByTeamId?: string | null;
  eliminatedByTeamName?: string | null;
  summary?: string;
  matchesPlayed?: number;
  matches?: JourneyMatchApiItem[];
}


export interface JourneyScreenModel {
  worldCupId: string;
  teamId: string;
  teamName: string;
  lang: string;
  worldCupStatus: string;
  stageReached: string;
  stageReachedLabel: string;
  isChampion: boolean;
  isFinalPending: boolean;
  eliminatedByTeamId: string | null;
  eliminatedByTeamName: string | null;
  summary: string;
  matchesPlayed: number;
  matches: JourneyMatchApiItem[];
}
