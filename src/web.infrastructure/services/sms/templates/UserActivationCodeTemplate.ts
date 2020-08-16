import { PROJECT_NAME } from '../../../../constants/Environments';

export class UserActivationCodeTemplate {
    static getTemplate(code: string): string {
        return `Your verification code from ${PROJECT_NAME} is: ${code}`;
    }
}
