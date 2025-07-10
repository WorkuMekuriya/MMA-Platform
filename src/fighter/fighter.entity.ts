import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { WeightClass } from '../weight-class/weight-class.entity';
import { Fight } from '../fight/fight.entity';

@ObjectType()
@Entity()
export class Fighter {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 50 })
  first_name: string;

  @Field()
  @Column({ length: 50 })
  last_name: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  nickname: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  nationality: string;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  height_cm: number;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  weight_kg: number;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  reach_cm: number;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  stance: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  gym: string;

  @Field(() => WeightClass, { nullable: true })
  @ManyToOne(
    () => WeightClass,
    (weightClass: WeightClass) => weightClass.fighters,
  )
  @JoinColumn({ name: 'weight_class_id' })
  weight_class: WeightClass;

  @Field(() => [Fight], { nullable: true })
  @OneToMany(() => Fight, (fight: Fight) => fight.fighter_red)
  red_corner_fights: Fight[];

  @Field(() => [Fight], { nullable: true })
  @OneToMany(() => Fight, (fight: Fight) => fight.fighter_blue)
  blue_corner_fights: Fight[];

  @Field(() => [Fight], { nullable: true })
  @OneToMany(() => Fight, (fight: Fight) => fight.winner)
  wins: Fight[];

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
