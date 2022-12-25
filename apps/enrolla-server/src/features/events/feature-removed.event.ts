export class FeatureRemovedEvent {
  constructor(
    public readonly featureId: string,
    public readonly tenantId: string
  ) {}
}
