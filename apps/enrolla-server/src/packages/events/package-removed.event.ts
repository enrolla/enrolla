export class PackageRemovedEvent {
  constructor(
    public readonly packageId: string,
    public readonly tenantId: string
  ) {}
}
