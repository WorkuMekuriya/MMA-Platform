import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateWeightClassInput } from './create-weight-class.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateWeightClassInput extends PartialType(
  CreateWeightClassInput,
) {
  @Field((type) => Int)
  @IsInt()
  id: number;
}
