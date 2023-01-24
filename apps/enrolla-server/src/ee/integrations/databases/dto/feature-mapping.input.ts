import { Field, InputType } from '@nestjs/graphql';
import { FeatureType } from '@prisma/client';

@InputType()
export class FeatureMappingInput {
  @Field(() => String)
  sourceName: string;

  @Field(() => String)
  destinationName: string;

  @Field(() => FeatureType)
  type: FeatureType;
}
