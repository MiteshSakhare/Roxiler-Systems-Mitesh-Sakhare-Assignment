import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator to extract the authenticated user object
 * from the request (populated by Passport's JWT strategy).
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // If a specific property is requested (e.g. @CurrentUser('id')), return only that
    return data ? user?.[data] : user;
  },
);
