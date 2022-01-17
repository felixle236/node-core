import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { IsEnum, IsOptional, IsString } from 'shared/decorators/ValidationDecorator';
import { PaginationRequest } from 'shared/usecase/PaginationRequest';

export class FindClientInput extends PaginationRequest {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;
}
