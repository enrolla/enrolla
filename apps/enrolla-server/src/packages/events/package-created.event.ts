import { FeatureInstanceDto } from '../dto/create-package.dto';

export class PackageCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly version: string,
    public readonly featureInstanceIds: string[],
    public readonly createdAt: Date,
    public readonly parentPackageId?: string,
    public readonly description?: string
  ) {}
}
