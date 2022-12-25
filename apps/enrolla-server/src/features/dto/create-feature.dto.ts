export class CreateFeatureDto {
  tenantId: string;
  key: string;
  type: FeatureType;
  description?: string;
}
