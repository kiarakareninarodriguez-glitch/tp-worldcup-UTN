export enum MatchZone {
  DEFENSE_THIRD = 'DEFENSE_THIRD',
  MIDFIELD = 'MIDFIELD',
  ATTACK_THIRD = 'ATTACK_THIRD',
  BOX = 'BOX',
}

export const MatchZoneLabels: Record<MatchZone, string> = {
  [MatchZone.DEFENSE_THIRD]: "Área local (Defensa)",
  [MatchZone.MIDFIELD]: "Área Central (Centro)",
  [MatchZone.ATTACK_THIRD]: "Área Rival (Ataque)",
  [MatchZone.BOX]: "Área"
};



