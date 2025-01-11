import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { ViewsModule } from 'src/views/views.module';

@Module({
  controllers: [UrlsController],
  providers: [UrlsService],
  imports: [TypeOrmModule.forFeature([Url]), ViewsModule],
})
export class UrlsModule {}
