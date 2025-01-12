import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Headers,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ViewsService } from '../views/views.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

@Controller('')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly ViewsService: ViewsService,
    private readonly AuthService: AuthService,
  ) {}

  @Post('create-url')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token',
    required: false,
  })
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @Headers('authorization') token?: string,
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
  @ApiBearerAuth()
  @Get('urls/list')
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('urls/:id')
  async remove(@Param('id') id: string) {
    await this.urlsService.remove(id);
    return 'Url deleted successfully';
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('urls/:code')
  async update(@Param('code') code: string, @Body() body: any) {
    const url = await this.urlsService.update(code, body);
    return {
      message: 'Url updated successfully',
      url: `${process.env.APP_URL}/${url.reference_code}`,
    };
  }
}
