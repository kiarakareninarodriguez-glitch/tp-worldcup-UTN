import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbstractController } from 'src/basic/abstract.controller';
import { PlayFinalService } from '../services/play-final.service';
import { FinalChatBodyPlay, FinalChatBodySelectFormation, FinalChatBodySelectStrategy, FinalChatBodyStart, FinalChatQueryPreviewRequest } from './request/final-chat-query.request';

@ApiTags('final-match')
@Controller('final-match')
export class PlayFinalController extends AbstractController {
  /** Exposes simulation endpoints and delegates logic to SimulationService. */
  constructor(private readonly playFinalService: PlayFinalService) {
    super();
  }

  /** Returns current world cup metadata for the active simulation context. */
  @Get('preview')
  @ApiOperation({ summary: 'World Cup - current simulation component' })
  @ApiQuery({ name: 'lang', required: false, enum: ['es', 'en'] })
  public async getCurrent(@Query() request: FinalChatQueryPreviewRequest): Promise<unknown> {
    return this.createOkResponse(await this.playFinalService.getPreview(request.lang));
  }

  /** Runs a world cup simulation and returns updated current metadata. */
  @Post('start')
  @ApiOperation({ summary: 'World Cup - run start final action' })
  public async start(@Body() body: FinalChatBodyStart): Promise<unknown> {
    return this.createOkResponse(await this.playFinalService.start(body.lang));
  }
    /** Runs a world cup simulation and returns updated current metadata. */
  @Post('play')
  @ApiOperation({ summary: 'World Cup - run play action' })
  public async play(@Body() body: FinalChatBodyPlay): Promise<unknown> {
    return this.createOkResponse(await this.playFinalService.play(body.option,body.lang));
  }

  @Post('select-strategy')
  @ApiOperation({ summary: 'World Cup - run play action' })
  public async selectStrategy(@Body() body: FinalChatBodySelectStrategy): Promise<unknown> {
    return this.createOkResponse(await this.playFinalService.selectStrategy(body.strategy,body.lang));
  }

  @Post('select-formation')
  @ApiOperation({ summary: 'World Cup - run play action' })
  public async selectformation(@Body() body: FinalChatBodySelectFormation): Promise<unknown> {
    return this.createOkResponse(await this.playFinalService.selectformation(body.formation,body.lang));
  }

  
}