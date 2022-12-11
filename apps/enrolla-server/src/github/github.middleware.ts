import { Injectable, NestMiddleware } from '@nestjs/common';
import { App, createNodeMiddleware, Octokit } from 'octokit';
import { env } from 'process';
import { createAppAuth } from '@octokit/auth-app';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class GithubMiddleware implements NestMiddleware {
  app;
  octokitMiddleware;
  privateKey: string;

  constructor() {
    this.app = new App({
      appId: env.GITHUB_APP_ID,
      privateKey: env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
      webhooks: { secret: env.GITHUB_APP_WEBHOOK_SECRET },
      oauth: {
        clientId: env.GITHUB_APP_CLIENT_ID,
        clientSecret: env.GITHUB_APP_CLIENT_SECRET,
      },
    });
    this.octokitMiddleware = createNodeMiddleware(this.app);
    this.app.webhooks.on('push', this.handlePushEvent.bind(this));
  }

  use(req: any, res: any, next: (error?: any) => void) {
    return this.octokitMiddleware(req, res, next);
  }

  async handlePushEvent(event: any) {
    if (event.payload.ref !== 'refs/heads/main') {
      return;
    }

    if (event.payload.commits.length === 0) {
      return;
    }

    if (
      !event.payload.commits.some(
        (commit: any) =>
          commit.added.includes('schema.json') ||
          commit.modified.includes('schema.json') ||
          commit.removed.includes('schema.json'),
      )
    ) {
      return;
    }

    const octokit = await this.app.getInstallationOctokit(
      event.payload.installation.id,
    );

    const schema = await octokit.rest.repos.getContent({
      owner: event.payload.repository.owner.login,
      repo: event.payload.repository.name,
      path: 'schema.json',
      ref: 'refs/heads/main',
    });

    console.log(Buffer.from(schema.data.content, 'base64').toString('utf-8'));
  }
}
