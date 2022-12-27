import {
  ObjectType,
  Field,
  createUnionType,
  registerEnumType,
  Int,
} from '@nestjs/graphql';
import { FeatureType } from '@prisma/client';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType()
export class StringFeatureValue {
  @Field(() => String)
  value: string;
}

@ObjectType()
export class BooleanFeatureValue {
  @Field(() => Boolean)
  value: boolean;
}

@ObjectType()
export class IntFeatureValue {
  @Field(() => Int)
  value: number;
}

@ObjectType()
export class JSONFeatureValue {
  @Field(() => GraphQLJSON)
  value: typeof GraphQLJSON;
}

export const FeatureValueUnion = createUnionType({
  name: 'FeatureValueUnion',
  types: () =>
    [
      StringFeatureValue,
      BooleanFeatureValue,
      IntFeatureValue,
      JSONFeatureValue,
    ] as const,
  resolveType(value) {
    console.log(value);
    if (value.value === null) {
      return null;
    }
    if (value.value === undefined) {
      return null;
    }
    if (value.value.constructor === Number) {
      return IntFeatureValue;
    }
    if (value.value.constructor === String) {
      return StringFeatureValue;
    }
    if (value.value.constructor === Boolean) {
      return BooleanFeatureValue;
    }
    if (value.value.constructor === Object) {
      return JSONFeatureValue;
    }
  },
});

registerEnumType(FeatureType, {
  name: 'FeatureType',
});

@ObjectType()
export class Feature {
  @Field(() => String)
  id: string;

  @Field(() => String)
  key: string;

  @Field(() => FeatureType)
  type: FeatureType;

  @Field(() => FeatureValueUnion)
  defaultValue: typeof FeatureValueUnion;

  @Field(() => String)
  description?: string;

  @Field(() => Date)
  createdAt: Date;
}
