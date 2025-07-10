import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Fighter } from './fighter/fighter.entity';
import { WeightClass } from './weight-class/weight-class.entity';
import { Event } from './event/event.entity';
import { Fight } from './fight/fight.entity';
import { Ranking } from './ranking/ranking.entity';
import { FighterModule } from './fighter/fighter.module';
import { WeightClassModule } from './weight-class/weight-class.module';
import { EventModule } from './event/event.module';
import { FightModule } from './fight/fight.module';
import { RankingModule } from './ranking/ranking.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ensureDatabaseExists } from './common/utils/ensure-database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await ensureDatabaseExists();
        return {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASS || 'postgres',
          database: process.env.DB_NAME || 'mma-platform',
          entities: [Fighter, WeightClass, Event, Fight, Ranking],
          synchronize: true, // Set to false in production
          autoLoadEntities: true,
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: true,
      debug: true,
    }),
    FighterModule,
    WeightClassModule,
    EventModule,
    FightModule,
    RankingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
