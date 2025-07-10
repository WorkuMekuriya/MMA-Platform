import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateRankingInput } from './create-ranking.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateRankingInput extends PartialType(CreateRankingInput) {
  @Field((type) => Int)
  @IsInt()
  id: number;
}
