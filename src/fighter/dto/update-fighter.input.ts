import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateFighterInput } from './create-fighter.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateFighterInput extends PartialType(CreateFighterInput) {
  @Field((type) => Int)
  @IsInt()
  id: number;
}
