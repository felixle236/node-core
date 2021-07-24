import { IsBoolean, IsDate } from 'class-validator';

export class UpdateUserOnlineStatusCommandInput {
    @IsBoolean()
    isOnline: boolean;

    @IsDate()
    onlineAt: Date;
}
