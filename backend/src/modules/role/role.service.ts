import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({
      data: { name: createRoleDto.name },
    });
  }

  grantRole(id: string, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { Role: { connect: { name: role } } },
    });
  }

  async save() {
    // const data = await this.prisma.user.findMany();
    // for (const user of data) {
    //   if (user.roleId === Role.ADMIN)
    //     await this.prisma.admin.create({
    //       data: {
    //         user: {
    //           connect: {
    //             id: user.id,
    //           },
    //         },
    //       },
    //     });
    //   else if (user.roleId === Role.USER)
    //     await this.prisma.customer.create({
    //       data: {
    //         user: {
    //           connect: {
    //             id: user.id,
    //           },
    //         },
    //       },
    //     });
    // }

    const data = this.prisma.product.updateMany({
      data: {
        adminId: '68371b881f265cff80f558f0',
      },
    });
    return data;
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
