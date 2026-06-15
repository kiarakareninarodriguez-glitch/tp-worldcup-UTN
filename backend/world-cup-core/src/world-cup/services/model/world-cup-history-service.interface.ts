



export interface WorldCupByIdApiResponse {
  worldCupId?: string;
  edition?: number;
  status?: string;
  hasActiveFinal?: boolean;
  canResimulate?: boolean;
  canStartFinal?: boolean;
  selectedTeamId?: string;
  selectedTeamName?: string;
  finalHomeTeamId?: string;
  finalHomeTeamName?: string;
  finalAwayTeamId?: string;
  finalAwayTeamName?: string;
  finalMatchId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  }

  export interface WorldCupPodiumTeam {
    teamId?: string;
    teamName?: string;
  }

  export interface WorldCupPlayerStat{
    playerName?: string;
    teamId?: string;
    teamName?: string;
    value?: number;
  }
  
  export interface WorldCupCardsStat {
    totalYellowCards?: number;
    totalRedCards?: number;
  }

  export interface WorldCupStatsByIdApiResponse {
    totalMatches?: number;
    totalGoals?: number;
    avgGoalsPerMatch?: number;
    champion?: WorldCupPodiumTeam;
    runnerUp?: WorldCupPodiumTeam;
    thirdPlace?: WorldCupPodiumTeam;
    fourthPlace?: WorldCupPodiumTeam;
    topScorers?: WorldCupPlayerStat[];
    topAssists?: WorldCupPlayerStat[];
    bestGoalkeepers?: WorldCupPlayerStat[];
    cleanSheetLeaders?: WorldCupPlayerStat[];
    topPlayerOfMatch?: WorldCupPlayerStat;
    cards?: WorldCupCardsStat;
  }

  export interface WorldCupAward{
    code?: string;
    winnerName?: string;
    teamId?: string;
    teamName?: string;
    reason?: string;
    goals?: number;
    playerOfMatch?: number;
    fairPlayPoints?: number;
    yellowCards?: number;
    redCards?: number;
  }

 
  export type WorldCupAwardsByIdApiResponse = WorldCupAward[];

    
export interface WorldCupMatchCardsApiResponse {
  homeTeamId?: string;
  homeTeamName?: string;
  awayTeamId?: string;
  awayTeamName?: string;
  homeTeamTotalYellowCards?: number;
  homeTeamTotalRedCards?: number;
  awayTeamTotalYellowCards?: number;
  awayTeamTotalRedCards?: number;
}