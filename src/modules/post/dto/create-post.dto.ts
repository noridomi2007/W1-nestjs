import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Giới thiệu về NestJS',
    description: 'Tiêu đề của bài viết',
  })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  title: string;

  @ApiProperty({
    example: 'Công nghệ',
    description: 'Danh mục hoặc thể loại của bài viết',
  })
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsString({ message: 'Danh mục phải là chuỗi ký tự' })
  category: string;

  @ApiProperty({
    example: 'Bài viết chia sẻ kiến thức nền tảng và cách xây dựng ứng dụng với NestJS.',
    description: 'Nội dung mô tả chi tiết của bài viết',
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description: string;
}
