import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

@InputType()
export class CreateFighterInput {
  @Field()
  @IsString()
  first_name: string;

  @Field()
  @IsString()
  last_name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nickname?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nationality?: string;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  height_cm?: number;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  weight_kg?: number;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  reach_cm?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  stance?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gym?: string;

  @Field((type) => Int)
  @IsInt()
  weight_class_id: number;
}
