import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { argon } from '@/common/utils';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Public } from '../auth/decorators';
import { SessionData } from '../session/interfaces';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.USER, Role.ADMIN)
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const passsword = await argon.hashSync(createUserDto.password);
    const user = { ...createUserDto, password: passsword };
    return this.userService.create(user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  profile(@Req() request: Request) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    const user_data = session_user.user;
    return { ...user_data, password: undefined, updated_at: undefined };
    // return 'This action returns the profile of the user';
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { ...(await this.userService.findOne(id)), password: undefined };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
