import { Field, InputType } from '@nestjs/graphql';
import { OrganizationManagerType } from '../organization-manager.interface';

@InputType()
export class ConfigureOrganizationManagerInput {
  @Field(() => OrganizationManagerType)
  type: OrganizationManagerType;
}
