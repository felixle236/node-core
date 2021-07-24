import { PROJECT_NAME } from '@configs/Configuration';

export class UserActivationCodeTemplate {
    static getTemplate(code: string): string {
        return `Your verification code from ${PROJECT_NAME} is: ${code}`;
    }
}
