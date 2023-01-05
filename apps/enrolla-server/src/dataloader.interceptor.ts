/* Adapted from https://github.com/krislefeber/nestjs-dataloader */
import {
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { APP_INTERCEPTOR, ModuleRef, ContextIdFactory } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as DataLoader from 'dataloader';

/**
 * This interface will be used to generate the initial data loader.
 * The concrete implementation should be added as a provider to your module.
 */
export interface NestDataLoader<ID, Type> {
  /**
   * Should return a new instance of dataloader each time
   */
  generateDataLoader(tenantId: string): DataLoader<ID, Type>;
}

/**
 * Context key where get loader function will be stored.
 * This class should be added to your module providers like so:
 * {
 *     provide: APP_INTERCEPTOR,
 *     useClass: DataLoaderInterceptor,
 * },
 */
const NEST_LOADER_CONTEXT_KEY = 'NEST_LOADER_CONTEXT_KEY';

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}
  /**
   * @inheritdoc
   */
  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType().toString() !== 'graphql') {
      return next.handle();
    }

    const graphqlExecutionContext = GqlExecutionContext.create(context);
    const ctx = graphqlExecutionContext.getContext();

    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      ctx[NEST_LOADER_CONTEXT_KEY] = {
        contextId: ContextIdFactory.create(),
        getLoader: (type: string) => {
          if (ctx[type] === undefined) {
            try {
              ctx[type] = (async () => {
                return (
                  await this.moduleRef.resolve(
                    type,
                    ctx[NEST_LOADER_CONTEXT_KEY].contextId,
                    { strict: false }
                  )
                ).generateDataLoader(ctx.req.user.org_id);
              })();
            } catch (e) {
              throw new InternalServerErrorException(
                `The loader ${type} is not provided` + e
              );
            }
          }
          return ctx[type];
        },
      };
    }
    return next.handle();
  }
}

/**
 * The decorator to be used within the graphql method.
 */
export const Loader = createParamDecorator(
  async (
    data: Type<NestDataLoader<unknown, unknown>>,
    context: ExecutionContext & { [key: string]: unknown }
  ) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      throw new InternalServerErrorException(`
              You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}
            `);
    }
    return await ctx[NEST_LOADER_CONTEXT_KEY].getLoader(data);
  }
);
