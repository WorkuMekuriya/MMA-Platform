import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Fighter } from '../fighter/fighter.entity';
import { Ranking } from '../ranking/ranking.entity';

@ObjectType()
@Entity()
export class WeightClass {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 50, unique: true })
  name: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  min_weight_kg: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  max_weight_kg: number;

  @Field(() => [Fighter], { nullable: true })
  @OneToMany(() => Fighter, (fighter: Fighter) => fighter.weight_class)
  fighters: Fighter[];

  @Field(() => [Ranking], { nullable: true })
  @OneToMany(() => Ranking, (ranking: Ranking) => ranking.weight_class)
  rankings: Ranking[];
}
