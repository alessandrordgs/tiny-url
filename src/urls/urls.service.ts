import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import Code from './utils/code';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}
  async create(createUrlDto: CreateUrlDto) {
    let reference_code: string;
    let hasRegistry: unknown | null;
    do {
      reference_code = Code.generate();
      hasRegistry = await this.urlRepository.findOneBy({ reference_code });
    } while (hasRegistry);

    try {
      return await this.urlRepository.save({ ...createUrlDto, reference_code });
    } catch (error) {
      throw error;
    }
  }

  async findAll(user_id: string) {
    const urls = this.urlRepository
      .createQueryBuilder('url')
      .loadRelationCountAndMap('url.viewsCount', 'url.views')
      .where('url.user_id = :user_id', { user_id })
      .getMany();
    return urls;
  }

  async findOne(id: string) {
    const url = await this.urlRepository.findOne({
      where: {
        reference_code: id,
      },
    });
    return {
      original_url: url.original_url,
      id: url.id,
    };
  }

  async update(id: string, UpdateUrlDto: UpdateUrlDto) {
    const url = await this.urlRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!url) {
      throw new NotFoundException('Url not found');
    }
    return await this.urlRepository.save({
      ...url,
      ...UpdateUrlDto,
    });
  }
  async remove(id: string) {
    const url = await this.urlRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!url) {
      throw new NotFoundException('Url not found');
    }
    return await this.urlRepository.softDelete(url.id);
  }
}
