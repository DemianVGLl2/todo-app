import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    findAll() {
        return this.tasksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(+id);
    }

    @Post()
    create(@Body() body: { title: string; description?: string }) {
        return this.tasksService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: { title?: string; description?: string }) {
        return this.tasksService.update(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(+id);
    }
}
