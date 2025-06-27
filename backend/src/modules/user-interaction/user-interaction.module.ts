import { Module } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { UserInteractionController } from './user-interaction.controller';

@Module({
  controllers: [UserInteractionController],
  providers: [UserInteractionService],
})
export class UserInteractionModule {}
