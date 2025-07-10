import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateFightInput {
  @Field((type) => Int)
  @IsInt()
  event_id: number;

  @Field((type) => Int)
  @IsInt()
  fighter_red_id: number;

  @Field((type) => Int)
  @IsInt()
  fighter_blue_id: number;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  winner_id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  method?: string;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  round?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  time?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  result_details?: string;
}
