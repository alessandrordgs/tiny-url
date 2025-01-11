import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import Code from './utils/code';

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

  findAll() {
    return `This action returns all urls`;
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
}
