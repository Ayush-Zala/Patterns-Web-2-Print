import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateStatusDto extends PickType(CreateUserDto, ['status'] as const) {}
