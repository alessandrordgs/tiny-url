import { Injectable } from '@nestjs/common';
import { CreateViewDto } from './dto/create-view.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { View } from './entities/view.entity';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private viewRepository: Repository<View>,
  ) {}
  async create(createViewDto: CreateViewDto) {
    return await this.viewRepository.save({ ...createViewDto });
  }

  findAll() {
    return `This action returns all views`;
  }
}
