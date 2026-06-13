export interface RivalItem {
  id: string;
  name: string;
  confederation: string;
  overallRating: number;
  coachName: string;
  captainName: string;
  strategy: string;
  formation: string;
}

export interface RivalsApiResponse {
  teamId: string;
  lang: 'es' | 'en';
  totalRivals: number;
  rivals: RivalItem[];
}