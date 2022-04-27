import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  CharacterService,
  IListByIdParams,
  IListParams,
} from './character.service';

@Controller('character')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  @Get('list')
  async list(@Query() params: IListParams) {
    return this.characterService.list(params);
  }

  @Get('list-ids')
  async listByIds(@Query() params: IListByIdParams) {
    return this.characterService.listByIds(params);
  }

  @Get(':id/episodes')
  async listCharacterEpisodes(@Param('id') characterId: string) {
    return this.characterService.listCharacterEpisodes({
      characterId,
    });
  }
}
