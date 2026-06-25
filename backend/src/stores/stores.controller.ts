import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoreDto } from './dto/filter-store.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  /** Admin: create a new store */
  @Post('admin/stores')
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  /** Admin: list all stores with avg rating, filterable/sortable */
  @Get('admin/stores')
  @Roles(Role.ADMIN)
  findAllAdmin(@Query() filters: FilterStoreDto) {
    return this.storesService.findAllAdmin(filters);
  }

  /** Admin: get specific store details */
  @Get('admin/stores/:id')
  @Roles(Role.ADMIN)
  findOneAdmin(@Param('id') id: string) {
    return this.storesService.findOneAdmin(+id);
  }

  /** Normal user: list stores with own rating + avg rating, searchable */
  @Get('stores')
  @Roles(Role.NORMAL_USER)
  findAllForUser(
    @CurrentUser('id') userId: number,
    @Query('name') name?: string,
    @Query('address') address?: string,
  ) {
    return this.storesService.findAllForUser(userId, { name, address });
  }
}
