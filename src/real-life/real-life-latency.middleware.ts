// tslint:disable:insecure-random

import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as express from 'express';

@Injectable()
export class RealLifeLatencyMiddleware implements NestMiddleware {
  public resolve(...args: unknown[]): MiddlewareFunction {
    return (req?: express.Request, res?: express.Response, next?: Function): void => {
      setTimeout(() => next!(), this.requestLatencyInMs());
    };
  }

  private requestLatencyInMs(): number {
    // Random latency in the range of 50 ~ 300ms

    return Math.floor(Math.random() * 250) + 50;
  }
}
