import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateProfileDto extends PickType(CreateUserDto, [
  'displayName',
  'phone',
  'avatarUrl',
  'avatarFilename',
  'avatarMimeType',
  'avatarSize',
] as const) {}
