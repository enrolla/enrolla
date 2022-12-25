import { FeatureType } from "@prisma/client";

export class CreateFeatureDto {
  tenantId: string;
  key: string;
  type: FeatureType;
  description?: string;
}