import { Controller, Post, Body, UseGuards, Logger, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as sdk from '@enrolla/node-server-sdk';

import { OrganizationCreatedInput } from './dto';
import { SvixWebhookAuthGuard } from '../authz/svix-webhook.guard';

@Controller({ path: 'backoffice/', version: '1' })
@UseGuards(SvixWebhookAuthGuard)
export class BackofficeController {
  private readonly logger = new Logger(BackofficeController.name);

  @Post('webhooks/organization')
  async organizationCreated(
    @Body() organizationCreatedDto: OrganizationCreatedInput
  ) {
    // programatically create a new customer (on Enrolla tennant) upon creation of a new organization in Propelauth
    await sdk.createCustomer({
      name: organizationCreatedDto.name,
      organizationId: organizationCreatedDto.org_id,
    });
  }
}
