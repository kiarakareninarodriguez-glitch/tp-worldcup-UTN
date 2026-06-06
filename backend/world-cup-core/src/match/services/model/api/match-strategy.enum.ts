export enum MatchStrategy {
  ATTACK = 'ATTACK',
  DEFENSE = 'DEFENSE',
  PENALTIES = 'PENALTIES',
  COUNTER_ATTACK = 'COUNTER_ATTACK',
  BALANCED = 'BALANCED',
  POSSESSION = 'POSSESSION',
  
}

export const MatchStrategyLabels: Record<MatchStrategy, string> = {
  [MatchStrategy.ATTACK]: 'Ataque',
  [MatchStrategy.DEFENSE]: 'Defensa',
  [MatchStrategy.PENALTIES]: 'Penales',
  [MatchStrategy.COUNTER_ATTACK]: 'Contraataque',
  [MatchStrategy.BALANCED]: 'Equilibrado',
  [MatchStrategy.POSSESSION]: 'Posesión',
};



