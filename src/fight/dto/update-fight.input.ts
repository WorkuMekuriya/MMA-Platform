import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateFightInput } from './create-fight.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateFightInput extends PartialType(CreateFightInput) {
  @Field((type) => Int)
  @IsInt()
  id: number;
}
