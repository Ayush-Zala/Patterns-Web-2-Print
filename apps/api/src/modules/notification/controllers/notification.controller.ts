import { Controller, Get, Param, Patch, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PrismaService } from '@core/database/prisma/prisma.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for current user' })
  async list(
    @Req() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<{ success: boolean; data: any[]; meta: any }> {
    const userId = req.user.sub;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [data, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, readAt: null } }),
    ]);

    return {
      success: true,
      data,
      meta: {
        total,
        unreadCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(@Req() req: any): Promise<{ success: boolean; message: string }> {
    const userId = req.user.sub;
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { success: true, message: 'All notifications marked as read' };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markRead(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const userId = req.user.sub;
    const notification = await this.prisma.notification.findFirst({
      where: { publicId: id, userId },
    });

    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: { readAt: new Date() },
    });

    return { success: true, message: 'Notification marked as read' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  async delete(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const userId = req.user.sub;
    const notification = await this.prisma.notification.findFirst({
      where: { publicId: id, userId },
    });

    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }

    await this.prisma.notification.delete({
      where: { id: notification.id },
    });

    return { success: true, message: 'Notification deleted' };
  }
}
