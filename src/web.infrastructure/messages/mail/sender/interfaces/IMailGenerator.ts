import * as Mailgen from 'mailgen';

export interface IMailGenerator {
    generatePlaintext(params: Mailgen.Content): string;

    generateHtmlContent(params: Mailgen.Content): string;
}
