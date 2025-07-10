import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateEventInput } from './create-event.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field((type) => Int)
  @IsInt()
  id: number;
}
