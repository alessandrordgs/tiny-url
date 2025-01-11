import { Controller, Get, Post, Body, Param, Redirect } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ViewsService } from '../views/views.service';

@Controller('')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly ViewsService: ViewsService,
  ) {}

  @Post('create-url')
  async create(@Body() createUrlDto: CreateUrlDto) {
    const newUrl = await this.urlsService.create(createUrlDto);
    return {
      message: 'Url created successfully',
      url: `${process.env.APP_URL}/${newUrl.reference_code}`,
    };
  }

  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @Get(':code')
  @Redirect()
  async findOne(@Param('code') code: string) {
    const url = await this.urlsService.findOne(code);
    await this.ViewsService.create({ url_id: url.id });
    return { url: url.original_url };
  }
}
