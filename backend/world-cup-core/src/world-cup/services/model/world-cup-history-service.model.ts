export class WorldCupHistoryItemModel {
  public worldCupId: string;
  public worldCupIdShort: string;
  public finalPlayedAt: string | null;
  public edition: number;
  public editionLabel: string;
  public status: string;
  public statusLabel: string;
  public champion: { teamId: string; teamName: string };
  public runnerUp: { teamId: string; teamName: string };
  public thirdPlace: { teamId: string; teamName: string };
  public fourthPlace: { teamId: string; teamName: string };
  public totalMatches: number;
  public totalGoals: number;
  public avgGoalsPerMatch: number;
  public yellowCards: number;
  public redCards: number;
  public topScorer: { playerName: string; teamId: string; teamName: string; value: number };
  public topAssist: { playerName: string; teamId: string; teamName: string; value: number };
  public fairPlay: { teamId: string; teamName: string; teamFlag: string; fairPlayPoints: number; yellowCards: number; redCards: number; fairPlayRank: number; totalRankedTeams: number; hasData: boolean };
  public worstFairPlay: { teamId: string; teamName: string; teamFlag: string; fairPlayPoints: number; yellowCards: number; redCards: number; fairPlayRank: number; totalRankedTeams: number; hasData: boolean };
  constructor(data: {
    worldCupId: string;
    edition: number;
    finalPlayedAt: string | null;
    status: string;
    champion: { teamId: string; teamName: string };
    runnerUp: { teamId: string; teamName: string };
    thirdPlace: { teamId: string; teamName: string };
    fourthPlace: { teamId: string; teamName: string };
    totalMatches: number;
    totalGoals: number;
    avgGoalsPerMatch: number;
    yellowCards: number;
    redCards: number;
    topScorer: { playerName: string; teamId: string; teamName: string; value: number };
    topAssist: { playerName: string; teamId: string; teamName: string; value: number };
    fairPlay: { teamId: string; teamName: string; teamFlag: string; fairPlayPoints: number; yellowCards: number; redCards: number; fairPlayRank: number; totalRankedTeams: number; hasData: boolean };
    worstFairPlay: { teamId: string; teamName: string; teamFlag: string; fairPlayPoints: number; yellowCards: number; redCards: number; fairPlayRank: number; totalRankedTeams: number; hasData: boolean };
  }) {
    this.worldCupId = data.worldCupId;
    this.worldCupIdShort = data.worldCupId.slice(-8);
    this.edition = data.edition;
    this.editionLabel = `Edición ${data.edition}`;
    this.finalPlayedAt = data.finalPlayedAt;
    this.status = data.status;
    this.statusLabel = data.status === 'ENDED' ? 'Finalizado' : data.status;
    this.champion = data.champion;
    this.runnerUp = data.runnerUp;
    this.thirdPlace = data.thirdPlace;
    this.fourthPlace = data.fourthPlace;
    this.totalMatches = data.totalMatches;
    this.totalGoals = data.totalGoals;
    this.avgGoalsPerMatch = data.avgGoalsPerMatch;
    this.yellowCards = data.yellowCards;
    this.redCards = data.redCards;
    this.topScorer = data.topScorer;
    this.topAssist = data.topAssist;
    this.fairPlay = data.fairPlay;
    this.worstFairPlay = data.worstFairPlay;
  }
}

export class WorldCupHistoryScreenModel {
  public teamId: string;
  public lang: string;
  public totalWorldCups: number;
  public worldCups: WorldCupHistoryItemModel[];

  constructor(data: {
    teamId: string;
    lang: string;
    totalWorldCups: number;
    worldCups: WorldCupHistoryItemModel[];
  }) {
    this.teamId = data.teamId;
    this.lang = data.lang;
    this.totalWorldCups = data.totalWorldCups;
    this.worldCups = data.worldCups;
  }
}