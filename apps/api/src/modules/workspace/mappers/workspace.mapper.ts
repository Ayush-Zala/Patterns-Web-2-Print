import { Injectable } from '@nestjs/common';
import { Workspace, WorkspaceStatus } from '@patterns/prisma';
import { WorkspaceResponseSummary, WorkspaceDetailResponse } from '../dto/responses.dto';

@Injectable()
export class WorkspaceMapper {
  toSummary(entity: Workspace): WorkspaceResponseSummary {
    return {
      id: entity.id,
      publicId: entity.publicId,
      code: entity.code,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      status: entity.deletedAt ? WorkspaceStatus.ARCHIVED : entity.status,
      defaultChannel: entity.defaultChannel,
      logoUrl: entity.logoUrl,
      logoFilename: entity.logoFilename,
      logoMimeType: entity.logoMimeType,
      logoSize: entity.logoSize,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toResponse(entity: Workspace): WorkspaceDetailResponse {
    return {
      ...this.toSummary(entity),
      settings: entity.settings as any,
      preferences: entity.preferences as any,
      ownerId: entity.ownerId,
      lastActivityAt: entity.lastActivityAt,
    };
  }
}
