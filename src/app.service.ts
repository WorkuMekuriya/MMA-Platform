import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Backend for mixed martial arts (MMA) Platform!';
  }
}
