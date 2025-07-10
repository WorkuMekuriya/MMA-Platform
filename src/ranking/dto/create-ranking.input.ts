import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateRankingInput {
  @Field((type) => Int)
  @IsInt()
  fighter_id: number;

  @Field((type) => Int)
  @IsInt()
  weight_class_id: number;

  @Field((type) => Int)
  @IsInt()
  points: number;

  @Field((type) => Int)
  @IsInt()
  rank: number;
}
