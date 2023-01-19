import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEncryptionKeyInput {
  @Field(() => String)
  publicKey: string;
}
