import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';
import { UpdateUserInteractionDto } from './dto/update-user-interaction.dto';

@Controller('user-interaction')
export class UserInteractionController {
  constructor(
    private readonly userInteractionService: UserInteractionService,
  ) {}

  @Post()
  create(@Body() createUserInteractionDto: CreateUserInteractionDto) {
    return this.userInteractionService.create(createUserInteractionDto);
  }

  @Get()
  findAll() {
    return this.userInteractionService.findAll();
  }

  @Get(':userId')
  getAll(@Param('userId') userId: string, @Query('action') action?: string) {
    if (action) {
      return this.userInteractionService.findUserInteractionsByAction(
        userId,
        action,
      );
    }

    return this.userInteractionService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userInteractionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserInteractionDto: UpdateUserInteractionDto,
  ) {
    return this.userInteractionService.update(+id, updateUserInteractionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userInteractionService.remove(+id);
  }
}
