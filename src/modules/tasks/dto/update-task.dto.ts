import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoàn thành của công việc',
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoàn thành (isCompleted) phải là boolean' })
  isCompleted?: boolean;
}
