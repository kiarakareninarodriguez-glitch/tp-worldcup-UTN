import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoachingService } from '../services/coaching.service';

@ApiTags('my-team') // Teoría de Configuración: Agrupa tu endpoint en la interfaz visual de Swagger
@Controller('my-team') // Recurso base (Sustantivo de jerarquía superior según REST)
export class CoachingController {
  
  // Inyección de dependencias: Recibimos el servicio que configuramos recién
  constructor(private readonly coachingService: CoachingService) {}

  // Contrato REST: Método HTTP GET para leer el recurso subordinado 'coaching'
  // URL Final: http://localhost:4101/worldCupCore/my-team/coaching
  @Get('coaching')
  @HttpCode(HttpStatus.OK) // Código de Estado REST: Forzamos la respuesta estándar 200 OK
  async getCoaching() {
    // JavaScript Asincrónico: Esperamos la respuesta del servicio y la devolvemos
    return await this.coachingService.getCoachInfo();
  }
}