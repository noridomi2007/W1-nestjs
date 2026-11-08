import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from '../dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTaskId = 'a3b2c1d0-1234-4567-89ab-cdef01234567';

  const mockTask = {
    id: mockTaskId,
    title: 'Học NestJS cơ bản',
    category: 'Backend',
    description: 'Tìm hiểu về DTO, Controller, Service và Module',
    isCompleted: false,
    createdAt: new Date('2026-10-27T08:30:00.000Z'),
    updatedAt: new Date('2026-10-27T08:30:00.000Z'),
  };

  const mockTasksService = {
    create: jest.fn().mockResolvedValue(mockTask),
    findAll: jest.fn().mockResolvedValue([mockTask]),
    findOne: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue({
      ...mockTask,
      title: 'Học NestJS nâng cao',
      isCompleted: true,
      updatedAt: new Date('2026-10-27T08:35:00.000Z'),
    }),
    remove: jest.fn().mockResolvedValue(mockTask),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createDto = {
        title: 'Học NestJS cơ bản',
        category: 'Backend',
        description: 'Tìm hiểu về DTO, Controller, Service và Module',
      };

      const result = await controller.create(createDto);

      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks without filters', async () => {
      const filterDto: FilterTaskDto = {};
      const result = await controller.findAll(filterDto);

      expect(result).toEqual([mockTask]);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should pass filter query params to service', async () => {
      const filterDto: FilterTaskDto = {
        isCompleted: false,
        category: 'Backend',
      };
      const result = await controller.findAll(filterDto);

      expect(result).toEqual([mockTask]);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findOne', () => {
    it('should return a single task by id', async () => {
      const result = await controller.findOne(mockTaskId);

      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith(mockTaskId);
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      const updateDto = {
        title: 'Học NestJS nâng cao',
        isCompleted: true,
      };
      const result = await controller.update(mockTaskId, updateDto);

      expect(result.title).toBe('Học NestJS nâng cao');
      expect(result.isCompleted).toBe(true);
      expect(service.update).toHaveBeenCalledWith(mockTaskId, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete and return the deleted task', async () => {
      const result = await controller.remove(mockTaskId);

      expect(result).toEqual(mockTask);
      expect(service.remove).toHaveBeenCalledWith(mockTaskId);
    });
  });

  describe('DTO ValidationPipe', () => {
    const validationPipe = new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    });

    it('should throw BadRequestException when title is missing or empty', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: CreateTaskDto,
      };

      await expect(
        validationPipe.transform({ category: 'Backend' }, metadata),
      ).rejects.toThrow(BadRequestException);

      await expect(
        validationPipe.transform({ title: '   ', category: 'Backend' }, metadata),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when title exceeds 255 characters', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: CreateTaskDto,
      };

      await expect(
        validationPipe.transform(
          { title: 'a'.repeat(256), category: 'Backend' },
          metadata,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should transform query string isCompleted="false" to boolean false', async () => {
      const metadata: ArgumentMetadata = {
        type: 'query',
        metatype: FilterTaskDto,
      };

      const transformed = await validationPipe.transform(
        { isCompleted: 'false', category: 'Backend' },
        metadata,
      );

      expect(transformed.isCompleted).toBe(false);
      expect(transformed.category).toBe('Backend');
    });

    it('should throw BadRequestException when isCompleted has invalid type in UpdateTaskDto', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: UpdateTaskDto,
      };

      await expect(
        validationPipe.transform({ isCompleted: 'not-a-boolean' }, metadata),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
