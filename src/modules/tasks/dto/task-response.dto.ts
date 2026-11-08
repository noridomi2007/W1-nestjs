import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@database/typeorm/entities/task.entity';

export class TaskResponseDto {
  @ApiProperty({
    example: 'a3b2c1d0-1234-4567-89ab-cdef01234567',
    description: 'Mã định danh duy nhất (UUID) của công việc',
  })
  id: string;

  @ApiProperty({
    example: 'Học NestJS cơ bản',
    description: 'Tiêu đề của công việc',
  })
  title: string;

  @ApiProperty({
    example: 'Backend',
    description: 'Chủ đề của công việc',
  })
  category: string;

  @ApiProperty({
    example: 'Tìm hiểu về DTO, Controller, Service và Module',
    nullable: true,
    description: 'Mô tả chi tiết của công việc',
  })
  description: string | null;

  @ApiProperty({
    example: false,
    description: 'Trạng thái hoàn thành của công việc',
  })
  isCompleted: boolean;

  @ApiProperty({
    example: '2026-10-27T08:30:00.000Z',
    description: 'Thời điểm tạo bản ghi',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-10-27T08:30:00.000Z',
    description: 'Thời điểm cập nhật bản ghi gần nhất',
  })
  updatedAt: Date;

  static fromEntity(entity: Task): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.category = entity.category;
    dto.description = entity.description ?? null;
    dto.isCompleted = entity.isCompleted;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static fromEntities(entities: Task[]): TaskResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
