import { Controller, Get, Post, Body, Param, Redirect } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller('')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
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
    return { url: url.original_url };
  }
}
