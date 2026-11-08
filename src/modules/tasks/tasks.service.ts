import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Task } from '@database/typeorm/entities/task.entity';
import {
  CreateTaskDto,
  FilterTaskDto,
  TaskResponseDto,
  UpdateTaskDto,
} from './dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      description: createTaskDto.description ?? null,
      isCompleted: false,
    });
    const savedTask = await this.taskRepository.save(task);
    return TaskResponseDto.fromEntity(savedTask);
  }

  async findAll(filterDto?: FilterTaskDto): Promise<TaskResponseDto[]> {
    const where: FindOptionsWhere<Task> = {};

    if (filterDto?.isCompleted !== undefined) {
      where.isCompleted = filterDto.isCompleted;
    }

    if (filterDto?.category !== undefined && filterDto.category !== '') {
      where.category = filterDto.category;
    }

    const tasks = await this.taskRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return TaskResponseDto.fromEntities(tasks);
  }

  async findOne(id: string): Promise<TaskResponseDto> {
    const task = await this.findEntityById(id);
    return TaskResponseDto.fromEntity(task);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.findEntityById(id);
    const updatedTask = await this.taskRepository.save(
      Object.assign(task, updateTaskDto),
    );
    return TaskResponseDto.fromEntity(updatedTask);
  }

  async remove(id: string): Promise<TaskResponseDto> {
    const task = await this.findEntityById(id);
    const responseDto = TaskResponseDto.fromEntity(task);
    await this.taskRepository.remove(task);
    return responseDto;
  }

  private async findEntityById(id: string): Promise<Task> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Tasks with ID ${id} not found`);
    }

    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Tasks with ID ${id} not found`);
    }

    return task;
  }
}
