import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, PostResponseDto } from './dto';

@ApiTags('Post')
@Controller('v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo bài viết mới',
    description: 'Tạo một bài viết mới với tiêu đề, danh mục và mô tả.',
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Bài viết đã được tạo thành công.',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  create(@Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
    return this.postService.create(createPostDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả bài viết',
    description:
      'Trả về danh sách tất cả bài viết chưa bị xóa, sắp xếp theo thời gian tạo mới nhất.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách bài viết thành công.',
    type: [PostResponseDto],
  })
  findAll(): Promise<PostResponseDto[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết một bài viết theo ID',
    description: 'Tìm kiếm và trả về thông tin bài viết theo mã ID.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID của bài viết',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tìm thấy bài viết.',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bài viết với ID được cung cấp.',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto> {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật bài viết theo ID',
    description:
      'Cập nhật một hoặc nhiều thông tin (title, category, description) của bài viết.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID của bài viết cần cập nhật',
    example: 1,
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật bài viết thành công.',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bài viết cần cập nhật.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu cập nhật không hợp lệ.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa mềm bài viết theo ID',
    description:
      'Thực hiện xóa mềm bài viết bằng cách cập nhật trường deleted_at.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID của bài viết cần xóa',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Xóa bài viết thành công, trả về bài viết kèm timestamp deleted_at.',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy bài viết cần xóa.',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto> {
    return this.postService.remove(id);
  }
}
