import { Injectable, NestMiddleware } from '@nestjs/common';
import { App, createNodeMiddleware, Octokit } from 'octokit';
import { env } from 'process';
import { createAppAuth } from '@octokit/auth-app';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';

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
    return this.octokitMiddleware(req, res, next);
  }

  constructor() {
    this.app.webhooks.on('push', this.handlePushEvent);
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

    const appOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: env.GITHUB_APP_ID,
        privateKey: env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    const installationOctokit = appOctokit.auth({
      type: 'installation',
      installationId: event.payload.installation.id,
      factory: ({ octokitOptions, ...auth }) =>
        new Octokit({ ...octokitOptions, auth }),
    });

    const schema = await appOctokit.rest.repos.getContent({
      owner: event.payload.repository.owner.login,
      repo: event.payload.repository.name,
      path: 'schema.json',
      ref: 'refs/heads/main',
    });

    console.log(schema);
  }
}
