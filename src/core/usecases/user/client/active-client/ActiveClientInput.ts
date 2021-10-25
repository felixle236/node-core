import { IsEmail, IsString } from '@shared/decorators/ValidationDecorator';

export class ActiveClientInput {
    @IsEmail()
    email: string;

    @IsString()
    activeKey: string;
}
