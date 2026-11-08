import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Học NestJS cơ bản',
    description: 'Tiêu đề công việc (bắt buộc, từ 1 đến 255 ký tự)',
    minLength: 1,
    maxLength: 255,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Tiêu đề công việc không được để trống' })
  @IsString({ message: 'Tiêu đề công việc phải là chuỗi ký tự' })
  @Length(1, 255, {
    message: 'Tiêu đề công việc phải có độ dài từ 1 đến 255 ký tự',
  })
  title: string;

  @ApiProperty({
    example: 'Backend',
    description: 'Chủ đề của công việc',
    maxLength: 255,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Chủ đề công việc không được để trống' })
  @IsString({ message: 'Chủ đề công việc phải là chuỗi ký tự' })
  @MaxLength(255, {
    message: 'Chủ đề công việc không được vượt quá 255 ký tự',
  })
  category: string;

  @ApiPropertyOptional({
    example: 'Tìm hiểu về DTO, Controller, Service và Module',
    description: 'Mô tả chi tiết công việc (tùy chọn)',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả công việc phải là chuỗi ký tự' })
  description?: string;
}
