import { Injectable } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { OrganizationsService } from '../organizations/organizations.service';
import { Organization } from '../organizations/entities/organization.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from './entities/customer.entity';
import { FeatureValue } from '../feature-instances/entities/feature-value.entity';
import { FeatureInstancesService } from '../feature-instances/feature-instances.service';
import { PackagesService } from '../packages/packages.service';
import {
  getConfigurationFromFeatures,
  mergeConfigurations,
} from '../utils/configuration.utils';
import { UpdateCustomerByOrgIdInput, UpdateCustomerInput } from './dto';
import { FeaturesService } from '../features/features.service';
import { validateFeatureInputType } from '../features/validators';
import { Feature } from '@enrolla/graphql-codegen';
import { SecretsService } from '../secrets/secrets.service';

@Injectable()
export class CustomersService {
  constructor(
    private prismaService: PrismaService,
    private organizationsService: OrganizationsService,
    private featureInstancesService: FeatureInstancesService,
    private packagesService: PackagesService,
    private featuresService: FeaturesService,
    private secretsService: SecretsService
  ) {}

  async create(createCustomerInput: CreateCustomerInput, tenantId: string) {
    let organization: Organization;
    let organizationId = createCustomerInput.organizationId;

    if (createCustomerInput.organizationId === null) {
      if (createCustomerInput.createOrganizationName === null) {
        throw new Error('Must specify name for organization to be created');
      }
      organization = await this.organizationsService.create(
        { name: createCustomerInput.createOrganizationName },
        tenantId
      );

      organizationId = organization.id;
    }

    return await this.prismaService.customer.create({
      data: {
        name: createCustomerInput.name,
        organizationId,
        tenantId,
        packageId: createCustomerInput.packageId,
        features: {
          create: createCustomerInput.features?.map((feature) => ({
            featureId: feature.featureId,
            value: feature.value,
            tenantId,
          })),
        },
        secrets: {
          create: createCustomerInput.secrets?.map((secret) => ({
            tenantId,
            key: secret.key,
            value: secret.value,
            ephemPubKey: secret.ephemPubKey,
            nonce: secret.nonce,
          })),
        },
      },
    });
  }

  async findAll(tenantId: string) {
    return await this.prismaService.customer.findMany({
      where: {
        tenantId,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return await this.prismaService.customer.findUnique({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });
  }

  private static updateCustomerData(
    tenantId: string,
    customerInput: Partial<CreateCustomerInput>
  ) {
    const { features, secrets, name, packageId } = customerInput;

    return {
      tenantId,
      ...(!!name && { name }),
      ...(!!packageId && { packageId }),
      ...(!!features && {
        features: {
          deleteMany: {
            featureId: {
              in: customerInput.features?.map((feature) => feature.featureId),
            },
          },
          create: customerInput.features?.map((feature) => ({
            featureId: feature.featureId,
            value: feature.value,
            tenantId,
          })),
        },
      }),
      ...(!!secrets && {
        secrets: {
          deleteMany: {
            key: { in: customerInput.secrets?.map((secret) => secret.key) },
          },
          create: customerInput.secrets?.map((secret) => ({
            tenantId,
            key: secret.key,
            value: secret.value,
            ephemPubKey: secret.ephemPubKey,
            nonce: secret.nonce,
          })),
        },
      }),
    };
  }

  async update(
    id: string,
    customerInput: UpdateCustomerInput,
    tenantId: string
  ) {
    return await this.prismaService.customer.update({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      data: CustomersService.updateCustomerData(tenantId, customerInput),
    });
  }

  async updateByOrgId(
    organizationId: string,
    customerInput: UpdateCustomerByOrgIdInput,
    tenantId: string
  ) {
    const features = customerInput.featuresByKey?.length
      ? await this.validateAndTransformFeatures(customerInput, tenantId)
      : [];

    await this.validateSecrets(customerInput, tenantId);

    return await this.prismaService.customer.update({
      where: {
        tenantId_organizationId: {
          organizationId,
          tenantId,
        },
      },
      data: CustomersService.updateCustomerData(tenantId, {
        ...customerInput,
        features,
      }),
    });
  }

  async remove(id: string, tenantId: string) {
    return await this.prismaService.customer.delete({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });
  }

  async getConfiguration(
    customerId: string,
    tenantId: string
  ): Promise<FeatureValue[]> {
    const packageFeatures = await this.featureInstancesService.findByCustomerId(
      customerId,
      tenantId
    );

    return getConfigurationFromFeatures(packageFeatures);
  }

  async getEffectiveConfiguration(
    customer: Pick<Customer, 'id' | 'packageId'>,
    tenantId: string
  ) {
    const customerConfig = await this.getConfiguration(customer.id, tenantId);

    const packageConfig = await this.packagesService.getEffectiveConfiguration(
      customer.packageId,
      tenantId
    );

    const enrichedCustomerConfig = customerConfig.map((cc) => {
      const pc = packageConfig.find((pc) => pc.featureId === cc.featureId);
      return {
        ...pc,
        ...cc,
      };
    });

    return mergeConfigurations(enrichedCustomerConfig, packageConfig);
  }

  async validateAndTransformFeatures(
    customerInput: UpdateCustomerByOrgIdInput,
    tenantId: string
  ) {
    const availableFeatures = await this.featuresService.findAll(tenantId);

    return customerInput.featuresByKey?.map(({ key, value }) => {
      const feature = availableFeatures?.find((f) => f.key === key);
      if (!feature) {
        throw new Error(`Feature with key "${key}" not found.`);
      }

      validateFeatureInputType(value?.['value'], feature as Feature);

      return {
        featureId: feature.id,
        value,
      };
    });
  }

  async validateSecrets(
    customerInput: UpdateCustomerByOrgIdInput,
    tenantId: string
  ) {
    if (!customerInput.secrets) return;

    const availalbeSecretKeys = (
      await this.secretsService.findAllKeysForTennant(tenantId)
    ).map((s) => s.key);

    customerInput.secrets.forEach((secret) => {
      if (!availalbeSecretKeys.includes(secret.key)) {
        throw new Error(`Secret with key "${secret.key}" not found.`);
      }
    });
  }
}
