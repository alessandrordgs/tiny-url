import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';

describe('UrlsController', () => {
  let controller: UrlsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});