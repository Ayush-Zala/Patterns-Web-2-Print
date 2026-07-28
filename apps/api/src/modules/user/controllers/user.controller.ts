import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
  UpdateStatusDto,
  UserQueryDto,
} from '../dto';
import { UserMapper } from '../mappers/user.mapper';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser('sub') currentUserId: string) {
    const user = await this.userService.create(createUserDto, currentUserId);
    return {
      success: true,
      message: 'User created successfully.',
      data: this.userMapper.toResponse(user),
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of users' })
  async findAll(@Query() query: UserQueryDto) {
    const { data, meta } = await this.userService.findMany(query);
    return {
      success: true,
      data: data.map((user) => this.userMapper.toSummary(user)),
      meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return {
      success: true,
      data: this.userMapper.toResponse(user),
    };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update your profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    const user = await this.userService.updateProfile(
      currentUserId,
      updateProfileDto,
      currentUserId,
    );
    return {
      success: true,
      message: 'Profile updated successfully.',
      data: this.userMapper.toProfile(user),
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    const user = await this.userService.updateStatus(id, updateStatusDto.status!, currentUserId);
    return {
      success: true,
      message: 'Status updated successfully.',
      data: this.userMapper.toSummary(user),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    const user = await this.userService.update(id, updateUserDto, currentUserId);
    return {
      success: true,
      message: 'User updated successfully.',
      data: this.userMapper.toResponse(user),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser('sub') currentUserId: string) {
    await this.userService.softDelete(id, currentUserId);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted user' })
  @ApiResponse({ status: 200, description: 'User restored successfully' })
  async restore(@Param('id') id: string, @CurrentUser('sub') currentUserId: string) {
    const user = await this.userService.restore(id, currentUserId);
    return {
      success: true,
      message: 'User restored successfully.',
      data: this.userMapper.toResponse(user),
    };
  }
}
