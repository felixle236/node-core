import { IsString } from 'class-validator';

export class UpdateMyPasswordByEmailCommandInput {
    @IsString()
    oldPassword: string;

    @IsString()
    password: string;
}
