import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** Admin dashboard: live counts */
  @Get('admin/dashboard')
  @Roles(Role.ADMIN)
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  /** Store owner dashboard: raters list + average */
  @Get('store-owner/dashboard')
  @Roles(Role.STORE_OWNER)
  getStoreOwnerDashboard(@CurrentUser('id') ownerId: number) {
    return this.dashboardService.getStoreOwnerDashboard(ownerId);
  }
}
