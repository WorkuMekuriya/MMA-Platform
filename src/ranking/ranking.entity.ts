import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Fighter } from '../fighter/fighter.entity';
import { WeightClass } from '../weight-class/weight-class.entity';

@ObjectType()
@Entity()
export class Ranking {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Fighter)
  @ManyToOne(() => Fighter, (fighter: Fighter) => undefined, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fighter_id' })
  fighter: Fighter;

  @Field(() => WeightClass)
  @ManyToOne(
    () => WeightClass,
    (weightClass: WeightClass) => weightClass.rankings,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'weight_class_id' })
  weight_class: WeightClass;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  points: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  rank: number;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_updated: Date;
}
