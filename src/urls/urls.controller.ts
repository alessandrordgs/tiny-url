import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ViewsService } from '../views/views.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly ViewsService: ViewsService,
    private readonly AuthService: AuthService,
  ) {}

  @Post('create-url')
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @Headers('authorization') token: string,
  ) {
    if (token) {
      const user = await this.AuthService.getUserFromAuthenticationToken(
        token.replace('Bearer ', ''),
      );
      createUrlDto.user_id = user.id;
    }
    const newUrl = await this.urlsService.create(createUrlDto);
    return {
      message: 'Url created successfully',
      url: `${process.env.APP_URL}/${newUrl.reference_code}`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async findAll(@Headers('authorization') token: string) {
    if (token) {
      const user = await this.AuthService.getUserFromAuthenticationToken(
        token.replace('Bearer ', ''),
      );
      const url = await this.urlsService.findAll(user.id);
      return url;
    }
  }

  @Get(':code')
  @Redirect()
  async findOne(@Param('code') code: string) {
    const url = await this.urlsService.findOne(code);
    await this.ViewsService.create({ url_id: url.id });
    return { url: url.original_url };
  }
}
