import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { ViewsModule } from 'src/views/views.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UrlsController],
  providers: [UrlsService],
  imports: [TypeOrmModule.forFeature([Url]), ViewsModule, AuthModule],
})
export class UrlsModule {}
