// tslint:disable:insecure-random

import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as express from 'express';

@Injectable()
export class RealLifeErrorsMiddleware implements NestMiddleware {
  public resolve(...args: any[]): MiddlewareFunction {
    return (req?: express.Request, res?: express.Response, next?: Function): void => {
      if (this.shouldGenerateError()) {
        this.returnError(res!);

        return;
      }

      next!();
    };
  }

  private shouldGenerateError(): boolean {
    // 10% error rate
    return Math.random() < 0.1;
  }

  private returnError(res: express.Response): void {
    res.sendStatus(502);
  }
}
