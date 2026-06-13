export enum CoachProfile {
  CONSERVATIVE = 'CONSERVATIVE',
  BALANCED = 'BALANCED',
  AGGRESSIVE = 'AGGRESSIVE',
  PRAGMATIC = 'PRAGMATIC',
  CATENACCIO = 'CATENACCIO',
  REACTIVE = 'REACTIVE',
  TOTAL_FOOTBALL = 'TOTAL_FOOTBALL',
}

export const MatchCoachProfileLabels: Record<CoachProfile, string> = {
  [CoachProfile.CONSERVATIVE]: "Conservador",
  [CoachProfile.BALANCED]: "Balanceado",
  [CoachProfile.AGGRESSIVE]: "Agresivo",
  [CoachProfile.PRAGMATIC]: "Pragmatico",
  [CoachProfile.CATENACCIO]: "UltraDefensivo",
  [CoachProfile.REACTIVE]: "Reactivo",
  [CoachProfile.TOTAL_FOOTBALL]: "Futbol total"
};



