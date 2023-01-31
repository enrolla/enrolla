import { ConfigurationsService } from '../../../../configurations/configurations.service';
import * as admin from 'firebase-admin';
import { getAuth, ListUsersResult, UserRecord } from 'firebase-admin/auth';
import { Organization } from '../entities/organization.entity';
import { OrganizationManager } from '../../../../organizations/organization-managers/organization-manager.interface';
import { OrganizationCreateInput } from '../../../../organizations/organization-managers/dto/organization-create.input';
import { Integration } from '../../integration.interface';
import {
  ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
  ORGANIZATION_MANAGER_TYPE,
  OrganizationManagerType,
  ORGANIZATION_MANAGER_CONFIGURATION_KEY,
  ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY,
} from '../../../../organizations/constants';
import * as sdk from '@enrolla/node-server-sdk';
import { ConfigureFirebaseOrganizationManagerInput } from '../dto';
import { Logger } from '@nestjs/common';

export class FirebaseOrganizationManager
  implements OrganizationManager, Integration
{
  private firebaseClients: Map<string, admin.app.App> = new Map();
  private static logger = new Logger(FirebaseOrganizationManager.name);

  constructor(private configurationsService: ConfigurationsService) {}

  async isEnabled(tenantId: string): Promise<boolean> {
    const enabledManager =
      this.configurationsService.getValue<OrganizationManagerType>(
        tenantId,
        ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY
      );

    return enabledManager === ORGANIZATION_MANAGER_TYPE.FIREBASE;
  }

  async isConfigured(tenantId: string): Promise<boolean> {
    return false;
  }

  async getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization> {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('Firebase integration is disabled');
    }

    const firebaseUser: UserRecord = await getAuth(
      this.getFirebaseClient(tenantId)
    ).getUser(organizationId);

    return { id: firebaseUser.uid, name: firebaseUser.displayName };
  }

  async getOrganizations(tenantId: string): Promise<Organization[]> {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('Firebase integration is disabled');
    }

    const res: ListUsersResult = await getAuth(
      this.getFirebaseClient(tenantId)
    ).listUsers();

    return res.users.map((user) => {
      return { id: user.uid, name: user.displayName || 'unknown' };
    });
  }

  async createOrganization(
    tenantId: string,
    organizationCreateInput: OrganizationCreateInput
  ): Promise<Organization> {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('Firebase integration is disabled');
    }

    const user = await getAuth(this.getFirebaseClient(tenantId)).createUser({
      displayName: organizationCreateInput.name,
    });

    return { id: user.uid, name: user.displayName };
  }

  async removeOrganization(tenantId: string, organizationId: string) {
    throw new Error('Method not implemented.');
  }

  private getFirebaseClient(tenantId: string): admin.app.App {
    if (this.firebaseClients.has(tenantId)) {
      return this.firebaseClients.get(tenantId);
    }

    const config = this.configurationsService.getValue<Record<string, string>>(
      tenantId,
      ORGANIZATION_MANAGER_CONFIGURATION_KEY
    );

    const privateKey = this.configurationsService.getSecretValue(
      tenantId,
      ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY
    );

    const firebaseClient = admin.initializeApp(
      {
        credential: admin.credential.cert({
          ...config,
          privateKey: privateKey.replace(/\\n/gm, '\n'),
        }),
      },
      tenantId
    );

    this.firebaseClients.set(tenantId, firebaseClient);

    return firebaseClient;
  }

  static async configure(
    tenantId: string,
    input: ConfigureFirebaseOrganizationManagerInput
  ) {
    try {
      await FirebaseOrganizationManager.testConfigValidity(input, tenantId);
    } catch (error) {
      return false;
    }
    const featuresToUpdate = [
      {
        key: ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
        value: ORGANIZATION_MANAGER_TYPE.FIREBASE,
      },
      {
        key: ORGANIZATION_MANAGER_CONFIGURATION_KEY,
        value: {
          projectId: input.projectId,
          clientEmail: input.clientEmail,
        },
      },
    ];
    const secretsToUpdate = [
      {
        key: ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY,
        value: input.privateKey,
      },
    ];
    try {
      await Promise.all([
        sdk.updateCustomerFeatures(tenantId, ...featuresToUpdate),
        sdk.updateCustomerSecrets(tenantId, ...secretsToUpdate),
      ]);
      this.logger.log(
        `Successfully configured Firebase Organization Manager for tenant ${tenantId}.`
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to configure Auth0 Organization Manager for tenant ${tenantId}. Reverting to NONE configuration.`,
        error.stack
      );

      await sdk.updateCustomerFeatures(tenantId, {
        // fallbak to NONE on error
        key: ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
        value: ORGANIZATION_MANAGER_TYPE.NONE,
      });

      return false;
    }
  }

  private static async testConfigValidity(
    input: ConfigureFirebaseOrganizationManagerInput,
    tenantId: string
  ) {
    try {
      const testFirebaseClient = admin.initializeApp(
        {
          credential: admin.credential.cert({
            ...input,
            privateKey: input.privateKey.replace(/\\n/gm, '\n'),
          }),
        },
        `${tenantId}-test`
      );

      await getAuth(testFirebaseClient).listUsers(1);
    } catch (error) {
      this.logger.error(
        `Invalid Firebase Organization manager configuration for tenant: ${tenantId}.`,
        error.stack
      );

      throw error;
    }
  }
}
