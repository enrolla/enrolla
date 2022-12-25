export class FeatureUpdatedEvent {
    constructor(
        public readonly featureId: string,
        public readonly tenantId: string
    ) {}
}
