import { IsEmail, IsString } from 'class-validator';

export class ActiveClientCommandInput {
    @IsEmail()
    email: string;

    @IsString()
    activeKey: string;
}
