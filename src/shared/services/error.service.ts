import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { NodeEnv } from '@core/enum';
import * as _ from 'lodash';

@Injectable()
export class ErrorService {
  constructor(private readonly configService: ConfigService) {}

  message(err: string | object, i18n: I18nContext, stackTrace: any) {
    const errorMessage = _.isArray(err['message'])
      ? err['message'][0]
      : err['message'];
    switch (err['error']) {
      case 'Bad Request':
        return this.combine(errorMessage, i18n, [], err);
      case 'Forbidden':
        return this.combine(errorMessage, i18n, [], err);
      case 'Internal Server Error':
        if (this.configService.get('NODE_ENV') == NodeEnv.DEVELOPMENT) {
          return this.combineDev(errorMessage, i18n, stackTrace, err);
        }
        return this.combine(errorMessage, i18n, [], err);
      case 'Not Found':
        return this.combine(errorMessage, i18n, [], err);
      case 'Unauthorized':
        return this.combine(errorMessage, i18n, [], err);
      case 'Unprocessable Entity':
        return this.handleUnprocessEntity(err, i18n);
      default:
        return this.combine(errorMessage, i18n, [], err);
    }
  }

  private handleUnprocessEntity(error: string | object, i18n: I18nContext) {
    const transformedError = this.transform(error['message'], i18n).flat();

    return this.combine('CUS-0401', i18n, transformedError, error);
  }

  private transform(errors: ValidationError[], i18n: I18nContext) {
    const transformedError = errors.map((err: ValidationError) => {
      return Object.values(err.constraints).map((value: string) => {
        return Object.assign(
          i18n.t(`errors.${value}`, {
            args: { property: err.property },
          }),
          { field: err.property },
        );
      });
    });

    return transformedError;
  }

  private combine(
    err_msg: string,
    i18n: I18nContext,
    errors: object[] = [],
    originalError?: string | object,
  ) {
    if (!i18n) {
      return originalError ?? { message: err_msg };
    }

    const translated = i18n.t(`errors.${err_msg}`);
    if (typeof translated === 'string') {
      return originalError ?? { message: err_msg };
    }

    return Object.assign({}, translated);
  }

  private combineDev(
    err_msg: string,
    i18n: I18nContext,
    stackTrace: any,
    originalError?: string | object,
  ) {
    if (!i18n) {
      return Object.assign({}, originalError ?? { message: err_msg }, {
        details: stackTrace,
      });
    }

    const translated = i18n.t(`errors.${err_msg}`);
    if (typeof translated === 'string') {
      return Object.assign(
        {},
        typeof originalError === 'object'
          ? originalError
          : { message: err_msg },
        { details: stackTrace },
      );
    }

    return Object.assign({}, translated, {
      details: stackTrace,
    });
  }
}
