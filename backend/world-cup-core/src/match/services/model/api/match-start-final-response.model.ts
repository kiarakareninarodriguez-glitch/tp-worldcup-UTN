import { FinalChatOptionApiItem } from "../view/final-chat-api.interface";

export interface MessageItems {
  type: string;
  text: string;
  minute: number;
  turn: number;
  teamId: string;
  teamName: string;
  playerName: string;
}
export interface MatchStartFinalResponse {
  teamId: string;
  matchId: string;
  isFinished: boolean;
  result: string;
  minute: number;
  turn: number;
  score: string;
  zone: string;
  possession: string;
  ballCarrier: string;
  eventType: string;
  teamName: string;
  opponentName: string;
  teamCoachName: string;
  teamCoachProfile: string;
  teamStrategy: string;
  teamFormation: string;
  opponentCoachName: string;
  opponentCoachProfile: string;
  opponentStrategy: string;
  opponentFormation: string;
  options: FinalChatOptionApiItem[];
  messageItems: MessageItems[];
}


export interface SelectStrategyResponse {
  teamId: string
  strategy: string
  formation: string
  formationAutoAdjusted: boolean
  message: string
  strategyLabel: string|undefined;
}