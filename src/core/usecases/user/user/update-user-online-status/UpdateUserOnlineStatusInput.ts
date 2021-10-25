import { IsBoolean, IsDate } from '@shared/decorators/ValidationDecorator';

export class UpdateUserOnlineStatusInput {
    @IsBoolean()
    isOnline: boolean;

    @IsDate()
    onlineAt: Date;
}
