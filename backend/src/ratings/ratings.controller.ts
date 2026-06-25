import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { UpsertRatingDto } from './dto/upsert-rating.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  /** Normal user submits or updates their rating for a store */
  @Post(':id/rating')
  @Roles(Role.NORMAL_USER)
  upsertRating(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) storeId: number,
    @Body() dto: UpsertRatingDto,
  ) {
    return this.ratingsService.upsertRating(userId, storeId, dto);
  }
}
