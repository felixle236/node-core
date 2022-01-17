import { TranslateOptions } from 'i18n';
import { IsString } from 'shared/decorators/ValidationDecorator';

export class BaseError extends Error {
  httpCode: number;

  @IsString()
  code: string;

  @IsString()
  override name: string;

  @IsString()
  override message: string;

  translate(t: (phraseOrOptions: string | TranslateOptions, ...replace: string[]) => string): void {
    const obj = JSON.parse(this.message);
    const params = (obj.params || []).map((param) => {
      if (typeof param === 'object' && param.t) {
        return t('label.' + param.t);
      }
      return param;
    });

    this.message = t('message.' + obj.key, ...params);
  }
}
