import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PostService } from '../post.service';
import { Post } from '@database/typeorm/entities/post.entity';
import { PostResponseDto } from '../dto';

describe('PostService', () => {
  let service: PostService;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    category: 'Technology',
    description: 'Test Description',
    created_at: new Date('2026-10-26T00:00:00Z'),
    deleted_at: null,
  };

  const expectedDto = PostResponseDto.fromEntity(mockPost);

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((post) =>
      Promise.resolve({
        id: 1,
        created_at: mockPost.created_at,
        deleted_at: null,
        ...post,
      }),
    ),
    find: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === 1) return Promise.resolve(mockPost);
      return Promise.resolve(null);
    }),
    softRemove: jest.fn().mockImplementation((post) =>
      Promise.resolve({
        ...post,
        deleted_at: new Date('2026-10-26T01:00:00Z'),
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a post', async () => {
      const dto = {
        title: 'New Post',
        category: 'News',
        description: 'New Description',
      };
      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 1);
      expect(result.title).toEqual('New Post');
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return list of posts', async () => {
      const result = await service.findAll();
      expect(result).toEqual([expectedDto]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return post if exists', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(expectedDto);
    });

    it('should throw NotFoundException if post not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and save the post', async () => {
      const updateDto = { title: 'Changed' };
      const result = await service.update(1, updateDto);
      expect(result.title).toBe('Changed');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete the post', async () => {
      const result = await service.remove(1);
      expect(result.deleted_at).toBeDefined();
      expect(mockRepository.softRemove).toHaveBeenCalledWith(mockPost);
    });
  });
});
