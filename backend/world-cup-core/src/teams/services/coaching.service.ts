import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // 👈 CORRECCIÓN 1: Importados explícitamente de @nestjs/common
import { WorldCupApiService } from 'src/basic/world-cup-api.service';

interface ExternalCoachApiItem {
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

@Injectable()
export class CoachingService {
  private readonly defaultTeamId: string = process.env.TEAM_ID || 'SEN'; 

  constructor(
    private readonly worldCupApiService: WorldCupApiService
  ) {}

  async getCoachingOverview(teamId: string, lang: string = 'es') {
    try {
      const activeTeamId = teamId ? teamId.toUpperCase() : this.defaultTeamId;

      const coachesData = await this.worldCupApiService.get<ExternalCoachApiItem[]>(
        `/teams/${activeTeamId}/coaches`, 
        { lang }
      );
      
      const coachData = coachesData && coachesData.length > 0 ? coachesData[0] : null;

      if (!coachData) {
        throw new HttpException(
          `No se encontró cuerpo técnico en el sistema central para el equipo: ${activeTeamId}`, 
          HttpStatus.NOT_FOUND
        );
      }

    
      return {
        teamId: activeTeamId,
        coach: {
          coachId: coachData.coachId,
          teamId: coachData.teamId,
          teamName: coachData.teamName,
          name: coachData.name,                 
          age: coachData.age,                   
          nationality: coachData.nationality,
          profile: coachData.profile,
          profileLabel: coachData.profile === 'AGGRESSIVE'
            ? (lang === 'en' ? "Aggressive / Offensive" : "Agresivo / Ofensivo")
            : (lang === 'en' ? "Pragmatic / Balanced" : "Pragmático / Equilibrado"),
          profileDescription: coachData.profile === 'AGGRESSIVE'
            ? (lang === 'en' ? "Prioritizes high pressing and fast attacking transitions." : "Prioriza la presión alta y transiciones ofensivas rápidas.")
            : (lang === 'en' ? "Prioritizes defensive solidity and tactical discipline." : "Prioriza la solidez defensiva y el orden táctico."),
          riskAppetite: coachData.riskAppetite,
          gameManagement: coachData.gameManagement,
          adaptability: coachData.adaptability,
          pressingBias: coachData.pressingBias,
          possessionBias: coachData.possessionBias,
          defenseBias: coachData.defenseBias,
          maxStrategyChanges: coachData.maxStrategyChanges
        },
        strategy: {
          teamId: activeTeamId,
          strategy: "COUNTER_ATTACK" 
        },
        formation: {
          teamId: activeTeamId,
          formation: "4-3-3"
        },
        stats: {
          attack: coachData.pressingBias ? Math.round((coachData.riskAppetite + coachData.pressingBias) / 2) : 75,
          defense: coachData.defenseBias ?? 80,
          midfield: coachData.possessionBias ?? 74,
          overall: coachData.gameManagement ?? 76,
          current_strategy: lang === 'en' ? "Counter-Attack" : "Contraataque",
          current_formation: "4-3-3"
        },
        baseRatings: [
          { metric: lang === 'en' ? "Base Attack" : "Ataque Base", value: 72 },
          { metric: lang === 'en' ? "Base Defense" : "Defensa Base", value: 78 }
        ],
        effectiveRatings: [
          { metric: lang === 'en' ? "Effective Attack" : "Ataque Efectivo", value: 75 },
          { metric: lang === 'en' ? "Effective Defense" : "Defensa Efectiva", value: 80 }
        ],
        ratingDeltas: [
          { metric: lang === 'en' ? "Team Morale" : "Moral del Equipo", strategyDelta: 3, compatibilityPenalty: 0, totalDelta: 3 }
        ],
        strategyPenalty: 0,
        strategies: [
          { strategy: "COUNTER_ATTACK", description: lang === 'en' ? "Low block and fast breaks" : "Defensa baja y salida rápida", compatibleFormations: ["4-3-3", "4-4-2"] },
          { strategy: "POSSESSION", description: lang === 'en' ? "Short passing and ball control" : "Control del balón y pases cortos", compatibleFormations: ["4-3-3"] }
        ],
        formations: [
          { formation: "4-3-3", description: lang === 'en' ? "Classic offensive blueprint" : "Esquema ofensivo clásico", compatibleStrategies: ["COUNTER_ATTACK", "POSSESSION"] },
          { formation: "4-4-2", description: lang === 'en' ? "Balanced midfield grid" : "Equilibrio en el mediocampo", compatibleStrategies: ["COUNTER_ATTACK"] }
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

    } catch (error: any) {
      throw new HttpException(
        error.message || 'Error al conectar con la API de la FIFA',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}