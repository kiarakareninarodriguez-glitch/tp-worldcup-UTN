export interface CoachingResponse { }

export interface CoachingApiResponse {
    coachId: string;
    teamId: string;
    teamName: string;
    name: string;
    age: number;
    nationality: string;
    profile: string;
    riskAppetite: number;
    gameManagement: number;
    adaptability: number;
    pressingBias: number;
    possessionBias: number;
    defenseBias: number;
    maxStrategyChanges: number;

}

export interface CoachStrategyCatalogApiItem {
    strategy: string;
    strategyLabel: string;
    description: string;
}

export interface CoachFormationCatalogApiItem {
    formation: string;
    description: string;
}

export interface CoachStatApiResponse {
    attack: number
    defense: number
    midfield: number
    overall: number
    current_strategy: string
    current_formation: string

}

export interface CoachingScreenResponse {

    coach: CoachingCoach;
    formations: CoachFormationCatalogApiItem[];
    strategys: CoachStrategyCatalogApiItem[];
    stats: CoachStatApiResponse;

}

export interface CoachingCoach {
  coachId: string;
  teamId: string;
  teamName: string;
  name: string;
  age: number;
  nationality: string;
  profile: string;
  profileLabel?: string;
  profileDescription?: string;
  riskAppetite: number;
  gameManagement: number;
  adaptability: number;
  pressingBias: number;
  possessionBias: number;
  defenseBias: number;
  maxStrategyChanges: number;
}