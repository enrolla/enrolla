import { Webhook } from 'svix';
import { env } from 'process';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class SvixWebhookAuthGuard implements CanActivate {
  private static readonly wh = env.SVIX_WEBHOOK_SIGNING_SECRET
    ? new Webhook(env.SVIX_WEBHOOK_SIGNING_SECRET)
    : null;
  private static readonly logger = new Logger(SvixWebhookAuthGuard.name);

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (!SvixWebhookAuthGuard.wh) {
      return false;
    }
    const request = context.switchToHttp().getRequest();

    try {
      const payload = request.rawBody.toString('utf8');
      SvixWebhookAuthGuard.wh.verify(payload, request.headers);
      return true;
    } catch (error) {
      SvixWebhookAuthGuard.logger.error(
        'Failed to verify Svix webhook',
        error.stack
      );
      return false;
    }
  }
}
