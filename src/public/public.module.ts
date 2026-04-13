import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { TodoModule } from '../todo/todo.module';

@Module({
  imports: [TodoModule],
  controllers: [PublicController],
})
export class PublicModule {}
