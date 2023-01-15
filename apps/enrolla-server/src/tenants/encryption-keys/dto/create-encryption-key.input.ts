import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEncryptionKeyInput {
  @Field(() => String)
  privateKey: string;

  @Field(() => String)
  publicKey: string;
}
