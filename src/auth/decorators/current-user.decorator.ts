import { createParamDecorator } from '@nestjs/common';
import * as express from 'express';

import { ICurrentUserDTO } from '../interfaces/current-user.interface';

// @TODO: create this

// tslint:disable-next-line:variable-name typedef
export const CurrentUser = createParamDecorator(async (data: any, req: express.Request): Promise<ICurrentUserDTO> => {
  return {
    id: req.headers.authorization !== undefined ? req.headers.authorization : 'nobody'
  };
});
