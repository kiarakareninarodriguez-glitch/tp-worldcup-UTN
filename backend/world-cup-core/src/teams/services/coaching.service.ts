import { Injectable } from '@nestjs/common';

@Injectable()
export class CoachingService {
  private readonly teamId: string = process.env.TEAM_ID || 'SEN'; 

  constructor() {}

  async getCoachInfo() {
    // Devolvemos el objeto global CoachingOverviewData completo
    return {
      teamId: this.teamId,
      coach: {
        coachId: `coach_${this.teamId.toLowerCase()}`,
        teamId: this.teamId,
        teamName: this.teamId === 'SEN' ? 'Senegal' : 'Selección Nacional',
        name: "Aliou Cissé",
        age: 50,
        nationality: "Senegal",
        profile: "PRAGMATIC",
        profileLabel: "Pragmático / Equilibrado",
        profileDescription: "Prioriza la solidez defensiva y transiciones rápidas según el rival.",
        riskAppetite: 55,
        gameManagement: 78,
        adaptability: 72,
        pressingBias: 60,
        possessionBias: 50,
        defenseBias: 65,
        maxStrategyChanges: 3
      },
      strategy: {
        teamId: this.teamId,
        strategy: "COUNTER_ATTACK"
      },
      formation: {
        teamId: this.teamId,
        formation: "4-3-3"
      },
      stats: {
        attack: 75,
        defense: 80,
        midfield: 74,
        overall: 76,
        current_strategy: "Contraataque",
        current_formation: "4-3-3"
      },
      baseRatings: [
        { metric: "Ataque Base", value: 72 },
        { metric: "Defensa Base", value: 78 }
      ],
      effectiveRatings: [
        { metric: "Ataque Efectivo", value: 75 },
        { metric: "Defensa Efectiva", value: 80 }
      ],
      ratingDeltas: [
        { metric: "Moral", strategyDelta: 3, compatibilityPenalty: 0, totalDelta: 3 }
      ],
      strategyPenalty: 0,
      strategies: [
        { strategy: "COUNTER_ATTACK", description: "Defensa baja y salida rápida", compatibleFormations: ["4-3-3", "4-4-2"] },
        { strategy: "POSSESSION", description: "Control del balón y pases cortos", compatibleFormations: ["4-3-3"] }
      ],
      formations: [
        { formation: "4-3-3", description: "Esquema ofensivo clásico", compatibleStrategies: ["COUNTER_ATTACK", "POSSESSION"] },
        { formation: "4-4-2", description: "Equilibrio en el mediocampo", compatibleStrategies: ["COUNTER_ATTACK"] }
      ],
      compatibility: {
        selectedStrategy: "COUNTER_ATTACK",
        selectedFormation: "4-3-3",
        compatibleFormations: ["4-3-3", "4-4-2"],
        compatibleStrategies: ["COUNTER_ATTACK", "POSSESSION"],
        byStrategy: { "COUNTER_ATTACK": ["4-3-3", "4-4-2"] },
        byFormation: { "4-3-3": ["COUNTER_ATTACK", "POSSESSION"] },
        isSelectedPairCompatible: true
      }
    };
  }
}