import { FeatureType } from "@prisma/client";

export class FeatureCreatedEvent {
  constructor(
    public readonly featureId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly type: FeatureType,
    public readonly createdAt: Date,
    public readonly description?: string
  ) {}
}
