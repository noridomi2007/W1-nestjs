import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '@database/typeorm/entities/post.entity';
import { CreatePostDto, UpdatePostDto, PostResponseDto } from './dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const post = this.postRepository.create(createPostDto);
    const savedPost = await this.postRepository.save(post);
    return PostResponseDto.fromEntity(savedPost);
  }

  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      order: { created_at: 'DESC' },
    });
    return PostResponseDto.fromEntities(posts);
  }

  async findOne(id: number): Promise<PostResponseDto> {
    const post = await this.findEntityById(id);
    return PostResponseDto.fromEntity(post);
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const post = await this.findEntityById(id);
    const updatedPost = await this.postRepository.save(
      Object.assign(post, updatePostDto),
    );
    return PostResponseDto.fromEntity(updatedPost);
  }

  async remove(id: number): Promise<PostResponseDto> {
    const post = await this.findEntityById(id);
    const removedPost = await this.postRepository.softRemove(post);
    return PostResponseDto.fromEntity(removedPost);
  }

  private async findEntityById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }
}
