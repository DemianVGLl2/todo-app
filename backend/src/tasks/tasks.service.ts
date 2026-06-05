import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    findAll() {
        return this.prisma.task.findMany();
    }

    findOne(id: number) {
        return this.prisma.task.findUnique({ where: { id } });
    }

    create(data: { title: string; description?: string }) {
        return this.prisma.task.create({ data });
    }

    update(id: number, data: { title?: string; description?: string }) {
        return this.prisma.task.update({ where: { id }, data });
    }

    remove(id: number) {
        return this.prisma.task.delete({ where: { id } });
    }
}
