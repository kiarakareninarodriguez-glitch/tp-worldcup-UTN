import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../basic/abstract.controller';
import { RivalsService } from '../services/rivals.service';

@ApiTags('my-team')
@Controller('my-team')
export class RivalsController extends AbstractController {
  constructor(private readonly rivalsService: RivalsService) {
    super();
  }

  @Get('rivals')
  @ApiOperation({ summary: 'My Team - Historical Rivals component' })
  @ApiQuery({ name: 'lang', required: false, enum: ['es', 'en'] })
  public async getRivals(@Query('lang') lang?: string): Promise<unknown> {
    return this.createOkResponse(await this.rivalsService.getRivals(lang));
  }
}