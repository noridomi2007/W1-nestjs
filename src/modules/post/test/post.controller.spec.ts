import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../post.controller';
import { PostService } from '../post.service';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    category: 'Technology',
    description: 'Test Description',
    created_at: new Date('2026-10-26T00:00:00Z'),
    deleted_at: null,
  };

  const mockPostService = {
    create: jest.fn().mockResolvedValue(mockPost),
    findAll: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
    update: jest.fn().mockResolvedValue({ ...mockPost, title: 'Updated Post' }),
    remove: jest.fn().mockResolvedValue({
      ...mockPost,
      deleted_at: new Date('2026-10-26T01:00:00Z'),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const dto = {
        title: 'Test Post',
        category: 'Technology',
        description: 'Test Description',
      };
      const result = await controller.create(dto);
      expect(result).toEqual(mockPost);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockPost]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single post by id', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockPost);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update and return a post', async () => {
      const updateDto = { title: 'Updated Post' };
      const result = await controller.update(1, updateDto);
      expect(result.title).toEqual('Updated Post');
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should soft delete and return the post with deleted_at', async () => {
      const result = await controller.remove(1);
      expect(result.deleted_at).toBeDefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
