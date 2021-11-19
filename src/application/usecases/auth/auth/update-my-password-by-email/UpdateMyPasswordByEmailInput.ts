import { IsString, Length } from 'shared/decorators/ValidationDecorator';

export class UpdateMyPasswordByEmailInput {
    @IsString()
    @Length(6, 20)
    oldPassword: string;

    @IsString()
    @Length(6, 20)
    password: string;
}
