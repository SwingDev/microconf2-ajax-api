import { Controller, Get, Param } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ICurrentUserDTO } from '../auth/interfaces/current-user.interface';
import { IUserRegionDTO } from './dto/user-region-with-crimes.dto';
import { RegionService } from './region.service';

@Controller('region')
export class RegionController {
  constructor(
    private readonly service: RegionService
  ) { }

  @Get('/')
  public async findAll(@CurrentUser() user: ICurrentUserDTO): Promise<IUserRegionDTO[]> {
    return this.service.findAll(user.id);
  }

  @Get('/:id')
  public async findOne(@CurrentUser() user: ICurrentUserDTO, @Param('id') id: string): Promise<IUserRegionDTO> {
    return this.service.findOneById(user.id, id);
  }
}
