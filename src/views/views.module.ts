import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { View } from 'typeorm';
@Module({
  providers: [ViewsService],
  imports: [TypeOrmModule.forFeature([View])],
  exports: [ViewsService],
})
export class ViewsModule {}
