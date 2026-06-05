import { Injectable } from '@nestjs/common';
import { LocalizedDictionaryItem } from './interfaces/reference-dictionary.interface';



export const POSITIONS: LocalizedDictionaryItem[] = [
  {
    code: 'GK',
    label: { en: 'Goalkeeper', es: 'Arquero' },
    description: {
      en: 'Protects the goal and can use hands inside the box.',
      es: 'Protege el arco y puede usar las manos dentro del área.',
    },
    example: {
      en: 'In PENALTY_AGAINST_EVENT, the goalkeeper tries to save the shot.',
      es: 'En PENALTY_AGAINST_EVENT, el arquero intenta atajar el remate.',
    },
  },
  {
    code: 'DF',
    label: { en: 'Defender', es: 'Defensor' },
    description: {
      en: 'Defensive player focused on recovering the ball and blocking attacks.',
      es: 'Jugador defensivo enfocado en recuperar la pelota y frenar ataques.',
    },
  },
  {
    code: 'MF',
    label: { en: 'Midfielder', es: 'Mediocampista' },
    description: {
      en: 'Connects defense and attack, usually key in possession and passing.',
      es: 'Conecta defensa y ataque, clave en posesión y distribución.',
    },
  },
  {
    code: 'FW',
    label: { en: 'Forward', es: 'Delantero' },
    description: {
      en: 'Attacking player with higher probability to finish chances and score.',
      es: 'Jugador ofensivo con mayor probabilidad de definir y marcar goles.',
    },
  },
];
