import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const TenantId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let request;

    if (context.getType().toString() === 'graphql') {
      request = GqlExecutionContext.create(context).getContext().req;
    } else {
      request = context.switchToHttp().getRequest();
    }

    console.log(request.user.tenantId);

    return request.user && request.user.tenantId;
  }
);
