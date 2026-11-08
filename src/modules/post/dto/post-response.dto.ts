import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@database/typeorm/entities/post.entity';

export class PostResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Mã định danh duy nhất của bài viết',
  })
  id: number;

  @ApiProperty({
    example: 'Giới thiệu về NestJS',
    description: 'Tiêu đề của bài viết',
  })
  title: string;

  @ApiProperty({
    example: 'Công nghệ',
    description: 'Danh mục của bài viết',
  })
  category: string;

  @ApiProperty({
    example: 'Bài viết chia sẻ kiến thức nền tảng và cách xây dựng ứng dụng với NestJS.',
    description: 'Nội dung mô tả của bài viết',
  })
  description: string;

  @ApiProperty({
    example: '2026-10-26T14:30:00.000Z',
    description: 'Thời điểm tạo bài viết',
  })
  created_at: Date;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Thời điểm xóa bài viết (null nếu chưa bị xóa)',
  })
  deleted_at: Date | null;

  static fromEntity(entity: Post): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.category = entity.category;
    dto.description = entity.description;
    dto.created_at = entity.created_at;
    dto.deleted_at = entity.deleted_at ?? null;
    return dto;
  }

  static fromEntities(entities: Post[]): PostResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
