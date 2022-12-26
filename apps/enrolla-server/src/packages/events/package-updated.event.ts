export class PackageUpdatedEvent {
  constructor(
    public readonly featureId: string,
    public readonly tenantId: string
  ) {}
}
