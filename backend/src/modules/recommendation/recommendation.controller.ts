import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Request } from 'express';
import { SessionData } from '../session/interfaces';

@Controller('recommendation')
@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.USER)
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}
  @Get()
  getRecommendation(@Req() request: Request) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };

    return this.recommendationService.recommend(session_user.user_id);
  }
}
