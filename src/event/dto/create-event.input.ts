import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsDate } from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  location?: string;

  @Field()
  @IsDate()
  date: Date;
}
