import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { Task } from '@database/typeorm/entities/task.entity';
import { TaskResponseDto } from '../dto';

describe('TasksService', () => {
  let service: TasksService;

  const validUuid = 'a3b2c1d0-1234-4567-89ab-cdef01234567';
  const nonExistentUuid = 'b4c3d2e1-1234-4567-89ab-cdef01234568';

  const mockTaskEntity: Task = {
    id: validUuid,
    title: 'Học NestJS cơ bản',
    category: 'Backend',
    description: 'Tìm hiểu về DTO, Controller, Service và Module',
    isCompleted: false,
    createdAt: new Date('2026-10-27T08:30:00.000Z'),
    updatedAt: new Date('2026-10-27T08:30:00.000Z'),
  };

  const expectedDto = TaskResponseDto.fromEntity(mockTaskEntity);

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
    })),
    save: jest.fn().mockImplementation((task) =>
      Promise.resolve({
        id: validUuid,
        createdAt: mockTaskEntity.createdAt,
        updatedAt: mockTaskEntity.updatedAt,
        ...task,
      }),
    ),
    find: jest.fn().mockResolvedValue([mockTaskEntity]),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === validUuid) {
        return Promise.resolve({ ...mockTaskEntity });
      }
      return Promise.resolve(null);
    }),
    remove: jest.fn().mockImplementation((task) => Promise.resolve(task)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new task with default isCompleted = false', async () => {
      const dto = {
        title: 'Học NestJS cơ bản',
        category: 'Backend',
        description: 'Tìm hiểu về DTO, Controller, Service và Module',
      };

      const result = await service.create(dto);

      expect(result).toEqual(expectedDto);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...dto,
        isCompleted: false,
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should set description to null when not provided', async () => {
      const dto = {
        title: 'Học TypeORM',
        category: 'Database',
      };

      const result = await service.create(dto);

      expect(result.description).toBeNull();
      expect(result.isCompleted).toBe(false);
      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'Học TypeORM',
        category: 'Database',
        description: null,
        isCompleted: false,
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks ordered by createdAt DESC when no filter provided', async () => {
      const result = await service.findAll();

      expect(result).toEqual([expectedDto]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
      });
    });

    it('should filter tasks by isCompleted and category', async () => {
      const result = await service.findAll({
        isCompleted: false,
        category: 'Backend',
      });

      expect(result).toEqual([expectedDto]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          isCompleted: false,
          category: 'Backend',
        },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return task if found', async () => {
      const result = await service.findOne(validUuid);
      expect(result).toEqual(expectedDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: validUuid },
      });
    });

    it('should throw NotFoundException with exact message if UUID does not exist', async () => {
      await expect(service.findOne(nonExistentUuid)).rejects.toThrow(
        new NotFoundException(`Tasks with ID ${nonExistentUuid} not found`),
      );
    });

    it('should throw NotFoundException without querying DB if ID is not a valid UUID', async () => {
      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        new NotFoundException('Tasks with ID invalid-uuid not found'),
      );
      expect(mockRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      const updateDto = {
        title: 'Học NestJS nâng cao',
        isCompleted: true,
      };

      const result = await service.update(validUuid, updateDto);

      expect(result.title).toBe('Học NestJS nâng cao');
      expect(result.isCompleted).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating a non-existent task', async () => {
      await expect(
        service.update(nonExistentUuid, { isCompleted: true }),
      ).rejects.toThrow(
        new NotFoundException(`Tasks with ID ${nonExistentUuid} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should remove and return the deleted task', async () => {
      const result = await service.remove(validUuid);

      expect(result).toEqual(expectedDto);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTaskEntity);
    });

    it('should throw NotFoundException when deleting a non-existent task', async () => {
      await expect(service.remove(nonExistentUuid)).rejects.toThrow(
        new NotFoundException(`Tasks with ID ${nonExistentUuid} not found`),
      );
    });
  });
});
