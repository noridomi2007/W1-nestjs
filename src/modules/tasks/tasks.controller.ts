import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  FilterTaskDto,
  TaskResponseDto,
  UpdateTaskDto,
} from './dto';

@ApiTags('Tasks')
@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo mới một công việc',
    description:
      'Tạo mới công việc với tiêu đề (title), chủ đề (category) và mô tả tùy chọn (description).',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Công việc được tạo thành công.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc',
    description:
      'Trả về danh sách công việc, hỗ trợ lọc theo trạng thái hoàn thành (isCompleted) và chủ đề (category).',
  })
  @ApiQuery({
    name: 'isCompleted',
    required: false,
    type: Boolean,
    description: 'Lọc các task hoàn thành (true) hoặc chưa hoàn thành (false)',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Lọc công việc theo chủ đề (category)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách công việc thành công.',
    type: [TaskResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Tham số truy vấn (query params) không hợp lệ.',
  })
  findAll(@Query() filterDto: FilterTaskDto): Promise<TaskResponseDto[]> {
    return this.tasksService.findAll(filterDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết một công việc',
    description: 'Tìm kiếm và trả về thông tin chi tiết của công việc theo ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID của công việc',
    example: 'a3b2c1d0-1234-4567-89ab-cdef01234567',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tìm thấy công việc.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy công việc với ID được cung cấp.',
  })
  findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật thông tin công việc',
    description:
      'Cập nhật một hoặc nhiều trường (title, category, description, isCompleted) của công việc theo ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID của công việc cần cập nhật',
    example: 'a3b2c1d0-1234-4567-89ab-cdef01234567',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật công việc thành công.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu cập nhật không hợp lệ.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy công việc cần cập nhật.',
  })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa một công việc',
    description: 'Xóa công việc khỏi hệ thống theo ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID của công việc cần xóa',
    example: 'a3b2c1d0-1234-4567-89ab-cdef01234567',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa công việc thành công.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy công việc cần xóa.',
  })
  remove(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.tasksService.remove(id);
  }
}
