import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { LoginDto } from '../dto/login.dto';
import { LogoutDto } from '../dto/logout.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { Request, Response } from 'express';
import { JwtPayload } from '@patterns/types';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authMapper: AuthMapper,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    const result = await this.authService.login(loginDto, ip, userAgent);

    res.cookie(AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax',
      path: process.env.COOKIE_PATH || '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return this.authMapper.toAuthResponse(result.accessToken, result.expiresIn, result.user as any);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const ip = req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    const result = await this.authService.refresh(refreshToken, ip, userAgent);

    res.cookie(AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax',
      path: process.env.COOKIE_PATH || '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(
    @Body() logoutDto: LogoutDto,
    @CurrentUser('sessionId') sessionId: string,
    @CurrentUser('sub') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(sessionId, logoutDto.allDevices || false, userId);

    res.clearCookie(AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN, {
      path: process.env.COOKIE_PATH || '/',
    });

    return this.authMapper.toLogoutResponse();
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    await this.authService.forgotPassword(email);
    // Generic response to prevent email enumeration
    return {
      success: true,
      message: 'If an account with that email exists, we sent a password reset link.',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token' })
  async resetPassword(@Body() body: any) {
    if (!body.token || !body.password) {
      throw new BadRequestException('Token and password are required');
    }
    await this.authService.resetPassword(body.token, body.password);
    return { success: true, message: 'Password has been reset successfully. You can now log in.' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current password' })
  async changePassword(@Body() body: any, @CurrentUser('sub') userId: string) {
    await this.authService.changePassword(userId, body.currentPassword, body.newPassword);
    return { success: true, message: 'Password changed successfully.' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@CurrentUser() user: JwtPayload) {
    return { success: true, data: { user: { id: user.sub, email: user.email } } };
  }
}
