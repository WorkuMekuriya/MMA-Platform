import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt } from 'class-validator';

@InputType()
export class CreateWeightClassInput {
  @Field()
  @IsString()
  name: string;

  @Field((type) => Int)
  @IsInt()
  min_weight_kg: number;

  @Field((type) => Int)
  @IsInt()
  max_weight_kg: number;
}
