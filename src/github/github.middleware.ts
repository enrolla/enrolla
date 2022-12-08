import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { App, createNodeMiddleware } from 'octokit';
import { env } from 'process';

@Injectable()
export class GithubMiddleware implements NestMiddleware {
  app = new App({
    appId: env.GITHUB_APP_ID,
    privateKey: env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
    webhooks: { secret: env.GITHUB_APP_WEBHOOK_SECRET },
    oauth: {
      clientId: env.GITHUB_APP_CLIENT_ID,
      clientSecret: env.GITHUB_APP_CLIENT_SECRET,
    },
  });

  octokitMiddleware = createNodeMiddleware(this.app);

  use(req: any, res: any, next: (error?: any) => void) {
    console.log(this.octokitMiddleware);
    return this.octokitMiddleware(req, res, next);
  }

  constructor() {
    this.app.webhooks.on('push', this.handlePushEvent);
  }

  handlePushEvent(event: any) {
    console.log(event);
  }
}
