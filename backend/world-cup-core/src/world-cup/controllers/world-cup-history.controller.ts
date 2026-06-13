import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AbstractController } from "../../basic/abstract.controller";
import { WorldCupHistoryService } from "../services/world-cup-history.service";

@ApiTags("world-cup")
@Controller("world-cup")
export class WorldCupHistoryController extends AbstractController {
  constructor(private readonly worldCupHistoryService: WorldCupHistoryService) {
    super();
  }
  @Get("World-Cup-history")
  @ApiOperation({ summary: "World Cup - history component" })
  public async getWorldCupHistory(): Promise<unknown> {
    return this.createOkResponse(
      await this.worldCupHistoryService.getWorldCupHistory(),
    );
  }
}

