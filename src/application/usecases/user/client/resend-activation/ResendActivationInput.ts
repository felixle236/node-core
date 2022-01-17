import { IsEmail } from 'shared/decorators/ValidationDecorator';

export class ResendActivationInput {
  @IsEmail()
  email: string;
}
