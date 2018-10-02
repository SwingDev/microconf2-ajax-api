// tslint:disable:no-submodule-imports
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import * as express from 'express';
import { InstanceNotFoundException } from '../../repositories/exceptions/instance-not-found.exception';

@Catch(InstanceNotFoundException)
export class InstanceNotFoundExceptionFilter implements ExceptionFilter {
  // tslint:disable-next-line:no-reserved-keywords no-any
  public catch(exception: InstanceNotFoundException, host: ArgumentsHost): any {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: express.Response = ctx.getResponse();

    response
      .status(404)
      .json({
        statusCode: 404,
        timestamp: new Date().toISOString()
      });
  }
}
