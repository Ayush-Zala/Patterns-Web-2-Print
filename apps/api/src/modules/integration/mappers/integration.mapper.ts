import { Injectable } from '@nestjs/common';
import { Integration } from '@patterns/prisma';
import { IntegrationResponseDto } from '../dto/integration-response.dto';

@Injectable()
export class IntegrationMapper {
  toResponseDto(entity: Integration): IntegrationResponseDto {
    const dto = new IntegrationResponseDto();
    dto.id = entity.id;
    dto.workspaceId = entity.workspaceId;
    dto.type = entity.type;
    dto.displayName = entity.displayName;
    dto.status = entity.status;
    dto.configuration = entity.configuration;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
