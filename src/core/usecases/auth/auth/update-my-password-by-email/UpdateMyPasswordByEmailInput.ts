import { IsString } from '@shared/decorators/ValidationDecorator';

export class UpdateMyPasswordByEmailInput {
    @IsString()
    oldPassword: string;

    @IsString()
    password: string;
}
