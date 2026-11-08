import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterTaskDto {
  @ApiPropertyOptional({
    example: false,
    description: 'Lọc các công việc đã hoàn thành hoặc chưa hoàn thành',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({
    message:
      'Tham số lọc isCompleted phải là giá trị boolean (true hoặc false)',
  })
  isCompleted?: boolean;

  @ApiPropertyOptional({
    example: 'Backend',
    description: 'Lọc các công việc theo chủ đề (category)',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tham số lọc category phải là chuỗi ký tự' })
  category?: string;
}
