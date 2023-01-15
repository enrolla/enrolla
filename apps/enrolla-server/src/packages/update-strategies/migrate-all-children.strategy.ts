import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePackageInput } from '../dto/update-package.input';

export async function migrateAllChildren(
  prismaService: PrismaService,
  id: string,
  updatePackageDto: UpdatePackageInput,
  tenantId: string
) {
  if (updatePackageDto.features) {
    await prismaService.package.update({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      data: {
        features: {
          deleteMany: {},
        },
      },
    });
  }
  await prismaService.package.update({
    where: {
      id_tenantId: {
        id,
        tenantId,
      },
    },
    data: {
      parentPackageId: updatePackageDto.parentPackageId,
      features: {
        create: updatePackageDto.features.map((feature) => {
          return {
            featureId: feature.featureId,
            value: feature.value as Prisma.JsonObject,
            tenantId: tenantId,
          };
        }),
      },
    },
  });

  return id;
}
