export enum MatchZone {
  DEFENSE_THIRD = 'DEFENSE_THIRD',
  MIDFIELD = 'MIDFIELD',
  ATTACK_THIRD = 'ATTACK_THIRD',
  BOX = 'BOX',
}

export const MatchZoneLabels: Record<MatchZone, string> = {
  [MatchZone.DEFENSE_THIRD]: "el tercio defensivo",
  [MatchZone.MIDFIELD]: "el mediocampo",
  [MatchZone.ATTACK_THIRD]: "el tercio ofensivo",
  [MatchZone.BOX]: "el area"
};



